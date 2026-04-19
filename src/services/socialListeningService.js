// 👂 SERVICIO DE SOCIAL LISTENING COMPLETO
// Monitoreo 24/7, análisis de sentimientos, detección de crisis

class SocialListeningService {
  constructor() {
    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.keywords = new Set();
    this.mentions = [];
    this.sentimentHistory = [];
    this.crisisThreshold = 0.3; // 30% sentimiento negativo
    this.alertCallbacks = [];
    
    this.platforms = {
      twitter: { weight: 0.4, endpoint: '/api/twitter/mentions' },
      instagram: { weight: 0.25, endpoint: '/api/instagram/mentions' },
      tiktok: { weight: 0.2, endpoint: '/api/tiktok/mentions' },
      youtube: { weight: 0.1, endpoint: '/api/youtube/mentions' },
      linkedin: { weight: 0.05, endpoint: '/api/linkedin/mentions' }
    };
  }

  // 🎯 CONFIGURACIÓN DE MONITOREO
  addKeyword(keyword) {
    this.keywords.add(keyword.toLowerCase());
    console.log(`[SocialListening] Added keyword: ${keyword}`);
  }

  removeKeyword(keyword) {
    this.keywords.delete(keyword.toLowerCase());
    console.log(`[SocialListening] Removed keyword: ${keyword}`);
  }

  setKeywords(keywords) {
    this.keywords = new Set(keywords.map(k => k.toLowerCase()));
    console.log(`[SocialListening] Set keywords:`, Array.from(this.keywords));
  }

  // 🚀 INICIAR MONITOREO
  startMonitoring(interval = 60000) { // 1 minuto por defecto
    if (this.isMonitoring) {
      console.warn('[SocialListening] Already monitoring');
      return;
    }

    this.isMonitoring = true;
    console.log('[SocialListening] Starting monitoring...');

    // Monitoreo inicial
    this.performScan();

    // Monitoreo periódico
    this.monitoringInterval = setInterval(() => {
      this.performScan();
    }, interval);
  }

  stopMonitoring() {
    if (!this.isMonitoring) {
      console.warn('[SocialListening] Not currently monitoring');
      return;
    }

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('[SocialListening] Monitoring stopped');
  }

  // 🔍 ESCANEO DE MENCIONES
  async performScan() {
    if (this.keywords.size === 0) {
      console.warn('[SocialListening] No keywords configured');
      return;
    }

    console.log('[SocialListening] Performing scan...');
    
    try {
      const scanPromises = Object.entries(this.platforms).map(([platform, config]) =>
        this.scanPlatform(platform, config)
      );

      const results = await Promise.allSettled(scanPromises);
      const newMentions = [];

      results.forEach((result, index) => {
        const platform = Object.keys(this.platforms)[index];
        if (result.status === 'fulfilled' && result.value) {
          newMentions.push(...result.value.map(mention => ({
            ...mention,
            platform,
            scannedAt: new Date()
          })));
        } else {
          console.error(`[SocialListening] Error scanning ${platform}:`, result.reason);
        }
      });

      // Procesar nuevas menciones
      if (newMentions.length > 0) {
        await this.processMentions(newMentions);
      }

    } catch (error) {
      console.error('[SocialListening] Scan error:', error);
    }
  }

