import { Router } from 'express';
import authRoutes from './auth.routes';
import studyPlanRoutes from './studyPlan.routes';
import agentRoutes from './agent.routes';
import resourceRoutes from './resource.routes';

const router:Router = Router();

/**
 * API Routes Index
 * Aggregates all route modules
 */

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'StudyBuddy Backend',
    version: '1.0.0',
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/study-plan', studyPlanRoutes);
router.use('/agent', agentRoutes);
router.use('/resources', resourceRoutes);

export default router;
