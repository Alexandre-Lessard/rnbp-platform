#!/bin/bash
# RNBP maintenance script — session cleanup
# Run daily via cron: 0 3 * * * /opt/rnbp/repo/ops/cleanup.sh
#
# Backups are handled by Proxmox vzdump (weekly snapshots of CT 239 + 241)
# This script only cleans expired sessions from the database.
#
# Prerequisites:
# - psql available (postgresql-client)
# - .env file at /opt/rnbp/.env with DATABASE_URL

set -euo pipefail

# Load env
set -a
source /opt/rnbp/.env
set +a

psql "$DATABASE_URL" -c "DELETE FROM sessions WHERE expires_at < NOW();" 2>/dev/null && \
    echo "[$(date)] Cleaned expired sessions" || \
    echo "[$(date)] Session cleanup skipped (psql error)"