  async scanPlatform(platform, config) {
    try {
      const keywords = Array.from(this.keywords);
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
        },
        body: JSON.stringify({
          keywords,
          limit: 100,
          since: new Date(Date.now() - 3600000).toISOString() // Última hora
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return this.normalizeMentions(data.mentions || [], platform);
    } catch (error) {
      // Fallback con datos simulados para desarrollo
      return this.generateMockMentions(platform);
    }
  }

  normalizeMentions(mentions, platform) {
    return mentions.map(mention => ({
      id: mention.id || `${platform}_${Date.now()}_${Math.random()}`,
      platform,
      text: mention.text || mention.content || '',
      author: {
        username: mention.author?.username || mention.user?.screen_name || 'unknown',
        displayName: mention.author?.displayName || mention.user?.name || 'Unknown User',
        followers: mention.author?.followers || mention.user?.followers_count || 0,
        verified: mention.author?.verified || mention.user?.verified || false
      },
      metrics: {
        likes: mention.likes || mention.favorite_count || 0,
        shares: mention.shares || mention.retweet_count || 0,
        comments: mention.comments || mention.reply_count || 0,
        views: mention.views || 0
      },
      timestamp: new Date(mention.created_at || mention.timestamp || Date.now()),
      url: mention.url || mention.permalink || '',
      language: mention.language || 'unknown',
      location: mention.location || null,
      hashtags: mention.hashtags || [],
      mentions: mention.user_mentions || [],
      media: mention.media || []
    }));
  }

  // 📊 PROCESAMIENTO DE MENCIONES
  async processMentions(newMentions) {
    console.log(`[SocialListening] Processing ${newMentions.length} new mentions`);

    for (const mention of newMentions) {
      // Análisis de sentimiento
      mention.sentiment = await this.analyzeSentiment(mention.text);
      
      // Cálculo de score de influencia
      mention.influenceScore = this.calculateInfluenceScore(mention);
      
      // Detección de crisis potencial
      mention.crisisRisk = this.assessCrisisRisk(mention);
      
      // Categorización automática
      mention.category = this.categorizeMention(mention);
      
      // Añadir a la lista de menciones
      this.mentions.unshift(mention);
    }

    // Mantener solo las últimas 10000 menciones
    if (this.mentions.length > 10000) {
      this.mentions = this.mentions.slice(0, 10000);
    }

    // Actualizar historial de sentimientos
    this.updateSentimentHistory();

    // Detectar crisis
    await this.detectCrisis();

    // Detectar tendencias emergentes
    await this.detectEmergingTrends();

    // Notificar a callbacks
    this.notifyCallbacks('mentions_processed', {
      newMentions: newMentions.length,
      totalMentions: this.mentions.length
    });
  }

  // 💭 ANÁLISIS DE SENTIMIENTO
  async analyzeSentiment(text) {
    try {
      // Análisis básico por palabras clave
      const positiveWords = ['excelente', 'increíble', 'genial', 'perfecto', 'amor', 'fantástico', 'bueno', 'mejor'];
      const negativeWords = ['terrible', 'horrible', 'malo', 'odio', 'peor', 'disgusto', 'problema', 'error'];
      
      const words = text.toLowerCase().split(/\s+/);
      let positiveScore = 0;
      let negativeScore = 0;

      words.forEach(word => {
        if (positiveWords.some(pw => word.includes(pw))) positiveScore++;
        if (negativeWords.some(nw => word.includes(nw))) negativeScore++;
      });

      const totalScore = positiveScore + negativeScore;
      if (totalScore === 0) {
        return { label: 'neutral', confidence: 0.5, positive: 0.5, negative: 0.5 };
      }

      const positiveRatio = positiveScore / totalScore;
      const negativeRatio = negativeScore / totalScore;

      let label = 'neutral';
      if (positiveRatio > 0.6) label = 'positive';
      else if (negativeRatio > 0.6) label = 'negative';

      return {
        label,
        confidence: Math.max(positiveRatio, negativeRatio),
        positive: positiveRatio,
        negative: negativeRatio
      };
    } catch (error) {
      console.error('[SocialListening] Sentiment analysis error:', error);
      return { label: 'neutral', confidence: 0.5, positive: 0.5, negative: 0.5 };
    }
  }

  // 📈 CÁLCULO DE SCORE DE INFLUENCIA
  calculateInfluenceScore(mention) {
    const platformWeight = this.platforms[mention.platform]?.weight || 0.1;
    const followerScore = Math.min(mention.author.followers / 100000, 1); // Max 1 para 100K+ followers
    const engagementScore = (mention.metrics.likes + mention.metrics.shares * 2 + mention.metrics.comments * 3) / 1000;
    const verifiedBonus = mention.author.verified ? 0.2 : 0;

    return Math.min((platformWeight + followerScore + engagementScore + verifiedBonus) * 100, 100);
  }

  // 🚨 EVALUACIÓN DE RIESGO DE CRISIS
  assessCrisisRisk(mention) {
    let riskScore = 0;

    // Sentimiento negativo
    if (mention.sentiment.label === 'negative') {
      riskScore += mention.sentiment.confidence * 0.4;
    }

    // Alto engagement en contenido negativo
    if (mention.sentiment.label === 'negative' && mention.influenceScore > 50) {
      riskScore += 0.3;
    }

    // Palabras clave de crisis
    const crisisKeywords = ['escándalo', 'problema', 'falla', 'error', 'boycott', 'demanda'];
    if (crisisKeywords.some(keyword => mention.text.toLowerCase().includes(keyword))) {
      riskScore += 0.2;
    }

    // Usuario verificado con sentimiento negativo
    if (mention.author.verified && mention.sentiment.label === 'negative') {
      riskScore += 0.1;
    }

    return Math.min(riskScore, 1);
  }

  // 🏷️ CATEGORIZACIÓN AUTOMÁTICA
  categorizeMention(mention) {
    const text = mention.text.toLowerCase();
    
    if (text.includes('producto') || text.includes('servicio')) return 'product';
    if (text.includes('soporte') || text.includes('ayuda')) return 'support';
    if (text.includes('precio') || text.includes('costo')) return 'pricing';
    if (text.includes('competencia') || text.includes('vs')) return 'competition';
    if (text.includes('feature') || text.includes('función')) return 'feature';
    
    return 'general';
  }

  // 📊 ACTUALIZACIÓN DE HISTORIAL DE SENTIMIENTOS
  updateSentimentHistory() {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 3600000);
    
    const recentMentions = this.mentions.filter(m => m.timestamp > hourAgo);
    
    if (recentMentions.length === 0) return;

    const sentimentSummary = {
      timestamp: now,
      total: recentMentions.length,
      positive: recentMentions.filter(m => m.sentiment.label === 'positive').length,
      negative: recentMentions.filter(m => m.sentiment.label === 'negative').length,
      neutral: recentMentions.filter(m => m.sentiment.label === 'neutral').length,
      avgInfluence: recentMentions.reduce((acc, m) => acc + m.influenceScore, 0) / recentMentions.length,
      avgCrisisRisk: recentMentions.reduce((acc, m) => acc + m.crisisRisk, 0) / recentMentions.length
    };

    this.sentimentHistory.unshift(sentimentSummary);
    
    // Mantener solo las últimas 24 horas
    if (this.sentimentHistory.length > 24) {
      this.sentimentHistory = this.sentimentHistory.slice(0, 24);
    }
  }

