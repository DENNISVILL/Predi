// 🔗 HOOK DE REACT PARA INTEGRACIONES
// Maneja estado, loading, errores y actualizaciones en tiempo real

import { useState, useEffect, useCallback, useRef } from 'react';
import IntegrationService from '../services/integrationService.js';
import { useNotifications } from './useNotifications.js';

export const useIntegrations = (options = {}) => {
  const { showToast } = useNotifications();
  const [data, setData] = useState({
    music: [],
    hashtags: [],
    analytics: null,
    trends: []
  });
  
  const [loading, setLoading] = useState({
    music: false,
    hashtags: false,
    analytics: false,
    trends: false
  });
  
  const [errors, setErrors] = useState({
    music: null,
    hashtags: null,
    analytics: null,
    trends: null
  });
  
  const [lastUpdated, setLastUpdated] = useState({
    music: null,
    hashtags: null,
    analytics: null,
    trends: null
  });

  const intervalRefs = useRef({});
  const abortControllers = useRef({});

  // 🎵 FETCH MUSIC TRENDING
  const fetchMusicTrending = useCallback(async (forceRefresh = false) => {
    if (loading.music && !forceRefresh) return;

    setLoading(prev => ({ ...prev, music: true }));
    setErrors(prev => ({ ...prev, music: null }));

    try {
      abortControllers.current.music = new AbortController();
      
      const musicData = await IntegrationService.getMusicTrending({
        country: options.country || 'US',
        region: options.region || 'US',
        limit: options.limit || 100
      });

      setData(prev => ({ ...prev, music: musicData }));
      setLastUpdated(prev => ({ ...prev, music: new Date() }));
      
      if (forceRefresh) {
        showToast('🎵 Música trending actualizada', 'success');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setErrors(prev => ({ ...prev, music: error.message }));
        showToast('Error al cargar música trending', 'error');
      }
    } finally {
      setLoading(prev => ({ ...prev, music: false }));
    }
  }, [options.country, options.region, options.limit, loading.music, showToast]);

  // 📊 FETCH HASHTAGS TRENDING
  const fetchHashtagTrending = useCallback(async (forceRefresh = false) => {
    if (loading.hashtags && !forceRefresh) return;

    setLoading(prev => ({ ...prev, hashtags: true }));
    setErrors(prev => ({ ...prev, hashtags: null }));

    try {
      abortControllers.current.hashtags = new AbortController();
      
      const hashtagData = await IntegrationService.getHashtagTrending({
        region: options.region || 'US',
        woeid: options.woeid || 1,
        category: options.category || 'all'
      });

      setData(prev => ({ ...prev, hashtags: hashtagData }));
      setLastUpdated(prev => ({ ...prev, hashtags: new Date() }));
      
      if (forceRefresh) {
        showToast('📊 Hashtags trending actualizados', 'success');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setErrors(prev => ({ ...prev, hashtags: error.message }));
        showToast('Error al cargar hashtags trending', 'error');
      }
    } finally {
      setLoading(prev => ({ ...prev, hashtags: false }));
    }
  }, [options.region, options.woeid, options.category, loading.hashtags, showToast]);

  // 📈 FETCH ANALYTICS
  const fetchAnalytics = useCallback(async (forceRefresh = false) => {
    if (loading.analytics && !forceRefresh) return;

    setLoading(prev => ({ ...prev, analytics: true }));
    setErrors(prev => ({ ...prev, analytics: null }));

    try {
      abortControllers.current.analytics = new AbortController();
      
      const analyticsData = await IntegrationService.getUnifiedAnalytics({
        channelId: options.channelId,
        organizationId: options.organizationId,
        startDate: options.startDate || '2024-01-01',
        endDate: options.endDate || new Date().toISOString().split('T')[0]
      });

      setData(prev => ({ ...prev, analytics: analyticsData }));
      setLastUpdated(prev => ({ ...prev, analytics: new Date() }));
      
      if (forceRefresh) {
        showToast('📈 Analytics actualizados', 'success');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setErrors(prev => ({ ...prev, analytics: error.message }));
        showToast('Error al cargar analytics', 'error');
      }
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }));
    }
  }, [options.channelId, options.organizationId, options.startDate, options.endDate, loading.analytics, showToast]);

  // 🔍 FETCH GOOGLE TRENDS
  const fetchGoogleTrends = useCallback(async (keywords, forceRefresh = false) => {
    if (loading.trends && !forceRefresh) return;

    setLoading(prev => ({ ...prev, trends: true }));
    setErrors(prev => ({ ...prev, trends: null }));

    try {
      abortControllers.current.trends = new AbortController();
      
      const trendsData = await IntegrationService.getGoogleTrendsData(keywords, {
        geo: options.geo || 'US',
        timeframe: options.timeframe || 'today 12-m'
      });

      setData(prev => ({ ...prev, trends: trendsData }));
      setLastUpdated(prev => ({ ...prev, trends: new Date() }));
      
      if (forceRefresh) {
        showToast('🔍 Google Trends actualizados', 'success');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setErrors(prev => ({ ...prev, trends: error.message }));
        showToast('Error al cargar Google Trends', 'error');
      }
    } finally {
      setLoading(prev => ({ ...prev, trends: false }));
    }
  }, [options.geo, options.timeframe, loading.trends, showToast]);

  // 🔄 AUTO REFRESH
  const startAutoRefresh = useCallback((type, interval = 300000) => { // 5 minutos por defecto
    if (intervalRefs.current[type]) {
      clearInterval(intervalRefs.current[type]);
    }

    intervalRefs.current[type] = setInterval(() => {
      switch (type) {
        case 'music':
          fetchMusicTrending(true);
          break;
        case 'hashtags':
          fetchHashtagTrending(true);
          break;
        case 'analytics':
          fetchAnalytics(true);
          break;
        default:
          break;
      }
    }, interval);
  }, [fetchMusicTrending, fetchHashtagTrending, fetchAnalytics]);

  const stopAutoRefresh = useCallback((type) => {
    if (intervalRefs.current[type]) {
      clearInterval(intervalRefs.current[type]);
      delete intervalRefs.current[type];
    }
  }, []);

  // 🛑 ABORT REQUESTS
  const abortRequest = useCallback((type) => {
    if (abortControllers.current[type]) {
      abortControllers.current[type].abort();
      delete abortControllers.current[type];
    }
  }, []);

  // 📊 DATA PROCESSING HELPERS
  const getTopMusic = useCallback((platform = 'all', limit = 10) => {
    if (!data.music.length) return [];
    
    const filtered = platform === 'all' 
      ? data.music 
      : data.music.filter(item => item.platform === platform);
    
    return filtered
      .sort((a, b) => b.trending_score - a.trending_score)
      .slice(0, limit);
  }, [data.music]);

  const getTopHashtags = useCallback((platform = 'all', limit = 10) => {
    if (!data.hashtags.length) return [];
    
    const filtered = platform === 'all' 
      ? data.hashtags 
      : data.hashtags.filter(item => item.platform === platform);
    
    return filtered
      .sort((a, b) => b.trending_score - a.trending_score)
      .slice(0, limit);
  }, [data.hashtags]);

  const getAnalyticsSummary = useCallback(() => {
    if (!data.analytics) return null;
    
    return {
      totalEngagement: data.analytics.unified_metrics?.total_engagement || 0,
      avgReach: data.analytics.unified_metrics?.avg_reach || 0,
      topPlatform: data.analytics.unified_metrics?.top_performing_platform || 'unknown',
      growthRate: data.analytics.unified_metrics?.growth_rate || '0%'
    };
  }, [data.analytics]);

  const getTrendingSummary = useCallback(() => {
    return {
      totalKeywords: data.trends.length,
      topKeyword: data.trends[0]?.keyword || null,
      avgGrowth: data.trends.reduce((acc, trend) => {
        const latestData = trend.data[trend.data.length - 1];
        return acc + (latestData?.value || 0);
      }, 0) / (data.trends.length || 1)
    };
  }, [data.trends]);

  // 🔄 REFRESH ALL
  const refreshAll = useCallback(async () => {
    const promises = [
      fetchMusicTrending(true),
      fetchHashtagTrending(true),
      fetchAnalytics(true)
    ];

    try {
      await Promise.allSettled(promises);
      showToast('🔄 Todos los datos actualizados', 'success');
    } catch (error) {
      showToast('Error al actualizar datos', 'error');
    }
  }, [fetchMusicTrending, fetchHashtagTrending, fetchAnalytics, showToast]);

  // 📊 CONNECTION STATUS
  const getConnectionStatus = useCallback(() => {
    const hasErrors = Object.values(errors).some(error => error !== null);
    const isLoading = Object.values(loading).some(load => load === true);
    
    if (hasErrors) return 'error';
    if (isLoading) return 'loading';
    return 'connected';
  }, [errors, loading]);

  // 🚀 INITIAL LOAD
  useEffect(() => {
    if (options.autoLoad !== false) {
      fetchMusicTrending();
      fetchHashtagTrending();
      
      if (options.channelId || options.organizationId) {
        fetchAnalytics();
      }
    }
  }, []);

  // 🔄 AUTO REFRESH SETUP
  useEffect(() => {
    if (options.autoRefresh) {
      startAutoRefresh('music', options.refreshInterval);
      startAutoRefresh('hashtags', options.refreshInterval);
      
      if (options.channelId || options.organizationId) {
        startAutoRefresh('analytics', options.refreshInterval);
      }
    }

    return () => {
      Object.keys(intervalRefs.current).forEach(stopAutoRefresh);
    };
  }, [options.autoRefresh, options.refreshInterval, startAutoRefresh, stopAutoRefresh]);

  // 🧹 CLEANUP
  useEffect(() => {
    return () => {
      Object.keys(abortControllers.current).forEach(abortRequest);
      Object.keys(intervalRefs.current).forEach(stopAutoRefresh);
    };
  }, [abortRequest, stopAutoRefresh]);

  return {
    // Data
    data,
    loading,
    errors,
    lastUpdated,
    
    // Actions
    fetchMusicTrending,
    fetchHashtagTrending,
    fetchAnalytics,
    fetchGoogleTrends,
    refreshAll,
    
    // Auto refresh
    startAutoRefresh,
    stopAutoRefresh,
    
    // Abort
    abortRequest,
    
    // Helpers
    getTopMusic,
    getTopHashtags,
    getAnalyticsSummary,
    getTrendingSummary,
    getConnectionStatus
  };
};
