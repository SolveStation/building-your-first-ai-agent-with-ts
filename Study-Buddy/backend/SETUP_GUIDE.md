# StudyBuddy Backend - Quick Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb studybuddy

# Your DATABASE_URL will be:
# postgresql://username:password@localhost:5432/studybuddy
```

**Option B: Cloud PostgreSQL (Recommended)**
- [Neon](https://neon.tech) - Free tier with instant setup
- [Supabase](https://supabase.com) - Free tier with dashboard
- [Railway](https://railway.app) - Easy deployment

### Step 3: Get Google API Credentials

#### 3.1 Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

#### 3.2 Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable APIs:
   - Google Drive API
   - Google Calendar API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret

### Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Minimum required configuration
DATABASE_URL=postgresql://user:pass@host:5432/studybuddy
GEMINI_API_KEY=your_gemini_key_here
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Generate secure secrets (use: openssl rand -base64 32)
JWT_SECRET=your_generated_secret
JWT_REFRESH_SECRET=your_generated_refresh_secret
```

### Step 5: Initialize Database

```bash
# Generate and run migrations
pnpm db:generate
pnpm db:migrate
```

### Step 6: Start Server

```bash
pnpm dev
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║   🎓 StudyBuddy Backend Server                           ║
║   Status: Running                                         ║
║   Port: 5000                                              ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Verify Installation

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "service": "StudyBuddy Backend",
  "version": "1.0.0"
}
```

### Test User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

---

##  Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL format
- Test connection: `psql $DATABASE_URL`

### Issue: "GEMINI_API_KEY is not set"
**Solution:**
- Ensure `.env` file exists in root directory
- Check key is copied correctly (no extra spaces)
- Restart server after changing `.env`

### Issue: "Google OAuth not working"
**Solution:**
- Verify redirect URI matches exactly in Google Console
- Check both Drive and Calendar APIs are enabled
- Ensure OAuth consent screen is configured

### Issue: "File upload fails"
**Solution:**
- Check `uploads/` directory exists
- Verify file size is under 60MB
- Confirm file type is allowed (PDF, DOCX, TXT)

### Issue: TypeScript errors
**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

##  Database Management

### View Database with Drizzle Studio
```bash
pnpm db:studio
```
Opens visual database browser at `https://local.drizzle.studio`

### Reset Database (Development Only)
```bash
# Drop all tables and recreate
pnpm db:push --force
```

### Backup Database
```bash
pg_dump $DATABASE_URL > backup.sql
```

---

##  Testing the API

### 1. Create User Account
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123"}'
```

Save the `accessToken` from response.

### 2. Connect Google Account
```bash
# Get OAuth URL
curl http://localhost:5000/api/auth/google \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Visit the URL in browser and authorize
# Then handle the callback
```

### 3. Create Study Plan
```bash
curl -X POST http://localhost:5000/api/study-plan \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "topic=Python Programming" \
  -F "difficulty=beginner" \
  -F "duration=7" \
  -F "materials=@sample.pdf"
```

### 4. Check Study Plan Status
```bash
curl http://localhost:5000/api/study-plan \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

##  Next Steps

1. **Test with Real Files**: Upload actual study materials
2. **Try the Chat**: Interact with the tutor agent
3. **Generate Quizzes**: Test quiz generation
4. **Check Google Drive**: Verify files are uploaded
5. **View Calendar**: Check scheduled study sessions

---

## Development Tips

### Hot Reload
The dev server automatically restarts on file changes.

### Logging
Check `logs/combined.log` for detailed logs.

### Database Changes
After modifying `src/db/schema.ts`:
```bash
pnpm db:generate  # Creates migration
pnpm db:migrate   # Applies migration
```

### Environment Variables
Changes to `.env` require server restart.

---

##  Need Help?

1. Check the main [README.md](./README.md) for detailed documentation
2. Review error logs in `logs/error.log`
3. Verify all environment variables are set correctly
4. Ensure all required APIs are enabled in Google Cloud Console

---

##  Success!

If you've reached this point, your StudyBuddy backend is ready to use!

Try creating your first study plan and watch the AI agents work their magic. 🚀
