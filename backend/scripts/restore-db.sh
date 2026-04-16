#!/bin/bash
# Database Restore Script
# Restore PostgreSQL database from backup

# Load environment variables
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SOURCE_DIR/../.env"

if [ -f "$ENV_FILE" ]; then
    export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/predix}"
S3_BUCKET="${S3_BACKUP_BUCKET:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# Usage
usage() {
    echo "Usage: $0 <backup_file>"
    echo ""
    echo "Restore database from backup"
    echo ""
    echo "Arguments:"
    echo "  backup_file    Path to backup file or backup filename (will search in $BACKUP_DIR)"
    echo ""
    echo "Options:"
    echo "  --from-s3      Download backup from S3 before restoring"
    echo "  --force        Skip confirmation prompt"
    echo ""
    echo "Examples:"
    echo "  $0 predix_backup_20241223_120000.sql.gz"
    echo "  $0 /path/to/backup.sql.gz"
    echo "  $0 --from-s3 predix_backup_20241223_120000.sql.gz"
    exit 1
}

# Parse arguments
BACKUP_FILE=""
FROM_S3=false
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --from-s3)
            FROM_S3=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            BACKUP_FILE="$1"
            shift
            ;;
    esac
done

if [ -z "$BACKUP_FILE" ]; then
    error "No backup file specified"
    usage
fi

# Download from S3 if requested
if [ "$FROM_S3" = true ]; then
    if [ -z "$S3_BUCKET" ]; then
        error "S3_BACKUP_BUCKET not configured"
        exit 1
    fi
    
    if ! command -v aws &> /dev/null; then
        error "AWS CLI not installed"
        exit 1
    fi
    
    log "Downloading backup from S3..."
    BASENAME=$(basename "$BACKUP_FILE")
    aws s3 cp "s3://${S3_BUCKET}/backups/${BASENAME}" "${BACKUP_DIR}/${BASENAME}"
    
    if [ $? -ne 0 ]; then
        error "Failed to download from S3"
        exit 1
    fi
    
    BACKUP_FILE="${BACKUP_DIR}/${BASENAME}"
fi

# Find backup file
if [ ! -f "$BACKUP_FILE" ]; then
    # Try in backup directory
    if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
        BACKUP_FILE="${BACKUP_DIR}/${BACKUP_FILE}"
    else
        error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
fi

# Confirmation prompt
if [ "$FORCE" = false ]; then
    warn "This will REPLACE the current database: $DB_NAME"
    warn "Backup file: $BACKUP_FILE"
    read -p "Are you sure you want to continue? (yes/no): " CONFIRM
    
    if [ "$CONFIRM" != "yes" ]; then
        log "Restore cancelled"
        exit 0
    fi
fi

# Create safety backup before restore
log "Creating safety backup of current database..."
SAFETY_BACKUP="${BACKUP_DIR}/pre_restore_backup_$(date +%Y%m%d_%H%M%S).sql.gz"

PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -Fc \
    "$DB_NAME" | gzip > "$SAFETY_BACKUP"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    error "Safety backup failed! Aborting restore."
    exit 1
fi

log "Safety backup created: $SAFETY_BACKUP"

# Decompress if needed
RESTORE_FILE="$BACKUP_FILE"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    log "Decompressing backup..."
    RESTORE_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$RESTORE_FILE"
    
    if [ $? -ne 0 ]; then
        error "Decompression failed"
        exit 1
    fi
fi

# Terminate active connections
log "Terminating active connections to database..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres <<EOF
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DB_NAME'
  AND pid <> pg_backend_pid();
EOF

# Drop and recreate database
log "Dropping and recreating database..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres <<EOF
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
EOF

if [ $? -ne 0 ]; then
    error "Failed to recreate database"
    log "Attempting to restore from safety backup..."
    
    # Restore safety backup
    PGPASSWORD="$DB_PASSWORD" pg_restore \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -c \
        "$SAFETY_BACKUP"
    
    exit 1
fi

# Restore backup
log "Restoring database from backup..."
PGPASSWORD="$DB_PASSWORD" pg_restore \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -v \
    "$RESTORE_FILE" 2>&1 | tee -a "${BACKUP_DIR}/restore.log"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    error "Restore failed!"
    log "Safety backup available at: $SAFETY_BACKUP"
    exit 1
fi

# Cleanup decompressed file if we created it
if [[ "$BACKUP_FILE" == *.gz ]]; then
    rm -f "$RESTORE_FILE"
fi

# Verify restore
log "Verifying restore..."
TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")

log "Tables restored: $TABLE_COUNT"

# Summary
log "=== Restore Summary ==="
log "Database: $DB_NAME"
log "Backup file: $BACKUP_FILE"
log "Tables: $TABLE_COUNT"
log "Safety backup: $SAFETY_BACKUP"
log "=== Restore Complete ==="

# Send notification
if command -v mailx &> /dev/null && [ -n "$BACKUP_NOTIFICATION_EMAIL" ]; then
    echo "Database restore completed successfully from: $(basename $BACKUP_FILE)" | \
        mailx -s "Predix Database Restore - Success" "$BACKUP_NOTIFICATION_EMAIL"
fi

exit 0
