# RNBP / NRPP

Registre national des biens personnels — National Registry of Personal Property.

Plateforme permettant aux Canadiens d'enregistrer, protéger et retrouver leurs biens de valeur.

## Stack

| Couche | Technologies |
|--------|-------------|
| Frontend | React 19, Vite 6, Tailwind CSS 4, React Router 7 |
| Backend | Fastify 5, Drizzle ORM, PostgreSQL 16 |
| Auth | JWT EdDSA (Ed25519), Argon2 |
| Infra | Cloudflare Pages (frontend), Cloudflare Tunnel (backend) |
| Monorepo | pnpm workspaces |

## Structure

```
rcdb-app/
├── apps/
│   ├── api/          # Backend Fastify (REST API)
│   └── web/          # Frontend React (SPA)
├── packages/
│   └── shared/       # Types et constantes partagés
├── ops/              # Scripts d'opérations (deploy, backup, systemd)
└── .github/          # CI (lint + typecheck)
```

## Prérequis

- Node.js 20+
- pnpm 9+
- PostgreSQL 16 (pour le backend)

## Quick Start

```bash
# Installer les dépendances
pnpm install

# Configurer l'API
cp apps/api/.env.example apps/api/.env
# Éditer apps/api/.env (DATABASE_URL, JWT keys, etc.)

# Lancer en dev (frontend + backend)
pnpm dev:all
```

Le frontend est accessible sur `http://localhost:5173`, l'API sur `http://localhost:3000`.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Lance le frontend en dev |
| `pnpm dev:api` | Lance le backend en dev |
| `pnpm dev:all` | Lance frontend + backend en parallèle |
| `pnpm build` | Build tous les packages |
| `pnpm build:web` | Build le frontend uniquement |
| `pnpm build:api` | Build le backend uniquement |
| `pnpm lint` | Typecheck tous les packages |
| `pnpm run deploy` | Déploie frontend + backend en prod |
| `pnpm run deploy:web` | Déploie le frontend uniquement |
| `pnpm run deploy:api` | Déploie le backend uniquement |

## Déploiement

Le déploiement se fait via `./ops/deploy.sh` (script local, pas de CI/CD).

Voir [ops/SETUP.md](ops/SETUP.md) pour le guide complet de mise en production.

### Configuration requise

1. **`.deploy.env`** (racine) — configuration du déploiement (voir `.deploy.env.example`)
2. **`apps/api/.env`** (serveur) — variables d'environnement API (voir `apps/api/.env.example`)

## Documentation

- [API Backend](apps/api/README.md)
- [Frontend Web](apps/web/README.md)
- [Guide de production](ops/SETUP.md)
