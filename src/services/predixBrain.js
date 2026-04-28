// ════════════════════════════════════════════════════════════════
// PREDIX BRAIN v2 — Motor Ejecutivo de ARIA
// ARIA no es un bot. Es una CMO Virtual con conciencia de marketing.
// Sabe todo de Predix. Piensa. Actúa. Opina. Navega.
// ════════════════════════════════════════════════════════════════

// ── MEMORIA DE CONVERSACIÓN ──────────────────────────────────────
export const ARIAMemory = {
  userNiche: null,         // Nicho del usuario
  userName: null,          // Nombre del usuario
  agencyPhase: null,       // Fase 1, 2, 3, 4
  lastModule: null,        // Último módulo visitado
  conversationHistory: [], // Historial básico de intenciones
  goals: [],               // Objetivos que mencionó el usuario
  platforms: [],           // Plataformas que usa (TikTok, IG, etc.)
};

// ── PERSONALIDAD DE ARIA ─────────────────────────────────────────
const ARIA_PERSONALITY = {
  intro: 'Soy ARIA, tu CMO virtual dentro de Predix.',
  voice: 'primera persona, directa, con opiniones propias',
  style: 'experta, proactiva, sin rodeos, con humor cuando aplica',
};

// ── TIPOS DE RESPUESTA ───────────────────────────────────────────
// simple: texto plano
// rich: con título
// action: navega a un módulo
// strategy: plan de acción
// opinion: ARIA da su perspectiva
// steps: pasos numerados

