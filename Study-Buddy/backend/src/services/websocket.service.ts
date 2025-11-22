import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { authService } from './auth.service';

/**
 * WebSocket Service
 * Handles real-time communication using Socket.io
 */
class WebSocketService {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  /**
   * Initialize Socket.io server
   */
  initialize(httpServer: HTTPServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
          return next(new Error('Authentication token required'));
        }

        // Verify JWT token
        const decoded = authService.verifyAccessToken(token);
        socket.data.userId = decoded.id;
        socket.data.email = decoded.email;

        next();
      } catch (error: any) {
        logger.warn(`WebSocket authentication failed: ${error.message}`);
        next(new Error('Invalid authentication token'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
    });

    logger.info('WebSocket server initialized');
  }

  /**
   * Handle new socket connection
   */
  private handleConnection(socket: Socket): void {
    const userId = socket.data.userId;
    logger.info(`WebSocket connected: ${socket.id} (user: ${userId})`);

    // Track user's sockets
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socket.id);

    // Join user-specific room
    socket.join(`user:${userId}`);

    // Handle study plan subscription
    socket.on('subscribe:studyPlan', (studyPlanId: string) => {
      socket.join(`studyPlan:${studyPlanId}`);
      logger.debug(`Socket ${socket.id} subscribed to study plan: ${studyPlanId}`);
    });

    // Handle study plan unsubscription
    socket.on('unsubscribe:studyPlan', (studyPlanId: string) => {
      socket.leave(`studyPlan:${studyPlanId}`);
      logger.debug(`Socket ${socket.id} unsubscribed from study plan: ${studyPlanId}`);
    });

    // Handle chat messages (for real-time tutor chat)
    socket.on('chat:message', async (data: { studyPlanId: string; message: string }) => {
      logger.debug(`Chat message from ${socket.id}: ${data.message}`);
      // Emit to study plan room (for collaborative features in future)
      socket.to(`studyPlan:${data.studyPlanId}`).emit('chat:message', {
        userId,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle typing indicator
    socket.on('chat:typing', (data: { studyPlanId: string; isTyping: boolean }) => {
      socket.to(`studyPlan:${data.studyPlanId}`).emit('chat:typing', {
        userId,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`WebSocket disconnected: ${socket.id} (user: ${userId})`);

      // Remove from tracking
      const userSocketSet = this.userSockets.get(userId);
      if (userSocketSet) {
        userSocketSet.delete(socket.id);
        if (userSocketSet.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`WebSocket error for ${socket.id}:`, error);
    });
  }

  /**
   * Emit workflow progress update to user
   */
  emitWorkflowProgress(userId: string, studyPlanId: string, data: {
    step: string;
    status: 'started' | 'in_progress' | 'completed' | 'failed';
    message: string;
    progress?: number;
  }): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('workflow:progress', {
      studyPlanId,
      ...data,
      timestamp: new Date().toISOString(),
    });

    logger.debug(`Emitted workflow progress to user ${userId}: ${data.step} - ${data.status}`);
  }

  /**
   * Emit study plan status update
   */
  emitStudyPlanUpdate(userId: string, studyPlanId: string, status: string, data?: any): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('studyPlan:update', {
      studyPlanId,
      status,
      data,
      timestamp: new Date().toISOString(),
    });

    logger.debug(`Emitted study plan update to user ${userId}: ${studyPlanId} - ${status}`);
  }

  /**
   * Emit chat response (for streaming AI responses)
   */
  emitChatResponse(userId: string, studyPlanId: string, data: {
    messageId: string;
    content: string;
    isComplete: boolean;
  }): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('chat:response', {
      studyPlanId,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emit notification to user
   */
  emitNotification(userId: string, notification: {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
  }): void {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Broadcast to all connected users
   */
  broadcast(event: string, data: any): void {
    if (!this.io) return;
    this.io.emit(event, data);
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  /**
   * Check if user is connected
   */
  isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  /**
   * Get Socket.io instance
   */
  getIO(): SocketIOServer | null {
    return this.io;
  }
}

export const websocketService = new WebSocketService();
