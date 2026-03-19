# RNBP / NRPP

<!-- ![CI](https://github.com/USER/REPO/actions/workflows/ci.yml/badge.svg) -->

**National Registry of Personal Property** — A platform for Canadians to register, protect, and recover their valuable belongings.

## What is this?

RNBP (Registre National des Biens Personnels) / NRPP (National Registry of Personal Property) is a bilingual Canadian web application that lets users catalog their personal property, generate unique RNBP tracking numbers, report thefts to aid recovery, and request insurance discounts from participating insurers.

The platform serves both French and English speakers through a bi-domain architecture: `rnbp.ca` (French) and `nrpp.ca` (English).

## Key Features

- **Item Registration** — Catalog belongings with photos, documents, serial numbers, and estimated values
- **RNBP Tracking Numbers** — Unique identifiers (stickers) assigned to registered items for identification and recovery
- **Theft Reporting** — Declare stolen items with police report details; items are flagged across the registry
- **Public Lookup** — Anyone can look up an RNBP number to check if an item is registered or reported stolen
- **Insurance Integration** — Send proof of registration to your insurer to request a home insurance discount
- **Google OAuth** — Sign in with Google (Microsoft OAuth ready, pending Azure configuration)
- **Stripe Checkout** — Purchase RNBP sticker sheets with tax calculation and shipping
- **Bilingual UI** — Full French/English support with instant language toggle, hostname-based detection
- **Bilingual Error Handling** — Centralized error codes mapped to both languages via i18n

## Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| API Framework | **Fastify 5** | 2-3x faster than Express, TypeScript-first, built-in schema validation, plugin system |
| JWT Algorithm | **EdDSA (Ed25519)** | Smaller tokens than RS256, faster signing/verification, modern standard (RFC 8037) |
| Password Hashing | **Argon2** | Memory-hard (resistant to GPU attacks), OWASP recommended over bcrypt |
| ORM | **Drizzle** | Type-safe SQL, no code generation step, lighter than Prisma, supports raw SQL escape hatches |
| Infrastructure | **Cloudflare Tunnel** | No public IP needed, zero-config TLS, no nginx/certbot, DDoS protection included |
| Monorepo | **pnpm workspaces** | Shared types/constants between frontend and backend, single lockfile, fast installs |
| Validation | **Zod** | Same schemas used on both frontend and backend, TypeScript inference |
| OAuth | **Authorization Code + PKCE** | Industry standard (OAuth 2.1), code exchange server-side, state parameter for CSRF protection |
| Email Verification | **HMAC signed tokens** | Stateless (no DB lookup), timing-safe comparison, expiry built into the token |
| Error Handling | **Centralized error codes** | Shared constants between backend and frontend, bilingual mapping via i18n |

## Architecture

```
rnbp.ca / nrpp.ca          api.rnbp.ca
       |                         |
 Cloudflare Pages         Cloudflare Tunnel
       |                         |
   React SPA              Fastify REST API
   (Vite 6)                      |
                            PostgreSQL 16
```

- **Frontend**: React 19 SPA served via Cloudflare Pages. Bilingual via hostname detection (`rnbp.ca` = FR, `nrpp.ca` = EN).
- **Backend**: Fastify 5 behind Cloudflare Tunnel. No public IP, no nginx. Auto-migrating Drizzle ORM.
- **Auth**: JWT EdDSA access/refresh tokens with server-side sessions. OAuth via Google (PKCE). Argon2 password hashing.

## Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite 6, Tailwind CSS 4, React Router 7 |
| Backend | Fastify 5, Drizzle ORM, PostgreSQL 16 |
| Auth | JWT EdDSA (Ed25519 via jose), Argon2, Google OAuth |
| Validation | Zod (shared frontend/backend) |
| Payments | Stripe Checkout |
| Emails | Brevo (transactional) |
| Infrastructure | Cloudflare Pages + Cloudflare Tunnel |
| Monorepo | pnpm workspaces, tsup (API), Vite (web) |
| CI | GitHub Actions (lint + typecheck + tests) |
| Testing | Vitest |

## Project Structure

```
rnbp-app/
├── apps/
│   ├── api/              # Fastify REST API
│   │   └── src/
│   │       ├── routes/       # API endpoints
│   │       ├── middleware/    # Auth, error handling, security
│   │       ├── db/           # Drizzle schema and client
│   │       ├── utils/        # Tokens, password, email, OAuth
│   │       ├── constants/    # Time constants
│   │       └── __tests__/    # Unit tests (Vitest)
│   └── web/              # React SPA
│       └── src/
│           ├── pages/        # Route pages
│           ├── components/   # UI components
│           ├── lib/          # Auth context, API client, OAuth
│           ├── i18n/         # Bilingual translations (FR/EN)
│           └── __tests__/    # Component tests (Vitest)
├── packages/
│   └── shared/           # Shared types, schemas, constants, error codes
├── ops/                  # Deploy scripts, systemd service, backup, SETUP guide
├── docs/                 # Development, deployment, architecture guides
└── .github/              # CI workflow (lint + typecheck + tests)
```

## Getting Started

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for prerequisites, setup, and available scripts.

## Documentation

- [Development Guide](docs/DEVELOPMENT.md) — Setup, scripts, testing, environment variables
- [Deployment Guide](docs/DEPLOYMENT.md) — Deploy process, configuration, domains
- [Architecture](docs/ARCHITECTURE.md) — Technical decisions, auth flow, OAuth, i18n strategy
- [Production Setup](ops/SETUP.md) — Full infrastructure guide (Proxmox, Cloudflare, PostgreSQL, systemd)
- [API Reference](apps/api/README.md)
- [Frontend Reference](apps/web/README.md)

## License

Copyright (c) 2025-2026 RNBP Inc. All rights reserved. See [LICENSE](LICENSE).
