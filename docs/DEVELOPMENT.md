# Badge Development Guide

## Prerequisites

| Tool    | Version |
|---------|---------|
| Node.js | >= 20.0 |
| pnpm    | >= 10.0 |

No database to install and no Docker: the Worker runs on workerd against a local D1 (a SQLite
file wrangler manages for you) and a simulated R2 — the same engine as production, so local
behaviour matches.

`apps/api` is the retired Fastify application. It is still deployed on the old server because it
hosts the argon2 bridge, but **nothing calls that bridge any more** since login started sending
pre-migration accounts through password reset. Do not build on it.

## Quick Start

```bash
git clone git@github.com:Alexandre-Lessard/badge-platform.git && cd badge-platform
pnpm install

# Worker secrets for local dev
cp apps/worker/.dev.vars.example apps/worker/.dev.vars
# Generate a dev keypair and a pepper — the file explains how

# Create the local D1, apply migrations, and fill it with seed data
pnpm dev:setup

# Both servers at once — API on 8787, frontend on 5173
pnpm dev
```

`pnpm dev:worker` and `pnpm dev:web` run them separately. `apps/web/.env.development` already
points at the local Worker (`VITE_API_URL=http://localhost:8787/api`); it is versioned, so there
is nothing to configure.

## Seed data

`pnpm run seed` wipes the local database and refills it with invented accounts, items in every
state (stolen, active, archived, recovered, insured, and the sparse case with no serial and no
photo), orders at every status, claimed and unclaimed sticker codes, and category-matching
photos. It is rerunnable, and production is not a valid target.

**Every seeded account signs in with `Seed1234!`.** Alex's five own accounts are recreated
account-only — no items, no orders — so the usual logins exist.

> **Never copy production client data into a local or staging database.** If a test genuinely
> needs real data, say so first, keep it to the narrowest slice, and delete it the same day.

## Environment Variables

### Worker (`apps/worker/.dev.vars` locally, `wrangler secret` in deployed environments)

Non-secret values (`FRONTEND_URL`, `API_URL`, `CORS_ORIGINS`, `NODE_ENV`, `FROM_EMAIL`,
`FROM_NAME`) live in `apps/worker/wrangler.jsonc` per environment and are versioned.
`API_URL` exists because one-click unsubscribe (RFC 8058) is POSTed by the mail client straight
to the Worker, so that email needs a link back to the API rather than to a page. Everything below is
a secret.

| Variable | Description | Required |
|---|---|---|
| `JWT_PRIVATE_KEY` | Ed25519 private key, base64-encoded PEM | yes |
| `JWT_PUBLIC_KEY` | Ed25519 public key, base64-encoded PEM | yes |
| `PASSWORD_PEPPER` | Secret mixed into the PBKDF2 input. Changing it invalidates every stored hash | yes |
| `BREVO_API_KEY` | Brevo transactional email. Unset: emails are logged, not sent | prod |
| `STRIPE_SECRET_KEY` | Unset: the shop returns 503 | prod |
| `STRIPE_WEBHOOK_SECRET` | Unset: webhooks return 503 and orders never become paid | prod |
| `R2_PUBLIC_URL` | Public base URL for uploaded files. Unset: uploads return 503 | prod + staging |
| `GOOGLE_CLIENT_ID` / `_SECRET` | Google OAuth | optional |
| `FACEBOOK_CLIENT_ID` / `_SECRET` | Facebook OAuth | optional |
| `MICROSOFT_CLIENT_ID` / `_SECRET` | Microsoft OAuth | optional |
| `META_CAPI_TOKEN` | Meta Conversions API. Unset: the server reports no purchase and only the browser pixel measures | prod |
| `ADMIN_ORDER_EMAIL` / `ADMIN_CONTACT_EMAIL` | Admin notification recipients | optional |

Most of these are `.optional()` in the schema, so the Worker boots without them and quietly
loses a feature instead. `apps/worker/secrets.manifest.json` declares what each deployed
environment must have, and CD refuses to deploy when one is missing. **Add a new secret to
that manifest in the same commit** — a unit test enforces it for the required ones.

