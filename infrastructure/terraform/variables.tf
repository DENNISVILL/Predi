# Predix Terraform Variables

# Hetzner Cloud Configuration
variable "hcloud_token" {
  description = "Hetzner Cloud API Token"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
  default     = "staging"
  
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be either 'staging' or 'production'."
  }
}

# Server Configuration
variable "server_image" {
  description = "Server image to use"
  type        = string
  default     = "ubuntu-22.04"
}

variable "server_location" {
  description = "Server location"
  type        = string
  default     = "nbg1"  # Nuremberg
  
  validation {
    condition = contains([
      "nbg1",   # Nuremberg
      "fsn1",   # Falkenstein
      "hel1",   # Helsinki
      "ash",    # Ashburn
      "hil"     # Hillsboro
    ], var.server_location)
    error_message = "Server location must be a valid Hetzner location."
  }
}

variable "app_server_type" {
  description = "Application server type"
  type        = string
  default     = "cpx31"  # 4 vCPU, 8 GB RAM, 160 GB SSD
}

variable "db_server_type" {
  description = "Database server type"
  type        = string
  default     = "cpx21"  # 3 vCPU, 4 GB RAM, 80 GB SSD
}

variable "load_balancer_type" {
  description = "Load balancer type"
  type        = string
  default     = "lb11"   # Small load balancer
}

# Network Configuration
variable "network_ip_range" {
  description = "IP range for the private network"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_ip_range" {
  description = "IP range for the subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "network_zone" {
  description = "Network zone"
  type        = string
  default     = "eu-central"
}

variable "app_server_ip" {
  description = "Private IP for application server"
  type        = string
  default     = "10.0.1.10"
}

variable "db_server_ip" {
  description = "Private IP for database server"
  type        = string
  default     = "10.0.1.20"
}

variable "lb_ip" {
  description = "Private IP for load balancer"
  type        = string
  default     = "10.0.1.5"
}

# Security Configuration
variable "admin_ips" {
  description = "List of admin IP addresses for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # Change this in production!
}

# Volume Configuration
variable "postgres_volume_size" {
  description = "Size of PostgreSQL volume in GB"
  type        = number
  default     = 50
}

variable "app_volume_size" {
  description = "Size of application volume in GB"
  type        = number
  default     = 20
}

# Database Configuration
variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "redis_password" {
  description = "Redis password"
  type        = string
  sensitive   = true
}

# Domain and SSL Configuration
variable "domain" {
  description = "Domain name for the application"
  type        = string
  default     = "predix.com"
}

variable "acme_email" {
  description = "Email for Let's Encrypt certificates"
  type        = string
  default     = "admin@predix.com"
}

# Feature Flags
variable "enable_backups" {
  description = "Enable automatic server backups"
  type        = bool
  default     = true
}

variable "enable_monitoring" {
  description = "Enable monitoring stack"
  type        = bool
  default     = true
}

# Application Configuration
variable "app_version" {
  description = "Application version to deploy"
  type        = string
  default     = "latest"
}

variable "docker_registry" {
  description = "Docker registry URL"
  type        = string
  default     = "ghcr.io/predix"
}

# Secrets
variable "secret_key" {
  description = "Application secret key"
  type        = string
  sensitive   = true
}

variable "paymentez_app_code" {
  description = "Paymentez application code"
  type        = string
  sensitive   = true
  default     = ""
}

variable "paymentez_app_key" {
  description = "Paymentez application key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "sentry_dsn" {
  description = "Sentry DSN for error tracking"
  type        = string
  sensitive   = true
  default     = ""
}

# Monitoring Configuration
variable "grafana_admin_password" {
  description = "Grafana admin password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "prometheus_retention" {
  description = "Prometheus data retention period"
  type        = string
  default     = "30d"
}

# Backup Configuration
variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 30
}

variable "backup_schedule" {
  description = "Backup schedule in cron format"
  type        = string
  default     = "0 2 * * *"  # Daily at 2 AM
}