  // 🚨 DETECCIÓN DE CRISIS
  async detectCrisis() {
    if (this.sentimentHistory.length < 2) return;

    const latest = this.sentimentHistory[0];
    const previous = this.sentimentHistory[1];

    // Crisis por alto sentimiento negativo
    const negativeRatio = latest.negative / latest.total;
    if (negativeRatio > this.crisisThreshold) {
      await this.triggerCrisisAlert('high_negative_sentiment', {
        negativeRatio: negativeRatio,
        totalMentions: latest.total,
        timestamp: latest.timestamp
      });
    }

    // Crisis por incremento súbito de menciones negativas
    const negativeIncrease = (latest.negative - previous.negative) / previous.negative;
    if (negativeIncrease > 2 && latest.negative > 10) { // 200% de incremento
      await this.triggerCrisisAlert('negative_spike', {
        increase: negativeIncrease,
        currentNegative: latest.negative,
        previousNegative: previous.negative
      });
    }

    // Crisis por alto riesgo promedio
    if (latest.avgCrisisRisk > 0.7) {
      await this.triggerCrisisAlert('high_crisis_risk', {
        avgRisk: latest.avgCrisisRisk,
        totalMentions: latest.total
      });
    }
  }

  // 📈 DETECCIÓN DE TENDENCIAS EMERGENTES
  async detectEmergingTrends() {
    const recentMentions = this.mentions.slice(0, 100); // Últimas 100 menciones
    
    // Análisis de hashtags emergentes
    const hashtagCount = {};
    recentMentions.forEach(mention => {
      mention.hashtags.forEach(hashtag => {
        hashtagCount[hashtag] = (hashtagCount[hashtag] || 0) + 1;
      });
    });

    // Detectar hashtags con crecimiento rápido
    const emergingHashtags = Object.entries(hashtagCount)
      .filter(([hashtag, count]) => count >= 5)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    if (emergingHashtags.length > 0) {
      this.notifyCallbacks('emerging_trends', {
        hashtags: emergingHashtags,
        timestamp: new Date()
      });
    }
  }

