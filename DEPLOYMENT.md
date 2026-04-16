# ☁️ Guía de Despliegue en Hetzner (Producción)

Esta guía detalla los costos y pasos para desplegar **Predix** en Hetzner Cloud usando Docker.

## 💰 1. Requerimientos
**Servidor Recomendado**: CPX21 (3 vCPU, 4GB RAM) - aprox €9.20/mes.
*Necesario para soportar Node.js Backend + Docker Containers.*

## 🚀 2. Paso a Paso

### Paso 1: Preparar Servidor
Crear VPS en Hetzner (Ubuntu 22.04) e instalar Docker:
```bash
ssh root@tu-ip
apt update && apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
```

### Paso 2: Clonar y Configurar
```bash
git clone https://github.com/tu-repo/predix.git
cd predix
cp .env.example .env
nano .env # (Poner llaves reales de Gemini y DB)
```

### Paso 3: Docker Compose
Ejecuta el stack completo (Web, Backend, DB):
```bash
docker compose up -d --build
```
*Nota: Asegúrate de que `docker-compose.yml` incluya el servicio `backend` en puerto 5000 y `web` en 80/443.*

### Paso 4: DNS
Apunta tu dominio (ej. `predix.ai`) a la IP del servidor en Cloudflare/GoDaddy.

## 🔄 CI/CD (Opcional)
Para actualizaciones automáticas, configurar GitHub Actions para hacer SSH y `git pull && docker compose up -d` al hacer push a main.
