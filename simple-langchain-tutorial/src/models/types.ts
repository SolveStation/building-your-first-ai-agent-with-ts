/**
 * Type definitions for the LangChain application
 */

/**
 * Represents a conversation message
 */
export interface Message {
  /** The role of the message sender */
  role: 'user' | 'assistant';

  /** The content of the message */
  content: string;

  /** Timestamp when the message was created */
  timestamp: Date;
}

/**
 * Represents the state of a conversation
 */
export interface ConversationState {
  /** Array of messages in the conversation */
  messages: Message[];

  /** Whether the conversation is active */
  isActive: boolean;

  /** Current topic or context */
  context?: string;
}

/**
 * Configuration for LLM chain execution
 */
export interface ChainConfig {
  /** Temperature for response generation */
  temperature?: number;

  /** Maximum tokens to generate */
  maxTokens?: number;

  /** Whether to stream the response */
  streaming?: boolean;
}
