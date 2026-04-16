# 🚀 Predix - AI Predictive Trends Platform

<div align="center">
  <img src="public/logo512.png" alt="Predix Logo" width="120" height="120">
  
  **Predice. Actúa. Lidera.**
  
  La primera plataforma de IA que predice microtendencias digitales antes que se vuelvan virales.
  **Ahora con App Móvil Nativa.**
</div>

## 📋 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Componentes del Sistema](#-componentes-del-sistema)
- [Instalación Rápida](#-instalación-rápida)
- [Características Clave](#-características-clave)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación](#-documentación)

## 🔭 Visión General
Predix es un ecosistema SaaS diseñado para creators y marketers. Utiliza inteligencia artificial (Google Gemini 1.5) para analizar patrones en redes sociales y predecir qué contenido será viral en las próximas 24-72 horas.

## 🧩 Componentes del Sistema
El proyecto es un **Monorepo** que contiene:

1.  **Predix Web (SaaS)**: React 18 + Vite. Dashboard completo para escritorio.
2.  **Predix Mobile**: React Native (Expo). App nativa para iOS y Android.
3.  **Predix Backend**: Node.js Proxy. Servidor seguro para gestionar claves de IA y pagos.

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 18+
- Docker (Opcional, para producción)
- Expo Go (Para probar la app móvil)

### 1. Backend (Servidor Seguro)
```bash
cd backend
npm install
# Crear .env basado en .env.example
npm start
# Corre en http://localhost:5000
```

### 2. Frontend Web
```bash
# En la raíz (d:/predix)
npm install
npm run start
# Corre en http://localhost:3000
```

### 3. App Móvil
```bash
cd mobile
npm install
npx expo start
# Escanea el QR con tu celular
```

## ✨ Características Clave
- **🤖 Chat Estratega IA**: Asistente especializado en Marketing Digital con "memoria".
- **📊 Radar de Tendencias**: Monitor en tiempo real de viralidad.
- **📱 Experiencia Nativa**: App móvil sincronizada con la web.
- **🎵 Music Trends**: Detector de audios virales (Deezer/iTunes integration).
- **🔒 Seguridad Enterprise**: Proxy intermedio y MoR para pagos globales.

## 📂 Estructura del Proyecto
```
predix/
├── backend/           # Servidor Node.js (Proxy IA + Webhooks)
├── mobile/            # App React Native (Expo)
├── src/               # Código Fuente Web (React)
├── public/            # Assets Estáticos
├── ARCHITECTURE.md    # Detalles técnicos del sistema
├── DEPLOYMENT.md      # Guía de despliegue (Hetzner)
└── ROADMAP.md         # Plan de desarrollo
```

## 📚 Documentación
Para detalles profundos, consulta los archivos especializados en esta carpeta:
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Stack técnico y flujo de datos.
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Cómo subir a producción (Hetzner).
- **[USER_MANUAL.md](./USER_MANUAL.md)**: Guía de uso para el usuario final.
- **[ROADMAP.md](./ROADMAP.md)**: Estado actual y tareas pendientes.

---
<div align="center">
  Hecho con ❤️ por el equipo de Predix
</div>
