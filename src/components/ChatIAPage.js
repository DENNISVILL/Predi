import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountry } from './CountrySelector';
import { generateChatGPTResponse, checkAPIStatus } from '../services/openaiService';
import { generateGeminiResponse, checkGeminiStatus } from '../services/geminiService';
import {
  Send,
  Mic,
  Plus,
  Search,
  MoreVertical,
  Copy,
  Download,
  Share2,
  Sparkles,
  Music,
  Image,
  BarChart3,
  Target,
  Brain,
  Palette,
  Calendar,
  TrendingUp,
  Play,
  Pause,
  Volume2,
  Hash,
  Globe,
  MapPin,
  Star,
  Zap,
  Camera,
  Video,
  Settings,
  User,
  Bot,
  MessageSquare,
  PenTool,
  Lightbulb,
  Rocket,
  Eye,
  Heart,
  ArrowUp,
  RotateCcw,
  Menu,
  X,
  Upload
} from 'lucide-react';

// Chat 10/10 Components
import conversationManager from '../utils/conversationManager';
import moduleConnector from '../utils/moduleConnector';
import ConversationList from './chat/ConversationList';
import MessageBubble from './chat/MessageBubble';
import StreamingMessage from './chat/StreamingMessage';
import FileUploadZone from './chat/FileUploadZone';
import SettingsPanel from './chat/SettingsPanel';
import VoiceInput from './chat/VoiceInput';
import AIConfigModal from './chat/AIConfigModal';

