import { AgentState } from '../state';
import { geminiService } from '../../services/gemini.service';
import { db, chatMessages } from '../../db';
import { eq, desc } from 'drizzle-orm';
import { logger } from '../../utils/logger';
import { ChatMessage } from '../../types/agent.types';

/**
 * Tutor Agent Node
 * Handles chat interactions and quiz generation
 */
export async function tutorAgentNode(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`[Tutor Agent] Starting for study plan: ${state.studyPlanId}`);

  try {
    // Validate user message
    if (!state.userMessage) {
      throw new Error('No user message provided');
    }

    // Step 1: Load chat history from database (last 10 messages)
    logger.debug('[Tutor Agent] Loading chat history');
    const dbChatHistory = await db.query.chatMessages.findMany({
      where: eq(chatMessages.studyPlanId, state.studyPlanId),
      orderBy: [desc(chatMessages.createdAt)],
      limit: 10,
    });

    // Reverse to get chronological order
    const chatHistory: ChatMessage[] = dbChatHistory.reverse().map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: msg.createdAt,
    }));

    // Step 2: Get study material context (use simplified content if available)
    const studyMaterialContext = state.simplifiedContent || state.extractedText || '';

    if (!studyMaterialContext) {
      logger.warn('[Tutor Agent] No study material context available');
    }

    // Step 3: Generate response using Gemini
    logger.debug('[Tutor Agent] Generating response');
    const assistantResponse = await geminiService.tutorChat(
      state.userMessage,
      studyMaterialContext,
      chatHistory
    );

    logger.info(`[Tutor Agent] Generated response (${assistantResponse.length} chars)`);

    // Step 4: Save messages to database
    logger.debug('[Tutor Agent] Saving messages to database');
    
    // Save user message
    await db.insert(chatMessages).values({
      studyPlanId: state.studyPlanId,
      role: 'user',
      content: state.userMessage,
    });

    // Save assistant response
    await db.insert(chatMessages).values({
      studyPlanId: state.studyPlanId,
      role: 'assistant',
      content: assistantResponse,
    });

    // Update chat history
    const updatedChatHistory: ChatMessage[] = [
      ...chatHistory,
      {
        role: 'user',
        content: state.userMessage,
        timestamp: new Date(),
      },
      {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      },
    ];

    return {
      assistantResponse,
      chatHistory: updatedChatHistory,
      currentStep: 'tutor_complete',
    };
  } catch (error: any) {
    logger.error('[Tutor Agent] Error:', error);

    return {
      currentStep: 'tutor_failed',
      errors: [...(state.errors || []), `Tutor Agent failed: ${error.message}`],
    };
  }
}

/**
 * Quiz Generation Node (separate from chat)
 */
export async function quizGeneratorNode(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`[Quiz Generator] Starting for study plan: ${state.studyPlanId}`);

  try {
    // Get study material context
    const studyMaterialContext = state.simplifiedContent || state.extractedText || '';

    if (!studyMaterialContext) {
      throw new Error('No study material available to generate quiz');
    }

    // Generate quiz questions
    logger.debug('[Quiz Generator] Generating quiz questions');
    const quizQuestions = await geminiService.generateQuiz(studyMaterialContext, 5);

    logger.info(`[Quiz Generator] Generated ${quizQuestions.length} questions`);

    return {
      quizQuestions,
      currentStep: 'quiz_complete',
    };
  } catch (error: any) {
    logger.error('[Quiz Generator] Error:', error);

    return {
      currentStep: 'quiz_failed',
      errors: [...(state.errors || []), `Quiz Generator failed: ${error.message}`],
    };
  }
}
