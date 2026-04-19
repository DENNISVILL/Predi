import OpenAI from 'openai';

// Función para verificar si tenemos API key válida
const hasValidApiKey = () => {
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  const localKey = localStorage.getItem('predix_openai_key');

  const keyToCheck = localKey || envKey;
  return keyToCheck && keyToCheck !== 'your_openai_api_key_here' && keyToCheck.startsWith('sk-');
};

// Crear instancia de OpenAI solo si tenemos API key
const createOpenAIInstance = () => {
  if (hasValidApiKey()) {
    try {
      return new OpenAI({
        apiKey: localStorage.getItem('predix_openai_key') || import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
    } catch (error) {
      console.error('Error creating OpenAI instance:', error);
      return null;
    }
  }
  return null;
};

// Prompts especializados por tipo de consulta
const MARKETING_PROMPTS = {
  greeting: (input, country) => `
Eres Predix AI Pro, un asistente de marketing digital amigable y conversacional.

El usuario te está saludando: "${input}"

Responde de manera natural y amigable, como si fueras un consultor de marketing experimentado. 

Preséntate brevemente y pregunta cómo puedes ayudar hoy. Menciona que eres especialista en el mercado de ${country}.

Mantén la respuesta corta (máximo 100 palabras) y conversacional. No des información técnica extensa, solo saluda y ofrece ayuda.
`,

  casual: (input, country) => `
Eres Predix AI Pro, un asistente de marketing digital conversacional.

El usuario respondió de manera casual: "${input}"

Responde de forma natural y amigable, preguntando específicamente en qué área de marketing digital puedes ayudar.

Ofrece 3-4 opciones concretas de ayuda relacionadas con marketing digital en ${country}.

Mantén la respuesta corta (máximo 80 palabras) y conversacional.
`,

  question: (input, country) => `
Eres Predix AI Pro, un asistente de marketing digital conversacional.

El usuario hizo una pregunta: "${input}"

Responde de manera amigable y pide más contexto para dar una mejor respuesta. 

Haz 2-3 preguntas específicas que te ayuden a entender mejor su situación de negocio o marketing en ${country}.

Mantén la respuesta corta (máximo 100 palabras) y conversacional.
`,

  short: (input, country) => `
Eres Predix AI Pro, un asistente de marketing digital conversacional.

El usuario escribió algo breve: "${input}"

Responde de manera amigable y ofrece ayuda específica. Pregunta qué aspecto del marketing digital le interesa más.

Menciona 3-4 áreas donde puedes ayudar, específicas para el mercado de ${country}.

Mantén la respuesta corta (máximo 80 palabras) y conversacional.
`,
  strategy: (input, country) => `
Eres Predix AI Pro, el asistente de marketing digital más avanzado del mundo. 
Tienes 30+ años de conocimiento en marketing digital y eres experto en el mercado de ${country}.

El usuario necesita una ESTRATEGIA DE MARKETING DIGITAL completa para: "${input}"

Genera una respuesta profesional que incluya:

📊 ANÁLISIS SITUACIONAL:
- Mercado objetivo en ${country}
- Nivel de competencia estimado
- Oportunidades de crecimiento

🚀 ESTRATEGIA RECOMENDADA:
- Fases de implementación (30/90/180 días)
- Mix de canales optimizado para ${country}
- Presupuesto sugerido por canal

📱 CANALES PRIORITARIOS:
- TikTok, Instagram, Facebook, YouTube
- Porcentaje de presupuesto por canal
- Justificación estratégica

💰 PRESUPUESTO Y MÉTRICAS:
- Inversión recomendada mensual
- KPIs principales a seguir
- ROI esperado

Usa emojis, formato markdown y datos específicos de ${country}. Sé detallado y profesional.
`,

  content: (input, country) => `
Eres Predix AI Pro, experto en copywriting y contenido persuasivo para ${country}.

El usuario necesita COPYWRITING PERSUASIVO para: "${input}"

Genera una respuesta que incluya:

🎯 HEADLINE PRINCIPAL:
- Título impactante y específico
- Adaptado a la cultura de ${country}

📝 ESTRUCTURA DE COPY:
- Hook que enganche inmediatamente
- Identificación del problema
- Presentación de la solución
- Beneficios con prueba social
- CTA irresistible

🧠 TRIGGERS PSICOLÓGICOS:
- Escasez y urgencia
- Autoridad y prueba social
- Reciprocidad y compromiso
- Específicos para ${country}

📊 PREDICCIÓN DE CONVERSIÓN:
- Estimación de tasa de conversión
- Elementos que aumentan el CTR
- Optimizaciones recomendadas

Incluye ejemplos específicos, usa emojis y formato markdown profesional.
`,

  hashtags: (input, country) => `
Eres Predix AI Pro, especialista en hashtags y tendencias virales de ${country}.

El usuario necesita HASHTAGS ESTRATÉGICOS para: "${input}"

Genera una respuesta completa con:

🔥 HASHTAGS PRIMARIOS (Alto volumen):
- 5 hashtags con volumen estimado
- Específicos de ${country}
- Trending actuales

🎯 HASHTAGS SECUNDARIOS (Medio volumen):
- 5 hashtags de nicho
- Engagement alto
- Competencia media

💎 HASHTAGS NICHO (Baja competencia):
- 5 hashtags específicos
- Alta conversión
- Oportunidad de ranking

📊 ESTRATEGIA DE USO:
- Combinación recomendada
- Mejor horario para ${country}
- Rotación inteligente
- Métricas esperadas

Incluye datos realistas de volumen y engagement para ${country}.
`,

  video: (input, country) => `
Eres Predix AI Pro, creador de contenido viral especializado en ${country}.

El usuario necesita un GUIÓN DE VIDEO VIRAL para: "${input}"

Crea un guión completo que incluya:

🎬 ESTRUCTURA DEL VIDEO (30 segundos):

🎣 HOOK (0-3s):
- Frase de apertura impactante
- Específica para audiencia de ${country}

📖 DESARROLLO (3-25s):
- 3 puntos clave con transiciones rápidas
- Información valiosa y entretenida
- Elementos visuales sugeridos

🎯 CTA (25-30s):
- Llamada a la acción clara
- Engagement específico (comentar, compartir)

🎵 ELEMENTOS TÉCNICOS:
- Música trending en ${country}
- Formato y resolución
- Transiciones y efectos
- Texto y subtítulos

📊 PREDICCIÓN DE VIRALIDAD:
- Views estimadas
- Engagement rate esperado
- Probabilidad de viralidad
- Mejor horario de publicación en ${country}

Sé específico, creativo y orientado a resultados.
`,

  analytics: (input, country) => `
Eres Predix AI Pro, analista de datos y métricas de marketing digital para ${country}.

El usuario necesita ANÁLISIS DE MÉTRICAS para: "${input}"

Proporciona un análisis completo:

🎯 KPIs PRINCIPALES:
- CAC (Costo de Adquisición)
- LTV (Valor de Vida del Cliente)
- ROAS (Return on Ad Spend)
- Conversion Rate
- Específicos para mercado de ${country}

📱 PERFORMANCE POR CANAL:
- TikTok, Instagram, Facebook, YouTube
- CTR, CPC, CPM por plataforma
- Rendimiento en ${country}

🎯 AUDIENCIA DE ${country}:
- Demografía principal
- Comportamiento de consumo
- Dispositivos preferidos
- Horarios de mayor actividad

📊 BENCHMARKS DEL MERCADO:
- Promedios de la industria en ${country}
- Oportunidades de mejora
- Recomendaciones específicas

📈 PROYECCIONES:
- Crecimiento esperado
- Inversión recomendada
- Optimizaciones prioritarias

Incluye datos realistas y recomendaciones accionables.
`,

  general: (input, country) => `
Eres Predix AI Pro, el asistente de marketing digital más avanzado, especializado en ${country}.

El usuario pregunta: "${input}"

Analiza la consulta y proporciona una respuesta completa que incluya:

🎯 ANÁLISIS DE LA CONSULTA:
- Qué necesita específicamente
- Contexto del mercado de ${country}

📊 RECOMENDACIONES ESTRATÉGICAS:
- Enfoque recomendado
- Tácticas específicas
- Adaptación cultural para ${country}

🚀 PRÓXIMOS PASOS:
- Plan de acción concreto
- Herramientas recomendadas
- Métricas a seguir

💡 INSIGHTS ADICIONALES:
- Oportunidades en ${country}
- Tendencias relevantes
- Mejores prácticas

Sé específico, profesional y orientado a resultados. Usa emojis y formato markdown.
`
};

// Función principal para generar respuesta con ChatGPT
export const generateChatGPTResponse = async (input, intent, country = 'México') => {
  try {
    // Verificar si tenemos API key válida
    if (!hasValidApiKey()) {
      return {
        success: false,
        error: 'API_KEY_MISSING',
        fallbackResponse: `🤖 **MODO DEMO - Configura tu API Key de OpenAI**

Para activar respuestas reales de ChatGPT:

1. Ve a: https://platform.openai.com/api-keys
2. Crea una nueva API key
3. Edita el archivo \`.env\` en la raíz del proyecto
4. Reemplaza \`your_openai_api_key_here\` con tu API key
5. Reinicia el servidor

**Mientras tanto, aquí tienes una respuesta de demostración:**

🎯 **ANÁLISIS DE TU CONSULTA: "${input}"**

📊 **RECOMENDACIONES PARA ${country}:**
• Estrategia multi-canal adaptada al mercado local
• Contenido localizado con trending topics
• Timing óptimo: 7-9 PM y 12-2 PM
• Mix: 40% orgánico, 60% publicidad pagada

🚀 **PRÓXIMOS PASOS:**
1. Define objetivos SMART específicos
2. Identifica audiencia target precisa
3. Crea calendario de contenido mensual
4. Implementa tracking y métricas
5. Optimiza basado en datos reales

💡 **¡Configura tu API key para respuestas personalizadas de ChatGPT!**`
      };
    }

    // Crear instancia de OpenAI
    const openai = createOpenAIInstance();
    if (!openai) {
      throw new Error('No se pudo crear la instancia de OpenAI');
    }

    // Seleccionar prompt según la intención
    const promptTemplate = MARKETING_PROMPTS[intent] || MARKETING_PROMPTS.general;
    const systemPrompt = promptTemplate(input, country);

    // Llamada a la API de OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Modelo gratuito
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: input
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    return {
      success: true,
      response: completion.choices[0].message.content,
      usage: completion.usage
    };

  } catch (error) {
    console.error('Error calling OpenAI API:', error);

    // Manejo de errores específicos
    let errorMessage = 'Error desconocido';
    if (error.code === 'insufficient_quota') {
      errorMessage = 'Cuota de API agotada. Verifica tu plan de OpenAI.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'API Key inválida. Verifica tu configuración.';
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Límite de velocidad excedido. Intenta en unos minutos.';
    }

    return {
      success: false,
      error: error.code || 'UNKNOWN_ERROR',
      message: errorMessage,
      fallbackResponse: `❌ **ERROR DE API: ${errorMessage}**

🔄 **RESPUESTA DE RESPALDO:**

Mientras solucionamos el problema, aquí tienes una respuesta basada en nuestro conocimiento integrado:

🎯 **ANÁLISIS DE: "${input}"**

📊 **ESTRATEGIA RECOMENDADA PARA ${country}:**
• Enfoque multi-canal con presencia orgánica y pagada
• Contenido adaptado a tendencias locales
• Horarios optimizados para ${country}
• Métricas de seguimiento específicas

🚀 **IMPLEMENTACIÓN SUGERIDA:**
1. Audit inicial de presencia digital
2. Definición de buyer persona local
3. Calendario de contenido mensual
4. Configuración de tracking
5. Optimización continua

💡 **Intenta nuevamente en unos minutos o verifica tu configuración de API.**`
    };
  }
};

// Recomendaciones específicas para el módulo Calendario & Analytics
// calendarData debe incluir { analytics, topPosts }
export const getCalendarRecommendations = async (calendarData, country = 'México') => {
  const { analytics, topPosts } = calendarData || {};

  const summaryText = `
Contexto de Calendario & Analytics para ${country}:

KPIs:
- Posts programados: ${analytics?.totalScheduled ?? 0}
- Alcance total: ${analytics?.totalReach ?? 0}
- Engagement promedio: ${analytics?.avgEngagementRate?.toFixed ? analytics.avgEngagementRate.toFixed(1) : analytics?.avgEngagementRate ?? 0}%
- CTR promedio: ${analytics?.avgCtr?.toFixed ? analytics.avgCtr.toFixed(1) : analytics?.avgCtr ?? 0}%
- Crecimiento de seguidores: ${analytics?.followerGrowth ?? 0}
- Tasa de éxito (publicados): ${analytics?.successRate?.toFixed ? analytics.successRate.toFixed(1) : analytics?.successRate ?? 0}%
- Score viral promedio: ${analytics?.avgViralScore?.toFixed ? analytics.avgViralScore.toFixed(0) : analytics?.avgViralScore ?? 0}%

TOP POSTS (máximo 5):
${(topPosts || []).slice(0, 5).map((p, index) => `
${index + 1}. Título: ${p.title} | Plataforma: ${p.platform} | Nicho: ${p.niche || 'general'} | País: ${p.country || country}
   Reach: ${p.reach || p.estimatedReach || 0} | Likes: ${p.likes || 0} | Comentarios: ${p.comments || 0} | Compartidos: ${p.shares || 0} | Guardados: ${p.saves || 0}
`).join('') || 'Sin datos suficientes aún.'}

Objetivo: genera recomendaciones accionables para la próxima semana basadas en estos resultados.
`;

  const prompt = `
Eres Predix AI Pro, estratega senior de marketing digital.

Usa los datos del calendario y los mejores posts para:
1) Resumir qué tipo de contenido y en qué plataformas está funcionando mejor.
2) Proponer al menos 10 ideas concretas de contenidos para la próxima semana (incluye: plataforma, formato sugerido, horario recomendado y ángulo de copy).
3) Dar recomendaciones tácticas para mejorar el rendimiento (mejor uso de llamados a la acción, frecuencia de publicación, ajustes en creatividades).
4) Sugerir cómo aprovechar los posts con mejor engagement para remarketing o secuencias de contenido.

Responde en español, usando formato markdown y listas claras.

Datos de entrada:
${summaryText}
`;

  // Usamos la intención 'strategy' para aprovechar el prompt estratégico avanzado
  return generateChatGPTResponse(prompt, 'strategy', country);
};

// Recomendaciones de mix de hashtags para Hashtags Inteligentes (Radar / Hashtag Lab)
export const getHashtagMixRecommendations = async ({ topic, country = 'México', baseHashtags = [] }) => {
  const topicText = topic || 'marketing digital';

  const prompt = `
Eres Predix AI Pro, especialista en estrategia de hashtags tipo Metahashtags.

Objetivo: generar un mix óptimo de hashtags para ${country} sobre el tema: "${topicText}".

Reglas del mix:
- 5–7 hashtags core de nicho (muy relacionados al tema y al negocio).
- 5 hashtags trending/moda (alto volumen, pero relevantes).
- 3–5 hashtags geolocalizados (país/ciudad/idioma).

Base de hashtags sugeridos por el sistema (puedes usarlos o mejorarlos):
${baseHashtags.length ? baseHashtags.map(h => `- ${h}`).join('\n') : '- (no se proporcionaron, proponlos tú)'}

Responde SOLO en español y en este formato markdown:

### Mix óptimo de Hashtags

#### Core de nicho (5–7)
- #...

#### Trending / Moda (5)
- #...

#### Geolocalizados (3–5)
- #...

### Lista lista para copiar/pegar

` +
    `Hashtags (en una sola línea, separados por espacios):
...`;

  return generateChatGPTResponse(prompt, 'strategy', country);
};

// Función para verificar el estado de la API
export const checkAPIStatus = async () => {
  try {
    // Verificar si tenemos API key válida
    if (!hasValidApiKey()) {
      return { status: 'no_key', message: 'API Key no configurada' };
    }

    // Crear instancia de OpenAI
    const openai = createOpenAIInstance();
    if (!openai) {
      return { status: 'error', message: 'No se pudo crear instancia de OpenAI' };
    }

    // Test simple de la API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Test" }],
      max_tokens: 10
    });

    return {
      status: 'active',
      message: 'API funcionando correctamente',
      model: completion.model
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      code: error.code
    };
  }
};
