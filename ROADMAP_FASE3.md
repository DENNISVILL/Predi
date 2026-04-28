# 🗺️ ROADMAP FASE 3 — Estado Actualizado al 27 Abr 2026

Este es el plano maestro en tiempo real para transformar Predix de un "Frontend Premium" a un **SaaS Completamente Funcional y Real**. Daniel lo actualiza conforme avanzamos.

---

## ✅ COMPLETADO — Integraciones Activas

### 🤖 Motor de IA: Google Gemini 1.5 Flash
- **Estado**: ✅ ACTIVO Y FUNCIONANDO
- **Modelo**: `gemini-1.5-flash` (Gratis, hasta 1M tokens/día)
- **Qué hace**: Alimenta el **Chat Estratega**, el generador de hashtags y el analizador de tendencias
- **Conexión**: Directa desde el Frontend (sin necesitar backend de Python)
- `VITE_GEMINI_API_KEY` ✅ Configurada

### 📊 Google Analytics Data API
- **Estado**: ✅ HABILITADA en Google Cloud Console
- **Proyecto**: `Predix-AI`
- `GOOGLE_CLIENT_ID` ✅ Configurada
- `GOOGLE_CLIENT_SECRET` ✅ Configurada

### 🎵 TikTok for Developers
- **Estado**: ✅ App "Predix-Web" creada y activa (modo Individual/Sandbox)
- **Qué hará**: Extraer tendencias virales de música y hashtags para el Radar
- `TIKTOK_CLIENT_KEY` ✅ Configurada
- `TIKTOK_CLIENT_SECRET` ✅ Configurada

---

## ⏳ PENDIENTE — Lo que falta para el 100/100

### 1️⃣ Supabase — Persistencia y Autenticación (PRIORIDAD ALTA)
Es el "cerebro de datos" de Predix. Sin esto, todo se borra al cerrar el navegador.

**Lo que activaremos:**
- **Login y Registro real** (Email/Contraseña + Login con Google)
- **Protección de Rutas**: Si alguien no tiene cuenta, no accede al Dashboard
- **Base de Datos PostgreSQL** con tablas para:
  - `perfiles_marca` — Brand Briefing, Buyer Persona, Tono de voz
  - `posts_programados` — Vista Kanban del Planificador Omni
  - `campanas_ads` — Simulador de presupuesto del Gestor de Ads
  - `usuarios` — Historial de suscripciones y planes

> **Tu tarea:**
> 1. Ir a [supabase.com](https://supabase.com) → Crear cuenta gratuita
> 2. Crear proyecto nuevo → Llámarlo `Predix-App`
> 3. Ir a **Configuración del Proyecto → API** y copiarme:
>    - `URL del Proyecto` (ej: `https://xxxxx.supabase.co`)
>    - `anon public key` (empieza con `eyJ...`)

```
VITE_SUPABASE_URL=pendiente
VITE_SUPABASE_ANON_KEY=pendiente
```

---

### 2️⃣ Meta Graph API — Facebook e Instagram (PRIORIDAD MEDIA)
Para las métricas reales de engagement y el Planificador Omni.

**Lo que activaremos:**
- Publicar directamente desde Predix a Instagram/Facebook
- Extraer métricas de alcance, interacciones y seguidores
- Sincronizar el calendario de publicaciones con tu página

> **Tu tarea:**
> 1. Ir a [developers.facebook.com](https://developers.facebook.com/) con tu cuenta personal de Facebook
> 2. Crear App → Tipo "Negocios" → Nombre: `Predix-Web`
> 3. Ir a **Configuración → Básica** y copiarme:
>    - `App ID` (número de 15 dígitos)
>    - `App Secret` (cadena de letras y números)

```
META_APP_ID=pendiente
META_APP_SECRET=pendiente
META_ACCESS_TOKEN=pendiente
```

---

### 3️⃣ Pasarela de Pagos — Stripe o Paymentez (PRIORIDAD ALTA)
Sin pagos, Predix no genera ingresos. Activaremos planes Free, Pro y Enterprise.

**Opciones disponibles:**
| Opción | Ideal para | Comisión |
|--------|-----------|---------|
| **Stripe** | Internacional (USD/EUR) | 2.9% + $0.30 |
| **Paymentez** | LATAM (Ecuador, Col, Mex) | Variable |
| **Mercado Pago** | LATAM + muy popular | ~3.49% |

**Lo que activaremos:**
- Checkout de pagos con tarjeta
- Webhook para activar el plan automáticamente al pagar
- Portal de suscripciones (cancelar, cambiar plan)
- Página de planes en el Frontend conectada a precios reales

> **Tu decisión:** ¿Cuál de las 3 pasarelas quieres usar?
> (Recomiendo **Stripe** si piensas tener clientes internacionales)
>
> **Tu tarea (después de decidir):**
> 1. Crear cuenta en la pasarela elegida
> 2. Ir a la sección **API Keys** de tu dashboard
> 3. Copiarme la **Publishable Key** y la **Secret Key**

```
STRIPE_PUBLISHABLE_KEY=pendiente
STRIPE_SECRET_KEY=pendiente
STRIPE_WEBHOOK_SECRET=pendiente
```

---

## 🚀 FASE 4 — Despliegue a Producción (Después de completar las 3 integraciones)

Una vez que Supabase, Meta y Pagos estén activos:

1. **Frontend → Vercel** (Gratis, despliegue automático desde GitHub)
2. **Backend → Railway o Render** (Gratis en tier básico)
3. **Dominio personalizado** → `predix.app` o `usepredix.com`
4. **Variables de entorno** configuradas en los servidores (nadie verá tus llaves)

---

## 📋 Checklist Maestro

| Item | Estado |
|------|--------|
| Google Analytics Data API | ✅ |
| Google OAuth (Client ID + Secret) | ✅ |
| Gemini AI 1.5 Flash (Gratis) | ✅ |
| TikTok Developer API | ✅ |
| Claude AI Key (disponible, sin saldo activo) | ⚠️ |
| **Supabase (Auth + DB)** | ⏳ Pendiente |
| **Meta Graph API** | ⏳ Pendiente |
| **Pasarela de Pagos** | ⏳ Pendiente — Elegir: Stripe / Paymentez / MercadoPago |
| Despliegue Vercel + Dominio | 🔜 Fase 4 |
