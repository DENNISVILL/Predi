// 🔍 EXPLORE TRENDS MODULE SIMPLE - SIN ERRORES
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Eye, Heart, Share2 } from 'lucide-react';

const ExploreTrendsModuleSimple = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [trends] = useState([
    {
      id: 'trend-1',
      name: '#TechTrend2025',
      growth: 95,
      views: 2.5,
      likes: 150000,
      platform: 'TikTok',
      country: '🇺🇸',
      category: 'Tecnología',
      description: 'Las últimas innovaciones tecnológicas están revolucionando el mercado'
    },
    {
      id: 'trend-2',
      name: '#SustainableLiving',
      growth: 87,
      views: 1.8,
      likes: 120000,
      platform: 'Instagram',
      country: '🇪🇸',
      category: 'Lifestyle',
      description: 'Movimiento hacia un estilo de vida más sostenible y ecológico'
    },
    {
      id: 'trend-3',
      name: '#AIRevolution',
      growth: 92,
      views: 3.2,
      likes: 200000,
      platform: 'YouTube',
      country: '🇬🇧',
      category: 'Tecnología',
      description: 'La inteligencia artificial está transformando todas las industrias'
    },
    {
      id: 'trend-4',
      name: '#DigitalNomad',
      growth: 78,
      views: 1.5,
      likes: 95000,
      platform: 'LinkedIn',
      country: '🇩🇪',
      category: 'Trabajo',
      description: 'El trabajo remoto y la vida nómada digital ganan popularidad'
    },
    {
      id: 'trend-5',
      name: '#FitnessRevolution',
      growth: 83,
      views: 2.1,
      likes: 175000,
      platform: 'TikTok',
      country: '🇫🇷',
      category: 'Fitness',
      description: 'Nuevas tendencias de fitness y bienestar están emergiendo'
    },
    {
      id: 'trend-6',
      name: '#CryptoFuture',
      growth: 89,
      views: 2.8,
      likes: 185000,
      platform: 'Twitter',
      country: '🇯🇵',
      category: 'Fintech',
      description: 'Las criptomonedas y blockchain definen el futuro financiero'
    }
  ]);

  const filteredTrends = trends.filter(trend => {
    const matchesSearch = trend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trend.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || trend.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const platforms = ['all', 'TikTok', 'Instagram', 'YouTube', 'Twitter', 'LinkedIn'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Explorar Tendencias</h1>
        <p className="text-gray-400">Descubre las tendencias más populares en tiempo real</p>
      </div>

      {/* Filtros */}
      <div className="mb-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tendencias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filtro de Plataforma */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'all' ? 'Todas las plataformas' : platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
          <span>Mostrando {filteredTrends.length} de {trends.length} tendencias</span>
          <span>•</span>
          <span>Actualizado hace 2 minutos</span>
        </div>
      </div>

      {/* Grid de Tendencias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map((trend) => (
          <motion.div
            key={trend.id}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:bg-gray-700/50 transition-all cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Header de la tarjeta */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{trend.country}</span>
                <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                  {trend.platform}
                </div>
              </div>
              <div className="text-green-400 font-bold text-lg">+{trend.growth}%</div>
            </div>

            {/* Título y categoría */}
            <div className="mb-4">
              <h3 className="text-white font-bold text-lg mb-1">{trend.name}</h3>
              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                {trend.category}
              </span>
            </div>

            {/* Descripción */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {trend.description}
            </p>

            {/* Métricas */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{trend.views}M</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{(trend.likes / 1000).toFixed(0)}K</span>
                </div>
              </div>
              
              <motion.button
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Barra de crecimiento */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${trend.growth}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredTrends.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No se encontraron tendencias</h3>
          <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExploreTrendsModuleSimple;
