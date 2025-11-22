#!/usr/bin/env node

import 'dotenv/config';
import { LangChainService } from './services/langchainService';
import { validateEnvironment } from './config/config';
import { Logger } from './utils/logger';

/**
 * Main entry point for the Simple LangChain Application
 * Demonstrates basic LangChain concepts including chains, prompts, and conversation management
 */
async function main(): Promise<void> {
  try {
    Logger.info('Starting Simple LangChain Application');

    // Validate environment variables
    validateEnvironment();

    // Initialize the LangChain service
    const langChainService = new LangChainService();

    // Example 1: Simple chain execution
    console.log('\n=== Example 1: Simple Chain Execution ===');
    const question1 = 'What is TypeScript and why should developers use it?';
    const response1 = await langChainService.executeSimpleChain(question1);
    console.log(`Question: ${question1}`);
    console.log(`Response: ${response1}`);

    // Example 2: Conversation with context
    console.log('\n=== Example 2: Conversation with Context ===');
    const question2 = 'Can you give me a practical example of using it?';
    const response2 = await langChainService.executeSimpleChain(question2);
    console.log(`Question: ${question2}`);
    console.log(`Response: ${response2}`);

    // Example 3: Streaming (simplified for demo)
    console.log('\n=== Example 3: Streaming Response ===');
    const question3 = 'What are the main benefits of static typing?';
    const response3 = await langChainService.executeStreamingChain(question3);
    console.log(`Question: ${question3}`);
    console.log(`Response: ${response3}`);

    // Display conversation state
    console.log('\n=== Conversation History ===');
    const state = langChainService.getConversationState();
    state.messages.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg.role}: ${msg.content.substring(0, 100)}...`);
    });

    Logger.info('Application completed successfully');
  } catch (error) {
    Logger.error('Application failed', error as Error);
    process.exit(1);
  }
}

// Run the application
if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main };
