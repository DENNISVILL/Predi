#!/bin/sh

# Docker entrypoint script for Predix Frontend
set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting Predix Frontend container..."

# Create runtime configuration file with environment variables
cat > /usr/share/nginx/html/config.js << EOF
window.PREDIX_CONFIG = {
    API_URL: '${REACT_APP_API_URL:-http://localhost:8000}',
    WS_URL: '${REACT_APP_WS_URL:-ws://localhost:8000}',
    ENVIRONMENT: '${ENVIRONMENT:-production}',
    VERSION: '${APP_VERSION:-1.0.0}',
    SENTRY_DSN: '${SENTRY_DSN:-}',
    GOOGLE_ANALYTICS_ID: '${GOOGLE_ANALYTICS_ID:-}'
};
EOF

log "Configuration file created with environment variables"

# Ensure proper permissions
chown predix:predix /usr/share/nginx/html/config.js

# Create nginx PID directory
mkdir -p /tmp/nginx
chown predix:predix /tmp/nginx

log "Starting Nginx..."

# Execute the main command
exec "$@"
