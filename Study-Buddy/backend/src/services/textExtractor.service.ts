import fs from 'fs/promises';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { logger } from '../utils/logger';
import { UploadedFile } from '../types/api.types';

/**
 * Text Extraction Service
 * Extracts text content from various file formats (PDF, DOCX, TXT)
 * Note: Images are not processed in this phase
 */
class TextExtractorService {
  /**
   * Extract text from a single file based on its MIME type
   */
  async extractFromFile(filePath: string, mimeType: string): Promise<string> {
    logger.debug(`Extracting text from ${filePath} (${mimeType})`);

    try {
      switch (mimeType) {
        case 'application/pdf':
          return await this.extractFromPDF(filePath);

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return await this.extractFromDOCX(filePath);

        case 'text/plain':
          return await this.extractFromTXT(filePath);

        default:
          throw new Error(`Unsupported file type: ${mimeType}`);
      }
    } catch (error: any) {
      logger.error(`Error extracting text from ${filePath}:`, error);
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF file (text only, no images)
   */
  private async extractFromPDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      
      // Suppress pdf-parse warnings by temporarily overriding console.warn
      const originalWarn = console.warn;
      console.warn = () => {};
      
      const data = await pdf(dataBuffer);
      
      // Restore console.warn
      console.warn = originalWarn;

      logger.debug(`Extracted ${data.text.length} characters from PDF`);

      if (!data.text || data.text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains only images');
      }

      return data.text;
    } catch (error: any) {
      logger.error('PDF extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  /**
   * Extract text from DOCX file
   */
  private async extractFromDOCX(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });

      logger.debug(`Extracted ${result.value.length} characters from DOCX`);

      if (!result.value || result.value.trim().length === 0) {
        throw new Error('DOCX file appears to be empty');
      }

      // Log any warnings from mammoth
      if (result.messages.length > 0) {
        result.messages.forEach((msg) => {
          logger.warn(`Mammoth warning: ${msg.message}`);
        });
      }

      return result.value;
    } catch (error: any) {
      logger.error('DOCX extraction error:', error);
      throw new Error(`Failed to extract text from DOCX: ${error.message}`);
    }
  }

  /**
   * Extract text from plain text file
   */
  private async extractFromTXT(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');

      logger.debug(`Read ${content.length} characters from TXT file`);

      if (!content || content.trim().length === 0) {
        throw new Error('Text file is empty');
      }

      return content;
    } catch (error: any) {
      logger.error('TXT extraction error:', error);
      throw new Error(`Failed to read text file: ${error.message}`);
    }
  }

  /**
   * Extract text from multiple uploaded files
   * Combines all text with document separators
   */
  async extractFromFiles(files: UploadedFile[]): Promise<string> {
    if (!files || files.length === 0) {
      throw new Error('No files provided for text extraction');
    }

    logger.info(`Extracting text from ${files.length} file(s)`);

    const textPromises = files.map(async (file) => {
      try {
        const text = await this.extractFromFile(file.path, file.mimetype);
        return {
          fileName: file.originalname,
          text,
          success: true,
        };
      } catch (error: any) {
        logger.error(`Failed to extract from ${file.originalname}:`, error);
        return {
          fileName: file.originalname,
          text: '',
          success: false,
          error: error.message,
        };
      }
    });

    const results = await Promise.all(textPromises);

    // Filter successful extractions
    const successfulExtractions = results.filter((r) => r.success);

    if (successfulExtractions.length === 0) {
      throw new Error('Failed to extract text from any of the uploaded files');
    }

    // Log any failures
    const failures = results.filter((r) => !r.success);
    if (failures.length > 0) {
      logger.warn(
        `Failed to extract from ${failures.length} file(s): ${failures.map((f) => f.fileName).join(', ')}`
      );
    }

    // Combine all extracted text with document separators
    const combinedText = successfulExtractions
      .map((result) => {
        return `=== DOCUMENT: ${result.fileName} ===\n\n${result.text}`;
      })
      .join('\n\n=== END OF DOCUMENT ===\n\n');

    logger.info(
      `Successfully extracted ${combinedText.length} total characters from ${successfulExtractions.length} file(s)`
    );

    return combinedText;
  }

  /**
   * Validate that file contains extractable text
   */
  async validateFile(filePath: string, mimeType: string): Promise<boolean> {
    try {
      const text = await this.extractFromFile(filePath, mimeType);
      return text.trim().length > 0;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const textExtractorService = new TextExtractorService();
