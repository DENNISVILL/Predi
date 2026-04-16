import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUp, Star } from 'lucide-react';

const ExploreTrends = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const filters = [
    { key: 'all', label: 'Todas', count: 247 },
    { key: 'emergent', label: 'Emergentes', count: 89 },
    { key: 'viral', label: 'Virales', count: 156 },
    { key: 'predicted', label: 'Predichas', count: 42 }
  ];

  const countries = [
    { key: 'all', label: 'Todos los países', flag: '🌍' },
    { key: 'mx', label: 'México', flag: '🇲🇽' },
    { key: 'us', label: 'Estados Unidos', flag: '🇺🇸' },
    { key: 'br', label: 'Brasil', flag: '🇧🇷' },
    { key: 'kr', label: 'Corea del Sur', flag: '🇰🇷' }
  ];

  const platforms = [
    { key: 'all', label: 'Todas las plataformas' },
    { key: 'tiktok', label: 'TikTok', color: 'bg-pink-500' },
    { key: 'instagram', label: 'Instagram', color: 'bg-purple-500' },
    { key: 'twitter', label: 'Twitter', color: 'bg-blue-500' },
    { key: 'youtube', label: 'YouTube', color: 'bg-red-500' }
  ];

  const trends = [
    {
      id: 1,
      name: '#ViralDance2025',
      category: 'Entretenimiento',
      platform: 'TikTok',
      country: '🇲🇽',
      growth: '+245%',
      confidence: 94,
      level: 'viral',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=300&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'AI Photography',
      category: 'Tecnología',
      platform: 'Instagram',
      country: '🇺🇸',
      growth: '+180%',
      confidence: 87,
      level: 'emergent',
      image: 'https://images.unsplash.com/photo-1686191128892-6b6e3d6d8c4c?w=300&h=300&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Crypto Gaming',
      category: 'Gaming',
      platform: 'Twitter',
      country: '🇰🇷',
      growth: '+156%',
      confidence: 92,
      level: 'predicted',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Sustainable Fashion',
      category: 'Moda',
      platform: 'Instagram',
      country: '🇧🇷',
      growth: '+134%',
      confidence: 78,
      level: 'emergent',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop&crop=center'
    },
    {
      id: 5,
      name: 'Micro Workouts',
      category: 'Fitness',
      platform: 'YouTube',
      country: '🇺🇸',
      growth: '+198%',
      confidence: 89,
      level: 'viral',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center'
    },
    {
      id: 6,
      name: 'Digital Detox',
      category: 'Lifestyle',
      platform: 'TikTok',
      country: '🇲🇽',
      growth: '+167%',
      confidence: 85,
      level: 'predicted',
      image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=300&h=300&fit=crop&crop=center'
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'viral': return 'from-red-500 to-pink-500';
      case 'emergent': return 'from-yellow-500 to-orange-500';
      case 'predicted': return 'from-green-500 to-emerald-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'viral': return 'Viral';
      case 'emergent': return 'Emergente';
      case 'predicted': return 'Predicho';
      default: return 'Tendencia';
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
        <h1 className="text-4xl font-bold text-white mb-2">Explorar Tendencias</h1>
        <p className="text-gray-400 text-lg">Descubre qué está creciendo en tiempo real</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="glass-effect rounded-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar hashtags, palabras clave o temas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#007bff] focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-3 bg-[#1f1f1f] border border-gray-600 rounded-xl text-white focus:border-[#007bff] focus:outline-none transition-all duration-300"
            >
              {countries.map(country => (
                <option key={country.key} value={country.key}>
                  {country.flag} {country.label}
                </option>
              ))}
            </select>

            <select 
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-3 bg-[#1f1f1f] border border-gray-600 rounded-xl text-white focus:border-[#007bff] focus:outline-none transition-all duration-300"
            >
              {platforms.map(platform => (
                <option key={platform.key} value={platform.key}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filter) => (
            <motion.button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                selectedFilter === filter.key
                  ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white'
                  : 'bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
              <span className="ml-2 px-2 py-0.5 bg-black/20 rounded text-xs">
                {filter.count}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.map((trend, index) => (
          <motion.div
            key={trend.id}
            className="glass-effect rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            onClick={() => navigate(`/trend/${trend.id}`)}
            whileHover={{ y: -5 }}
          >
            <div className="relative">
              <img 
                src={trend.image} 
                alt={trend.name}
                className="w-full h-48 object-cover"
              />
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg bg-gradient-to-r ${getLevelColor(trend.level)} text-white text-xs font-semibold`}>
                {getLevelLabel(trend.level)}
              </div>
              <div className="absolute top-3 right-3 text-2xl">
                {trend.country}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white truncate">{trend.name}</h3>
                <div className="flex items-center gap-1 text-[#00ff9d]">
                  <ArrowUp className="w-4 h-4" />
                  <span className="font-semibold text-sm">{trend.growth}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{trend.category}</span>
                <span>{trend.platform}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-white font-semibold">{trend.confidence}% confiable</span>
                </div>

                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-lg text-white text-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver análisis
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.div 
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.button
          className="px-8 py-3 glass-effect rounded-xl text-white font-semibold hover:bg-white/10 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cargar más tendencias
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ExploreTrends;