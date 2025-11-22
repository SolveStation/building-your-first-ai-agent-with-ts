import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';
import { CONFIG } from '../config/config';
import { Logger } from '../utils/logger';
import { ConversationState, ChainConfig } from '../models/types';

/**
 * Service class for LangChain operations
 * Demonstrates basic prompt templates, chains, and LLM interaction
 */
export class LangChainService {
  // Use a broad type for the LLM instance to satisfy LLMChain's expected type shape
  private llm: any;
  private conversationState: ConversationState;

  constructor() {
    // Initialize the Google Gemini LLM
    this.llm = new ChatGoogleGenerativeAI({
      modelName: CONFIG.MODEL_NAME,
      temperature: CONFIG.TEMPERATURE,
      maxOutputTokens: CONFIG.MAX_TOKENS,
    });

    // Initialize conversation state
    this.conversationState = {
      messages: [],
      isActive: true,
    };

    Logger.info('LangChain service initialized');
  }

  /**
   * Creates a prompt template for general questions
   * Demonstrates PromptTemplate usage
   */
  private createPromptTemplate(): PromptTemplate {
    const template = `You are a helpful AI assistant. Answer the following question clearly and concisely.

Previous conversation context:
{context}

Current question: {question}

Answer:`;

    return PromptTemplate.fromTemplate(template);
  }

  /**
   * Executes a simple LLM chain with the given input
   * Demonstrates LLMChain usage and basic LangChain Expression Language concepts
   *
   * @param question - The user's question
   * @param config - Optional configuration for the chain
   * @returns Promise resolving to the LLM's response
   *
   * @example
   * ```typescript
   * const service = new LangChainService();
   * const response = await service.executeSimpleChain("What is TypeScript?");
   * console.log(response);
   * ```
   */
  async executeSimpleChain(question: string, config: ChainConfig = {}): Promise<string> {
    try {
      Logger.info('Executing simple chain', { question });

      // Create prompt template
      const prompt = this.createPromptTemplate();

      // Build context from conversation history
      const context = this.buildConversationContext();

      // Create the chain
      const chain = new LLMChain({
        llm: this.llm,
        prompt,
      });

      // Execute the chain
      const result = await chain.call({
        question,
        context,
        ...config,
      });

      // Extract the response
      const response = result.text || result.output;

      // Update conversation state
      this.updateConversationState(question, response);

      Logger.info('Chain execution completed', { responseLength: response.length });
      return response;
    } catch (error) {
      Logger.error('Failed to execute simple chain', error as Error, { question });
      throw new Error(`Chain execution failed: ${(error as Error).message}`);
    }
  }

  /**
   * Executes a chain with streaming response
   * Demonstrates streaming capabilities
   *
   * @param question - The user's question
   * @returns Promise resolving to the streamed response
   */
  async executeStreamingChain(question: string): Promise<string> {
    try {
      Logger.info('Executing streaming chain', { question });

      // For streaming, we'd typically use a different approach
      // This is simplified for demonstration
      const response = await this.executeSimpleChain(question, { streaming: true });

      return response;
    } catch (error) {
      Logger.error('Failed to execute streaming chain', error as Error);
      throw error;
    }
  }

  /**
   * Builds conversation context from message history
   * @returns Formatted context string
   */
  private buildConversationContext(): string {
    if (this.conversationState.messages.length === 0) {
      return 'No previous conversation.';
    }

    // Get last 5 messages for context
    const recentMessages = this.conversationState.messages.slice(-5);
    return recentMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
  }

  /**
   * Updates the conversation state with new messages
   */
  private updateConversationState(question: string, response: string): void {
    this.conversationState.messages.push(
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
      },
      {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
    );

    // Keep only last 10 messages to prevent memory bloat
    if (this.conversationState.messages.length > 10) {
      this.conversationState.messages = this.conversationState.messages.slice(-10);
    }
  }

  /**
   * Clears the conversation history
   */
  clearConversation(): void {
    this.conversationState.messages = [];
    Logger.info('Conversation history cleared');
  }

  /**
   * Gets the current conversation state
   */
  getConversationState(): ConversationState {
    return { ...this.conversationState };
  }
}
