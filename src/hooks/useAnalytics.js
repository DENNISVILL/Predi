import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';

// Hook para análisis y métricas avanzadas
export const useAnalytics = () => {
  const { trends, trendingNow, alerts, user } = useStore();
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(false);

  // Generar datos de análisis de tendencias
  const generateTrendAnalytics = useCallback(() => {
    const allTrends = [...trends, ...trendingNow];
    
    if (allTrends.length === 0) return {};

    // Análisis por plataforma
    const platformAnalysis = allTrends.reduce((acc, trend) => {
      const platform = trend.platform;
      if (!acc[platform]) {
        acc[platform] = {
          count: 0,
          totalGrowth: 0,
          avgConfidence: 0,
          trends: []
        };
      }
      
      acc[platform].count += 1;
      acc[platform].totalGrowth += parseFloat(trend.growth.replace('%', '').replace('+', ''));
      acc[platform].avgConfidence += trend.confidence;
      acc[platform].trends.push(trend);
      
      return acc;
    }, {});

    // Calcular promedios
    Object.keys(platformAnalysis).forEach(platform => {
      const data = platformAnalysis[platform];
      data.avgGrowth = data.totalGrowth / data.count;
      data.avgConfidence = data.avgConfidence / data.count;
    });

    // Análisis por categoría
    const categoryAnalysis = allTrends.reduce((acc, trend) => {
      const category = trend.category || 'Sin categoría';
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          trends: [],
          avgConfidence: 0,
          totalGrowth: 0
        };
      }
      
      acc[category].count += 1;
      acc[category].trends.push(trend);
      acc[category].avgConfidence += trend.confidence;
      acc[category].totalGrowth += parseFloat(trend.growth.replace('%', '').replace('+', ''));
      
      return acc;
    }, {});

    // Calcular promedios por categoría
    Object.keys(categoryAnalysis).forEach(category => {
      const data = categoryAnalysis[category];
      data.avgConfidence = data.avgConfidence / data.count;
      data.avgGrowth = data.totalGrowth / data.count;
    });

    // Análisis temporal (simulado)
    const timeAnalysis = {
      last24h: allTrends.filter(t => {
        const created = new Date(t.createdAt);
        const now = new Date();
        return (now - created) < 24 * 60 * 60 * 1000;
      }).length,
      last7d: allTrends.length, // Simulado
      last30d: allTrends.length, // Simulado
      growth: {
        daily: '+12%',
        weekly: '+34%',
        monthly: '+89%'
      }
    };

    // Top tendencias por crecimiento
    const topTrends = [...allTrends]
      .sort((a, b) => {
        const aGrowth = parseFloat(a.growth.replace('%', '').replace('+', ''));
        const bGrowth = parseFloat(b.growth.replace('%', '').replace('+', ''));
        return bGrowth - aGrowth;
      })
      .slice(0, 10);

    // Análisis de confianza
    const confidenceAnalysis = {
      high: allTrends.filter(t => t.confidence >= 90).length,
      medium: allTrends.filter(t => t.confidence >= 70 && t.confidence < 90).length,
      low: allTrends.filter(t => t.confidence < 70).length,
      average: allTrends.reduce((sum, t) => sum + t.confidence, 0) / allTrends.length
    };

    return {
      platformAnalysis,
      categoryAnalysis,
      timeAnalysis,
      topTrends,
      confidenceAnalysis,
      totalTrends: allTrends.length,
      generatedAt: new Date().toISOString()
    };
  }, [trends, trendingNow]);

  // Generar métricas de rendimiento del usuario
  const generateUserMetrics = useCallback(() => {
    if (!user) return {};

    const followedTrends = [...trends, ...trendingNow].filter(t => t.isFollowing);
    const userAlerts = alerts.filter(a => !a.isRead);

    // Simular métricas de éxito
    const successMetrics = {
      predictionsCorrect: 23,
      predictionsTotal: 27,
      successRate: 85.2,
      trendsFollowed: followedTrends.length,
      alertsActive: userAlerts.length,
      streakDays: 12,
      totalSessions: 156,
      avgSessionTime: '8m 34s'
    };

    // Actividad por día de la semana
    const weeklyActivity = {
      Monday: 85,
      Tuesday: 92,
      Wednesday: 78,
      Thursday: 95,
      Friday: 88,
      Saturday: 65,
      Sunday: 45
    };

    // Categorías más seguidas
    const topCategories = followedTrends.reduce((acc, trend) => {
      const category = trend.category || 'Sin categoría';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return {
      successMetrics,
      weeklyActivity,
      topCategories,
      followedTrends: followedTrends.length,
      generatedAt: new Date().toISOString()
    };
  }, [user, trends, trendingNow, alerts]);

  // Generar datos para gráficos
  const generateChartData = useCallback((type = 'growth') => {
    const allTrends = [...trends, ...trendingNow];
    
    switch (type) {
      case 'growth':
        return {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Crecimiento Global',
              data: [12, 19, 23, 25, 22, 30],
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              tension: 0.4
            },
            {
              label: 'Predicciones IA',
              data: [8, 12, 18, 20, 25, 28],
              borderColor: '#00ff9d',
              backgroundColor: 'rgba(0, 255, 157, 0.1)',
              tension: 0.4
            }
          ]
        };

      case 'platforms':
        const platformData = allTrends.reduce((acc, trend) => {
          acc[trend.platform] = (acc[trend.platform] || 0) + 1;
          return acc;
        }, {});

        return {
          labels: Object.keys(platformData),
          datasets: [{
            data: Object.values(platformData),
            backgroundColor: [
              '#007bff',
              '#00ff9d',
              '#8b5cf6',
              '#f59e0b',
              '#ef4444'
            ],
            borderWidth: 0
          }]
        };

      case 'confidence':
        const confidenceBuckets = {
          'Alta (90-100%)': allTrends.filter(t => t.confidence >= 90).length,
          'Media (70-89%)': allTrends.filter(t => t.confidence >= 70 && t.confidence < 90).length,
          'Baja (0-69%)': allTrends.filter(t => t.confidence < 70).length
        };

        return {
          labels: Object.keys(confidenceBuckets),
          datasets: [{
            data: Object.values(confidenceBuckets),
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0
          }]
        };

      default:
        return {};
    }
  }, [trends, trendingNow]);

  // Generar reporte completo
  const generateReport = useCallback(async (options = {}) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular procesamiento
      
      const trendAnalytics = generateTrendAnalytics();
      const userMetrics = generateUserMetrics();
      
      const report = {
        summary: {
          totalTrends: trendAnalytics.totalTrends || 0,
          avgConfidence: trendAnalytics.confidenceAnalysis?.average || 0,
          topPlatform: Object.keys(trendAnalytics.platformAnalysis || {})[0] || 'N/A',
          userSuccessRate: userMetrics.successMetrics?.successRate || 0
        },
        trends: trendAnalytics,
        user: userMetrics,
        charts: {
          growth: generateChartData('growth'),
          platforms: generateChartData('platforms'),
          confidence: generateChartData('confidence')
        },
        recommendations: [
          'Enfócate en tendencias de TikTok para mayor engagement',
          'Las tendencias de tecnología muestran mayor confiabilidad',
          'Considera seguir más tendencias de entretenimiento'
        ],
        generatedAt: new Date().toISOString(),
        period: options.period || 'last_30_days'
      };

      setAnalyticsData(report);
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [generateTrendAnalytics, generateUserMetrics, generateChartData]);

  // Exportar datos
  const exportData = useCallback((format = 'json') => {
    const data = {
      trends: generateTrendAnalytics(),
      user: generateUserMetrics(),
      exportedAt: new Date().toISOString()
    };

    switch (format) {
      case 'json':
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json'
        });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `predix-analytics-${Date.now()}.json`;
        jsonLink.click();
        break;

      case 'csv':
        // Convertir a CSV (simplificado)
        const csvData = [
          ['Métrica', 'Valor'],
          ['Total Tendencias', data.trends.totalTrends || 0],
          ['Confianza Promedio', data.trends.confidenceAnalysis?.average || 0],
          ['Tasa de Éxito', data.user.successMetrics?.successRate || 0]
        ];
        
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvLink = document.createElement('a');
        csvLink.href = csvUrl;
        csvLink.download = `predix-analytics-${Date.now()}.csv`;
        csvLink.click();
        break;

      default:
        console.warn('Formato no soportado:', format);
    }
  }, [generateTrendAnalytics, generateUserMetrics]);

  // Actualizar analytics automáticamente
  useEffect(() => {
    const updateAnalytics = () => {
      const trendAnalytics = generateTrendAnalytics();
      const userMetrics = generateUserMetrics();
      
      setAnalyticsData({
        trends: trendAnalytics,
        user: userMetrics,
        lastUpdate: new Date().toISOString()
      });
    };

    updateAnalytics();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(updateAnalytics, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [generateTrendAnalytics, generateUserMetrics]);

  return {
    // Estado
    analyticsData,
    loading,
    
    // Generadores
    generateTrendAnalytics,
    generateUserMetrics,
    generateChartData,
    generateReport,
    
    // Utilidades
    exportData
  };
};
