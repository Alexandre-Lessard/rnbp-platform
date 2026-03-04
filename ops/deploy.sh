#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────
# RNBP Deploy Script
# Usage: ./ops/deploy.sh [all|web|api]
# ──────────────────────────────────────────────

LOCK_FILE="/tmp/rnbp-deploy.lock"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$ROOT_DIR/.deploy.env"

RSYNC_EXCLUDES=(
  --exclude='node_modules'
  --exclude='.git'
  --exclude='dist'
  --exclude='.env'
  --exclude='.deploy.env'
  --exclude='NOTES.md'
  --exclude='notes'
  --exclude='design'
)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${CYAN}[deploy]${NC} $1"; }
ok()    { echo -e "${GREEN}[  ok  ]${NC} $1"; }
warn()  { echo -e "${YELLOW}[ warn ]${NC} $1"; }
error() { echo -e "${RED}[error ]${NC} $1" >&2; }

usage() {
  echo "Usage: ./ops/deploy.sh [all|web|api]"
  echo ""
  echo "  all   Deploy both frontend and backend (default)"
  echo "  web   Deploy frontend to Cloudflare Pages only"
  echo "  api   Deploy backend to server only"
  echo ""
  echo "Requires .deploy.env at project root (see .deploy.env.example)"
  exit 0
}

cleanup() {
  rm -f "$LOCK_FILE"
}

# ── Args ──────────────────────────────────────

TARGET="${1:-all}"

if [[ "$TARGET" == "--help" || "$TARGET" == "-h" ]]; then
  usage
fi

if [[ "$TARGET" != "all" && "$TARGET" != "web" && "$TARGET" != "api" ]]; then
  error "Unknown target: $TARGET"
  usage
fi

# ── Lock ──────────────────────────────────────

if [[ -f "$LOCK_FILE" ]]; then
  error "Deploy already in progress (lock: $LOCK_FILE)"
  error "If this is stale, remove it: rm $LOCK_FILE"
  exit 1
fi

trap cleanup EXIT
echo $$ > "$LOCK_FILE"

# ── Load config ───────────────────────────────

if [[ ! -f "$ENV_FILE" ]]; then
  error ".deploy.env not found at $ENV_FILE"
  error "Copy .deploy.env.example and fill in your values"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

# Validate required vars
for var in DEPLOY_SERVER DEPLOY_DIR CF_PROJECT API_HEALTH_URL; do
  if [[ -z "${!var:-}" ]]; then
    error "Missing $var in .deploy.env"
    exit 1
  fi
done

cd "$ROOT_DIR"

# ── Pre-checks ────────────────────────────────

COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "no-git")
log "Deploying commit: $COMMIT ($(git log -1 --format='%s' 2>/dev/null || echo 'unknown'))"

# ── Build ─────────────────────────────────────

log "Building..."
pnpm --filter @rnbp/shared build
pnpm --filter @rnbp/web build
pnpm --filter @rnbp/api build
ok "Build complete"

# ── Deploy Web ────────────────────────────────

deploy_web() {
  log "Deploying frontend to Cloudflare Pages..."
  npx wrangler pages deploy apps/web/dist --project-name "$CF_PROJECT"
  ok "Frontend deployed"
}

# ── Deploy API ────────────────────────────────

deploy_api() {
  log "Syncing code to $DEPLOY_SERVER..."
  rsync -avz "${RSYNC_EXCLUDES[@]}" "$ROOT_DIR/" "$DEPLOY_SERVER:$DEPLOY_DIR/"
  ok "Code synced"

  log "Installing dependencies and building on server..."
  ssh "$DEPLOY_SERVER" "source ~/.nvm/nvm.sh && cd $DEPLOY_DIR && pnpm install --frozen-lockfile && pnpm --filter @rnbp/shared build && pnpm --filter @rnbp/api build"
  ok "Server build complete"

  # Migration prompt
  log "Checking for pending migrations..."
  MIGRATION_FILES=$(ssh "$DEPLOY_SERVER" "ls -1 $DEPLOY_DIR/apps/api/drizzle/*.sql 2>/dev/null" || true)

  if [[ -n "$MIGRATION_FILES" ]]; then
    echo ""
    warn "Migration files found:"
    echo "$MIGRATION_FILES"
    echo ""
    if [[ -t 0 ]]; then
      read -rp "Run migrations? [y/N] " REPLY
      if [[ "$REPLY" =~ ^[Yy]$ ]]; then
        log "Running migrations..."
        ssh "$DEPLOY_SERVER" "source ~/.nvm/nvm.sh && cd $DEPLOY_DIR/apps/api && node --env-file=/opt/rnbp/.env dist/migrate.js"
        ok "Migrations applied"
      else
        warn "Migrations skipped"
      fi
    else
      warn "Non-interactive mode — migrations skipped (run manually if needed)"
    fi
  else
    ok "No migration files found"
  fi

  log "Restarting API service..."
  ssh "$DEPLOY_SERVER" "sudo systemctl restart rnbp-api"
  ok "API service restarted"

  # Health check
  log "Waiting for API to start..."
  sleep 3

  for i in 1 2 3; do
    if ssh "$DEPLOY_SERVER" "curl -sf http://localhost:3000/api/health" > /dev/null 2>&1; then
      ok "Health check passed"
      return 0
    fi
    warn "Health check attempt $i/3 failed, retrying in 2s..."
    sleep 2
  done

  error "Health check failed after 3 attempts!"
  error "Check logs: ssh $DEPLOY_SERVER 'sudo journalctl -u rnbp-api -n 50'"
  exit 1
}

# ── Execute ───────────────────────────────────

case "$TARGET" in
  web) deploy_web ;;
  api) deploy_api ;;
  all)
    deploy_web
    deploy_api
    ;;
esac

# ── Done ──────────────────────────────────────

echo ""
ok "Deploy complete!"
log "Commit deployed: $COMMIT"
