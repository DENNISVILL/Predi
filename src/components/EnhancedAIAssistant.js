import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Brain, 
  Sparkles, 
  Zap, 
  TrendingUp,
  Target,
  Lightbulb,
  Copy,
  Download,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  RefreshCw,
  Star,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  User,
  Bot,
  Image,
  FileText,
  BarChart3,
  Hash,
  Calendar,
  Globe,
  Users,
  Heart,
  Share2,
  Play,
  Pause,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';

const EnhancedAIAssistant = ({ isOpen, onClose, context = null }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiPersonality, setAiPersonality] = useState('expert'); // expert, creative, analytical, friendly
  const [conversationMode, setConversationMode] = useState('chat'); // chat, analysis, generation, strategy
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mensajes iniciales del AI
  const initialMessages = [
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu asistente IA avanzado de Predix 🚀\n\nPuedo ayudarte con:\n• **Análisis de tendencias** en tiempo real\n• **Generación de contenido viral** personalizado\n• **Estrategias de crecimiento** específicas\n• **Optimización de hashtags** y timing\n• **Predicciones de viralidad** con IA\n\n¿En qué te gustaría que te ayude hoy?',
      timestamp: new Date(),
      suggestions: [
        'Analiza las tendencias actuales',
        'Genera contenido para TikTok',
        'Optimiza mis hashtags',
        'Predice el mejor horario'
      ],
      confidence: 100,
      sources: ['GPT-4 Turbo', 'Predix Analytics']
    }
  ];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages(initialMessages);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (context) {
      handleContextualMessage(context);
    }
  }, [context]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContextualMessage = (contextData) => {
    const contextualMessage = {
      id: Date.now(),
      type: 'ai',
      content: `🎯 **Análisis contextual detectado**\n\n${getContextualResponse(contextData)}`,
      timestamp: new Date(),
      confidence: 95,
      sources: ['Predix Context Engine', 'GPT-4 Turbo']
    };
    setMessages(prev => [...prev, contextualMessage]);
  };

  const getContextualResponse = (contextData) => {
    if (contextData.type === 'trend') {
      return `Detecté que estás viendo la tendencia **"${contextData.name}"**.\n\n📈 **Análisis rápido:**\n• Crecimiento: ${contextData.growth}\n• Confianza: ${contextData.confidence}%\n• Plataforma: ${contextData.platform}\n\n💡 **Recomendación:** Esta tendencia tiene alto potencial viral. ¿Quieres que genere contenido optimizado para aprovecharla?`;
    }
    if (contextData.type === 'niche') {
      return `Veo que estás explorando el nicho **"${contextData.name}"**.\n\n🎯 **Oportunidades detectadas:**\n• Hashtags trending específicos\n• Horarios óptimos de publicación\n• Formatos de contenido más virales\n\n¿Te ayudo a crear una estrategia completa para este nicho?`;
    }
    return 'He detectado actividad relevante. ¿En qué puedo ayudarte específicamente?';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Funciones auxiliares para contenido localizado
  const generateLocalizedCopy = (niche, country) => {
    const copies = {
      food: {
        ecuador: "🍽️ El sabor que conquista Quito ✨ Cada plato cuenta una historia de tradición ecuatoriana 👨‍🍳 ¿Ya probaste nuestro plato estrella? 🇪🇨",
        colombia: "🍽️ El sabor que enamora a Colombia 🇨🇴 Tradición paisa en cada bocado ✨ ¿Listo para vivir esta experiencia gastronómica? 👨‍🍳",
        mexico: "🍽️ Sabores que conquistan México 🇲🇽 Tradición azteca en cada plato 🌮 ¿Ya probaste nuestra especialidad mexicana? ✨"
      },
      fitness: {
        ecuador: "💪 Tu transformación empieza en Quito 🇪🇨 No hay excusas en la mitad del mundo 🔥 ¿Listo para ser tu mejor versión? ⚡",
        colombia: "💪 Colombia, es hora de transformarte 🇨🇴 Fuerza paisa que no se rinde 🔥 ¿Listo para el reto? ⚡",
        mexico: "💪 México, demuestra tu fuerza azteca 🇲🇽 Guerrero moderno en el gym 🔥 ¿Listo para la transformación? ⚡"
      }
    };
    return copies[niche]?.[country] || `Contenido ${niche} optimizado para ${country}`;
  };

  const generateLocalizedHashtags = (niche, country) => {
    const hashtags = {
      food: {
        ecuador: "🔥 Trending: #comidaecuatoriana #quitofood #foodieec\n🎯 Nicho: #saboresecuador #tradicionec #comidalocal\n📍 Local: #restaurantesquito #comidatipica #ecuadorfood",
        colombia: "🔥 Trending: #comidacolombiana #bogotafood #foodieco\n🎯 Nicho: #saborespaisa #tradicioncolombia #arepa\n📍 Local: #restaurantesbogota #comidapaisa #colombiafood",
        mexico: "🔥 Trending: #comidomexicana #cdmxfood #foodiemx\n🎯 Nicho: #saboresazteca #tradicionmx #tacos\n📍 Local: #restaurantescdmx #comidamexicana #mexicofood"
      },
      fitness: {
        ecuador: "🔥 Trending: #fitnessecuador #gymquito #fitec\n🎯 Nicho: #transformacionec #gymlife #fitnessjourney\n📍 Local: #gimnasiosquito #fitnessec #entrenamientoec",
        colombia: "🔥 Trending: #fitnesscolombia #gymbogota #fitco\n🎯 Nicho: #transformacionco #paisa #fitnessjourney\n📍 Local: #gimnasiosbogota #fitnessco #entrenamientoco",
        mexico: "🔥 Trending: #fitnessmx #gymcdmx #fitmx\n🎯 Nicho: #transformacionmx #azteca #fitnessjourney\n📍 Local: #gimnasioscdmx #fitnessmx #entrenamientomx"
      }
    };
    return hashtags[niche]?.[country] || `Hashtags ${niche} para ${country}`;
  };

  const generateMusicRecommendation = (niche, country) => {
    const music = {
      food: {
        ecuador: "🎵 'Cumbia Gastronómica EC' - Trending #1 Ecuador Food\n• 890K usos locales • Mood: cálido, tradicional\n• Perfecto para: reveals de comida, preparación",
        colombia: "🎵 'Salsa Cooking Vibes' - Trending #1 Colombia Food\n• 1.2M usos locales • Mood: alegre, festivo\n• Perfecto para: cocina en vivo, comida paisa",
        mexico: "🎵 'Mariachi Kitchen' - Trending #1 México Food\n• 2.1M usos locales • Mood: tradicional, festivo\n• Perfecto para: tacos, comida mexicana auténtica"
      },
      fitness: {
        ecuador: "🎵 'Andean Power Beat' - Trending #1 Ecuador Fitness\n• 456K usos locales • BPM: 128 • Mood: energético\n• Perfecto para: entrenamientos, transformaciones",
        colombia: "🎵 'Reggaeton Workout' - Trending #1 Colombia Fitness\n• 1.8M usos locales • BPM: 95 • Mood: motivacional\n• Perfecto para: cardio, rutinas de baile",
        mexico: "🎵 'Aztec Warrior Beat' - Trending #1 México Fitness\n• 2.3M usos locales • BPM: 140 • Mood: poderoso\n• Perfecto para: fuerza, entrenamientos intensos"
      }
    };
    return music[niche]?.[country] || `Música ${niche} trending en ${country}`;
  };

  const generateAIResponse = (userInput) => {
    // Detectar país y nicho del input
    const countryDetection = {
      ecuador: ['ecuador', 'quito', 'guayaquil', 'cuenca', 'ec', 'ecuatoriano'],
      colombia: ['colombia', 'bogotá', 'medellín', 'cali', 'co', 'colombiano'],
      mexico: ['méxico', 'mexico', 'cdmx', 'guadalajara', 'mx', 'mexicano'],
      peru: ['perú', 'peru', 'lima', 'arequipa', 'pe', 'peruano']
    };
    
    const nicheDetection = {
      food: ['comida', 'restaurante', 'ceviche', 'plato', 'cocina', 'chef', 'receta'],
      fitness: ['gym', 'gimnasio', 'ejercicio', 'fitness', 'entrenamiento', 'músculo'],
      fashion: ['moda', 'ropa', 'outfit', 'estilo', 'fashion', 'tendencia'],
      tech: ['tecnología', 'app', 'software', 'digital', 'innovación', 'startup']
    };
    
    let detectedCountry = 'global';
    let detectedNiche = 'general';
    
    const inputText = userInput.toLowerCase();
    
    // Detectar país
    for (const [country, keywords] of Object.entries(countryDetection)) {
      if (keywords.some(keyword => inputText.includes(keyword))) {
        detectedCountry = country;
        break;
      }
    }
    
    // Detectar nicho
    for (const [niche, keywords] of Object.entries(nicheDetection)) {
      if (keywords.some(keyword => inputText.includes(keyword))) {
        detectedNiche = niche;
        break;
      }
    }

    const responses = {
      trend: {
        content: `📊 **Análisis de Tendencias - ${detectedCountry.toUpperCase()} | ${detectedNiche.toUpperCase()}**\n\nBasándome en los datos más recientes para ${detectedCountry}:\n\n🔥 **Top 3 Tendencias Emergentes:**\n1. **#${detectedNiche}${detectedCountry}** - Crecimiento +287% (24h)\n2. **#LocalBusiness${detectedCountry}** - Crecimiento +156% (12h)\n3. **#Viral${detectedCountry}** - Crecimiento +134% (6h)\n\n💡 **Recomendación estratégica para ${detectedCountry}:**\nCombina hashtags locales con trending globales. El contenido localizado tiene 94% más engagement en ${detectedCountry}.\n\n¿Quieres que genere contenido específico para tu negocio en ${detectedCountry}?`,
        suggestions: [`Genera copy para ${detectedNiche} en ${detectedCountry}`, `Hashtags locales ${detectedCountry}`, `Música trending ${detectedCountry}`],
        confidence: 96
      },
      content: {
        content: `✨ **Contenido Viral Generado - ${detectedCountry.toUpperCase()} | ${detectedNiche.toUpperCase()}**\n\n🎯 **Copy Localizado para ${detectedCountry}:**\n${generateLocalizedCopy(detectedNiche, detectedCountry)}\n\n#️⃣ **Hashtags Estratégicos:**\n${generateLocalizedHashtags(detectedNiche, detectedCountry)}\n\n🎵 **Música Recomendada:**\n${generateMusicRecommendation(detectedNiche, detectedCountry)}\n\n🎬 **Elementos virales incluidos:**\n• Hook cultural específico de ${detectedCountry}\n• Hashtags trending locales + globales\n• Lenguaje y expresiones de ${detectedCountry}\n• Formato optimizado por plataforma\n\n**Predicción de viralidad: 92%** 🔥`,
        suggestions: [`Más variaciones para ${detectedCountry}`, `Optimizar para otra plataforma`, `Música trending ${detectedCountry}`],
        confidence: 92
      },
      hashtags: {
        content: `#️⃣ **Hashtags Optimizados Generados**\n\n🎯 **Set Principal (Alta competencia):**\n#fashion #style #ootd #trendy\n\n🚀 **Set Emergente (Oportunidad):**\n#AIFashion #TechStyle #SmartWardrobe #FutureOfFashion\n\n💎 **Set Nicho (Específico):**\n#SustainableAI #EcoTech #MinimalistTech #ConsciousFashion\n\n📊 **Análisis de rendimiento:**\n• Alcance estimado: 45,000 - 78,000\n• Engagement esperado: 12.5%\n• Mejor horario: 18:00 - 21:00\n\n**Estrategia recomendada:** Usa 3-4 hashtags de cada set para máxima efectividad.`,
        suggestions: ['Generar hashtags para otro nicho', 'Analizar competencia', 'Optimizar timing'],
        confidence: 92
      },
      default: {
        content: `🤖 **Entiendo tu consulta**\n\nComo tu asistente IA especializado en content marketing, puedo ayudarte con:\n\n🎯 **Análisis y Estrategia:**\n• Tendencias en tiempo real\n• Análisis de competencia\n• Oportunidades de nicho\n\n✨ **Generación de Contenido:**\n• Copys virales personalizados\n• Hashtags optimizados\n• Ideas de contenido visual\n\n📊 **Optimización:**\n• Mejores horarios de publicación\n• Predicciones de viralidad\n• A/B testing de contenido\n\n¿En cuál de estas áreas te gustaría que profundice?`,
        suggestions: ['Analizar tendencias', 'Generar contenido', 'Optimizar estrategia'],
        confidence: 85
      }
    };

    let responseType = 'default';
    
    if (inputText.includes('tendencia') || inputText.includes('trend')) responseType = 'trend';
    else if (inputText.includes('contenido') || inputText.includes('content') || inputText.includes('genera')) responseType = 'content';
    else if (inputText.includes('hashtag') || inputText.includes('#')) responseType = 'hashtags';

    const response = responses[responseType];

    return {
      id: Date.now() + 1,
      type: 'ai',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
      confidence: response.confidence,
      sources: ['GPT-4 Turbo', 'Predix Analytics Engine', 'Real-time Trend Data'],
      actions: [
        { type: 'copy', label: 'Copiar respuesta' },
        { type: 'save', label: 'Guardar análisis' },
        { type: 'share', label: 'Compartir insights' }
      ]
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Aquí iría la lógica de reconocimiento de voz
  };

  const personalities = [
    { id: 'expert', name: 'Experto', icon: '🎯', description: 'Análisis técnico y estratégico' },
    { id: 'creative', name: 'Creativo', icon: '✨', description: 'Ideas innovadoras y originales' },
    { id: 'analytical', name: 'Analítico', icon: '📊', description: 'Datos y métricas detalladas' },
    { id: 'friendly', name: 'Amigable', icon: '😊', description: 'Conversacional y accesible' }
  ];

  const modes = [
    { id: 'chat', name: 'Chat', icon: MessageSquare, description: 'Conversación libre' },
    { id: 'analysis', name: 'Análisis', icon: BarChart3, description: 'Análisis profundo' },
    { id: 'generation', name: 'Generación', icon: Sparkles, description: 'Crear contenido' },
    { id: 'strategy', name: 'Estrategia', icon: Target, description: 'Planificación estratégica' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4 w-96 h-[600px]'} bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-col`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <p className="text-gray-400 text-xs">
                {personalities.find(p => p.id === aiPersonality)?.name} • Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4 text-gray-400" /> : <Maximize2 className="w-4 h-4 text-gray-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-700/50">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setConversationMode(mode.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                conversationMode === mode.id
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <mode.icon className="w-3 h-3" />
              {mode.name}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <motion.div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                <div className={`p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-800 text-white'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  {message.confidence && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700/50">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-gray-400">
                          {message.confidence}% confianza
                        </span>
                      </div>
                      {message.sources && (
                        <div className="text-xs text-gray-500">
                          • {message.sources.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 bg-gray-700/50 hover:bg-gray-700 text-gray-300 text-xs rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {message.actions && (
                  <div className="flex items-center gap-2 mt-2">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                        title={action.label}
                      >
                        {action.type === 'copy' && <Copy className="w-3 h-3 text-gray-400" />}
                        {action.type === 'save' && <Download className="w-3 h-3 text-gray-400" />}
                        {action.type === 'share' && <Share2 className="w-3 h-3 text-gray-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 p-3 rounded-2xl">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Pregúntame sobre tendencias, contenido, estrategias..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={handleVoiceToggle}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isListening ? 'bg-red-500 text-white' : 'hover:bg-gray-700 text-gray-400'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <motion.button
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedAIAssistant;
