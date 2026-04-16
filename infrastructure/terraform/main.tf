# Predix Infrastructure on Hetzner Cloud
terraform {
  required_version = ">= 1.0"
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.44"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.4"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

# Configure Hetzner Cloud Provider
provider "hcloud" {
  token = var.hcloud_token
}

# Data sources
data "hcloud_ssh_keys" "all_keys" {}

# Local variables
locals {
  common_labels = {
    project     = "predix"
    environment = var.environment
    managed_by  = "terraform"
  }
  
  server_labels = merge(local.common_labels, {
    component = "application"
  })
  
  db_labels = merge(local.common_labels, {
    component = "database"
  })
}

# SSH Key for server access
resource "tls_private_key" "predix_ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "hcloud_ssh_key" "predix_key" {
  name       = "predix-${var.environment}-key"
  public_key = tls_private_key.predix_ssh.public_key_openssh
  labels     = local.common_labels
}

# Network for internal communication
resource "hcloud_network" "predix_network" {
  name     = "predix-${var.environment}-network"
  ip_range = var.network_ip_range
  labels   = local.common_labels
}

resource "hcloud_network_subnet" "predix_subnet" {
  type         = "cloud"
  network_id   = hcloud_network.predix_network.id
  network_zone = var.network_zone
  ip_range     = var.subnet_ip_range
}

