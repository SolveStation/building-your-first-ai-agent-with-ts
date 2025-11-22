# StudyBuddy Backend

AI-driven learning assistant backend built with **Express.js**, **TypeScript**, **LangGraph**, and **Google Gemini**.

##  Overview

StudyBuddy helps students plan study sessions, simplify learning materials, and interact with an AI tutor. It integrates with Google Drive and Google Calendar to store resources and schedule sessions.

### Key Features

-  **Intelligent Content Simplification** - AI-powered study guide generation
-  **PDF Generation** - Convert simplified content to formatted PDFs
-  **Google Drive Integration** - Automatic file organization and storage
-  **Smart Scheduling** - AI-generated study schedules synced to Google Calendar
-  **AI Tutor Chat** - Interactive learning assistant
-  **Quiz Generation** - Automated assessment creation
-  **Secure Authentication** - JWT-based auth with Google OAuth
-  **Swagger Documentation** - Interactive API docs at `/api-docs`

---

## Architecture

### Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js + TypeScript |
| Framework | Express.js |
| AI Engine | Google Gemini + LangGraph |
| Database | PostgreSQL + Drizzle ORM |
| Authentication | JWT + Google OAuth 2.0 |
| File Processing | Puppeteer, pdf-parse, mammoth |
| Cloud Services | Google Drive, Google Calendar |

### Agent Workflow

```
User Upload → Research Agent → Compiler Agent → Scheduler Agent
                    ↓               ↓                ↓
              Simplify Text    Generate PDF    Create Events
                                Upload Drive
```

---

##  Project Structure

```
backend/
├── src/
│   ├── agents/              # LangGraph agent definitions
│   │   ├── nodes/          # Individual agent nodes
│   │   ├── graph.ts        # Workflow orchestration
│   │   └── state.ts        # Shared state definition
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── db/                 # Database schema & migrations
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper utilities
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Server entry point
├── uploads/                # Temporary file storage
├── .env.example            # Environment variables template
├── package.json
├── tsconfig.json
└── drizzle.config.ts       # Drizzle ORM configuration
```

---

##  Getting Started

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **PostgreSQL** database
- **Google Cloud Project** with:
  - Gemini API access
  - OAuth 2.0 credentials
  - Drive API enabled
  - Calendar API enabled

### Installation

1. **Clone and install dependencies**

```bash
cd backend
pnpm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/studybuddy

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash-latest

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# File Upload (60MB max)
MAX_FILE_SIZE=62914560
UPLOAD_DIR=./uploads
ALLOWED_FILE_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain

# Text Chunking
MAX_TOKENS_PER_CHUNK=25000
OVERLAP_TOKENS=500

# CORS
CORS_ORIGIN=http://localhost:3000
```

3. **Set up database**

```bash
# Generate migration
pnpm db:generate

# Run migration
pnpm db:migrate

# Or push schema directly (dev only)
pnpm db:push
```

4. **Start development server**

```bash
pnpm dev
```

Server will start at `http://localhost:5000`

** Swagger Documentation:** Visit `http://localhost:5000/api-docs` for interactive API documentation!

---

##  Interactive API Documentation

### Swagger UI

Access the **interactive API documentation** at:

```
http://localhost:5000/api-docs
```

**Features:**
-  Test all endpoints directly in browser
-  View request/response schemas
-  Authenticate and test protected routes
- See examples for all endpoints
-  No Postman needed!

**Quick Start:**
1. Visit `/api-docs`
2. Click **"Authorize"** button
3. Enter: `Bearer YOUR_ACCESS_TOKEN`
4. Test any endpoint with **"Try it out"**

See [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) for detailed usage instructions.

---

##  API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| GET | `/api/auth/google` | Get OAuth URL | Private |
| GET | `/api/auth/google/callback` | OAuth callback | Private |
| GET | `/api/auth/me` | Get current user | Private |

