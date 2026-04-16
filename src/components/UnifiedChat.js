import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Bot
} from 'lucide-react';

const UnifiedChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu **ASISTENTE DE IA COMPLETO** para content marketing. Puedo generar todo tu contenido:\n\n🤖 **PREDICCIÓN VIRAL** - Analizo tu contenido antes de publicar\n📸 **GENERACIÓN DE THUMBNAILS** - IA crea imágenes automáticamente\n🎨 **CAROUSELS AUTOMÁTICOS** - Para Instagram con diseño profesional\n🎬 **CONCEPTOS DE VIDEO** - Ideas con formatos trending\n#️⃣ **HASHTAGS INTELIGENTES** - Trending en tiempo real por país\n🎯 **TEMPLATES POR NICHO** - Contenido personalizado por industria\n🔄 **CROSS-POSTING** - Adapto para múltiples plataformas\n🌍 **LOCALIZACIÓN** - Contenido para Ecuador, Colombia, México\n\n**¡Solo dime qué necesitas y lo genero completo!**',
      timestamp: new Date(),
      suggestions: [
        '🎬 Generar video concept viral',
        '📸 Crear thumbnail automático',
        '🎨 Diseñar carousel para Instagram',
        '#️⃣ Hashtags trending Ecuador',
        '🤖 Predecir viralidad de mi post',
        '🎯 Template para mi nicho'
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Nuevo chat', timestamp: new Date() }
  ]);
  const [activeChat, setActiveChat] = useState(1);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Detectar tipo de consulta y generar respuesta apropiada
    // PRIMERO: Detectar productos/servicios específicos
    if (input.includes('michelada') || input.includes('cerveza') || input.includes('bebida') || input.includes('bar') || input.includes('cantina')) {
      return generateBeverageResponse(userInput);
    } else if (input.includes('restaurante') || input.includes('comida') || input.includes('ceviche') || input.includes('plato') || input.includes('cocina')) {
      return generateRestaurantResponse(userInput);
    } else if (input.includes('fitness') || input.includes('gym') || input.includes('ejercicio') || input.includes('entrenamiento')) {
      return generateFitnessResponse(userInput);
    } else if (input.includes('moda') || input.includes('fashion') || input.includes('ropa') || input.includes('outfit') || input.includes('estilo')) {
      return generateFashionResponse(userInput);
    } else if (input.includes('tech') || input.includes('tecnología') || input.includes('app') || input.includes('software') || input.includes('digital')) {
      return generateTechResponse(userInput);
    // SEGUNDO: Detectar funciones específicas de IA
    } else if (input.includes('thumbnail') || input.includes('miniatura') || input.includes('imagen') || input.includes('portada')) {
      return generateThumbnailResponse(userInput);
    } else if (input.includes('carousel') || input.includes('carrusel') || input.includes('instagram') || input.includes('slides')) {
      return generateCarouselResponse(userInput);
    } else if (input.includes('video') || input.includes('concept') || input.includes('concepto') || input.includes('tiktok')) {
      return generateVideoConceptResponse(userInput);
    } else if (input.includes('hashtag') || input.includes('#') || input.includes('trending') || input.includes('tags')) {
      return generateHashtagResponse(userInput);
    } else if (input.includes('template') || input.includes('plantilla') || input.includes('nicho') || input.includes('copy')) {
      return generateTemplateResponse(userInput);
    } else if (input.includes('predecir') || input.includes('predicción') || input.includes('viralidad') || input.includes('viral') || input.includes('potencial')) {
      return generateViralPredictionResponse(userInput);
    } else if (input.includes('cross') || input.includes('múltiples') || input.includes('plataformas') || input.includes('adaptar')) {
      return generateCrossPostingResponse(userInput);
    } else if (input.includes('ecuador') || input.includes('colombia') || input.includes('méxico') || input.includes('localizar')) {
      return generateLocalizationResponse(userInput);
    } else {
      return generateGeneralResponse(userInput);
    }
  };

  const generateViralPredictionResponse = (input) => {
    // Simular análisis de contenido para predicción viral
    const viralScore = Math.floor(Math.random() * 30) + 70; // 70-99%
    const engagement = Math.floor(Math.random() * 15) + 5; // 5-20%
    const reach = Math.floor(Math.random() * 50) + 20; // 20-70K
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `✨ **PREDICCIÓN VIRAL COMPLETADA**\n\n🔮 **Análisis de tu contenido:**\n\n📊 **Score de Viralidad: ${viralScore}%**\n${viralScore >= 90 ? '🔥 ALTAMENTE VIRAL' : viralScore >= 80 ? '⚡ BUEN POTENCIAL' : '📈 POTENCIAL MODERADO'}\n\n**📈 Métricas Predichas:**\n• **Engagement Rate:** ${engagement}%\n• **Alcance Estimado:** ${reach}K usuarios\n• **Probabilidad de Trending:** ${viralScore - 10}%\n• **Mejor Plataforma:** ${viralScore >= 85 ? 'TikTok' : 'Instagram'}\n\n**🎯 Factores de Éxito Detectados:**\n✅ Hook fuerte en primeros 3 segundos\n✅ Música trending integrada\n✅ Hashtags optimizados\n✅ Timing de publicación óptimo\n\n**🚀 Recomendaciones para Maximizar Viralidad:**\n1. **Publicar a las ${viralScore >= 85 ? '19:00-21:00' : '18:00-20:00'}** (horario pico)\n2. **Usar ${viralScore >= 85 ? 'TikTok + Instagram' : 'Instagram + YouTube'}** como plataformas principales\n3. **Agregar CTA específico** en los primeros 5 segundos\n4. **Cross-posting** en 2-3 plataformas simultáneamente\n\n**⚡ Optimizaciones Sugeridas:**\n• Acortar hook a 2 segundos\n• Aumentar contraste visual 15%\n• Usar música con +2M usos actuales\n• Incluir trending hashtag local\n\n**🔥 Predicción Final: Tu contenido tiene ${viralScore}% probabilidad de volverse viral en las próximas 48 horas**`,
      timestamp: new Date(),
      suggestions: [
        'Optimizar para máxima viralidad',
        'Analizar otra plataforma',
        'Generar variaciones A/B',
        'Programar en horario óptimo'
      ],
      attachments: [
        { type: 'prediction', title: `Score Viral: ${viralScore}%`, content: 'Análisis completo de viralidad' },
        { type: 'metrics', title: 'Métricas predichas', content: `${engagement}% engagement, ${reach}K alcance` },
        { type: 'optimization', title: 'Optimizaciones', content: '4 mejoras sugeridas' },
        { type: 'timing', title: 'Mejor horario', content: `${viralScore >= 85 ? '19:00-21:00' : '18:00-20:00'}` }
      ]
    };
  };

  const generateThumbnailResponse = (input) => {
    const providers = ['DALL-E 3', 'Midjourney', 'Stable Diffusion', 'Adobe Firefly'];
    const selectedProvider = providers[Math.floor(Math.random() * providers.length)];
    const style = ['Minimalista', 'Vibrante', 'Profesional', 'Creativo'][Math.floor(Math.random() * 4)];
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `📸 **THUMBNAIL GENERADO CON IA**\n\n🎨 **Proveedor:** ${selectedProvider}\n🖼️ **Estilo:** ${style}\n📐 **Dimensiones:** 1920x1080 (YouTube) / 1080x1080 (Instagram)\n\n**🎯 Elementos Incluidos:**\n✅ Texto llamativo con contraste alto\n✅ Colores que destacan en feed\n✅ Composición optimizada para móvil\n✅ Call-to-action visual integrado\n\n**🔥 Variaciones Generadas:**\n1. **Versión A:** Fondo degradado azul-púrpura\n2. **Versión B:** Fondo sólido con elementos geométricos\n3. **Versión C:** Fondo con imagen de producto\n\n**📊 Optimización por Plataforma:**\n• **YouTube:** Texto grande, contraste 70%\n• **Instagram:** Colores saturados, texto centrado\n• **TikTok:** Elementos dinámicos, texto superior\n\n**⚡ A/B Testing Sugerido:**\n• Probar colores cálidos vs fríos\n• Texto con/sin emoji\n• Imagen de persona vs producto\n\n**🎯 CTR Estimado: 8.5-12.3%**`,
      timestamp: new Date(),
      suggestions: [
        '🎨 Generar más variaciones',
        '📱 Optimizar para móvil',
        '🔄 Cambiar estilo visual',
        '📊 Ver métricas predichas'
      ],
      attachments: [
        { type: 'thumbnail', title: 'Thumbnail Principal', content: 'Diseño optimizado generado' },
        { type: 'variations', title: '3 Variaciones', content: 'A/B testing ready' },
        { type: 'specs', title: 'Especificaciones', content: 'Dimensiones y formatos' }
      ]
    };
  };

  const generateCarouselResponse = (input) => {
    const carouselTypes = ['Tutorial', 'Antes/Después', 'Tips', 'Estadísticas', 'Storytelling'];
    const selectedType = carouselTypes[Math.floor(Math.random() * carouselTypes.length)];
    const slideCount = Math.floor(Math.random() * 6) + 5; // 5-10 slides
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🎨 **CAROUSEL AUTOMÁTICO GENERADO**\n\n📱 **Tipo:** ${selectedType}\n📊 **Slides:** ${slideCount} páginas\n🎯 **Plataforma:** Instagram optimizado\n\n**📋 Estructura Generada:**\n\n**Slide 1 (Portada):**\n• Título: Hook llamativo\n• Subtítulo: Beneficio principal\n• CTA: "Desliza para descubrir →"\n\n**Slides 2-${slideCount-1} (Contenido):**\n• Punto clave por slide\n• Visual de apoyo\n• Progreso visual (${slideCount-2} puntos)\n\n**Slide ${slideCount} (Cierre):**\n• Resumen de valor\n• CTA final\n• Invitación a seguir\n\n**🎨 Diseño Automático:**\n✅ Paleta de colores coherente\n✅ Tipografía legible en móvil\n✅ Elementos visuales consistentes\n✅ Branding sutil integrado\n\n**📊 Optimización Instagram:**\n• Ratio 1:1 perfecto\n• Texto grande (mín. 24px)\n• Contraste alto para stories\n• Elementos táctiles claros\n\n**🔥 Engagement Estimado: 6.8% (+45% vs posts normales)**`,
      timestamp: new Date(),
      suggestions: [
        '🎨 Cambiar estilo visual',
        '📝 Editar contenido',
        '📊 Ver más tipos',
        '🚀 Generar variación'
      ],
      attachments: [
        { type: 'carousel', title: `Carousel ${selectedType}`, content: `${slideCount} slides generados` },
        { type: 'design', title: 'Sistema de Diseño', content: 'Colores y tipografía' },
        { type: 'copy', title: 'Copy Optimizado', content: 'Texto para cada slide' }
      ]
    };
  };

  const generateVideoConceptResponse = (input) => {
    const concepts = ['Tutorial Rápido', 'Antes/Después', 'Día en la Vida', 'Trend Challenge', 'Storytelling'];
    const formats = ['Vertical 9:16', 'Cuadrado 1:1', 'Horizontal 16:9'];
    const selectedConcept = concepts[Math.floor(Math.random() * concepts.length)];
    const selectedFormat = formats[Math.floor(Math.random() * formats.length)];
    const duration = Math.floor(Math.random() * 45) + 15; // 15-60 segundos
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🎬 **CONCEPTO DE VIDEO GENERADO**\n\n🎯 **Tipo:** ${selectedConcept}\n📐 **Formato:** ${selectedFormat}\n⏱️ **Duración:** ${duration} segundos\n🎵 **Audio:** Trending sound incluido\n\n**🎬 Estructura del Video:**\n\n**0-3s (Hook):**\n• Pregunta impactante\n• Visual llamativo\n• Texto overlay grande\n\n**3-${Math.floor(duration*0.7)}s (Desarrollo):**\n• 3-4 puntos clave\n• Transiciones dinámicas\n• Elementos visuales de apoyo\n\n**${Math.floor(duration*0.7)}-${duration}s (Cierre):**\n• CTA específico\n• Invitación a interactuar\n• Branding sutil\n\n**🎨 Elementos Visuales:**\n✅ Texto overlay optimizado\n✅ Transiciones trending\n✅ Colores de alta conversión\n✅ Elementos gráficos dinámicos\n\n**🎵 Audio Sugerido:**\n• Trending sound con 2.3M usos\n• BPM: 128 (energético)\n• Mood: Motivacional/Inspirador\n\n**📱 Optimización por Plataforma:**\n• **TikTok:** Hook en 1s, texto grande\n• **Instagram:** Estética cuidada, colores vibrantes\n• **YouTube Shorts:** Thumbnail integrado\n\n**🔥 Potencial Viral: 89% - Formato trending actual**`,
      timestamp: new Date(),
      suggestions: [
        '🎬 Generar otro concepto',
        '🎵 Cambiar audio',
        '📱 Adaptar plataforma',
        '⚡ Ver trending formats'
      ],
      attachments: [
        { type: 'concept', title: selectedConcept, content: `${duration}s video concept` },
        { type: 'script', title: 'Guión Completo', content: 'Script segundo a segundo' },
        { type: 'audio', title: 'Audio Trending', content: 'Música optimizada' },
        { type: 'editing', title: 'Tips de Edición', content: 'Efectos y transiciones' }
      ]
    };
  };

  const generateHashtagResponse = (input) => {
    const countries = ['Ecuador', 'Colombia', 'México'];
    const selectedCountry = countries[Math.floor(Math.random() * countries.length)];
    const trendingScore = Math.floor(Math.random() * 20) + 80; // 80-99%
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `#️⃣ **HASHTAGS INTELIGENTES GENERADOS**\n\n🌍 **País:** ${selectedCountry}\n📈 **Trending Score:** ${trendingScore}%\n⏰ **Actualizado:** Hace 15 minutos\n\n**🔥 HASHTAGS TRENDING (${selectedCountry}):**\n\n**Mega Trending (1M+ posts):**\n#${selectedCountry.toLowerCase()} #viral${selectedCountry.toLowerCase()} #trending${selectedCountry.toLowerCase()}\n\n**Alto Volumen (100K-1M posts):**\n#contenido${selectedCountry.toLowerCase()} #creador${selectedCountry.toLowerCase()} #fyp${selectedCountry.toLowerCase()}\n\n**Nicho Específico (10K-100K posts):**\n#emprendedor${selectedCountry.toLowerCase()} #lifestyle${selectedCountry.toLowerCase()} #tips${selectedCountry.toLowerCase()}\n\n**Emergentes (1K-10K posts):**\n#nuevotalento${selectedCountry.toLowerCase()} #innovacion${selectedCountry.toLowerCase()}\n\n**📊 Análisis de Performance:**\n• **Alcance Estimado:** 45K-78K usuarios\n• **Engagement Rate:** 7.2% promedio\n• **Mejor Horario:** 19:00-21:00 ${selectedCountry}\n• **Competencia:** Media (favorable)\n\n**🎯 Estrategia Recomendada:**\n✅ Usar 8-12 hashtags total\n✅ Mezclar trending + nicho\n✅ Incluir 2-3 hashtags locales\n✅ Evitar hashtags saturados\n\n**⚡ Hashtags de Alta Conversión:**\n#viralcontent #contentcreator #trending2024\n\n**🔄 Rotación Sugerida:**\nCambiar 30% de hashtags cada 3 posts`,
      timestamp: new Date(),
      suggestions: [
        '🌍 Cambiar país',
        '🎯 Hashtags por nicho',
        '📊 Ver competencia',
        '⏰ Mejores horarios'
      ],
      attachments: [
        { type: 'hashtags', title: `Hashtags ${selectedCountry}`, content: '25 hashtags optimizados' },
        { type: 'analytics', title: 'Analytics', content: 'Performance predicho' },
        { type: 'strategy', title: 'Estrategia', content: 'Plan de rotación' }
      ]
    };
  };

  const generateTemplateResponse = (input) => {
    const niches = ['Fitness', 'Food', 'Fashion', 'Tech', 'Lifestyle', 'Business'];
    const selectedNiche = niches[Math.floor(Math.random() * niches.length)];
    const templates = ['Hook + Problema + Solución', 'Storytelling', 'Tutorial', 'Antes/Después', 'Lista/Tips'];
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🎯 **TEMPLATE GENERADO - NICHO ${selectedNiche.toUpperCase()}**\n\n📋 **Estructura:** ${selectedTemplate}\n🎨 **Personalización:** Regional + Demográfica\n📱 **Optimizado para:** Todas las plataformas\n\n**📝 COPY GENERADO:**\n\n**Hook (0-3s):**\n"¿Sabías que el 90% de personas comete este error en ${selectedNiche.toLowerCase()}? 👀"\n\n**Desarrollo:**\n"Te voy a enseñar el método que cambió mi ${selectedNiche.toLowerCase()} para siempre:\n\n✅ Paso 1: [Acción específica]\n✅ Paso 2: [Resultado medible]\n✅ Paso 3: [Transformación]\n\nEsto me tomó años descubrir, pero tú lo puedes aplicar HOY 🔥"\n\n**CTA:**\n"¿Cuál vas a probar primero? Comenta 👇\n\nSígueme para más tips de ${selectedNiche.toLowerCase()} 🚀"\n\n**🎨 Elementos Visuales:**\n• Colores: Paleta ${selectedNiche.toLowerCase()}\n• Tipografía: Bold, legible\n• Gráficos: Iconos específicos del nicho\n• Transiciones: Dinámicas, modernas\n\n**#️⃣ Hashtags Incluidos:**\n#${selectedNiche.toLowerCase()} #tips${selectedNiche.toLowerCase()} #viral #fyp #trending\n\n**🌍 Adaptación Regional:**\n• Lenguaje local incluido\n• Referencias culturales\n• Horarios optimizados por país\n\n**📊 Performance Estimado:**\n• Engagement: 8.5%\n• Alcance: 35K usuarios\n• Saves: 12% del engagement`,
      timestamp: new Date(),
      suggestions: [
        '🎯 Cambiar nicho',
        '📝 Editar copy',
        '🌍 Adaptar región',
        '🎨 Cambiar estilo'
      ],
      attachments: [
        { type: 'template', title: `Template ${selectedNiche}`, content: 'Copy completo generado' },
        { type: 'visuals', title: 'Elementos Visuales', content: 'Guía de diseño' },
        { type: 'hashtags', title: 'Hashtags', content: 'Tags optimizados' },
        { type: 'regional', title: 'Adaptación Regional', content: 'Localización incluida' }
      ]
    };
  };

  const generateCrossPostingResponse = (input) => {
    const platforms = ['TikTok', 'Instagram', 'YouTube Shorts', 'Facebook', 'LinkedIn'];
    const adaptations = Math.floor(Math.random() * 3) + 3; // 3-5 adaptaciones
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🔄 **CROSS-POSTING AUTOMÁTICO GENERADO**\n\n📱 **Plataformas:** ${adaptations} adaptaciones\n⚡ **Optimización:** Específica por algoritmo\n🎯 **Timing:** Horarios óptimos por plataforma\n\n**🚀 ADAPTACIONES GENERADAS:**\n\n**📱 TikTok:**\n• Formato: Vertical 9:16\n• Hook: 1 segundo\n• Duración: 15-30s\n• Audio: Trending sound\n• Hashtags: #fyp #viral #trending\n• Horario: 19:00-21:00\n\n**📸 Instagram:**\n• Formato: Cuadrado 1:1 + Stories\n• Estética: Cuidada, colores vibrantes\n• Caption: Más descriptiva\n• Hashtags: Mix trending + nicho\n• Horario: 18:00-20:00\n\n**📺 YouTube Shorts:**\n• Formato: Vertical con thumbnail\n• Título: SEO optimizado\n• Descripción: Completa con keywords\n• Tags: Específicos de YouTube\n• Horario: 20:00-22:00\n\n**👥 Facebook:**\n• Formato: Horizontal preferido\n• Copy: Más conversacional\n• Engagement: Preguntas directas\n• Horario: 12:00-14:00\n\n**💼 LinkedIn:**\n• Enfoque: Profesional/educativo\n• Copy: Insights de industria\n• Hashtags: Profesionales\n• Horario: 08:00-10:00\n\n**⚡ AUTOMATIZACIÓN:**\n✅ Publicación programada\n✅ Adaptación automática de formatos\n✅ Hashtags específicos por plataforma\n✅ Horarios optimizados\n✅ Tracking de performance\n\n**📊 Alcance Estimado Total: 125K usuarios**`,
      timestamp: new Date(),
      suggestions: [
        '📱 Seleccionar plataformas',
        '⏰ Ajustar horarios',
        '🎨 Personalizar formatos',
        '📊 Ver calendario'
      ],
      attachments: [
        { type: 'crosspost', title: `${adaptations} Adaptaciones`, content: 'Contenido optimizado por plataforma' },
        { type: 'schedule', title: 'Calendario', content: 'Horarios óptimos' },
        { type: 'formats', title: 'Formatos', content: 'Especificaciones técnicas' }
      ]
    };
  };

  const generateLocalizationResponse = (input) => {
    const countries = ['Ecuador', 'Colombia', 'México'];
    const selectedCountry = countries[Math.floor(Math.random() * countries.length)];
    const culturalElements = {
      'Ecuador': ['¡Qué chimba!', 'parcero', 'bacano', '🇪🇨'],
      'Colombia': ['¡Qué berraco!', 'parce', 'chévere', '🇨🇴'],
      'México': ['¡Qué padre!', 'wey', 'chido', '🇲🇽']
    };
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🌍 **LOCALIZACIÓN PARA ${selectedCountry.toUpperCase()}**\n\n🎯 **Adaptación Cultural Completa**\n📍 **País:** ${selectedCountry}\n🕐 **Zona Horaria:** Optimizada\n💬 **Lenguaje:** Local + Slang\n\n**🗣️ ADAPTACIÓN DE LENGUAJE:**\n\n**Expresiones Locales:**\n• "${culturalElements[selectedCountry][0]}" (Excelente)\n• "${culturalElements[selectedCountry][1]}" (Amigo)\n• "${culturalElements[selectedCountry][2]}" (Genial)\n\n**Copy Localizado:**\n"¡Hola ${culturalElements[selectedCountry][1]}! ${culturalElements[selectedCountry][0]} Este tip te va a encantar...\n\nAquí en ${selectedCountry} sabemos que [contexto local], por eso este método es perfecto para nosotros.\n\n¿Qué te parece? ¡Cuéntame en los comentarios! ${culturalElements[selectedCountry][3]}"\n\n**🎯 ELEMENTOS CULTURALES:**\n✅ Referencias locales incluidas\n✅ Horarios de consumo optimizados\n✅ Festividades y eventos locales\n✅ Influencers y tendencias del país\n✅ Moneda y precios locales\n\n**⏰ HORARIOS ÓPTIMOS ${selectedCountry}:**\n• **Mañana:** 07:00-09:00\n• **Almuerzo:** 12:00-14:00\n• **Tarde:** 17:00-19:00\n• **Noche:** 20:00-22:00\n\n**📊 DATOS DEMOGRÁFICOS:**\n• Edad principal: 18-34 años\n• Plataforma #1: Instagram\n• Contenido preferido: Videos cortos\n• Engagement peak: 19:00-21:00\n\n**🎨 ADAPTACIÓN VISUAL:**\n• Colores de la bandera integrados\n• Paisajes/elementos reconocibles\n• Influencers locales como referencia\n\n**#️⃣ Hashtags Locales:**\n#${selectedCountry.toLowerCase()} #viral${selectedCountry.toLowerCase()} #trending${selectedCountry.toLowerCase()}`,
      timestamp: new Date(),
      suggestions: [
        '🌍 Cambiar país',
        '🗣️ Más expresiones locales',
        '⏰ Ajustar horarios',
        '🎨 Elementos visuales'
      ],
      attachments: [
        { type: 'localization', title: `Localización ${selectedCountry}`, content: 'Adaptación cultural completa' },
        { type: 'schedule', title: 'Horarios Óptimos', content: 'Timing por zona horaria' },
        { type: 'cultural', title: 'Elementos Culturales', content: 'Referencias y contexto local' }
      ]
    };
  };

  const generateBeverageResponse = (input) => {
    const beverageTypes = ['Michelada', 'Cerveza Artesanal', 'Cóctel', 'Bebida Refrescante'];
    const selectedType = beverageTypes[Math.floor(Math.random() * beverageTypes.length)];
    const ingredients = ['limón', 'sal', 'chamoy', 'chile', 'clamato', 'cerveza fría'];
    const selectedIngredients = ingredients.slice(0, Math.floor(Math.random() * 3) + 3);
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🍺 **COPY PARA ${selectedType.toUpperCase()} GENERADO**\n\n🎯 **Concepto:** Bebida refrescante irresistible\n🌶️ **Ingredientes destacados:** ${selectedIngredients.join(', ')}\n📱 **Optimizado para:** TikTok + Instagram\n\n**📝 COPY GENERADO:**\n\n**Hook (0-3s):**\n"¿Cansado del calor? Esta ${selectedType.toLowerCase()} te va a cambiar el día 🔥❄️"\n\n**Desarrollo:**\n"Mira cómo preparamos la ${selectedType.toLowerCase()} perfecta:\n\n🧊 Vaso bien frío con sal en el borde\n🍋 Limón fresco exprimido al momento\n🌶️ Toque secreto de ${selectedIngredients[2]}\n🍺 Cerveza helada que te refresca al instante\n\nEsta combinación es ADICTIVA 🤤"\n\n**CTA:**\n"¿Ya probaste nuestra ${selectedType.toLowerCase()}? ¡Ven y refréscate! 🍺\n\nEtiqueta a quien traerías 👇"\n\n**🎨 Elementos Visuales:**\n✅ Close-up del vaso escarchado\n✅ Proceso de preparación dinámico\n✅ Reacción de satisfacción\n✅ Ambiente fresco y apetitoso\n\n**🎵 Audio Sugerido:**\n• "Summer Vibes" - 1.8M usos\n• Mood: Refrescante, relajado\n• BPM: 110 (chill pero energético)\n\n**#️⃣ Hashtags Optimizados:**\n#michelada #cervezafria #refrescante #calor #bebidaperfecta #bar #cantina #verano #sed #antojo\n\n**🌍 Adaptación Regional:**\n• **México:** "¡Qué padre michelada, wey!"\n• **Colombia:** "¡Qué chévere esta bebida, parce!"\n• **Ecuador:** "¡Qué bacana esta michelada, parcero!"\n\n**📊 Performance Estimado:**\n• Engagement: 9.2% (bebidas generan mucha interacción)\n• Alcance: 42K usuarios\n• Saves: 15% (recetas se guardan mucho)\n• Comentarios: "¿Dónde está este lugar?" 🔥`,
      timestamp: new Date(),
      suggestions: [
        '🍺 Generar otra bebida',
        '📱 Optimizar para TikTok',
        '🌶️ Agregar más ingredientes',
        '📍 Localizar por país'
      ],
      attachments: [
        { type: 'beverage', title: `Copy ${selectedType}`, content: 'Contenido optimizado para bebidas' },
        { type: 'recipe', title: 'Receta Visual', content: 'Pasos para video' },
        { type: 'hashtags', title: 'Hashtags Bebidas', content: 'Tags específicos del nicho' },
        { type: 'regional', title: 'Adaptación Local', content: 'Expresiones por país' }
      ]
    };
  };

  const generateFitnessResponse = (input) => {
    const workoutTypes = ['Rutina HIIT', 'Entrenamiento Funcional', 'Yoga Flow', 'Cardio Intenso'];
    const selectedWorkout = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const duration = Math.floor(Math.random() * 20) + 10; // 10-30 minutos
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `💪 **COPY PARA FITNESS GENERADO**\n\n🏋️ **Tipo:** ${selectedWorkout}\n⏱️ **Duración:** ${duration} minutos\n🎯 **Nivel:** Todos los niveles\n📱 **Formato:** Video vertical\n\n**📝 COPY GENERADO:**\n\n**Hook (0-3s):**\n"¿Solo ${duration} minutos para transformar tu cuerpo? SÍ es posible 🔥💪"\n\n**Desarrollo:**\n"Esta rutina de ${selectedWorkout.toLowerCase()} va a cambiar tu día:\n\n⚡ Ejercicio 1: Quema grasa al máximo\n🔥 Ejercicio 2: Tonifica todo el core\n💥 Ejercicio 3: Fortalece piernas y glúteos\n⭐ Ejercicio 4: Cardio que acelera metabolismo\n\n¡En solo ${duration} minutos sientes la diferencia!"\n\n**CTA:**\n"¿Te atreves al reto de ${duration} minutos? 💪\n\nGuarda este video y hazlo conmigo 🚀\n\n¿Cuál ejercicio te costó más? Comenta 👇"\n\n**🎨 Elementos Visuales:**\n✅ Demostración clara de cada ejercicio\n✅ Timer visible en pantalla\n✅ Antes/después o progreso\n✅ Energía y motivación constante\n\n**🎵 Audio Sugerido:**\n• "Workout Beast Mode" - 2.5M usos\n• BPM: 140 (alta energía)\n• Mood: Motivacional, intenso\n\n**#️⃣ Hashtags Fitness:**\n#fitness #workout #rutina #ejercicio #gym #motivation #fit #health #strong #challenge\n\n**📊 Performance Estimado:**\n• Engagement: 11.5% (fitness genera mucha interacción)\n• Alcance: 55K usuarios\n• Saves: 18% (rutinas se guardan mucho)\n• Shares: 8% (motivación se comparte)`,
      timestamp: new Date(),
      suggestions: [
        '💪 Generar otra rutina',
        '⏱️ Cambiar duración',
        '🎯 Ajustar nivel',
        '📱 Optimizar formato'
      ],
      attachments: [
        { type: 'workout', title: selectedWorkout, content: `Rutina de ${duration} minutos` },
        { type: 'exercises', title: 'Ejercicios', content: 'Lista detallada de movimientos' },
        { type: 'motivation', title: 'Copy Motivacional', content: 'Frases de motivación' }
      ]
    };
  };

  const generateFashionResponse = (input) => {
    const fashionTypes = ['Outfit del Día', 'Tendencia 2024', 'Look Casual', 'Estilo Elegante'];
    const selectedStyle = fashionTypes[Math.floor(Math.random() * fashionTypes.length)];
    const colors = ['negro', 'beige', 'azul', 'blanco', 'rosa', 'verde'];
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `👗 **COPY PARA FASHION GENERADO**\n\n✨ **Estilo:** ${selectedStyle}\n🎨 **Color Principal:** ${selectedColor}\n📸 **Formato:** Carousel + Video\n🎯 **Audiencia:** Fashion lovers\n\n**📝 COPY GENERADO:**\n\n**Hook (0-3s):**\n"¿Buscas el ${selectedStyle.toLowerCase()} perfecto? Este look te va a enamorar 😍✨"\n\n**Desarrollo:**\n"Hoy te muestro cómo crear el ${selectedStyle.toLowerCase()} ideal:\n\n👚 Pieza clave: [Prenda principal en ${selectedColor}]\n👠 Complemento perfecto: [Accesorio que eleva el look]\n💄 Toque final: [Detalle que marca la diferencia]\n📸 Resultado: Look que no pasa desapercibido\n\n¡Este combo nunca falla! 🔥"\n\n**CTA:**\n"¿Cuál es tu pieza favorita de este look? 👇\n\nGuarda este post para tu próximo outfit 📌\n\n¿Con qué lo combinarías tú? ¡Cuéntame! ✨"\n\n**🎨 Elementos Visuales:**\n✅ Flat lay del outfit completo\n✅ Try-on con diferentes ángulos\n✅ Close-ups de detalles importantes\n✅ Styling tips visuales\n\n**🎵 Audio Sugerido:**\n• "Fashion Week Vibes" - 1.9M usos\n• Mood: Elegante, sofisticado\n• BPM: 120 (ritmo fashion)\n\n**#️⃣ Hashtags Fashion:**\n#fashion #outfit #style #ootd #moda #look #tendencia #estilo #fashionista #outfitinspo\n\n**🌍 Adaptación Regional:**\n• **México:** "¡Qué padre outfit, está padrísimo!"\n• **Colombia:** "¡Qué chimba este look, parce!"\n• **Ecuador:** "¡Qué bacano este estilo, parcero!"\n\n**📊 Performance Estimado:**\n• Engagement: 8.7% (fashion genera mucha inspiración)\n• Alcance: 38K usuarios\n• Saves: 22% (outfits se guardan mucho)\n• Shares: 12% (inspiración se comparte)`,
      timestamp: new Date(),
      suggestions: [
        '👗 Generar otro estilo',
        '🎨 Cambiar paleta de colores',
        '📸 Optimizar para Instagram',
        '✨ Agregar más accesorios'
      ],
      attachments: [
        { type: 'fashion', title: selectedStyle, content: `Look en ${selectedColor}` },
        { type: 'styling', title: 'Tips de Styling', content: 'Consejos de combinación' },
        { type: 'trends', title: 'Tendencias 2024', content: 'Lo que está de moda' }
      ]
    };
  };

  const generateTechResponse = (input) => {
    const techTypes = ['App Review', 'Tech Tips', 'Gadget Unboxing', 'Tutorial Tech'];
    const selectedType = techTypes[Math.floor(Math.random() * techTypes.length)];
    const devices = ['iPhone', 'Android', 'MacBook', 'iPad', 'AirPods'];
    const selectedDevice = devices[Math.floor(Math.random() * devices.length)];
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `📱 **COPY PARA TECH GENERADO**\n\n🔧 **Tipo:** ${selectedType}\n📱 **Dispositivo:** ${selectedDevice}\n🎯 **Audiencia:** Tech enthusiasts\n⚡ **Formato:** Tutorial rápido\n\n**📝 COPY GENERADO:**\n\n**Hook (0-3s):**\n"¿Sabías que tu ${selectedDevice} puede hacer ESTO? 🤯 Te va a cambiar la vida"\n\n**Desarrollo:**\n"Te voy a enseñar el truco de ${selectedDevice} que el 95% no conoce:\n\n⚡ Paso 1: [Función oculta increíble]\n🚀 Paso 2: [Configuración que optimiza todo]\n💡 Paso 3: [Resultado que te sorprenderá]\n🔥 Bonus: [Truco extra que pocos saben]\n\n¡Esto me hubiera ahorrado HORAS! 😱"\n\n**CTA:**\n"¿Ya lo probaste? ¡Cuéntame qué tal te funcionó! 👇\n\nGuarda este video para no olvidarlo 📌\n\n¿Conoces otro truco así? ¡Compártelo! 🚀"\n\n**🎨 Elementos Visuales:**\n✅ Screen recording claro y nítido\n✅ Flechas y highlights en pantalla\n✅ Antes/después del truco\n✅ Reacción de sorpresa auténtica\n\n**🎵 Audio Sugerido:**\n• "Tech Discovery" - 1.6M usos\n• Mood: Innovador, sorprendente\n• BPM: 130 (dinámico)\n\n**#️⃣ Hashtags Tech:**\n#tech #${selectedDevice.toLowerCase()} #tips #tutorial #tecnologia #hack #productivity #gadgets #innovation #techtips\n\n**🌍 Adaptación Regional:**\n• **México:** "¡No manches, qué padre función!"\n• **Colombia:** "¡Qué berraco este truco, parce!"\n• **Ecuador:** "¡Qué chimba esta función, parcero!"\n\n**📊 Performance Estimado:**\n• Engagement: 10.3% (tech tips generan mucha interacción)\n• Alcance: 48K usuarios\n• Saves: 25% (tutoriales se guardan mucho)\n• Shares: 15% (tips útiles se comparten)`,
      timestamp: new Date(),
      suggestions: [
        '📱 Generar otro dispositivo',
        '🔧 Cambiar tipo de contenido',
        '⚡ Más trucos avanzados',
        '🎯 Optimizar para YouTube'
      ],
      attachments: [
        { type: 'tech', title: `${selectedType} ${selectedDevice}`, content: 'Tutorial técnico completo' },
        { type: 'steps', title: 'Pasos Detallados', content: 'Instrucciones paso a paso' },
        { type: 'tips', title: 'Tips Adicionales', content: 'Trucos relacionados' }
      ]
    };
  };

  const generateRestaurantResponse = (input) => {
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🍽️ **Perfecto! Te ayudo con contenido para restaurante**\n\n**📝 Copy generado:**\n"🐟 El ceviche que está conquistando la ciudad ✨ Ingrediente secreto que realza cada sabor 🍋 ¿Adivinas cuál es nuestro toque especial? 👇"\n\n**#️⃣ Hashtags estratégicos:**\n🔥 Trending: #ceviche #comidafresca #foodie\n🎯 Nicho: #cevicheperfecto #saboresautenticos #comidacasera\n📍 Local: #restaurantelocal #comidatipica\n\n**🎵 Música recomendada:**\n"Sizzle & Spice" - 2.1M usos\nMood: appetizing, fresh\nPerfecto para: food reveals, preparación\n\n**🎬 Concepto visual:**\n• Shot 1: Close-up ingredientes frescos\n• Shot 2: Preparación con ritmo\n• Shot 3: Reveal del plato final\n• Shot 4: Reacción de satisfacción\n\n**📊 Predicción de viralidad: 92%**`,
      timestamp: new Date(),
      suggestions: [
        'Generar más variaciones',
        'Optimizar para TikTok',
        'Crear A/B test',
        'Programar publicación'
      ],
      attachments: [
        { type: 'copy', title: 'Copy optimizado', content: 'Copy generado listo para usar' },
        { type: 'hashtags', title: 'Hashtags estratégicos', content: '15 hashtags optimizados' },
        { type: 'music', title: 'Música trending', content: 'Sizzle & Spice - 2.1M usos' },
        { type: 'visual', title: 'Concepto visual', content: '4 shots sugeridos' }
      ]
    };
  };

  const generateMusicResponse = (input) => {
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🎵 **Top Música Trending Ahora**\n\n**🌍 Global Top 3:**\n1. **"Flowers"** - Miley Cyrus (2.1B streams)\n   • TikTok: 15.2M usos (+45%)\n   • Perfecto para: lifestyle, fashion\n\n2. **"As It Was"** - Harry Styles (1.8B streams)\n   • TikTok: 12.4M usos (+38%)\n   • Perfecto para: emotional content\n\n3. **"Anti-Hero"** - Taylor Swift (1.6B streams)\n   • TikTok: 18.9M usos (+52%)\n   • Perfecto para: storytelling\n\n**🇪🇨 Ecuador Top 3:**\n1. **"La Botella"** - Chriss Villa (2.3M streams)\n   • Género: Reggaeton\n   • TikTok: 890K usos (+67%)\n\n2. **"Despechá"** - Rosalía (1.8M streams)\n   • Popular en: Ecuador, Colombia, Perú\n\n**💡 Recomendación:** Para contenido viral, usa música del Top 10 global combinada con hashtags locales.`,
      timestamp: new Date(),
      suggestions: [
        'Ver más charts por país',
        'Música para mi nicho específico',
        'Tendencias emergentes',
        'Integrar con mi contenido'
      ],
      attachments: [
        { type: 'music', title: 'Top 50 Global', content: 'Charts actualizados en tiempo real' },
        { type: 'music', title: 'Top 50 Ecuador', content: 'Música local trending' },
        { type: 'analytics', title: 'Análisis de tendencias', content: 'Predicciones 48h' }
      ]
    };
  };

  const generateVisualResponse = (input) => {
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🎨 **Generador Visual Activado**\n\n**🖼️ Concepto visual generado:**\n\n**Estilo:** Moderno, vibrante, optimizado para redes\n**Paleta:** Azul océano, amarillo cítrico, blanco fresco\n**Formato:** 9:16 (TikTok/Instagram Stories)\n\n**📸 Shots sugeridos:**\n1. **Opening shot:** Logo/branding (2 seg)\n2. **Hook visual:** Elemento sorpresa (3 seg)\n3. **Desarrollo:** Proceso/producto (8 seg)\n4. **Call-to-action:** Texto/botón (2 seg)\n\n**🎬 Elementos virales:**\n• Transiciones rápidas en beat\n• Texto grande y legible\n• Colores contrastantes\n• Hook en primeros 3 segundos\n\n**📊 Score de viralidad visual: 89%**\n\n**🚀 Listo para generar imagen con IA?**`,
      timestamp: new Date(),
      suggestions: [
        'Generar imagen con IA',
        'Crear variaciones A/B',
        'Optimizar para otra plataforma',
        'Añadir elementos de marca'
      ],
      attachments: [
        { type: 'visual', title: 'Mockup generado', content: 'Concepto visual listo' },
        { type: 'palette', title: 'Paleta de colores', content: '5 colores optimizados' },
        { type: 'template', title: 'Template editable', content: 'Plantilla personalizable' }
      ]
    };
  };

  const generateABTestResponse = (input) => {
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `📊 **A/B Testing Suite Activado**\n\n**🧪 Test configurado automáticamente:**\n\n**Variante A:** Copy emocional\n"❤️ El sabor que toca tu corazón"\n\n**Variante B:** Copy directo\n"🔥 El mejor ceviche de la ciudad"\n\n**📈 Métricas a medir:**\n• CTR (Click-through rate)\n• Engagement rate\n• Conversiones\n• Tiempo de visualización\n\n**⏱️ Duración del test:** 48 horas\n**👥 Audiencia:** 50/50 split automático\n**📱 Plataformas:** Instagram + TikTok\n\n**🎯 Predicción:**\nVariante A: 67% probabilidad de ganar\nVariante B: 33% probabilidad de ganar\n\n**📊 Resultados esperados en 24-48h**`,
      timestamp: new Date(),
      suggestions: [
        'Crear más variantes',
        'Configurar métricas personalizadas',
        'Ver tests anteriores',
        'Programar test automático'
      ],
      attachments: [
        { type: 'test', title: 'Test A/B configurado', content: '2 variantes listas' },
        { type: 'metrics', title: 'Métricas tracking', content: '4 KPIs monitoreados' },
        { type: 'prediction', title: 'Predicción IA', content: '67% vs 33%' }
      ]
    };
  };

  const generateNicheResponse = (input) => {
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🎯 **Análisis de Nicho Completado**\n\n**📊 Tu nicho: Restaurantes/Food**\n\n**📈 Métricas del nicho:**\n• Tamaño del mercado: 2.1M usuarios activos\n• Competencia: Media-Alta\n• Oportunidad viral: 85%\n• Mejor horario: 18:00-21:00\n\n**🔥 Tendencias actuales:**\n1. **#FoodReveals** (+156% crecimiento)\n2. **#RecetasRápidas** (+134% crecimiento)\n3. **#ComidaLocal** (+89% crecimiento)\n\n**🎵 Música trending en tu nicho:**\n• "Cooking Vibes" - 2.1M usos\n• "Kitchen Beats" - 1.8M usos\n• "Food Prep Flow" - 1.2M usos\n\n**💡 Estrategia recomendada:**\nCombina recetas rápidas con ingredientes locales usando música trending del nicho food.`,
      timestamp: new Date(),
      suggestions: [
        'Analizar competencia directa',
        'Encontrar micro-nichos',
        'Estrategia de contenido',
        'Calendario editorial'
      ],
      attachments: [
        { type: 'niche', title: 'Análisis completo', content: 'Reporte detallado del nicho' },
        { type: 'competitors', title: 'Competencia', content: 'Top 10 competidores' },
        { type: 'opportunities', title: 'Oportunidades', content: 'Gaps identificados' }
      ]
    };
  };

  const generateSchedulerResponse = (input) => {
    // Generar contenido automático basado en el input
    const autoContent = generateAutoContent(input);
    
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `📅 **GENERACIÓN AUTOMÁTICA + PROGRAMACIÓN COMPLETADA**\n\n🤖 **Contenido generado automáticamente:**\n\n**📝 POST 1 - TikTok (Hoy 19:00)**\n"${autoContent.post1.copy}"\n📊 Score viral: ${autoContent.post1.viralScore}%\n🎵 Música: ${autoContent.post1.music}\n#️⃣ ${autoContent.post1.hashtags.join(' ')}\n\n**📝 POST 2 - Instagram (Mañana 12:00)**\n"${autoContent.post2.copy}"\n📊 Score viral: ${autoContent.post2.viralScore}%\n🎨 Concepto: ${autoContent.post2.visual}\n#️⃣ ${autoContent.post2.hashtags.join(' ')}\n\n**📝 POST 3 - YouTube (Viernes 16:00)**\n"${autoContent.post3.copy}"\n📊 Score viral: ${autoContent.post3.viralScore}%\n🎬 Formato: ${autoContent.post3.format}\n#️⃣ ${autoContent.post3.hashtags.join(' ')}\n\n**⏰ HORARIOS OPTIMIZADOS POR IA:**\n• **TikTok:** 19:00-21:00 (Engagement +340%)\n• **Instagram:** 11:00-13:00, 19:00-21:00 (Alcance +280%)\n• **YouTube:** 14:00-16:00 (Retención +190%)\n\n**🚀 PROGRAMACIÓN AUTOMÁTICA ACTIVADA**\n✅ 3 posts generados y programados\n✅ Horarios optimizados por audiencia\n✅ Hashtags trending integrados\n✅ Predicción viral incluida`,
      timestamp: new Date(),
      suggestions: [
        'Generar más contenido automático',
        'Ajustar horarios de publicación',
        'Ver calendario completo',
        'Activar cross-posting'
      ],
      attachments: [
        { type: 'content', title: '3 Posts generados', content: 'Contenido listo para publicar' },
        { type: 'schedule', title: 'Programación automática', content: 'Próximos 3 días optimizados' },
        { type: 'viral', title: 'Scores virales', content: `${autoContent.post1.viralScore}%, ${autoContent.post2.viralScore}%, ${autoContent.post3.viralScore}%` },
        { type: 'calendar', title: 'Calendario actualizado', content: 'Ver en Content Scheduler' }
      ]
    };
  };

  // Función auxiliar para generar contenido automático
  const generateAutoContent = (input) => {
    const inputLower = input.toLowerCase();
    let niche = 'general';
    
    if (inputLower.includes('restaurante') || inputLower.includes('comida')) niche = 'food';
    else if (inputLower.includes('gym') || inputLower.includes('fitness')) niche = 'fitness';
    else if (inputLower.includes('moda') || inputLower.includes('fashion')) niche = 'fashion';
    
    const contentTemplates = {
      food: {
        post1: {
          copy: "🍽️ El secreto de este plato que está volviendo loca a toda la ciudad ✨ ¿Adivinas cuál es el ingrediente mágico? 👇",
          viralScore: Math.floor(Math.random() * 20) + 80,
          music: "Cooking Vibes Trending - 2.1M usos",
          hashtags: ["#comida", "#secreto", "#viral", "#foodie", "#receta"],
          platform: "tiktok"
        },
        post2: {
          copy: "POV: Probaste nuestro plato estrella y ahora no puedes parar de pensar en él 🤤 La combinación perfecta que conquistó tu paladar ❤️",
          viralScore: Math.floor(Math.random() * 20) + 75,
          visual: "Close-up del plato con steam effect",
          hashtags: ["#foodlover", "#platoEstrella", "#sabor", "#autentico", "#imperdible"],
          platform: "instagram"
        },
        post3: {
          copy: "La historia detrás de nuestra receta familiar: 3 generaciones de sabor auténtico 👨‍🍳 Descubre los secretos que hacen única nuestra cocina",
          viralScore: Math.floor(Math.random() * 20) + 70,
          format: "Video storytelling 8-10 min",
          hashtags: ["#historia", "#familia", "#tradicion", "#autentico", "#recetaSecreta"],
          platform: "youtube"
        }
      },
      fitness: {
        post1: {
          copy: "💪 La rutina de 5 minutos que cambió mi vida completamente ⚡ Resultados visibles en 2 semanas 🔥 ¿Te atreves a intentarlo?",
          viralScore: Math.floor(Math.random() * 20) + 85,
          music: "Workout Motivation Beat - 1.8M usos",
          hashtags: ["#fitness", "#rutina", "#5minutos", "#resultados", "#motivacion"],
          platform: "tiktok"
        },
        post2: {
          copy: "Antes vs Después: 30 días de constancia 💪 No es magia, es disciplina ✨ Tu transformación empieza hoy 🚀",
          viralScore: Math.floor(Math.random() * 20) + 80,
          visual: "Split screen antes/después con medidas",
          hashtags: ["#transformacion", "#30dias", "#antesydespues", "#disciplina", "#resultados"],
          platform: "instagram"
        },
        post3: {
          copy: "Guía completa: Cómo empezar en el gym sin morir en el intento 💪 Todo lo que necesitas saber para tu primera semana",
          viralScore: Math.floor(Math.random() * 20) + 75,
          format: "Tutorial paso a paso 12-15 min",
          hashtags: ["#principiantes", "#gym", "#guia", "#tutorial", "#fitness"],
          platform: "youtube"
        }
      },
      general: {
        post1: {
          copy: "🔥 El contenido que está rompiendo todas las redes sociales ✨ La estrategia que todos quieren copiar 👇",
          viralScore: Math.floor(Math.random() * 20) + 78,
          music: "Trending Now Beat - 3.2M usos",
          hashtags: ["#viral", "#contenido", "#estrategia", "#redes", "#trending"],
          platform: "tiktok"
        },
        post2: {
          copy: "POV: Encontraste la fórmula perfecta para contenido viral 🚀 Engagement que no para de crecer 📈",
          viralScore: Math.floor(Math.random() * 20) + 73,
          visual: "Gráficos de crecimiento animados",
          hashtags: ["#formula", "#viral", "#engagement", "#crecimiento", "#exito"],
          platform: "instagram"
        },
        post3: {
          copy: "Masterclass: Cómo crear contenido que realmente conecta con tu audiencia 🎯 Estrategias probadas que funcionan",
          viralScore: Math.floor(Math.random() * 20) + 70,
          format: "Masterclass educativa 15-20 min",
          hashtags: ["#masterclass", "#contenido", "#audiencia", "#estrategia", "#marketing"],
          platform: "youtube"
        }
      }
    };
    
    return contentTemplates[niche] || contentTemplates.general;
  };

  const generateGeneralResponse = (input) => {
    return {
      id: Date.now() + 1,
      type: 'ai',
      content: `🤖 **¿En qué puedo ayudarte?**\n\nComo tu asistente de IA especializado en content marketing, tengo acceso completo a:\n\n🎯 **Generación de Contenido:**\n• Copys virales personalizados\n• Hashtags optimizados por nicho\n• Ideas de contenido visual\n\n🎵 **Música y Tendencias:**\n• Top 50 global y por país\n• Música trending por red social\n• Predicciones de viralidad\n\n📊 **Análisis y Optimización:**\n• A/B testing automático\n• Análisis de nichos\n• Métricas de rendimiento\n\n📅 **Programación Inteligente:**\n• Horarios óptimos por plataforma\n• Calendario editorial automático\n• Cross-posting optimizado\n\n**¿Sobre qué tema específico te gustaría que profundice?**`,
      timestamp: new Date(),
      suggestions: [
        'Generar contenido para mi negocio',
        'Analizar tendencias musicales',
        'Crear estrategia de contenido',
        'Optimizar mis publicaciones'
      ]
    };
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const createNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: 'Nuevo chat',
      timestamp: new Date()
    };
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChat(newChatId);
    setMessages([{
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu asistente de IA para content marketing. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      suggestions: [
        'Generar copy para mi restaurante',
        'Encontrar música viral para TikTok',
        'Crear contenido para Instagram',
        'Analizar mi nicho de negocio'
      ]
    }]);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - Lista de chats */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-white text-sm">Nuevo chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {chatHistory.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeChat === chat.id 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="text-sm font-medium truncate">{chat.title}</div>
                <div className="text-xs text-gray-500">
                  {chat.timestamp.toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Usuario</div>
              <div className="text-gray-400 text-xs">Plan Pro</div>
            </div>
            <button className="p-1 hover:bg-gray-700 rounded">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Predix AI Assistant</h2>
                <p className="text-gray-400 text-sm">Content Marketing Expert</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-700 rounded-lg">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div className={`p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white ml-auto' 
                      : 'bg-gray-800 text-white'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    
                    {/* Attachments */}
                    {message.attachments && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="p-2 bg-gray-700 rounded-lg">
                            <div className="flex items-center gap-2">
                              {attachment.type === 'copy' && <Brain className="w-4 h-4 text-blue-400" />}
                              {attachment.type === 'hashtags' && <Hash className="w-4 h-4 text-green-400" />}
                              {attachment.type === 'music' && <Music className="w-4 h-4 text-purple-400" />}
                              {attachment.type === 'visual' && <Image className="w-4 h-4 text-pink-400" />}
                              {attachment.type === 'test' && <BarChart3 className="w-4 h-4 text-orange-400" />}
                              {attachment.type === 'niche' && <Target className="w-4 h-4 text-red-400" />}
                              {attachment.type === 'calendar' && <Calendar className="w-4 h-4 text-yellow-400" />}
                              <div className="flex-1">
                                <div className="text-xs font-medium text-white">{attachment.title}</div>
                                <div className="text-xs text-gray-400">{attachment.content}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.type === 'ai' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 p-4 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Pregunta lo que quieras sobre content marketing..."
                className="w-full bg-gray-700 border border-gray-600 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 min-h-[44px] max-h-32"
                rows="1"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="absolute right-2 bottom-2 p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
              <Mic className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Predix AI puede generar thumbnails, carousels, videos, hashtags y contenido completo
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedChat;
