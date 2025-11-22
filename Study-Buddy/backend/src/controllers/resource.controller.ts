import { Request, Response } from 'express';
import { db, resources, studyPlans } from '../db';
import { eq, and } from 'drizzle-orm';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

/**
 * Resource Controller
 * Handles resource retrieval and management
 */

/**
 * Get all resources for a study plan
 */
export async function getResourcesByStudyPlan(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { studyPlanId } = req.query;

  if (!studyPlanId || typeof studyPlanId !== 'string') {
    throw new AppError('Study plan ID is required', 400);
  }

  // Verify study plan belongs to user
  const studyPlan = await db.query.studyPlans.findFirst({
    where: and(eq(studyPlans.id, studyPlanId), eq(studyPlans.userId, req.user.id)),
  });

  if (!studyPlan) {
    throw new AppError('Study plan not found', 404);
  }

  // Get all resources
  const studyPlanResources = await db.query.resources.findMany({
    where: eq(resources.studyPlanId, studyPlanId),
    orderBy: (resources, { desc }) => [desc(resources.createdAt)],
  });

  res.json({
    resources: studyPlanResources,
    total: studyPlanResources.length,
  });
}

/**
 * Get a specific resource by ID
 */
export async function getResourceById(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  const resource = await db.query.resources.findFirst({
    where: eq(resources.id, id),
    with: {
      studyPlan: true,
    },
  });

  if (!resource) {
    throw new AppError('Resource not found', 404);
  }

  // Verify resource belongs to user's study plan
  if (resource.studyPlan.userId !== req.user.id) {
    throw new AppError('Access denied', 403);
  }

  res.json({
    resource,
  });
}

/**
 * Get all resources for current user (across all study plans)
 */
export async function getAllUserResources(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Get all user's study plans
  const userStudyPlans = await db.query.studyPlans.findMany({
    where: eq(studyPlans.userId, req.user.id),
    with: {
      resources: true,
    },
  });

  // Flatten resources
  const allResources = userStudyPlans.flatMap((plan) => 
    plan.resources.map((resource) => ({
      ...resource,
      studyPlanTopic: plan.topic,
    }))
  );

  res.json({
    resources: allResources,
    total: allResources.length,
  });
}

/**
 * Delete a resource
 */
export async function deleteResource(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  const resource = await db.query.resources.findFirst({
    where: eq(resources.id, id),
    with: {
      studyPlan: true,
    },
  });

  if (!resource) {
    throw new AppError('Resource not found', 404);
  }

  // Verify resource belongs to user's study plan
  if (resource.studyPlan.userId !== req.user.id) {
    throw new AppError('Access denied', 403);
  }

  // Delete resource
  await db.delete(resources).where(eq(resources.id, id));

  logger.info(`Resource deleted: ${id}`);

  res.json({
    message: 'Resource deleted successfully',
  });
}
