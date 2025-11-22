import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { ensureDirectoryExists } from './utils/helpers';
import { swaggerSpec } from './config/swagger';
import { apiLimiter } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

/**
 * Express Application Configuration
 */
export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use((_req, _res, next) => {
    logger.info(`${_req.method} ${_req.url}`);
    next();
  });

  // Swagger API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'StudyBuddy API Documentation',
  }));

  // Apply rate limiting to all API routes
  app.use('/api', apiLimiter);

  // API routes
  app.use('/api', routes);

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      message: 'StudyBuddy Backend API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        studyPlan: '/api/study-plan',
        agent: '/api/agent',
        resources: '/api/resources',
        documentation: '/api-docs',
      },
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Initialize required directories
 */
export async function initializeApp(): Promise<void> {
  try {
    // Ensure upload directory exists
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    await ensureDirectoryExists(uploadDir);
    logger.info(`Upload directory ready: ${uploadDir}`);

    // Ensure logs directory exists
    await ensureDirectoryExists('./logs');
    logger.info('Logs directory ready');

    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
}