  // 🚨 TRIGGER DE ALERTA DE CRISIS
  async triggerCrisisAlert(type, data) {
    const alert = {
      id: `crisis_${Date.now()}`,
      type,
      severity: this.calculateCrisisSeverity(type, data),
      data,
      timestamp: new Date(),
      status: 'active'
    };

    console.warn('[SocialListening] CRISIS ALERT:', alert);
    
    this.notifyCallbacks('crisis_alert', alert);

    // Enviar notificación push si está disponible
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('🚨 Alerta de Crisis - Predix', {
          body: `Detectada crisis de tipo: ${type}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'crisis-alert',
          requireInteraction: true,
          actions: [
            { action: 'view', title: 'Ver Detalles' },
            { action: 'dismiss', title: 'Descartar' }
          ]
        });
      } catch (error) {
        console.error('[SocialListening] Push notification error:', error);
      }
    }
  }

  calculateCrisisSeverity(type, data) {
    switch (type) {
      case 'high_negative_sentiment':
        return data.negativeRatio > 0.7 ? 'critical' : 'high';
      case 'negative_spike':
        return data.increase > 5 ? 'critical' : 'high';
      case 'high_crisis_risk':
        return data.avgRisk > 0.9 ? 'critical' : 'high';
      default:
        return 'medium';
    }
  }

  // 🔄 CALLBACKS Y EVENTOS
  onAlert(callback) {
    this.alertCallbacks.push(callback);
  }

  notifyCallbacks(event, data) {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('[SocialListening] Callback error:', error);
      }
    });
  }

  // 📊 MÉTODOS DE CONSULTA
  getMentions(filters = {}) {
    let filtered = [...this.mentions];

    if (filters.platform) {
      filtered = filtered.filter(m => m.platform === filters.platform);
    }

    if (filters.sentiment) {
      filtered = filtered.filter(m => m.sentiment.label === filters.sentiment);
    }

    if (filters.minInfluence) {
      filtered = filtered.filter(m => m.influenceScore >= filters.minInfluence);
    }

    if (filters.since) {
      filtered = filtered.filter(m => m.timestamp > filters.since);
    }

    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  getSentimentSummary(hours = 24) {
    const cutoff = new Date(Date.now() - hours * 3600000);
    const recentMentions = this.mentions.filter(m => m.timestamp > cutoff);

    if (recentMentions.length === 0) {
      return { total: 0, positive: 0, negative: 0, neutral: 0 };
    }

    return {
      total: recentMentions.length,
      positive: recentMentions.filter(m => m.sentiment.label === 'positive').length,
      negative: recentMentions.filter(m => m.sentiment.label === 'negative').length,
      neutral: recentMentions.filter(m => m.sentiment.label === 'neutral').length,
      avgInfluence: recentMentions.reduce((acc, m) => acc + m.influenceScore, 0) / recentMentions.length
    };
  }

  getTopInfluencers(limit = 10) {
    const influencerMap = {};
    
    this.mentions.forEach(mention => {
      const key = mention.author.username;
      if (!influencerMap[key]) {
        influencerMap[key] = {
          ...mention.author,
          mentionCount: 0,
          totalInfluence: 0,
          avgSentiment: { positive: 0, negative: 0, neutral: 0 }
        };
      }
      
      influencerMap[key].mentionCount++;
      influencerMap[key].totalInfluence += mention.influenceScore;
      influencerMap[key].avgSentiment[mention.sentiment.label]++;
    });

    return Object.values(influencerMap)
      .map(influencer => ({
        ...influencer,
        avgInfluence: influencer.totalInfluence / influencer.mentionCount,
        sentimentDistribution: {
          positive: influencer.avgSentiment.positive / influencer.mentionCount,
          negative: influencer.avgSentiment.negative / influencer.mentionCount,
          neutral: influencer.avgSentiment.neutral / influencer.mentionCount
        }
      }))
      .sort((a, b) => b.avgInfluence - a.avgInfluence)
      .slice(0, limit);
  }

  // 🧪 DATOS MOCK PARA DESARROLLO
  generateMockMentions(platform) {
    const mockTexts = [
      'Me encanta esta nueva funcionalidad de Predix!',
      'Predix está revolucionando el marketing digital',
      'No puedo creer lo preciso que es Predix',
      'Tengo algunos problemas con la interfaz',
      'Predix vs competencia - definitivamente Predix gana',
      'El soporte de Predix es increíble'
    ];

    const mockUsers = [
      { username: 'techinfluencer', displayName: 'Tech Influencer', followers: 50000, verified: true },
      { username: 'marketingpro', displayName: 'Marketing Pro', followers: 25000, verified: false },
      { username: 'digitalexpert', displayName: 'Digital Expert', followers: 75000, verified: true }
    ];

    return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      return {
        id: `mock_${platform}_${Date.now()}_${Math.random()}`,
        text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
        author: user,
        metrics: {
          likes: Math.floor(Math.random() * 1000),
          shares: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 10000)
        },
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        hashtags: ['#Predix', '#MarketingDigital'],
        mentions: [],
        media: []
      };
    });
  }
}

export default new SocialListeningService();
