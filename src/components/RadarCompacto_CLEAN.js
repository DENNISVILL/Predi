import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Activity, Globe, Zap, Users, Eye, Filter, Search, SortDesc, X, ChevronDown, Bell, BellRing, Volume2, VolumeX, AlertTriangle, CheckCircle, Info, Settings, Radar, Wifi, Database, MapPin, Hash, Music, Video, Heart, MessageCircle, Share, Play } from 'lucide-react';

const RadarCompacto = ({ onTrendSelect, selectedTrend, setSelectedTrend }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanningPlatform, setScanningPlatform] = useState('TikTok');
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedTrends, setDetectedTrends] = useState([]);
  const [realTimeData, setRealTimeData] = useState({});

  // Estados para filtros de análisis
  const [analysisFilters, setAnalysisFilters] = useState({
    platform: 'todas',
    country: 'todas',
    contentType: 'todos',
    viralityLevel: 'todos',
    timeframe: '24h'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMetric, setSortMetric] = useState('growth');
  
  // Estados para notificaciones
  const [notifications, setNotifications] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    enabled: true,
    soundEnabled: true,
    growthThreshold: 90,
    viewsThreshold: 3.0,
    engagementThreshold: 85
  });

  // 📱 PLATAFORMAS DE REDES SOCIALES
  const socialPlatforms = {
    tiktok: { 
      name: 'TikTok', 
      color: '#ff0050', 
      icon: Video,
      description: 'Videos cortos, música viral, bailes, challenges',
      metrics: ['views', 'likes', 'shares', 'comments', 'hashtag_uses']
    },
    instagram: { 
      name: 'Instagram', 
      color: '#E4405F', 
      icon: Heart,
      description: 'Fotos, stories, reels, IGTV, shopping',
      metrics: ['likes', 'comments', 'saves', 'shares', 'reach']
    },
    facebook: { 
      name: 'Facebook', 
      color: '#1877F2', 
      icon: Users,
      description: 'Posts, videos, grupos, eventos, marketplace',
      metrics: ['reactions', 'comments', 'shares', 'clicks', 'reach']
    }
  };

  // 🌍 PAÍSES Y REGIONES DE ANÁLISIS
  const analysisCountries = {
    ecuador: { 
      name: 'Ecuador', 
      flag: '🇪🇨', 
      color: '#FFD700',
      timezone: 'America/Guayaquil',
      population: '17.6M',
      internetPenetration: '79%'
    },
    colombia: { 
      name: 'Colombia', 
      flag: '🇨🇴', 
      color: '#FFCD00',
      timezone: 'America/Bogota',
      population: '51.2M',
      internetPenetration: '70%'
    },
    mexico: { 
      name: 'México', 
      flag: '🇲🇽', 
      color: '#006847',
      timezone: 'America/Mexico_City',
      population: '128.9M',
      internetPenetration: '72%'
    },
    peru: { 
      name: 'Perú', 
      flag: '🇵🇪', 
      color: '#D91023',
      timezone: 'America/Lima',
      population: '33.0M',
      internetPenetration: '66%'
    }
  };

  // 🎯 TIPOS DE CONTENIDO VIRAL
  const contentTypes = {
    hashtags: { name: 'Hashtags', icon: Hash, color: '#1DA1F2', description: 'Etiquetas trending' },
    audio: { name: 'Audio/Música', icon: Music, color: '#1DB954', description: 'Sonidos virales' },
    videos: { name: 'Videos', icon: Video, color: '#FF0000', description: 'Contenido audiovisual' },
    challenges: { name: 'Challenges', icon: Zap, color: '#FF6B35', description: 'Retos y desafíos' }
  };

  // Generar datos de análisis simulados
  const generateSocialMediaData = () => {
    const platforms = ['tiktok', 'instagram', 'facebook'];
    const countries = ['ecuador', 'colombia', 'mexico', 'peru'];
    const contentTypes = ['hashtags', 'audio', 'videos', 'challenges'];
    
    const trends = [];
    let id = 1;

    platforms.forEach(platform => {
      countries.forEach(country => {
        contentTypes.forEach(contentType => {
          for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            const growth = Math.floor(Math.random() * 500) + 50;
            const mentions = Math.floor(Math.random() * 5000000) + 100000;
            const engagement = Math.floor(Math.random() * 30) + 60;
            
            trends.push({
              id: id++,
              platform,
              country,
              contentType,
              hashtag: generateHashtag(contentType, country),
              mentions,
              growth,
              engagement,
              velocity: Math.floor(Math.random() * 1000) + 100,
              viralityScore: Math.floor(Math.random() * 100),
              detectedAt: new Date(Date.now() - Math.random() * 86400000),
              sentiment: Math.random() > 0.3 ? 'positive' : 'neutral'
            });
          }
        });
      });
    });

    return trends.sort((a, b) => b.growth - a.growth);
  };

  const generateHashtag = (contentType, country) => {
    const hashtags = {
      hashtags: {
        ecuador: ['#EcuadorViral', '#QuitoTrend', '#GuayaquilModa'],
        colombia: ['#ColombiaViral', '#BogotaTrend', '#MedellinStyle'],
        mexico: ['#MexicoViral', '#CDMXTrend', '#MexicanStyle'],
        peru: ['#PeruViral', '#LimaTrend', '#MachuPicchu']
      },
      audio: {
        ecuador: ['Cupid Ecuador Remix', 'Salsa Ecuatoriana'],
        colombia: ['Vallenato Viral', 'Reggaeton Colombiano'],
        mexico: ['Regional Mexicano', 'Banda Viral'],
        peru: ['Cumbia Peruana', 'Salsa Criolla']
      },
      videos: {
        ecuador: ['Baile Ecuatoriano', 'Comida Típica'],
        colombia: ['Baile Colombiano', 'Arepa Challenge'],
        mexico: ['Baile Mexicano', 'Taco Challenge'],
        peru: ['Marinera Viral', 'Ceviche Challenge']
      },
      challenges: {
        ecuador: ['#EcuadorChallenge', '#QuitoChallenge'],
        colombia: ['#ColombiaChallenge', '#CafeChallenge'],
        mexico: ['#MexicoChallenge', '#TequilaChallenge'],
        peru: ['#PeruChallenge', '#LlamaChallenge']
      }
    };
    
    const options = hashtags[contentType][country] || ['#TrendingNow'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const allDetectedTrends = generateSocialMediaData();

  // Función de filtrado
  const getFilteredAnalysis = useCallback(() => {
    let filtered = [...allDetectedTrends];

    if (searchQuery) {
      filtered = filtered.filter(trend => 
        trend.hashtag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        analysisCountries[trend.country]?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (analysisFilters.platform !== 'todas') {
      filtered = filtered.filter(trend => trend.platform === analysisFilters.platform);
    }

    if (analysisFilters.country !== 'todas') {
      filtered = filtered.filter(trend => trend.country === analysisFilters.country);
    }

    if (analysisFilters.contentType !== 'todos') {
      filtered = filtered.filter(trend => trend.contentType === analysisFilters.contentType);
    }

    if (analysisFilters.viralityLevel !== 'todos') {
      switch (analysisFilters.viralityLevel) {
        case 'emergente':
          filtered = filtered.filter(trend => trend.growth >= 100 && trend.growth < 200);
          break;
        case 'viral':
          filtered = filtered.filter(trend => trend.growth >= 200 && trend.growth < 400);
          break;
        case 'top':
          filtered = filtered.filter(trend => trend.growth >= 400);
          break;
      }
    }

    filtered.sort((a, b) => {
      switch (sortMetric) {
        case 'growth':
          return b.growth - a.growth;
        case 'mentions':
          return b.mentions - a.mentions;
        case 'engagement':
          return b.engagement - a.engagement;
        case 'velocity':
          return b.velocity - a.velocity;
        default:
          return b.growth - a.growth;
      }
    });

    return filtered;
  }, [searchQuery, analysisFilters, sortMetric, allDetectedTrends, analysisCountries]);

  const filteredAnalysis = useMemo(() => getFilteredAnalysis(), [getFilteredAnalysis]);
  
  const radarMetrics = {
    totalDetected: filteredAnalysis.length,
    avgGrowth: filteredAnalysis.length > 0 ? Math.round(filteredAnalysis.reduce((acc, trend) => acc + trend.growth, 0) / filteredAnalysis.length) : 0,
    totalMentions: filteredAnalysis.length > 0 ? (filteredAnalysis.reduce((acc, trend) => acc + trend.mentions, 0) / 1000000).toFixed(1) + 'M' : '0M',
    activeCountries: new Set(filteredAnalysis.map(t => t.country)).size,
    scanningSpeed: Math.floor(Math.random() * 1000) + 500 + '/min'
  };

  // Simulación de escaneo
  useEffect(() => {
    if (!isScanning) return;

    const platforms = ['TikTok', 'Instagram', 'Facebook'];
    let currentPlatformIndex = 0;
    let progress = 0;

    const scanInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      
      if (progress >= 100) {
        progress = 0;
        currentPlatformIndex = (currentPlatformIndex + 1) % platforms.length;
        setScanningPlatform(platforms[currentPlatformIndex]);
      }
      
      setScanProgress(Math.min(Math.round(progress), 100));
    }, 200);

    return () => clearInterval(scanInterval);
  }, [isScanning]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 rounded-xl border border-gray-700/50 shadow-2xl"
    >
      {/* HEADER REDISEÑADO */}
      <div className="bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-900/80 p-6 rounded-xl border border-cyan-500/30 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Radar className="w-7 h-7 text-white animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-xl animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Radar Inteligente
              </h2>
              <p className="text-gray-300 text-sm font-medium">Analizador de Redes Sociales • Detección Temprana</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                  <span className="text-xs text-gray-400">
                    {isScanning ? `Escaneando ${scanningPlatform}... ${scanProgress}%` : 'Pausado'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20">
              <div className="text-cyan-400 font-bold text-xl">{radarMetrics.totalDetected}</div>
              <div className="text-gray-400 text-xs font-medium">Detectados</div>
            </div>
            <div className="text-center bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <div className="text-green-400 font-bold text-xl">{radarMetrics.avgGrowth}%</div>
              <div className="text-gray-400 text-xs font-medium">Crecimiento</div>
            </div>
            <div className="text-center bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
              <div className="text-purple-400 font-bold text-xl">{radarMetrics.totalMentions}</div>
              <div className="text-gray-400 text-xs font-medium">Menciones</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: ALERTAS Y OPORTUNIDADES */}
      <div className="bg-gradient-to-r from-red-900/20 via-orange-900/20 to-yellow-900/20 p-4 rounded-xl border border-red-500/30 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Alertas y Oportunidades</h3>
              <p className="text-gray-300 text-sm">Detecciones críticas con acciones recomendadas</p>
            </div>
          </div>
          <button
            onClick={() => setAlertSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
            className={`p-2 rounded-lg transition-colors ${alertSettings.soundEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}
          >
            {alertSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-3">
          {filteredAnalysis.slice(0, 3).map((trend, index) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30 hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    trend.growth >= 400 ? 'bg-red-400 animate-pulse' :
                    trend.growth >= 200 ? 'bg-orange-400 animate-pulse' :
                    'bg-yellow-400 animate-pulse'
                  }`}></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{trend.hashtag}</span>
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                        {socialPlatforms[trend.platform]?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {analysisCountries[trend.country]?.flag} {analysisCountries[trend.country]?.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                      <span className="text-green-400 font-semibold">+{trend.growth}%</span> • 
                      <span className="ml-1">{(trend.mentions / 1000000).toFixed(1)}M menciones</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    trend.growth >= 400 ? 'text-red-400' :
                    trend.growth >= 200 ? 'text-orange-400' :
                    'text-yellow-400'
                  }`}>
                    {trend.growth >= 400 ? '🔴 CRÍTICO' :
                     trend.growth >= 200 ? '🟠 VIRAL' :
                     '🟡 EMERGENTE'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Actuar en {trend.growth >= 400 ? '6h' : trend.growth >= 200 ? '24h' : '48h'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: ANÁLISIS Y ACCIONES */}
      <div className="bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-teal-900/20 p-4 rounded-xl border border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Análisis y Acciones</h3>
              <p className="text-gray-300 text-sm">Filtros avanzados y herramientas</p>
            </div>
          </div>
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isScanning 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {isScanning ? 'Pausar' : 'Iniciar'} Escaneo
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <select
            value={analysisFilters.platform}
            onChange={(e) => setAnalysisFilters({...analysisFilters, platform: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400/50"
          >
            <option value="todas">📱 Todas</option>
            {Object.entries(socialPlatforms).map(([key, platform]) => (
              <option key={key} value={key}>{platform.name}</option>
            ))}
          </select>

          <select
            value={analysisFilters.country}
            onChange={(e) => setAnalysisFilters({...analysisFilters, country: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400/50"
          >
            <option value="todas">🌍 Todos</option>
            {Object.entries(analysisCountries).map(([key, country]) => (
              <option key={key} value={key}>{country.flag} {country.name}</option>
            ))}
          </select>

          <select
            value={analysisFilters.viralityLevel}
            onChange={(e) => setAnalysisFilters({...analysisFilters, viralityLevel: e.target.value})}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400/50"
          >
            <option value="todos">🔥 Todos</option>
            <option value="emergente">🟡 Emergente</option>
            <option value="viral">🟠 Viral</option>
            <option value="top">🔴 Top</option>
          </select>

          <select
            value={sortMetric}
            onChange={(e) => setSortMetric(e.target.value)}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400/50"
          >
            <option value="growth">📈 Crecimiento</option>
            <option value="mentions">💬 Menciones</option>
            <option value="engagement">❤️ Engagement</option>
          </select>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredAnalysis.slice(0, 8).map((trend, index) => (
            <div
              key={trend.id}
              className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/20 hover:border-blue-500/50 transition-colors cursor-pointer"
              onClick={() => onTrendSelect && onTrendSelect(trend)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: socialPlatforms[trend.platform]?.color + '20' }}>
                    {React.createElement(socialPlatforms[trend.platform]?.icon || Video, { 
                      className: "w-3 h-3", 
                      style: { color: socialPlatforms[trend.platform]?.color } 
                    })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{trend.hashtag}</span>
                      <span className="text-xs text-gray-400">
                        {analysisCountries[trend.country]?.flag}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {trend.engagement}% engagement
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">+{trend.growth}%</div>
                  <div className="text-xs text-gray-400">{(trend.mentions / 1000000).toFixed(1)}M</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-600/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {filteredAnalysis.length} tendencias analizadas
            </span>
            <button
              onClick={() => {
                setAnalysisFilters({
                  platform: 'todas',
                  country: 'todas',
                  contentType: 'todos',
                  viralityLevel: 'todos',
                  timeframe: '24h'
                });
                setSearchQuery('');
                setSortMetric('growth');
              }}
              className="text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RadarCompacto;
