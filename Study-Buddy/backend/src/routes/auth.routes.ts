import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validateRequest';
import { signupSchema, loginSchema } from '../utils/validators';
import { authenticateToken } from '../middleware/auth';

const router:Router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Create a new user account with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: securepassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists
 */
router.post('/signup', validateBody(signupSchema), asyncHandler(authController.signup));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateBody(loginSchema), asyncHandler(authController.login));

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', asyncHandler(authController.refreshToken));

// @route   GET /api/auth/google
// @desc    Get Google OAuth authorization URL
// @access  Private
router.get('/google', authenticateToken, asyncHandler(authController.googleAuth));

// @route   GET /api/auth/google/callback
// @desc    Handle Google OAuth callback
// @access  Private
router.get('/google/callback', authenticateToken, asyncHandler(authController.googleCallback));

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', authenticateToken, asyncHandler(authController.getCurrentUser));

export default router;
