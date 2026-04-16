// 🎯 SELECTOR DE NICHOS - NAVEGACIÓN A MÓDULOS INDIVIDUALES
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Search, TrendingUp, Users, Zap, Star,
  ArrowRight, Eye, Heart, BarChart3, Sparkles
} from 'lucide-react';
import NicheDetailModule from './NicheDetailModule';

const NicheSelectorModule = () => {
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nichos = [
    { 
      id: 'fitness', 
      name: 'Fitness & Salud', 
      icon: '💪', 
      color: 'from-green-500 to-emerald-500',
      description: 'Transformaciones, rutinas y nutrición',
      stats: { users: '2.3M', engagement: '8.7%', viral_rate: '94%' },
      trending: 'Rutinas de 15 min'
    },
    { 
      id: 'food', 
      name: 'Food & Recetas', 
      icon: '🍳', 
      color: 'from-orange-500 to-red-500',
      description: 'Cocina, recetas y gastronomía',
      stats: { users: '1.8M', engagement: '9.2%', viral_rate: '91%' },
      trending: 'Recetas de 5 ingredientes'
    },
    { 
      id: 'fashion', 
      name: 'Moda & Estilo', 
      icon: '👗', 
      color: 'from-pink-500 to-purple-500',
      description: 'Moda, estilo y tendencias',
      stats: { users: '3.1M', engagement: '7.9%', viral_rate: '89%' },
      trending: 'Outfits low-cost'
    },
    { 
      id: 'tech', 
      name: 'Tecnología', 
      icon: '📱', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Tecnología, apps y gadgets',
      stats: { users: '1.5M', engagement: '6.8%', viral_rate: '85%' },
      trending: 'Apps de productividad'
    },
    { 
      id: 'business', 
      name: 'Negocios', 
      icon: '💼', 
      color: 'from-gray-500 to-slate-500',
      description: 'Emprendimiento y negocios',
      stats: { users: '987K', engagement: '5.4%', viral_rate: '78%' },
      trending: 'Tips de freelance'
    },
    { 
      id: 'lifestyle', 
      name: 'Lifestyle', 
      icon: '✨', 
      color: 'from-yellow-500 to-orange-500',
      description: 'Estilo de vida y bienestar',
      stats: { users: '2.7M', engagement: '8.1%', viral_rate: '92%' },
      trending: 'Rutinas matutinas'
    },
    { 
      id: 'education', 
      name: 'Educación', 
      icon: '📚', 
      color: 'from-indigo-500 to-purple-500',
      description: 'Educación y aprendizaje',
      stats: { users: '1.2M', engagement: '7.3%', viral_rate: '86%' },
      trending: 'Aprender idiomas'
    },
    { 
      id: 'travel', 
      name: 'Viajes', 
      icon: '✈️', 
      color: 'from-teal-500 to-blue-500',
      description: 'Viajes y aventuras',
      stats: { users: '1.9M', engagement: '8.9%', viral_rate: '90%' },
      trending: 'Viajes low-cost'
    },
    { 
      id: 'gaming', 
      name: 'Gaming & Esports', 
      icon: '🎮', 
      color: 'from-violet-500 to-purple-500',
      description: 'Gaming, esports y entretenimiento',
      stats: { users: '4.2M', engagement: '9.8%', viral_rate: '96%' },
      trending: 'Combos secretos'
    },
    { 
      id: 'art', 
      name: 'Arte & Creatividad', 
      icon: '🎨', 
      color: 'from-rose-500 to-pink-500',
      description: 'Arte, creatividad y diseño',
      stats: { users: '1.6M', engagement: '8.5%', viral_rate: '88%' },
      trending: 'Tutoriales rápidos'
    },
    { 
      id: 'home', 
      name: 'Hogar & Decoración', 
      icon: '🏠', 
      color: 'from-amber-500 to-yellow-500',
      description: 'Hogar, decoración y DIY',
      stats: { users: '2.1M', engagement: '7.6%', viral_rate: '87%' },
      trending: 'DIY con presupuesto'
    },
    { 
      id: 'pets', 
      name: 'Mascotas & Animales', 
      icon: '🐾', 
      color: 'from-emerald-500 to-green-500',
      description: 'Mascotas, animales y cuidados',
      stats: { users: '3.5M', engagement: '9.4%', viral_rate: '95%' },
      trending: 'Trucos para mascotas'
    },
    { 
      id: 'entertainment', 
      name: 'Entretenimiento', 
      icon: '🎭', 
      color: 'from-fuchsia-500 to-purple-500',
      description: 'Entretenimiento y cultura pop',
      stats: { users: '5.1M', engagement: '10.2%', viral_rate: '97%' },
      trending: 'Teorías de series'
    },
    { 
      id: 'sports', 
      name: 'Deportes', 
      icon: '🏆', 
      color: 'from-orange-500 to-amber-500',
      description: 'Deportes y atletismo',
      stats: { users: '2.8M', engagement: '8.3%', viral_rate: '93%' },
      trending: 'Entrenamientos pro'
    },
    { 
      id: 'family', 
      name: 'Familia & Crianza', 
      icon: '👶', 
      color: 'from-sky-500 to-blue-500',
      description: 'Familia, crianza y parentalidad',
      stats: { users: '1.7M', engagement: '7.8%', viral_rate: '89%' },
      trending: 'Tips de crianza'
    },
    { 
      id: 'sustainability', 
      name: 'Sostenibilidad', 
      icon: '🌱', 
      color: 'from-lime-500 to-green-500',
      description: 'Sostenibilidad y medio ambiente',
      stats: { users: '892K', engagement: '6.9%', viral_rate: '84%' },
      trending: 'Vida zero waste'
    }
  ];

  const filteredNichos = nichos.filter(nicho => 
    nicho.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nicho.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedNiche) {
    return (
      <NicheDetailModule 
        selectedNiche={selectedNiche} 
        onBack={() => setSelectedNiche(null)} 
      />
    );
  }

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
            <Target className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold">Nichos Especializados</h1>
          </div>
          <p className="text-xl text-gray-400 mb-6">
            Selecciona un nicho para acceder a su ecosistema completo de contenido
          </p>
          
          {/* Búsqueda */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar nicho..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            <div className="text-2xl font-bold text-white mb-1">16</div>
            <div className="text-sm text-gray-400">Nichos Totales</div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">37.2M</div>
            <div className="text-sm text-gray-400">Usuarios Totales</div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">8.2%</div>
            <div className="text-sm text-gray-400">Engagement Promedio</div>
          </motion.div>

          <motion.div
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">89.4%</div>
            <div className="text-sm text-gray-400">Tasa Viral Promedio</div>
          </motion.div>
        </div>

        {/* Grid de Nichos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNichos.map((nicho, index) => (
            <motion.div
              key={nicho.id}
              className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50 cursor-pointer transition-all hover:border-gray-600 hover:bg-gray-800/50 group"
              onClick={() => setSelectedNiche(nicho.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Header del Nicho */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${nicho.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {nicho.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{nicho.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{nicho.description}</p>

              {/* Métricas */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Usuarios:
                  </span>
                  <span className="text-white font-semibold">{nicho.stats.users}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Engagement:
                  </span>
                  <span className="text-green-400 font-semibold">{nicho.stats.engagement}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Tasa Viral:
                  </span>
                  <span className="text-blue-400 font-semibold">{nicho.stats.viral_rate}</span>
                </div>
              </div>

              {/* Trending */}
              <div className="border-t border-gray-700/50 pt-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Trending ahora:</span>
                </div>
                <div className="text-sm text-purple-400 font-medium">{nicho.trending}</div>
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${nicho.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            🎯 Cada Nicho es un Ecosistema Completo
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Haz clic en cualquier nicho para acceder a su sistema completo: 
            generación de copys específicos, predicciones de tendencias, 
            contenido para cada red social y búsquedas personalizadas.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm max-w-3xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-blue-400 font-bold mb-1">📝 Copys IA</div>
              <div className="text-gray-400">Específicos del nicho</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-green-400 font-bold mb-1">📈 Tendencias</div>
              <div className="text-gray-400">Predicciones únicas</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-purple-400 font-bold mb-1">📱 Contenido</div>
              <div className="text-gray-400">Por red social</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-yellow-400 font-bold mb-1">🔍 Búsqueda</div>
              <div className="text-gray-400">Personalizada</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-pink-400 font-bold mb-1">📊 Analytics</div>
              <div className="text-gray-400">Métricas detalladas</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NicheSelectorModule;
