# Docker Deployment Guide

Complete guide for deploying StudyBuddy backend with Docker.

---

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

---

## Quick Start

### 1. Clone and Setup

```bash
cd backend
cp .env.docker .env
```

### 2. Configure Environment

Edit `.env` with your actual values:
```env
# REQUIRED: Change these!
JWT_SECRET=your-secure-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database password
POSTGRES_PASSWORD=your-secure-db-password
```

### 3. Start Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Check status
docker-compose ps
```

### 4. Run Database Migrations

```bash
# Run migrations
docker-compose exec api pnpm db:migrate

# Or generate and migrate
docker-compose exec api pnpm db:generate
docker-compose exec api pnpm db:migrate
```

### 5. Access Application

- **API:** http://localhost:5000
- **Swagger Docs:** http://localhost:5000/api-docs
- **Health Check:** http://localhost:5000/api/health

---

## Services

### Backend API (Port 5000)
- Node.js 18 Alpine
- TypeScript compiled
- Puppeteer with Chromium
- Health checks enabled

### PostgreSQL (Port 5432)
- PostgreSQL 16 Alpine
- Persistent volume
- Auto-restart enabled

### Redis (Port 6379)
- Redis 7 Alpine
- AOF persistence
- Used for caching & rate limiting

---

## Common Commands

### Service Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a service
docker-compose restart api

# View logs
docker-compose logs -f api
docker-compose logs -f postgres
docker-compose logs -f redis

# Check service health
docker-compose ps
```

### Database Operations

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U studybuddy -d studybuddy

# Backup database
docker-compose exec postgres pg_dump -U studybuddy studybuddy > backup.sql

# Restore database
docker-compose exec -T postgres psql -U studybuddy studybuddy < backup.sql

# Run migrations
docker-compose exec api pnpm db:migrate

# Open Drizzle Studio
docker-compose exec api pnpm db:studio
```

### Redis Operations

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Check Redis info
docker-compose exec redis redis-cli INFO

# Clear cache
docker-compose exec redis redis-cli FLUSHALL
```

### Application Management

```bash
# View API logs
docker-compose logs -f api

# Execute command in API container
docker-compose exec api sh

# Rebuild API image
docker-compose build api

# Rebuild and restart
docker-compose up -d --build api
```

---

## Configuration

### Environment Variables

All configuration is done via `.env` file. Key variables:

```env
# Server
NODE_ENV=production
PORT=5000

# Database (auto-configured in Docker)
DATABASE_URL=postgresql://studybuddy:password@postgres:5432/studybuddy

# Redis (auto-configured in Docker)
REDIS_URL=redis://redis:6379

# Your API Keys
GEMINI_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Volume Mounts

```yaml
volumes:
  - ./uploads:/app/uploads    # File uploads
  - ./logs:/app/logs          # Application logs
```

### Network

All services communicate via `studybuddy-network` bridge network.

---

## Monitoring

### Health Checks

```bash
# API health
curl http://localhost:5000/api/health

# PostgreSQL health
docker-compose exec postgres pg_isready

# Redis health
docker-compose exec redis redis-cli ping
```

### Logs

```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f api
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Volume usage
docker volume ls
```

---

## Security Best Practices

### 1. Change Default Passwords

```env
POSTGRES_PASSWORD=use-strong-password-here
JWT_SECRET=use-cryptographically-secure-random-string
JWT_REFRESH_SECRET=use-different-secure-string
```

### 2. Use Secrets Management

For production, use Docker secrets or environment variable injection:

```bash
# Using Docker secrets
docker secret create jwt_secret jwt_secret.txt
```

### 3. Network Security

```yaml
# Expose only necessary ports
ports:
  - "5000:5000"  # API only
  # Don't expose DB and Redis to host
```

### 4. Run as Non-Root

Already configured in Dockerfile:
```dockerfile
USER nodejs
```

---

##  Production Deployment

### 1. Use Production Compose File

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  api:
    image: studybuddy-api:latest
    restart: always
    environment:
      NODE_ENV: production
      LOG_LEVEL: warn
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 2. Enable SSL/TLS

Use a reverse proxy (Nginx/Traefik) for HTTPS:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```

### 3. Set Up Monitoring

Add monitoring services:

```yaml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
  
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
```

---

##  Troubleshooting

### API Won't Start

```bash
# Check logs
docker-compose logs api

# Check if ports are available
netstat -an | grep 5000

# Rebuild image
docker-compose build --no-cache api
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec api node -e "require('postgres')('postgresql://studybuddy:password@postgres:5432/studybuddy').query('SELECT 1')"
```

### Redis Connection Failed

```bash
# Check Redis status
docker-compose exec redis redis-cli ping

# Check Redis logs
docker-compose logs redis
```

### Out of Disk Space

```bash
# Clean up Docker
docker system prune -a --volumes

# Remove old images
docker image prune -a

# Check volume sizes
docker system df -v
```

---

##  Scaling

### Horizontal Scaling

```yaml
services:
  api:
    deploy:
      replicas: 3
    ports:
      - "5000-5002:5000"
```

### Load Balancing

Use Nginx or Traefik:

```yaml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
    depends_on:
      - api
```

---

##  Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build api
```

### Database Backup

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec postgres pg_dump -U studybuddy studybuddy > backup_$DATE.sql
```

### Log Rotation

Logs are automatically rotated by Winston (14 days retention).

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Redis Docker](https://hub.docker.com/_/redis)

---

##  Checklist

Before deploying to production:

- [ ] Changed all default passwords
- [ ] Set secure JWT secrets
- [ ] Configured Google API keys
- [ ] Set up SSL/TLS
- [ ] Configured backups
- [ ] Set up monitoring
- [ ] Tested health checks
- [ ] Configured log retention
- [ ] Set resource limits
- [ ] Documented deployment process

---

**Your StudyBuddy backend is now containerized and production-ready!**
