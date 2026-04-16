// 🔌 MÓDULO DE INTEGRACIONES COMPLETO
// Dashboard unificado para todas las APIs con monitoreo en tiempo real

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Wifi, WifiOff, RefreshCw, Settings, Activity, AlertCircle,
  CheckCircle, Clock, TrendingUp, Music, Hash, BarChart3, Search,
  Globe, Smartphone, Youtube, Twitter, Instagram, Linkedin, Play,
  Pause, Download, Share2, Eye, Heart, MessageCircle, Users
} from 'lucide-react';
import { useIntegrations } from '../hooks/useIntegrations.js';
import { useNotifications } from '../hooks/useNotifications.js';

const IntegrationsModule = () => {
  const { showToast } = useNotifications();
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [viewMode, setViewMode] = useState('dashboard');
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  
  const {
    data,
    loading,
    errors,
    lastUpdated,
    fetchMusicTrending,
    fetchHashtagTrending,
    fetchAnalytics,
    fetchGoogleTrends,
    refreshAll,
    startAutoRefresh,
    stopAutoRefresh,
    getTopMusic,
    getTopHashtags,
    getAnalyticsSummary,
    getTrendingSummary,
    getConnectionStatus
  } = useIntegrations({
    autoLoad: true,
    autoRefresh: autoRefreshEnabled,
    refreshInterval: 300000, // 5 minutos
    country: 'US',
    region: 'US'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState(['AI', 'Marketing', 'TikTok']);

  const platforms = [
    { id: 'all', name: 'Todas', icon: Globe, color: 'purple', status: 'connected' },
    { id: 'tiktok', name: 'TikTok', icon: Zap, color: 'red', status: getConnectionStatus() },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink', status: getConnectionStatus() },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'red', status: getConnectionStatus() },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'blue', status: getConnectionStatus() },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'blue', status: getConnectionStatus() },
    { id: 'spotify', name: 'Spotify', icon: Music, color: 'green', status: getConnectionStatus() }
  ];

  const connectionStatus = getConnectionStatus();
  const analyticsSummary = getAnalyticsSummary();
  const trendingSummary = getTrendingSummary();

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    if (!autoRefreshEnabled) {
      startAutoRefresh('music');
      startAutoRefresh('hashtags');
      showToast('🔄 Auto-refresh activado', 'success');
    } else {
      stopAutoRefresh('music');
      stopAutoRefresh('hashtags');
      showToast('⏸️ Auto-refresh pausado', 'info');
    }
  };

  const handleGoogleTrendsSearch = () => {
    if (selectedKeywords.length > 0) {
      fetchGoogleTrends(selectedKeywords, true);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'loading':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Nunca';
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-purple-400" />
            Integraciones en Tiempo Real
          </h1>
          <p className="text-gray-400 text-lg">
            Datos unificados de todas las plataformas con APIs reales
          </p>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          className="bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(connectionStatus)}
                <span className="text-white font-medium">
                  Estado: {connectionStatus === 'connected' ? 'Conectado' : 
                          connectionStatus === 'loading' ? 'Cargando' : 'Error'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">
                  Última actualización: {formatLastUpdated(lastUpdated.music)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggleAutoRefresh}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  autoRefreshEnabled 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {autoRefreshEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                Auto-refresh
              </motion.button>

              <motion.button
                onClick={refreshAll}
                disabled={loading.music || loading.hashtags}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-4 h-4 ${(loading.music || loading.hashtags) ? 'animate-spin' : ''}`} />
                Actualizar Todo
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Platform Status Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPlatform === platform.id
                  ? 'bg-purple-600/20 border-purple-500'
                  : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <platform.icon className={`w-6 h-6 text-${platform.color}-400`} />
                {getStatusIcon(platform.status)}
              </div>
              <h3 className="text-white font-medium text-sm">{platform.name}</h3>
              <p className="text-gray-400 text-xs capitalize">{platform.status}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Music Trending */}
          <motion.div
            className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-400" />
                Música Trending
              </h3>
              <motion.button
                onClick={() => fetchMusicTrending(true)}
                disabled={loading.music}
                className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className={`w-4 h-4 text-white ${loading.music ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>

            {loading.music ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                <span className="ml-2 text-gray-400">Cargando música...</span>
              </div>
            ) : errors.music ? (
              <div className="text-red-400 text-sm p-4 bg-red-500/10 rounded-lg">
                Error: {errors.music}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getTopMusic(selectedPlatform, 10).map((track, index) => (
                  <motion.div
                    key={track.id}
                    className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-700/50 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-purple-400 font-bold text-sm">#{index + 1}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{track.title}</h4>
                        <p className="text-gray-400 text-xs">{track.artist}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-sm">{track.trending_score}</div>
                        <div className="text-gray-400 text-xs">{track.platform}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Hashtags Trending */}
          <motion.div
            className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl p-6 border border-blue-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-400" />
                Hashtags Trending
              </h3>
              <motion.button
                onClick={() => fetchHashtagTrending(true)}
                disabled={loading.hashtags}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className={`w-4 h-4 text-white ${loading.hashtags ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>

            {loading.hashtags ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                <span className="ml-2 text-gray-400">Cargando hashtags...</span>
              </div>
            ) : errors.hashtags ? (
              <div className="text-red-400 text-sm p-4 bg-red-500/10 rounded-lg">
                Error: {errors.hashtags}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getTopHashtags(selectedPlatform, 10).map((hashtag, index) => (
                  <motion.div
                    key={hashtag.hashtag}
                    className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-700/50 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400 font-bold text-sm">#{index + 1}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{hashtag.hashtag}</h4>
                        <p className="text-gray-400 text-xs">{hashtag.volume?.toLocaleString()} usos</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-sm">{hashtag.trending_score}</div>
                        <div className="text-gray-400 text-xs">{hashtag.platform}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Analytics & Trends */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Analytics Summary */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                Analytics Resumen
              </h3>
              
              {analyticsSummary ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Engagement Total:</span>
                    <span className="text-green-400 font-bold">{analyticsSummary.totalEngagement.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Alcance Promedio:</span>
                    <span className="text-blue-400 font-bold">{analyticsSummary.avgReach.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Top Plataforma:</span>
                    <span className="text-purple-400 font-bold capitalize">{analyticsSummary.topPlatform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Crecimiento:</span>
                    <span className="text-yellow-400 font-bold">{analyticsSummary.growthRate}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No hay datos de analytics disponibles</p>
              )}
            </div>

            {/* Google Trends */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl p-6 border border-yellow-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-yellow-400" />
                Google Trends
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        setSelectedKeywords([...selectedKeywords, searchQuery.trim()]);
                        setSearchQuery('');
                      }
                    }}
                    placeholder="Añadir keyword..."
                    className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm"
                  />
                  <motion.button
                    onClick={handleGoogleTrendsSearch}
                    disabled={loading.trends}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        onClick={() => setSelectedKeywords(selectedKeywords.filter((_, i) => i !== index))}
                        className="hover:text-yellow-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {trendingSummary.totalKeywords > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Keywords:</span>
                      <span className="text-yellow-400 font-bold">{trendingSummary.totalKeywords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Top Keyword:</span>
                      <span className="text-yellow-400 font-bold">{trendingSummary.topKeyword}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsModule;