### Study Plans

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/study-plan` | Create study plan | Private |
| GET | `/api/study-plan` | List all plans | Private |
| GET | `/api/study-plan/:id` | Get specific plan | Private |
| DELETE | `/api/study-plan/:id` | Delete plan | Private |

### Agent Operations

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/agent/chat` | Chat with tutor | Private |
| GET | `/api/agent/chat/:id` | Get chat history | Private |
| POST | `/api/agent/research` | Trigger research | Private |
| POST | `/api/agent/compile` | Trigger compiler | Private |
| POST | `/api/agent/schedule` | Trigger scheduler | Private |

### Resources

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/resources` | List resources | Private |
| GET | `/api/resources/:id` | Get resource | Private |
| DELETE | `/api/resources/:id` | Delete resource | Private |

---

##  API Usage Examples

### 1. User Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "securepassword123"
  }'
```

### 2. Create Study Plan

```bash
curl -X POST http://localhost:5000/api/study-plan \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "topic=Machine Learning Basics" \
  -F "difficulty=intermediate" \
  -F "duration=14" \
  -F "materials=@lecture_notes.pdf" \
  -F "materials=@textbook_chapter.pdf"
```

### 3. Chat with Tutor

```bash
curl -X POST http://localhost:5000/api/agent/chat \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studyPlanId": "uuid-here",
    "message": "Explain gradient descent in simple terms",
    "mode": "chat"
  }'
```

### 4. Generate Quiz

```bash
curl -X POST http://localhost:5000/api/agent/chat \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studyPlanId": "uuid-here",
    "message": "Generate a quiz",
    "mode": "quiz"
  }'
```

---

##  Agent Details

### Research Agent
- Extracts text from PDF, DOCX, TXT files
- Handles large files (up to 60MB) with intelligent chunking
- Simplifies content using Gemini AI
- Generates markdown study guides

### Compiler Agent
- Converts markdown to styled HTML
- Generates PDF using Puppeteer
- Uploads to Google Drive
- Creates organized folder structure

### Scheduler Agent
- Uses AI to generate optimal study schedule
- Creates Google Calendar events
- Links events to Drive resources
- Sets reminders

### Tutor Agent
- Maintains conversation context
- Answers questions using study materials
- Generates quizzes on demand
- Provides explanations and examples

---

##  Database Schema

### Users
- `id`, `email`, `passwordHash`
- `googleAccessToken`, `googleRefreshToken`, `googleTokenExpiry`

### Study Plans
- `id`, `userId`, `topic`, `difficulty`, `duration`
- `status`, `driveFolderId`, `driveFolderUrl`

### Resources
- `id`, `studyPlanId`, `type`, `fileName`
- `filePath`, `driveFileId`, `driveFileUrl`

### Chat Messages
- `id`, `studyPlanId`, `role`, `content`

### Calendar Events
- `id`, `studyPlanId`, `eventId`, `title`
- `startTime`, `endTime`

---

##  Development

### Available Scripts

```bash
# Development with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database operations
pnpm db:generate    # Generate migrations
pnpm db:migrate     # Run migrations
pnpm db:push        # Push schema (dev only)
pnpm db:studio      # Open Drizzle Studio
```

### Code Structure Guidelines

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and external API calls
- **Agents**: LangGraph workflow nodes
- **Middleware**: Request processing and validation
- **Utils**: Reusable helper functions

---

##  Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Helmet.js for security headers
- Input validation with Zod
- File type and size restrictions
- Google OAuth for API access

---

##  Environment Variables

See `.env.example` for all required variables.

**Critical Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `GOOGLE_CLIENT_ID` - OAuth client ID
- `GOOGLE_CLIENT_SECRET` - OAuth client secret
- `JWT_SECRET` - JWT signing secret

---

##  Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string
psql $DATABASE_URL
```

### Google OAuth Issues
- Ensure redirect URI matches exactly in Google Console
- Check OAuth scopes are enabled
- Verify API keys are active

### File Upload Issues
- Check `MAX_FILE_SIZE` setting
- Verify `ALLOWED_FILE_TYPES` includes your file type
- Ensure `uploads/` directory exists and is writable

---

##  Additional Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Drizzle ORM Guide](https://orm.drizzle.team/docs/overview)
- [Express.js Documentation](https://expressjs.com/)

---

##  License

MIT

---

##  Contributing

This is a learning project. Feel free to fork and experiment!

---

**Built with ❤️ for students everywhere**
