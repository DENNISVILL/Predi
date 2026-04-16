import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell,
  Flame, 
  Zap, 
  TrendingUp, 
  Rocket, 
  Eye, 
  Heart, 
  Share2,
  Clock,
  Globe,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Star,
  Bookmark,
  Filter,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Plus,
  X,
  Search
} from 'lucide-react';
import useStore from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';

const AlertsModule = () => {
  const { user, savedTrends, saveTrend } = useStore();
  const { showToast, requestNotificationPermission } = useNotifications();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // 📈 DASHBOARD ANALÍTICO AVANZADO
  const [analyticsData, setAnalyticsData] = useState({
    realTimeMetrics: {
      alertsToday: 24,
      alertsThisWeek: 156,
      successRate: 73.5,
      avgResponseTime: 42,
      topPerformingType: 'viral'
    },
    platformActivity: {
      TikTok: { alerts: 45, success: 38, rate: 84.4 },
      Instagram: { alerts: 32, success: 24, rate: 75.0 },
      LinkedIn: { alerts: 28, success: 19, rate: 67.9 },
      Twitter: { alerts: 21, success: 14, rate: 66.7 },
      YouTube: { alerts: 18, success: 11, rate: 61.1 }
    },
    timelineData: [
      { time: '00:00', viral: 2, micro: 1, seguimiento: 0, recomendacion: 1 },
      { time: '03:00', viral: 1, micro: 2, seguimiento: 1, recomendacion: 0 },
      { time: '06:00', viral: 4, micro: 3, seguimiento: 2, recomendacion: 2 },
      { time: '09:00', viral: 8, micro: 5, seguimiento: 3, recomendacion: 4 },
      { time: '12:00', viral: 12, micro: 8, seguimiento: 5, recomendacion: 6 },
      { time: '15:00', viral: 15, micro: 10, seguimiento: 7, recomendacion: 8 },
      { time: '18:00', viral: 18, micro: 12, seguimiento: 8, recomendacion: 10 },
      { time: '21:00', viral: 10, micro: 7, seguimiento: 4, recomendacion: 5 }
    ],
    heatmapData: {
      Monday: [2, 1, 0, 1, 3, 5, 8, 12, 15, 18, 20, 16, 14, 10, 8, 6, 4, 3, 2, 1, 1, 0, 1, 2],
      Tuesday: [1, 0, 1, 2, 4, 6, 10, 14, 18, 22, 25, 20, 16, 12, 10, 8, 6, 4, 3, 2, 1, 1, 0, 1],
      Wednesday: [2, 1, 1, 3, 5, 8, 12, 16, 20, 24, 28, 22, 18, 14, 12, 10, 8, 6, 4, 3, 2, 1, 1, 2],
      Thursday: [1, 1, 0, 2, 4, 7, 11, 15, 19, 23, 26, 21, 17, 13, 11, 9, 7, 5, 4, 2, 2, 1, 0, 1],
      Friday: [3, 2, 1, 4, 6, 9, 13, 17, 21, 25, 30, 24, 20, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1, 2],
      Saturday: [2, 1, 1, 2, 3, 4, 6, 8, 10, 12, 15, 18, 20, 22, 18, 15, 12, 10, 8, 6, 4, 3, 2, 1],
      Sunday: [1, 0, 0, 1, 2, 3, 5, 7, 9, 11, 13, 15, 17, 19, 16, 13, 10, 8, 6, 4, 3, 2, 1, 1]
    },
    performanceMetrics: {
      alertsFollowed: 89,
      alertsIgnored: 67,
      successfulPredictions: 73,
      avgROI: 245,
      bestPerformingHour: '15:00',
      worstPerformingHour: '03:00'
    }
  });
  // 🎯 SISTEMA DE ALERTAS INTELIGENTES
  const [userProfile, setUserProfile] = useState({
    interests: ['tech', 'marketing', 'ai', 'startup'],
    preferredPlatforms: ['TikTok', 'Instagram', 'LinkedIn'],
    contentTypes: ['video', 'carousel', 'text'],
    targetAudience: 'millennials',
    industry: 'technology',
    location: 'Mexico',
    timezone: 'America/Mexico_City',
    activityHours: { start: 9, end: 18 },
    engagementHistory: {
      totalAlertsReceived: 156,
      alertsActedUpon: 89,
      successfulPredictions: 67,
      averageResponseTime: 45, // minutes
      preferredAlertTypes: ['viral', 'microtendencia']
    }
  });

  const [intelligentScoring, setIntelligentScoring] = useState({
    userBehaviorWeight: 0.4,
    trendMomentumWeight: 0.3,
    platformRelevanceWeight: 0.2,
    geographicRelevanceWeight: 0.1
  });

  const [alertSettings, setAlertSettings] = useState({
    microtendencias: true,
    viral: true,
    seguimiento: true,
    recomendaciones: true,
    // Nuevas configuraciones inteligentes
    aiPersonalization: true,
    geoTargeting: true,
    behaviorAnalysis: true,
    dynamicScoring: true,
    minConfidenceScore: 75,
    maxAlertsPerHour: 5,
    smartFiltering: true
  });

  // Datos simulados de alertas y microtendencias
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'viral',
      priority: 'high',
      title: '#SustainableTech2025 está explotando',
      description: 'Crecimiento del +340% en las últimas 2 horas. Predicción: alcanzará 10M de vistas en 6 horas.',
      trend: {
        name: '#SustainableTech2025',
        growth: '+340%',
        platform: 'TikTok',
        country: '🇲🇽',
        confidence: 96,
        viralScore: 98
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      isNew: true,
      action: 'Crear contenido AHORA'
    },
    {
      id: 2,
      type: 'microtendencia',
      priority: 'high',
      title: 'Nueva microtendencia detectada: #AIArt2025',
      description: 'Arte generado por IA está ganando tracción. Oportunidad temprana para creators.',
      trend: {
        name: '#AIArt2025',
        growth: '+89%',
        platform: 'Instagram',
        country: '🇺🇸',
        confidence: 87,
        viralScore: 45
      },
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
      isNew: true,
      action: 'Seguir tendencia'
    },
    {
      id: 3,
      type: 'seguimiento',
      priority: 'medium',
      title: '#VirtualFashion alcanzó tu objetivo',
      description: 'La tendencia que sigues llegó a +200% de crecimiento como predijiste.',
      trend: {
        name: '#VirtualFashion',
        growth: '+234%',
        platform: 'Instagram',
        country: '🇪🇸',
        confidence: 91,
        viralScore: 88
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      isNew: false,
      action: 'Ver análisis'
    },
    {
      id: 4,
      type: 'recomendacion',
      priority: 'medium',
      title: 'Recomendación IA: Momento perfecto para #EcoTravel',
      description: 'Basado en tu perfil, esta tendencia tiene 94% de compatibilidad contigo.',
      trend: {
        name: '#EcoTravel',
        growth: '+156%',
        platform: 'TikTok',
        country: '🇵🇪',
        confidence: 94,
        viralScore: 76
      },
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
      isNew: false,
      action: 'Explorar'
    },
    {
      id: 5,
      type: 'viral',
      priority: 'high',
      title: '🔥 #CryptoGaming está en llamas',
      description: 'Alcanzó el punto de inflexión viral. Engagement del 95% y creciendo exponencialmente.',
      trend: {
        name: '#CryptoGaming',
        growth: '+567%',
        platform: 'Twitter',
        country: '🇦🇷',
        confidence: 98,
        viralScore: 97
      },
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      isNew: false,
      action: 'Actuar YA'
    },
    {
      id: 6,
      type: 'microtendencia',
      priority: 'low',
      title: 'Emergente: #HealthTechWearables',
      description: 'Tecnología wearable de salud mostrando señales tempranas de crecimiento.',
      trend: {
        name: '#HealthTechWearables',
        growth: '+67%',
        platform: 'LinkedIn',
        country: '🇨🇴',
        confidence: 78,
        viralScore: 34
      },
      timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
      isNew: false,
      action: 'Monitorear'
    }
  ]);

  const filterTypes = [
    { id: 'all', label: 'Todas', icon: Bell, count: alerts.length },
    { id: 'viral', label: 'Virales', icon: Flame, count: alerts.filter(a => a.type === 'viral').length },
    { id: 'microtendencia', label: 'Micro', icon: Zap, count: alerts.filter(a => a.type === 'microtendencia').length },
    { id: 'seguimiento', label: 'Seguimiento', icon: Eye, count: alerts.filter(a => a.type === 'seguimiento').length },
    { id: 'recomendacion', label: 'IA', icon: Star, count: alerts.filter(a => a.type === 'recomendacion').length }
  ];

  const filteredAlerts = activeFilter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === activeFilter);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'viral': return Flame;
      case 'microtendencia': return Rocket;
      case 'seguimiento': return Eye;
      case 'recomendacion': return Star;
      default: return Bell;
    }
  };

  const getAlertColor = (type, priority) => {
    if (priority === 'high') {
      return type === 'viral' ? 'from-[#ff6b6b] to-[#feca57]' : 'from-[#007bff] to-[#00ff9d]';
    }
    return 'from-[#8b5cf6] to-[#ec4899]';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-[#ff6b6b]';
      case 'medium': return 'text-[#f59e0b]';
      case 'low': return 'text-[#10b981]';
      default: return 'text-gray-400';
    }
  };

  const handleAlertAction = (alert) => {
    switch (alert.action) {
      case 'Crear contenido AHORA':
      case 'Actuar YA':
        showToast(`Redirigiendo a crear contenido para ${alert.trend.name}`, 'success');
        break;
      case 'Seguir tendencia':
        saveTrend(alert.trend);
        showToast(`Siguiendo ${alert.trend.name}`, 'success');
        break;
      case 'Ver análisis':
        showToast(`Abriendo análisis de ${alert.trend.name}`, 'info');
        break;
      case 'Explorar':
        showToast(`Explorando ${alert.trend.name}`, 'info');
        break;
      case 'Monitorear':
        showToast(`Monitoreando ${alert.trend.name}`, 'info');
        break;
    }
  };

  const markAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isNew: false } : alert
    ));
  };

  const deleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    showToast('Alerta eliminada', 'success');
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsEnabled(true);
        showToast('Notificaciones activadas', 'success');
      }
    } else {
      setNotificationsEnabled(false);
      showToast('Notificaciones desactivadas', 'info');
    }
  };

  // 🤖 FUNCIONES DE IA PREDICTIVA AVANZADA
  const calculateIntelligentScore = (alert) => {
    const { userBehaviorWeight, trendMomentumWeight, platformRelevanceWeight, geographicRelevanceWeight } = intelligentScoring;
    
    // Análisis de comportamiento del usuario
    const behaviorScore = userProfile.interests.includes(alert.category) ? 100 : 
                         userProfile.preferredAlertTypes.includes(alert.type) ? 80 : 50;
    
    // Momentum de la tendencia
    const momentumScore = alert.trend.viralScore;
    
    // Relevancia de plataforma
    const platformScore = userProfile.preferredPlatforms.includes(alert.trend.platform) ? 100 : 60;
    
    // Relevancia geográfica
    const geoScore = alert.trend.country.includes(userProfile.location.slice(0, 2)) ? 100 : 70;
    
    const finalScore = (
      behaviorScore * userBehaviorWeight +
      momentumScore * trendMomentumWeight +
      platformScore * platformRelevanceWeight +
      geoScore * geographicRelevanceWeight
    );
    
    return Math.round(finalScore);
  };

  const analyzeUserBehavior = () => {
    const recentActions = alerts.filter(a => !a.isNew).slice(0, 10);
    const actionRate = recentActions.length > 0 ? 
      recentActions.filter(a => a.actedUpon).length / recentActions.length : 0.5;
    
    return {
      engagement: actionRate,
      preferredTypes: userProfile.preferredAlertTypes,
      activeHours: userProfile.activityHours,
      responseTime: userProfile.engagementHistory.averageResponseTime
    };
  };

  const generatePersonalizedAlert = (baseTrend) => {
    const behaviorAnalysis = analyzeUserBehavior();
    const intelligentScore = calculateIntelligentScore({
      type: 'recomendacion',
      category: baseTrend.category || 'general',
      trend: baseTrend
    });

    if (intelligentScore < alertSettings.minConfidenceScore) {
      return null; // No generar alerta si no cumple el mínimo
    }

    return {
      id: Date.now(),
      type: 'recomendacion',
      priority: intelligentScore > 85 ? 'high' : intelligentScore > 70 ? 'medium' : 'low',
      title: `🎯 Oportunidad personalizada: ${baseTrend.name}`,
      description: `IA detectó ${intelligentScore}% de compatibilidad con tu perfil. ${behaviorAnalysis.engagement > 0.7 ? 'Alta probabilidad de éxito' : 'Considera para análisis'}`,
      trend: {
        ...baseTrend,
        intelligentScore,
        personalizedReason: generatePersonalizationReason(baseTrend, behaviorAnalysis)
      },
      timestamp: new Date(),
      isNew: true,
      action: intelligentScore > 85 ? 'Actuar AHORA' : 'Analizar',
      aiGenerated: true,
      behaviorMatch: behaviorAnalysis.engagement
    };
  };

  const generatePersonalizationReason = (trend, behavior) => {
    const reasons = [];
    
    if (userProfile.preferredPlatforms.includes(trend.platform)) {
      reasons.push(`Plataforma preferida: ${trend.platform}`);
    }
    
    if (behavior.engagement > 0.7) {
      reasons.push('Alto engagement histórico');
    }
    
    if (trend.country.includes('🇲🇽') && userProfile.location === 'Mexico') {
      reasons.push('Relevancia geográfica');
    }
    
    return reasons.join(' • ');
  };

  const updateUserBehaviorProfile = (alertId, action) => {
    setUserProfile(prev => ({
      ...prev,
      engagementHistory: {
        ...prev.engagementHistory,
        totalAlertsReceived: prev.engagementHistory.totalAlertsReceived + 1,
        alertsActedUpon: action === 'acted' ? prev.engagementHistory.alertsActedUpon + 1 : prev.engagementHistory.alertsActedUpon,
        averageResponseTime: Math.max(30, prev.engagementHistory.averageResponseTime + (action === 'acted' ? -2 : 1))
      }
    }));
  };

  const getGeoRelevantTrends = () => {
    const userCountryCode = userProfile.location === 'Mexico' ? '🇲🇽' : '🇺🇸';
    return alerts.filter(alert => 
      alert.trend.country.includes(userCountryCode) || 
      alert.trend.country.includes('🌍') // Global trends
    );
  };

  // 🤖 AUTOMATIZACIÓN INTELIGENTE
  const [automationSettings, setAutomationSettings] = useState({
    autoFollow: true,
    autoContentCreation: true,
    smartScheduling: true,
    competitorAlerts: true,
    autoThreshold: 85, // Score mínimo para automatización
    maxAutoActions: 3, // Máximo acciones automáticas por hora
    autoCategories: ['viral', 'microtendencia']
  });

  const [automatedActions, setAutomatedActions] = useState([]);
  const [contentSuggestions, setContentSuggestions] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);

  // 🔔 SISTEMA DE NOTIFICACIONES AVANZADO
  const [notificationChannels, setNotificationChannels] = useState({
    push: { enabled: true, priority: ['high', 'medium'] },
    email: { enabled: true, priority: ['high'], schedule: { start: 9, end: 18 } },
    sms: { enabled: false, priority: ['high'], emergencyOnly: true },
    slack: { enabled: false, webhook: '', channels: ['#alerts', '#marketing'] },
    discord: { enabled: false, webhook: '', channels: ['alerts', 'trends'] },
    telegram: { enabled: false, botToken: '', chatId: '' }
  });

  const [notificationSchedule, setNotificationSchedule] = useState({
    workingHours: { start: 9, end: 18, timezone: 'America/Mexico_City' },
    weekends: false,
    nightMode: { enabled: true, start: 22, end: 7, onlyUrgent: true },
    customSchedules: {
      viral: { immediate: true, maxPerHour: 5 },
      microtendencia: { delay: 15, maxPerHour: 3 },
      seguimiento: { delay: 30, maxPerHour: 2 },
      recomendacion: { delay: 60, maxPerHour: 1 }
    }
  });

  const [escalationRules, setEscalationRules] = useState({
    enabled: true,
    thresholds: {
      viral: { score: 95, escalateAfter: 5 }, // minutos
      growth: { rate: 500, escalateAfter: 10 },
      engagement: { rate: 90, escalateAfter: 15 }
    },
    escalationChannels: ['push', 'email', 'sms'],
    maxEscalations: 3
  });

  const [dailySummary, setDailySummary] = useState({
    enabled: true,
    time: '18:00',
    includeMetrics: true,
    includeRecommendations: true,
    includeTopTrends: true,
    channels: ['email', 'push']
  });

  const [weeklySummary, setWeeklySummary] = useState({
    enabled: true,
    day: 'friday',
    time: '17:00',
    includeAnalytics: true,
    includeROI: true,
    includeGoals: true,
    channels: ['email']
  });

  // Funciones del sistema de notificaciones
  const sendNotification = async (alert, channel, options = {}) => {
    const { priority = 'medium', immediate = false } = options;
    
    // Verificar si el canal está habilitado
    if (!notificationChannels[channel]?.enabled) return false;
    
    // Verificar prioridad del canal
    if (!notificationChannels[channel].priority.includes(priority)) return false;
    
    // Verificar horarios
    if (!immediate && !isWithinNotificationHours(channel)) return false;
    
    const notificationData = {
      id: Date.now(),
      alertId: alert.id,
      channel,
      title: alert.title,
      message: alert.description,
      priority,
      timestamp: new Date(),
      status: 'sent'
    };

    // Simular envío según el canal
    switch (channel) {
      case 'push':
        await sendPushNotification(notificationData);
        break;
      case 'email':
        await sendEmailNotification(notificationData);
        break;
      case 'sms':
        await sendSMSNotification(notificationData);
        break;
      case 'slack':
        await sendSlackNotification(notificationData);
        break;
      case 'discord':
        await sendDiscordNotification(notificationData);
        break;
      case 'telegram':
        await sendTelegramNotification(notificationData);
        break;
    }

    showToast(`📱 Notificación enviada vía ${channel.toUpperCase()}`, 'success');
    return true;
  };

  const isWithinNotificationHours = (channel) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Verificar fines de semana
    if (!notificationSchedule.weekends && (currentDay === 0 || currentDay === 6)) {
      return false;
    }
    
    // Verificar modo nocturno
    if (notificationSchedule.nightMode.enabled) {
      const { start, end, onlyUrgent } = notificationSchedule.nightMode;
      const isNightTime = currentHour >= start || currentHour < end;
      if (isNightTime && !onlyUrgent) return false;
    }
    
    // Verificar horario laboral
    const { start, end } = notificationSchedule.workingHours;
    return currentHour >= start && currentHour < end;
  };

  const sendPushNotification = async (data) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.message,
        icon: '/favicon.ico',
        tag: data.alertId,
        requireInteraction: data.priority === 'high'
      });
    }
  };

  const sendEmailNotification = async (data) => {
    // Simular envío de email
    console.log(`📧 Email enviado: ${data.title}`);
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const sendSMSNotification = async (data) => {
    // Simular envío de SMS
    console.log(`📱 SMS enviado: ${data.title}`);
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  const sendSlackNotification = async (data) => {
    // Simular webhook de Slack
    console.log(`💬 Slack enviado: ${data.title}`);
    return new Promise(resolve => setTimeout(resolve, 800));
  };

  const sendDiscordNotification = async (data) => {
    // Simular webhook de Discord
    console.log(`🎮 Discord enviado: ${data.title}`);
    return new Promise(resolve => setTimeout(resolve, 800));
  };

  const sendTelegramNotification = async (data) => {
    // Simular bot de Telegram
    console.log(`✈️ Telegram enviado: ${data.title}`);
    return new Promise(resolve => setTimeout(resolve, 600));
  };

  // Escalado automático de urgencia
  const checkEscalation = (alert) => {
    if (!escalationRules.enabled) return;
    
    const { thresholds } = escalationRules;
    let shouldEscalate = false;
    
    // Verificar thresholds
    if (alert.trend.viralScore >= thresholds.viral.score) shouldEscalate = true;
    if (parseInt(alert.trend.growth.replace(/[+%]/g, '')) >= thresholds.growth.rate) shouldEscalate = true;
    
    if (shouldEscalate) {
      escalationRules.escalationChannels.forEach(channel => {
        sendNotification(alert, channel, { priority: 'high', immediate: true });
      });
      
      showToast(`🚨 Alerta escalada por alta urgencia`, 'warning');
    }
  };

  // Generar resumen diario
  const generateDailySummary = () => {
    const today = new Date().toDateString();
    const todayAlerts = alerts.filter(alert => 
      alert.timestamp.toDateString() === today
    );
    
    const summary = {
      date: today,
      totalAlerts: todayAlerts.length,
      viralAlerts: todayAlerts.filter(a => a.type === 'viral').length,
      microTrends: todayAlerts.filter(a => a.type === 'microtendencia').length,
      topTrend: todayAlerts.sort((a, b) => b.trend.viralScore - a.trend.viralScore)[0],
      recommendations: todayAlerts.filter(a => a.type === 'recomendacion').length,
      actionsTaken: todayAlerts.filter(a => !a.isNew).length,
      successRate: Math.round((todayAlerts.filter(a => !a.isNew).length / todayAlerts.length) * 100) || 0
    };
    
    const summaryMessage = `📊 Resumen del día:
    • ${summary.totalAlerts} alertas recibidas
    • ${summary.viralAlerts} tendencias virales
    • ${summary.microTrends} microtendencias
    • ${summary.actionsTaken} acciones tomadas
    • ${summary.successRate}% tasa de respuesta
    ${summary.topTrend ? `🔥 Top trend: ${summary.topTrend.trend.name}` : ''}`;
    
    dailySummary.channels.forEach(channel => {
      sendNotification({
        id: Date.now(),
        title: '📊 Resumen Diario - Predix',
        description: summaryMessage,
        type: 'summary'
      }, channel, { priority: 'medium', immediate: true });
    });
  };

  // Generar resumen semanal
  const generateWeeklySummary = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekAlerts = alerts.filter(alert => alert.timestamp >= weekAgo);
    
    const summary = {
      totalAlerts: weekAlerts.length,
      avgDaily: Math.round(weekAlerts.length / 7),
      bestDay: 'Viernes', // Simulado
      topPlatform: 'TikTok', // Simulado
      roi: '+245%', // Simulado
      goalsAchieved: 3,
      totalGoals: 5
    };
    
    const summaryMessage = `📈 Resumen Semanal:
    • ${summary.totalAlerts} alertas totales
    • ${summary.avgDaily} promedio diario
    • Mejor día: ${summary.bestDay}
    • Top plataforma: ${summary.topPlatform}
    • ROI promedio: ${summary.roi}
    • Objetivos: ${summary.goalsAchieved}/${summary.totalGoals}`;
    
    weeklySummary.channels.forEach(channel => {
      sendNotification({
        id: Date.now(),
        title: '📈 Resumen Semanal - Predix',
        description: summaryMessage,
        type: 'weekly_summary'
      }, channel, { priority: 'medium', immediate: true });
    });
  };

  // 📊 ANÁLISIS Y REPORTES AVANZADOS
  const [reportData, setReportData] = useState({
    roiAnalysis: {
      alertsFollowed: 89,
      alertsIgnored: 67,
      avgROIFollowed: 245,
      avgROIIgnored: -15,
      totalInvestment: 15000,
      totalReturn: 52000,
      netROI: 247
    },
    effectivenessAnalysis: {
      byContentType: {
        video: { alerts: 45, success: 38, roi: 280 },
        carousel: { alerts: 32, success: 24, roi: 220 },
        text: { alerts: 28, success: 19, roi: 180 },
        story: { alerts: 21, success: 14, roi: 160 }
      },
      byPlatform: {
        TikTok: { effectiveness: 84.4, avgViews: 125000, avgEngagement: 8.2 },
        Instagram: { effectiveness: 75.0, avgViews: 85000, avgEngagement: 6.8 },
        LinkedIn: { effectiveness: 67.9, avgViews: 25000, avgEngagement: 4.5 },
        Twitter: { effectiveness: 66.7, avgViews: 45000, avgEngagement: 3.2 }
      },
      byTimeOfDay: {
        morning: { alerts: 23, success: 15, rate: 65.2 },
        afternoon: { alerts: 45, success: 38, rate: 84.4 },
        evening: { alerts: 67, success: 52, rate: 77.6 },
        night: { alerts: 21, success: 12, rate: 57.1 }
      }
    },
    competitorComparison: {
      myPerformance: {
        alertsPerWeek: 156,
        responseRate: 73.5,
        avgROI: 245,
        topPlatform: 'TikTok'
      },
      competitors: [
        { name: 'TechCorp', alertsPerWeek: 134, responseRate: 68.2, avgROI: 198 },
        { name: 'DigitalPro', alertsPerWeek: 189, responseRate: 71.8, avgROI: 223 },
        { name: 'StartupGuru', alertsPerWeek: 145, responseRate: 69.5, avgROI: 187 }
      ],
      marketPosition: 'Top 25%',
      improvementAreas: ['Respuesta nocturna', 'Contenido de video', 'Engagement LinkedIn']
    }
  });

  // Calcular ROI de alertas seguidas vs ignoradas
  const calculateAlertROI = (alert, followed = true) => {
    const baseROI = followed ? 
      Math.floor(Math.random() * 300 + 150) : // 150-450% para seguidas
      Math.floor(Math.random() * 50 - 25); // -25% a +25% para ignoradas
    
    // Ajustar por factores
    const platformMultiplier = {
      TikTok: 1.2,
      Instagram: 1.1,
      LinkedIn: 0.9,
      Twitter: 0.8,
      YouTube: 1.0
    };
    
    const priorityMultiplier = {
      high: 1.3,
      medium: 1.0,
      low: 0.7
    };
    
    return Math.round(baseROI * 
      (platformMultiplier[alert.trend.platform] || 1.0) * 
      (priorityMultiplier[alert.priority] || 1.0)
    );
  };

  // Análisis de efectividad por tipo de contenido
  const analyzeContentEffectiveness = () => {
    const contentAnalysis = {};
    
    alerts.forEach(alert => {
      const contentType = alert.contentType || 'general';
      if (!contentAnalysis[contentType]) {
        contentAnalysis[contentType] = {
          total: 0,
          followed: 0,
          avgROI: 0,
          totalROI: 0
        };
      }
      
      contentAnalysis[contentType].total++;
      if (!alert.isNew) {
        contentAnalysis[contentType].followed++;
        const roi = calculateAlertROI(alert, true);
        contentAnalysis[contentType].totalROI += roi;
      }
    });
    
    // Calcular promedios
    Object.keys(contentAnalysis).forEach(type => {
      const data = contentAnalysis[type];
      data.successRate = data.followed > 0 ? (data.followed / data.total * 100).toFixed(1) : 0;
      data.avgROI = data.followed > 0 ? Math.round(data.totalROI / data.followed) : 0;
    });
    
    return contentAnalysis;
  };

  // Generar reporte exportable
  const generateExportableReport = (format = 'json') => {
    const reportDate = new Date().toISOString().split('T')[0];
    const contentAnalysis = analyzeContentEffectiveness();
    
    const fullReport = {
      metadata: {
        generatedAt: new Date().toISOString(),
        reportPeriod: '30 days',
        userId: user?.id || 'demo',
        version: '2.0'
      },
      summary: {
        totalAlerts: alerts.length,
        alertsFollowed: alerts.filter(a => !a.isNew).length,
        alertsIgnored: alerts.filter(a => a.isNew).length,
        overallROI: reportData.roiAnalysis.netROI,
        successRate: analyticsData.realTimeMetrics.successRate
      },
      roiAnalysis: reportData.roiAnalysis,
      effectivenessAnalysis: {
        ...reportData.effectivenessAnalysis,
        contentTypeAnalysis: contentAnalysis
      },
      competitorComparison: reportData.competitorComparison,
      recommendations: generateRecommendations(),
      rawData: alerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        priority: alert.priority,
        platform: alert.trend.platform,
        viralScore: alert.trend.viralScore,
        followed: !alert.isNew,
        estimatedROI: calculateAlertROI(alert, !alert.isNew),
        timestamp: alert.timestamp
      }))
    };
    
    if (format === 'csv') {
      return convertToCSV(fullReport.rawData);
    }
    
    return JSON.stringify(fullReport, null, 2);
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  // Generar recomendaciones basadas en análisis
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Análisis de horarios
    const bestHour = analyticsData.performanceMetrics.bestPerformingHour;
    recommendations.push({
      type: 'timing',
      priority: 'high',
      title: 'Optimizar horarios de respuesta',
      description: `Tu mejor hora es ${bestHour}. Configura alertas prioritarias para este horario.`,
      expectedImpact: '+15% ROI'
    });
    
    // Análisis de plataformas
    const topPlatform = Object.entries(analyticsData.platformActivity)
      .sort(([,a], [,b]) => b.rate - a.rate)[0];
    
    recommendations.push({
      type: 'platform',
      priority: 'medium',
      title: `Enfocar en ${topPlatform[0]}`,
      description: `${topPlatform[0]} tiene tu mejor tasa de éxito (${topPlatform[1].rate}%). Aumenta la frecuencia aquí.`,
      expectedImpact: '+12% engagement'
    });
    
    // Análisis de competencia
    const myROI = reportData.competitorComparison.myPerformance.avgROI;
    const avgCompetitorROI = reportData.competitorComparison.competitors
      .reduce((sum, comp) => sum + comp.avgROI, 0) / reportData.competitorComparison.competitors.length;
    
    if (myROI > avgCompetitorROI) {
      recommendations.push({
        type: 'competitive',
        priority: 'low',
        title: 'Mantener ventaja competitiva',
        description: `Estás ${Math.round(((myROI - avgCompetitorROI) / avgCompetitorROI) * 100)}% por encima del promedio. Mantén la estrategia actual.`,
        expectedImpact: 'Liderazgo sostenido'
      });
    } else {
      recommendations.push({
        type: 'competitive',
        priority: 'high',
        title: 'Mejorar competitividad',
        description: `Estás ${Math.round(((avgCompetitorROI - myROI) / avgCompetitorROI) * 100)}% por debajo del promedio. Revisa estrategia.`,
        expectedImpact: '+25% ROI potencial'
      });
    }
    
    return recommendations;
  };

  // Exportar reporte
  const exportReport = (format) => {
    const reportContent = generateExportableReport(format);
    const fileName = `predix-alerts-report-${new Date().toISOString().split('T')[0]}.${format}`;
    
    const blob = new Blob([reportContent], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`📊 Reporte exportado: ${fileName}`, 'success');
  };

  // Comparar con competidores
  const compareWithCompetitors = () => {
    const comparison = reportData.competitorComparison;
    const myPerf = comparison.myPerformance;
    
    const results = {
      alertsRanking: comparison.competitors.filter(c => c.alertsPerWeek > myPerf.alertsPerWeek).length + 1,
      responseRanking: comparison.competitors.filter(c => c.responseRate > myPerf.responseRate).length + 1,
      roiRanking: comparison.competitors.filter(c => c.avgROI > myPerf.avgROI).length + 1,
      overallRanking: comparison.marketPosition
    };
    
    showToast(`📊 Ranking: #${results.roiRanking} en ROI, #${results.responseRanking} en respuesta`, 'info');
    return results;
  };

  // Auto-seguimiento de tendencias prometedoras
  const autoFollowTrend = (alert) => {
    if (!automationSettings.autoFollow) return;
    
    const score = calculateIntelligentScore(alert);
    if (score >= automationSettings.autoThreshold) {
      saveTrend(alert.trend);
      
      const action = {
        id: Date.now(),
        type: 'auto_follow',
        alertId: alert.id,
        trendName: alert.trend.name,
        score,
        timestamp: new Date(),
        status: 'completed'
      };
      
      setAutomatedActions(prev => [action, ...prev.slice(0, 9)]);
      showToast(`🤖 Auto-seguimiento: ${alert.trend.name}`, 'success');
    }
  };

  // Creación automática de contenido sugerido
  const generateContentSuggestion = (alert) => {
    if (!automationSettings.autoContentCreation) return;
    
    const contentTypes = {
      TikTok: ['Video corto', 'Trend dance', 'Tutorial rápido'],
      Instagram: ['Carousel', 'Reel', 'Story series'],
      LinkedIn: ['Post profesional', 'Artículo', 'Infografía'],
      Twitter: ['Thread', 'Tweet viral', 'Encuesta'],
      YouTube: ['Video explicativo', 'Short', 'Live stream']
    };

    const platform = alert.trend.platform;
    const suggestedType = contentTypes[platform]?.[Math.floor(Math.random() * contentTypes[platform].length)] || 'Post';
    
    const suggestion = {
      id: Date.now(),
      alertId: alert.id,
      trendName: alert.trend.name,
      platform,
      contentType: suggestedType,
      title: `${suggestedType} sobre ${alert.trend.name}`,
      description: generateContentDescription(alert.trend, suggestedType),
      estimatedReach: Math.floor(Math.random() * 50000 + 10000),
      difficulty: ['Fácil', 'Medio', 'Difícil'][Math.floor(Math.random() * 3)],
      timeToCreate: Math.floor(Math.random() * 120 + 30), // 30-150 minutos
      aiGenerated: true,
      timestamp: new Date()
    };

    setContentSuggestions(prev => [suggestion, ...prev.slice(0, 4)]);
    showToast(`💡 Contenido sugerido para ${alert.trend.name}`, 'info');
  };

  const generateContentDescription = (trend, contentType) => {
    const templates = {
      'Video corto': `Crea un video de 15-30 segundos explicando ${trend.name}. Usa música trending y efectos visuales llamativos.`,
      'Carousel': `Diseña un carousel de 5-7 slides sobre ${trend.name}. Incluye estadísticas, tips y call-to-action.`,
      'Post profesional': `Escribe un post reflexivo sobre el impacto de ${trend.name} en tu industria. Añade insights únicos.`,
      'Thread': `Crea un hilo de 5-8 tweets explicando ${trend.name}. Usa datos, ejemplos y hashtags relevantes.`,
      'Reel': `Graba un Reel dinámico sobre ${trend.name}. Combina educación y entretenimiento.`
    };
    
    return templates[contentType] || `Crea contenido engaging sobre ${trend.name} para maximizar el alcance.`;
  };

  // Programación inteligente de publicaciones
  const scheduleIntelligentPost = (suggestion) => {
    if (!automationSettings.smartScheduling) return;
    
    const optimalTimes = {
      TikTok: ['19:00', '21:00', '15:00'],
      Instagram: ['18:00', '20:00', '12:00'],
      LinkedIn: ['08:00', '12:00', '17:00'],
      Twitter: ['09:00', '15:00', '21:00'],
      YouTube: ['14:00', '20:00', '22:00']
    };

    const platform = suggestion.platform;
    const bestTimes = optimalTimes[platform] || ['12:00', '18:00', '20:00'];
    const scheduledTime = bestTimes[Math.floor(Math.random() * bestTimes.length)];
    
    // Programar para el próximo día hábil
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hour, minute] = scheduledTime.split(':');
    tomorrow.setHours(parseInt(hour), parseInt(minute), 0, 0);

    const scheduledPost = {
      id: Date.now(),
      suggestionId: suggestion.id,
      title: suggestion.title,
      platform: suggestion.platform,
      scheduledTime: tomorrow,
      status: 'scheduled',
      estimatedReach: suggestion.estimatedReach,
      autoScheduled: true
    };

    setScheduledPosts(prev => [scheduledPost, ...prev.slice(0, 9)]);
    showToast(`📅 Programado para ${scheduledTime} en ${platform}`, 'success');
  };

  // Alertas de competencia automáticas
  const generateCompetitorAlert = () => {
    if (!automationSettings.competitorAlerts) return;

    const competitors = ['TechCorp', 'DigitalPro', 'StartupGuru', 'InnovateCo'];
    const actions = ['lanzó campaña viral', 'alcanzó 1M views', 'trending en', 'colaboró con influencer'];
    
    const competitor = competitors[Math.floor(Math.random() * competitors.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const platform = ['TikTok', 'Instagram', 'LinkedIn'][Math.floor(Math.random() * 3)];

    const competitorAlert = {
      id: Date.now(),
      type: 'competencia',
      priority: 'medium',
      title: `🚨 ${competitor} ${action} en ${platform}`,
      description: `Tu competidor está ganando tracción. Analiza su estrategia y considera una respuesta rápida.`,
      trend: {
        name: `#${competitor}Strategy`,
        growth: '+' + Math.floor(Math.random() * 200 + 100) + '%',
        platform,
        country: '🌍',
        confidence: Math.floor(Math.random() * 20 + 70),
        viralScore: Math.floor(Math.random() * 40 + 60)
      },
      timestamp: new Date(),
      isNew: true,
      action: 'Analizar competencia',
      competitor,
      autoGenerated: true
    };

    setAlerts(prev => [competitorAlert, ...prev.slice(0, 9)]);
    showToast(`🚨 Alerta de competencia: ${competitor}`, 'warning');
  };

  // Ejecutar automatizaciones cuando llegan nuevas alertas
  const processAutomation = (alert) => {
    if (!automationSettings.autoCategories.includes(alert.type)) return;
    
    const currentHour = new Date().getHours();
    const recentAutoActions = automatedActions.filter(
      action => new Date() - action.timestamp < 3600000 // Última hora
    );

    if (recentAutoActions.length >= automationSettings.maxAutoActions) {
      return; // Límite de acciones automáticas alcanzado
    }

    // Ejecutar automatizaciones con delay para simular procesamiento
    setTimeout(() => autoFollowTrend(alert), 1000);
    setTimeout(() => generateContentSuggestion(alert), 2000);
  };

  // Simular nuevas alertas cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        type: ['viral', 'microtendencia', 'recomendacion'][Math.floor(Math.random() * 3)],
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        title: 'Nueva oportunidad detectada',
        description: 'La IA ha encontrado una nueva tendencia que coincide con tus intereses.',
        trend: {
          name: '#NewTrend' + Math.floor(Math.random() * 1000),
          growth: '+' + Math.floor(Math.random() * 200 + 50) + '%',
          platform: ['TikTok', 'Instagram', 'Twitter'][Math.floor(Math.random() * 3)],
          country: ['🇲🇽', '🇺🇸', '🇪🇸'][Math.floor(Math.random() * 3)],
          confidence: Math.floor(Math.random() * 30 + 70),
          viralScore: Math.floor(Math.random() * 100)
        },
        timestamp: new Date(),
        isNew: true,
        action: 'Explorar'
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Mantener solo 10 alertas
      
      if (notificationsEnabled) {
        showToast('Nueva alerta recibida', 'info');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [notificationsEnabled, showToast]);

  return (
    <div className="p-6 min-h-screen custom-scrollbar">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Alertas y Microtendencias</h1>
            <p className="text-gray-400 text-lg">
              Mantente al día con las oportunidades más prometedoras • {alerts.filter(a => a.isNew).length} nuevas
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              onClick={toggleNotifications}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                notificationsEnabled 
                  ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30' 
                  : 'bg-gray-700 text-gray-400 border border-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {notificationsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {notificationsEnabled ? 'Activas' : 'Inactivas'}
            </motion.button>
            
            <motion.button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                showAnalytics 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-4 h-4" />
              {showAnalytics ? 'Ocultar Analytics' : 'Ver Analytics'}
            </motion.button>
            
            <motion.button
              className="btn-ghost flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-4 h-4" />
              Configurar
            </motion.button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card text-center">
            <Flame className="w-6 h-6 text-[#ff6b6b] mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{alerts.filter(a => a.type === 'viral').length}</div>
            <div className="text-gray-400 text-sm">Virales</div>
          </div>
          <div className="card text-center">
            <Rocket className="w-6 h-6 text-[#007bff] mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{alerts.filter(a => a.type === 'microtendencia').length}</div>
            <div className="text-gray-400 text-sm">Micro</div>
          </div>
          <div className="card text-center">
            <Eye className="w-6 h-6 text-[#00ff9d] mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{alerts.filter(a => a.type === 'seguimiento').length}</div>
            <div className="text-gray-400 text-sm">Seguimiento</div>
          </div>
          <div className="card text-center">
            <Star className="w-6 h-6 text-[#8b5cf6] mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{alerts.filter(a => a.type === 'recomendacion').length}</div>
            <div className="text-gray-400 text-sm">IA</div>
          </div>
        </div>

        {/* 📈 DASHBOARD ANALÍTICO AVANZADO */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              className="mt-8 space-y-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Métricas en Tiempo Real */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <motion.div
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/30 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{analyticsData.realTimeMetrics.alertsToday}</div>
                    <div className="text-xs text-gray-400">Alertas Hoy</div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/30 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{analyticsData.realTimeMetrics.successRate}%</div>
                    <div className="text-xs text-gray-400">Tasa de Éxito</div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{analyticsData.realTimeMetrics.avgResponseTime}m</div>
                    <div className="text-xs text-gray-400">Tiempo Respuesta</div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl border border-orange-500/30 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{analyticsData.realTimeMetrics.alertsThisWeek}</div>
                    <div className="text-xs text-gray-400">Esta Semana</div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 rounded-xl border border-yellow-500/30 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400 capitalize">{analyticsData.realTimeMetrics.topPerformingType}</div>
                    <div className="text-xs text-gray-400">Mejor Tipo</div>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actividad por Plataforma */}
                <motion.div
                  className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl border border-gray-600/30 p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Actividad por Plataforma
                  </h3>
                  
                  <div className="space-y-3">
                    {Object.entries(analyticsData.platformActivity).map(([platform, data], index) => (
                      <motion.div
                        key={platform}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">{platform[0]}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{platform}</div>
                            <div className="text-gray-400 text-sm">{data.alerts} alertas</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-green-400 font-bold">{data.rate}%</div>
                          <div className="text-gray-400 text-sm">{data.success}/{data.alerts}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Timeline de Alertas */}
                <motion.div
                  className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl border border-gray-600/30 p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Timeline de Hoy
                  </h3>
                  
                  <div className="space-y-2">
                    {analyticsData.timelineData.map((data, index) => (
                      <motion.div
                        key={data.time}
                        className="flex items-center gap-4 p-2 hover:bg-gray-600/20 rounded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                      >
                        <div className="text-gray-400 text-sm w-12">{data.time}</div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs text-gray-300">{data.viral}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-300">{data.micro}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-300">{data.seguimiento}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-xs text-gray-300">{data.recomendacion}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Heatmap Semanal */}
              <motion.div
                className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl border border-gray-600/30 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Heatmap de Actividad Semanal
                </h3>
                
                <div className="space-y-2">
                  {Object.entries(analyticsData.heatmapData).map(([day, hours], dayIndex) => (
                    <motion.div
                      key={day}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + dayIndex * 0.1 }}
                    >
                      <div className="w-16 text-gray-400 text-sm">{day.slice(0, 3)}</div>
                      <div className="flex gap-1">
                        {hours.map((intensity, hourIndex) => (
                          <div
                            key={hourIndex}
                            className={`w-3 h-3 rounded-sm ${
                              intensity === 0 ? 'bg-gray-700' :
                              intensity <= 5 ? 'bg-green-900' :
                              intensity <= 15 ? 'bg-green-700' :
                              intensity <= 25 ? 'bg-green-500' :
                              'bg-green-300'
                            }`}
                            title={`${hourIndex}:00 - ${intensity} alertas`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600/30">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Menos</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                    </div>
                    <span>Más</span>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    Mejor hora: <span className="text-green-400 font-medium">{analyticsData.performanceMetrics.bestPerformingHour}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filtros */}
      <motion.div
        className="flex gap-2 mb-6 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {filterTypes.map((filter) => (
          <motion.button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white'
                : 'bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <filter.icon className="w-4 h-4" />
            {filter.label}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-600'
            }`}>
              {filter.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Lista de Alertas */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence>
          {filteredAlerts.map((alert, index) => {
            const AlertIcon = getAlertIcon(alert.type);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`card-hover relative overflow-hidden ${alert.isNew ? 'ring-2 ring-[#00ff9d]/50' : ''}`}
                onClick={() => markAsRead(alert.id)}
              >
                {/* Indicador de nueva alerta */}
                {alert.isNew && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-[#00ff9d] rounded-full animate-pulse"></div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icono de alerta */}
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${getAlertColor(alert.type, alert.priority)} flex-shrink-0`}>
                    <AlertIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Contenido principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{alert.title}</h3>
                        <p className="text-gray-400 text-sm">{alert.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(alert.priority)} bg-current/20`}>
                          {alert.priority.toUpperCase()}
                        </span>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAlert(alert.id);
                          }}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Información de la tendencia */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl">{alert.trend.country}</span>
                        <span className="text-white font-semibold">{alert.trend.name}</span>
                      </div>
                      <div className="text-[#00ff9d] font-bold">{alert.trend.growth}</div>
                      <div className="text-gray-400">{alert.trend.platform}</div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <BarChart3 className="w-3 h-3" />
                        {alert.trend.confidence}%
                      </div>
                      {alert.trend.viralScore >= 90 && (
                        <div className="text-xs px-2 py-1 bg-gradient-to-r from-[#ff6b6b] to-[#feca57] text-white rounded-full font-bold">
                          🔥 VIRAL
                        </div>
                      )}
                    </div>

                    {/* Acciones y timestamp */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAlertAction(alert);
                          }}
                          className={`btn-primary text-sm ${
                            alert.priority === 'high' ? 'animate-pulse' : ''
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {alert.action}
                        </motion.button>
                        
                        <div className="flex items-center gap-2">
                          <motion.button
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className="w-4 h-4 text-gray-400" />
                          </motion.button>
                          <motion.button
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Share2 className="w-4 h-4 text-gray-400" />
                          </motion.button>
                          <motion.button
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Bookmark className="w-4 h-4 text-gray-400" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay alertas</h3>
            <p className="text-gray-400">
              {activeFilter === 'all' 
                ? 'No tienes alertas en este momento' 
                : `No hay alertas de tipo "${filterTypes.find(f => f.id === activeFilter)?.label}"`
              }
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Configuración de alertas flotante */}
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <motion.button
          className="w-14 h-14 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => showToast('Configuración de alertas próximamente', 'info')}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AlertsModule;
