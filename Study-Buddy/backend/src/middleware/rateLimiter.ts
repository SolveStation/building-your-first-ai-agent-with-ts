import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisService } from '../services/redis.service';
import { logger } from '../utils/logger';

/**
 * Rate Limiting Middleware
 * Protects API from abuse and DDoS attacks
 */

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: {
    error: 'TooManyRequests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '10  minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use Redis if available, otherwise use memory store
  store: redisService.isReady()
    ? new RedisStore({
        // @ts-expect-error - RedisStore types issue
        client: redisService.getClient(),
        prefix: 'rl:api:',
      })
    : undefined,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  },
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'TooManyRequests',
      message: 'Too many requests, please try again later.',
    });
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'TooManyRequests',
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisService.isReady()
    ? new RedisStore({
        // @ts-expect-error - RedisStore types issue
        client: redisService.getClient(),
        prefix: 'rl:auth:',
      })
    : undefined,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'TooManyRequests',
      message: 'Too many authentication attempts. Please try again later.',
    });
  },
});

/**
 * Rate limiter for file uploads
 * 10 uploads per hour per user
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: 'TooManyRequests',
    message: 'Upload limit exceeded. Please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisService.isReady()
    ? new RedisStore({
        // @ts-expect-error - RedisStore types issue
        client: redisService.getClient(),
        prefix: 'rl:upload:',
      })
    : undefined,
  keyGenerator: (req) => {
    return req.user?.id || req.ip || 'unknown';
  },
  handler: (req, res) => {
    logger.warn(`Upload rate limit exceeded for user/IP: ${req.user?.id || req.ip}`);
    res.status(429).json({
      error: 'TooManyRequests',
      message: 'Upload limit exceeded. You can upload up to 10 files per hour.',
    });
  },
});

/**
 * Rate limiter for AI agent operations
 * 20 requests per hour per user
 */
export const agentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    error: 'TooManyRequests',
    message: 'AI agent request limit exceeded. Please try again later.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisService.isReady()
    ? new RedisStore({
        // @ts-expect-error - RedisStore types issue
        client: redisService.getClient(),
        prefix: 'rl:agent:',
      })
    : undefined,
  keyGenerator: (req) => {
    return req.user?.id || req.ip || 'unknown';
  },
  handler: (req, res) => {
    logger.warn(`Agent rate limit exceeded for user: ${req.user?.id}`);
    res.status(429).json({
      error: 'TooManyRequests',
      message: 'AI agent request limit exceeded. You can make up to 20 requests per hour.',
    });
  },
});

/**
 * Sliding window rate limiter for chat
 * 50 messages per 10 minutes per user
 */
export const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50,
  message: {
    error: 'TooManyRequests',
    message: 'Chat message limit exceeded. Please slow down.',
    retryAfter: '10 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: redisService.isReady()
    ? new RedisStore({
        // @ts-expect-error - RedisStore types issue
        client: redisService.getClient(),
        prefix: 'rl:chat:',
      })
    : undefined,
  keyGenerator: (req) => {
    return req.user?.id || req.ip || 'unknown';
  },
  handler: (req, res) => {
    logger.warn(`Chat rate limit exceeded for user: ${req.user?.id}`);
    res.status(429).json({
      error: 'TooManyRequests',
      message: 'You are sending messages too quickly. Please slow down.',
    });
  },
});