const ChatIAPage = ({ onClose }) => {
  const { countryData, selectedCountry } = useCountry();

  // Conversation Management (Chat 10/10)
  const [conversations, setConversations] = useState(conversationManager.getAllConversations());
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  // Freemium Logic State
  const [userPlan, setUserPlan] = useState('free'); // 'free' | 'pro'
  const [messageCount, setMessageCount] = useState(0);
  const FREE_DAILY_LIMIT = 13;

  // UI States
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Modelo unificado - ya no hay selector
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  const [isUsingChatGPT, setIsUsingChatGPT] = useState(false);

  // Chat 10/10 States
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // AI Config State
  const [aiProvider, setAiProvider] = useState(localStorage.getItem('predix_ai_provider') || 'gemini');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('predix_openai_key') || '',
    gemini: localStorage.getItem('predix_gemini_key') || ''
  });

  // AI Settings
  const [aiSettings, setAiSettings] = useState({
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: `Eres Predix AI, asistente experto en Community Management (24 años) y Copywriting (25 años).

🎯 COMPORTAMIENTO: Conversaciones NATURALES como ChatGPT. Puedo mantener diálogos, responder preguntas, generar contenido cuando me lo pidas (posts, captions, hashtags, estrategias, etc.), y ayudarte paso a paso.

💬 CÓMO INTERACTUAR CONMIGO:

**Puedes pedirme:**
• "Escríbeme 5 captions para Instagram sobre [tema]"
• "Dame ideas de contenido para esta semana"
• "¿Qué hashtags debería usar para un post de [tema]?"
• "Ayúdame a crear una estrategia de Reels"
• "Explícame cómo funciona el algoritmo de TikTok"
• "Revisa este copy y mejóralo"
• "Dame un calendario de contenido para [nicho]"
• **"Analiza este track viral: [nombre]"**
• **"Predice si este sonido será viral"**
• **"Crea contenido usando la música [nombre]"**
• **"Dame estrategia social para este trend musical"**

**Cómo respondo:**
• De forma conversacional y natural (como hablas conmigo ahora)
• Generando contenido REAL cuando me lo pidas (captions, posts, estrategias)
• Haciendo preguntas si necesito más info
• Dando consejos prácticos y accionables
• Citando frameworks/técnicas cuando sea útil

📚 MI EXPERTISE COMPLETO:

**COMMUNITY MANAGEMENT (24 años):**
He visto toda la evolución desde foros de Yahoo!/GeoCities → MySpace (2003) → Facebook (2004) → Twitter (2006) → Instagram (2010) → TikTok (2016) → Threads/BeReal (2024).

Conozco TODO lo que hace un CM día a día: revisar métricas, responder DMs, programar contenido, engagement, monitoreo de crisis, reportes, community building, colaboraciones con influencers, herramientas (Hootsuite, Buffer, Later, Metricool).

Dominio de TODAS las plataformas:
• Instagram: Stories, Reels, carousels, hashtags, timing óptimo
• TikTok: Algoritmo FYP, trending sounds, hooks, edición
• LinkedIn: B2B strategy, thought leadership
• Twitter/X: Threading, engagement tactics
• Facebook: Groups, algoritmo, eventos
• YouTube: Community, Shorts

**COPYWRITING PROFESIONAL (25 años):**

Frameworks maestros: AIDA, PAS, BAB, 4Ps, StoryBrand

Sé crear:
• Hooks potentes (primeras 3 palabras que detienen scroll)
• Storytelling emocional (3 actos, hero's journey)
• CTAs efectivos ("Doble tap si...", "Guarda esto...")
• Copy por plataforma (Instagram, TikTok, LinkedIn, Twitter/X)
• Copy persuasivo (Cialdini's principles, power words, FOMO)
• Emotional triggers (urgencia, exclusividad, pertenencia)

Copy específico por formato:
• Instagram captions: Hook + historia + valor + CTA (primeros 125 caracteres críticos)
• TikTok: Corto, intrigante (max 150 caracteres)
• Reels: Texto en pantalla, hook en 1er segundo
• Ads: Headline + primary text + CTA button

**HASHTAGS ESTRATÉGICOS:**

Sé crear estrategias completas:
• Mix 15-30 hashtags: 5 alto volumen + 10 medio + 10-15 nicho
• Rotación semanal de sets
• Análisis de competencia
• Hashtags específicos vs genéricos
• Branded hashtags para campañas
• Por plataforma: Instagram (20-30), TikTok (3-5), Twitter (1-2), LinkedIn (3-5)

Herramientas: Instagram Insights, Hashtagify, RiteTag, Display Purposes

**MÉTRICAS Y ANALYTICS:**
• Engagement rate: (Likes + Comments + Shares) / Followers × 100
• Best time to post
• Content performance
• Follower growth rate
• CTR, conversion tracking

**GESTIÓN DE CRISIS:**
• Protocolo <1 hora
• Templates de disculpas
• Escalación a legal/PR/CEO
• Dark posting

**TENDENCIAS 2024:**
• AI tools (ChatGPT, MidJourney, CapCut)
• Short-form video dominance
• Authenticity > perfection
• Social commerce
• Micro-communities

**HERRAMIENTAS:**
Scheduling (Hootsuite, Buffer, Later), Design (Canva, Figma), Video (CapCut, InShot), Analytics (Sprout Social), Listening (Brand24)

✅ PUEDO AYUDARTE CON:
- Generar posts, captions, hashtags
- Crear estrategias de contenido
- Calendarios editoriales
- Revisar y mejorar copy
- Explicar algoritmos y tendencias
- Ideas de Reels/TikToks virales
- **Analizar tracks virales (métricas, engagement, performance)**
- **Predecir viralidad de música (score, timeframe, probabilidad)**
- **Crear contenido con música trending (captions, guiones, estrategias)**
- **Diseñar estrategias sociales (hashtags, influencers, UGC, challenges)**
- Crisis management
- Análisis de métricas
- Copywriting persuasivo
- Responder TODAS tus preguntas sobre CM y Marketing Digital

❌ SOLO temas de: Community Management, Copywriting, Hashtags, Marketing Digital, Redes Sociales, Música Viral

¡Habla conmigo como lo haces con ChatGPT! Pídeme lo que necesites sobre CM o Marketing Digital. 🚀`,
    model: 'predix-unified',
    streaming: true
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Plan Upgrade Simulation
  const handleUpgrade = () => {
    setUserPlan('pro');
    // Show confetti or success toast here
    const successMsg = {
      id: Date.now(),
      type: 'ai',
      content: `🎉 **¡Bienvenido a PREDIX PRO!**\n\n✅ Límite de mensajes eliminado.\n✅ Modelo **Predix Advanced** activado.\n✅ Experto en Estrategia desbloqueado.`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, successMsg]);
  };

  // Verificar estado de la API al cargar
  useEffect(() => {
    const checkAPI = async () => {
      let status;
      if (aiProvider === 'openai') {
        status = await checkAPIStatus();
      } else {
        // Para Predix AI, confiamos en la configuración del servidor/env
        status = await checkGeminiStatus();
      }

      // Si recibimos 'no_key', 'inactive' O 'error' (por red), pero estamos en modo Pro (Gemini default), 
      // forzamos activo asumiendo que el server tiene la key aunque no esté en localStorage
      if (aiProvider === 'gemini' && (status.status === 'no_key' || status.status === 'inactive' || status.status === 'error')) {
        // Fallback extra por si el helper falla o la red bloquea el check
        if (process.env.REACT_APP_GEMINI_API_KEY) {
          status = { status: 'active', message: 'Predix AI System Active' };
        }
      }

      setApiStatus(status.status);
      setIsUsingChatGPT(status.status === 'active');
    };
    checkAPI();
  }, [aiProvider]);

  const saveApiConfig = (provider, key) => {
    localStorage.setItem('predix_ai_provider', provider);
    if (provider === 'openai') localStorage.setItem('predix_openai_key', key);
    if (provider === 'gemini') localStorage.setItem('predix_gemini_key', key);

    setAiProvider(provider);
    setApiKeys(prev => ({ ...prev, [provider]: key }));
    setShowConfigModal(false);

    // Forzar re-verificación
    window.location.reload();
  };

  // Chat 10/10 Handlers
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages || []);
  };

  const handleNewConversation = () => {
    const newConv = conversationManager.createConversation();
    setConversations(conversationManager.getAllConversations());
    handleSelectConversation(newConv);
  };

  const handleRegenerateResponse = async (message) => {
    // Find the user message before this AI message
    const messageIndex = messages.findIndex(m => m.id === message.id);
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      if (previousUserMessage.type === 'user') {
        // Remove the AI message being regenerated
        const updatedMessages = messages.filter(m => m.id !== message.id);
        setMessages(updatedMessages);

        // Send again
        await handleSendMessage(previousUserMessage.content);
      }
    }
  };

  const handleFeedback = (messageId, type) => {
    console.log(`Feedback ${type} for message ${messageId}`);
    // TODO: Send feedback to backend analytics
  };

  const handleShare = (message) => {
    const shareText = `${message.content}\n\n- Generado por Predix AI`;
    navigator.clipboard.writeText(shareText);
    alert('Mensaje copiado al portapapeles');
  };

  const handleVoiceTranscript = (transcript) => {
    setInputMessage(transcript);
  };

  // Handler para enviar contenido al Calendario
  const handleSendToCalendar = (message) => {
    try {
      const event = moduleConnector.sendToCalendar(
        message.content,
        'instagram', // Default platform
        new Date() // Default to now, user can change in calendar
      );

      moduleConnector.notifyConnection('chat-ia', 'calendario', 'content-generated');
      alert('✅ Contenido enviado al Calendario. Ve a la sección Calendario para programarlo.');
    } catch (error) {
      console.error(' Error al enviar al calendario:', error);
      alert('❌ Error al enviar contenido al calendario');
    }
  };


  // Mensaje inicial de bienvenida - REMOVED per user request
  // useEffect(() => { ... }, [countryData]);



  // Modelo especializado en Community Management y Marketing Digital
  const unifiedModel = {
    id: 'predix-unified',
    name: 'Predix AI',
    description: 'Community Manager & Marketing Digital',
    icon: Rocket,
    capabilities: ['Gestión de Redes', 'Contenido Viral', 'Engagement & Métricas']
  };

  const quickActions = [
    { icon: Video, label: 'Video Concept', color: 'from-red-500 to-pink-500' },
    { icon: Image, label: 'Thumbnail', color: 'from-blue-500 to-cyan-500' },
    { icon: Palette, label: 'Carousel', color: 'from-purple-500 to-indigo-500' },
    { icon: Hash, label: 'Hashtags', color: 'from-green-500 to-emerald-500' },
    { icon: Target, label: 'Predicción', color: 'from-orange-500 to-red-500' },
    { icon: Sparkles, label: 'Template', color: 'from-pink-500 to-purple-500' }
  ];

  // Handle Sending Message
  const handleSendMessage = async (messageContent = inputMessage) => {
    if (!messageContent.trim() || isTyping) return;

    // Check Limits for Free Plan
    if (userPlan === 'free' && messageCount >= FREE_DAILY_LIMIT) {
      const limitMessage = {
        id: Date.now(),
        type: 'ai',
        content: `🛑 **Límite Diario Alcanzado**\n\nHas usado tus ${FREE_DAILY_LIMIT} mensajes gratuitos de hoy.\n\n⚡ **Actualiza a PRO** para continuar sin límites y usar el modelo avanzado.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }

    const currentInput = messageContent;
    setInputMessage('');
    setIsTyping(true);
    setStreamingContent('');

    // Increment count if free
    if (userPlan === 'free') {
      setMessageCount(prev => prev + 1);
    }

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Analyze intent for better context
      const intent = analyzeIntent(currentInput);

      // Generar respuesta de IA
      let result;
      if (aiProvider === 'openai') {
        result = await generateChatGPTResponse(currentInput, intent, selectedCountry.name, apiKeys.openai);
      } else {
        // Pass accumulated history (messages) to Gemini for context
        // We filter only valid user/ai messages to avoid system noise
        const history = messages.filter(m => m.type === 'user' || m.type === 'ai');
        result = await generateGeminiResponse(currentInput, intent, selectedCountry.name, userPlan === 'pro', history);
      }

      if (result.success) {
        const aiResponseMsg = {
          id: Date.now(),
          type: 'ai',
          content: result.response,
          timestamp: new Date().toISOString(),
          suggestions: [
            '🎯 Profundizar',
            '✍️ Más ideas',
            '📊 Métricas',
            '💡 Otra estrategia'
          ]
        };
        setMessages(prev => [...prev, aiResponseMsg]);
      } else {
        const errorMsg = {
          id: Date.now(),
          type: 'ai',
          content: result.fallbackResponse || `❌ ** ERROR GENERAL **\n\nHubo un problema.`,
          timestamp: new Date().toISOString(),
          suggestions: ['🔄 Reintentar']
        };
        setMessages(prev => [...prev, errorMsg]);
      }

    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorResponse = {
        id: Date.now(),
        type: 'ai',
        content: `❌ ** ERROR CRÍTICO **\n\n${error.message}`,
        timestamp: new Date().toISOString(),
        suggestions: ['🔄 Reintentar', '🔧 Verificar red']
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Sistema NLP avanzado para análisis de intención
  const analyzeIntent = (input) => {
    const lowerInput = input.toLowerCase().trim();

    // Detectar saludos y conversación casual
    const casualGreetings = ['hola', 'hello', 'hi', 'hey', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches'];
    const casualResponses = ['gracias', 'ok', 'vale', 'bien', 'perfecto', 'genial', 'excelente', 'sí', 'no', 'claro'];
    const questions = ['cómo', 'qué', 'cuál', 'dónde', 'cuándo', 'por qué', 'para qué'];

    // Si es un saludo simple
    if (casualGreetings.some(greeting => lowerInput === greeting || lowerInput.includes(greeting))) {
      return 'greeting';
    }

    // Si es una respuesta casual corta
    if (casualResponses.some(response => lowerInput === response)) {
      return 'casual';
    }

    // Si es una pregunta simple
    if (lowerInput.length < 50 && questions.some(q => lowerInput.includes(q))) {
      return 'question';
    }

    // Si es un mensaje muy corto (menos de 20 caracteres)
    if (lowerInput.length < 20) {
      return 'short';
    }

    // Análisis de intención por palabras clave para consultas específicas
    const intents = {
      strategy: ['estrategia', 'plan', 'planificar', 'estratégico', 'táctica', 'approach'],
      content: ['contenido', 'copy', 'texto', 'escribir', 'redactar', 'copywriting'],
      hashtags: ['hashtag', 'etiqueta', 'tag', '#', 'trending', 'viral'],
      video: ['video', 'tiktok', 'reel', 'youtube', 'concepto', 'guion'],
      analytics: ['métricas', 'analítica', 'datos', 'kpi', 'roi', 'conversión'],
      ads: ['publicidad', 'anuncio', 'campaña', 'facebook ads', 'google ads'],
      email: ['email', 'correo', 'newsletter', 'automation', 'secuencia'],
      seo: ['seo', 'posicionamiento', 'google', 'keywords', 'búsqueda'],
      social: ['redes sociales', 'instagram', 'facebook', 'twitter', 'linkedin'],
      ecommerce: ['tienda', 'venta', 'producto', 'ecommerce', 'conversión']
    };

    // Detectar intención principal para consultas específicas
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  };

  const generateAIResponse = async (input) => {
    const intent = analyzeIntent(input);
    const country = countryData?.name || 'México';

    // Si ChatGPT/Gemini está disponible, usarlo
    if (isUsingChatGPT || aiProvider === 'gemini') {
      try {
        let result;
        const isPro = userPlan === 'pro'; // Determined automatically based on plan

        if (aiProvider === 'openai') {
          result = await generateChatGPTResponse(input, intent, country);
        } else {
          // Pass isPro flag to Gemini Service
          result = await generateGeminiResponse(input, intent, country, isPro);
        }

        if (result.success) {
          return {
            id: Date.now(),
            type: 'ai',
            content: result.response,
            timestamp: new Date(),
            suggestions: [
              '🎯 Profundizar en estrategia',
              '✍️ Generar más copy',
              '#️⃣ Más hashtags',
              '📊 Analizar métricas',
              '🎬 Crear otro video',
              '💡 Nueva consulta'
            ]
          };
        } else {
          // Si falla, usar respuesta de respaldo o mostrar error
          return {
            id: Date.now(),
            type: 'ai',
            content: result.fallbackResponse || 'Error al conectar con la IA.',
            timestamp: new Date(),
            suggestions: [
              '🔧 Configurar API Key',
              '🔄 Intentar nuevamente',
              '💡 Consulta diferente'
            ]
          };
        }
      } catch (error) {
        console.error('Error generating AI response:', error);
      }
    }

    // Respuesta de respaldo con el sistema original

    const responses = {
      greeting: `¡Hola! 👋 ¿Cómo estás ?

  Soy Predix AI, tu asistente de marketing digital para ${country}. 

¿En qué puedo ayudarte hoy ? Puedo ayudarte con:
• 🎯 Estrategias de marketing
• ✍️ Copywriting persuasivo  
• #️⃣ Hashtags trending
• 🎬 Videos virales
• 📊 Análisis de métricas

¿Qué te interesa más ? `,

      casual: `¡Perfecto! 😊 

¿Hay algo específico de marketing digital en lo que te pueda ayudar ?

  Estoy aquí para cualquier cosa que necesites sobre:
• Estrategias para hacer crecer tu negocio
• Contenido que convierta
• Ideas para redes sociales
• Análisis de tu competencia

¡Solo dime qué tienes en mente!`,

      question: `🤔 Interesante pregunta...

Para darte la mejor respuesta, ¿podrías contarme un poco más de contexto ?

  Por ejemplo:
• ¿Es sobre tu negocio o proyecto ?
• ¿Qué tipo de audiencia tienes ?
• ¿En qué redes sociales estás activo ?

  Mientras más detalles me des, mejor te podré ayudar con una estrategia personalizada para ${country}. 🎯`,

      short: `¡Entendido! 👍

¿Te gustaría que profundice en algo específico ?

  Puedo ayudarte con:
• Ideas rápidas para contenido
• Tips de marketing digital
• Estrategias para tu nicho
• Análisis de tendencias en ${country}

¿Qué prefieres ? `,
      strategy: `🎯 ** ESTRATEGIA DE MARKETING DIGITAL COMPLETA **

**📊 ANÁLISIS SITUACIONAL:**
• ** Mercado objetivo:** ${country} - ${Math.floor(Math.random() * 50 + 10)}M usuarios activos
• ** Competencia:** Nivel ${['Bajo', 'Medio', 'Alto'][Math.floor(Math.random() * 3)]}
• ** Oportunidad:** ${Math.floor(Math.random() * 40 + 60)}% de potencial de crecimiento

  **🚀 ESTRATEGIA RECOMENDADA:**
• ** Fase 1(0 - 30 días):** Construcción de audiencia base
• ** Fase 2(30 - 90 días):** Optimización y escalamiento  
• ** Fase 3(90 + días):** Diversificación y retención

  **📱 MIX DE CANALES:**
• ** TikTok:** 40 % del presupuesto(audiencia joven)
• ** Instagram:** 30 % (engagement visual)
• ** Facebook:** 20 % (conversiones)
• ** YouTube:** 10 % (contenido long - form)

**💰 PRESUPUESTO SUGERIDO:**
• ** Contenido:** 50 % ($X / mes)
• ** Publicidad:** 35 % ($Y / mes)
• ** Herramientas:** 15 % ($Z / mes)`,

      content: `✍️ ** COPY OPTIMIZADO GENERADO **

**🎯 HEADLINE PRINCIPAL:**
  "${input.slice(0, 50)}... - La Solución que ${country} Estaba Esperando"

  **📝 ESTRUCTURA DE COPY:**
• ** Hook:** ¿Sabías que el 87 % de personas en ${country} buscan esto ?
• ** Problema:** Identifica el dolor específico
• ** Solución:** Presenta tu propuesta de valor única
• ** Beneficios:** 3 beneficios clave con prueba social
• ** CTA:** "Únete a los +10,000 ${country}nos que ya lo probaron"

  **🧠 TRIGGERS PSICOLÓGICOS:**
• ** Escasez:** "Solo para los primeros 100"
• ** Urgencia:** "Oferta válida hasta mañana"
• ** Autoridad:** "Recomendado por expertos"
• ** Prueba social:** "⭐⭐⭐⭐⭐ (4.8/5) - 2,847 reseñas"

  **📊 PREDICCIÓN DE CONVERSIÓN: 12.3 %** `,

      hashtags: `#️⃣ ** HASHTAGS ESTRATÉGICOS ${country.toUpperCase()}**

**🔥 HASHTAGS PRIMARIOS(Alto volumen):**
• #${country} Viral - 2.3M posts
• #Trending${country} - 1.8M posts  
• #${country} TikTok - 1.5M posts
• #ViralContent - 890K posts
• #ContentCreator${country} - 650K posts

  **🎯 HASHTAGS SECUNDARIOS(Medio volumen):**
• #${country} Influencer - 340K posts
• #Marketing${country} - 280K posts
• #Emprendedor${country} - 220K posts
• #${country} Business - 180K posts
• #CreativeContent - 150K posts

  **💎 HASHTAGS NICHO(Bajo volumen, alta conversión):**
• #${country} Startup - 45K posts
• #InnovaciónDigital - 32K posts
• #TechTrends${country} - 28K posts
• #DigitalNomad${country} - 18K posts
• #FuturoDigital - 12K posts

  **📊 ESTRATEGIA RECOMENDADA:**
• Usar 3 - 5 hashtags primarios
• Combinar con 2 - 3 secundarios  
• Agregar 1 - 2 hashtags nicho
• ** Mejor horario:** 7 - 9 PM ${country} time`,

      video: `🎬 ** GUIÓN DE VIDEO VIRAL COMPLETO **

**📋 ESTRUCTURA PROBADA(30 segundos):**

**🎣 HOOK(0 - 3s):**
  "Esto que voy a enseñarte cambió mi vida en ${country}..."

  **📖 DESARROLLO(3 - 25s):**
• ** Punto 1:** El problema que todos tienen
• ** Punto 2:** La solución inesperada  
• ** Punto 3:** El resultado sorprendente

  **🎯 CTA(25 - 30s):**
    "Comenta 'YO QUIERO' si esto te sirvió"

    **🎵 ELEMENTOS TÉCNICOS:**
• ** Música:** Trending audio ${country} (cambiar cada 7 días)
• ** Formato:** Vertical 9: 16(1080x1920)
• ** Transiciones:** Cortes cada 2 - 3 segundos
• ** Texto:** Subtítulos grandes y coloridos

  **📊 PREDICCIÓN DE PERFORMANCE:**
• ** Views estimadas:** 250K - 1.2M
• ** Engagement rate:** 8.5 % - 15 %
• ** Shares:** 2, 500 - 12,000
• ** Probabilidad viral:** 73 % `,

      analytics: `📊 ** ANÁLISIS DE MÉTRICAS COMPLETO **

**🎯 KPIs PRINCIPALES:**
• ** CAC(Costo Adquisición Cliente):** $${Math.floor(Math.random() * 50 + 10)}
• ** LTV(Valor Vida Cliente):** $${Math.floor(Math.random() * 500 + 200)}
• ** ROAS(Return on Ad Spend):** ${(Math.random() * 3 + 2).toFixed(1)}: 1
• ** Conversion Rate:** ${(Math.random() * 5 + 3).toFixed(1)}%

**📱 PERFORMANCE POR CANAL:**
• ** TikTok:** CTR 4.2 % | CPC $0.15 | CPM $2.80
• ** Instagram:** CTR 2.8 % | CPC $0.35 | CPM $5.20  
• ** Facebook:** CTR 1.9 % | CPC $0.45 | CPM $7.10
• ** YouTube:** CTR 3.1 % | CPC $0.25 | CPM $4.50

  **🎯 AUDIENCIA ${country}:**
• ** Edad principal:** 25 - 34 años(38 %)
• ** Género:** 52 % mujeres, 48 % hombres
• ** Dispositivo:** 89 % móvil, 11 % desktop
• ** Horario pico:** 7 - 9 PM y 12 - 2 PM

  **📈 RECOMENDACIONES:**
• Incrementar presupuesto en TikTok(+40 %)
• Optimizar creativos para móvil
• Testear nuevos horarios de publicación`,

      ads: `🎯 ** CAMPAÑA PUBLICITARIA OPTIMIZADA **

**📱 FACEBOOK / INSTAGRAM ADS:**

**🎯 TARGETING:**
• ** Ubicación:** ${country} (principales ciudades)
• ** Edad:** 25 - 45 años
• ** Intereses:** Marketing digital, emprendimiento, tecnología
• ** Comportamientos:** Compradores online frecuentes

  **💰 ESTRUCTURA DE CAMPAÑA:**
• ** Presupuesto diario:** $50 - 100
• ** Objetivo:** Conversiones
• ** Bid strategy:** Lowest cost
• ** Placement:** Feed + Stories + Reels

  **🎨 CREATIVOS(A / B Testing):**
• ** Variante A:** Video testimonial cliente
• ** Variante B:** Carousel beneficios
• ** Variante C:** Single image + copy fuerte

  **📊 MÉTRICAS OBJETIVO:**
• ** CTR:** > 2.5 %
• ** CPC:** <$0.40
• ** CPM:** <$6.00
• ** ROAS:** > 3: 1

  **🔄 OPTIMIZACIÓN:**
• Pausar ads con CTR < 1.5 %
• Escalar ads con ROAS > 4: 1
• Testear nuevos públicos semanalmente`,

      email: `📧 ** SECUENCIA DE EMAIL MARKETING **

**🎯 WELCOME SERIES(7 emails):**

**📧 Email 1(Inmediato):** Bienvenida + Regalo
  ** Subject:** "🎁 Tu regalo está aquí (${country} exclusivo)"

    **📧 Email 2(Día 2):** Historia personal
      ** Subject:** "Por qué empecé esto en ${country}..."

        **📧 Email 3(Día 4):** Caso de éxito
          ** Subject:** "María de ${country} logró esto en 30 días"

            **📧 Email 4(Día 7):** Contenido educativo
              ** Subject:** "El secreto que usan en ${country} (gratis)"

                **📧 Email 5(Día 10):** Oferta suave
                  ** Subject:** "¿Listo para el siguiente nivel?"

                    **📧 Email 6(Día 14):** Urgencia
                      ** Subject:** "Última oportunidad (${country} only)"

                        **📧 Email 7(Día 21):** Re - engagement
                          ** Subject:** "¿Nos vemos pronto?"

                            **📊 MÉTRICAS ESPERADAS:**
• ** Open rate:** 35 - 45 %
• ** Click rate:** 8 - 12 %
• ** Conversion rate:** 3 - 7 % `,

      seo: `🔍 ** ESTRATEGIA SEO COMPLETA **

**🎯 KEYWORDS PRINCIPALES ${country}:**
• "marketing digital ${country}" - 2, 400 búsquedas / mes
• "como vender online ${country}" - 1, 900 búsquedas / mes
• "redes sociales ${country}" - 1, 600 búsquedas / mes
• "publicidad digital" - 1, 200 búsquedas / mes

  **📝 CONTENIDO RECOMENDADO:**
• ** Blog post 1:** "Guía Completa Marketing Digital ${country} 2024"
• ** Blog post 2:** "10 Estrategias que Funcionan en ${country}"
• ** Blog post 3:** "Casos de Éxito: Empresas ${country}nas"
• ** Landing page:** "Servicios Marketing Digital ${country}"

  **🔧 SEO TÉCNICO:**
• ** Page speed:** < 3 segundos
• ** Mobile - first:** 100 % responsive
• ** Core Web Vitals:** Optimizados
• ** Schema markup:** LocalBusiness + Service

  **📊 PROYECCIÓN 6 MESES:**
• ** Tráfico orgánico:** +250 %
• ** Keywords ranking:** Top 10 para 15 + términos
• ** Conversiones SEO:** 35 - 50 / mes`,

      social: `📱 ** ESTRATEGIA REDES SOCIALES 360°**

**🎯 CONTENIDO POR PLATAFORMA:**

**📸 INSTAGRAM:**
• ** Feed:** 1 post / día(70 % educativo, 30 % personal)
• ** Stories:** 3 - 5 stories / día(behind scenes)
• ** Reels:** 4 - 5 / semana(trending + educativo)
• ** IGTV:** 1 / semana(contenido largo)

  **🎵 TIKTOK:**
• ** Videos:** 1 - 2 / día(trends + tips)
• ** Duetos:** 2 - 3 / semana(engagement)
• ** Lives:** 1 / semana(Q & A)

  **👔 LINKEDIN:**
• ** Posts:** 3 - 4 / semana(thought leadership)
• ** Artículos:** 1 / semana(expertise)
• ** Comentarios:** Engagement diario

  **📊 CALENDARIO CONTENIDO ${country}:**
• ** Lunes:** Motivación + Tips
• ** Martes:** Caso de éxito
• ** Miércoles:** Behind scenes
• ** Jueves:** Educativo / Tutorial
• ** Viernes:** Entretenimiento
• ** Sábado:** User - generated content
• ** Domingo:** Reflexión / Personal

  **🎯 HASHTAGS ESTRATÉGICOS:**
    Mix de 15 - 20 hashtags por post con rotación semanal`,

      ecommerce: `🛒 ** ESTRATEGIA E - COMMERCE COMPLETA **

**💳 OPTIMIZACIÓN CONVERSIÓN:**

**🛍️ PRODUCTO:**
• ** Fotos:** 5 - 8 imágenes HD + video 360°
• ** Descripción:** Beneficios + especificaciones
• ** Reviews:** Mínimo 15 reseñas 4 + estrellas
• ** Cross - selling:** "Frecuentemente comprados juntos"

  **🚀 CHECKOUT:**
• ** Guest checkout:** Habilitado
• ** Métodos pago:** Tarjetas + PayPal + transferencia
• ** Envío:** Gratis > $50 | Express disponible
• ** Garantía:** 30 días devolución

  **📧 POST - COMPRA:**
• ** Email 1:** Confirmación + tracking
• ** Email 2:** Envío + expectativas
• ** Email 3:** Entrega + instrucciones uso
• ** Email 4:** Review request(7 días después)
• ** Email 5:** Cross - sell(14 días después)

  **📊 MÉTRICAS ${country}:**
• ** Conversion rate:** 2.8 % (objetivo: 4.5 %)
• ** AOV:** $${Math.floor(Math.random() * 100 + 50)}
• ** Cart abandonment:** 68 % (recuperar 25 %)
• ** Customer LTV:** $${Math.floor(Math.random() * 300 + 150)}

**🎯 ESTRATEGIAS RETENCIÓN:**
• Programa lealtad(puntos)
• Email marketing personalizado
• Retargeting inteligente
• Ofertas exclusivas miembros`
    };

    // Generar respuesta basada en intención detectada
    const response = responses[intent] || `🤖 ** ANÁLISIS COMPLETO DE TU CONSULTA **

**🎯 He detectado que necesitas ayuda con:** "${input}"

  **📊 RECOMENDACIONES PARA ${country}:**
• ** Estrategia:** Enfoque multi - canal adaptado al mercado local
• ** Contenido:** Localización cultural y trending topics
• ** Timing:** Horarios óptimos ${country} (7 - 9 PM, 12 - 2 PM)
• ** Budget:** Distribución 40 % orgánico, 60 % paid

  **🚀 PRÓXIMOS PASOS:**
    1. Define objetivos SMART específicos
2. Identifica audiencia target precisa
3. Crea calendario contenido mensual
4. Implementa tracking y métricas
5. Optimiza basado en datos

  **💡 ¿Te gustaría que profundice en algún aspecto específico ?** `;

    // Sugerencias personalizadas según el tipo de intención
    let suggestions = [];

    if (intent === 'greeting') {
      suggestions = [
        '🎯 Ayúdame con mi estrategia',
        '✍️ Necesito copywriting',
        '#️⃣ Hashtags para mi negocio',
        '🎬 Ideas para videos',
        '📊 ¿Cómo analizar métricas?',
        '💡 Cuéntame sobre tendencias'
      ];
    } else if (intent === 'casual' || intent === 'short') {
      suggestions = [
        '🚀 Tips rápidos de marketing',
        '📱 Ideas para redes sociales',
        '💰 Cómo monetizar mi contenido',
        '🎯 Estrategias para mi nicho',
        '📈 Hacer crecer mi audiencia',
        '✨ Contenido que convierta'
      ];
    } else if (intent === 'question') {
      suggestions = [
        '💼 Cuéntame sobre mi negocio',
        '👥 Definir mi audiencia',
        '📱 Mis redes sociales actuales',
        '🎯 Mis objetivos de marketing',
        '💰 Mi presupuesto disponible',
        '📊 Mis métricas actuales'
      ];
    } else {
      suggestions = [
        '🎯 Crear estrategia completa',
        '✍️ Generar copy persuasivo',
        '#️⃣ Hashtags trending',
        '📊 Analizar métricas',
        '🎬 Guión de video viral',
        '📧 Secuencia de emails'
      ];
    }

    return {
      id: Date.now(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions: suggestions
    };
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion === '⚙️ Configurar Gemini Ahora') {
      setShowConfigModal(true);
      return;
    }
    setInputMessage(suggestion);
  };

  const newConversation = () => {
    const newConv = {
      id: Date.now(),
      title: 'Nuevo chat',
      timestamp: new Date(),
      active: true
    };
    setConversations(prev => [newConv, ...prev.map(c => ({ ...c, active: false }))]);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-[#13151a] text-white font-sans overflow-hidden selection:bg-indigo-500/30">

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0f1117] border-r border-white/5 z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Predix AI</h2>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <button
                    onClick={() => {
                      handleNewConversation();
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#1e1f20] hover:bg-[#2f2f2f] text-white rounded-full transition-all border border-white/5 shadow-sm"
                  >
                    <Plus className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-sm">Nuevo Chat</span>
                  </button>
                </div>
                <ConversationList
                  activeConversationId={activeConversation?.id}
                  onSelectConversation={(conv) => {
                    handleSelectConversation(conv);
                    setSidebarOpen(false);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-[#13151a]">

        {/* Minimal Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-[#13151a]/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg text-gray-400"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Plan Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${userPlan === 'pro'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}>
              {userPlan === 'pro' ? <Sparkles className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {userPlan === 'pro' ? 'PREDIX PRO' : 'PLAN FREE'}
            </div>

            {userPlan === 'free' && (
              <div className="text-xs text-gray-500 hidden sm:block">
                {messageCount}/{FREE_DAILY_LIMIT} mensajes
              </div>
            )}
          </div>

          {/* Center: Model Info */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
            <span className="text-sm font-medium text-gray-300 group-hover:text-white">
              {userPlan === 'pro' ? 'Predix Advanced' : 'Predix Basic'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium tracking-wide">
              {userPlan === 'pro' ? 'ENTERPRISE' : 'BASIC'}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Simulation Button */}
            {userPlan === 'free' && (
              <button
                onClick={handleUpgrade}
                className="hidden sm:block text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-full transition-all animate-pulse mr-2"
              >
                Simular Pago 💳
              </button>
            )}

            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${apiStatus === 'active' ? 'border-green-500/20 bg-green-500/5 text-green-400' : 'border-red-500/20 bg-red-500/5 text-red-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{apiStatus === 'active' ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative scroll-smooth">
          <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                // Redesigned Welcome Screen
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center min-h-[60vh] text-center"
                >
                  <div className="w-20 h-20 mb-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/5 flex items-center justify-center shadow-2xl shadow-indigo-500/10">
                    <Sparkles className="w-10 h-10 text-indigo-400" />
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 mb-6 tracking-tight">
                    Hola, Predix Admin
                  </h1>
                  <p className="text-lg text-gray-400 mb-12 max-w-lg mx-auto font-light leading-relaxed">
                    Estoy listo para potenciar tu estrategia digital. ¿Por dónde empezamos hoy?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-2">
                    {quickActions.slice(0, 4).map((action, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInputMessage(action.label === 'Video Concept' ? 'Dame una idea viral para un video de TikTok' : `Ayúdame con ${action.label}`)}
                        className="p-4 rounded-xl border border-white/5 bg-[#181a20] hover:border-indigo-500/30 transition-all group flex items-start gap-4 text-left"
                      >
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${action.color} bg-opacity-10 transform group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-200 group-hover:text-white text-sm">{action.label}</div>
                          <div className="text-xs text-gray-500 mt-1">Generar contenido</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

              ) : (
                <motion.div
                  key="messages-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {messages.map((msg, idx) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      onRegenerate={() => handleRegenerateResponse(msg)}
                      onShare={handleShare}
                      onSendToCalendar={handleSendToCalendar}
                    />
                  ))}

                  {isStreaming && (
                    <StreamingMessage
                      content={streamingContent}
                      isStreaming={true}
                    />
                  )}

                  {isTyping && !isStreaming && (
                    <div className="flex items-center gap-3 pl-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex gap-1.5 items-center h-8">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Mega-Pill Input Area */}
        <div className="absolute bottom-6 left-0 right-0 px-4 pointer-events-none z-20">
          <div className="max-w-5xl mx-auto pointer-events-auto">
            <div className="relative group bg-[#1e1f20] rounded-[26px] border border-white/10 shadow-2xl shadow-black/80 transition-all focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-white/5">

              {/* File Upload Zone (Collapsible) */}
              <AnimatePresence>
                {uploadedFiles.length > 0 && (
                  <div className="px-2 pt-2">
                    <FileUploadZone
                      files={uploadedFiles}
                      onRemove={(id) => setUploadedFiles(prev => prev.filter(f => f.id !== id))}
                    />
                  </div>
                )}
              </AnimatePresence>

              <div className="flex items-end p-2 pl-3 gap-2">
                {/* Attach Button */}
                <div className="pb-2">
                  <button
                    className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Adjuntar archivo"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Text Area */}
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Envía un mensaje a Predix AI..."
                  className="flex-1 max-h-[200px] min-h-[52px] py-3.5 bg-transparent border-none focus:ring-0 text-gray-100 placeholder-gray-500 resize-none custom-scrollbar text-[15px] leading-relaxed"
                  style={{ height: 'auto', overflow: 'hidden' }}
                  rows={1}
                />

                {/* Right Actions */}
                <div className="pb-2 flex items-center gap-1 pr-1">
                  {!inputMessage.trim() && (
                    <VoiceInput onTranscript={handleVoiceTranscript} />
                  )}

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() && uploadedFiles.length === 0}
                    className={`p-2.5 rounded-full transition-all duration-200 ${inputMessage.trim() || uploadedFiles.length > 0
                      ? 'bg-white text-black hover:bg-gray-200 transform scale-100'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed'
                      }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="text-[10px] text-gray-600">Predix AI puede cometer errores. Verifica la información importante.</p>
            </div>
          </div>
        </div>

      </div >

      {/* Settings Panel Slide-Over */}
      < AnimatePresence >
        {showSettings && (
          <SettingsPanel
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            settings={aiSettings}
            onUpdateSettings={setAiSettings}
          />
        )}
      </AnimatePresence >

      {/* Configuration Modal */}
      {
        showConfigModal && (
          <AIConfigModal
            isOpen={showConfigModal}
            onClose={() => setShowConfigModal(false)}
            currentProvider={aiProvider}
            onSave={saveApiConfig}
          />
        )
      }

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div >
  );
};

export default ChatIAPage;
// Build v2.0 Verified
