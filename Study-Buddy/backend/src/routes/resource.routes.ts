import { Request, Response, Router } from 'express';
import * as resourceController from '../controllers/resource.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { validateQuery } from '../middleware/validateRequest';
import { resourceQuerySchema } from '../utils/validators';
import { authenticateToken } from '../middleware/auth';

const router:Router = Router();

/**
 * Resource Routes
 */

// @route   GET /api/resources
// @desc    Get resources (by study plan or all user resources)
// @access  Private
router.get(
  '/',
  authenticateToken,
  validateQuery(resourceQuerySchema),
  asyncHandler((req: Request, res: Response<any, Record<string, any>>) => {
    if (req.query.studyPlanId) {
      return resourceController.getResourcesByStudyPlan(req, res);
    }
    return resourceController.getAllUserResources(req, res);
  })
);

// @route   GET /api/resources/:id
// @desc    Get a specific resource
// @access  Private
router.get('/:id', authenticateToken, asyncHandler(resourceController.getResourceById));

// @route   DELETE /api/resources/:id
// @desc    Delete a resource
// @access  Private
router.delete('/:id', authenticateToken, asyncHandler(resourceController.deleteResource));

export default router;
