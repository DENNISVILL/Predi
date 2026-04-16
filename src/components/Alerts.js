import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Rocket, ArrowUp, Star, Settings, Plus, X } from 'lucide-react';

const Alerts = () => {
  const [activeAlerts, setActiveAlerts] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(['all']);

  const categories = [
    { id: 'all', name: 'Todas', count: 24 },
    { id: 'entertainment', name: 'Entretenimiento', count: 8 },
    { id: 'tech', name: 'Tecnología', count: 5 },
    { id: 'fashion', name: 'Moda', count: 6 },
    { id: 'gaming', name: 'Gaming', count: 3 },
    { id: 'fitness', name: 'Fitness', count: 2 }
  ];

  const microtendencias = [
    {
      id: 1,
      name: 'Silent Walking Trend',
      category: 'Fitness',
      platform: 'TikTok',
      country: '🇺🇸',
      growth: '+89%',
      acceleration: 'high',
      confidence: 76,
      description: 'Caminar sin música ni distracciones está ganando popularidad entre Gen Z',
      timeLeft: '2h',
      isNew: true
    },
    {
      id: 2, 
      name: 'Micro Productivity',
      category: 'Lifestyle',
      platform: 'Instagram',
      country: '🇰🇷',
      growth: '+156%',
      acceleration: 'medium',
      confidence: 84,
      description: 'Técnicas de productividad en períodos muy cortos (2-5 minutos)',
      timeLeft: '4h',
      isNew: true
    },
    {
      id: 3,
      name: 'AI Art Collaboration',
      category: 'Arte',
      platform: 'Twitter',
      country: '🇯🇵',
      growth: '+203%',
      acceleration: 'high',
      confidence: 91,
      description: 'Artistas colaborando con IA para crear obras híbridas únicas',
      timeLeft: '6h',
      isNew: false
    },
    {
      id: 4,
      name: 'Vintage Tech Revival',
      category: 'Tecnología',
      platform: 'YouTube',
      country: '🇬🇧',
      growth: '+124%',
      acceleration: 'medium',
      confidence: 73,
      description: 'Jóvenes adoptando tecnología retro (walkman, cámaras film)',
      timeLeft: '8h',
      isNew: false
    }
  ];

  const followedTrends = [
    {
      id: 1,
      name: '#ViralDance2025',
      status: 'growing',
      change: '+12%',
      nextPrediction: '2h'
    },
    {
      id: 2,
      name: 'AI Photography',
      status: 'stable',
      change: '+3%',
      nextPrediction: '6h'
    },
    {
      id: 3,
      name: 'Sustainable Fashion',
      status: 'declining',
      change: '-5%',
      nextPrediction: '12h'
    }
  ];

  const getAccelerationColor = (acceleration) => {
    switch (acceleration) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const getAccelerationIcon = (acceleration) => {
    switch (acceleration) {
      case 'high': return '🔥';
      case 'medium': return '🚀';
      case 'low': return '📈';
      default: return '📊';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'growing': return 'text-green-500';
      case 'stable': return 'text-yellow-500';
      case 'declining': return 'text-red-500';
      default: return 'text-gray-400';
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Alertas Inteligentes</h1>
            <p className="text-gray-400 text-lg">Microtendencias emergentes en tu radar</p>
          </div>
          
          <motion.button
            className="p-3 glass-effect rounded-xl text-white hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="glass-effect rounded-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${activeAlerts ? 'text-[#00ff9d]' : 'text-gray-400'}`} />
              <span className="text-white font-medium">Alertas Activas</span>
              <motion.button
                onClick={() => setActiveAlerts(!activeAlerts)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  activeAlerts ? 'bg-[#00ff9d]' : 'bg-gray-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full"
                  animate={{ x: activeAlerts ? 26 : 2, y: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => {
                  if (category.id === 'all') {
                    setSelectedCategories(['all']);
                  } else {
                    const newSelection = selectedCategories.includes(category.id)
                      ? selectedCategories.filter(c => c !== category.id)
                      : [...selectedCategories.filter(c => c !== 'all'), category.id];
                    setSelectedCategories(newSelection.length ? newSelection : ['all']);
                  }
                }}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                  selectedCategories.includes(category.id) || selectedCategories.includes('all')
                    ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white'
                    : 'bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
                <span className="ml-2 px-2 py-0.5 bg-black/20 rounded text-xs">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Microtendencias */}
        <div className="lg:col-span-2">
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Rocket className="w-6 h-6 text-[#007bff]" />
            <h2 className="text-2xl font-bold text-white">Microtendencias Emergentes</h2>
            <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-semibold">
              {microtendencias.filter(t => t.isNew).length} Nuevas
            </div>
          </motion.div>

          <div className="space-y-4">
            {microtendencias.map((trend, index) => (
              <motion.div
                key={trend.id}
                className="glass-effect rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {trend.isNew && (
                      <div className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold">
                        NUEVO
                      </div>
                    )}
                    <span className="text-2xl">{trend.country}</span>
                    <div className="text-2xl">{getAccelerationIcon(trend.acceleration)}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${getAccelerationColor(trend.acceleration)}`}>
                      <ArrowUp className="w-4 h-4" />
                      <span className="font-bold">{trend.growth}</span>
                    </div>
                    <div className="text-gray-400 text-sm">en {trend.timeLeft}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{trend.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-400">{trend.category}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-sm text-gray-400">{trend.platform}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{trend.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-white font-semibold text-sm">{trend.confidence}% confiable</span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-xl text-white text-sm font-medium transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Seguir
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl text-white text-sm font-semibold hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Ver Análisis
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seguimiento */}
          <motion.div 
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Tendencias Siguiendo</h3>
            
            <div className="space-y-3">
              {followedTrends.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  className="flex items-center justify-between p-3 bg-[#1f1f1f] rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{trend.name}</p>
                    <p className="text-gray-400 text-xs">Próxima en {trend.nextPrediction}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getStatusColor(trend.status)}`}>
                      {trend.change}
                    </span>
                    <motion.button
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="w-full mt-4 py-2 border border-gray-600 rounded-xl text-gray-400 hover:text-white hover:border-[#007bff] transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver todas las seguidas
            </motion.button>
          </motion.div>

          {/* Recommendations */}
          <motion.div 
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Para tu Nicho</h3>
            <p className="text-gray-400 text-sm mb-4">
              Basado en tus intereses en <span className="text-[#00ff9d]">Entretenimiento</span> y <span className="text-[#007bff]">Tecnología</span>
            </p>

            <div className="space-y-3">
              {['Digital Minimalism', 'AI Companions', 'Retro Gaming'].map((suggestion, index) => (
                <motion.div
                  key={index}
                  className="p-3 bg-gradient-to-r from-[#007bff]/10 to-[#00ff9d]/10 border border-[#007bff]/30 rounded-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium text-sm">{suggestion}</p>
                    <motion.button
                      className="px-2 py-1 bg-[#007bff]/20 rounded text-xs text-[#007bff] hover:bg-[#007bff]/30 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Seguir
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Configuración de Alertas */}
          <motion.div 
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Configurar Alertas</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Push Notifications</span>
                <div className="w-10 h-5 bg-[#00ff9d] rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Email Diario</span>
                <div className="w-10 h-5 bg-gray-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Alertas Urgentes</span>
                <div className="w-10 h-5 bg-[#00ff9d] rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
            </div>

            <motion.button
              className="w-full mt-4 py-2 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl text-white text-sm font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Personalizar Más
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;