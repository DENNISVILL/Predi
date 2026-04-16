import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Sparkles, Copy, Download, RefreshCw,
  Instagram, Twitter, Linkedin, Youtube, Hash, Target,
  Zap, Wand2, Brain, TrendingUp, Users, Clock
} from 'lucide-react';
import useStore from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';
import { generateGeminiResponse } from '../services/geminiService';

const CopywritingModule = () => {
  const { showToast } = useNotifications();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '¡Hola! Soy tu asistente de copywriting con IA. Puedo ayudarte a crear contenido para cualquier red social. ¿Qué necesitas hoy?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedTone, setSelectedTone] = useState('profesional');
  const [selectedAudience, setSelectedAudience] = useState('general');
  
  // Plataformas disponibles
  const platforms = [
    { id: 'all', name: 'Todas', icon: Sparkles, color: 'purple' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'blue' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'blue' },
    { id: 'tiktok', name: 'TikTok', icon: Zap, color: 'red' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'red' }
  ];
  
  // Tonos disponibles
  const tones = [
    'profesional', 'casual', 'divertido', 'inspiracional', 
    'urgente', 'educativo', 'emocional', 'persuasivo'
  ];
  
  // Audiencias
  const audiences = [
    'general', 'millennials', 'gen-z', 'empresarios', 
    'profesionales', 'estudiantes', 'padres', 'seniors'
  ];

  // Templates de prompts por plataforma
  const platformPrompts = {
    instagram: {
      post: "Crea un post de Instagram engaging sobre [TEMA]. Incluye: caption llamativa, 5-10 hashtags relevantes, call-to-action, emojis apropiados. Máximo 2200 caracteres.",
      story: "Genera contenido para Instagram Stories sobre [TEMA]. Incluye: texto breve y llamativo, stickers sugeridos, call-to-action, hashtags. Máximo 160 caracteres por slide.",
      reel: "Crea guión para Instagram Reel sobre [TEMA]. Incluye: hook inicial, desarrollo, cierre con CTA, música sugerida, hashtags trending."
    },
    twitter: {
      tweet: "Escribe un tweet viral sobre [TEMA]. Incluye: mensaje impactante, hashtags relevantes, call-to-action. Máximo 280 caracteres.",
      thread: "Crea un hilo de Twitter de 5-8 tweets sobre [TEMA]. Cada tweet debe ser engaging, incluir numeración, hashtags estratégicos y CTA final."
    },
    linkedin: {
      post: "Redacta un post profesional de LinkedIn sobre [TEMA]. Incluye: introducción llamativa, desarrollo con valor, call-to-action profesional, hashtags de industria.",
      article: "Crea outline para artículo de LinkedIn sobre [TEMA]. Incluye: título SEO, introducción, 3-5 puntos clave, conclusión, hashtags profesionales."
    },
    tiktok: {
      video: "Genera guión para TikTok sobre [TEMA]. Incluye: hook de 3 segundos, desarrollo dinámico, cierre memorable, hashtags trending, música sugerida.",
      trend: "Adapta el trend actual [TREND] para hablar de [TEMA]. Incluye: variación creativa, texto overlay, hashtags virales."
    },
    youtube: {
      short: "Crea guión para YouTube Short sobre [TEMA]. Incluye: hook inicial, contenido de valor, CTA para suscribirse, hashtags optimizados.",
      video: "Genera outline para video de YouTube sobre [TEMA]. Incluye: título clickbait, descripción SEO, timestamps, hashtags, thumbnail ideas."
    }
  };

  // Generador de hashtags por plataforma
  const hashtagGenerator = {
    instagram: {
      general: ['#instagram', '#insta', '#viral', '#trending', '#explore', '#reels', '#photography', '#lifestyle', '#motivation', '#inspiration'],
      tech: ['#tech', '#technology', '#innovation', '#startup', '#ai', '#digital', '#coding', '#developer', '#techlife', '#future'],
      marketing: ['#marketing', '#digitalmarketing', '#socialmedia', '#branding', '#entrepreneur', '#business', '#growth', '#strategy', '#content', '#engagement'],
      fitness: ['#fitness', '#workout', '#health', '#gym', '#motivation', '#fit', '#training', '#wellness', '#lifestyle', '#strong']
    },
    twitter: {
      general: ['#Twitter', '#viral', '#trending', '#thread', '#engagement', '#community', '#discussion', '#news', '#opinion', '#thoughts'],
      tech: ['#Tech', '#AI', '#Innovation', '#Startup', '#Digital', '#Future', '#TechNews', '#Programming', '#Development', '#TechTalk'],
      marketing: ['#Marketing', '#DigitalMarketing', '#SocialMedia', '#Branding', '#Business', '#Growth', '#Strategy', '#Content', '#SEO', '#Analytics']
    },
    linkedin: {
      general: ['#LinkedIn', '#Professional', '#Career', '#Networking', '#Leadership', '#Business', '#Growth', '#Success', '#Motivation', '#Industry'],
      tech: ['#Technology', '#Innovation', '#DigitalTransformation', '#AI', '#TechLeadership', '#StartupLife', '#TechCareers', '#Future', '#Development', '#TechTrends'],
      marketing: ['#Marketing', '#DigitalMarketing', '#B2B', '#LeadGeneration', '#ContentMarketing', '#SalesStrategy', '#BrandBuilding', '#MarketingStrategy', '#ROI', '#CustomerSuccess']
    }
  };

  // 🧠 IA CONVERSACIONAL AVANZADA
  const [conversationContext, setConversationContext] = useState({
    userProfile: {
      industry: null,
      experience: null,
      goals: [],
      challenges: [],
      preferences: {}
    },
    conversationHistory: [],
    currentTopic: null,
    userIntent: null,
    followUpQuestions: []
  });

  // Base de conocimiento de marketing digital
  const marketingKnowledge = {
    strategies: {
      'content marketing': {
        definition: 'Estrategia que se centra en crear y distribuir contenido valioso para atraer audiencia',
        tactics: ['blogging', 'video marketing', 'podcasting', 'infografías'],
        metrics: ['engagement rate', 'time on page', 'shares', 'leads generated'],
        bestPractices: ['consistencia', 'valor agregado', 'storytelling', 'SEO optimization']
      },
      'social media marketing': {
        definition: 'Uso de plataformas sociales para promocionar productos y conectar con audiencia',
        tactics: ['organic posts', 'paid ads', 'influencer partnerships', 'community management'],
        metrics: ['reach', 'engagement', 'clicks', 'conversions'],
        bestPractices: ['posting schedule', 'visual consistency', 'audience interaction', 'hashtag strategy']
      },
      'email marketing': {
        definition: 'Comunicación directa con clientes y prospectos a través del correo electrónico',
        tactics: ['newsletters', 'drip campaigns', 'segmentation', 'automation'],
        metrics: ['open rate', 'click rate', 'conversion rate', 'unsubscribe rate'],
        bestPractices: ['personalization', 'mobile optimization', 'A/B testing', 'clear CTAs']
      },
      'seo': {
        definition: 'Optimización para motores de búsqueda para mejorar visibilidad orgánica',
        tactics: ['keyword research', 'on-page optimization', 'link building', 'technical SEO'],
        metrics: ['organic traffic', 'keyword rankings', 'backlinks', 'page speed'],
        bestPractices: ['quality content', 'user experience', 'mobile-first', 'E-A-T']
      }
    },
    platforms: {
      instagram: {
        audience: 'millennials y gen-z',
        contentTypes: ['photos', 'videos', 'stories', 'reels', 'IGTV'],
        bestTimes: ['6-9 AM', '12-2 PM', '5-7 PM'],
        algorithm: 'engagement-based, recency, relationships'
      },
      linkedin: {
        audience: 'profesionales y empresarios',
        contentTypes: ['articles', 'posts', 'videos', 'documents'],
        bestTimes: ['7-9 AM', '12-2 PM', '5-6 PM'],
        algorithm: 'professional relevance, engagement, connections'
      },
      tiktok: {
        audience: 'gen-z principalmente',
        contentTypes: ['short videos', 'trends', 'challenges'],
        bestTimes: ['6-10 AM', '7-9 PM'],
        algorithm: 'completion rate, engagement, shares'
      }
    },
    trends: {
      2024: ['AI integration', 'short-form video', 'personalization', 'voice search', 'sustainability marketing'],
      emerging: ['AR/VR marketing', 'blockchain loyalty', 'micro-influencers', 'conversational commerce']
    }
  };

  // Analizador de intención avanzado
  const analyzeUserIntent = (message, context) => {
    const lowerMessage = message.toLowerCase();
    
    // Intenciones específicas
    const intents = {
      'strategy_request': ['estrategia', 'plan', 'cómo hacer', 'método', 'approach'],
      'content_creation': ['crear', 'generar', 'escribir', 'post', 'contenido', 'copy'],
      'hashtag_request': ['hashtag', 'etiqueta', 'tag', '#'],
      'platform_advice': ['instagram', 'tiktok', 'linkedin', 'twitter', 'facebook'],
      'metrics_question': ['métricas', 'kpi', 'medir', 'analítica', 'resultados'],
      'problem_solving': ['problema', 'ayuda', 'no funciona', 'mejorar', 'optimizar'],
      'learning': ['qué es', 'cómo funciona', 'explica', 'diferencia', 'aprende'],
      'comparison': ['vs', 'versus', 'mejor', 'comparar', 'diferencia'],
      'trends': ['tendencia', 'trend', 'nuevo', 'actualidad', '2024', '2025']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return 'general_conversation';
  };

  // Extractor de entidades mejorado
  const extractEntities = (message) => {
    const entities = {
      platforms: [],
      strategies: [],
      metrics: [],
      industries: [],
      timeframes: []
    };

    const lowerMessage = message.toLowerCase();

    // Extraer plataformas
    Object.keys(marketingKnowledge.platforms).forEach(platform => {
      if (lowerMessage.includes(platform)) {
        entities.platforms.push(platform);
      }
    });

    // Extraer estrategias
    Object.keys(marketingKnowledge.strategies).forEach(strategy => {
      if (lowerMessage.includes(strategy.replace('_', ' '))) {
        entities.strategies.push(strategy);
      }
    });

    // Extraer métricas comunes
    const commonMetrics = ['roi', 'engagement', 'reach', 'clicks', 'conversiones', 'ctr', 'cpc', 'cpm'];
    commonMetrics.forEach(metric => {
      if (lowerMessage.includes(metric)) {
        entities.metrics.push(metric);
      }
    });

    return entities;
  };

  // Generador de respuestas contextual
  const generateContextualResponse = async (userMessage, context) => {
    const intent = analyzeUserIntent(userMessage, context);
    const entities = extractEntities(userMessage);
    
    // Actualizar contexto de conversación
    const updatedContext = {
      ...context,
      conversationHistory: [...context.conversationHistory, { message: userMessage, intent, entities }],
      currentTopic: entities.strategies[0] || context.currentTopic,
      userIntent: intent
    };

    setConversationContext(updatedContext);

    let response = '';
    let followUpQuestions = [];

    switch (intent) {
      case 'strategy_request':
        response = generateStrategyAdvice(entities, updatedContext);
        followUpQuestions = [
          "¿Qué presupuesto tienes disponible?",
          "¿Cuál es tu audiencia objetivo?",
          "¿Qué métricas son más importantes para ti?"
        ];
        break;

      case 'content_creation':
        response = generateAdvancedContent(entities, updatedContext);
        followUpQuestions = [
          "¿Quieres que ajuste el tono?",
          "¿Necesitas variaciones para otras plataformas?",
          "¿Te gustaría hashtags específicos?"
        ];
        break;

      case 'platform_advice':
        response = generatePlatformAdvice(entities, updatedContext);
        followUpQuestions = [
          "¿Qué tipo de contenido planeas crear?",
          "¿Cuál es tu experiencia en esta plataforma?",
          "¿Tienes algún objetivo específico?"
        ];
        break;

      case 'learning':
        response = generateEducationalContent(entities, updatedContext);
        followUpQuestions = [
          "¿Te gustaría ejemplos prácticos?",
          "¿Quieres que profundice en algún aspecto?",
          "¿Tienes experiencia previa con esto?"
        ];
        break;

      case 'problem_solving':
        response = generateProblemSolution(entities, updatedContext);
        followUpQuestions = [
          "¿Puedes darme más detalles del problema?",
          "¿Qué has intentado hasta ahora?",
          "¿Cuándo comenzó este problema?"
        ];
        break;

      default:
        response = generateConversationalResponse(userMessage, updatedContext);
        followUpQuestions = [
          "¿En qué aspecto del marketing digital te gustaría enfocar?",
          "¿Tienes algún objetivo específico?",
          "¿Qué plataforma te interesa más?"
        ];
    }

    // Añadir preguntas de seguimiento
    if (followUpQuestions.length > 0) {
      response += `\n\n💡 **Preguntas para profundizar:**\n${followUpQuestions.map(q => `• ${q}`).join('\n')}`;
    }

    return response;
  };

  const generateStrategyAdvice = (entities, context) => {
    const platform = entities.platforms[0] || selectedPlatform;
    const strategy = entities.strategies[0];

    if (strategy && marketingKnowledge.strategies[strategy]) {
      const strategyInfo = marketingKnowledge.strategies[strategy];
      
      return `🎯 **Estrategia de ${strategy.replace('_', ' ').toUpperCase()}:**

**Definición:**
${strategyInfo.definition}

**Tácticas recomendadas:**
${strategyInfo.tactics.map(tactic => `• ${tactic}`).join('\n')}

**Métricas clave a medir:**
${strategyInfo.metrics.map(metric => `📊 ${metric}`).join('\n')}

**Mejores prácticas:**
${strategyInfo.bestPractices.map(practice => `✅ ${practice}`).join('\n')}

**Plan de acción para ${platform}:**
1. **Semana 1-2:** Investigación y planificación
2. **Semana 3-4:** Creación de contenido base
3. **Semana 5-8:** Implementación y optimización
4. **Semana 9-12:** Análisis y escalamiento

¿Te gustaría que desarrolle algún punto específico?`;
    }

    return `🚀 **Estrategia personalizada para ${platform}:**

Basándome en nuestra conversación, te recomiendo este enfoque:

**Fase 1: Fundación (Mes 1)**
• Definir buyer persona específico
• Crear calendario de contenido
• Establecer métricas base
• Optimizar perfiles y bio

**Fase 2: Crecimiento (Mes 2-3)**
• Implementar posting schedule consistente
• Comenzar engagement activo con audiencia
• Experimentar con diferentes formatos
• Analizar y optimizar basado en datos

**Fase 3: Escalamiento (Mes 4+)**
• Automatizar procesos repetitivos
• Expandir a nuevas plataformas
• Colaboraciones e influencer marketing
• Campañas pagadas estratégicas

¿En qué fase te encuentras actualmente?`;
  };

  const generateAdvancedContent = (entities, context) => {
    const platform = entities.platforms[0] || selectedPlatform;
    const previousMessages = context.conversationHistory.slice(-3);
    
    // Analizar contexto previo para personalizar
    let contentContext = '';
    if (previousMessages.length > 0) {
      contentContext = `Basándome en nuestra conversación sobre ${context.currentTopic || 'marketing digital'}`;
    }

    const platformInfo = marketingKnowledge.platforms[platform];
    
    return `📝 **Contenido optimizado para ${platform.toUpperCase()}:**

${contentContext ? contentContext + ', aquí tienes:' : ''}

**Hook inicial:**
"${generateContextualHook(platform, context)}"

**Desarrollo del contenido:**
${generateContentBody(platform, context)}

**Call-to-Action optimizado:**
${generatePlatformCTA(platform)}

**Hashtags estratégicos:**
${generateIntelligentHashtags(platform, context)}

**Timing recomendado:**
📅 Mejor horario: ${platformInfo?.bestTimes?.join(', ') || '12-2 PM, 5-7 PM'}

**Consejos adicionales para ${platform}:**
• ${generatePlatformTips(platform)}

¿Quieres que ajuste algo específico del contenido?`;
  };

  const generateContextualHook = (platform, context) => {
    const hooks = {
      instagram: [
        "¿Sabías que el 73% de los marketers...",
        "Plot twist: Lo que creías sobre marketing digital está mal ❌",
        "Después de 5 años en marketing digital, esto es lo que aprendí:",
        "El secreto que los grandes brands no quieren que sepas:"
      ],
      linkedin: [
        "Después de analizar 1000+ campañas, encontré el patrón:",
        "Controversial opinion: La mayoría está haciendo marketing digital mal",
        "3 insights que cambiarán tu perspectiva sobre marketing:",
        "El framework que usé para generar $1M en revenue:"
      ],
      tiktok: [
        "POV: Descubres el hack de marketing que todos usan",
        "Tell me you're a marketer without telling me...",
        "Marketing digital en 2024 be like:",
        "Ese momento cuando tu campaña se vuelve viral:"
      ]
    };

    const platformHooks = hooks[platform] || hooks.instagram;
    return platformHooks[Math.floor(Math.random() * platformHooks.length)];
  };

  const generateContentBody = (platform, context) => {
    const topic = context.currentTopic || 'marketing digital';
    
    return `En mi experiencia trabajando con ${selectedAudience}, he descubierto que ${topic} requiere un enfoque estratégico.

Los 3 elementos clave que debes dominar:

1️⃣ **Conoce a tu audiencia profundamente**
   No solo demographics, sino psychographics

2️⃣ **Crea contenido que resuelva problemas reales**
   Cada post debe aportar valor tangible

3️⃣ **Mide, analiza y optimiza constantemente**
   Los datos no mienten, las suposiciones sí

La realidad es que ${topic} no es solo una táctica, es una mentalidad de crecimiento continuo.`;
  };

  const generatePlatformCTA = (platform) => {
    const ctas = {
      instagram: "¿Cuál de estos 3 puntos resuena más contigo? ¡Cuéntame en los comentarios! 👇",
      linkedin: "¿Qué estrategia has encontrado más efectiva en tu experiencia? Me encantaría conocer tu perspectiva.",
      tiktok: "¿Ya sabías esto? Comenta 'SÍ' si lo sabías o 'NO' si te sorprendió 🤯",
      twitter: "¿Estás de acuerdo? RT si crees que esto es clave para el éxito 🔄"
    };

    return ctas[platform] || ctas.instagram;
  };

  const generateIntelligentHashtags = (platform, context) => {
    const topic = context.currentTopic || 'marketing';
    const baseHashtags = hashtagGenerator[platform]?.[topic] || hashtagGenerator[platform]?.general || [];
    
    // Añadir hashtags contextuales basados en la conversación
    const contextualHashtags = [];
    if (context.conversationHistory.some(h => h.message.includes('startup'))) {
      contextualHashtags.push('#startup', '#entrepreneur');
    }
    if (context.conversationHistory.some(h => h.message.includes('AI') || h.message.includes('IA'))) {
      contextualHashtags.push('#AI', '#artificialintelligence');
    }

    const allHashtags = [...baseHashtags.slice(0, 8), ...contextualHashtags].slice(0, 10);
    return allHashtags.join(' ');
  };

  const generatePlatformTips = (platform) => {
    const tips = {
      instagram: "Usa el primer comentario para hashtags adicionales y aumenta el alcance orgánico",
      linkedin: "Haz preguntas específicas para generar conversación profesional en los comentarios",
      tiktok: "Sube el video cuando tu audiencia esté más activa para mejor performance inicial",
      twitter: "Crea un thread si tienes más que decir - Twitter premia el engagement prolongado"
    };

    return tips[platform] || "Mantén consistencia en tu posting schedule para mejor alcance";
  };

  // Generar respuesta de IA AVANZADA CON GEMINI REAL
  const generateAIResponse = async (userMessage) => {
    setIsGenerating(true);
    
    try {
      // Determinar la intención basada en la selección del UI
      let intent = 'copy';
      if (selectedPlatform === 'all') intent = 'strategy';
      
      const aiResult = await generateGeminiResponse(
        userMessage, 
        intent, 
        'Ecuador', // u otro país dinámico
        false, // Mantenemos false por defecto para Flash o true para Pro
        messages // Pasamos el historial de mensajes
      );

      if (aiResult.success) {
        setIsGenerating(false);
        return aiResult.response;
      } else {
        setIsGenerating(false);
        return aiResult.fallbackResponse || "Error de conexión con IA.";
      }
    } catch (error) {
      setIsGenerating(false);
      return "Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.";
    }
  };

  const extractTopic = (message) => {
    // Lógica simple para extraer el tema
    const words = message.toLowerCase().split(' ');
    const stopWords = ['crear', 'generar', 'hacer', 'post', 'contenido', 'sobre', 'para', 'de', 'un', 'una'];
    const topic = words.filter(word => !stopWords.includes(word)).join(' ');
    return topic || 'marketing digital';
  };

  const generateHashtagResponse = (topic, platform) => {
    const platformHashtags = hashtagGenerator[platform] || hashtagGenerator.instagram;
    const categoryHashtags = platformHashtags[topic] || platformHashtags.general;
    
    const selectedHashtags = categoryHashtags.slice(0, 10);
    const trendingHashtags = ['#viral2024', '#trending', '#fyp', '#explore', '#growth'];
    
    return `🎯 **Hashtags optimizados para ${platform.toUpperCase()}:**

**Hashtags principales:**
${selectedHashtags.join(' ')}

**Hashtags trending:**
${trendingHashtags.join(' ')}

**Recomendaciones:**
• Usa 5-10 hashtags en Instagram
• Usa 1-3 hashtags en Twitter  
• Usa 3-5 hashtags en LinkedIn
• Mezcla hashtags populares con nichos específicos
• Actualiza hashtags semanalmente para mejor alcance

¿Necesitas hashtags para alguna categoría específica?`;
  };

  const generateContentResponse = (topic, platform, tone, audience) => {
    const templates = {
      instagram: `📸 **Post de Instagram sobre ${topic}:**

**Caption:**
${generateCaption(topic, tone, audience)}

**Hashtags sugeridos:**
${hashtagGenerator.instagram.general.slice(0, 8).join(' ')}

**Call-to-Action:**
"¿Qué opinas sobre ${topic}? ¡Déjanos tu comentario! 👇"

**Consejos adicionales:**
• Añade 2-3 emojis relevantes
• Publica entre 6-9 PM para mejor engagement
• Considera crear un carrusel con tips`,

      twitter: `🐦 **Tweet sobre ${topic}:**

${generateTweet(topic, tone, audience)}

**Thread sugerido:**
1/ ${generateTweet(topic, tone, audience)}
2/ Aquí te explico por qué ${topic} es importante...
3/ Los 3 beneficios principales son...
4/ Mi recomendación personal es...
5/ ¿Tú qué experiencia has tenido con ${topic}?

**Hashtags:** ${hashtagGenerator.twitter.general.slice(0, 3).join(' ')}`,

      linkedin: `💼 **Post profesional de LinkedIn sobre ${topic}:**

${generateLinkedInPost(topic, tone, audience)}

**Hashtags profesionales:**
${hashtagGenerator.linkedin.general.slice(0, 5).join(' ')}

**Engagement tips:**
• Haz una pregunta al final
• Responde a todos los comentarios
• Comparte en grupos relevantes`
    };

    return templates[platform] || templates.instagram;
  };

  const generateCaption = (topic, tone, audience) => {
    const hooks = {
      profesional: `¿Sabías que ${topic} puede transformar tu estrategia?`,
      casual: `Hablemos de ${topic} sin rodeos 🤔`,
      divertido: `Plot twist: ${topic} no es lo que pensabas 😱`,
      inspiracional: `${topic} cambió mi perspectiva y puede cambiar la tuya ✨`
    };

    return `${hooks[tone] || hooks.profesional}

En mi experiencia trabajando con ${audience}, he descubierto que ${topic} es clave para el éxito.

Aquí te comparto 3 insights que debes conocer:

1️⃣ [Primer punto importante]
2️⃣ [Segundo insight valioso]  
3️⃣ [Tercer consejo práctico]

La realidad es que ${topic} no es solo una tendencia, es el futuro.`;
  };

  const generateTweet = (topic, tone, audience) => {
    const tweets = {
      profesional: `${topic} está revolucionando la industria. Si no lo estás aprovechando, te estás quedando atrás. Aquí te explico cómo empezar 🧵`,
      casual: `Unpopular opinion: ${topic} es más simple de lo que todos creen. Te explico por qué 👇`,
      divertido: `POV: Descubres ${topic} y tu vida cambia para siempre 😂 (pero en serio, esto es gold)`,
      inspiracional: `${topic} me enseñó que los límites solo existen en nuestra mente. Tu momento es AHORA ⚡`
    };

    return tweets[tone] || tweets.profesional;
  };

  const generateLinkedInPost = (topic, tone, audience) => {
    return `Después de 5 años trabajando con ${audience}, puedo confirmar que ${topic} es un game-changer.

La semana pasada, un cliente implementó esta estrategia y los resultados fueron extraordinarios:
• +150% en engagement
• +80% en conversiones  
• +200% en alcance orgánico

¿El secreto? ${topic} no es solo una herramienta, es una mentalidad.

Aquí te comparto el framework exacto que usamos:

1. ANALIZA tu situación actual
2. DEFINE objetivos claros
3. IMPLEMENTA gradualmente
4. MIDE y optimiza constantemente

¿Qué experiencia has tenido tú con ${topic}?

#MarketingDigital #Estrategia #Crecimiento`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    const aiResponse = await generateAIResponse(inputMessage);
    
    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    showToast('Contenido copiado al portapapeles', 'success');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            Asistente de Copywriting IA
          </h1>
          <p className="text-gray-400 text-lg">
            Genera contenido profesional para todas las redes sociales con IA avanzada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de Configuración */}
          <motion.div
            className="lg:col-span-1 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Plataforma */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                Plataforma
              </h3>
              <div className="space-y-2">
                {platforms.map(platform => (
                  <motion.button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                      selectedPlatform === platform.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <platform.icon className="w-4 h-4" />
                    {platform.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tono */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-green-400" />
                Tono
              </h3>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm"
              >
                {tones.map(tone => (
                  <option key={tone} value={tone}>
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Audiencia */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-yellow-400" />
                Audiencia
              </h3>
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm"
              >
                {audiences.map(audience => (
                  <option key={audience} value={audience}>
                    {audience.charAt(0).toUpperCase() + audience.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Chat Principal */}
          <motion.div
            className="lg:col-span-3 bg-gray-800/50 rounded-xl border border-gray-700/50 flex flex-col h-[600px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Mensajes */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`max-w-[80%] p-3 rounded-xl ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    {message.type === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-600/30">
                        <motion.button
                          onClick={() => copyToClipboard(message.content)}
                          className="text-gray-400 hover:text-white p-1 rounded"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Copy className="w-3 h-3" />
                        </motion.button>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isGenerating && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-700/50 text-gray-100 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                      <span className="text-sm">Generando contenido...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ej: Crea un post de Instagram sobre marketing digital..."
                  className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  disabled={isGenerating}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isGenerating || !inputMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CopywritingModule;
