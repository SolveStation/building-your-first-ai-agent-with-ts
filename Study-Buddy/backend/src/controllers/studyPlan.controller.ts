import { Request, Response } from 'express';
import { db, studyPlans, resources } from '../db';
import { eq, and } from 'drizzle-orm';
import { logger } from '../utils/logger';
import { UploadedFile } from '../types/api.types';
import { executeStudyPlanWorkflow } from '../agents/graph';
import { websocketService } from '../services/websocket.service';
import { AppError } from '../middleware/errorHandler';

/**
 * Study Plan Controller
 * Handles study plan creation and management
 */

/**
 * Create a new study plan with uploaded materials
 */
export async function createStudyPlan(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { topic, difficulty, duration } = req.body;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new AppError('At least one file must be uploaded', 400);
  }

  logger.info(`Creating study plan for user ${req.user.id}: ${topic}`);

  // Create study plan record
  const [studyPlan] = await db
    .insert(studyPlans)
    .values({
      userId: req.user.id,
      topic,
      difficulty,
      duration,
      status: 'processing',
    })
    .returning();

  // Save uploaded files metadata
  for (const file of files) {
    await db.insert(resources).values({
      studyPlanId: studyPlan.id,
      type: 'original',
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
    });
  }

  logger.info(`Study plan created: ${studyPlan.id}`);

  // Start agent workflow asynchronously
  executeWorkflowAsync(studyPlan.id, req.user.id, topic, difficulty, duration, files);

  res.status(201).json({
    message: 'Study plan created successfully. Processing materials...',
    studyPlan: {
      id: studyPlan.id,
      topic: studyPlan.topic,
      difficulty: studyPlan.difficulty,
      duration: studyPlan.duration,
      status: studyPlan.status,
      createdAt: studyPlan.createdAt,
    },
  });
}

/**
 * Execute agent workflow asynchronously
 */
async function executeWorkflowAsync(
  studyPlanId: string,
  userId: string,
  topic: string,
  difficulty: string,
  duration: number,
  files: Express.Multer.File[]
) {
  try {
    logger.info(`Starting workflow for study plan: ${studyPlanId}`);

    // Emit workflow started event
    websocketService.emitWorkflowProgress(userId, studyPlanId, {
      step: 'workflow',
      status: 'started',
      message: 'Study plan workflow started',
      progress: 0,
    });

    // Prepare materials for agents
    const materials: UploadedFile[] = files.map((file) => ({
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size,
    }));

    // Emit research agent started
    websocketService.emitWorkflowProgress(userId, studyPlanId, {
      step: 'research',
      status: 'started',
      message: 'Extracting and simplifying content...',
      progress: 10,
    });

    // Execute workflow
    const result = await executeStudyPlanWorkflow({
      userId,
      studyPlanId,
      materials,
      topic,
      difficulty: difficulty as any,
      duration,
    });

    // Update study plan with results
    await db
      .update(studyPlans)
      .set({
        status: result.errors && result.errors.length > 0 ? 'failed' : 'completed',
        driveFolderId: result.driveFolderId,
        driveFolderUrl: result.driveFolderUrl,
        updatedAt: new Date(),
      })
      .where(eq(studyPlans.id, studyPlanId));

    // Save simplified content as resource
    if (result.simplifiedContent) {
      await db.insert(resources).values({
        studyPlanId,
        type: 'simplified',
        fileName: `${topic} - Simplified.md`,
        filePath: null,
        driveFileId: result.driveFileId,
        driveFileUrl: result.driveFileUrl,
      });
    }

    // Save calendar events
    if (result.calendarEvents) {
      const { calendarEvents: calendarEventsTable } = await import('../db');
      for (const event of result.calendarEvents) {
        if (event.eventId) {
          await db.insert(calendarEventsTable).values({
            studyPlanId,
            eventId: event.eventId,
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
          });
        }
      }
    }

    logger.info(`Workflow completed for study plan: ${studyPlanId}`);
  } catch (error: any) {
    logger.error(`Workflow failed for study plan ${studyPlanId}:`, error);

    // Update status to failed
    await db
      .update(studyPlans)
      .set({
        status: 'failed',
        updatedAt: new Date(),
      })
      .where(eq(studyPlans.id, studyPlanId));
  }
}

/**
 * Get study plan by ID
 */
export async function getStudyPlan(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  const studyPlan = await db.query.studyPlans.findFirst({
    where: and(eq(studyPlans.id, id), eq(studyPlans.userId, req.user.id)),
    with: {
      resources: true,
      calendarEvents: true,
    },
  });

  if (!studyPlan) {
    throw new AppError('Study plan not found', 404);
  }

  res.json({
    studyPlan,
  });
}

/**
 * Get all study plans for current user
 */
export async function getAllStudyPlans(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const userStudyPlans = await db.query.studyPlans.findMany({
    where: eq(studyPlans.userId, req.user.id),
    with: {
      resources: true,
    },
    orderBy: (studyPlans, { desc }) => [desc(studyPlans.createdAt)],
  });

  res.json({
    studyPlans: userStudyPlans,
    total: userStudyPlans.length,
  });
}

/**
 * Delete study plan
 */
export async function deleteStudyPlan(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  const studyPlan = await db.query.studyPlans.findFirst({
    where: and(eq(studyPlans.id, id), eq(studyPlans.userId, req.user.id)),
  });

  if (!studyPlan) {
    throw new AppError('Study plan not found', 404);
  }

  // Delete study plan (cascade will handle related records)
  await db.delete(studyPlans).where(eq(studyPlans.id, id));

  logger.info(`Study plan deleted: ${id}`);

  res.json({
    message: 'Study plan deleted successfully',
  });
}
