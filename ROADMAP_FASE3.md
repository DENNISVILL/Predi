# ROADMAP FASE 3: El camino al 100/100 (Backend, APIs e IA)

Este documento es el plano maestro para transformar a Predix de un "Frontend Premium" a un **SaaS Completamente Funcional y Real**. Aquí detallamos exactamente qué falta por integrar, cómo funcionará, y qué vas a necesitar para que podamos ejecutarlo en la siguiente sesión.

---

## 1. Persistencia y Seguridad (Supabase)
Supabase será el "Cerebro" que guardará toda la información de Predix. Es gratuito y es la mejor alternativa moderna a Firebase.

### Lo que integraremos en código:
- **Sistema de Autenticación:** Pantallas de Login y Registro (con Email/Contraseña o Google).
- **Protección de Rutas:** Si alguien no tiene cuenta, no puede ver el Dashboard.
- **Base de Datos (PostgreSQL):** Crearemos tablas para guardar la información que ahora se borra:
  - `perfiles_marca` (Tus configuraciones de Buyer Persona, Tono, etc.)
  - `posts_programados` (La vista Kanban del planificador)
  - `campanas_ads` (Tu simulador de presupuesto)

> **Tu tarea antes de aplicar esto:**  
> 1. Ir a [Supabase.com](https://supabase.com) y crear una cuenta gratuita.  
> 2. Crear un nuevo proyecto (ej. "Predix App").  
> 3. Entregarme la **URL del Proyecto** y la **API Key (anon/public)**.

---

## 2. Motor de Inteligencia Artificial Real (Claude / Anthropic)
Toda la lógica de prompts que inyectamos funcionará de verdad conectando la API de Claude (uno de los modelos más avanzados e inteligentes para escritura y análisis).

### Lo que integraremos en código:
- Instalación del SDK de `Anthropic`.
- **Estratega IA:** Conectar el *Brand Briefing* para que Claude redacte el perfil psicográfico completo en segundos.
- **Creador Visual & Guiones:** Conectar los módulos del *Estudio Creativo* para escupir resultados reales basados en los "125 hooks" almacenados.

> **Tu tarea antes de aplicar esto:**  
> 1. Ir a la consola de desarrolladores de Anthropic (Claude).  
> 2. Crear una cuenta y generar una **API Key**.  
> 3. Añadir saldo a tu cuenta (modelo Pay-As-You-Go, con unos $5 a $10 USD es más que suficiente para empezar pruebas intensas).

---

## 3. Conexión con la Realidad (APIs Oficiales Multiplataforma)
Para que los KPIs y el Gestor de Ads muestren datos reales, necesitamos conectar Predix con el mundo exterior.

### Lo que integraremos en código:
- **Meta Graph API (Facebook & Instagram):** Para extraer métricas de engagement, alcance y permitir publicar directamente desde el *Planificador Omni*.
- **Google API (Analytics & Ads):** Para el reporte de métricas y el cálculo real del ROAS/CPC en el *Gestor de Ads*.
- **TikTok for Business API:** Para extraer el Sentimiento Global y las tendencias virales de música/hashtags.

> **Tu tarea antes de aplicar esto:**  
> Esta es la parte más burocrática. Tendrás que crear cuentas de desarrollador en:
> - [Meta for Developers](https://developers.facebook.com/)
> - [Google Cloud Console](https://console.cloud.google.com/)
> - [TikTok for Developers](https://developers.tiktok.com/)  
> Deberás crear una "App" en cada uno de ellos y darme las **Claves API** y los **Tokens de Acceso**.

---

## 4. Despliegue a Producción (Deployment)
Una vez conectado todo, nadie va a usar Predix entrando a `localhost:5173`. Hay que subirlo a internet.

### Lo que haremos:
- Usaremos **Vercel** o **Netlify** (plataformas de hosting gratuitas para el Frontend).
- Conectaremos tu repositorio de GitHub directamente.
- Configuraremos todas las **Variables de Entorno** (Tus claves de Supabase, Claude, Meta, etc.) de forma secreta en el servidor para que nadie pueda robártelas.

> Con esto completado, tendrás un enlace público (ej. `predix-app.vercel.app` o tu dominio propio `predix.ai`) donde tú y tus clientes podrán iniciar sesión y usar el SaaS 100/100.

---

### Resumen de tu lista de la compra tecnológica:
Para que yo pueda ejecutar el código de esta Fase 3, necesitaré que me proporciones este listado de "Llaves":
1. `VITE_SUPABASE_URL` (Gratis)
2. `VITE_SUPABASE_ANON_KEY` (Gratis)
3. `VITE_CLAUDE_API_KEY` (Requiere tarjeta y recarga mínima)
4. `VITE_META_API_KEY` (Gratis, requiere registro dev)
