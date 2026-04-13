# Tickopsy

A full-stack monorepo using Turborepo.

- Frontend: Next.js app in apps/web (Vercel)
- Backend: Express + TypeScript app in apps/api (Railway)
- Database/Auth: Supabase Postgres + Supabase Auth
- ORM: Prisma in packages/database

## Monorepo Structure

```text
.
├── apps
│   ├── web
│   └── api
├── packages
│   ├── database
│   ├── config-eslint
│   └── config-typescript
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Prerequisites

- Node.js >= 18
- Docker (for local Postgres)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for webhook testing)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env templates and fill in your values
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 3. Start local Postgres + API + Web + Stripe listener
npm run dev
```

On first run the DB will be empty. To seed it:

```bash
npm run db:push    # push Prisma schema to the local DB
npm run db:seed    # populate with demo data
```

Or use the one-shot fresh start:

```bash
npm run dev:fresh   # wipes DB, re-pushes schema, seeds, then starts everything
```

## Scripts

| Command                                   | What it does                                            |
| ----------------------------------------- | ------------------------------------------------------- |
| `npm run dev`                             | Starts Postgres container + API + Web + Stripe listener |
| `npm run dev:fresh`                       | Wipes DB, pushes schema, seeds, then starts everything  |
| `npm run db:up`                           | Start local Postgres container                          |
| `npm run db:down`                         | Stop containers                                         |
| `npm run db:reset`                        | Destroy volume, restart Postgres, push schema           |
| `npm run db:seed`                         | Seed database with demo data                            |
| `npm run db:push`                         | Push Prisma schema to local DB                          |
| `npm run db:migrate:dev -- --name <name>` | Create a new migration                                  |
| `npm run db:migrate:deploy`               | Apply pending migrations                                |
| `npm run generate`                        | Regenerate Prisma client                                |

Start individual apps:

```bash
npm run dev --filter=web
npm run dev --filter=api
```

### pgAdmin

Connect to the local database with:

- Host: `localhost`
- Port: `5432`
- User: `tickopsy`
- Password: `tickopsy`
- Database: `tickopsy`

## Environment Variables

### Root / Database (.env)

```env
DATABASE_URL=postgresql://tickopsy:tickopsy@localhost:5432/tickopsy
DIRECT_URL=postgresql://tickopsy:tickopsy@localhost:5432/tickopsy
```

### Frontend — apps/web/.env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend — apps/api/.env

```env
PORT=4000
DATABASE_URL=postgresql://tickopsy:tickopsy@localhost:5432/tickopsy
DIRECT_URL=postgresql://tickopsy:tickopsy@localhost:5432/tickopsy
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
FRONTEND_ORIGINS=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESET_PASSWORD_REDIRECT_URL=http://localhost:3000/reset-password
```

### Production (Vercel / Railway)

Same Supabase project. Point `DATABASE_URL` / `DIRECT_URL` at your hosted Postgres (Supabase pooler or Railway) instead of localhost. Update `FRONTEND_ORIGINS` and `RESET_PASSWORD_REDIRECT_URL` to your production domain.

## Notes

- `packages/database` is the source of truth for Prisma schema and generated client.
- Keep Supabase service role key only on backend services.
- Configure `FRONTEND_ORIGINS` on the API to restrict CORS in production.
- The local Postgres container stores data in a Docker volume (`pgdata`). Use `npm run db:reset` to wipe it.
