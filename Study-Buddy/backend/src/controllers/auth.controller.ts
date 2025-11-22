import { Request, Response } from 'express';
import { db, users } from '../db';
import { eq } from 'drizzle-orm';
import { authService } from '../services/auth.service';
import { createOAuth2Client, getAuthorizationUrl, getTokensFromCode } from '../config/google-oauth';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

/**
 * Auth Controller
 * Handles user authentication and Google OAuth
 */

/**
 * User signup
 */
export async function signup(req: Request, res: Response) {
  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Hash password
  const passwordHash = await authService.hashPassword(password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
    })
    .returning();

  logger.info(`New user created: ${newUser.email}`);

  // Generate tokens
  const tokens = authService.generateTokens({
    id: newUser.id,
    email: newUser.email,
  });

  res.status(201).json({
    message: 'User created successfully',
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: newUser.id,
      email: newUser.email,
    },
  });
}

/**
 * User login
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // Find user
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isValidPassword = await authService.comparePassword(password, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  logger.info(`User logged in: ${user.email}`);

  // Generate tokens
  const tokens = authService.generateTokens({
    id: user.id,
    email: user.email,
  });

  res.json({
    message: 'Login successful',
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      email: user.email,
    },
  });
}

/**
 * Refresh access token
 */
export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  // Verify refresh token
  const decoded = authService.verifyRefreshToken(refreshToken);

  // Generate new access token
  const newAccessToken = authService.generateAccessToken({
    id: decoded.id,
    email: decoded.email,
  });

  res.json({
    accessToken: newAccessToken,
  });
}

/**
 * Initiate Google OAuth flow
 */
export async function googleAuth(_req: Request, res: Response) {
  const oauth2Client = createOAuth2Client();
  const authUrl = getAuthorizationUrl(oauth2Client);

  res.json({
    authUrl,
    message: 'Redirect user to this URL to authorize Google access',
  });
}

/**
 * Handle Google OAuth callback
 */
export async function googleCallback(req: Request, res: Response) {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    throw new AppError('Authorization code is required', 400);
  }

  if (!req.user) {
    throw new AppError('User must be authenticated', 401);
  }

  // Exchange code for tokens
  const oauth2Client = createOAuth2Client();
  const tokens = await getTokensFromCode(oauth2Client, code);

  // Save tokens to user record
  await db
    .update(users)
    .set({
      googleAccessToken: tokens.access_token!,
      googleRefreshToken: tokens.refresh_token!,
      googleTokenExpiry: tokens.expiry_date!,
    })
    .where(eq(users.id, req.user.id));

  logger.info(`Google OAuth connected for user: ${req.user.email}`);

  res.json({
    message: 'Google account connected successfully',
    hasGoogleAccess: true,
  });
}

/**
 * Get current user info
 */
export async function getCurrentUser(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user.id),
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      hasGoogleAccess: !!(user.googleAccessToken && user.googleRefreshToken),
      createdAt: user.createdAt,
    },
  });
}