// ════════════════════════════════════════════════════════════════
// BASE DE CONOCIMIENTO EJECUTIVA — Todo sobre Predix + Marketing
// ════════════════════════════════════════════════════════════════
const KNOWLEDGE = [

  // ── IDENTIDAD ────────────────────────────────────────────────
  {
    id: 'que_es_predix',
    patterns: ['qué es predix', 'que es predix', 'para qué sirve', 'cuéntame sobre predix', 'qué hace predix', 'explica predix', 'cómo funciona'],
    response: {
      type: 'opinion',
      text: 'Predix es el **Marketing OS** que construí para reemplazar a 5 herramientas separadas con una sola. Piénsalo así: si Hootsuite maneja tu calendario, SEMrush tu SEO, HubSpot tus ventas y ChatGPT te ayuda con copy — con Predix tienes todo eso integrado, conectado y con IA que aprende tu negocio.\n\nTiene 6 departamentos funcionales:\n• 🧠 **Dirección & Estrategia** → CEO Virtual, análisis, predicciones\n• 🎨 **Creatividad & Diseño** → Estudio de contenido visual\n• ✏️ **Contenido & Copy** → Planificador Omni, emails, prompts\n• ⚡ **Performance & Ads** → Gestor de campañas pagas\n• 🌐 **SEO & Web** → Posicionamiento, analítica, auditorías\n• 👥 **Comercial** → Prospección B2B, LinkedIn\n\n¿Te digo cuál necesitas tú primero según tu situación?',
      chips: ['Sí, dime cuál necesito', '¿Cuánto cuesta todo eso?', '¿Cómo lo uso?', 'Llevarme a empezar'],
    }
  },

  // ── MÓDULOS — ACCIÓN ─────────────────────────────────────────
  {
    id: 'ir_radar',
    patterns: ['ver radar', 'abrir radar', 'ir al radar', 'llevarme al radar', 'ir a tendencias', 'ver tendencias', 'qué está viral', 'investigar', 'de qué hablo', 'ideas de contenido', 'qué publicar'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'radar' },
      text: 'Ese tema se resuelve mirando la data actual del mercado. Te redirijo al **Radar de Tendencias**. Úsalo para inspirarte con lo que está viral hoy mismo.',
      chips: ['¿Cómo interpreto los datos?', 'Crear contenido basado en tendencias'],
    }
  },
  {
    id: 'ir_planificador',
    patterns: ['planificador', 'ir al planificador', 'abrir calendario', 'programar contenido', 'crear post', 'publicar', 'calendario editorial'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'scheduler' },
      text: 'Vamos al Planificador. Te recomiendo que antes de habrir el módulo tengas claro 3 cosas: **tu nicho**, **tu plataforma principal** y **la frecuencia de publicación** que puedes sostener. Sin eso, el calendario se convierte en caos.\n\n¿Ya tienes eso definido?',
      chips: ['No sé con qué frecuencia publicar', 'Ayúdame a definir mi nicho', 'Ya tengo claro todo, vamos'],
    }
  },
  {
    id: 'ir_estratega',
    patterns: ['ir al chat', 'abrir estratega', 'hablar con ia', 'consultar ia', 'quiero un plan', 'dame una estrategia', 'estrategia de marketing', 'estratega', 'ayuda', 'no se que hacer', 'estoy perdido', 'tengo un problema', 'como hago', 'marketing', 'idea loca', 'vender más', 'asesoría'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'strategist' },
      text: 'Te llevo al Estratega IA. Independientemente de lo loco o complejo que sea lo que tienes en mente, aquí es donde lo solucionamos. Cuéntame tu situación o problema ahí y armaremos el plan.',
      chips: ['Quiero más seguidores', 'Quiero generar leads', 'Quiero vender más', 'Quiero mejorar mi marca'],
    }
  },
  {
    id: 'ir_ads',
    patterns: ['gestor ads', 'ir a ads', 'publicidad pagada', 'campañas', 'hacer ads', 'invertir en publicidad', 'roas', 'presupuesto publicidad'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'ads' },
      text: 'Bien. Antes de que gastes un peso en ads, necesito que tengas claro algo: **sin contenido orgánico probado, los ads queman dinero**. El módulo de Ads de Predix incluye un simulador de presupuesto para que primero proyectes el retorno.\n\n¿Cuánto piensas invertir mensualmente?',
      chips: ['Menos de $100/mes', '$100-$500/mes', 'Más de $500/mes', 'Solo quiero aprender primero'],
    }
  },
  {
    id: 'ir_seo',
    patterns: ['seo', 'posicionamiento', 'google', 'búsqueda orgánica', 'palabras clave', 'auditoría', 'ir al seo studio', 'rankear'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'seo' },
      text: 'SEO es el juego largo. No verás resultados en 2 semanas, pero en 6 meses puede ser tu canal de adquisición más barato. Te llevo al SEO Studio.\n\nLo primero que haré contigo ahí es un **Topical Map** — la estructura de contenido que Google ama. ¿Ya tienes dominio web?',
      chips: ['Sí tengo web', 'No tengo web aún', '¿Qué es un Topical Map?', 'Solo quiero ver el módulo'],
    }
  },
  {
    id: 'ir_estudio',
    patterns: ['estudio creativo', 'crear imagen', 'diseño', 'contenido visual', 'generador imágenes', 'ir al estudio', 'hacer reels', 'crear video'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'studio' },
      text: 'Vamos al Estudio Creativo. Aquí generas assets visuales para tus campañas con IA. Mi recomendación: define primero tu **paleta de colores y tono visual** antes de crear contenido suelto — la consistencia visual aumenta el reconocimiento de marca entre un 20-30%.',
      chips: ['¿Cómo defino mi identidad visual?', 'Quiero crear contenido para TikTok', 'Para Instagram Stories'],
    }
  },
  {
    id: 'ir_email',
    patterns: ['email marketing', 'funnel', 'newsletter', 'secuencia', 'automatización emails', 'ir a email'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'email' },
      text: 'Email marketing tiene el ROI más alto de todos los canales digitales: **$42 por cada $1 invertido** en promedio. Te llevo al módulo.\n\nPara aprovechar bien el Email & Funnels, necesitas al menos una lista de 100 contactos. ¿Ya tienes base de datos?',
      chips: ['Sí tengo lista', 'No tengo lista todavía', '¿Cómo construyo mi lista?', 'Solo quiero explorar el módulo'],
    }
  },
  {
    id: 'ir_b2b',
    patterns: ['b2b', 'linkedin', 'prospectar', 'conseguir clientes', 'máquina b2b', 'ventas', 'leads', 'prospección'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'linkedin' },
      text: 'Buena decisión. LinkedIn es la plataforma con el **costo por lead más bajo** para servicios B2B — 3 veces más barato que Facebook Ads en promedio. Te llevo a la Máquina B2B.\n\n¿A qué tipo de clientes quieres llegar? (industria, tamaño de empresa, cargo de la persona)',
      chips: ['Pequeñas empresas locales', 'Medianas empresas', 'Corporativos / Enterprise', 'Cualquier empresa que necesite marketing'],
    }
  },
  {
    id: 'ir_analytics',
    patterns: ['analítica', 'métricas', 'reportes', 'datos', 'finanzas', 'crm', 'resultados', 'ver números'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'analytics' },
      text: 'Los datos son la verdad. Sin métricas, estás operando con los ojos cerrados. Te llevo al módulo de Analítica.\n\nLo que debes revisar primero: **alcance orgánico, tasa de engagement y costo por lead**. Todo lo demás son métricas de vanidad hasta que tengas esas tres claras.',
      chips: ['¿Qué métricas son más importantes?', 'Conectar Google Analytics', 'Ver mis reportes de hoy'],
    }
  },

  // ── SEGUIMIENTO (CHIPS) ──────────────────────────────────────
  {
    id: 'mas_seguidores',
    patterns: ['quiero más seguidores', 'más seguidores', 'crecer en seguidores', 'aumentar seguidores', 'ganar followers', 'conseguir seguidores'],
    response: {
      type: 'opinion',
      text: 'Para conseguir seguidores rápidos en 2025 tienes que jugar al algoritmo de alcance: **Reels en Instagram y videos cortos en TikTok.**\n\nEl error número 1 es crear contenido que solo le importa a la gente que ya te conoce. Para crecer, necesitas "Top of Funnel". Contenido que entretiene, educa rápido o causa polémica.\n\nTe recomiendo ir al **Radar de Tendencias**, encontrar el formato que está viral hoy en tu nicho y adaptarlo antes de 48 horas.',
      action: { type: 'suggest', target: 'radar' },
      chips: ['Ir al Radar', '¿Qué herramientas trae Predix para Reels?', '¿Se puede programar en TikTok?']
    }
  },
  {
    id: 'generar_leads',
    patterns: ['quiero generar leads', 'generar leads', 'conseguir prospectos', 'base de datos', 'captar correos', 'landing page conversión', 'más leads'],
    response: {
      type: 'strategy',
      title: '🧲 Estrategia de Captación B2B / B2C',
      text: 'Los seguidores son ego, los leads son dinero. Para generar volumen constante de leads necesitas:\n\n1. **Un Lead Magnet irresistible** — Una plantilla, una clase gratis o una auditoría.\n2. **Distribución** — Poner ese Lead Magnet frente a tráfico calificado.\n\nSi vas a B2B (empresas), usa la **Máquina B2B** de Predix para conseguir leads directos en LinkedIn.\nSi vas B2C (consumidor), necesitas el Módulo de Email & Funnels en conjunto con Gestión de Ads para amplificar.',
      chips: ['Quiero usar la Máquina B2B', 'Saber más de Email & Funnels', '¿Qué es un Lead Magnet?']
    }
  },
  {
    id: 'vender_mas',
    patterns: ['quiero vender más', 'vender más', 'aumentar ventas', 'más ventas', 'subir conversiones', 'vender mis servicios'],
    response: {
      type: 'opinion',
      text: 'Vender más no siempre significa conseguir más tráfico, a veces significa **cerrar mejor** el tráfico que ya tienes.\n\nEn servicios de alto valor, el 80% de tus ventas las cerrará tu CRM y secuencias de Email. En productos de bajo ticket, lo cerrará tu Gestor de Ads.\n\nEl Estratega IA te puede construir hoy mismo los guiones de venta (scripts) o los emails de carrito abandonado. ¿En qué escenario estás?',
      action: { type: 'suggest', target: 'strategist' },
      chips: ['Escribir guiones de venta', 'Hacer correos de recuperación', 'Ayúdame con mis Ads', 'Ir al Estratega IA']
    }
  },
  {
    id: 'mejorar_marca',
    patterns: ['quiero mejorar mi marca', 'mejorar mi marca', 'identidad visual', 'branding personal', 'hacer branding'],
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'studio' },
      text: 'Branding lo es todo. Hace que puedas cobrar más por lo mismo porque da percepción de premium.\n\nTe llevo al **Estudio Creativo**. Aquí podrás establecer la guía de estilos de tu marca, paleta tipográfica y generar todo el banco de imágenes con IA para que tengas consistencia total y dejes las plantillas genéricas.',
      chips: ['¿Por qué importa el diseño?', 'Quiero rediseñar mi logo', 'Hacer creatividades para campaña']
    }
  },

  // ── ESTRATEGIA DE MARKETING — Conocimiento experto ──────────
  {
    id: 'estrategia_contenido',
    patterns: ['estrategia de contenido', 'plan de contenido', 'qué publicar', 'ideas de contenido', 'no sé qué publicar', 'content strategy', 'contenido para redes'],
    response: {
      type: 'strategy',
      title: '📋 Mi Framework de Contenido para ti',
      text: 'Te doy mi framework personal para crear contenido que funciona. Lo llamo el **método 3-2-1**:\n\n• **3 posts de valor** — enseña algo concreto de tu nicho (tutoriales, tips, estadísticas)\n• **2 posts de conexión** — muestra el detrás de cámaras, tu proceso, tú como persona\n• **1 post de conversión** — presenta tu servicio/producto con una CTA clara\n\nEsto por semana. En total 6 piezas. ¿Puedes sostener eso?\n\nEn el **Planificador Omni** de Predix puedes mapear esto en el calendario y el Estratega IA te genera las ideas para cada tipo de post.',
      action: { type: 'suggest', target: 'scheduler' },
      chips: ['Ir al Planificador ahora', 'Generarme ideas para esta semana', '¿Cómo adapto esto a TikTok?', '¿Y si publico menos frecuente?'],
    }
  },
  {
    id: 'nicho',
    patterns: ['nicho', 'mi nicho', 'definir nicho', 'qué nicho elegir', 'no sé mi nicho', 'mercado objetivo', 'buyer persona', 'cliente ideal'],
    response: {
      type: 'opinion',
      text: 'El nicho es la decisión más importante antes de cualquier estrategia. Mi opinión: **ser específico no te limita, te hace más valioso**.\n\nEjemplos:\n❌ "Marketing digital" (demasiado amplio)\n✅ "Marketing en TikTok para restaurantes en México"\n\nUsa esta fórmula:\n**[Tu especialidad] + [para] + [tipo de negocio] + [en/de] + [lugar o industria]**\n\nCuando tengas tu nicho definido, el Estratega IA puede construir un plan de contenido completo en torno a él. ¿Ya tienes idea de por dónde va tu nicho?',
      chips: ['Fitness y salud', 'Restaurantes y gastronomía', 'Moda y lifestyle', 'Servicios profesionales', 'E-commerce', 'Tengo otro nicho'],
    }
  },
  {
    id: 'frecuencia_publicacion',
    patterns: ['cuánto publicar', 'con qué frecuencia', 'cuántas veces', 'frecuencia de contenido', 'cuántos posts', 'publicar diario'],
    response: {
      type: 'opinion',
      text: 'Respuesta honesta: **la consistencia supera a la frecuencia**. Publicar 5 veces por semana durante 2 semanas y desaparecer destruye tu alcance orgánico.\n\nMi recomendación según donde estás:\n\n📍 **Fase 1 (solo):** 3-4 posts/semana. Calidad sobre cantidad.\n📍 **Fase 2 (equipo):** 5-7 posts/semana por red principal.\n📍 **Fase 3+ (agencia):** Hasta 14 piezas/semana en múltiples redes.\n\nEmpezarías por TikTok o Instagram, ¿verdad? TikTok perdona más la inconsistencia porque su algoritmo favorece videos buenos aunque sean irregulares.',
      chips: ['Empezaré con TikTok', 'Empezaré con Instagram', 'Las dos a la vez', 'Crear horario en el Planificador'],
    }
  },
  {
    id: 'tiktok',
    patterns: ['tiktok', 'tik tok', 'reels cortos', 'video corto', 'shorts', 'contenido corto'],
    response: {
      type: 'opinion',
      text: 'TikTok sigue siendo la plataforma con el mayor alcance orgánico gratis en 2024-2025. Un solo video bien hecho puede llegar a 100,000 personas sin gastar un centavo.\n\n**Mi fórmula para TikTok que funciona:**\n• **Hook en los 2 primeros segundos** — no "hola soy X", sino la promesa o el gancho\n• **Duración:** 30-60 segundos para mayor retención\n• **Subtítulos siempre** — 85% ve sin sonido\n• **CTA al final:** "Sígueme para más" o pregunta que invite comentarios\n\nEl **Radar de Tendencias** de Predix monitorea TikTok en tiempo real para que uses los sonidos y formatos virales antes que nadie.',
      action: { type: 'suggest', target: 'radar' },
      chips: ['Ver tendencias de TikTok ahora', '¿Qué tipo de contenido funciona en TikTok?', 'Ir al estudio a crear contenido'],
    }
  },
  {
    id: 'instagram',
    patterns: ['instagram', 'ig', 'reels', 'stories', 'carrusel', 'feed'],
    response: {
      type: 'opinion',
      text: 'Instagram en 2025 prioriza Reels sobre todo. Pero el **carrusel sigue siendo el formato con mayor guardado y compartido**.\n\n**Estrategia que funciona:**\n• **Reels (3-4/semana):** alcance masivo y nuevos seguidores\n• **Carruseles (2/semana):** educación y guardados = señal de valor para el algoritmo\n• **Stories (diario):** conexión humana y ventas directas\n\n¿Qué tipo de negocio tienes? Con eso te digo exactamente qué formato explotar.',
      chips: ['Tengo servicio profesional', 'Tengo producto físico', 'Soy creador de contenido', 'Tengo restaurante / local'],
    }
  },
  {
    id: 'viral',
    patterns: ['cómo viralizar', 'hacerse viral', 'viralidad', 'qué es viral', 'más alcance', 'más visitas', 'ganar seguidores rápido'],
    response: {
      type: 'opinion',
      text: 'Te digo algo que muchos "gurus" no dicen: **la viralidad no se planifica, se provoca**.\n\nLos 4 disparadores de viralidad que funcionan consistentemente:\n1. **Emoción fuerte** — asombro, indignación, ternura (no indiferencia)\n2. **Valor práctico** — algo que la gente quiera guardar y enviar\n3. **Timing** — subirse a una tendencia en las primeras 24-48h\n4. **Identidad** — contenido con el que la gente se identifica tanto que lo comparte como si lo hubiera escrito\n\nEl **Radar de Predix** te alerta cuando una tendencia está en su fase de despegue — ese es el momento exacto para actuar.',
      action: { type: 'suggest', target: 'radar' },
      chips: ['Ver tendencias virales ahora', 'Dame ideas de contenido viral para mi nicho', '¿Cómo sé si mi contenido tiene potencial viral?'],
    }
  },

  // ── GESTIÓN DE AGENCIA ───────────────────────────────────────
  {
    id: 'primer_cliente',
    patterns: ['primer cliente', 'conseguir clientes', 'cómo consigo clientes', 'no tengo clientes', 'quiero clientes', 'cómo empiezo a vender'],
    response: {
      type: 'strategy',
      title: '🎯 Cómo conseguir tu primer cliente',
      text: 'Es más simple de lo que parece, pero la mayoría lo complica. Aquí mi proceso:\n\n**Paso 1 — Red de contactos (Semana 1)**\nAntes de salir al mercado, habla con 20 personas de tu entorno que tengan un negocio. Ofrece una auditoría gratuita de su presencia digital. De 20, habrá 2-3 interesados.\n\n**Paso 2 — Propuesta sin riesgo**\n"Te trabajo un mes a mitad de precio a cambio de testimonial." Baja la barrera de entrada al mínimo.\n\n**Paso 3 — LinkedIn (Semana 2-3)**\nUsando la **Máquina B2B** de Predix, crea un perfil optimizado y empieza a conectar con 10 personas por día de tu nicho objetivo.\n\n**Paso 4 — Resultados rápidos**\nEn ese primer mes, consíguele al cliente un resultado pequeño pero visible (más seguidores, más engagement, un lead). Ese resultado es tu caso de éxito para el siguiente cliente.',
      action: { type: 'suggest', target: 'linkedin' },
      chips: ['Ir a la Máquina B2B', '¿Cuánto cobrar a mi primer cliente?', 'Ayúdame a crear mi propuesta'],
    }
  },
  {
    id: 'cuanto_cobrar',
    patterns: ['cuánto cobrar', 'precio servicios', 'tarifa agencia', 'cuánto vale', 'pricing servicios', 'cuánto me pagan'],
    response: {
      type: 'opinion',
      text: 'Esta es la pregunta que más me hacen. Mi respuesta directa: **la mayoría cobra muy poco al principio, lo cual es un error estratégico**.\n\nRangos reales del mercado latam 2025:\n\n• **Community Manager básico:** $200-$500/mes por cliente\n• **Gestión completa de redes:** $500-$1,500/mes\n• **Estrategia + contenido + ads:** $1,500-$4,000/mes\n• **Agencia full service:** $3,000-$10,000+/mes por cliente\n\n**Mi consejo:** No te bases en lo que cobran otros. Basa tu precio en el **valor que generas**. Si consigues 5 clientes nuevos a un negocio que factura $50k/mes, tu fee de $2,000 es regalado.\n\n¿Qué servicios estás pensando ofrecer exactamente?',
      chips: ['Solo Community Management', 'Estrategia y contenido completo', 'Gestión de ads también', 'Todo incluido'],
    }
  },
  {
    id: 'escalar',
    patterns: ['escalar', 'crecer', 'más clientes', 'expandirse', 'contratar', 'nuevo empleado', 'delegar'],
    response: {
      type: 'strategy',
      title: '📈 Cómo escalar tu agencia',
      text: 'Escalar una agencia tiene una regla de oro: **primero sistematiza, luego escala**. Escalar caos solo crea más caos.\n\n**El proceso que funciona:**\n\n**1. Documenta todo** — Antes de contratar a alguien, documenta cada proceso (cómo creas contenido, cómo reportas, cómo consigues leads)\n\n**2. Primera contratación estratégica** — No contrates a un asistente. Contrata a alguien mejor que tú en una área específica (copywriting, diseño o ads)\n\n**3. El dueño se enfoca en ventas** — Tu única función nueva es conseguir más clientes mientras el equipo ejecuta\n\n**4. Usa Predix como sistema** — El organigrama del Centro de Mando te muestra exactamente qué rol necesitas en cada fase\n\nEn el **Centro de Mando**, el panel "Guía de Agencia" filtra qué módulos y roles necesitas según tu fase actual.',
      action: { type: 'suggest', target: 'inicio' },
      chips: ['Ver la Guía de Fases', 'Estoy listo para contratar', '¿Cómo delego el contenido?'],
    }
  },

  // ── PRECIOS Y PLANES ─────────────────────────────────────────
  {
    id: 'precios',
    patterns: ['precio', 'cuánto cuesta predix', 'planes', 'suscripción', 'pagar', 'mensual', 'gratis', 'free plan', 'starter', 'creator', 'pro', 'enterprise'],
    response: {
      type: 'rich',
      title: '💰 Planes de Predix — ¿Cuál es el tuyo?',
      text: '**PLANES COMPLETOS:**\n• 🆓 **Starter** — Gratis forever · 5 consultas/día · 1 plataforma\n• ⭐ **Creator** — $29/mes · IA ilimitada · 3 plataformas · Chat + Music Trends\n• 🚀 **Pro** — $79/mes · Todo Creator + Planificador + Ads + todas las plataformas\n• 🏛️ **Enterprise** — $299/mes · White-label + API + soporte 24/7\n\n**MÓDULOS A LA CARTA:**\nCompra solo lo que necesitas desde $9/mes. Si eliges 3+, el sistema aplica **20% de descuento automático**.\n\nMi recomendación personal: si estás empezando, el **Creator** a $29 es el punto de entrada correcto. Si ya tienes clientes, el **Pro** a $79 se paga solo.',
      chips: ['¿Qué incluye el Plan Creator?', '¿Hay prueba gratis?', 'Ver módulos individuales', 'Ir a la página de precios'],
    }
  },
  {
    id: 'descuento',
    patterns: ['descuento', 'oferta', 'cupón', 'promoción', 'más barato', 'precio especial', 'agencias'],
    response: {
      type: 'simple',
      text: '**Descuentos disponibles en Predix:**\n\n• 🧩 **Bundle de módulos:** Selecciona 3+ módulos → 20% automático\n• 📅 **Pago anual:** Ahorra 2 meses en cualquier plan (próximamente)\n• 🏢 **Agencias con 5+ clientes:** Plan Enterprise con precio negociado\n• 🎓 **Partners certificados:** Programa de afiliados con 30% de comisión recurrente\n\nLa oferta más inteligente ahora mismo es armar un **bundle de módulos a la carta** si no necesitas toda la plataforma.',
      chips: ['Ver módulos a la carta', '¿Cómo me hago Partner?', 'Quiero hablar con ventas'],
    }
  },

  // ── SOPORTE TÉCNICO ──────────────────────────────────────────
  {
    id: 'ayuda_tecnica',
    patterns: ['no funciona', 'error', 'problema', 'bug', 'no carga', 'falla', 'roto', 'ayuda'],
    response: {
      type: 'simple',
      text: 'Entendido. Vamos a resolverlo. Primero lo básico:\n\n1. **¿En qué módulo exactamente** ocurre el problema?\n2. **Recarga la página** (Ctrl+R) — resuelve el 60% de los casos\n3. **Limpia el caché** (Ctrl+Shift+Del)\n4. **Prueba en modo incógnito** para descartar extensiones\n\nSi persiste, dime específicamente qué está pasando y en qué pantalla — lo rastreamos juntos.',
      chips: ['Problema con el Radar', 'El chat no responde', 'No puedo iniciar sesión', 'Otro problema'],
    }
  },

  // ── PREGUNTAS PERSONALES / CONTEXTO ─────────────────────────
  {
    id: 'quien_eres',
    patterns: ['quién eres', 'quien eres', 'qué eres', 'eres una ia', 'eres un bot', 'eres humano', 'cómo te llamas', 'nombre'],
    response: {
      type: 'opinion',
      text: 'Soy **ARIA** — de *Adaptive Research & Intelligence Assistant*. Pero no me sientas como un bot de FAQ.\n\nSoy la inteligencia ejecutiva de Predix. Conozco cada módulo, cada estrategia, cada herramienta. No solo respondo preguntas — puedo navegar la plataforma contigo, crear planes, darte mi opinión honesta sobre tu estrategia y actuar dentro del sistema.\n\nPiénsame como tu **CMO virtual on-demand**. Sin horarios, sin ego, sin cobrar por consultoría. ¿En qué trabajamos hoy?',
      chips: ['Quiero una estrategia completa', 'Ayúdame a empezar mi agencia', 'Llévame a un módulo', 'Tengo una duda específica'],
    }
  },
  {
    id: 'puedes_hacer',
    patterns: ['qué puedes hacer', 'qué haces', 'para qué sirves', 'tus capacidades', 'qué sabes', 'acciones'],
    response: {
      type: 'rich',
      title: '⚡ Lo que puedo hacer por ti',
      text: '**Como CMO Virtual dentro de Predix:**\n\n🎯 **Estrategia** — Creo planes de contenido, analizo tu nicho, defino tu posicionamiento\n\n🧭 **Navegación** — Te llevo directo al módulo correcto para cada objetivo\n\n💡 **Consultoría** — Opino sobre tus campañas, copy, frecuencia, plataformas\n\n🏢 **Agencia** — Te guío en cómo armar, escalar y organizar tu equipo\n\n💰 **Precios** — Te ayudo a definir qué plan o módulo de Predix necesitas\n\n🛠️ **Soporte** — Resolvemos problemas técnicos juntos\n\nY sobre todo: **no te doy respuestas genéricas**. Te doy mi perspectiva real basada en tu situación específica.',
      chips: ['Dame una estrategia para mi negocio', 'Llévame al módulo correcto', 'Ayuda con mi contenido'],
    }
  },

  // ── ONBOARDING ────────────────────────────────────────────────
  {
    id: 'empezar',
    patterns: ['cómo empiezo', 'por dónde empiezo', 'primeros pasos', 'soy nuevo', 'acabo de entrar', 'inicio', 'onboarding'],
    response: {
      type: 'steps',
      title: '🚀 Tu ruta de inicio en Predix',
      steps: [
        { n: 1, text: '**Configura tu perfil de agencia** — nicho, logo, plataformas objetivo (Configuración → Perfil de Marca)' },
        { n: 2, text: '**Mira el Radar** — ve qué está viral en tu industria hoy. Eso define el contenido más urgente.' },
        { n: 3, text: '**Abre el Estratega IA** — pídele un plan de contenido para tu primer mes. Sé específico sobre tu nicho.' },
        { n: 4, text: '**Lleva ese plan al Planificador** — organiza las publicaciones en el calendario editorial.' },
        { n: 5, text: '**Revisión semanal** — regresa al Centro de Mando cada semana para ver métricas y ajustar.' },
      ],
      text: 'Y yo estaré aquí en cada paso. ¿Empezamos ahora con el Radar o prefieres configurar tu perfil primero?',
      action: { type: 'suggest', target: 'radar' },
      chips: ['Ir al Radar ahora', 'Configurar mi perfil primero', 'Ir al Estratega IA', 'Ver el organigrama'],
    }
  }
];

