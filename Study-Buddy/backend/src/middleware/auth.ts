import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract token from Authorization header
    const token = authService.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    // Verify token
    const decoded = authService.verifyAccessToken(token);

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    return next();
  } catch (error: any) {
    logger.warn(`Authentication failed: ${error.message}`);

    if (error.message === 'Access token expired') {
      return res.status(401).json({
        error: 'TokenExpired',
        message: 'Access token has expired. Please refresh your token.',
      });
    }

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authentication token',
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if missing
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = authService.extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = authService.verifyAccessToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
    }

    next();
  } catch (error) {
    // Silently continue without user
    next();
  }
}