Set one on a deployed environment with:

```bash
pnpm --filter @badge/worker exec wrangler secret put NAME --env staging
```

> Stripe Price IDs live in the `products` table, not in env vars. Configure them via
> `/admin/products`.
>
> `R2_PUBLIC_URL` must point at an enabled public domain for the bucket. If it is private,
> uploads still persist but image requests return 401 and the app shows fallbacks.
>
> `META_CAPI_TOKEN` is deliberately **production-only**. Set it on staging and test orders would
> land in the live Meta dataset, skewing the cost per acquisition the ads dashboard reports.

### Web (`apps/web/.env.development`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | API base URL | `http://localhost:8787/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (public) | optional |
| `VITE_FACEBOOK_CLIENT_ID` | Facebook app ID (public) | optional |
| `VITE_MICROSOFT_CLIENT_ID` | Microsoft client ID (public) | optional |

The OAuth buttons are gated on these at **build time**: unset means the buttons do not
render at all. `.env.production` is not tracked in git, so production values must be set in
the `deploy-web` job of `.github/workflows/cd.yml`.

## Scripts Reference

All scripts are run from the monorepo root with `pnpm`.

| Script              | Description                                      |
|---------------------|--------------------------------------------------|
| `pnpm dev`          | Start frontend dev server (port 5173)            |
| `pnpm --filter @badge/worker dev` | Start the API on a local D1 (port 8787) |
| `pnpm build`        | Build all packages                               |
| `pnpm build:web`    | Build frontend only                              |
| `pnpm lint`         | Typecheck across all packages                    |
| `pnpm test`         | Run tests across all packages                    |
| `pnpm run stripe:dev` | Forward Stripe webhooks to the local Worker    |

Deploys are automated — push to `staging` or `main`. See
[DEPLOYMENT.md](DEPLOYMENT.md). The `deploy` and `rollback` scripts still target the old
self-hosted stack and are no longer the production path.

### Working with D1

```bash
cd apps/worker
pnpm run db:generate                  # generate a migration from db/schema.ts
pnpm run db:migrate:local             # apply to the local D1
pnpm run db:migrate:staging           # apply to the remote staging D1
npx wrangler d1 execute badge-db-staging --local --env staging --command "SELECT ..."
```

Schema changes go through Drizzle migrations — never hand-edit the database.

## Testing

Tests use [Vitest](https://vitest.dev/). `apps/worker`, `apps/api` and `apps/web` each have their own suite.

```bash
pnpm test          # Run all tests across the monorepo
```

Package-level commands:

```bash
cd apps/worker && pnpm test       # Worker tests only
cd apps/web && pnpm test          # Web tests only
cd apps/web && pnpm test:watch    # Web tests in watch mode
```

Test files are colocated in `src/__tests__/` directories within each package.

## Database

The project uses [Drizzle ORM](https://orm.drizzle.team/) with Cloudflare D1 (SQLite), via `sqlite-core`. The legacy `apps/api` still uses `pg-core` against PostgreSQL.

Migrations are **not** automatic any more — a Worker has no startup hook. CD applies them
with `wrangler d1 migrations apply` before deploying, and you apply them locally yourself.

Drizzle Kit and wrangler commands (run from `apps/worker/`):

| Command | Description |
|---|---|
| `pnpm run db:generate` | Generate a migration file from schema changes |
| `pnpm run db:migrate:local` | Apply migrations to the local D1 |
| `pnpm run db:migrate:staging` | Apply migrations to the remote staging D1 |

Typical workflow: edit `src/db/schema.ts`, run `pnpm run db:generate`, then
`pnpm run db:migrate:local`, and commit the generated file in `migrations/`.

## Stripe (Local Dev)

To receive Stripe webhooks locally:

```bash
pnpm run stripe:dev
```

This uses the Stripe CLI to forward webhook events to `localhost:8787/api/shop/webhook`. On first use, run `stripe login` to authenticate.

The CLI prints a temporary webhook signing secret (`whsec_...`). Copy it into `apps/worker/.dev.vars` as `STRIPE_WEBHOOK_SECRET`.
