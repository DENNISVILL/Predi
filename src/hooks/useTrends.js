import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';

// Hook para gestión de tendencias
export const useTrends = () => {
  const {
    trends,
    trendingNow,
    filters,
    setTrends,
    addTrend,
    updateTrend,
    followTrend,
    unfollowTrend,
    updateFilters,
    getFilteredTrends,
    getTrendById
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simular carga de tendencias desde API
  const fetchTrends = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados de tendencias
      const mockTrends = [
        {
          id: Date.now() + Math.random(),
          name: '#SustainableFashion',
          platform: 'Instagram',
          growth: '+89%',
          confidence: 91,
          country: '🇺🇸',
          category: 'Moda',
          description: 'Moda sostenible ganando tracción entre millennials',
          tags: ['sustainable', 'fashion', 'eco', 'green'],
          createdAt: new Date().toISOString(),
          isFollowing: false,
          metrics: {
            posts: 45600,
            engagement: 8.7,
            reach: 2300000,
            sentiment: 'positive'
          }
        },
        {
          id: Date.now() + Math.random() + 1,
          name: 'Micro Learning',
          platform: 'TikTok',
          growth: '+134%',
          confidence: 88,
          country: '🇬🇧',
          category: 'Educación',
          description: 'Contenido educativo en formato micro está explotando',
          tags: ['education', 'learning', 'micro', 'knowledge'],
          createdAt: new Date().toISOString(),
          isFollowing: false,
          metrics: {
            posts: 78900,
            engagement: 12.4,
            reach: 5600000,
            sentiment: 'positive'
          }
        }
      ];
      
      setTrends(mockTrends);
    } catch (err) {
      setError('Error al cargar tendencias');
      console.error('Error fetching trends:', err);
    } finally {
      setLoading(false);
    }
  }, [setTrends]);

  // Buscar tendencias por término
  const searchTrends = useCallback(async (query) => {
    if (!query.trim()) return [];
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrar tendencias existentes por el término de búsqueda
      const allTrends = [...trends, ...trendingNow];
      const filtered = allTrends.filter(trend =>
        trend.name.toLowerCase().includes(query.toLowerCase()) ||
        trend.description.toLowerCase().includes(query.toLowerCase()) ||
        trend.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      return filtered;
    } catch (err) {
      setError('Error en la búsqueda');
      return [];
    } finally {
      setLoading(false);
    }
  }, [trends, trendingNow]);

  // Obtener tendencias por categoría
  const getTrendsByCategory = useCallback((category) => {
    const allTrends = [...trends, ...trendingNow];
    return allTrends.filter(trend => 
      trend.category?.toLowerCase() === category.toLowerCase()
    );
  }, [trends, trendingNow]);

  // Obtener tendencias por plataforma
  const getTrendsByPlatform = useCallback((platform) => {
    const allTrends = [...trends, ...trendingNow];
    return allTrends.filter(trend => 
      trend.platform.toLowerCase() === platform.toLowerCase()
    );
  }, [trends, trendingNow]);

  // Obtener tendencias seguidas
  const getFollowedTrends = useCallback(() => {
    const allTrends = [...trends, ...trendingNow];
    return allTrends.filter(trend => trend.isFollowing);
  }, [trends, trendingNow]);

  // Alternar seguimiento de tendencia
  const toggleFollow = useCallback((trendId) => {
    const trend = getTrendById(trendId);
    if (trend) {
      if (trend.isFollowing) {
        unfollowTrend(trendId);
      } else {
        followTrend(trendId);
      }
    }
  }, [getTrendById, followTrend, unfollowTrend]);

  // Obtener estadísticas de tendencias
  const getTrendStats = useCallback(() => {
    const allTrends = [...trends, ...trendingNow];
    
    return {
      total: allTrends.length,
      following: allTrends.filter(t => t.isFollowing).length,
      byPlatform: {
        TikTok: allTrends.filter(t => t.platform === 'TikTok').length,
        Instagram: allTrends.filter(t => t.platform === 'Instagram').length,
        Twitter: allTrends.filter(t => t.platform === 'Twitter').length,
        YouTube: allTrends.filter(t => t.platform === 'YouTube').length
      },
      byCategory: allTrends.reduce((acc, trend) => {
        const category = trend.category || 'Sin categoría';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}),
      averageConfidence: allTrends.reduce((sum, trend) => sum + trend.confidence, 0) / allTrends.length || 0
    };
  }, [trends, trendingNow]);

  return {
    // Estado
    trends,
    trendingNow,
    filters,
    loading,
    error,
    
    // Acciones
    fetchTrends,
    searchTrends,
    addTrend,
    updateTrend,
    toggleFollow,
    updateFilters,
    
    // Getters
    getFilteredTrends,
    getTrendById,
    getTrendsByCategory,
    getTrendsByPlatform,
    getFollowedTrends,
    getTrendStats
  };
};
