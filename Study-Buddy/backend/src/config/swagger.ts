import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

/**
 * Swagger/OpenAPI Configuration
 */

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StudyBuddy API',
      version,
      description: 'AI-driven learning assistant backend with LangGraph and Google Gemini',
      contact: {
        name: 'StudyBuddy Team',
        email: 'support@studybuddy.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.studybuddy.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'ValidationError',
            },
            message: {
              type: 'string',
              example: 'Request validation failed',
            },
            statusCode: {
              type: 'integer',
              example: 400,
            },
            details: {
              type: 'object',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            hasGoogleAccess: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        StudyPlan: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            topic: {
              type: 'string',
              example: 'Machine Learning Basics',
            },
            difficulty: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced'],
              example: 'intermediate',
            },
            duration: {
              type: 'integer',
              example: 14,
              description: 'Duration in days',
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed'],
              example: 'completed',
            },
            driveFolderId: {
              type: 'string',
              nullable: true,
            },
            driveFolderUrl: {
              type: 'string',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Resource: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            studyPlanId: {
              type: 'string',
              format: 'uuid',
            },
            type: {
              type: 'string',
              enum: ['original', 'simplified', 'pdf'],
              example: 'simplified',
            },
            fileName: {
              type: 'string',
              example: 'Study Guide.pdf',
            },
            driveFileUrl: {
              type: 'string',
              nullable: true,
            },
            fileSize: {
              type: 'integer',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ChatMessage: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            role: {
              type: 'string',
              enum: ['user', 'assistant'],
              example: 'user',
            },
            content: {
              type: 'string',
              example: 'What is machine learning?',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        QuizQuestion: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              example: 'What is gradient descent?',
            },
            options: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Option A', 'Option B', 'Option C', 'Option D'],
            },
            correctAnswer: {
              type: 'integer',
              example: 0,
              description: 'Index of correct option (0-3)',
            },
            explanation: {
              type: 'string',
              example: 'Gradient descent is an optimization algorithm...',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Study Plans',
        description: 'Study plan creation and management',
      },
      {
        name: 'Agents',
        description: 'AI agent operations (chat, quiz, workflow triggers)',
      },
      {
        name: 'Resources',
        description: 'Study material and resource management',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/config/swagger.annotations.ts',
  ], // Paths to API routes and annotations
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
