# Tickopsy

A multi-tenant SaaS for small service businesses to manage **customers, repair/service tickets, to-dos and reminders**, with paid subscriptions through **Stripe**.

Built as a **TypeScript monorepo** with Turborepo: a Next.js frontend, an Express REST API and a shared Prisma database package.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white)

## Features

- **Authentication** with Supabase Auth: email/password, Google OAuth, email confirmation and password reset
- **Onboarding flow**: sign up → choose a plan → Stripe Checkout → account activated
- **Stripe subscriptions** handled through webhooks (`checkout.session.completed`, `customer.subscription.updated` / `deleted`, `invoice.payment_succeeded`), with signature verification on the raw request body
- **Multi-tenant data model**: every customer, ticket, to-do and subscription belongs to an `Account`, and users belong to an account with a role
- **Tickets** with status history, due dates, notifications and reminders
- **Soft deletes** (`deletedAt`) on core entities

## Architecture

```
apps/
├── web/        Next.js (App Router) frontend: auth, onboarding, pricing, dashboard
└── api/        Express + TypeScript REST API
    └── src/
        ├── routes/        Route definitions
        ├── controllers/   HTTP layer
        ├── services/      Business logic (accounts, tickets, subscriptions, …)
        └── middleware/    Supabase JWT auth, central error handler
packages/
├── database/   Prisma schema, migrations and client, published as a private npm package
├── config-eslint/
└── config-typescript/
```

- The **API** follows a routes → controllers → services structure. A `requireAuth` middleware verifies the Supabase access token and loads the matching app user.
- The **database package** is the single source of truth for the schema. It's versioned and published, so the API deploys independently from the monorepo.
- **CI/CD** (GitHub Actions): on push to `main`, the pipeline builds, version-bumps and publishes the database package to npm, then deploys the frontend to Vercel. The API is hosted on Railway.

## Tech stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend   | Node.js, Express 5, TypeScript |
| Database  | PostgreSQL (Supabase), Prisma ORM |
| Auth      | Supabase Auth (email + Google OAuth) |
| Payments  | Stripe Checkout, Billing and webhooks |
| Tooling   | Turborepo, ESLint, Prettier |
| Hosting   | Vercel (web), Railway (API), Supabase (DB) |

## Running locally

**Prerequisites:** Node 20+, a Supabase project (or local Postgres), and the Stripe CLI for webhooks.

```bash
npm install

# Environment variables: copy the examples and fill them in
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp packages/database/.env.example packages/database/.env

# Database
npm run generate                       # generate the Prisma client
npm run db:migrate:dev                 # apply migrations

# Run everything (web on :3000, API on :4000)
npm run dev

# Forward Stripe webhooks to the local API
stripe listen --forward-to localhost:4000/api/stripe/webhook
```

## Status

Work in progress. Auth, onboarding, subscriptions and the data model are in place; the ticket dashboard UI is being built.
