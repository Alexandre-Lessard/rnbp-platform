#!/bin/bash
# RCBP database backup script
# Run daily via cron: 0 3 * * * /opt/rcbp/deploy/backup.sh
#
# Prerequisites:
# - rclone configured with a remote named "rcbp-backup" (Cloudflare R2 or S3-compatible)
# - pg_dump available
# - .env file at /opt/rcbp/.env with DATABASE_URL

set -euo pipefail

BACKUP_DIR="/opt/rcbp/backups"
RETENTION_DAYS=14
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/rcbp_${TIMESTAMP}.sql.gz"

# Load env
set -a
source /opt/rcbp/.env
set +a

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."

# Dump and compress
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"

echo "[$(date)] Backup created: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

# Upload to remote storage (if rclone is configured)
if command -v rclone &> /dev/null && rclone listremotes | grep -q "rcbp-backup:"; then
    rclone copy "$BACKUP_FILE" rcbp-backup:rcbp-backups/ --progress
    echo "[$(date)] Uploaded to remote storage"
else
    echo "[$(date)] rclone not configured — local backup only"
fi

# Clean old local backups
find "$BACKUP_DIR" -name "rcbp_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Cleaned backups older than ${RETENTION_DAYS} days"

echo "[$(date)] Backup complete"
