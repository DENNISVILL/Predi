#!/bin/bash

# Predix Deployment Script for Hetzner Cloud
# Usage: ./deploy.sh [staging|production]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TERRAFORM_DIR="$PROJECT_ROOT/infrastructure/terraform"

# Functions
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

check_dependencies() {
    log_info "Checking dependencies..."
    
    # Check if required tools are installed
    local deps=("terraform" "docker" "hcloud" "curl" "jq")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_error "$dep is not installed or not in PATH"
            exit 1
        fi
    done
    
    # Check environment variables
    if [[ -z "$HCLOUD_TOKEN" ]]; then
        log_error "HCLOUD_TOKEN environment variable is not set"
        exit 1
    fi
    
    log_success "All dependencies are available"
}

validate_environment() {
    local env=$1
    
    if [[ "$env" != "staging" && "$env" != "production" ]]; then
        log_error "Invalid environment. Use 'staging' or 'production'"
        exit 1
    fi
    
    if [[ "$env" == "production" ]]; then
        log_warning "You are about to deploy to PRODUCTION!"
        read -p "Are you sure? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            log_info "Deployment cancelled"
            exit 0
        fi
    fi
}

setup_terraform() {
    local env=$1
    
    log_info "Setting up Terraform for $env environment..."
    
    cd "$TERRAFORM_DIR"
    
    # Initialize Terraform
    terraform init
    
    # Validate configuration
    terraform validate
    
    # Plan deployment
    log_info "Creating Terraform plan..."
    terraform plan -var-file="${env}.tfvars" -out="${env}.tfplan"
    
    log_success "Terraform setup completed"
}

deploy_infrastructure() {
    local env=$1
    
    log_info "Deploying infrastructure for $env environment..."
    
    cd "$TERRAFORM_DIR"
    
    # Apply Terraform plan
    terraform apply "${env}.tfplan"
    
    # Get outputs
    local app_server_ip=$(terraform output -raw app_server_public_ip)
    local db_server_ip=$(terraform output -raw db_server_public_ip)
    local floating_ip=$(terraform output -raw floating_ip)
    
    log_success "Infrastructure deployed successfully"
    log_info "Application Server IP: $app_server_ip"
    log_info "Database Server IP: $db_server_ip"
    log_info "Floating IP: $floating_ip"
    
    # Save outputs to file
    cat > "$PROJECT_ROOT/.deployment-info" << EOF
ENVIRONMENT=$env
APP_SERVER_IP=$app_server_ip
DB_SERVER_IP=$db_server_ip
FLOATING_IP=$floating_ip
DEPLOYED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF
    
    log_success "Deployment info saved to .deployment-info"
}

wait_for_servers() {
    log_info "Waiting for servers to be ready..."
    
    source "$PROJECT_ROOT/.deployment-info"
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        log_info "Attempt $attempt/$max_attempts: Checking server connectivity..."
        
        if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no ubuntu@"$APP_SERVER_IP" "echo 'Server ready'" &>/dev/null; then
            log_success "Application server is ready"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "Server is not responding after $max_attempts attempts"
            exit 1
        fi
        
        sleep 30
        ((attempt++))
    done
}

deploy_application() {
    local env=$1
    
    log_info "Deploying application to $env environment..."
    
    source "$PROJECT_ROOT/.deployment-info"
    
    # Copy application files
    log_info "Copying application files..."
    scp -o StrictHostKeyChecking=no -r "$PROJECT_ROOT/docker-compose.yml" ubuntu@"$APP_SERVER_IP":/opt/predix/app/
    scp -o StrictHostKeyChecking=no "$PROJECT_ROOT/.env.$env" ubuntu@"$APP_SERVER_IP":/opt/predix/.env
    
    # Deploy application
    log_info "Starting application services..."
    ssh -o StrictHostKeyChecking=no ubuntu@"$APP_SERVER_IP" << EOF
        cd /opt/predix/app
        
        # Pull latest images
        docker-compose pull
        
        # Start services
        docker-compose up -d
        
        # Wait for services to be ready
        sleep 60
        
        # Check health
        docker-compose ps
        
        # Cleanup old images
        docker system prune -f
EOF
    
    log_success "Application deployed successfully"
}

