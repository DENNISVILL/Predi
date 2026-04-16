// 📝 GENERADOR DE COPYS CON IA - MÓDULO PRINCIPAL
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PenTool, Target, Users, Zap, Copy, RefreshCw, 
  TrendingUp, Hash, MessageSquare, Sparkles,
  CheckCircle, ArrowRight, Brain, Wand2
} from 'lucide-react';

const CopyGeneratorModule = () => {
  const [selectedNiche, setSelectedNiche] = useState('');
  const [contentType, setContentType] = useState('');
  const [audience, setAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopys, setGeneratedCopys] = useState([]);

  const nichos = [
    { id: 'fitness', name: 'Fitness & Salud', icon: '💪', color: 'from-green-500 to-emerald-500' },
    { id: 'food', name: 'Food & Recetas', icon: '🍳', color: 'from-orange-500 to-red-500' },
    { id: 'fashion', name: 'Moda & Estilo', icon: '👗', color: 'from-pink-500 to-purple-500' },
    { id: 'tech', name: 'Tecnología', icon: '📱', color: 'from-blue-500 to-cyan-500' },
    { id: 'business', name: 'Negocios', icon: '💼', color: 'from-gray-500 to-slate-500' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '✨', color: 'from-yellow-500 to-orange-500' },
    { id: 'education', name: 'Educación', icon: '📚', color: 'from-indigo-500 to-purple-500' },
    { id: 'travel', name: 'Viajes', icon: '✈️', color: 'from-teal-500 to-blue-500' },
    { id: 'gaming', name: 'Gaming & Esports', icon: '🎮', color: 'from-violet-500 to-purple-500' },
    { id: 'art', name: 'Arte & Creatividad', icon: '🎨', color: 'from-rose-500 to-pink-500' },
    { id: 'home', name: 'Hogar & Decoración', icon: '🏠', color: 'from-amber-500 to-yellow-500' },
    { id: 'pets', name: 'Mascotas & Animales', icon: '🐾', color: 'from-emerald-500 to-green-500' },
    { id: 'entertainment', name: 'Entretenimiento', icon: '🎭', color: 'from-fuchsia-500 to-purple-500' },
    { id: 'sports', name: 'Deportes', icon: '🏆', color: 'from-orange-500 to-amber-500' },
    { id: 'family', name: 'Familia & Crianza', icon: '👶', color: 'from-sky-500 to-blue-500' },
    { id: 'sustainability', name: 'Sostenibilidad', icon: '🌱', color: 'from-lime-500 to-green-500' }
  ];

  const tiposContenido = [
    { id: 'reel', name: 'Reel/Video Corto', duration: '15-30s' },
    { id: 'carrusel', name: 'Carrusel', slides: '3-10 slides' },
    { id: 'historia', name: 'Historia/Story', duration: '24h' },
    { id: 'post', name: 'Post Estático', type: 'imagen' },
    { id: 'live', name: 'Live/Transmisión', duration: 'tiempo real' }
  ];

  const audiencias = [
    { id: 'gen_z', name: 'Gen Z (16-24)', traits: ['Auténtico', 'Visual', 'Trending'] },
    { id: 'millennials', name: 'Millennials (25-35)', traits: ['Profesional', 'Familiar', 'Nostálgico'] },
    { id: 'gen_x', name: 'Gen X (36-50)', traits: ['Práctico', 'Directo', 'Confiable'] },
    { id: 'mixed', name: 'Audiencia Mixta', traits: ['Versátil', 'Inclusivo', 'Universal'] }
  ];

  const generateCopy = async () => {
    if (!selectedNiche || !contentType || !audience) return;
    
    setIsGenerating(true);
    
    // Simulación de generación con IA
    setTimeout(() => {
      const copyTemplates = {
        fitness: [
          {
            hook: "Perdí 15kg en 3 meses sin dietas extremas... 💪",
            cuerpo: "El método que cambió mi vida para siempre:\n\n🏃 Cardio: 20 min (3x semana)\n💪 Pesas: 30 min (3x semana)\n🥗 Comida real: 80/20\n💧 Agua: 3L diarios\n\nAntes vs Ahora ⬇️",
            cta: "¿Cuál es tu mayor desafío fitness? 💬",
            hashtags: ["#fitness", "#transformacion", "#perderpeso", "#gym", "#salud"]
          }
        ],
        food: [
          {
            hook: "Receta viral que está rompiendo TikTok... 🍳",
            cuerpo: "5 ingredientes, 10 minutos, sabor increíble:\n\n🥚 2 huevos\n🧀 Queso rallado\n🍞 Pan integral\n🥑 Aguacate\n🍅 Tomate cherry\n\n¡El desayuno perfecto!",
            cta: "¿Ya la probaste? Cuéntanos qué tal 😋",
            hashtags: ["#receta", "#cocina", "#desayuno", "#facil", "#viral"]
          }
        ],
        fashion: [
          {
            hook: "Outfit de $30 que parece de $300... 👗",
            cuerpo: "Cómo crear looks caros con poco presupuesto:\n\n👕 Top básico: $8\n👖 Jeans vintage: $12\n👠 Accesorios: $10\n✨ Confianza: GRATIS\n\nEl secreto está en los detalles...",
            cta: "¿Cuál es tu tienda favorita low-cost? 💸",
            hashtags: ["#fashion", "#outfit", "#lowcost", "#style", "#moda"]
          }
        ],
        tech: [
          {
            hook: "App que me está ahorrando 5 horas semanales... 📱",
            cuerpo: "Herramienta que cambió mi productividad:\n\n⚡ Automatiza tareas repetitivas\n📊 Organiza mi día perfecto\n🔔 Recordatorios inteligentes\n💰 Gratis los primeros 30 días\n\nLink en bio ⬆️",
            cta: "¿Qué app no puede faltar en tu teléfono? 📲",
            hashtags: ["#tech", "#app", "#productividad", "#tecnologia", "#hack"]
          }
        ],
        business: [
          {
            hook: "Gané $10K en mi primer mes freelance... 💼",
            cuerpo: "Estrategia que me llevó de $0 a $10K:\n\n🎯 Nicho específico elegido\n💼 Portfolio profesional creado\n🔥 Propuestas personalizadas\n⭐ Testimonios conseguidos\n\nNo fue suerte, fue estrategia...",
            cta: "¿Cuál es tu meta de ingresos? Comenta 💰",
            hashtags: ["#business", "#freelance", "#emprendimiento", "#dinero", "#exito"]
          }
        ],
        lifestyle: [
          {
            hook: "Rutina matutina que cambió mi vida entera... ✨",
            cuerpo: "5AM Club que transformó mi energía:\n\n🌅 5:00 - Despertar sin alarma\n🧘 5:15 - Meditación (10 min)\n📚 5:30 - Lectura (20 min)\n🏃 6:00 - Ejercicio (30 min)\n☕ 6:45 - Café y planificación\n\nResultado: Días más productivos",
            cta: "¿A qué hora te levantas? Cuéntanos 🌅",
            hashtags: ["#lifestyle", "#rutina", "#5amclub", "#productividad", "#bienestar"]
          }
        ],
        education: [
          {
            hook: "Aprendí inglés fluido en 6 meses (método gratis)... 📚",
            cuerpo: "Sistema que me llevó de básico a fluido:\n\n🎧 Podcasts: 1h diaria\n📺 Series subtituladas: 30 min\n💬 Intercambio de idiomas: 3x semana\n📖 Lectura: 15 min antes de dormir\n\nClave: Consistencia diaria",
            cta: "¿Qué idioma quieres aprender? 🌍",
            hashtags: ["#education", "#ingles", "#idiomas", "#aprender", "#gratis"]
          }
        ],
        travel: [
          {
            hook: "Viajé 2 semanas por Europa con $500... ✈️",
            cuerpo: "Presupuesto real de mi eurotrip:\n\n✈️ Vuelos: $200 (ofertas flash)\n🏠 Hostales: $150 (15 noches)\n🚂 Transporte: $100 (pases de tren)\n🍕 Comida: $50 (mercados locales)\n\n5 países, experiencias increíbles",
            cta: "¿Cuál es tu destino soñado? ✈️",
            hashtags: ["#travel", "#europa", "#lowcost", "#mochilero", "#aventura"]
          }
        ],
        gaming: [
          {
            hook: "POV: Descubriste el combo secreto que nadie conoce 🎮",
            cuerpo: "Llevo 5 años jugando y NUNCA había visto esto...\n\n🔥 Combo: [Movimientos específicos]\n⚡ Daño: +300% crítico\n🏆 Resultado: Victoria garantizada\n\n¿Sabías que existía?",
            cta: "¿Cuál es tu combo favorito? Comenta abajo 👇",
            hashtags: ["#gaming", "#esports", "#combo", "#viral", "#gamer"]
          }
        ],
        art: [
          {
            hook: "Transformé una hoja en blanco en esto... 🎨",
            cuerpo: "Técnica que aprendí viendo 100+ tutoriales:\n\n✏️ Paso 1: Boceto básico (5 min)\n🎨 Paso 2: Colores base (15 min)\n✨ Paso 3: Detalles finales (20 min)\n\nTotal: 40 minutos de magia",
            cta: "¿Quieres el tutorial completo? Dale SAVE 📌",
            hashtags: ["#arte", "#dibujo", "#tutorial", "#creatividad", "#artista"]
          }
        ],
        home: [
          {
            hook: "Transformé mi sala con $50 y quedó así... 🏠",
            cuerpo: "DIY que cambió completamente mi espacio:\n\n💡 Iluminación LED: $15\n🪴 Plantas artificiales: $20\n🖼️ Cuadros impresos: $10\n🛋️ Cojines nuevos: $5\n\nAntes vs Después ⬇️",
            cta: "¿Cuál cambio te gustó más? Comenta 💬",
            hashtags: ["#hogar", "#decoracion", "#diy", "#antes", "#despues"]
          }
        ],
        pets: [
          {
            hook: "Mi perro aprendió esto en 3 días y ahora... 🐾",
            cuerpo: "Truco que TODOS los dueños deberían saber:\n\n🎾 Día 1: Comando básico (10 min)\n🏃 Día 2: Práctica con premio (15 min)\n⭐ Día 3: Perfección total\n\n¡Ahora lo hace sin premio!",
            cta: "¿Tu mascota sabe hacer trucos? Cuéntanos 🐕",
            hashtags: ["#mascotas", "#perros", "#entrenamiento", "#trucos", "#viral"]
          }
        ],
        entertainment: [
          {
            hook: "Plot twist que NADIE vio venir en esta serie... 🎭",
            cuerpo: "Teoría que predije desde el episodio 1:\n\n🔍 Pista #1: [Detalle sutil]\n🧩 Pista #2: [Conexión oculta]\n💥 Revelación: [Plot twist]\n\n¿Alguien más lo notó?",
            cta: "¿Cuál fue tu plot twist favorito? 👇",
            hashtags: ["#series", "#netflix", "#plottwist", "#teoria", "#viral"]
          }
        ],
        sports: [
          {
            hook: "Entrené como atleta olímpico por 30 días... 🏆",
            cuerpo: "Rutina que cambió mi físico completamente:\n\n🏃 Cardio: 6AM (30 min)\n💪 Fuerza: 4PM (45 min)\n🧘 Recovery: 8PM (20 min)\n🥗 Nutrición: 5 comidas/día\n\nResultados increíbles ⬇️",
            cta: "¿Te atreves al desafío? Comenta 'SÍ' 💪",
            hashtags: ["#deportes", "#fitness", "#entrenamiento", "#atletico", "#desafio"]
          }
        ],
        family: [
          {
            hook: "Mi bebé durmió toda la noche con este método... 👶",
            cuerpo: "Técnica que salvó mi cordura de mamá:\n\n🌙 Rutina nocturna: 7PM\n🛁 Baño relajante: 15 min\n📚 Cuento suave: 10 min\n🎵 Música blanca: Toda la noche\n\n¡8 horas seguidas de sueño!",
            cta: "¿Funciona con tu bebé? Cuéntanos 💤",
            hashtags: ["#familia", "#bebe", "#maternidad", "#sueño", "#tips"]
          }
        ],
        sustainability: [
          {
            hook: "Reduje mi basura 90% con estos 5 cambios... 🌱",
            cuerpo: "Swaps que cambiaron mi impacto ambiental:\n\n♻️ Bolsas reutilizables\n🥤 Botella de acero\n🧴 Champú sólido\n📦 Compras a granel\n🌿 Compost casero\n\nPlaneta = Agradecido 🌍",
            cta: "¿Cuál cambio harías primero? 🌱",
            hashtags: ["#sostenibilidad", "#ecofriendly", "#zerowaste", "#planeta", "#verde"]
          }
        ]
      };

      // Obtener templates específicos del nicho o usar genéricos
      const nicheTemplates = copyTemplates[selectedNiche] || [
        {
          hook: "POV: Descubriste el secreto que cambiará tu vida 🤯",
          cuerpo: "Esto es lo que nadie te dice sobre [tema]...\n\n✨ Paso 1: [Acción específica]\n💡 Paso 2: [Resultado esperado]\n🚀 Paso 3: [Transformación]",
          cta: "¿Ya lo sabías? Comenta 'SÍ' si quieres más tips 👇",
          hashtags: ["#fyp", "#viral", "#tips", `#${selectedNiche}`]
        }
      ];

      // Generar 3 copys variados
      const mockCopys = [
        {
          id: 1,
          ...nicheTemplates[0],
          score: Math.floor(Math.random() * 15) + 85,
          engagement_estimado: (Math.random() * 3 + 6).toFixed(1) + "%"
        },
        {
          id: 2,
          hook: "Esto me hubiera ahorrado 2 años de errores 😭",
          cuerpo: `Si estás empezando en ${selectedNiche}, GUARDA este post 📌\n\n❌ Error #1: [Problema común]\n✅ Solución: [Acción correcta]\n\n❌ Error #2: [Otro problema]\n✅ Solución: [Otra acción]`,
          cta: "¿Cuál error cometiste tú? Cuéntame en comentarios 💬",
          hashtags: ["#errores", "#tips", "#principiantes", `#${selectedNiche}`],
          score: Math.floor(Math.random() * 15) + 80,
          engagement_estimado: (Math.random() * 2 + 6).toFixed(1) + "%"
        },
        {
          id: 3,
          hook: "El método que me dio resultados en 30 días 📈",
          cuerpo: "Probé 10 estrategias diferentes...\n\nEsta fue la ÚNICA que funcionó:\n\n🎯 [Estrategia específica]\n⏰ Tiempo: [Duración]\n💰 Costo: [Inversión]\n📊 Resultado: [Métrica específica]",
          cta: "¿Quieres que haga un tutorial completo? Dale LIKE ❤️",
          hashtags: ["#resultados", "#estrategia", "#30dias", `#${selectedNiche}`],
          score: Math.floor(Math.random() * 10) + 85,
          engagement_estimado: (Math.random() * 2.5 + 7).toFixed(1) + "%"
        }
      ];
      
      setGeneratedCopys(mockCopys);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold">Generador de Copys IA</h1>
          </div>
          <p className="text-xl text-gray-400">
            Crea copys virales personalizados para tu nicho en segundos
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel de Configuración */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-400" />
                Configuración
              </h2>

              {/* Selección de Nicho */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Selecciona tu nicho:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {nichos.map((nicho) => (
                    <motion.button
                      key={nicho.id}
                      onClick={() => setSelectedNiche(nicho.id)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedNiche === nicho.id
                          ? `bg-gradient-to-r ${nicho.color} border-transparent text-white`
                          : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-lg mb-1">{nicho.icon}</div>
                      <div className="text-sm font-medium">{nicho.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tipo de Contenido */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tipo de contenido:
                </label>
                <div className="space-y-2">
                  {tiposContenido.map((tipo) => (
                    <motion.button
                      key={tipo.id}
                      onClick={() => setContentType(tipo.id)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        contentType === tipo.id
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="font-medium">{tipo.name}</div>
                      <div className="text-xs text-gray-400">
                        {tipo.duration || tipo.slides || tipo.type}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Audiencia */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Audiencia objetivo:
                </label>
                <div className="space-y-2">
                  {audiencias.map((aud) => (
                    <motion.button
                      key={aud.id}
                      onClick={() => setAudience(aud.id)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        audience === aud.id
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="font-medium">{aud.name}</div>
                      <div className="text-xs text-gray-400">
                        {aud.traits.join(' • ')}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Botón Generar */}
              <motion.button
                onClick={generateCopy}
                disabled={!selectedNiche || !contentType || !audience || isGenerating}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  !selectedNiche || !contentType || !audience || isGenerating
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
                whileHover={!isGenerating ? { scale: 1.02 } : {}}
                whileTap={!isGenerating ? { scale: 0.98 } : {}}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generando IA...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Generar Copys
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          {/* Panel de Resultados */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Copys Generados
              </h2>

              {generatedCopys.length > 0 ? (
                <div className="space-y-6">
                  {generatedCopys.map((copy, index) => (
                    <motion.div
                      key={copy.id}
                      className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Copy #{copy.id}</h3>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-gray-400">Score: </span>
                            <span className="text-green-400 font-bold">{copy.score}/100</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Engagement: </span>
                            <span className="text-blue-400 font-bold">{copy.engagement_estimado}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-yellow-400 mb-1 block">
                            🎯 Hook (Gancho):
                          </label>
                          <p className="text-white bg-gray-800/50 p-3 rounded-lg">
                            {copy.hook}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-blue-400 mb-1 block">
                            📝 Cuerpo del Copy:
                          </label>
                          <p className="text-white bg-gray-800/50 p-3 rounded-lg whitespace-pre-line">
                            {copy.cuerpo}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-green-400 mb-1 block">
                            🚀 Call to Action:
                          </label>
                          <p className="text-white bg-gray-800/50 p-3 rounded-lg">
                            {copy.cta}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-purple-400 mb-1 block">
                            # Hashtags Recomendados:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {copy.hashtags.map((hashtag, idx) => (
                              <span 
                                key={idx}
                                className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                              >
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <motion.button
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Copy className="w-4 h-4" />
                            Copiar Copy
                          </motion.button>
                          
                          <motion.button
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                            whileHover={{ scale: 1.02 }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Usar Este Copy
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PenTool className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    Configura los parámetros y genera tu copy
                  </h3>
                  <p className="text-gray-500">
                    Selecciona nicho, tipo de contenido y audiencia para comenzar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyGeneratorModule;
