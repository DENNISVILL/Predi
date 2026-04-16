#!/bin/bash

# SSL/TLS Setup Script for Predix on Hetzner Cloud
# Configures Let's Encrypt certificates with automatic renewal

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${1:-staging}
DOMAIN=${2:-predix.com}
EMAIL=${3:-ssl@predix.com}

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

# Install required packages
install_dependencies() {
    log_info "Installing SSL dependencies..."
    
    sudo apt-get update
    sudo apt-get install -y \
        certbot \
        python3-certbot-nginx \
        python3-certbot-dns-cloudflare \
        nginx \
        openssl \
        curl
    
    log_success "Dependencies installed"
}

# Configure Nginx for SSL
configure_nginx() {
    log_info "Configuring Nginx for SSL..."
    
    # Determine domains based on environment
    local main_domain
    local api_domain
    local www_domain
    local grafana_domain
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        main_domain="$DOMAIN"
        api_domain="api.$DOMAIN"
        www_domain="www.$DOMAIN"
        grafana_domain="grafana.$DOMAIN"
    else
        main_domain="$ENVIRONMENT.$DOMAIN"
        api_domain="api-$ENVIRONMENT.$DOMAIN"
        www_domain="www-$ENVIRONMENT.$DOMAIN"
        grafana_domain="grafana-$ENVIRONMENT.$DOMAIN"
    fi
    
    # Create Nginx configuration for main domain
    sudo tee /etc/nginx/sites-available/predix << EOF
# Predix Nginx Configuration with SSL
server {
    listen 80;
    server_name $main_domain $www_domain;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $main_domain $www_domain;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$main_domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$main_domain/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/$main_domain/chain.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' wss: https:;" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
    
    # Rate Limiting
    limit_req_zone \$binary_remote_addr zone=main:10m rate=10r/s;
    limit_req zone=main burst=20 nodelay;
    
    # Root directory
    root /var/www/predix;
    index index.html;
    
    # Frontend routes
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # WebSocket proxy
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 86400;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# API subdomain
server {
    listen 80;
    server_name $api_domain;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $api_domain;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$main_domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$main_domain/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/$main_domain/chain.pem;
    
    # SSL Security Settings (same as above)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate Limiting for API
    limit_req_zone \$binary_remote_addr zone=api:10m rate=30r/s;
    limit_req zone=api burst=50 nodelay;
    
    # Proxy all requests to backend
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}

# Monitoring subdomain
server {
    listen 80;
    server_name $grafana_domain;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $grafana_domain;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$main_domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$main_domain/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/$main_domain/chain.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Basic Auth for monitoring
    auth_basic "Predix Monitoring";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    # Proxy to Grafana
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/predix /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    sudo nginx -t
    
    log_success "Nginx configured for SSL"
}

# Obtain SSL certificates
obtain_certificates() {
    log_info "Obtaining SSL certificates from Let's Encrypt..."
    
    local main_domain
    local api_domain
    local www_domain
    local grafana_domain
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        main_domain="$DOMAIN"
        api_domain="api.$DOMAIN"
        www_domain="www.$DOMAIN"
        grafana_domain="grafana.$DOMAIN"
    else
        main_domain="$ENVIRONMENT.$DOMAIN"
        api_domain="api-$ENVIRONMENT.$DOMAIN"
        www_domain="www-$ENVIRONMENT.$DOMAIN"
        grafana_domain="grafana-$ENVIRONMENT.$DOMAIN"
    fi
    
    # Stop Nginx temporarily
    sudo systemctl stop nginx
    
    # Obtain certificate for all domains
    sudo certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        -d "$main_domain" \
        -d "$api_domain" \
        -d "$www_domain" \
        -d "$grafana_domain"
    
    # Start Nginx
    sudo systemctl start nginx
    
    log_success "SSL certificates obtained"
}

# Setup automatic renewal
setup_renewal() {
    log_info "Setting up automatic certificate renewal..."
    
    # Create renewal script
    sudo tee /usr/local/bin/renew-ssl.sh << 'EOF'
#!/bin/bash

# SSL Certificate Renewal Script
LOG_FILE="/var/log/ssl-renewal.log"

echo "$(date): Starting SSL certificate renewal" >> $LOG_FILE

# Renew certificates
if certbot renew --quiet --nginx; then
    echo "$(date): Certificate renewal successful" >> $LOG_FILE
    
    # Reload Nginx
    systemctl reload nginx
    echo "$(date): Nginx reloaded" >> $LOG_FILE
    
    # Restart Docker services if needed
    if systemctl is-active --quiet predix; then
        systemctl restart predix
        echo "$(date): Predix services restarted" >> $LOG_FILE
    fi
else
    echo "$(date): Certificate renewal failed" >> $LOG_FILE
    exit 1
fi

echo "$(date): SSL renewal completed" >> $LOG_FILE
EOF
    
    sudo chmod +x /usr/local/bin/renew-ssl.sh
    
    # Setup cron job for automatic renewal
    echo "0 12 * * * /usr/local/bin/renew-ssl.sh" | sudo crontab -
    
    # Setup systemd timer as backup
    sudo tee /etc/systemd/system/ssl-renewal.service << EOF
[Unit]
Description=SSL Certificate Renewal
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/renew-ssl.sh
User=root
EOF
    
    sudo tee /etc/systemd/system/ssl-renewal.timer << EOF
[Unit]
Description=SSL Certificate Renewal Timer
Requires=ssl-renewal.service

[Timer]
OnCalendar=daily
RandomizedDelaySec=3600
Persistent=true

[Install]
WantedBy=timers.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable ssl-renewal.timer
    sudo systemctl start ssl-renewal.timer
    
    log_success "Automatic renewal configured"
}

# Create monitoring auth
setup_monitoring_auth() {
    log_info "Setting up monitoring authentication..."
    
    # Generate random password for monitoring
    local monitoring_password=$(openssl rand -base64 32)
    
    # Create htpasswd file
    echo "admin:$(openssl passwd -apr1 "$monitoring_password")" | sudo tee /etc/nginx/.htpasswd
    
    # Save credentials
    echo "Monitoring credentials:" > /opt/predix/monitoring-credentials.txt
    echo "Username: admin" >> /opt/predix/monitoring-credentials.txt
    echo "Password: $monitoring_password" >> /opt/predix/monitoring-credentials.txt
    chmod 600 /opt/predix/monitoring-credentials.txt
    
    log_success "Monitoring authentication configured"
    log_info "Monitoring credentials saved to /opt/predix/monitoring-credentials.txt"
}

# Configure firewall
configure_firewall() {
    log_info "Configuring firewall for SSL..."
    
    # Allow HTTPS traffic
    sudo ufw allow 443/tcp
    sudo ufw allow 80/tcp
    
    # Reload firewall
    sudo ufw reload
    
    log_success "Firewall configured for SSL"
}

# Test SSL configuration
test_ssl() {
    log_info "Testing SSL configuration..."
    
    local main_domain
    if [[ "$ENVIRONMENT" == "production" ]]; then
        main_domain="$DOMAIN"
    else
        main_domain="$ENVIRONMENT.$DOMAIN"
    fi
    
    # Test SSL certificate
    if openssl s_client -connect "$main_domain:443" -servername "$main_domain" < /dev/null 2>/dev/null | openssl x509 -noout -dates; then
        log_success "SSL certificate is valid"
    else
        log_error "SSL certificate test failed"
        return 1
    fi
    
    # Test HTTPS redirect
    if curl -s -I "http://$main_domain" | grep -q "301"; then
        log_success "HTTP to HTTPS redirect working"
    else
        log_warning "HTTP to HTTPS redirect may not be working"
    fi
    
    # Test security headers
    local headers=$(curl -s -I "https://$main_domain")
    if echo "$headers" | grep -q "Strict-Transport-Security"; then
        log_success "Security headers are present"
    else
        log_warning "Security headers may be missing"
    fi
    
    log_success "SSL configuration test completed"
}

# Main function
main() {
    echo "🔒 Setting up SSL/TLS for Predix on Hetzner Cloud"
    echo "Environment: $ENVIRONMENT"
    echo "Domain: $DOMAIN"
    echo "Email: $EMAIL"
    echo
    
    check_root
    install_dependencies
    configure_nginx
    obtain_certificates
    setup_renewal
    setup_monitoring_auth
    configure_firewall
    test_ssl
    
    echo
    log_success "🎉 SSL/TLS setup completed successfully!"
    echo
    echo "Your Predix application is now secured with SSL/TLS certificates."
    echo "Certificates will be automatically renewed every 12 hours."
    echo
    echo "URLs:"
    if [[ "$ENVIRONMENT" == "production" ]]; then
        echo "  Frontend: https://$DOMAIN"
        echo "  API: https://api.$DOMAIN"
        echo "  Monitoring: https://grafana.$DOMAIN"
    else
        echo "  Frontend: https://$ENVIRONMENT.$DOMAIN"
        echo "  API: https://api-$ENVIRONMENT.$DOMAIN"
        echo "  Monitoring: https://grafana-$ENVIRONMENT.$DOMAIN"
    fi
    echo
}

# Run main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
