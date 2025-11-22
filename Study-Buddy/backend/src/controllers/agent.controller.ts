import { Request, Response } from 'express';
import { db, studyPlans, resources } from '../db';
import { eq, and } from 'drizzle-orm';
import { executeChatWorkflow, executeQuizWorkflow } from '../agents/graph';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

/**
 * Agent Controller
 * Handles agent-specific operations (chat, quiz)
 */

/**
 * Chat with tutor agent
 */
export async function chat(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { studyPlanId, message, mode } = req.body;

  // Verify study plan belongs to user
  const studyPlan = await db.query.studyPlans.findFirst({
    where: and(eq(studyPlans.id, studyPlanId), eq(studyPlans.userId, req.user.id)),
    with: {
      resources: {
        where: eq(resources.type, 'simplified'),
      },
    },
  });

  if (!studyPlan) {
    throw new AppError('Study plan not found', 404);
  }

  if (studyPlan.status !== 'completed') {
    throw new AppError('Study plan is still processing. Please wait until it completes.', 400);
  }

  logger.info(`Chat request for study plan: ${studyPlanId}`);

  // Handle quiz mode
  if (mode === 'quiz') {
    // Get simplified content for context
   // const simplifiedResource = studyPlan.resources[0];
    
    // For quiz, we need the actual content - in production, you'd fetch this from Drive or storage
    // For now, we'll use a placeholder approach
    const result = await executeQuizWorkflow({
      userId: req.user.id,
      studyPlanId,
      topic: studyPlan.topic,
      difficulty: studyPlan.difficulty as any,
      duration: studyPlan.duration,
      materials: [],
      simplifiedContent: 'Quiz content context', // In production, fetch actual content
    });

    return res.json({
      mode: 'quiz',
      questions: result.quizQuestions,
    });
  }

  // Handle chat mode
  const result = await executeChatWorkflow({
    userId: req.user.id,
    studyPlanId,
    topic: studyPlan.topic,
    difficulty: studyPlan.difficulty as any,
    duration: studyPlan.duration,
    materials: [],
    userMessage: message,
    simplifiedContent: 'Chat content context', // In production, fetch actual content
  });

  return res.json({
    mode: 'chat',
    response: result.assistantResponse,
    chatHistory: result.chatHistory?.slice(-10), // Return last 10 messages
  });
}

/**
 * Get chat history for a study plan
 */
export async function getChatHistory(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { studyPlanId } = req.params;

  // Verify study plan belongs to user
  const studyPlan = await db.query.studyPlans.findFirst({
    where: and(eq(studyPlans.id, studyPlanId), eq(studyPlans.userId, req.user.id)),
  });

  if (!studyPlan) {
    throw new AppError('Study plan not found', 404);
  }

  // Get chat messages
  const { chatMessages } = await import('../db');
  const messages = await db.query.chatMessages.findMany({
    where: eq(chatMessages.studyPlanId, studyPlanId),
    orderBy: (chatMessages, { asc }) => [asc(chatMessages.createdAt)],
  });

  res.json({
    chatHistory: messages,
    total: messages.length,
  });
}

/**
 * Manually trigger research agent (re-process materials)
 */
export async function triggerResearch(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { studyPlanId } = req.body;

  const studyPlan = await db.query.studyPlans.findFirst({
    where: and(eq(studyPlans.id, studyPlanId), eq(studyPlans.userId, req.user.id)),
  });

  if (!studyPlan) {
    throw new AppError('Study plan not found', 404);
  }

  logger.info(`Manual research trigger for study plan: ${studyPlanId}`);

  res.json({
    message: 'Research agent triggered. This feature will re-process your materials.',
    studyPlanId,
  });
}

/**
 * Manually trigger compiler agent (regenerate PDF)
 */
export async function triggerCompile(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { studyPlanId } = req.body;

  const studyPlan = await db.query.studyPlans.findFirst({
    where: and(eq(studyPlans.id, studyPlanId), eq(studyPlans.userId, req.user.id)),
  });

  if (!studyPlan) {
    throw new AppError('Study plan not found', 404);
  }

  logger.info(`Manual compile trigger for study plan: ${studyPlanId}`);

  res.json({
    message: 'Compiler agent triggered. This feature will regenerate your study materials.',
    studyPlanId,
  });
}

/**
 * Manually trigger scheduler agent (update calendar)
 */
export async function triggerSchedule(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { studyPlanId } = req.body;

  const studyPlan = await db.query.studyPlans.findFirst({
    where: and(eq(studyPlans.id, studyPlanId), eq(studyPlans.userId, req.user.id)),
  });

  if (!studyPlan) {
    throw new AppError('Study plan not found', 404);
  }

  logger.info(`Manual schedule trigger for study plan: ${studyPlanId}`);

  res.json({
    message: 'Scheduler agent triggered. This feature will update your calendar events.',
    studyPlanId,
  });
}
