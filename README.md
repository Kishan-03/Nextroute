# SkillSync AI

SkillSync AI is an industry-readiness platform for SIH26134. It connects student skill evidence, curriculum intelligence, regional employer demand, and student success workflows.

## Run locally

```bash
copy .env.example .env
npm install
npm run prisma:generate
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:4000`  
Swagger-compatible contract: `http://localhost:4000/api/docs`

## Workspaces

- `frontend`: Next.js App Router, responsive premium UI, dashboard modules
- `backend`: Express REST API, validation, rate limiting, audit logging, Prisma
- `shared`: shared Zod schemas and TypeScript types
- `ai-service`: FastAPI AI service boundary for document and skill analysis

## Production deployment

Set `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, OAuth credentials, Cloudinary credentials, and `NEXT_PUBLIC_API_URL` in the deployment environment. Run `npm run prisma:generate`, `npm run prisma:migrate`, `npm run build`, then start the frontend and backend processes behind HTTPS. Redis can be provided through AWS ElastiCache for queue, caching, and rate-limit storage.

## Security and operations

The API applies request limits, safe response headers, structured request logs, schema validation, bcrypt password hashing, and JWT-based authorization boundaries. Use CloudWatch/OpenTelemetry in production for metrics and alerting; never commit secrets.

## Future scope

Live labour-market feeds, verified institutional credentials, multilingual mentor conversations, and outcome-based curriculum optimization.
