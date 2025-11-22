import { Router, Request, Response, NextFunction } from 'express';
import * as studyPlanController from '../controllers/studyPlan.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validateRequest';
import { createStudyPlanSchema } from '../utils/validators';
import { authenticateToken } from '../middleware/auth';
import { uploadMultiple } from '../services/storage.service';
import { validateFileUploads } from '../utils/validators';

const router: Router = Router();

/**
 * Study Plan Routes
 */

// @route   POST /api/study-plan
// @desc    Create a new study plan with uploaded materials
// @access  Private
router.post(
  '/',
  authenticateToken,
  uploadMultiple('materials', 10),
  (req: Request, res: Response, next: NextFunction): any => {
    // Validate uploaded files
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const validation = validateFileUploads(files);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'File validation failed',
          details: validation.errors,
        });
      }
    }
    next();
  },
  validateBody(createStudyPlanSchema),
  asyncHandler(studyPlanController.createStudyPlan)
);

// @route   GET /api/study-plan
// @desc    Get all study plans for current user
// @access  Private
router.get('/', authenticateToken, asyncHandler(studyPlanController.getAllStudyPlans));

// @route   GET /api/study-plan/:id
// @desc    Get a specific study plan
// @access  Private
router.get('/:id', authenticateToken, asyncHandler(studyPlanController.getStudyPlan));

// @route   DELETE /api/study-plan/:id
// @desc    Delete a study plan
// @access  Private
router.delete('/:id', authenticateToken, asyncHandler(studyPlanController.deleteStudyPlan));

export default router;
