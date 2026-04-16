# Predix Terraform Outputs

# Server Information
output "app_server_id" {
  description = "ID of the application server"
  value       = hcloud_server.app_server.id
}

output "app_server_public_ip" {
  description = "Public IP of the application server"
  value       = hcloud_server.app_server.public_net[0].ipv4[0].ip
}

output "app_server_private_ip" {
  description = "Private IP of the application server"
  value       = hcloud_server.app_server.network[0].ip
}

output "db_server_id" {
  description = "ID of the database server"
  value       = hcloud_server.database_server.id
}

output "db_server_public_ip" {
  description = "Public IP of the database server"
  value       = hcloud_server.database_server.public_net[0].ipv4[0].ip
}

output "db_server_private_ip" {
  description = "Private IP of the database server"
  value       = hcloud_server.database_server.network[0].ip
}

# Network Information
output "network_id" {
  description = "ID of the private network"
  value       = hcloud_network.predix_network.id
}

output "network_ip_range" {
  description = "IP range of the private network"
  value       = hcloud_network.predix_network.ip_range
}

# Floating IP
output "floating_ip" {
  description = "Floating IP address"
  value       = hcloud_floating_ip.predix_floating_ip.ip_address
}

# Load Balancer (Production only)
output "load_balancer_public_ip" {
  description = "Public IP of the load balancer"
  value       = var.environment == "production" ? hcloud_load_balancer.predix_lb[0].public_net[0].ipv4[0].ip : null
}

output "load_balancer_private_ip" {
  description = "Private IP of the load balancer"
  value       = var.environment == "production" ? hcloud_load_balancer_network.predix_lb_network[0].ip : null
}

# SSH Information
output "ssh_private_key" {
  description = "Private SSH key for server access"
  value       = tls_private_key.predix_ssh.private_key_pem
  sensitive   = true
}

output "ssh_public_key" {
  description = "Public SSH key"
  value       = tls_private_key.predix_ssh.public_key_openssh
}

# Volume Information
output "postgres_volume_id" {
  description = "ID of the PostgreSQL volume"
  value       = hcloud_volume.postgres_volume.id
}

output "app_volume_id" {
  description = "ID of the application volume"
  value       = hcloud_volume.app_volume.id
}

# Firewall Information
output "web_firewall_id" {
  description = "ID of the web firewall"
  value       = hcloud_firewall.web_firewall.id
}

output "db_firewall_id" {
  description = "ID of the database firewall"
  value       = hcloud_firewall.db_firewall.id
}

# Connection Information
output "database_connection_string" {
  description = "Database connection string"
  value       = "postgresql://predix_user:${var.postgres_password}@${hcloud_server.database_server.network[0].ip}:5432/predix_db"
  sensitive   = true
}

output "redis_connection_string" {
  description = "Redis connection string"
  value       = "redis://:${var.redis_password}@${hcloud_server.database_server.network[0].ip}:6379/0"
  sensitive   = true
}

# DNS Configuration
output "dns_records" {
  description = "DNS records to configure"
  value = {
    app_domain = {
      type  = "A"
      name  = var.environment == "production" ? "@" : var.environment
      value = var.environment == "production" && length(hcloud_load_balancer.predix_lb) > 0 ? hcloud_load_balancer.predix_lb[0].public_net[0].ipv4[0].ip : hcloud_floating_ip.predix_floating_ip.ip_address
      ttl   = 300
    }
    api_domain = {
      type  = "A"
      name  = var.environment == "production" ? "api" : "api-${var.environment}"
      value = var.environment == "production" && length(hcloud_load_balancer.predix_lb) > 0 ? hcloud_load_balancer.predix_lb[0].public_net[0].ipv4[0].ip : hcloud_floating_ip.predix_floating_ip.ip_address
      ttl   = 300
    }
    www_domain = {
      type  = "CNAME"
      name  = var.environment == "production" ? "www" : "www-${var.environment}"
      value = var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"
      ttl   = 300
    }
  }
}

# Monitoring URLs
output "monitoring_urls" {
  description = "Monitoring service URLs"
  value = {
    grafana    = "https://grafana.${var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"}"
    prometheus = "https://prometheus.${var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"}"
    traefik    = "https://traefik.${var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"}"
  }
}

# Application URLs
output "application_urls" {
  description = "Application URLs"
  value = {
    frontend = "https://${var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"}"
    api      = "https://api.${var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"}"
    docs     = "https://api.${var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"}/docs"
  }
}

# Deployment Information
output "deployment_info" {
  description = "Information for deployment scripts"
  value = {
    environment           = var.environment
    app_server_ip        = hcloud_server.app_server.public_net[0].ipv4[0].ip
    db_server_ip         = hcloud_server.database_server.public_net[0].ipv4[0].ip
    floating_ip          = hcloud_floating_ip.predix_floating_ip.ip_address
    load_balancer_ip     = var.environment == "production" && length(hcloud_load_balancer.predix_lb) > 0 ? hcloud_load_balancer.predix_lb[0].public_net[0].ipv4[0].ip : null
    domain               = var.domain
    app_server_type      = var.app_server_type
    db_server_type       = var.db_server_type
    postgres_volume_size = var.postgres_volume_size
    app_volume_size      = var.app_volume_size
  }
}
