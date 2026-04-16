import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Globe, 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  BarChart3,
  Zap,
  Clock,
  Users,
  ArrowUp,
  ArrowDown,
  Star,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import useStore from '../store/useStore';
import { useTrends } from '../hooks/useTrends';
import { useNotifications } from '../hooks/useNotifications';

const EnhancedExploreTrends = () => {
  const navigate = useNavigate();
  const { 
    filters, 
    updateFilters, 
    resetFilters, 
    savedTrends, 
    saveTrend, 
    removeSavedTrend,
    addToSearchHistory 
  } = useStore();
  
  const { 
    trends, 
    trendingNow, 
    loading, 
    searchTrends, 
    toggleFollow, 
    getTrendsByCategory, 
    getTrendsByPlatform,
    getTrendStats 
  } = useTrends();
  
  const { showToast } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('growth'); // growth, confidence, recent
  const [showFilters, setShowFilters] = useState(false);

  // Combinar todas las tendencias
  const allTrends = useMemo(() => {
    return [...trends, ...trendingNow];
  }, [trends, trendingNow]);

  // Filtrar y ordenar tendencias
  const filteredTrends = useMemo(() => {
    let filtered = searchResults.length > 0 ? searchResults : allTrends;

    // Aplicar filtros
    if (filters.platform !== 'all') {
      filtered = filtered.filter(trend => 
        trend.platform.toLowerCase() === filters.platform.toLowerCase()
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(trend => 
        trend.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.confidence) {
      filtered = filtered.filter(trend => trend.confidence >= filters.confidence);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'growth':
          const aGrowth = parseFloat(a.growth.replace('%', '').replace('+', ''));
          const bGrowth = parseFloat(b.growth.replace('%', '').replace('+', ''));
          return bGrowth - aGrowth;
        case 'confidence':
          return b.confidence - a.confidence;
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allTrends, searchResults, filters, sortBy]);

  // Buscar tendencias
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = await searchTrends(query);
    setSearchResults(results);
    addToSearchHistory(query);
  };

  // Manejar cambios en búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Obtener estadísticas
  const stats = getTrendStats();

  // Plataformas disponibles
  const platforms = ['all', 'TikTok', 'Instagram', 'Twitter', 'YouTube'];
  const categories = ['all', 'Entretenimiento', 'Tecnología', 'Moda', 'Gaming', 'Educación', 'Música'];

  // Manejar guardado de tendencia
  const handleSaveTrend = (trend) => {
    const isSaved = savedTrends.some(t => t.id === trend.id);
    
    if (isSaved) {
      removeSavedTrend(trend.id);
      showToast('Tendencia eliminada de guardados', 'success');
    } else {
      saveTrend(trend);
      showToast('Tendencia guardada correctamente', 'success');
    }
  };

  // Componente de tarjeta de tendencia
  const TrendCard = ({ trend, index }) => {
    const isSaved = savedTrends.some(t => t.id === trend.id);
    
    return (
      <motion.div
        className={`${viewMode === 'grid' ? 'card-hover' : 'flex items-center gap-4 p-4 bg-[#1f1f1f] rounded-xl hover:bg-[#2a2a2a] transition-all cursor-pointer'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        onClick={() => navigate(`/trend/${trend.id}`)}
      >
        {viewMode === 'grid' ? (
          // Vista de grid
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{trend.country}</span>
                <div className="text-xs px-2 py-1 bg-[#007bff]/20 text-[#007bff] rounded-full">
                  {trend.platform}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveTrend(trend);
                  }}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-[#00ff9d]" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-gray-400" />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(trend.id);
                  }}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`w-4 h-4 ${trend.isFollowing ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                </motion.button>
              </div>
            </div>

            <h3 className="text-white font-bold text-lg mb-2">{trend.name}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{trend.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="text-[#00ff9d] font-bold text-xl">{trend.growth}</div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-gray-500" />
                <span className="text-gray-500 text-xs">{trend.confidence}% confiable</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                {trend.category}
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="w-3 h-3" />
                {new Date(trend.createdAt).toLocaleDateString()}
              </div>
            </div>
          </>
        ) : (
          // Vista de lista
          <>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{trend.country}</span>
              <div>
                <h3 className="text-white font-semibold">{trend.name}</h3>
                <p className="text-gray-400 text-sm">{trend.platform} • {trend.category}</p>
              </div>
            </div>

            <div className="flex-1 px-4">
              <p className="text-gray-400 text-sm line-clamp-1">{trend.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-[#00ff9d] font-bold">{trend.growth}</div>
              <div className="text-gray-400 text-sm">{trend.confidence}%</div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveTrend(trend);
                  }}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-[#00ff9d]" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-gray-400" />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(trend.id);
                  }}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`w-4 h-4 ${trend.isFollowing ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="p-6 min-h-screen custom-scrollbar">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Explorar Tendencias</h1>
        <p className="text-gray-400 text-lg">
          Descubre las tendencias que están creciendo ahora • {stats.total} tendencias activas
        </p>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-[#007bff] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-gray-400 text-sm">Total</div>
        </div>
        <div className="card text-center">
          <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.following}</div>
          <div className="text-gray-400 text-sm">Siguiendo</div>
        </div>
        <div className="card text-center">
          <BarChart3 className="w-8 h-8 text-[#00ff9d] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{Math.round(stats.averageConfidence)}%</div>
          <div className="text-gray-400 text-sm">Confianza</div>
        </div>
        <div className="card text-center">
          <Zap className="w-8 h-8 text-[#8b5cf6] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{Object.keys(stats.byPlatform).length}</div>
          <div className="text-gray-400 text-sm">Plataformas</div>
        </div>
      </motion.div>

      {/* Controles de búsqueda y filtros */}
      <motion.div
        className="card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar tendencias, hashtags, categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-primary pl-10"
            />
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-ghost flex items-center gap-2 ${showFilters ? 'bg-[#007bff]/20 text-[#007bff]' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </motion.button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-primary text-sm w-32"
            >
              <option value="growth">Crecimiento</option>
              <option value="confidence">Confianza</option>
              <option value="recent">Recientes</option>
            </select>

            <div className="flex bg-[#1f1f1f] rounded-lg p-1">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#007bff] text-white' : 'text-gray-400'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#007bff] text-white' : 'text-gray-400'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Panel de filtros */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mt-6 pt-6 border-t border-gray-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Plataforma</label>
                  <select
                    value={filters.platform}
                    onChange={(e) => updateFilters({ platform: e.target.value })}
                    className="input-primary text-sm"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>
                        {platform === 'all' ? 'Todas' : platform}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilters({ category: e.target.value })}
                    className="input-primary text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Todas' : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confianza mínima: {filters.confidence}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.confidence}
                    onChange={(e) => updateFilters({ confidence: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-end">
                  <motion.button
                    onClick={resetFilters}
                    className="btn-secondary text-sm w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Limpiar filtros
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Resultados */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse-glow">
            <div className="w-12 h-12 border-4 border-[#007bff] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredTrends.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No se encontraron tendencias</h3>
              <p className="text-gray-400">Intenta ajustar los filtros o buscar otros términos</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {filteredTrends.length} tendencia{filteredTrends.length !== 1 ? 's' : ''} encontrada{filteredTrends.length !== 1 ? 's' : ''}
                </h2>
                
                {searchQuery && (
                  <motion.button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="text-gray-400 hover:text-white text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    Limpiar búsqueda
                  </motion.button>
                )}
              </div>

              <div className={viewMode === 'grid' ? 
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
                'space-y-4'
              }>
                {filteredTrends.map((trend, index) => (
                  <TrendCard key={trend.id} trend={trend} index={index} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedExploreTrends;
