import { AgentState } from '../state';
import { textExtractorService } from '../../services/textExtractor.service';
import { geminiService } from '../../services/gemini.service';
import { chunkText, processChunkedText, needsChunking } from '../../utils/chunking';
import { logger } from '../../utils/logger';

/**
 * Research Agent Node
 * Extracts text from uploaded materials and simplifies content using Gemini
 */
export async function researchAgentNode(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`[Research Agent] Starting for study plan: ${state.studyPlanId}`);

  try {
    // Step 1: Extract text from uploaded files
    logger.debug('[Research Agent] Extracting text from materials');
    const extractedText = await textExtractorService.extractFromFiles(state.materials);

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from uploaded materials');
    }

    logger.info(`[Research Agent] Extracted ${extractedText.length} characters`);

    // Step 2: Check if chunking is needed
    const requiresChunking = needsChunking(extractedText);

    let simplifiedContent: string;

    if (requiresChunking) {
      logger.info('[Research Agent] Text requires chunking');

      // Chunk the text
      const chunks = chunkText(extractedText);
      logger.info(`[Research Agent] Split into ${chunks.length} chunks`);

      // Process each chunk with Gemini
      simplifiedContent = await processChunkedText(chunks, async (chunkContent, index, total) => {
        logger.debug(`[Research Agent] Processing chunk ${index + 1}/${total}`);

        return await geminiService.simplifyContent(
          chunkContent,
          state.topic,
          state.difficulty,
          { index, total }
        );
      });
    } else {
      logger.info('[Research Agent] Processing without chunking');

      // Process entire text at once
      simplifiedContent = await geminiService.simplifyContent(
        extractedText,
        state.topic,
        state.difficulty
      );
    }

    logger.info(`[Research Agent] Generated ${simplifiedContent.length} characters of simplified content`);

    return {
      extractedText,
      simplifiedContent,
      researchSummary: `Successfully processed ${state.materials.length} file(s) and generated study guide`,
      currentStep: 'research_complete',
    };
  } catch (error: any) {
    logger.error('[Research Agent] Error:', error);

    return {
      currentStep: 'research_failed',
      errors: [...(state.errors || []), `Research Agent failed: ${error.message}`],
    };
  }
}
