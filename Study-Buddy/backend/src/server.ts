import { createApp, initializeApp } from './app';
import { logger } from './utils/logger';
import { websocketService } from './services/websocket.service';
import { redisService } from './services/redis.service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Start the Express server
 */
async function startServer() {
  try {
    // Initialize Redis
    await redisService.initialize();

    // Initialize application (create directories, etc.)
    await initializeApp();

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(PORT, () => {
      // Initialize WebSocket server
      websocketService.initialize(server);
      logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓 StudyBuddy Backend Server                            ║
║                                                           ║
║   Status: Running                                         ║
║   Port: ${PORT}                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}   ║
║   URL: http://localhost:${PORT}                           ║
║                                                           ║
║   📚 Swagger Docs: http://localhost:${PORT}/api-docs      ║
║   🔌 WebSocket: ws://localhost:${PORT}                    ║
║                                                           ║
║   Quick Start:                                            ║
║   - Health Check: GET /api/health                         ║
║   - Auth: POST /api/auth/signup, /login                   ║
║   - Study Plans: POST /api/study-plan                     ║
║   - Agent Chat: POST /api/agent/chat                      ║
║   - Resources: GET /api/resources                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
