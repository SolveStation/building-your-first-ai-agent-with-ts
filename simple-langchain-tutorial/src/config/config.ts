/**
 * Configuration constants for the LangChain application
 */
export const CONFIG = {
  /** Google Gemini model to use */
  MODEL_NAME: 'gemini-2.0-flash',

  /** Temperature for LLM responses (0.0 = deterministic, 1.0 = creative) */
  TEMPERATURE: 0.7,

  /** Maximum tokens to generate in responses */
  MAX_TOKENS: 1000,
} as const;

/**
 * Environment variables validation
 * Throws error if required environment variables are missing
 */
export function validateEnvironment(): void {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY environment variable is required');
  }
}
