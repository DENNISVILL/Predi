# Predix Production Environment Configuration

# Environment
environment = "production"

# Server Configuration
app_server_type      = "cpx41"  # 8 vCPU, 16 GB RAM, 240 GB SSD
db_server_type       = "cpx31"  # 4 vCPU, 8 GB RAM, 160 GB SSD
load_balancer_type   = "lb21"   # Medium load balancer

# Location
server_location = "nbg1"  # Nuremberg (primary)

# Network Configuration
network_ip_range = "10.0.0.0/16"
subnet_ip_range  = "10.0.1.0/24"
app_server_ip    = "10.0.1.10"
db_server_ip     = "10.0.1.20"
lb_ip           = "10.0.1.5"

# Security (Replace with actual admin IPs)
admin_ips = [
  "203.0.113.0/24",  # Office IP range
  "198.51.100.0/24"  # VPN IP range
]

# Volumes
postgres_volume_size = 100  # GB
app_volume_size     = 50   # GB

# Domain
domain     = "predix.com"
acme_email = "ssl@predix.com"

# Features
enable_backups    = true
enable_monitoring = true

# Application
app_version      = "latest"
docker_registry  = "ghcr.io/predix"

# Monitoring
prometheus_retention = "30d"

# Backup
backup_retention_days = 30
backup_schedule      = "0 2 * * *"  # Daily at 2 AM
