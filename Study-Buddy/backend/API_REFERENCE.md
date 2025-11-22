# StudyBuddy API Reference

Quick reference guide for all API endpoints.

---

## Base URL
```
http://localhost:5000/api
```

---

## Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Endpoints

### Authentication

#### 1. Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### 3. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc..."
}
```

#### 4. Get Google OAuth URL
```http
GET /api/auth/google
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Redirect user to this URL to authorize Google access"
}
```

#### 5. Google OAuth Callback
```http
GET /api/auth/google/callback?code=AUTHORIZATION_CODE
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "message": "Google account connected successfully",
  "hasGoogleAccess": true
}
```

#### 6. Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "hasGoogleAccess": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Study Plans

#### 1. Create Study Plan
```http
POST /api/study-plan
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data

topic: "Machine Learning Basics"
difficulty: "intermediate"
duration: 14
materials: [file1.pdf, file2.docx]
```

**Response (201):**
```json
{
  "message": "Study plan created successfully. Processing materials...",
  "studyPlan": {
    "id": "uuid",
    "topic": "Machine Learning Basics",
    "difficulty": "intermediate",
    "duration": 14,
    "status": "processing",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get All Study Plans
```http
GET /api/study-plan
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "studyPlans": [
    {
      "id": "uuid",
      "topic": "Machine Learning Basics",
      "difficulty": "intermediate",
      "duration": 14,
      "status": "completed",
      "driveFolderId": "folder_id",
      "driveFolderUrl": "https://drive.google.com/...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "resources": [...]
    }
  ],
  "total": 1
}
```

#### 3. Get Study Plan by ID
```http
GET /api/study-plan/:id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "studyPlan": {
    "id": "uuid",
    "topic": "Machine Learning Basics",
    "difficulty": "intermediate",
    "duration": 14,
    "status": "completed",
    "driveFolderId": "folder_id",
    "driveFolderUrl": "https://drive.google.com/...",
    "resources": [...],
    "calendarEvents": [...]
  }
}
```

#### 4. Delete Study Plan
```http
DELETE /api/study-plan/:id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "message": "Study plan deleted successfully"
}
```

---

### Agent Operations

#### 1. Chat with Tutor
```http
POST /api/agent/chat
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "studyPlanId": "uuid",
  "message": "Explain gradient descent in simple terms",
  "mode": "chat"
}
```

**Response (200):**
```json
{
  "mode": "chat",
  "response": "Gradient descent is like walking down a hill...",
  "chatHistory": [
    {
      "role": "user",
      "content": "Explain gradient descent...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Gradient descent is like...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Generate Quiz
```http
POST /api/agent/chat
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "studyPlanId": "uuid",
  "message": "Generate a quiz",
  "mode": "quiz"
}
```

**Response (200):**
```json
{
  "mode": "quiz",
  "questions": [
    {
      "question": "What is gradient descent?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Gradient descent is..."
    }
  ]
}
```

#### 3. Get Chat History
```http
GET /api/agent/chat/:studyPlanId
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "chatHistory": [
    {
      "id": "uuid",
      "role": "user",
      "content": "What is machine learning?",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Machine learning is...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 2
}
```

#### 4. Trigger Research Agent
```http
POST /api/agent/research
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "studyPlanId": "uuid"
}
```

**Response (200):**
```json
{
  "message": "Research agent triggered. This feature will re-process your materials.",
  "studyPlanId": "uuid"
}
```

#### 5. Trigger Compiler Agent
```http
POST /api/agent/compile
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "studyPlanId": "uuid"
}
```

**Response (200):**
```json
{
  "message": "Compiler agent triggered. This feature will regenerate your study materials.",
  "studyPlanId": "uuid"
}
```

#### 6. Trigger Scheduler Agent
```http
POST /api/agent/schedule
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "studyPlanId": "uuid"
}
```

**Response (200):**
```json
{
  "message": "Scheduler agent triggered. This feature will update your calendar events.",
  "studyPlanId": "uuid"
}
```

---

### Resources

#### 1. Get Resources by Study Plan
```http
GET /api/resources?studyPlanId=uuid
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "resources": [
    {
      "id": "uuid",
      "studyPlanId": "uuid",
      "type": "original",
      "fileName": "lecture_notes.pdf",
      "fileSize": 1024000,
      "mimeType": "application/pdf",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid",
      "studyPlanId": "uuid",
      "type": "simplified",
      "fileName": "Study Guide.pdf",
      "driveFileId": "file_id",
      "driveFileUrl": "https://drive.google.com/...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 2
}
```

#### 2. Get All User Resources
```http
GET /api/resources
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "resources": [
    {
      "id": "uuid",
      "studyPlanId": "uuid",
      "studyPlanTopic": "Machine Learning",
      "type": "simplified",
      "fileName": "Study Guide.pdf",
      "driveFileUrl": "https://drive.google.com/...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### 3. Get Resource by ID
```http
GET /api/resources/:id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "resource": {
    "id": "uuid",
    "studyPlanId": "uuid",
    "type": "simplified",
    "fileName": "Study Guide.pdf",
    "driveFileId": "file_id",
    "driveFileUrl": "https://drive.google.com/...",
    "fileSize": 2048000,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "studyPlan": {
      "id": "uuid",
      "topic": "Machine Learning Basics"
    }
  }
}
```

#### 4. Delete Resource
```http
DELETE /api/resources/:id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "message": "Resource deleted successfully"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "ErrorType",
  "message": "Human-readable error message",
  "statusCode": 400,
  "details": {}
}
```

### Common Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 400 | ValidationError | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Access denied |
| 404 | NotFound | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | InternalServerError | Server error |

---

## Rate Limits

Currently no rate limiting implemented. Recommended for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

---

## File Upload Limits

- **Max file size:** 60MB per file
- **Max files per request:** 10 files
- **Allowed types:** PDF, DOCX, TXT
- **Total request size:** 100MB

---

## Pagination

Not currently implemented. Future enhancement for:
- `/api/study-plan` (GET)
- `/api/resources` (GET)
- `/api/agent/chat/:id` (GET)

---

## Webhooks

Not currently implemented. Future enhancement for:
- Study plan completion notifications
- Agent workflow status updates
- Calendar event reminders

---

## Testing with cURL

### Complete Flow Example

```bash
# 1. Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Save the accessToken

# 2. Create study plan
curl -X POST http://localhost:5000/api/study-plan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "topic=Python Basics" \
  -F "difficulty=beginner" \
  -F "duration=7" \
  -F "materials=@notes.pdf"

# 3. Check status
curl http://localhost:5000/api/study-plan \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Chat with tutor
curl -X POST http://localhost:5000/api/agent/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studyPlanId":"YOUR_PLAN_ID",
    "message":"What is a variable?",
    "mode":"chat"
  }'
```

---

## Postman Collection

Import this URL in Postman for a complete collection:
```
(To be created - export from Postman after testing)
```

---
