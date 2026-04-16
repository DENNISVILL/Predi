import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Clock, Star, Copy, Download, Heart, Users } from 'lucide-react';

const PredictiveActions = () => {
  const [objective, setObjective] = useState('');
  const [niche, setNiche] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState(null);

  const niches = [
    'Entretenimiento', 'Moda', 'Tecnología', 'Gaming', 
    'Fitness', 'Cocina', 'Viajes', 'Educación', 
    'Negocios', 'Arte', 'Música', 'Lifestyle'
  ];

  const objectives = [
    'Aumentar seguidores',
    'Más engagement', 
    'Viralizar contenido',
    'Generar leads',
    'Promocionar producto',
    'Crear comunidad'
  ];

  const handleGenerateStrategy = async () => {
    if (!objective || !niche) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      setStrategy({
        trend: '#ViralDance2025',
        hashtags: ['#ViralDance2025', '#TrendingNow', '#CreateWithMe', '#ViralChallenge'],
        copy: `¿Ya viste el #ViralDance2025? 🔥 Este nuevo challenge está arrasando y aquí te enseño cómo hacerlo paso a paso ✨ ¿Te atreves a intentarlo? #Challenge #TrendingNow`,
        contentIdea: {
          type: 'Video Tutorial',
          description: 'Crea un video de 60 segundos enseñando la coreografía paso a paso, usa música trending y añade subtítulos llamativos.',
          hooks: [
            'POV: Te enseño el baile que está rompiendo TikTok',
            '3 pasos para dominar el #ViralDance2025',
            'El challenge que todos están haciendo (tutorial fácil)'
          ]
        },
        timing: {
          day: 'Viernes',
          time: '7:00 PM - 9:00 PM',
          reason: 'Horario pico de tu audiencia objetivo (16-24 años)'
        },
        predictions: {
          engagement: '12-18%',
          reach: '50K - 100K',
          confidence: 87
        }
      });
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Predix Assistant</h1>
            <p className="text-gray-400 text-lg">Tu estratega personal de tendencias</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div 
          className="glass-effect rounded-2xl p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Cuéntame tu objetivo</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                ¿Qué quieres lograr? 🎯
              </label>
              <div className="grid grid-cols-2 gap-2">
                {objectives.map((obj) => (
                  <motion.button
                    key={obj}
                    onClick={() => setObjective(obj)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      objective === obj
                        ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white'
                        : 'bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {obj}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                ¿Cuál es tu nicho? 📱
              </label>
              <div className="grid grid-cols-3 gap-2">
                {niches.map((nicheOption) => (
                  <motion.button
                    key={nicheOption}
                    onClick={() => setNiche(nicheOption)}
                    className={`p-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      niche === nicheOption
                        ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white'
                        : 'bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {nicheOption}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleGenerateStrategy}
              disabled={!objective || !niche || isGenerating}
              className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${
                objective && niche && !isGenerating
                  ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white hover:shadow-xl'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={objective && niche && !isGenerating ? { scale: 1.02 } : {}}
              whileTap={objective && niche && !isGenerating ? { scale: 0.98 } : {}}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generando estrategia...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Crear Estrategia con IA
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Strategy Result */}
        <motion.div 
          className="glass-effect rounded-2xl p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!strategy ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="w-20 h-20 bg-gradient-to-br from-[#007bff]/20 to-[#00ff9d]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-10 h-10 text-[#007bff]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Estrategia Personalizada</h3>
                <p className="text-gray-400">Completa los campos para que pueda crear tu estrategia perfecta</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Tu Estrategia</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-white font-semibold">{strategy.predictions.confidence}% confiable</span>
                </div>
              </div>

              {/* Trend */}
              <div className="bg-[#1f1f1f] rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">Tendencia Recomendada</h3>
                <div className="text-2xl font-bold gradient-text">{strategy.trend}</div>
              </div>

              {/* Copy */}
              <div className="bg-[#1f1f1f] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Copy Optimizado</h3>
                  <motion.button
                    onClick={() => copyToClipboard(strategy.copy)}
                    className="p-2 text-[#007bff] hover:bg-[#007bff]/10 rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{strategy.copy}</p>
              </div>

              {/* Hashtags */}
              <div className="bg-[#1f1f1f] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Hashtags Sugeridos</h3>
                  <motion.button
                    onClick={() => copyToClipboard(strategy.hashtags.join(' '))}
                    className="p-2 text-[#007bff] hover:bg-[#007bff]/10 rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strategy.hashtags.map((hashtag, index) => (
                    <span key={index} className="px-2 py-1 bg-[#007bff]/20 border border-[#007bff]/30 rounded-lg text-sm text-white">
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Idea */}
              <div className="bg-[#1f1f1f] rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Idea de Contenido</h3>
                <div className="mb-3">
                  <span className="px-2 py-1 bg-[#00ff9d]/20 border border-[#00ff9d]/30 rounded-lg text-sm text-white">
                    {strategy.contentIdea.type}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-4">{strategy.contentIdea.description}</p>
                
                <h4 className="text-white font-medium mb-2">Hooks sugeridos:</h4>
                <ul className="space-y-2">
                  {strategy.contentIdea.hooks.map((hook, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-[#00ff9d] font-bold">•</span>
                      {hook}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timing */}
              <div className="bg-[#1f1f1f] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-[#007bff]" />
                  <h3 className="text-white font-semibold">Momento Ideal</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Día</p>
                    <p className="text-white font-semibold">{strategy.timing.day}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Horario</p>
                    <p className="text-white font-semibold">{strategy.timing.time}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-2">{strategy.timing.reason}</p>
              </div>

              {/* Predictions */}
              <div className="bg-gradient-to-r from-[#007bff]/10 to-[#00ff9d]/10 border border-[#007bff]/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Predicciones IA</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <div className="text-white font-bold">{strategy.predictions.engagement}</div>
                    <div className="text-gray-400 text-xs">Engagement</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 text-[#00ff9d] mx-auto mb-1" />
                    <div className="text-white font-bold">{strategy.predictions.reach}</div>
                    <div className="text-gray-400 text-xs">Alcance</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 py-3 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl text-white font-semibold hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Guardar Estrategia
                </motion.button>
                <motion.button
                  className="px-4 py-3 glass-effect rounded-xl text-white hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PredictiveActions;