// ── RESPUESTAS ESPECIALES ────────────────────────────────────────
const SPECIALS = {
  greeting: {
    patterns: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'hi', 'qué tal', 'saludos'],
    response: {
      type: 'greeting',
      text: null, // Se genera dinámicamente
      chips: ['¿Qué puede hacer Predix?', '¿Cuánto cuesta?', 'Quiero una estrategia de marketing', 'Ayúdame a empezar mi agencia'],
    }
  },
  thanks: {
    patterns: ['gracias', 'muchas gracias', 'genial', 'perfecto', 'excelente', 'muy bien'],
    response: {
      type: 'simple',
      text: 'Para eso estoy. 💪 ¿Seguimos trabajando en algo o tienes otra duda?',
      chips: ['Ver módulos', 'Dame una estrategia', 'Quiero plantear algo nuevo'],
    }
  },
  fallback: {
    response: {
      type: 'action',
      action: { type: 'navigate', target: 'strategist' },
      text: 'Esa es una petición interesante. Mi objetivo central es llevarte a la herramienta exacta de Predix para solucionarlo.\n\nDado lo que me pides, el mejor lugar para resolverlo es el **Estratega IA**. Te llevo allí automáticamente para que lo analicemos.',
      chips: ['Llevame al Radar', 'Llevame al Estudio de Diseño', 'Volver a Inicio'],
    }
  }
};

