#!/bin/bash
# Database Backup Script
# Automated PostgreSQL backup with rotation

# Load environment variables
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SOURCE_DIR/../.env"

if [ -f "$ENV_FILE" ]; then
    export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/predix}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="predix_backup_${DATE}.sql.gz"
S3_BUCKET="${S3_BACKUP_BUCKET:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if PostgreSQL is reachable
log "Checking database connection..."
if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; then
    error "Cannot connect to database"
    exit 1
fi

log "Starting backup of database: $DB_NAME"

# Create backup
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -Fc \
    -b \
    -v \
    -f "${BACKUP_DIR}/${BACKUP_FILE%.gz}" \
    "$DB_NAME" 2>&1 | tee -a "${BACKUP_DIR}/backup.log"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    error "Backup failed!"
    exit 1
fi

# Compress backup
log "Compressing backup..."
gzip -f "${BACKUP_DIR}/${BACKUP_FILE%.gz}"

if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    error "Compression failed!"
    exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
log "Backup created successfully: ${BACKUP_FILE} (${BACKUP_SIZE})"

# Upload to S3 if configured
if [ -n "$S3_BUCKET" ]; then
    log "Uploading backup to S3..."
    if command -v aws &> /dev/null; then
        aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}" "s3://${S3_BUCKET}/backups/${BACKUP_FILE}"
        
        if [ $? -eq 0 ]; then
            log "Backup uploaded to S3 successfully"
        else
            warn "S3 upload failed, backup still available locally"
        fi
    else
        warn "AWS CLI not found, skipping S3 upload"
    fi
fi

# Cleanup old backups
log "Cleaning up old backups (older than ${RETENTION_DAYS} days)..."
find "$BACKUP_DIR" -name "predix_backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

# Cleanup old backups from S3
if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
    CUTOFF_DATE=$(date -d "${RETENTION_DAYS} days ago" +%Y%m%d)
    aws s3 ls "s3://${S3_BUCKET}/backups/" | while read -r line; do
        FILE=$(echo "$line" | awk '{print $4}')
        FILE_DATE=$(echo "$FILE" | grep -oP '\d{8}' | head -1)
        
        if [ -n "$FILE_DATE" ] && [ "$FILE_DATE" -lt "$CUTOFF_DATE" ]; then
            log "Deleting old S3 backup: $FILE"
            aws s3 rm "s3://${S3_BUCKET}/backups/${FILE}"
        fi
    done
fi

# Summary
log "=== Backup Summary ==="
log "Database: $DB_NAME"
log "Backup file: ${BACKUP_FILE}"
log "Size: ${BACKUP_SIZE}"
log "Location: ${BACKUP_DIR}"
if [ -n "$S3_BUCKET" ]; then
    log "S3 Location: s3://${S3_BUCKET}/backups/${BACKUP_FILE}"
fi
log "Retention: ${RETENTION_DAYS} days"
log "=== Backup Complete ==="

# Send notification (optional)
if command -v mailx &> /dev/null && [ -n "$BACKUP_NOTIFICATION_EMAIL" ]; then
    echo "Database backup completed successfully: ${BACKUP_FILE} (${BACKUP_SIZE})" | \
        mailx -s "Predix Database Backup - Success" "$BACKUP_NOTIFICATION_EMAIL"
fi

exit 0
