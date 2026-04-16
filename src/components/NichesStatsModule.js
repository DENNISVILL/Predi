// 📊 ESTADÍSTICAS DE NICHOS - MÓDULO DE RESUMEN
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Target, Zap, Star,
  CheckCircle, ArrowRight, Brain, Sparkles, Eye,
  Hash, MessageCircle, Heart, Share2, Clock
} from 'lucide-react';

const NichesStatsModule = () => {
  const [selectedNiche, setSelectedNiche] = useState(null);

  const nichesData = [
    { 
      id: 'fitness', 
      name: 'Fitness & Salud', 
      icon: '💪', 
      color: 'from-green-500 to-emerald-500',
      users: '2.3M',
      engagement: '8.7%',
      viral_rate: '94%',
      top_hashtags: ['#fitness', '#gym', '#transformacion', '#salud'],
      trending_content: 'Rutinas de 15 min',
      growth: '+45%'
    },
    { 
      id: 'food', 
      name: 'Food & Recetas', 
      icon: '🍳', 
      color: 'from-orange-500 to-red-500',
      users: '1.8M',
      engagement: '9.2%',
      viral_rate: '91%',
      top_hashtags: ['#receta', '#cocina', '#comida', '#chef'],
      trending_content: 'Recetas de 5 ingredientes',
      growth: '+38%'
    },
    { 
      id: 'fashion', 
      name: 'Moda & Estilo', 
      icon: '👗', 
      color: 'from-pink-500 to-purple-500',
      users: '3.1M',
      engagement: '7.9%',
      viral_rate: '89%',
      top_hashtags: ['#fashion', '#outfit', '#style', '#moda'],
      trending_content: 'Outfits low-cost',
      growth: '+52%'
    },
    { 
      id: 'tech', 
      name: 'Tecnología', 
      icon: '📱', 
      color: 'from-blue-500 to-cyan-500',
      users: '1.5M',
      engagement: '6.8%',
      viral_rate: '85%',
      top_hashtags: ['#tech', '#app', '#gadget', '#innovation'],
      trending_content: 'Apps de productividad',
      growth: '+29%'
    },
    { 
      id: 'business', 
      name: 'Negocios', 
      icon: '💼', 
      color: 'from-gray-500 to-slate-500',
      users: '987K',
      engagement: '5.4%',
      viral_rate: '78%',
      top_hashtags: ['#business', '#entrepreneur', '#money', '#success'],
      trending_content: 'Tips de freelance',
      growth: '+31%'
    },
    { 
      id: 'lifestyle', 
      name: 'Lifestyle', 
      icon: '✨', 
      color: 'from-yellow-500 to-orange-500',
      users: '2.7M',
      engagement: '8.1%',
      viral_rate: '92%',
      top_hashtags: ['#lifestyle', '#selfcare', '#motivation', '#wellness'],
      trending_content: 'Rutinas matutinas',
      growth: '+41%'
    },
    { 
      id: 'education', 
      name: 'Educación', 
      icon: '📚', 
      color: 'from-indigo-500 to-purple-500',
      users: '1.2M',
      engagement: '7.3%',
      viral_rate: '86%',
      top_hashtags: ['#education', '#learn', '#study', '#knowledge'],
      trending_content: 'Aprender idiomas',
      growth: '+35%'
    },
    { 
      id: 'travel', 
      name: 'Viajes', 
      icon: '✈️', 
      color: 'from-teal-500 to-blue-500',
      users: '1.9M',
      engagement: '8.9%',
      viral_rate: '90%',
      top_hashtags: ['#travel', '#adventure', '#explore', '#wanderlust'],
      trending_content: 'Viajes low-cost',
      growth: '+48%'
    },
    { 
      id: 'gaming', 
      name: 'Gaming & Esports', 
      icon: '🎮', 
      color: 'from-violet-500 to-purple-500',
      users: '4.2M',
      engagement: '9.8%',
      viral_rate: '96%',
      top_hashtags: ['#gaming', '#esports', '#gamer', '#twitch'],
      trending_content: 'Combos secretos',
      growth: '+67%'
    },
    { 
      id: 'art', 
      name: 'Arte & Creatividad', 
      icon: '🎨', 
      color: 'from-rose-500 to-pink-500',
      users: '1.6M',
      engagement: '8.5%',
      viral_rate: '88%',
      top_hashtags: ['#art', '#drawing', '#creative', '#artist'],
      trending_content: 'Tutoriales rápidos',
      growth: '+43%'
    },
    { 
      id: 'home', 
      name: 'Hogar & Decoración', 
      icon: '🏠', 
      color: 'from-amber-500 to-yellow-500',
      users: '2.1M',
      engagement: '7.6%',
      viral_rate: '87%',
      top_hashtags: ['#home', '#decor', '#diy', '#interior'],
      trending_content: 'DIY con presupuesto',
      growth: '+39%'
    },
    { 
      id: 'pets', 
      name: 'Mascotas & Animales', 
      icon: '🐾', 
      color: 'from-emerald-500 to-green-500',
      users: '3.5M',
      engagement: '9.4%',
      viral_rate: '95%',
      top_hashtags: ['#pets', '#dogs', '#cats', '#animals'],
      trending_content: 'Trucos para mascotas',
      growth: '+58%'
    },
    { 
      id: 'entertainment', 
      name: 'Entretenimiento', 
      icon: '🎭', 
      color: 'from-fuchsia-500 to-purple-500',
      users: '5.1M',
      engagement: '10.2%',
      viral_rate: '97%',
      top_hashtags: ['#entertainment', '#series', '#movies', '#celebrity'],
      trending_content: 'Teorías de series',
      growth: '+72%'
    },
    { 
      id: 'sports', 
      name: 'Deportes', 
      icon: '🏆', 
      color: 'from-orange-500 to-amber-500',
      users: '2.8M',
      engagement: '8.3%',
      viral_rate: '93%',
      top_hashtags: ['#sports', '#football', '#training', '#athlete'],
      trending_content: 'Entrenamientos pro',
      growth: '+44%'
    },
    { 
      id: 'family', 
      name: 'Familia & Crianza', 
      icon: '👶', 
      color: 'from-sky-500 to-blue-500',
      users: '1.7M',
      engagement: '7.8%',
      viral_rate: '89%',
      top_hashtags: ['#family', '#parenting', '#kids', '#mom'],
      trending_content: 'Tips de crianza',
      growth: '+36%'
    },
    { 
      id: 'sustainability', 
      name: 'Sostenibilidad', 
      icon: '🌱', 
      color: 'from-lime-500 to-green-500',
      users: '892K',
      engagement: '6.9%',
      viral_rate: '84%',
      top_hashtags: ['#sustainability', '#eco', '#green', '#planet'],
      trending_content: 'Vida zero waste',
      growth: '+28%'
    }
  ];

  const totalStats = {
    total_users: nichesData.reduce((sum, niche) => sum + parseFloat(niche.users.replace('M', '').replace('K', '')) * (niche.users.includes('M') ? 1000000 : 1000), 0),
    avg_engagement: (nichesData.reduce((sum, niche) => sum + parseFloat(niche.engagement.replace('%', '')), 0) / nichesData.length).toFixed(1),
    avg_viral_rate: (nichesData.reduce((sum, niche) => sum + parseFloat(niche.viral_rate.replace('%', '')), 0) / nichesData.length).toFixed(1),
    total_niches: nichesData.length
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
            <BarChart3 className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold">Estadísticas de Nichos</h1>
          </div>
          <p className="text-xl text-gray-400">
            Análisis completo de los {totalStats.total_niches} nichos implementados en Predix
          </p>
        </motion.div>

        {/* Estadísticas Globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{totalStats.total_niches}</div>
            <div className="text-sm text-gray-400">Nichos Totales</div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{(totalStats.total_users / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-400">Usuarios Totales</div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{totalStats.avg_engagement}%</div>
            <div className="text-sm text-gray-400">Engagement Promedio</div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">{totalStats.avg_viral_rate}%</div>
            <div className="text-sm text-gray-400">Tasa Viral Promedio</div>
          </motion.div>
        </div>

        {/* Grid de Nichos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nichesData.map((niche, index) => (
            <motion.div
              key={niche.id}
              className={`bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50 cursor-pointer transition-all hover:border-gray-600 ${
                selectedNiche === niche.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedNiche(selectedNiche === niche.id ? null : niche.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Header del Nicho */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${niche.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {niche.icon}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  parseFloat(niche.growth.replace('%', '').replace('+', '')) > 50 ? 'bg-green-500/20 text-green-400' :
                  parseFloat(niche.growth.replace('%', '').replace('+', '')) > 30 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {niche.growth}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{niche.name}</h3>

              {/* Métricas Principales */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Usuarios:</span>
                  <span className="text-white font-semibold">{niche.users}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Engagement:</span>
                  <span className="text-green-400 font-semibold">{niche.engagement}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Tasa Viral:</span>
                  <span className="text-blue-400 font-semibold">{niche.viral_rate}</span>
                </div>
              </div>

              {/* Contenido Trending */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-1">Trending:</div>
                <div className="text-sm text-purple-400 font-medium">{niche.trending_content}</div>
              </div>

              {/* Hashtags Top */}
              <div className="flex flex-wrap gap-1 mb-4">
                {niche.top_hashtags.slice(0, 2).map((hashtag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>

              {/* Detalles Expandidos */}
              {selectedNiche === niche.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-gray-700/50 pt-4 mt-4"
                >
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-400 mb-2">Todos los hashtags:</div>
                      <div className="flex flex-wrap gap-1">
                        {niche.top_hashtags.map((hashtag, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Crecimiento sostenido</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">IA optimizada para este nicho</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Indicador de Expansión */}
              <div className="flex items-center justify-center mt-4">
                <motion.div
                  animate={{ rotate: selectedNiche === niche.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Resumen Final */}
        <motion.div 
          className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            🎉 16 Nichos Completamente Implementados
          </h2>
          <p className="text-gray-300 mb-6">
            Predix ahora cubre todos los nichos principales de contenido viral, 
            con IA especializada y templates optimizados para cada uno.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-white font-semibold">Copys IA</div>
              <div className="text-gray-400">Por nicho</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-white font-semibold">Hashtags</div>
              <div className="text-gray-400">Optimizados</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-white font-semibold">Audiencias</div>
              <div className="text-gray-400">Segmentadas</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-white font-semibold">Predicciones</div>
              <div className="text-gray-400">Precisas</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NichesStatsModule;
