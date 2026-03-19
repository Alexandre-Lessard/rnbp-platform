# Deployment Guide — RNBP / NRPP

## Overview

Deployment is done via local scripts using rsync. There is no CI/CD pipeline for deployment (CI only runs lint and typecheck).

- **Frontend** (React SPA) is deployed to **Cloudflare Pages**.
- **Backend** (Fastify API) is deployed via rsync to a Proxmox container, exposed through a **Cloudflare Tunnel**. No nginx, no certbot, no public IP.

```
rnbp.ca / nrpp.ca  -->  Cloudflare Pages  -->  React SPA
api.rnbp.ca        -->  Cloudflare Tunnel  -->  Fastify (port 3000)  -->  PostgreSQL 16
```

## Deploy Commands

All commands are run from the repo root on the dev machine.

| Command | Description |
|---------|-------------|
| `pnpm run deploy` | Deploy everything (frontend + backend) |
| `pnpm run deploy:web` | Deploy frontend only (Cloudflare Pages) |
| `pnpm run deploy:api` | Deploy backend only (rsync + restart) |
| `pnpm run rollback` | Rollback API to the latest snapshot |
| `pnpm run rollback 2` | Rollback to the 2nd most recent snapshot |

**Important**: Use `pnpm run deploy`, not `pnpm deploy` (which is a native pnpm command).

The deploy script creates a snapshot before each backend deploy. If the health check fails after deploy, automatic rollback is offered. To disable: `pnpm run deploy:api -- --no-auto-rollback`.

## Configuration

### Local (dev machine)

Create `.deploy.env` at the repo root:

```bash
cp .deploy.env.example .deploy.env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DEPLOY_SERVER` | SSH connection string (e.g., `prod@192.168.50.241`) |
| `DEPLOY_DIR` | Path to the repo on the server (e.g., `/opt/rnbp/repo`) |
| `CF_PROJECT` | Cloudflare Pages project name (e.g., `rnbp-web`) |
| `API_HEALTH_URL` | Health check endpoint (e.g., `https://api.rnbp.ca/api/health`) |

SSH access to the production server must be configured (key-based auth).

### Production server

The API environment file lives at `/opt/rnbp/.env` on the server (not inside the repo). It contains database credentials, JWT keys, CORS origins, Brevo API key, etc. See `ops/SETUP.md` section 4 for the full list of variables.

## Production Setup

For the complete infrastructure guide (Proxmox containers, PostgreSQL, Node.js, systemd, Cloudflare Tunnel, Cloudflare Pages, DNS, backups, monitoring, troubleshooting), see:

**[ops/SETUP.md](../ops/SETUP.md)**

## Domains

| Domain | Language | Service |
|--------|----------|---------|
| `rnbp.ca` | French (default) | Cloudflare Pages |
| `nrpp.ca` | English (default) | Cloudflare Pages |
| `api.rnbp.ca` | -- | Cloudflare Tunnel to Fastify |

Language detection priority: localStorage > hostname > navigator.language > default.
