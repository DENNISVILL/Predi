import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCountry } from './CountrySelector';
import { TrendingUp, RefreshCw, TrendingDown, BarChart3, Activity, Globe, Zap, Users, Eye, Filter, Search, SortDesc, X, ChevronDown, Bell, BellRing, Volume2, VolumeX, AlertTriangle, CheckCircle, Info, Settings, Radar, Wifi, Database, MapPin, Hash, Music, Video, Heart, MessageCircle, Share, Play, Download, Calendar, LineChart as LineChartIcon } from 'lucide-react';
import { getHashtagMixRecommendations } from '../services/geminiService';

// New components
import { GrowthChart, PlatformComparisonChart, EngagementAreaChart, GeographicPieChart } from './radar/TrendChart';
import NotificationCenter from './radar/NotificationCenter';
import ExportModal from './radar/ExportModal';
import ViralityScoreBadge, { ViralityScoreCompact } from './radar/ViralityScoreBadge';

// Utilities
import { calculateViralityScore, generateHistoricalData } from '../utils/viralityPredictor';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

// Helper para limpiar el markdown devuelto por la IA
const formatIaMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
};

const RadarCompacto = ({ onTrendSelect, selectedTrend, setSelectedTrend, onSendHashtagMix, scheduledReminders = [] }) => {
  const { countryData, selectedCountry } = useCountry();
  const [isScanning, setIsScanning] = useState(true);
  const [scanningPlatform, setScanningPlatform] = useState('TikTok');
  const [scanProgress, setScanProgress] = useState(0);

  // Estados API Real
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [trendsError, setTrendsError] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheExpiresIn, setCacheExpiresIn] = useState(null);
  const [nextRefreshIn, setNextRefreshIn] = useState(60); // minutos

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

  // Estados para datos de tendencias
  const [stableTrends, setStableTrends] = useState([]);
  const [lastScanTime, setLastScanTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Filtro por Nicho/Industria
  const [selectedNiche, setSelectedNiche] = useState('all');
  const businessNiches = [
    { id: 'all', label: 'Todos' },
    { id: 'tecnologia', label: 'Tecnología/Soft' },
    { id: 'salud', label: 'Salud/Médico' },
    { id: 'restaurantes', label: 'Restaurantes' },
    { id: 'gym', label: 'Fitness/Gym' },
    { id: 'emprendimiento', label: 'Negocios' },
    { id: 'belleza', label: 'Belleza/Moda' },
    { id: 'real_estate', label: 'Bienes Raíces' },
    { id: 'educacion', label: 'Educación' },
    { id: 'viajes', label: 'Turismo' }
  ];

  // Función para obtener tendencias reales desde el backend
  const fetchRealTrends = useCallback(async (forceRefresh = false) => {
    const country = selectedCountry || 'MX';
    const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    setIsLoadingTrends(true);
    setTrendsError(null);

    // Animar el escaneo visual
    const platforms = ['TikTok', 'Instagram', 'Facebook'];
    let pIdx = 0;
    const scanAnim = setInterval(() => {
      pIdx = (pIdx + 1) % platforms.length;
      setScanningPlatform(platforms[pIdx]);
      setScanProgress(prev => prev >= 90 ? 10 : prev + Math.random() * 20);
    }, 400);

    try {
      const url = `${BASE_URL}/api/trends/radar?country=${country}&platform=all&niche=${selectedNiche}${forceRefresh ? '&refresh=true' : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (data.trends && Array.isArray(data.trends)) {
        // Mapear al formato interno del componente
        const mapped = data.trends.map((t, i) => ({
          id: i + 1,
          platform: t.platform || 'tiktok',
          country: data.country || country,
          hashtag: t.hashtag,
          mentions: t.mentions || Math.floor(Math.random() * 5000000 + 500000),
          growth: t.growth || 100,
          engagement: t.engagement || 80,
          velocity: Math.floor((t.growth || 100) * 2.5),
          category: t.category || 'NEW',
          direction: t.direction || 'up',
          positionChange: t.positionChange || 0,
          description: t.description || '',
          contentType: 'hashtags',
          viralityScore: Math.min(100, (t.growth || 100) / 5),
          detectedAt: new Date(data.generatedAt || Date.now()),
          sentiment: (t.growth || 0) > 300 ? 'positive' : 'neutral'
        }));
        
        setStableTrends(mapped);
        setLastScanTime(new Date(data.generatedAt || Date.now()));
        setFromCache(data.fromCache || false);
        setCacheExpiresIn(data.cacheExpiresIn || null);
        setNextRefreshIn(60);
        setScanProgress(100);
        console.log(`✅ Radar: ${mapped.length} tendencias reales cargadas para ${country}`);
      }
    } catch (error) {
      console.error('Error fetching radar trends:', error);
      setTrendsError('No se pudo conectar con el servidor. Reintentando...');
    } finally {
      clearInterval(scanAnim);
      setIsLoadingTrends(false);
      setScanProgress(0);
    }
  }, [selectedCountry, selectedNiche]);

  // Carga inicial al montar
  useEffect(() => {
    fetchRealTrends();
  }, [fetchRealTrends]);

  // Auto-refresh cada 60 minutos
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      console.log('⏰ Radar: Auto-refresh activado (60 min)');
      fetchRealTrends(true);
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchRealTrends]);

  // Contador regresivo al próximo refresh
  useEffect(() => {
    if (!autoRefresh) return;
    setNextRefreshIn(60);
    const countdown = setInterval(() => {
      setNextRefreshIn(prev => prev <= 1 ? 60 : prev - 1);
    }, 60 * 1000);
    return () => clearInterval(countdown);
  }, [autoRefresh, stableTrends]);

  // Aplicar filtros de búsqueda y ordenamiento a las tendencias reales estabilizadas
  const filteredAnalysis = useMemo(() => {
    let results = [...stableTrends];

    // Búsqueda Textual
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(t => 
        t.hashtag.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Ordenamiento por métrica
    results.sort((a, b) => {
      if (sortMetric === 'growth') return b.growth - a.growth;
      if (sortMetric === 'mentions') return b.mentions - a.mentions;
      if (sortMetric === 'virality') return b.viralityScore - a.viralityScore;
      return 0;
    });

    return results;
  }, [stableTrends, searchQuery, sortMetric]);

  // Hashtags Inteligentes (Hashtag Lab)
  const [hashtagQuery, setHashtagQuery] = useState('');
  const [hashtagPlatform, setHashtagPlatform] = useState('all');
  const [hashtagCollections, setHashtagCollections] = useState([]);
  const [hashtagIaLoading, setHashtagIaLoading] = useState(false);
  const [hashtagIaError, setHashtagIaError] = useState(null);
  const [hashtagIaText, setHashtagIaText] = useState('');
  const [perfPlatformFilter, setPerfPlatformFilter] = useState('all');
  const [perfCountryFilter, setPerfCountryFilter] = useState('all');
  const [extraMixTags, setExtraMixTags] = useState([]);

  // New states for 10/10 features
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedTrendForChart, setSelectedTrendForChart] = useState(null);
  const [showChartModal, setShowChartModal] = useState(false);

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

  // Analítica de rendimiento por hashtag basada en los recordatorios del Calendario
  const hashtagPerformance = useMemo(() => {
    if (!scheduledReminders || scheduledReminders.length === 0) return [];

    const map = new Map();

    const extractHashtags = (text) => {
      if (!text) return [];
      const matches = text.match(/#[a-zA-Z0-9_ÁÉÍÓÚáéíóúñÑ]+/g) || [];
      return matches.map(h => h.trim()).filter(Boolean);
    };

    scheduledReminders.forEach(rem => {
      const text = `${rem.title || ''} ${rem.description || ''} ${rem.notes || ''}`;
      const tags = extractHashtags(text.toLowerCase());
      if (!tags.length) return;

      const reach = rem.reach || rem.estimatedReach || 0;
      const likes = rem.likes || 0;
      const comments = rem.comments || 0;
      const shares = rem.shares || 0;
      const saves = rem.saves || 0;
      const engagement = likes + comments + shares + saves;

      tags.forEach(tag => {
        const key = tag;
        if (!map.has(key)) {
          map.set(key, {
            tag: key,
            posts: 0,
            totalReach: 0,
            totalEngagement: 0,
            platforms: new Set(),
            countries: new Set()
          });
        }
        const entry = map.get(key);
        entry.posts += 1;
        entry.totalReach += reach;
        entry.totalEngagement += engagement;
        if (rem.platform) entry.platforms.add(rem.platform);
        if (rem.country) entry.countries.add(rem.country);
      });
    });

    const arr = Array.from(map.values());
    return arr;
  }, [scheduledReminders]);

  const performancePlatforms = useMemo(() => {
    const s = new Set();
    hashtagPerformance.forEach(h => {
      if (h.platforms) {
        h.platforms.forEach(p => p && s.add(p));
      }
    });
    return Array.from(s);
  }, [hashtagPerformance]);

  const performanceCountries = useMemo(() => {
    const s = new Set();
    hashtagPerformance.forEach(h => {
      if (h.countries) {
        h.countries.forEach(c => c && s.add(c));
      }
    });
    return Array.from(s);
  }, [hashtagPerformance]);

  // Todos los hashtags detectados (para Hashtag Lab)
  const allHashtags = useMemo(() => {
    return stableTrends.map(trend => ({
      tag: trend.hashtag,
      platform: trend.platform,
      country: trend.country,
      mentions: trend.mentions,
      growth: trend.growth,
      engagement: trend.engagement
    }));
  }, [stableTrends]);

  const filteredHashtagResults = useMemo(() => {
    let results = allHashtags;

    if (hashtagPlatform !== 'all') {
      results = results.filter(h => h.platform === hashtagPlatform);
    }
    if (hashtagQuery) {
      const q = hashtagQuery.toLowerCase();
      results = results.filter(h => h.tag.toLowerCase().includes(q));
    }

    // Evitar duplicados por hashtag
    const seen = new Set();
    const unique = [];
    for (const h of results) {
      if (!seen.has(h.tag)) {
        seen.add(h.tag);
        unique.push(h);
      }
    }
    return unique.slice(0, 50);
  }, [allHashtags, hashtagPlatform, hashtagQuery]);

  const classifyVolume = (mentions) => {
    if (mentions >= 3_000_000) return 'High';
    if (mentions >= 800_000) return 'Medium';
    return 'Nicho';
  };

  // 🌍 PAÍSES Y REGIONES DE ANÁLISIS
  const analysisCountries = {
    EC: {
      name: 'Ecuador',
      flag: '🇪🇨',
      color: '#FFD700',
      timezone: 'America/Guayaquil',
      population: '17.6M',
      internetPenetration: '79%'
    },
    CO: {
      name: 'Colombia',
      flag: '🇨🇴',
      color: '#FFCD00',
      timezone: 'America/Bogota',
      population: '51.2M',
      internetPenetration: '70%'
    },
    MX: {
      name: 'México',
      flag: '🇲🇽',
      color: '#006847',
      timezone: 'America/Mexico_City',
      population: '128.9M',
      internetPenetration: '72%'
    },
    PE: {
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

  // Calcular las métricas generales del radar basadas en la info real
  const radarMetrics = useMemo(() => {
    if (!filteredAnalysis || filteredAnalysis.length === 0) {
      return { totalDetected: 0, avgGrowth: 0, totalMentions: 0 };
    }
    
    const totalMentions = filteredAnalysis.reduce((acc, curr) => acc + (curr.mentions || 0), 0);
    const avgGrowth = filteredAnalysis.reduce((acc, curr) => acc + (curr.growth || 0), 0) / filteredAnalysis.length;

    return {
      totalDetected: filteredAnalysis.length,
      avgGrowth: Math.round(avgGrowth),
      totalMentions: totalMentions >= 1000000 ? (totalMentions / 1000000).toFixed(1) + 'M' : (totalMentions / 1000).toFixed(0) + 'K'
    };
  }, [filteredAnalysis]);

  // Función auxiliar para renderizar Skeleton o Tarjeta Real
  const renderTrendCard = (trend, platformColor, platformName) => {
    if (isLoadingTrends) {
      return (
        <div key={`skeleton-${Math.random()}`} className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-2/3">
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <div className="w-full space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-10"></div>
          </div>
        </div>
      );
    }

    // Card Real
    return (
      <motion.div
        key={`trend-${trend.id}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`bg-gray-800/40 rounded-lg p-2 border border-${platformColor}-500/20 hover:border-${platformColor}-400/50 transition-colors cursor-pointer group`}
        onClick={() => onTrendSelect && onTrendSelect(trend)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                trend.category === 'VIRAL' ? 'bg-red-400 animate-pulse' :
                trend.category === 'HOT' ? 'bg-orange-400 animate-pulse' :
                trend.category === 'RISING' ? 'bg-green-400 animate-pulse' :
                trend.category === 'FALLING' ? 'bg-blue-400' :
                'bg-gray-400'
              }`}></div>
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium text-xs truncate group-hover:text-cyan-300 transition-colors">
                  {trend.hashtag}
                </div>
              </div>
            </div>
            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                trend.category === 'VIRAL' ? `bg-red-500/20 text-red-400` :
                trend.category === 'HOT' ? `bg-orange-500/20 text-orange-400` :
                trend.category === 'RISING' ? `bg-green-500/20 text-green-400` :
                trend.category === 'FALLING' ? `bg-blue-500/20 text-blue-400` :
                `bg-gray-500/20 text-gray-400`
            }`}>
              {trend.category}
            </div>
          </div>
          
          <div className="flex items-center justify-between pl-3 pr-1">
            <div className="text-[10px] text-gray-400 flex items-center gap-2">
              <span>{trend.mentions >= 1000000 ? (trend.mentions/1000000).toFixed(1)+'M' : (trend.mentions/1000).toFixed(0)+'K'} views</span>
              <span className="text-gray-600">•</span>
              <span className="text-green-400">+{trend.growth}%</span>
            </div>
            {trend.positionChange > 0 && (
                <div className="flex items-center text-[10px] text-green-400">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> {trend.positionChange}
                </div>
            )}
            {trend.positionChange < 0 && (
                <div className="flex items-center text-[10px] text-red-400">
                  <TrendingUp className="w-3 h-3 mr-0.5 transform rotate-180" /> {Math.abs(trend.positionChange)}
                </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

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
                  <div className={`w-2 h-2 rounded-full ${isLoadingTrends ? 'bg-cyan-400 animate-pulse' : 'bg-green-500'}`}></div>
                  <span className="text-xs text-gray-400">
                    {isLoadingTrends ? 'IA analizando tendencias actuales...' : 'Predix AI Conectado'}
                  </span>
                </div>
                {!isLoadingTrends && (
                  <>
                    <div className="text-xs text-gray-500">|</div>
                    <div className="text-xs text-gray-400" title={fromCache ? `En caché por ${cacheExpiresIn}` : 'Datos frescos'}>
                      Último escaneo: {lastScanTime.toLocaleTimeString()} {fromCache && '⚡'}
                    </div>
                    <div className="text-xs text-gray-500">|</div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                      <span className="text-xs text-gray-400">
                        {autoRefresh ? `Auto-refresh en ${nextRefreshIn} min` : 'Auto-refresh OFF'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
          <button
            onClick={() => fetchRealTrends(true)}
            disabled={isLoadingTrends}
            className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${
              isLoadingTrends 
              ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingTrends ? 'animate-spin' : ''}`} />
            {isLoadingTrends ? 'Cargando...' : 'Forzar Refresh'}
          </button>
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

            {/* New Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-colors group"
                title="Exportar datos"
              >
                <Download className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </button>

              {/* Notification Center */}
              <NotificationCenter
                trends={filteredAnalysis}
                alertSettings={alertSettings}
                onUpdateSettings={setAlertSettings}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🏷️ SELECTOR DE NICHO DE NEGOCIO (CHIPS) */}
      <div className="mb-6 -mt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-gray-400 text-xs font-medium mr-2 whitespace-nowrap">
            Filtrar Industria:
          </span>
          {businessNiches.map((niche) => (
            <button
              key={niche.id}
              onClick={() => setSelectedNiche(niche.id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                selectedNiche === niche.id
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
              }`}
            >
              {niche.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🌐 SECCIONES DE REDES SOCIALES EN 3 COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* 🎵 COLUMNA TIKTOK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-pink-900/20 via-red-900/20 to-pink-800/20 p-4 rounded-xl border border-pink-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-1">
                  TikTok
                  <span className="text-xs bg-pink-500/20 text-pink-400 px-1 py-0.5 rounded">LIVE</span>
                </h3>
                <p className="text-gray-400 text-xs">Videos virales</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-pink-400 font-bold text-sm">{filteredAnalysis.filter(t => t.platform === 'tiktok').length}</div>
              <div className="text-gray-500 text-xs">trends</div>
            </div>
          </div>

          <div className="space-y-2">
            {isLoadingTrends 
              ? [1,2,3].map(i => renderTrendCard({ id: `sk-tk-${i}` }, 'pink', 'tiktok'))
              : filteredAnalysis.filter(t => t.platform === 'tiktok').slice(0, 4).map((trend) => renderTrendCard(trend, 'pink', 'tiktok'))
            }
          </div>
        </motion.div>

        {/* 📸 COLUMNA INSTAGRAM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20 p-4 rounded-xl border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-1">
                  Instagram
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded">LIVE</span>
                </h3>
                <p className="text-gray-400 text-xs">Stories & Reels</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold text-sm">{filteredAnalysis.filter(t => t.platform === 'instagram').length}</div>
              <div className="text-gray-500 text-xs">trends</div>
            </div>
          </div>

          <div className="space-y-2">
            {isLoadingTrends 
              ? [1,2,3].map(i => renderTrendCard({ id: `sk-ig-${i}` }, 'purple', 'instagram'))
              : filteredAnalysis.filter(t => t.platform === 'instagram').slice(0, 4).map((trend) => renderTrendCard(trend, 'purple', 'instagram'))
            }
          </div>
        </motion.div>

        {/* 👥 COLUMNA FACEBOOK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-blue-800/20 p-4 rounded-xl border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-1">
                  Facebook
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded">LIVE</span>
                </h3>
                <p className="text-gray-400 text-xs">Posts & Grupos</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-sm">{filteredAnalysis.filter(t => t.platform === 'facebook').length}</div>
              <div className="text-gray-500 text-xs">trends</div>
            </div>
          </div>

          <div className="space-y-2">
            {isLoadingTrends 
              ? [1,2,3].map(i => renderTrendCard({ id: `sk-fb-${i}` }, 'blue', 'facebook'))
              : filteredAnalysis.filter(t => t.platform === 'facebook').slice(0, 4).map((trend) => renderTrendCard(trend, 'blue', 'facebook'))
            }
          </div>
        </motion.div>
      </div>
      {/* FIN DEL SCOPE DE RENDER TREND CARD */}      {/* 🏷️ HASHTAG LAB / HASHTAGS INTELIGENTES */}
      <div className="mt-6 bg-gradient-to-r from-gray-900/60 via-slate-900/60 to-gray-900/60 p-5 rounded-xl border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Hash className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Hashtags Inteligentes (Hashtag Lab)</h3>
              <p className="text-gray-300 text-xs">Explora hashtags por país y red social, y genera un mix óptimo listo para copiar/pegar.</p>
            </div>
          </div>
        </div>

        {/* Buscador y filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Tema o hashtag base</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={hashtagQuery}
                onChange={(e) => setHashtagQuery(e.target.value)}
                placeholder="#restaurante mexicano, marketing, moda..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Plataforma</label>
            <select
              value={hashtagPlatform}
              onChange={(e) => setHashtagPlatform(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Todas</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
          <div className="flex items-end justify-end gap-2">
            <button
              onClick={() => {
                setHashtagQuery('');
                setHashtagPlatform('all');
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Resultados de hashtags */}
          <div className="bg-gray-900/60 rounded-lg p-4 border border-cyan-500/20">
            <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              Hashtags detectados en tu radar
            </h4>
            <p className="text-xs text-gray-400 mb-2">
              Basados en las tendencias activas por país y plataforma.
            </p>
            <div className="max-h-52 overflow-y-auto space-y-1 text-xs">
              {filteredHashtagResults.length === 0 && (
                <p className="text-gray-500">No se encontraron hashtags con estos filtros.</p>
              )}
              {filteredHashtagResults.map(h => (
                <div
                  key={`${h.tag}-${h.platform}-${h.country}`}
                  className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-gray-800/80 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-white truncate">{h.tag}</span>
                    <span className="text-[10px] text-gray-400">{analysisCountries[h.country]?.flag}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                      {h.platform}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                      {classifyVolume(h.mentions)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mix básico calculado por reglas */}
          <div className="bg-gray-900/60 rounded-lg p-4 border border-emerald-500/20">
            <h4 className="text-white font-semibold text-sm mb-2">Mix básico según tus datos</h4>
            <p className="text-xs text-gray-400 mb-2">
              Seleccionamos automáticamente hashtags core, trending y geolocalizados a partir de tus tendencias.
            </p>
            {(() => {
              const core = filteredHashtagResults
                .filter(h => h.engagement >= 88)
                .slice(0, 7)
                .map(h => h.tag);
              const trending = filteredHashtagResults
                .filter(h => h.growth >= 350)
                .slice(0, 5)
                .map(h => h.tag);
              const geo = filteredHashtagResults
                .filter(h => h.tag.toLowerCase().includes(analysisCountries[selectedCountry]?.name?.toLowerCase?.() || ''))
                .slice(0, 5)
                .map(h => h.tag);
              const baseMix = [...core, ...trending, ...geo];
              const fullMixSet = new Set(baseMix);
              extraMixTags.forEach(tag => fullMixSet.add(tag));
              const mixLine = Array.from(fullMixSet).join(' ');

              return (
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-gray-300 font-medium mb-1">Core de nicho</p>
                    <p className="text-gray-200 break-words">{core.length ? core.join(' ') : 'Aún sin suficientes datos, agrega más hashtags en tus contenidos.'}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium mb-1">Trending / Moda</p>
                    <p className="text-gray-200 break-words">{trending.length ? trending.join(' ') : 'Esperando detectar hashtags trending para tu país.'}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium mb-1">Geolocalizados</p>
                    <p className="text-gray-200 break-words">{geo.length ? geo.join(' ') : 'Todavía no detectamos muchos hashtags geolocalizados.'}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      onClick={async () => {
                        if (!mixLine) return;
                        try {
                          await navigator.clipboard.writeText(mixLine);
                        } catch (e) {
                          console.error('No se pudo copiar mix básico', e);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40"
                    >
                      Copiar mix básico
                    </button>
                    <button
                      onClick={() => {
                        if (!mixLine) return;
                        const name = window.prompt('Nombre para esta colección de hashtags (ej: Campaña Black Friday MX)');
                        if (!name) return;
                        setHashtagCollections(prev => [
                          ...prev,
                          { id: Date.now(), name, mix: mixLine }
                        ]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
                    >
                      Guardar como colección
                    </button>
                    {onSendHashtagMix && (
                      <button
                        onClick={() => {
                          if (!mixLine) return;
                          onSendHashtagMix(mixLine);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
                      >
                        Usar en nuevo post
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Colecciones guardadas e IA */}
          <div className="bg-gray-900/60 rounded-lg p-4 border border-purple-500/20 flex flex-col gap-3">
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Colecciones guardadas</h4>
              <p className="text-xs text-gray-400 mb-2">Paquetes de hashtags por campaña o cliente.</p>
              <div className="space-y-1 max-h-28 overflow-y-auto text-xs">
                {hashtagCollections.length === 0 && (
                  <p className="text-gray-500">Aún no tienes colecciones guardadas.</p>
                )}
                {hashtagCollections.map(col => (
                  <div
                    key={col.id}
                    className="flex items-center justify-between gap-2 py-1 px-2 rounded-md hover:bg-gray-800/80"
                  >
                    <div className="min-w-0">
                      <p className="text-gray-200 font-medium truncate">{col.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{col.mix}</p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(col.mix);
                        } catch (e) {
                          console.error('No se pudo copiar colección', e);
                        }
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
                    >
                      Copiar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700/60">
              <h4 className="text-white font-semibold text-sm mb-1">Mix optimizado por IA</h4>
              <p className="text-xs text-gray-400 mb-2">
                Pídele a Predix que genere un mix tipo Metahashtags con reglas de core / trending / geolocalizados.
              </p>
              <button
                disabled={hashtagIaLoading}
                onClick={async () => {
                  setHashtagIaError(null);
                  setHashtagIaLoading(true);
                  try {
                    const base = filteredHashtagResults.slice(0, 15).map(h => h.tag);
                    const result = await getHashtagMixRecommendations({
                      topic: hashtagQuery || 'marketing digital',
                      country: analysisCountries[selectedCountry]?.name || 'México',
                      baseHashtags: base
                    });
                    if (!result.success) {
                      setHashtagIaError(result.error || 'No se pudo obtener mix optimizado de la IA');
                      setHashtagIaText(result.fallbackResponse || '');
                    } else {
                      setHashtagIaText(result.response || '');
                    }
                  } catch (e) {
                    console.error('Error IA hashtags', e);
                    setHashtagIaError('Error inesperado al llamar a la IA');
                  } finally {
                    setHashtagIaLoading(false);
                  }
                }}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 ${hashtagIaLoading
                  ? 'bg-purple-500/20 text-purple-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-400 hover:to-cyan-400'
                  }`}
              >
                {hashtagIaLoading ? 'Generando mix con IA...' : 'Pedir mix óptimo a la IA'}
              </button>
              {hashtagIaError && (
                <p className="text-xs text-red-400 mt-2">{hashtagIaError}</p>
              )}
              {hashtagIaText && (
                <>
                  <div
                    className="mt-2 text-[11px] text-gray-200 bg-gray-950/60 rounded-lg p-2 border border-gray-700 max-h-32 overflow-y-auto whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{ __html: formatIaMarkdown(hashtagIaText) }}
                  />
                  {onSendHashtagMix && (
                    <button
                      onClick={() => {
                        if (!hashtagIaText) return;
                        // Intentamos extraer la línea final "Hashtags (...)" si existe; si no, usamos todo el texto
                        const lines = hashtagIaText.split('\n');
                        const lastLine = lines.find(line => line.toLowerCase().includes('hashtags') && line.includes('#')) || hashtagIaText;
                        onSendHashtagMix(lastLine);
                      }}
                      className="mt-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
                    >
                      Usar mix IA en nuevo post
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {/* Rendimiento por hashtag */}
        {hashtagPerformance.length > 0 && (
          <div className="mt-5 text-xs space-y-3">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm font-semibold">Analítica de rendimiento por hashtag</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Plataforma</label>
                  <select
                    value={perfPlatformFilter}
                    onChange={(e) => setPerfPlatformFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-[11px] text-gray-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">Todas</option>
                    {performancePlatforms.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">País</label>
                  <select
                    value={perfCountryFilter}
                    onChange={(e) => setPerfCountryFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-[11px] text-gray-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">Todos</option>
                    {performanceCountries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900/70 rounded-lg p-4 border border-emerald-500/30">
                <h4 className="text-white font-semibold mb-2">Top hashtags que mejor te funcionan</h4>
                <p className="text-[11px] text-gray-400 mb-2">Basado en tus recordatorios guardados (alcance y engagement).</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {hashtagPerformance
                    .filter(h => h.posts >= 1)
                    .filter(h => perfPlatformFilter === 'all' || (h.platforms && h.platforms.has(perfPlatformFilter)))
                    .filter(h => perfCountryFilter === 'all' || (h.countries && h.countries.has(perfCountryFilter)))
                    .sort((a, b) => b.totalEngagement - a.totalEngagement)
                    .slice(0, 5)
                    .map(h => (
                      <div key={h.tag} className="flex items-center justify-between gap-2 py-1 px-2 rounded-md bg-gray-900/80">
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-100 font-medium truncate">{h.tag}</p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {h.posts} post(s) • Alcance total: {h.totalReach || 0} • Eng: {h.totalEngagement || 0}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <button
                            onClick={() => {
                              setExtraMixTags(prev => prev.includes(h.tag) ? prev : [...prev, h.tag]);
                            }}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40"
                          >
                            + al mix
                          </button>
                          {onSendHashtagMix && (
                            <button
                              onClick={() => {
                                onSendHashtagMix(h.tag);
                              }}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
                            >
                              Nuevo post
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gray-900/70 rounded-lg p-4 border border-red-500/30">
                <h4 className="text-white font-semibold mb-2">Hashtags que casi no aportan</h4>
                <p className="text-[11px] text-gray-400 mb-2">Bajo alcance y poco engagement en tus contenidos.</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {hashtagPerformance
                    .filter(h => h.posts >= 1)
                    .filter(h => perfPlatformFilter === 'all' || (h.platforms && h.platforms.has(perfPlatformFilter)))
                    .filter(h => perfCountryFilter === 'all' || (h.countries && h.countries.has(perfCountryFilter)))
                    .sort((a, b) => (a.totalEngagement || 0) - (b.totalEngagement || 0))
                    .slice(0, 5)
                    .map(h => (
                      <div key={h.tag} className="flex items-center justify-between py-1 px-2 rounded-md bg-gray-900/80">
                        <div className="min-w-0">
                          <p className="text-gray-100 font-medium truncate">{h.tag}</p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {h.posts} post(s) • Alcance total: {h.totalReach || 0} • Eng: {h.totalEngagement || 0}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        trends={filteredAnalysis}
        hashtagPerformance={hashtagPerformance}
        radarMetrics={radarMetrics}
      />
    </motion.div>
  );
};

export default RadarCompacto;