run_health_checks() {
    log_info "Running health checks..."
    
    source "$PROJECT_ROOT/.deployment-info"
    
    local max_attempts=10
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        log_info "Health check attempt $attempt/$max_attempts..."
        
        # Check application health
        if curl -f -s "http://$FLOATING_IP/health" > /dev/null; then
            log_success "Frontend health check passed"
            
            if curl -f -s "http://$FLOATING_IP/api/v1/health" > /dev/null; then
                log_success "Backend health check passed"
                return 0
            fi
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "Health checks failed after $max_attempts attempts"
            return 1
        fi
        
        sleep 30
        ((attempt++))
    done
}

setup_monitoring() {
    local env=$1
    
    log_info "Setting up monitoring for $env environment..."
    
    source "$PROJECT_ROOT/.deployment-info"
    
    # Copy monitoring configuration
    scp -o StrictHostKeyChecking=no -r "$PROJECT_ROOT/monitoring/" ubuntu@"$APP_SERVER_IP":/opt/predix/
    
    # Start monitoring services
    ssh -o StrictHostKeyChecking=no ubuntu@"$APP_SERVER_IP" << EOF
        cd /opt/predix/monitoring
        docker-compose up -d
        
        # Wait for services
        sleep 30
        
        # Check monitoring services
        docker-compose ps
EOF
    
    log_success "Monitoring setup completed"
}

setup_ssl() {
    local env=$1
    
    log_info "Setting up SSL certificates for $env environment..."
    
    source "$PROJECT_ROOT/.deployment-info"
    
    local domain
    if [[ "$env" == "production" ]]; then
        domain="predix.com"
    else
        domain="staging.predix.com"
    fi
    
    # Setup SSL certificates
    ssh -o StrictHostKeyChecking=no ubuntu@"$APP_SERVER_IP" << EOF
        # Install certbot if not already installed
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
        
        # Get SSL certificate
        sudo certbot --nginx -d $domain -d api.$domain -d www.$domain --non-interactive --agree-tos --email ssl@predix.com
        
        # Setup auto-renewal
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
EOF
    
    log_success "SSL certificates configured"
}

cleanup() {
    log_info "Cleaning up temporary files..."
    
    cd "$TERRAFORM_DIR"
    rm -f *.tfplan
    
    log_success "Cleanup completed"
}

show_deployment_info() {
    local env=$1
    
    source "$PROJECT_ROOT/.deployment-info"
    
    echo
    log_success "🎉 Deployment completed successfully!"
    echo
    echo "Environment: $env"
    echo "Application Server: $APP_SERVER_IP"
    echo "Database Server: $DB_SERVER_IP"
    echo "Floating IP: $FLOATING_IP"
    echo "Deployed At: $DEPLOYED_AT"
    echo
    
    if [[ "$env" == "production" ]]; then
        echo "🌐 Production URLs:"
        echo "  Frontend: https://predix.com"
        echo "  API: https://api.predix.com"
        echo "  Docs: https://api.predix.com/docs"
        echo "  Monitoring: https://grafana.predix.com"
    else
        echo "🧪 Staging URLs:"
        echo "  Frontend: https://staging.predix.com"
        echo "  API: https://api.staging.predix.com"
        echo "  Docs: https://api.staging.predix.com/docs"
        echo "  Monitoring: https://grafana.staging.predix.com"
    fi
    echo
}

# Main deployment function
main() {
    local env=${1:-staging}
    
    echo "🚀 Starting Predix deployment to $env environment..."
    echo
    
    # Validate inputs
    validate_environment "$env"
    
    # Check dependencies
    check_dependencies
    
    # Setup and deploy infrastructure
    setup_terraform "$env"
    deploy_infrastructure "$env"
    
    # Wait for servers to be ready
    wait_for_servers
    
    # Deploy application
    deploy_application "$env"
    
    # Run health checks
    if ! run_health_checks; then
        log_error "Deployment failed health checks"
        exit 1
    fi
    
    # Setup monitoring
    setup_monitoring "$env"
    
    # Setup SSL certificates
    setup_ssl "$env"
    
    # Cleanup
    cleanup
    
    # Show deployment information
    show_deployment_info "$env"
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
