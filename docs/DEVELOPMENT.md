# RNBP/NRPP Development Guide

## Prerequisites

| Tool       | Version |
|------------|---------|
| Node.js    | >= 20.0 |
| pnpm       | >= 9.0  |
| PostgreSQL | 16      |

## Quick Start

```bash
git clone <repo-url> && cd rnbp-app
pnpm install

# Configure environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit both .env files with your local values (see Environment Variables below)

# Start development
pnpm dev:all
```

The frontend runs on `http://localhost:5173`, the API on `http://localhost:3000`.

## Environment Variables

### API (`apps/api/.env`)

| Variable                   | Description                                        | Default / Example                              |
|----------------------------|----------------------------------------------------|------------------------------------------------|
| `DATABASE_URL`             | PostgreSQL connection string                       | `postgresql://rnbp:password@localhost:5432/rnbp`|
| `JWT_PRIVATE_KEY`          | Ed25519 private key, base64-encoded                | (see generation instructions in `.env.example`)|
| `JWT_PUBLIC_KEY`           | Ed25519 public key, base64-encoded                 | (see generation instructions in `.env.example`)|
| `PORT`                     | Server port                                        | `3000`                                         |
| `HOST`                     | Server bind address                                | `0.0.0.0`                                      |
| `NODE_ENV`                 | Environment                                        | `development`                                  |
| `CORS_ORIGINS`             | Comma-separated allowed origins                    | `http://localhost:5173`                        |
| `FRONTEND_URL`             | Used in email links                                | `http://localhost:5173`                        |
| `UPLOAD_DIR`               | Directory for file uploads                         | `./uploads`                                    |
| `MAX_FILE_SIZE`            | Max upload size in bytes                           | `10485760` (10 MB)                             |
| `BREVO_API_KEY`            | Brevo transactional email API key                  | (optional in dev)                              |
| `FROM_EMAIL`               | Sender email address                               | `noreply@rnbp.ca`                              |
| `FROM_NAME`                | Sender display name                                | `RNBP`                                         |
| `GOOGLE_CLIENT_ID`         | Google OAuth client ID                             | (optional)                                     |
| `GOOGLE_CLIENT_SECRET`     | Google OAuth client secret                         | (optional)                                     |
| `MICROSOFT_CLIENT_ID`      | Microsoft OAuth client ID                          | (optional)                                     |
| `MICROSOFT_CLIENT_SECRET`  | Microsoft OAuth client secret                      | (optional)                                     |
| `ADMIN_ORDER_EMAIL`        | Email for admin order notifications                | (optional, fallback: `info@rnbp.ca` prod / `dev@rnbp.ca` dev) |
| `ADMIN_CONTACT_EMAIL`      | Email for admin contact/partner form notifications | (optional, fallback: `info@rnbp.ca` prod / `dev@rnbp.ca` dev) |
| `STRIPE_SECRET_KEY`        | Stripe secret key                                  | (optional in dev)                              |
| `STRIPE_WEBHOOK_SECRET`    | Stripe webhook signing secret                      | (see Stripe section below)                     |
| `STRIPE_PRICE_STICKER_SHEET` | Stripe Price ID for sticker sheet product       | (optional in dev)                              |

### Web (`apps/web/.env`)

| Variable                | Description                    | Default / Example              |
|-------------------------|--------------------------------|--------------------------------|
| `VITE_API_URL`          | Backend API base URL           | `http://localhost:3000/api`    |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (public)| (optional)                     |
| `VITE_MICROSOFT_CLIENT_ID` | Microsoft OAuth client ID (public) | (optional)              |

## Scripts Reference

All scripts are run from the monorepo root with `pnpm`.

| Script              | Description                                      |
|---------------------|--------------------------------------------------|
| `pnpm dev`          | Start frontend dev server (port 5173)            |
| `pnpm dev:api`      | Start backend dev server (port 3000)             |
| `pnpm dev:all`      | Start both frontend and backend in parallel      |
| `pnpm build`        | Build all packages                               |
| `pnpm build:web`    | Build frontend only                              |
| `pnpm build:api`    | Build backend only                               |
| `pnpm lint`         | Run typecheck/lint across all packages            |
| `pnpm test`         | Run tests across all packages                    |
| `pnpm run deploy`   | Deploy everything (frontend + backend)           |
| `pnpm run deploy:web` | Deploy frontend only                           |
| `pnpm run deploy:api` | Deploy backend only                            |
| `pnpm run rollback` | Rollback API to last snapshot                    |
| `pnpm run stripe:dev` | Forward Stripe webhooks to local backend       |

**Note:** Use `pnpm run deploy`, not `pnpm deploy` (the latter is a native pnpm command).

## Testing

Tests use [Vitest](https://vitest.dev/). Both `apps/api` and `apps/web` have their own test suites.

```bash
pnpm test          # Run all tests across the monorepo
```

Package-level commands:

```bash
cd apps/api && pnpm test          # API tests only
cd apps/web && pnpm test          # Web tests only
cd apps/web && pnpm test:watch    # Web tests in watch mode
```

Test files are colocated in `src/__tests__/` directories within each package.

## Database

The project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL.

**Auto-migration:** Migrations run automatically on backend startup in both dev and prod. No need to run them manually.

Drizzle Kit commands (run from `apps/api/`):

| Command             | Description                                    |
|---------------------|------------------------------------------------|
| `pnpm db:generate`  | Generate migration files from schema changes   |
| `pnpm db:push`      | Push schema directly to the database (no migration file) |
| `pnpm db:studio`    | Open Drizzle Studio (visual database browser)  |
| `pnpm db:migrate`   | Run migrations via Drizzle Kit                 |

Typical workflow: modify the Drizzle schema, run `pnpm db:generate`, restart the dev server (migration applies automatically).

## Stripe (Local Dev)

To receive Stripe webhooks locally:

```bash
pnpm run stripe:dev
```

This uses the Stripe CLI to forward webhook events to `localhost:3000/api/shop/webhook`. On first use, run `stripe login` to authenticate.

The CLI prints a temporary webhook signing secret (`whsec_...`). Copy it into `apps/api/.env` as `STRIPE_WEBHOOK_SECRET`.
