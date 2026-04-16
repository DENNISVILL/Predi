import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  Users, 
  Eye, 
  Heart, 
  MessageSquare,
  Share2,
  Play,
  Pause,
  Square,
  CheckCircle,
  XCircle,
  Plus,
  Settings,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Award,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  Copy,
  Edit3,
  Trash2,
  ExternalLink
} from 'lucide-react';

const ABTestingSuite = () => {
  const [activeTab, setActiveTab] = useState('tests'); // tests, create, analytics, insights
  const [selectedTest, setSelectedTest] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tests, setTests] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    platform: 'all',
    niche: 'all'
  });

  // Mock data para tests A/B
  const mockTests = [
    {
      id: 1,
      name: "Hashtags vs Sin Hashtags",
      description: "Comparar rendimiento de posts con y sin hashtags en fitness",
      status: 'running',
      platform: 'instagram',
      niche: 'fitness',
      startDate: new Date(2024, 10, 1),
      endDate: new Date(2024, 10, 15),
      variants: [
        {
          id: 'A',
          name: 'Con Hashtags',
          content: "Rutina matutina que cambió mi vida 💪 #fitness #morning #workout",
          metrics: {
            impressions: 15420,
            likes: 1854,
            comments: 127,
            shares: 89,
            engagement: 13.4,
            reach: 12300
          }
        },
        {
          id: 'B',
          name: 'Sin Hashtags',
          content: "Rutina matutina que cambió mi vida 💪",
          metrics: {
            impressions: 8930,
            likes: 892,
            comments: 67,
            shares: 34,
            engagement: 11.1,
            reach: 7200
          }
        }
      ],
      winner: 'A',
      confidence: 94,
      improvement: 67.2,
      significance: true
    },
    {
      id: 2,
      name: "Horario Publicación",
      description: "Mejor momento para publicar contenido de comida",
      status: 'completed',
      platform: 'tiktok',
      niche: 'food',
      startDate: new Date(2024, 9, 15),
      endDate: new Date(2024, 9, 29),
      variants: [
        {
          id: 'A',
          name: 'Mañana (9AM)',
          content: "Desayuno saludable en 5 minutos 🥗",
          metrics: {
            impressions: 45200,
            likes: 3420,
            comments: 234,
            shares: 156,
            engagement: 8.4,
            reach: 38900
          }
        },
        {
          id: 'B',
          name: 'Tarde (6PM)',
          content: "Desayuno saludable en 5 minutos 🥗",
          metrics: {
            impressions: 67800,
            likes: 5890,
            comments: 445,
            shares: 289,
            engagement: 9.8,
            reach: 54200
          }
        }
      ],
      winner: 'B',
      confidence: 98,
      improvement: 50.0,
      significance: true
    },
    {
      id: 3,
      name: "Formato de Video",
      description: "Vertical vs horizontal para contenido tech",
      status: 'draft',
      platform: 'youtube',
      niche: 'tech',
      startDate: new Date(2024, 10, 10),
      endDate: new Date(2024, 10, 24),
      variants: [
        {
          id: 'A',
          name: 'Video Vertical',
          content: "Review del iPhone 16 Pro",
          metrics: null
        },
        {
          id: 'B',
          name: 'Video Horizontal',
          content: "Review del iPhone 16 Pro",
          metrics: null
        }
      ],
      winner: null,
      confidence: 0,
      improvement: 0,
      significance: false
    }
  ];

  useEffect(() => {
    setTests(mockTests);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-400/20';
      case 'completed': return 'text-blue-400 bg-blue-400/20';
      case 'draft': return 'text-gray-400 bg-gray-400/20';
      case 'paused': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: '📸',
      tiktok: '🎵',
      youtube: '📺',
      facebook: '👥',
      linkedin: '💼'
    };
    return icons[platform] || '🌐';
  };

  const filteredTests = tests.filter(test => {
    return (filters.status === 'all' || test.status === filters.status) &&
           (filters.platform === 'all' || test.platform === filters.platform) &&
           (filters.niche === 'all' || test.niche === filters.niche);
  });

  const calculateMetrics = (variant) => {
    if (!variant.metrics) return null;
    
    const { impressions, likes, comments, shares } = variant.metrics;
    const totalEngagement = likes + comments + shares;
    const engagementRate = ((totalEngagement / impressions) * 100).toFixed(1);
    
    return {
      ...variant.metrics,
      engagementRate: parseFloat(engagementRate),
      totalEngagement
    };
  };

  const tabs = [
    { id: 'tests', name: 'Tests Activos', icon: BarChart3 },
    { id: 'create', name: 'Crear Test', icon: Plus },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'insights', name: 'Insights', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">A/B Testing Suite</h2>
          <p className="text-gray-400">Optimiza tu contenido con tests comparativos</p>
        </div>
        <motion.button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
        >
          <Plus className="w-4 h-4" />
          Nuevo Test A/B
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-800 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tests Tab */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">Todos los estados</option>
                <option value="running">En ejecución</option>
                <option value="completed">Completados</option>
                <option value="draft">Borradores</option>
                <option value="paused">Pausados</option>
              </select>
              <select
                value={filters.platform}
                onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">Todas las plataformas</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
              <select
                value={filters.niche}
                onChange={(e) => setFilters(prev => ({ ...prev, niche: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">Todos los nichos</option>
                <option value="fitness">Fitness</option>
                <option value="food">Food</option>
                <option value="tech">Tech</option>
                <option value="fashion">Fashion</option>
              </select>
            </div>
          </div>

          {/* Lista de Tests */}
          <div className="space-y-4">
            {filteredTests.map(test => (
              <motion.div
                key={test.id}
                className="bg-gray-900/50 rounded-xl p-6 hover:bg-gray-900/70 transition-colors"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">{test.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                      {test.significance && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                          Significativo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-3">{test.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="text-lg">{getPlatformIcon(test.platform)}</span>
                        {test.platform}
                      </span>
                      <span className="capitalize">{test.niche}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {test.startDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Variantes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {test.variants.map(variant => {
                    const metrics = calculateMetrics(variant);
                    const isWinner = test.winner === variant.id;
                    
                    return (
                      <div
                        key={variant.id}
                        className={`p-4 rounded-lg border ${
                          isWinner 
                            ? 'border-green-500 bg-green-500/10' 
                            : 'border-gray-700 bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isWinner ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
                            }`}>
                              {variant.id}
                            </div>
                            <span className="text-white font-medium">{variant.name}</span>
                            {isWinner && <Award className="w-4 h-4 text-green-400" />}
                          </div>
                          {test.confidence > 0 && (
                            <span className="text-xs text-gray-400">
                              {test.confidence}% confianza
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3">{variant.content}</p>
                        
                        {metrics && (
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <div className="text-gray-400">Impresiones</div>
                              <div className="text-white font-semibold">
                                {metrics.impressions.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-400">Engagement</div>
                              <div className="text-white font-semibold">
                                {metrics.engagementRate}%
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-400">Likes</div>
                              <div className="text-white font-semibold">
                                {metrics.likes.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-400">Alcance</div>
                              <div className="text-white font-semibold">
                                {metrics.reach.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Resultados */}
                {test.winner && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">
                        Variante {test.winner} ganó con {test.improvement}% de mejora
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Tests Activos</h3>
              <Play className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {tests.filter(t => t.status === 'running').length}
            </div>
            <p className="text-gray-400 text-sm">En ejecución ahora</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Tests Completados</h3>
              <CheckCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {tests.filter(t => t.status === 'completed').length}
            </div>
            <p className="text-gray-400 text-sm">Este mes</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Mejora Promedio</h3>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {Math.round(tests.filter(t => t.improvement > 0).reduce((acc, t) => acc + t.improvement, 0) / 
                tests.filter(t => t.improvement > 0).length || 0)}%
            </div>
            <p className="text-gray-400 text-sm">En tests ganadores</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Confianza Promedio</h3>
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {Math.round(tests.filter(t => t.confidence > 0).reduce((acc, t) => acc + t.confidence, 0) / 
                tests.filter(t => t.confidence > 0).length || 0)}%
            </div>
            <p className="text-gray-400 text-sm">Nivel de significancia</p>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Insights Clave</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="text-green-400 font-medium">Hashtags aumentan engagement</h4>
                  <p className="text-gray-300 text-sm">
                    Los posts con hashtags obtienen 67% más engagement en fitness
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-medium">Mejor horario: 6PM</h4>
                  <p className="text-gray-300 text-sm">
                    Contenido de comida funciona mejor en horario de cena
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-medium">Formato vertical gana</h4>
                  <p className="text-gray-300 text-sm">
                    Videos verticales tienen 40% más views en móvil
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ABTestingSuite;
