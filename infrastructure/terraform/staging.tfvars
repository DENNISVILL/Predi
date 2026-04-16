# Predix Staging Environment Configuration

# Environment
environment = "staging"

# Server Configuration
app_server_type = "cpx21"  # 3 vCPU, 4 GB RAM, 80 GB SSD
db_server_type  = "cpx11"  # 2 vCPU, 2 GB RAM, 40 GB SSD

# Location
server_location = "nbg1"  # Nuremberg

# Network Configuration
network_ip_range = "10.1.0.0/16"
subnet_ip_range  = "10.1.1.0/24"
app_server_ip    = "10.1.1.10"
db_server_ip     = "10.1.1.20"
lb_ip           = "10.1.1.5"

# Security
admin_ips = [
  "0.0.0.0/0"  # Replace with actual admin IPs in production
]

# Volumes
postgres_volume_size = 20  # GB
app_volume_size     = 10  # GB

# Domain
domain     = "staging.predix.com"
acme_email = "devops@predix.com"

# Features
enable_backups    = true
enable_monitoring = true

# Application
app_version      = "staging"
docker_registry  = "ghcr.io/predix"

# Monitoring
prometheus_retention = "7d"

# Backup
backup_retention_days = 7
backup_schedule      = "0 3 * * *"  # Daily at 3 AM
