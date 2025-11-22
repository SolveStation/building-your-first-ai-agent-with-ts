# StudyBuddy Backend API Guide for Frontend Engineers

## Overview

StudyBuddy is an AI-driven learning assistant backend built with Node.js, Express, TypeScript, and Socket.io. This guide focuses on the API endpoints and WebSocket integration for frontend consumption, particularly the chat functionality.

## Authentication

All API endpoints require JWT authentication via Bearer token in the `Authorization` header.

### Login/Signup
- **POST** `/api/auth/signup` - Create new account
- **POST** `/api/auth/login` - Authenticate user

Request body for both:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "accessToken": "jwt_token_here"
}
```

## WebSocket Integration

The backend uses Socket.io for real-time communication. All WebSocket connections require authentication via JWT token.

### Connection Setup

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token_here'
  },
  transports: ['websocket', 'polling']
});
```

### WebSocket Events

#### Authentication & Connection
- **Connection**: Automatic authentication middleware verifies JWT token
- **Error Handling**: Listen for connection errors

```javascript
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);
});
```

#### Study Plan Subscriptions
Subscribe to real-time updates for specific study plans:

```javascript
// Subscribe to study plan updates
socket.emit('subscribe:studyPlan', 'study-plan-uuid');

// Unsubscribe
socket.emit('unsubscribe:studyPlan', 'study-plan-uuid');
```

#### Real-time Chat (Peer-to-Peer)
For collaborative features (currently emits to other users in same study plan):

```javascript
// Send chat message
socket.emit('chat:message', {
  studyPlanId: 'study-plan-uuid',
  message: 'Hello everyone!'
});

// Listen for messages from others
socket.on('chat:message', (data) => {
  console.log('New message:', data);
  // data: { userId, message, timestamp }
});

// Typing indicators
socket.emit('chat:typing', {
  studyPlanId: 'study-plan-uuid',
  isTyping: true
});

socket.on('chat:typing', (data) => {
  // data: { userId, isTyping }
});
```

#### Workflow Progress Updates
Listen for AI agent progress during study plan creation:

```javascript
socket.on('workflow:progress', (data) => {
  console.log('Progress:', data);
  // data: {
  //   studyPlanId,
  //   step: 'research' | 'compiler' | 'scheduler',
  //   status: 'started' | 'in_progress' | 'completed' | 'failed',
  //   message: 'Processing...',
  //   progress: 75, // optional percentage
  //   timestamp
  // }
});
```

#### Study Plan Status Updates

```javascript
socket.on('studyPlan:update', (data) => {
  console.log('Study plan update:', data);
  // data: {
  //   studyPlanId,
  //   status: 'completed' | 'failed' | etc,
  //   data: {}, // additional data
  //   timestamp
  // }
});
```

#### AI Chat Responses (Streaming)
For future streaming AI responses:

```javascript
socket.on('chat:response', (data) => {
  console.log('AI response chunk:', data);
  // data: {
  //   studyPlanId,
  //   messageId,
  //   content: 'partial response text',
  //   isComplete: false,
  //   timestamp
  // }
});
```

#### Notifications

```javascript
socket.on('notification', (data) => {
  console.log('Notification:', data);
  // data: {
  //   type: 'info' | 'success' | 'warning' | 'error',
  //   title: 'Notification Title',
  //   message: 'Notification message',
  //   timestamp
  // }
});
```

## REST API Endpoints

### Study Plans

#### Create Study Plan
**POST** `/api/study-plan`

Multipart form data:
- `topic`: string (3-255 chars)
- `difficulty`: 'beginner' | 'intermediate' | 'advanced'
- `duration`: number (1-365 days)
- `files`: File[] (optional, up to 10 files)

Response:
```json
{
  "studyPlan": {
    "id": "uuid",
    "topic": "Mathematics",
    "difficulty": "intermediate",
    "duration": 30,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Study Plans
**GET** `/api/study-plan`

Response:
```json
{
  "studyPlans": [
    {
      "id": "uuid",
      "topic": "Mathematics",
      "difficulty": "intermediate",
      "duration": 30,
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Study Plan Details
**GET** `/api/study-plan/:id`

Response:
```json
{
  "studyPlan": {
    "id": "uuid",
    "topic": "Mathematics",
    "difficulty": "intermediate",
    "duration": 30,
    "status": "completed",
    "driveFolderUrl": "https://drive.google.com/...",
    "createdAt": "2024-01-01T00:00:00Z",
    "resources": [
      {
        "id": "uuid",
        "type": "pdf",
        "fileName": "study-guide.pdf",
        "driveFileUrl": "https://drive.google.com/..."
      }
    ]
  }
}
```

### Chat with AI Tutor

#### Send Chat Message
**POST** `/api/agent/chat`

Request:
```json
{
  "studyPlanId": "uuid",
  "message": "Explain calculus derivatives",
  "mode": "chat"
}
```

Response:
```json
{
  "mode": "chat",
  "response": "A derivative measures the rate of change...",
  "chatHistory": [
    {
      "role": "user",
      "content": "Explain calculus derivatives",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "role": "assistant",
      "content": "A derivative measures...",
      "timestamp": "2024-01-01T00:00:01Z"
    }
  ]
}
```

#### Generate Quiz
**POST** `/api/agent/chat`

Request:
```json
{
  "studyPlanId": "uuid",
  "message": "Generate a quiz",
  "mode": "quiz"
}
```

Response:
```json
{
  "mode": "quiz",
  "questions": [
    {
      "question": "What is the derivative of x^2?",
      "options": ["x", "2x", "x^2", "2"],
      "correctAnswer": 1
    }
  ]
}
```

#### Get Chat History
**GET** `/api/agent/chat/:studyPlanId`

Response:
```json
{
  "chatHistory": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Hello",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Hi there!",
      "createdAt": "2024-01-01T00:00:01Z"
    }
  ],
  "total": 2
}
```

### Resources

#### Get Resources
**GET** `/api/resources?studyPlanId=uuid`

Response:
```json
{
  "resources": [
    {
      "id": "uuid",
      "studyPlanId": "uuid",
      "type": "pdf",
      "fileName": "study-guide.pdf",
      "driveFileUrl": "https://drive.google.com/...",
      "fileSize": 1024000,
      "mimeType": "application/pdf",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Error Handling

All API errors follow this format:
```json
{
  "message": "Error description",
  "status": 400
}
```

Common HTTP status codes:
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## File Upload Configuration

- **Max file size**: 60MB (configurable via `MAX_FILE_SIZE`)
- **Allowed types**: Configurable via `ALLOWED_FILE_TYPES` (comma-separated MIME types)
- **Max files per upload**: 10

## Environment Variables

Frontend should be aware of these backend environment variables:
- `CORS_ORIGIN`: Frontend URL for CORS
- `MAX_FILE_SIZE`: Maximum upload size
- `ALLOWED_FILE_TYPES`: Accepted file types

## Development Notes

1. **WebSocket Connection**: Always include JWT token in auth object
2. **File Uploads**: Use FormData for multipart requests
3. **Real-time Updates**: Subscribe to study plans for live progress
4. **Chat History**: Persisted in database, last 10 messages returned in responses
5. **AI Responses**: Currently synchronous; future streaming via WebSocket events

## Testing the API

Use the Swagger documentation at `/api-docs` for interactive testing.

Example frontend integration flow:
1. Authenticate user → get JWT token
2. Connect to WebSocket with token
3. Create study plan → listen for workflow progress
4. Chat with AI → receive responses
5. Subscribe to study plan for real-time updates
