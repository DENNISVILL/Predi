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
  BookmarkCheck,
  Grid3X3,
  List,
  SlidersHorizontal,
  MapPin,
  Smartphone,
  Play,
  Download,
  Activity,
  Target,
  Flame,
  Sparkles,
  Brain,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  PieChart,
  LineChart,
  BarChart2,
  Map,
  Layers,
  Radar,
  Gauge,
  GitCompare
} from 'lucide-react';
import useStore from '../store/useStore';
import { useTrends } from '../hooks/useTrends';
import { useNotifications } from '../hooks/useNotifications';

const ExploreTrendsModule = () => {
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
  const [sortBy, setSortBy] = useState('growth'); // growth, confidence, recent, viral
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // 🔄 Estados para Sistema de Comparación Avanzada
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [showComparisonPanel, setShowComparisonPanel] = useState(false);
  const [comparisonView, setComparisonView] = useState('side-by-side'); // 'side-by-side', 'overlay', 'metrics'

  // Datos simulados más realistas
  const mockTrends = [
    {
      id: 1,
      name: '#SustainableTech2025',
      description: 'Tecnología sostenible que está revolucionando la industria con soluciones eco-friendly',
      platform: 'TikTok',
      country: '🇲🇽',
      countryName: 'México',
      category: 'Tecnología',
      growth: '+245%',
      confidence: 94,
      views: '2.4M',
      engagement: '89%',
      createdAt: '2024-11-04T08:00:00Z',
      isFollowing: false,
      tags: ['#tech', '#sustainability', '#green', '#innovation'],
      thumbnail: '🌱',
      viralScore: 95,
      predictedPeak: '3 días'
    },
    {
      id: 2,
      name: '#VirtualFashionWeek',
      description: 'Semana de la moda virtual con diseñadores digitales y NFTs de ropa exclusiva',
      platform: 'Instagram',
      country: '🇺🇸',
      countryName: 'Estados Unidos',
      category: 'Moda',
      growth: '+189%',
      confidence: 87,
      views: '1.8M',
      engagement: '76%',
      createdAt: '2024-11-04T06:30:00Z',
      isFollowing: true,
      tags: ['#fashion', '#virtual', '#nft', '#digital'],
      thumbnail: '👗',
      viralScore: 88,
      predictedPeak: '5 días'
    },
    {
      id: 3,
      name: '#AIMusic2025',
      description: 'Música generada por IA que está creando nuevos géneros y colaboraciones únicas',
      platform: 'YouTube',
      country: '🇪🇸',
      countryName: 'España',
      category: 'Música',
      growth: '+156%',
      confidence: 91,
      views: '3.1M',
      engagement: '92%',
      createdAt: '2024-11-04T05:15:00Z',
      isFollowing: false,
      tags: ['#music', '#ai', '#generation', '#creativity'],
      thumbnail: '🎵',
      viralScore: 92,
      predictedPeak: '2 días'
    },
    {
      id: 4,
      name: '#CryptoGaming',
      description: 'Juegos blockchain con economías reales donde los jugadores ganan criptomonedas',
      platform: 'Twitter',
      country: '🇦🇷',
      countryName: 'Argentina',
      category: 'Gaming',
      growth: '+134%',
      confidence: 83,
      views: '956K',
      engagement: '71%',
      createdAt: '2024-11-04T04:45:00Z',
      isFollowing: true,
      tags: ['#gaming', '#crypto', '#blockchain', '#nft'],
      thumbnail: '🎮',
      viralScore: 85,
      predictedPeak: '4 días'
    },
    {
      id: 5,
      name: '#HealthTechRevolution',
      description: 'Aplicaciones de salud con IA que diagnostican y previenen enfermedades',
      platform: 'LinkedIn',
      country: '🇨🇴',
      countryName: 'Colombia',
      category: 'Salud',
      growth: '+198%',
      confidence: 96,
      views: '1.2M',
      engagement: '88%',
      createdAt: '2024-11-04T03:20:00Z',
      isFollowing: false,
      tags: ['#health', '#ai', '#medical', '#prevention'],
      thumbnail: '🏥',
      viralScore: 94,
      predictedPeak: '6 días'
    },
    {
      id: 6,
      name: '#EcoTravel2025',
      description: 'Turismo sostenible con experiencias que no dañan el medio ambiente',
      platform: 'TikTok',
      country: '🇵🇪',
      countryName: 'Perú',
      category: 'Viajes',
      growth: '+167%',
      confidence: 79,
      views: '2.7M',
      engagement: '85%',
      createdAt: '2024-11-04T02:10:00Z',
      isFollowing: false,
      tags: ['#travel', '#eco', '#sustainable', '#nature'],
      thumbnail: '✈️',
      viralScore: 81,
      predictedPeak: '7 días'
    }
  ];

  // Combinar tendencias reales y simuladas
  const allTrends = useMemo(() => {
    return [...trends, ...trendingNow, ...mockTrends];
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

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(trend => 
        trend.category?.toLowerCase() === selectedCategory.toLowerCase()
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
        case 'viral':
          return (b.viralScore || 0) - (a.viralScore || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allTrends, searchResults, filters, selectedCategory, sortBy]);

  // Buscar tendencias
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = allTrends.filter(trend =>
      trend.name.toLowerCase().includes(query.toLowerCase()) ||
      trend.description.toLowerCase().includes(query.toLowerCase()) ||
      trend.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
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

  // Plataformas y categorías disponibles
  const platforms = ['all', 'TikTok', 'Instagram', 'Twitter', 'YouTube', 'LinkedIn'];
  const categories = ['all', 'Tecnología', 'Moda', 'Música', 'Gaming', 'Salud', 'Viajes', 'Entretenimiento'];

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

  // 🔄 FUNCIONES DEL SISTEMA DE COMPARACIÓN
  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (comparisonMode) {
      setSelectedForComparison([]);
      setShowComparisonPanel(false);
    }
  };

  const addToComparison = (trend) => {
    if (selectedForComparison.length >= 4) {
      showToast('Máximo 4 tendencias para comparar', 'warning');
      return;
    }
    
    if (selectedForComparison.find(t => t.id === trend.id)) {
      showToast('Esta tendencia ya está seleccionada', 'warning');
      return;
    }

    setSelectedForComparison([...selectedForComparison, trend]);
    showToast(`${trend.name} añadida a comparación`, 'success');
  };

  const removeFromComparison = (trendId) => {
    setSelectedForComparison(selectedForComparison.filter(t => t.id !== trendId));
  };

  const startComparison = () => {
    if (selectedForComparison.length < 2) {
      showToast('Selecciona al menos 2 tendencias para comparar', 'warning');
      return;
    }
    setShowComparisonPanel(true);
  };

  const clearComparison = () => {
    setSelectedForComparison([]);
    setShowComparisonPanel(false);
  };

  // Componente de tarjeta de tendencia
  const TrendCard = ({ trend, index }) => {
    const isSaved = savedTrends.some(t => t.id === trend.id);
    
    return (
      <motion.div
        className={`${viewMode === 'grid' ? 'card-hover cursor-pointer' : 'flex items-center gap-4 p-4 bg-[#1f1f1f] rounded-xl hover:bg-[#2a2a2a] transition-all cursor-pointer border border-gray-700 hover:border-gray-600'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        onClick={() => navigate(`/trend/${trend.id}`)}
        whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1.01 }}
      >
        {viewMode === 'grid' ? (
          // Vista de grid
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{trend.thumbnail || trend.country}</span>
                <div className="text-xs px-2 py-1 bg-[#007bff]/20 text-[#007bff] rounded-full">
                  {trend.platform}
                </div>
                {trend.viralScore >= 90 && (
                  <div className="text-xs px-2 py-1 bg-gradient-to-r from-[#ff6b6b] to-[#feca57] text-white rounded-full font-bold">
                    🔥 VIRAL
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Botón de Comparación */}
                {comparisonMode && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToComparison(trend);
                    }}
                    className={`p-1 rounded-lg transition-colors ${
                      selectedForComparison.find(t => t.id === trend.id)
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'hover:bg-white/10 text-gray-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <GitCompare className="w-4 h-4" />
                  </motion.button>
                )}
                
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

            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <Eye className="w-3 h-3" />
                {trend.views}
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Users className="w-3 h-3" />
                {trend.engagement}
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin className="w-3 h-3" />
                {trend.countryName}
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3 h-3" />
                Pico en {trend.predictedPeak}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                {trend.category}
              </div>
              <div className="flex gap-1">
                {trend.tags?.slice(0, 2).map((tag, i) => (
                  <span key={`${trend.id}-tag-${i}`} className="text-xs px-2 py-1 bg-[#007bff]/10 text-[#007bff] rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Vista de lista
          <>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{trend.thumbnail || trend.country}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">{trend.name}</h3>
                  {trend.viralScore >= 90 && (
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#ff6b6b] to-[#feca57] text-white rounded-full font-bold">
                      🔥
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{trend.platform} • {trend.category} • {trend.countryName}</p>
              </div>
            </div>

            <div className="flex-1 px-4">
              <p className="text-gray-400 text-sm line-clamp-1 mb-1">{trend.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{trend.views} vistas</span>
                <span>{trend.engagement} engagement</span>
                <span>Pico en {trend.predictedPeak}</span>
              </div>
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
          Descubre las tendencias que están creciendo ahora • {filteredTrends.length} tendencias activas
        </p>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-[#007bff] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{allTrends.length}</div>
          <div className="text-gray-400 text-sm">Total</div>
        </div>
        <div className="card text-center">
          <Zap className="w-8 h-8 text-[#00ff9d] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{allTrends.filter(t => t.viralScore >= 90).length}</div>
          <div className="text-gray-400 text-sm">Virales</div>
        </div>
        <div className="card text-center">
          <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{allTrends.filter(t => t.isFollowing).length}</div>
          <div className="text-gray-400 text-sm">Siguiendo</div>
        </div>
        <div className="card text-center">
          <Bookmark className="w-8 h-8 text-[#8b5cf6] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{savedTrends.length}</div>
          <div className="text-gray-400 text-sm">Guardadas</div>
        </div>
        <div className="card text-center">
          <Globe className="w-8 h-8 text-[#f59e0b] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{new Set(allTrends.map(t => t.country)).size}</div>
          <div className="text-gray-400 text-sm">Países</div>
        </div>
      </motion.div>

      {/* 🚀 DASHBOARD DE MÉTRICAS AVANZADAS */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {/* Panel de Análisis en Tiempo Real */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-bold text-lg">Análisis en Tiempo Real</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">En vivo</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {allTrends.filter(t => parseFloat(t.growth.replace('%', '').replace('+', '')) > 100).length}
              </div>
              <div className="text-xs text-gray-400">Crecimiento +100%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(allTrends.reduce((acc, t) => acc + t.confidence, 0) / allTrends.length)}%
              </div>
              <div className="text-xs text-gray-400">Confianza Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {allTrends.filter(t => t.viralScore >= 85).length}
              </div>
              <div className="text-xs text-gray-400">Tendencias Virales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {allTrends.filter(t => new Date(t.createdAt) > new Date(Date.now() - 24*60*60*1000)).length}
              </div>
              <div className="text-xs text-gray-400">Últimas 24h</div>
            </div>
          </div>

          {/* Mini gráfico de tendencias */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">Actividad por Plataforma</span>
              <LineChart className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2">
              {['TikTok', 'Instagram', 'YouTube', 'Twitter'].map(platform => {
                const count = allTrends.filter(t => t.platform === platform).length;
                const percentage = (count / allTrends.length) * 100;
                return (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{platform}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel de Alertas Inteligentes */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <h3 className="text-white font-bold text-lg">IA Predictiva</h3>
          </div>
          
          <div className="space-y-4">
            {/* Alerta de tendencia emergente */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-3 rounded-lg border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm font-bold">EMERGENTE</span>
              </div>
              <p className="text-white text-sm font-medium mb-1">
                {allTrends.find(t => t.viralScore >= 90)?.name || '#SustainableTech2025'}
              </p>
              <p className="text-gray-400 text-xs">
                Crecimiento explosivo detectado (+245% en 6h)
              </p>
            </div>

            {/* Predicción de pico */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-3 rounded-lg border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-bold">PREDICCIÓN</span>
              </div>
              <p className="text-white text-sm font-medium mb-1">Pico esperado</p>
              <p className="text-gray-400 text-xs">
                3 tendencias alcanzarán su pico en las próximas 48h
              </p>
            </div>

            {/* Oportunidad de mercado */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-bold">OPORTUNIDAD</span>
              </div>
              <p className="text-white text-sm font-medium mb-1">Nicho desatendido</p>
              <p className="text-gray-400 text-xs">
                {allTrends.find(t => t.category === 'Tecnología')?.category || 'HealthTech'} con baja competencia
              </p>
            </div>
          </div>

          {/* Botón de configurar alertas */}
          <motion.button
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AlertTriangle className="w-4 h-4" />
            Configurar Alertas
          </motion.button>
        </div>
      </motion.div>

      {/* Controles de búsqueda y filtros */}
      <motion.div
        className="card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-3">
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
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-ghost flex items-center gap-2 ${showFilters ? 'bg-[#007bff]/20 text-[#007bff]' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
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
              <option value="viral">Viral Score</option>
            </select>

            {/* Botón de Modo Comparación */}
            <motion.button
              onClick={toggleComparisonMode}
              className={`btn-ghost flex items-center gap-2 ${comparisonMode ? 'bg-purple-500/20 text-purple-400' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GitCompare className="w-4 h-4" />
              Comparar
              {selectedForComparison.length > 0 && (
                <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {selectedForComparison.length}
                </span>
              )}
            </motion.button>

            <div className="flex bg-[#1f1f1f] rounded-lg p-1">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#007bff] text-white' : 'text-gray-400'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid3X3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#007bff] text-white' : 'text-gray-400'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* 🎯 PANEL DE FILTROS AVANZADOS */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mt-6 pt-6 border-t border-gray-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filtros Rápidos */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Filtros Rápidos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '🔥 Virales', filter: () => allTrends.filter(t => t.viralScore >= 90) },
                    { label: '📈 Alto Crecimiento', filter: () => allTrends.filter(t => parseFloat(t.growth.replace('%', '').replace('+', '')) > 150) },
                    { label: '🆕 Últimas 24h', filter: () => allTrends.filter(t => new Date(t.createdAt) > new Date(Date.now() - 24*60*60*1000)) },
                    { label: '⭐ Alta Confianza', filter: () => allTrends.filter(t => t.confidence >= 90) },
                    { label: '💾 Guardadas', filter: () => allTrends.filter(t => savedTrends.some(s => s.id === t.id)) }
                  ].map(quickFilter => (
                    <motion.button
                      key={quickFilter.label}
                      className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-blue-500/30 rounded-full text-sm text-white transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Aquí implementarías la lógica del filtro rápido
                        console.log('Filtro rápido:', quickFilter.label);
                      }}
                    >
                      {quickFilter.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Filtros Detallados */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Filtro por Rango de Crecimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rango de Crecimiento</label>
                  <select className="input-primary text-sm">
                    <option value="all">Todos los rangos</option>
                    <option value="low">0% - 50%</option>
                    <option value="medium">50% - 100%</option>
                    <option value="high">100% - 200%</option>
                    <option value="explosive">200%+</option>
                  </select>
                </div>

                {/* Filtro por País/Región */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">País/Región</label>
                  <select className="input-primary text-sm">
                    <option value="all">Todos los países</option>
                    <option value="mx">🇲🇽 México</option>
                    <option value="us">🇺🇸 Estados Unidos</option>
                    <option value="es">🇪🇸 España</option>
                    <option value="ar">🇦🇷 Argentina</option>
                    <option value="co">🇨🇴 Colombia</option>
                    <option value="br">🇧🇷 Brasil</option>
                  </select>
                </div>

                {/* Filtro por Período de Tiempo */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
                  <select className="input-primary text-sm">
                    <option value="1h">Última hora</option>
                    <option value="6h">Últimas 6 horas</option>
                    <option value="24h">Últimas 24 horas</option>
                    <option value="7d">Última semana</option>
                    <option value="30d">Último mes</option>
                  </select>
                </div>

                {/* Filtro por Score Viral */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Score Viral Mínimo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-white text-sm w-8">50</span>
                  </div>
                </div>

                {/* Filtro por Engagement */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Engagement Mínimo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="60"
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-white text-sm w-8">60%</span>
                  </div>
                </div>

                {/* Filtros Avanzados */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filtros Avanzados</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-blue-500" />
                      Solo seguidas
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-blue-500" />
                      Con predicción
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-blue-500" />
                      Emergentes
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-blue-500" />
                      En declive
                    </label>
                  </div>
                </div>

                <div className="flex items-end">
                  <motion.button
                    onClick={() => {
                      resetFilters();
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
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
                
                <div className="flex items-center gap-4">
                  {/* Botón de Iniciar Comparación */}
                  {comparisonMode && selectedForComparison.length >= 2 && (
                    <motion.button
                      onClick={startComparison}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <GitCompare className="w-4 h-4" />
                      Comparar ({selectedForComparison.length})
                    </motion.button>
                  )}
                  
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
                  
                  <motion.button
                    className="btn-ghost flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </motion.button>
                </div>
              </div>

              <div className={viewMode === 'grid' ? 
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 
                'space-y-3'
              }>
                {filteredTrends.map((trend, index) => (
                  <TrendCard key={trend.id} trend={trend} index={index} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* 🔄 PANEL DE COMPARACIÓN AVANZADA */}
      <AnimatePresence>
        {showComparisonPanel && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComparisonPanel(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-600/50 max-w-7xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del Panel */}
              <div className="flex items-center justify-between p-6 border-b border-gray-600/50">
                <div className="flex items-center gap-3">
                  <GitCompare className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Comparación de Tendencias</h2>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-sm">
                    {selectedForComparison.length} tendencias
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Selector de Vista de Comparación */}
                  <div className="flex bg-gray-700/50 rounded-lg p-1">
                    {[
                      { key: 'side-by-side', label: 'Lado a Lado', icon: BarChart2 },
                      { key: 'overlay', label: 'Superpuesta', icon: Layers },
                      { key: 'metrics', label: 'Métricas', icon: PieChart }
                    ].map(view => (
                      <motion.button
                        key={view.key}
                        onClick={() => setComparisonView(view.key)}
                        className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                          comparisonView === view.key 
                            ? 'bg-purple-500 text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <view.icon className="w-3 h-3" />
                        {view.label}
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button
                    onClick={() => setShowComparisonPanel(false)}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Contenido del Panel */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {comparisonView === 'side-by-side' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {selectedForComparison.map((trend, index) => (
                      <motion.div
                        key={trend.id}
                        className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 p-4 rounded-xl border border-gray-600/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Header de la tendencia */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{trend.thumbnail || trend.country}</span>
                            <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                              {trend.platform}
                            </div>
                          </div>
                          <motion.button
                            onClick={() => removeFromComparison(trend.id)}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Título y descripción */}
                        <h3 className="text-white font-bold text-lg mb-2">{trend.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{trend.description}</p>

                        {/* Métricas principales */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Crecimiento</span>
                            <span className="text-green-400 font-bold">{trend.growth}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Confianza</span>
                            <span className="text-blue-400 font-bold">{trend.confidence}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Vistas</span>
                            <span className="text-purple-400 font-bold">{trend.views}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Engagement</span>
                            <span className="text-orange-400 font-bold">{trend.engagement}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Score Viral</span>
                            <span className="text-red-400 font-bold">{trend.viralScore}/100</span>
                          </div>
                        </div>

                        {/* Barra de progreso del crecimiento */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-400 text-xs">Progreso</span>
                            <span className="text-white text-xs">{trend.growth}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(parseFloat(trend.growth.replace('%', '').replace('+', '')), 100)}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {comparisonView === 'metrics' && (
                  <div className="space-y-6">
                    {/* Tabla comparativa */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-600/30">
                      <h3 className="text-white font-bold text-lg mb-4">Comparación de Métricas</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-600/50">
                              <th className="text-left text-gray-400 py-2">Tendencia</th>
                              <th className="text-center text-gray-400 py-2">Crecimiento</th>
                              <th className="text-center text-gray-400 py-2">Confianza</th>
                              <th className="text-center text-gray-400 py-2">Vistas</th>
                              <th className="text-center text-gray-400 py-2">Engagement</th>
                              <th className="text-center text-gray-400 py-2">Score Viral</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedForComparison.map((trend, index) => (
                              <motion.tr
                                key={trend.id}
                                className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <td className="py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{trend.thumbnail || trend.country}</span>
                                    <span className="text-white font-medium">{trend.name}</span>
                                  </div>
                                </td>
                                <td className="text-center text-green-400 font-bold">{trend.growth}</td>
                                <td className="text-center text-blue-400 font-bold">{trend.confidence}%</td>
                                <td className="text-center text-purple-400 font-bold">{trend.views}</td>
                                <td className="text-center text-orange-400 font-bold">{trend.engagement}</td>
                                <td className="text-center text-red-400 font-bold">{trend.viralScore}/100</td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Análisis comparativo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-4 rounded-xl border border-green-500/30">
                        <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Mayor Crecimiento
                        </h4>
                        {(() => {
                          const maxGrowth = selectedForComparison.reduce((max, trend) => 
                            parseFloat(trend.growth.replace('%', '').replace('+', '')) > parseFloat(max.growth.replace('%', '').replace('+', '')) ? trend : max
                          );
                          return (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{maxGrowth.thumbnail || maxGrowth.country}</span>
                              <span className="text-white font-medium">{maxGrowth.name}</span>
                              <span className="text-green-400 font-bold">{maxGrowth.growth}</span>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-4 rounded-xl border border-blue-500/30">
                        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Mayor Confianza
                        </h4>
                        {(() => {
                          const maxConfidence = selectedForComparison.reduce((max, trend) => 
                            trend.confidence > max.confidence ? trend : max
                          );
                          return (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{maxConfidence.thumbnail || maxConfidence.country}</span>
                              <span className="text-white font-medium">{maxConfidence.name}</span>
                              <span className="text-blue-400 font-bold">{maxConfidence.confidence}%</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer con acciones */}
              <div className="flex items-center justify-between p-6 border-t border-gray-600/50">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">
                    {selectedForComparison.length} de 4 tendencias seleccionadas
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={clearComparison}
                    className="btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Limpiar Todo
                  </motion.button>
                  
                  <motion.button
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
                    Exportar Comparación
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreTrendsModule;