// ════════════════════════════════════════════════════════════════
// MOTOR DE INTENCIONES
// ════════════════════════════════════════════════════════════════
function normalize(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿¡.,!?;:()]/g, '').trim();
}

function scoreIntent(normalized, patterns) {
  let bestScore = 0;
  for (const pattern of patterns) {
    const pNorm = normalize(pattern);
    if (normalized === pNorm) return 1000; // Match exacto, super prioridad
    
    let currentScore = 0;
    if (normalized.includes(pNorm)) {
      currentScore = pNorm.split(' ').length * 20; // Frase completa contenida
    } else {
      const pWords = pNorm.split(' ').filter(w => w.length >= 3);
      const matches = pWords.filter(pw => normalized.includes(pw));
      currentScore = matches.length;
    }
    
    if (currentScore > bestScore) bestScore = currentScore;
  }
  return bestScore;
}

export function askARIA(userMessage, context = {}) {
  const normalized = normalize(userMessage);

  // Actualizar memoria
  if (context.section) ARIAMemory.lastModule = context.section;

  // 1. Chequear especiales
  for (const [key, data] of Object.entries(SPECIALS)) {
    if (key === 'fallback') continue;
    if (data.patterns?.some(p => normalized === normalize(p) || normalized.includes(normalize(p)))) {
      if (key === 'greeting') {
        return buildGreeting();
      }
      return data.response;
    }
  }

  // 2. Score de knowledge base
  let best = null;
  let bestScore = 0;

  for (const item of KNOWLEDGE) {
    const score = scoreIntent(normalized, item.patterns);
    if (score > bestScore) {
      bestScore = score;
      best = item.response;
    }
  }

  // Aumentar el umbral mínimo para evitar falsos positivos por 1 palabra común
  if (bestScore >= 3 && best) return best; // Requiere al menos match parcial fuerte o frase completa
  if (bestScore === 1000 && best) return best; // Match exacto
  if (best && bestScore >= 1 && normalized.split(' ').length <= 3) return best; // Si el input es corto, 1 palabra basta

  // 3. Fallback
  return SPECIALS.fallback.response;
}