# Firewall for web servers
resource "hcloud_firewall" "web_firewall" {
  name   = "predix-${var.environment}-web-fw"
  labels = local.common_labels

  # SSH access (restricted to admin IPs)
  rule {
    direction  = "in"
    port       = "22"
    protocol   = "tcp"
    source_ips = var.admin_ips
  }

  # HTTP traffic
  rule {
    direction  = "in"
    port       = "80"
    protocol   = "tcp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS traffic
  rule {
    direction  = "in"
    port       = "443"
    protocol   = "tcp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # Internal network communication
  rule {
    direction  = "in"
    port       = "any"
    protocol   = "tcp"
    source_ips = [var.network_ip_range]
  }

  rule {
    direction  = "in"
    port       = "any"
    protocol   = "udp"
    source_ips = [var.network_ip_range]
  }

  # Monitoring (Prometheus)
  rule {
    direction  = "in"
    port       = "9090"
    protocol   = "tcp"
    source_ips = var.admin_ips
  }

  # Grafana
  rule {
    direction  = "in"
    port       = "3000"
    protocol   = "tcp"
    source_ips = var.admin_ips
  }
}

# Firewall for database servers
resource "hcloud_firewall" "db_firewall" {
  name   = "predix-${var.environment}-db-fw"
  labels = local.common_labels

  # SSH access (restricted to admin IPs)
  rule {
    direction  = "in"
    port       = "22"
    protocol   = "tcp"
    source_ips = var.admin_ips
  }

  # PostgreSQL (only from internal network)
  rule {
    direction  = "in"
    port       = "5432"
    protocol   = "tcp"
    source_ips = [var.network_ip_range]
  }

  # Redis (only from internal network)
  rule {
    direction  = "in"
    port       = "6379"
    protocol   = "tcp"
    source_ips = [var.network_ip_range]
  }

  # Internal network communication
  rule {
    direction  = "in"
    port       = "any"
    protocol   = "tcp"
    source_ips = [var.network_ip_range]
  }

  rule {
    direction  = "in"
    port       = "any"
    protocol   = "udp"
    source_ips = [var.network_ip_range]
  }
}

# Volume for PostgreSQL data
resource "hcloud_volume" "postgres_volume" {
  name      = "predix-${var.environment}-postgres-data"
  size      = var.postgres_volume_size
  server_id = hcloud_server.database_server.id
  labels    = local.db_labels

  format = "ext4"
}

# Volume for application data
resource "hcloud_volume" "app_volume" {
  name      = "predix-${var.environment}-app-data"
  size      = var.app_volume_size
  server_id = hcloud_server.app_server.id
  labels    = local.server_labels

  format = "ext4"
}

# Database Server
resource "hcloud_server" "database_server" {
  name        = "predix-${var.environment}-db"
  image       = var.server_image
  server_type = var.db_server_type
  location    = var.server_location
  ssh_keys    = [hcloud_ssh_key.predix_key.id]
  labels      = local.db_labels

  firewall_ids = [hcloud_firewall.db_firewall.id]

  network {
    network_id = hcloud_network.predix_network.id
    ip         = var.db_server_ip
  }

  depends_on = [hcloud_network_subnet.predix_subnet]

  user_data = templatefile("${path.module}/cloud-init/database.yml", {
    postgres_password = var.postgres_password
    redis_password    = var.redis_password
    environment       = var.environment
  })
}

# Application Server
resource "hcloud_server" "app_server" {
  name        = "predix-${var.environment}-app"
  image       = var.server_image
  server_type = var.app_server_type
  location    = var.server_location
  ssh_keys    = [hcloud_ssh_key.predix_key.id]
  labels      = local.server_labels

  firewall_ids = [hcloud_firewall.web_firewall.id]

  network {
    network_id = hcloud_network.predix_network.id
    ip         = var.app_server_ip
  }

  depends_on = [hcloud_network_subnet.predix_subnet]

  user_data = templatefile("${path.module}/cloud-init/application.yml", {
    db_server_ip      = var.db_server_ip
    postgres_password = var.postgres_password
    redis_password    = var.redis_password
    environment       = var.environment
    domain            = var.domain
    acme_email        = var.acme_email
  })
}

# Load Balancer (for production scaling)
resource "hcloud_load_balancer" "predix_lb" {
  count              = var.environment == "production" ? 1 : 0
  name               = "predix-${var.environment}-lb"
  load_balancer_type = var.load_balancer_type
  location           = var.server_location
  labels             = local.common_labels

  algorithm {
    type = "round_robin"
  }
}

resource "hcloud_load_balancer_network" "predix_lb_network" {
  count           = var.environment == "production" ? 1 : 0
  load_balancer_id = hcloud_load_balancer.predix_lb[0].id
  network_id      = hcloud_network.predix_network.id
  ip              = var.lb_ip
}

# Load Balancer Service for HTTP
resource "hcloud_load_balancer_service" "predix_lb_http" {
  count            = var.environment == "production" ? 1 : 0
  load_balancer_id = hcloud_load_balancer.predix_lb[0].id
  protocol         = "http"
  listen_port      = 80
  destination_port = 80

  health_check {
    protocol = "http"
    port     = 80
    interval = 15
    timeout  = 10
    retries  = 3
    http {
      path         = "/health"
      status_codes = ["200"]
    }
  }
}

# Load Balancer Service for HTTPS
resource "hcloud_load_balancer_service" "predix_lb_https" {
  count            = var.environment == "production" ? 1 : 0
  load_balancer_id = hcloud_load_balancer.predix_lb[0].id
  protocol         = "https"
  listen_port      = 443
  destination_port = 443

  health_check {
    protocol = "http"
    port     = 80
    interval = 15
    timeout  = 10
    retries  = 3
    http {
      path         = "/health"
      status_codes = ["200"]
    }
  }

  http {
    sticky_sessions = true
    redirect_http   = true
    cookie_name     = "PREDIXLB"
    cookie_lifetime = 300
  }
}

# Load Balancer Target
resource "hcloud_load_balancer_target" "predix_lb_target" {
  count            = var.environment == "production" ? 1 : 0
  type             = "server"
  load_balancer_id = hcloud_load_balancer.predix_lb[0].id
  server_id        = hcloud_server.app_server.id
  use_private_ip   = true
}

# Floating IP for high availability
resource "hcloud_floating_ip" "predix_floating_ip" {
  type      = "ipv4"
  location  = var.server_location
  labels    = local.common_labels
  name      = "predix-${var.environment}-floating-ip"
}

resource "hcloud_floating_ip_assignment" "predix_floating_ip_assignment" {
  floating_ip_id = hcloud_floating_ip.predix_floating_ip.id
  server_id      = var.environment == "production" ? null : hcloud_server.app_server.id
}

# Snapshot schedule for backups
resource "hcloud_server_backup" "app_server_backup" {
  count     = var.enable_backups ? 1 : 0
  server_id = hcloud_server.app_server.id
  labels    = local.server_labels
}

resource "hcloud_server_backup" "db_server_backup" {
  count     = var.enable_backups ? 1 : 0
  server_id = hcloud_server.database_server.id
  labels    = local.db_labels
}
