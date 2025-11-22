import { TextChunk, ChunkConfig } from '../types/agent.types';
import { logger } from './logger';

/**
 * Default chunking configuration
 */
const DEFAULT_CONFIG: ChunkConfig = {
  maxTokens: parseInt(process.env.MAX_TOKENS_PER_CHUNK || '25000'),
  overlapTokens: parseInt(process.env.OVERLAP_TOKENS || '500'),
  estimatedCharsPerToken: parseInt(process.env.ESTIMATED_CHARS_PER_TOKEN || '4'),
};

/**
 * Chunks large text into overlapping segments to handle token limits
 * Overlap ensures context preservation between chunks
 * 
 * @param text - The text to chunk
 * @param config - Chunking configuration
 * @returns Array of text chunks with metadata
 */
export function chunkText(
  text: string,
  config: ChunkConfig = DEFAULT_CONFIG
): TextChunk[] {
  const maxChars = config.maxTokens * config.estimatedCharsPerToken;
  const overlapChars = config.overlapTokens * config.estimatedCharsPerToken;

  logger.debug(`Chunking text of length ${text.length} with maxChars=${maxChars}, overlap=${overlapChars}`);

  const chunks: TextChunk[] = [];
  let startPos = 0;
  let chunkIndex = 0;

  while (startPos < text.length) {
    const endPos = Math.min(startPos + maxChars, text.length);

    // Try to break at sentence boundary for better context
    let actualEndPos = endPos;
    if (endPos < text.length) {
      // Look for sentence endings: period, exclamation, question mark
      const sentenceEnd = findSentenceBoundary(text, startPos, endPos);
      if (sentenceEnd > startPos + maxChars * 0.8) {
        actualEndPos = sentenceEnd;
      }
    }

    chunks.push({
      content: text.substring(startPos, actualEndPos).trim(),
      chunkIndex,
      totalChunks: 0, // Will update after all chunks are created
      startPosition: startPos,
      endPosition: actualEndPos,
    });

    // Move start position with overlap
    startPos = actualEndPos - overlapChars;
    
    // Ensure we don't go backwards
    if (startPos <= chunks[chunkIndex].startPosition && chunkIndex > 0) {
      startPos = actualEndPos;
    }
    
    chunkIndex++;
  }

  // Update total chunks count
  chunks.forEach((chunk) => (chunk.totalChunks = chunks.length));

  logger.info(`Text chunked into ${chunks.length} segments`);

  return chunks;
}

/**
 * Finds the nearest sentence boundary before the target position
 */
function findSentenceBoundary(text: string, start: number, target: number): number {
  const searchText = text.substring(start, target);
  const sentenceEndings = ['. ', '.\n', '! ', '!\n', '? ', '?\n'];

  let lastBoundary = target;

  for (const ending of sentenceEndings) {
    const pos = searchText.lastIndexOf(ending);
    if (pos !== -1) {
      const absolutePos = start + pos + ending.length;
      if (absolutePos > lastBoundary || lastBoundary === target) {
        lastBoundary = absolutePos;
      }
    }
  }

  return lastBoundary;
}

/**
 * Process chunks sequentially with a processing function
 * 
 * @param chunks - Array of text chunks
 * @param processFn - Async function to process each chunk
 * @returns Merged result from all chunks
 */
export async function processChunkedText(
  chunks: TextChunk[],
  processFn: (chunk: string, index: number, total: number) => Promise<string>
): Promise<string> {
  logger.info(`Processing ${chunks.length} chunks sequentially`);

  const results: string[] = [];

  for (const chunk of chunks) {
    try {
      logger.debug(`Processing chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks}`);
      
      const result = await processFn(
        chunk.content,
        chunk.chunkIndex,
        chunk.totalChunks
      );
      
      results.push(result);
    } catch (error) {
      logger.error(`Error processing chunk ${chunk.chunkIndex}:`, error);
      throw error;
    }
  }

  // Merge results
  return mergeChunkResults(results);
}

/**
 * Merges processed chunk results into a single document
 * Uses section separators to maintain structure
 */
function mergeChunkResults(results: string[]): string {
  if (results.length === 1) {
    return results[0];
  }

  // Join with section separator
  return results.join('\n\n---\n\n');
}

/**
 * Estimates token count for a given text
 */
export function estimateTokenCount(text: string, charsPerToken: number = 4): number {
  return Math.ceil(text.length / charsPerToken);
}

/**
 * Checks if text needs chunking based on token limit
 */
export function needsChunking(text: string, maxTokens: number = 25000): boolean {
  const estimatedTokens = estimateTokenCount(text);
  return estimatedTokens > maxTokens;
}