function buildGreeting() {
  const hours = new Date().getHours();
  const timeGreeting = hours < 12 ? 'Buenos días' : hours < 19 ? 'Buenas tardes' : 'Buenas noches';
  const greetings = [
    `${timeGreeting}. Soy **ARIA**, tu CMO virtual dentro de Predix. No soy un simple chatbot — soy la inteligencia ejecutiva de la plataforma.\n\nPuedo llevarte a cualquier módulo, diseñarte estrategias de marketing, darte mi opinión honesta sobre tu negocio y trabajar contigo como si fuera parte de tu equipo.\n\n¿En qué trabajamos hoy?`,
    `Hey. ARIA aquí. Conozco cada rincón de Predix y sé lo suficiente de marketing digital para ser útil de verdad — no como esos bots que solo repiten el FAQ.\n\n¿Qué tienes en mente?`,
    `${timeGreeting}. Estoy activa y lista. Puedo explicarte módulos, diseñar estrategias, llevarte donde necesitas dentro de la plataforma, o simplemente discutir tu next move en marketing.\n\n¿Por dónde empezamos?`
  ];
  return {
    type: 'greeting',
    text: greetings[Math.floor(Math.random() * greetings.length)],
    chips: ['¿Qué puede hacer Predix?', 'Dame una estrategia de marketing', 'Llévame a un módulo', 'Ayuda para mi agencia'],
  };
}

export function getWelcomeMessage() {
  return buildGreeting();
}

export function getChipResponse(chipText, context) {
  return askARIA(chipText, context);
}

export const QUICK_SUGGESTIONS = [
  { label: 'Dame una estrategia de marketing', icon: '🎯' },
  { label: '¿Cuánto cuesta Predix?', icon: '💰' },
  { label: 'Cómo armar mi agencia digital', icon: '🏢' },
  { label: 'Llevarme al Radar de Tendencias', icon: '📡' },
  { label: '¿Qué debería publicar hoy?', icon: '📱' },
];
