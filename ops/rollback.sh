#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────
# RNBP Rollback Script
# Usage: ./ops/rollback.sh [snapshot_index] [--auto]
#
# Without args: lists snapshots, picks the latest, asks confirmation
# With index:   picks the Nth snapshot (1 = latest)
# With --auto:  skip confirmation (for use by deploy.sh)
# ──────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$ROOT_DIR/.deploy.env"
ROLLBACK_DIR=/opt/rnbp/backups/rollback

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${CYAN}[rollback]${NC} $1"; }
ok()    { echo -e "${GREEN}[   ok   ]${NC} $1"; }
warn()  { echo -e "${YELLOW}[  warn  ]${NC} $1"; }
error() { echo -e "${RED}[ error  ]${NC} $1" >&2; }

# ── Args ──────────────────────────────────────

SNAPSHOT_INDEX=1
AUTO=false

for arg in "$@"; do
  case "$arg" in
    --auto) AUTO=true ;;
    [0-9]*) SNAPSHOT_INDEX="$arg" ;;
    --help|-h)
      echo "Usage: ./ops/rollback.sh [snapshot_index] [--auto]"
      echo ""
      echo "  snapshot_index   Which snapshot to restore (1 = latest, default)"
      echo "  --auto           Skip confirmation prompt"
      exit 0
      ;;
    *) error "Unknown argument: $arg"; exit 1 ;;
  esac
done

# ── Load config ───────────────────────────────

if [[ ! -f "$ENV_FILE" ]]; then
  error ".deploy.env not found at $ENV_FILE"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

# ── List snapshots ────────────────────────────

log "Available dist snapshots:"
SNAPSHOTS=$(ssh "$DEPLOY_SERVER" "ls -1t $ROLLBACK_DIR/*.tar.gz 2>/dev/null | grep -v '^.*db_.*'" || true)

if [[ -z "$SNAPSHOTS" ]]; then
  error "No rollback snapshots found on server"
  exit 1
fi

echo "$SNAPSHOTS" | nl -ba
echo ""

# DB dumps
DB_DUMPS=$(ssh "$DEPLOY_SERVER" "ls -1t $ROLLBACK_DIR/db_*.sql.gz 2>/dev/null" || true)
if [[ -n "$DB_DUMPS" ]]; then
  log "Available DB backups:"
  echo "$DB_DUMPS" | nl -ba
  echo ""
fi

# ── Select snapshot ───────────────────────────

SNAPSHOT=$(echo "$SNAPSHOTS" | sed -n "${SNAPSHOT_INDEX}p")

if [[ -z "$SNAPSHOT" ]]; then
  error "Invalid snapshot index: $SNAPSHOT_INDEX"
  exit 1
fi

log "Selected: $(basename "$SNAPSHOT")"

# ── Confirm ───────────────────────────────────

if [[ "$AUTO" != "true" ]]; then
  read -rp "$(echo -e "${YELLOW}Restore this snapshot and restart API? [y/N]${NC} ")" REPLY
  if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
    warn "Rollback cancelled"
    exit 0
  fi
fi

# ── Restore ───────────────────────────────────

log "Restoring snapshot..."
ssh "$DEPLOY_SERVER" "tar -xzf $SNAPSHOT -C $DEPLOY_DIR"
ok "Snapshot restored"

log "Restarting API service..."
ssh "$DEPLOY_SERVER" "sudo systemctl restart rnbp-api"

# ── Health check ──────────────────────────────

log "Waiting for API to start..."
sleep 3

for i in 1 2 3; do
  if ssh "$DEPLOY_SERVER" "curl -sf http://localhost:3000/api/health" > /dev/null 2>&1; then
    echo ""
    ok "Rollback complete — API is healthy!"
    exit 0
  fi
  warn "Health check attempt $i/3 failed, retrying in 2s..."
  sleep 2
done

error "Health check failed after rollback!"
error "Check logs: ssh $DEPLOY_SERVER 'sudo journalctl -u rnbp-api -n 50'"
exit 1
