import { Router } from 'express';
import * as agentController from '../controllers/agent.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validateRequest';
import {
  chatRequestSchema,
  researchAgentSchema,
  compileAgentSchema,
  scheduleAgentSchema,
} from '../utils/validators';
import { authenticateToken } from '../middleware/auth';

const router:Router = Router();

/**
 * Agent Routes
 */

// @route   POST /api/agent/chat
// @desc    Chat with tutor agent or generate quiz
// @access  Private
router.post('/chat', authenticateToken, validateBody(chatRequestSchema), asyncHandler(agentController.chat));

// @route   GET /api/agent/chat/:studyPlanId
// @desc    Get chat history for a study plan
// @access  Private
router.get('/chat/:studyPlanId', authenticateToken, asyncHandler(agentController.getChatHistory));

// @route   POST /api/agent/research
// @desc    Manually trigger research agent
// @access  Private
router.post(
  '/research',
  authenticateToken,
  validateBody(researchAgentSchema),
  asyncHandler(agentController.triggerResearch)
);

// @route   POST /api/agent/compile
// @desc    Manually trigger compiler agent
// @access  Private
router.post(
  '/compile',
  authenticateToken,
  validateBody(compileAgentSchema),
  asyncHandler(agentController.triggerCompile)
);

// @route   POST /api/agent/schedule
// @desc    Manually trigger scheduler agent
// @access  Private
router.post(
  '/schedule',
  authenticateToken,
  validateBody(scheduleAgentSchema),
  asyncHandler(agentController.triggerSchedule)
);

export default router;
