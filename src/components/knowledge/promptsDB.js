export const promptCategories = [
  { id: 'all', label: 'Todos los Prompts' },
  { id: 'seo', label: 'SEO & Copywriting' },
  { id: 'ads', label: 'Anuncios & Media Buying' },
  { id: 'social', label: 'Redes Sociales' },
  { id: 'strategy', label: 'Estrategia & Negocios' },
  { id: 'email', label: 'Email Marketing' },
];

export const promptsDB = [
  {
    id: 1,
    categoria: 'seo',
    titulo: 'Auditoría SEO Integral',
    descripcion: 'Genera un plan de auditoría técnica y de contenido para una web específica.',
    prompt: `Actúa como un Consultor SEO Senior con más de 10 años de experiencia. Necesito que realices una auditoría SEO inicial para mi sitio web: [URL_DEL_SITIO]. 
Tu análisis debe incluir:
1. Arquitectura del sitio y estructura de URLs (mejores prácticas).
2. Estrategia de palabras clave principales para el nicho de [NICHO].
3. 5 recomendaciones técnicas (velocidad, mobile-first, schema markup).
4. Un plan de contenido a 3 meses para mejorar la autoridad de dominio (Topical Authority).
Presenta la información en un formato claro, utilizando tablas y viñetas.`,
    tags: ['Auditoría', 'Técnico', 'Plan de Acción']
  },
  {
    id: 2,
    categoria: 'social',
    titulo: 'Calendario de Contenidos a 30 Días',
    descripcion: 'Crea una matriz de contenidos mensual enfocada en los 4 pilares.',
    prompt: `Actúa como un Social Media Manager experto. Crea un calendario de contenidos de 30 días para una marca de [TIPO_DE_MARCA/INDUSTRIA].
El objetivo principal es [OBJETIVO: Vender/Crear Comunidad/Autoridad].
El calendario debe seguir los 4 pilares de contenido: Educar, Entretener, Inspirar, y Vender (proporción 40/20/20/20).
Para cada día, proporciona:
- Pilar de contenido.
- Formato (Reel, Carrusel, Historia, Tweet).
- Título o gancho (Hook).
- Breve descripción del concepto visual.
Entrégalo en formato de tabla de lunes a domingo.`,
    tags: ['Calendario', 'Redes Sociales', 'Planificación']
  },
  {
    id: 3,
    categoria: 'ads',
    titulo: 'Estructura de Campaña Meta Ads',
    descripcion: 'Diseña la arquitectura de una campaña publicitaria en Facebook/Instagram.',
    prompt: `Actúa como un Media Buyer especializado en Meta Ads. Diseña una estructura de campaña completa para [PRODUCTO/SERVICIO] con un presupuesto de [PRESUPUESTO_MENSUAL].
Incluye:
1. Etapa TOFU (Top of Funnel): Audiencias, formatos y 3 ángulos creativos.
2. Etapa MOFU (Middle of Funnel): Audiencias de retargeting y 2 ángulos para romper objeciones.
3. Etapa BOFU (Bottom of Funnel): Audiencia hiper-segmentada y 1 ángulo con oferta irresistible.
Detalla cómo distribuir el presupuesto entre estas 3 etapas.`,
    tags: ['Meta Ads', 'Estrategia', 'Presupuesto']
  },
  {
    id: 4,
    categoria: 'seo', // Changed to seo because 'copywriting' category is not in the list, though UI logic handled it. Let's keep it clean.
    titulo: 'Framework PAS (Problema, Agitación, Solución)',
    descripcion: 'Redacta una página de ventas o landing page persuasiva.',
    prompt: `Usa el framework de copywriting PAS (Problema, Agitación, Solución) para escribir el texto de una landing page que vende [PRODUCTO/SERVICIO].
Audiencia objetivo: [DESCRIBE_A_TU_CLIENTE_IDEAL].
Paso 1: Identifica el mayor problema que tiene mi audiencia de forma dolorosamente precisa.
Paso 2: Agita ese problema mostrando qué pasará si no lo resuelven hoy y cómo afecta su vida/negocio.
Paso 3: Presenta mi producto como la única solución lógica y fácil, detallando 3 beneficios clave.
Incluye un Call to Action (CTA) fuerte al final.`,
    tags: ['Copywriting', 'Ventas', 'Landing Page']
  },
  {
    id: 5,
    categoria: 'email',
    titulo: 'Secuencia de Carrito Abandonado',
    descripcion: 'Recupera ventas perdidas con una secuencia de 3 correos.',
    prompt: `Escribe una secuencia de 3 correos electrónicos para recuperar carritos abandonados de una tienda de [TIPO_DE_TIENDA/PRODUCTO].
Correo 1 (1 hora después): Recordatorio amigable de que dejaron algo. Tono de servicio al cliente.
Correo 2 (24 horas después): Resolución de objeciones. Por qué el producto vale la pena y testimonios cortos.
Correo 3 (48 horas después): Urgencia. Ofrece un descuento temporal del [X]% que expira en 24 horas.
Incluye líneas de asunto (subject lines) creativas y de alta apertura para cada correo.`,
    tags: ['Email', 'E-commerce', 'Retención']
  },
  {
    id: 6,
    categoria: 'strategy',
    titulo: 'Definición de Buyer Persona Profundo',
    descripcion: 'Crea el perfil psicológico y demográfico de tu cliente ideal.',
    prompt: `Actúa como un investigador de mercado y estratega de marca. Desarrolla un perfil de "Buyer Persona" extremadamente detallado para un negocio que vende [TU_PRODUCTO/SERVICIO].
Quiero que incluyas:
1. Datos demográficos básicos (Edad, ubicación, ingresos, ocupación).
2. Psicografía (Valores, creencias, intereses).
3. Puntos de dolor: ¿Cuáles son las 3 cosas que no lo dejan dormir por la noche respecto a [NICHO]?
4. Deseos profundos: ¿Cómo se vería su vida ideal si resolviera este problema?
5. Objeciones de compra: ¿Por qué NO compraría mi producto?
6. Fuentes de información: ¿A quién sigue en redes, qué lee, dónde pasa el tiempo online?`,
    tags: ['Estrategia', 'Buyer Persona', 'Investigación']
  },
  {
    id: 7,
    categoria: 'social',
    titulo: 'Guiones de TikTok/Reels Virales',
    descripcion: 'Estructuras comprobadas para videos cortos con alta retención.',
    prompt: `Genera 3 guiones detallados para videos cortos (TikTok/Reels/Shorts) sobre [TEMA_DE_TU_VIDEO]. 
Aplica la siguiente estructura probada para retención:
1. Hook (0-3s): Una afirmación audaz, una pregunta inusual o un cambio visual rápido que obligue a detener el scroll. (Ej: "Todo lo que te dijeron sobre [TEMA] es mentira").
2. Contexto rápido (3-8s): Por qué el espectador debería escucharte o cuál es el problema común.
3. El "Carne" (8-45s): 3 puntos de valor, entregados de forma rápida y concisa.
4. Call to Action sutil (45-60s): Algo que provoque un comentario o un guardado, no solo un "sígueme".
Incluye indicaciones visuales y de texto en pantalla para cada segundo del guion.`,
    tags: ['Video', 'TikTok', 'Viralidad']
  },
  {
    id: 8,
    categoria: 'seo',
    titulo: 'Generador de Hooks Irresistibles',
    descripcion: 'Crea los primeros 3 segundos vitales para cualquier contenido.',
    prompt: `Actúa como un copywriter especialista en captar atención. Genera 10 "Hooks" (Ganchos) irresistibles para un contenido sobre [TEMA]. 
Utiliza diferentes ángulos psicológicos para los ganchos:
- Curiosidad extrema
- Beneficio directo
- Desmentir un mito (Contraintuitivo)
- Urgencia/Miedo a perderse algo (FOMO)
- Afirmación polémica relacionada al nicho
- "Cómo X logró Y sin Z"
Dame los 10 ganchos numerados, listos para usar como primera frase de un video o el título de un carrusel.`,
    tags: ['Copywriting', 'Ganchos', 'Atención']
  },
  {
    id: 9,
    categoria: 'ads',
    titulo: 'Creatividades (Anuncios) de Alto Rendimiento',
    descripcion: 'Ideas para anuncios en video e imagen que conviertan.',
    prompt: `Actúa como Director Creativo de una agencia de Performance Marketing. Necesito 5 conceptos creativos para anuncios de [PRODUCTO/SERVICIO] dirigidos a [AUDIENCIA].
Para cada concepto, detalla:
1. Formato (Video UGC, Imagen Estática con Texto, Carrusel de Beneficios, Meme, etc.).
2. El elemento visual principal: ¿Qué es lo primero que ve el usuario?
3. El "Hook" visual y textual: ¿Cómo captamos la atención en el primer segundo?
4. El dolor/beneficio que ataca.
5. El Call to Action.
Asegúrate de que los conceptos sean diversos (uno emocional, uno lógico/educativo, uno centrado en prueba social, etc.).`,
    tags: ['Ads', 'Creatividades', 'Conversión']
  },
  {
    id: 10,
    categoria: 'strategy',
    titulo: 'Análisis de Competencia (DOFA Competitivo)',
    descripcion: 'Desmenuza la estrategia de tus 3 principales competidores.',
    prompt: `Realiza un análisis competitivo profundo asumiendo el rol de un Estratega de Negocios. Mi empresa es [TU_EMPRESA] y mis 3 competidores principales son [COMPETIDOR_1], [COMPETIDOR_2] y [COMPETIDOR_3].
Para cada competidor, analiza:
1. Su principal Propuesta de Valor Única (¿Por qué la gente les compra a ellos?).
2. Su estrategia de adquisición de clientes percibida (¿Cómo consiguen tráfico?).
3. Sus mayores fortalezas.
4. Sus puntos ciegos o debilidades evidentes (Oportunidades para mí).
Finalmente, con base en este análisis, dime 3 acciones específicas que mi empresa puede tomar para diferenciarse en el mercado.`,
    tags: ['Estrategia', 'Competencia', 'Mercado']
  },
  {
    id: 11,
    categoria: 'email',
    titulo: 'Secuencia de Bienvenida (Onboarding)',
    descripcion: 'Convierte nuevos suscriptores en fans de la marca.',
    prompt: `Crea una secuencia de correos de bienvenida (Welcome Series) de 4 partes para nuevos suscriptores de la newsletter de [TU_MARCA/NEGOCIO].
Día 1: Entrega del lead magnet/promesa y la historia del fundador (Conexión).
Día 2: El "Por qué" hacemos lo que hacemos y nuestros valores principales.
Día 3: El mejor contenido/recursos que tenemos (Aportar valor masivo sin pedir nada).
Día 4: Transición suave a la primera oferta (Low-ticket) o llamada a la acción principal.
Escribe el contenido completo de cada correo con tono [TONO_DE_VOZ: Profesional, Divertido, Inspiracional].`,
    tags: ['Email', 'Bienvenida', 'Lead Nurturing']
  },
  {
    id: 12,
    categoria: 'social',
    titulo: 'Sistema de Reutilización de Contenido',
    descripcion: 'Transforma una pieza larga de contenido en 10 posts.',
    prompt: `Tengo un [FORMATO_ORIGINAL: Video de YouTube / Artículo de Blog / Podcast] sobre [TEMA_DEL_CONTENIDO]. 
Necesito que actúes como mi Content Repurposing Manager y me des un plan detallado para convertir esta pieza central en:
- 3 Videos cortos (Shorts/Reels) destacando los momentos clave (dame los hooks para cada uno).
- 2 Hilos de Twitter (X) resumiendo puntos diferentes.
- 1 Carrusel de Instagram o LinkedIn muy visual (indica qué va en cada slide).
- 1 Correo electrónico para mi lista (Newsletter).
- 3 Tweets sueltos (citas o datos rápidos).
Proporciona el esquema y el texto inicial para cada una de estas 10 piezas de contenido.`,
    tags: ['Reutilización', 'Productividad', 'Redes Sociales']
  }
];
