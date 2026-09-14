# NXTROT / SkillSync AI

SkillSync AI is a full-stack industry-readiness platform for SIH26134. It connects student skills, curriculum intelligence, regional employer demand, learning progress, and hiring workflows.

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 15+ for persistent production-style database mode
- Docker Desktop is optional and can start PostgreSQL and Redis together

## Quick start

Open PowerShell in the repository root:

```powershell
npm install
Copy-Item .env.example .env
npm run prisma:generate
npm run dev
```

Open:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API health: http://localhost:4000/api/health
- API contract: http://localhost:4000/api/docs
- Database dashboard: http://localhost:3000/database

## PostgreSQL setup

Start PostgreSQL and create the database:

```sql
CREATE DATABASE skillsync_ai;
```

Update `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skillsync_ai?schema=public"
JWT_SECRET="use-a-long-random-secret"
JWT_REFRESH_SECRET="use-a-different-long-random-secret"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
PORT=4000
```

Apply the Prisma schema:

```powershell
npm run prisma:generate
npm run prisma:migrate
```

Inspect PostgreSQL data with Prisma Studio:

```powershell
npx prisma studio --schema backend/prisma/schema.prisma
```

Prisma Studio opens at `http://localhost:5555`.

## Docker setup

If Docker Desktop is installed:

```powershell
docker compose up -d postgres redis
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

The compose file starts PostgreSQL on `5432` and Redis on `6379`.

## Development fallback

If PostgreSQL is unavailable, authentication uses a local development store at `backend/data/local-store.json`. This keeps local accounts across backend restarts. The fallback is intended only for development; production must use PostgreSQL.

Development data viewer:

- http://localhost:3000/database
- http://localhost:4000/api/dev/data

Password hashes are never returned by the data viewer.

## Demo login

```text
Email: student@nxtrot.local
Password: Student@123
Role: STUDENT
```

Unauthenticated users are redirected from protected pages to `/login`. Successful login creates HttpOnly access and refresh cookies.

## Scripts

```powershell
npm run dev
npm run build
npm run prisma:generate
npm run prisma:migrate
npm --workspace frontend run dev
npm --workspace backend run dev
npm --workspace backend run build
```

## Application routes

- `/landing` — public product landing page
- `/login` — login and signup
- `/` — authenticated student dashboard
- `/ai` — resume and curriculum intelligence
- `/industry` — industry demand and apprenticeship matcher
- `/success` — student success, tasks, XP, badges, and mentor
- `/bridge` — industry–student skill matching and application flow
- `/learning` — learning progress
- `/opportunities` — recommended opportunities
- `/community` — discussion workspace
- `/database` — protected local development data dashboard

## Backend capabilities

The Express API provides authentication, JWT refresh, rate limiting, safe response headers, structured request logging, AI analysis, industry intelligence, student success, notifications, audit logs, API documentation, and Skill Bridge matching endpoints.

The FastAPI boundary under `ai-service` exposes document and skill-analysis service contracts:

```powershell
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install -r ai-service/requirements.txt
uvicorn ai-service.app.main:app --reload --port 8000
```

## Production deployment

1. Provision PostgreSQL and Redis.
2. Set all environment variables in the deployment platform; never commit `.env`.
3. Run `npm ci`.
4. Run `npm run prisma:generate` and `npm run prisma:migrate`.
5. Run `npm run build`.
6. Start the backend and frontend behind HTTPS using a process manager or containers.
7. Configure AWS CloudWatch/OpenTelemetry for logs, metrics, and alerts.
8. Configure real provider credentials only when email, SMS, WhatsApp, Cloudinary, or Google OAuth integrations are enabled.

## Architecture and troubleshooting

Architecture, ER, and sequence diagrams are in [`docs/architecture.md`](docs/architecture.md). Secrets, generated builds, local stores, and dependencies are excluded by `.gitignore`.

- Missing `DATABASE_URL`: copy `.env.example` to `.env`, or use the development fallback.
- Prisma engine error: run `npm run prisma:generate` with network access.
- Port in use: stop the process on `3000` or `4000`, then run `npm run dev` again.
- Stale Next.js chunks: stop Next.js, delete `frontend/.next`, and restart the frontend.
- CSS missing: hard-refresh with `Ctrl + Shift + R` after restarting Next.js.
