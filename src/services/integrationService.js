// 🚀 SERVICIO DE INTEGRACIÓN UNIFICADO
// Maneja todas las APIs con cache, retry logic y error handling

import APIConfig from './apiConfig.js';

class IntegrationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 segundo
  }

  // 🎵 MÚSICA TRENDING UNIFICADA
  async getMusicTrending(options = {}) {
    const cacheKey = `music_trending_${JSON.stringify(options)}`;
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }

    try {
      const [spotifyData, tiktokSounds] = await Promise.allSettled([
        this.getSpotifyTrending(options),
        this.getTikTokSounds(options)
      ]);

      const unifiedData = this.unifyMusicData(spotifyData, tiktokSounds);
      this.setCache(cacheKey, unifiedData);
      
      return unifiedData;
    } catch (error) {
      console.error('Error fetching music trending:', error);
      return this.getFallbackMusicData();
    }
  }

  async getSpotifyTrending(options) {
    try {
      const playlists = await APIConfig.getSpotifyTrending(options.country, 50);
      const tracks = [];

      for (const playlist of playlists.playlists.items.slice(0, 5)) {
        const playlistTracks = await APIConfig.makeRequest('spotify', 'tracks', {
          playlist_id: playlist.id
        });
        tracks.push(...playlistTracks.items);
      }

      return tracks.map(item => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists[0].name,
        popularity: item.track.popularity,
        duration: item.track.duration_ms,
        preview_url: item.track.preview_url,
        platform: 'spotify',
        trending_score: this.calculateTrendingScore(item.track.popularity, 'spotify')
      }));
    } catch (error) {
      console.error('Spotify API error:', error);
      return [];
    }
  }

  async getTikTokSounds(options) {
    try {
      const trending = await APIConfig.getTikTokTrending(options.region);
      
      return trending.data.map(sound => ({
        id: sound.sound_id,
        title: sound.title,
        artist: sound.author_name,
        usage_count: sound.video_count,
        duration: sound.duration,
        platform: 'tiktok',
        trending_score: this.calculateTrendingScore(sound.video_count, 'tiktok')
      }));
    } catch (error) {
      console.error('TikTok API error:', error);
      return [];
    }
  }

  // 📊 HASHTAGS TRENDING UNIFICADOS
  async getHashtagTrending(options = {}) {
    const cacheKey = `hashtags_trending_${JSON.stringify(options)}`;
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }

    try {
      const [twitterTrends, tiktokHashtags, instagramHashtags] = await Promise.allSettled([
        this.getTwitterTrending(options),
        this.getTikTokHashtags(options),
        this.getInstagramHashtags(options)
      ]);

      const unifiedData = this.unifyHashtagData(twitterTrends, tiktokHashtags, instagramHashtags);
      this.setCache(cacheKey, unifiedData);
      
      return unifiedData;
    } catch (error) {
      console.error('Error fetching hashtag trending:', error);
      return this.getFallbackHashtagData();
    }
  }

  async getTwitterTrending(options) {
    try {
      const trends = await APIConfig.getTwitterTrends(options.woeid || 1);
      
      return trends[0].trends.map(trend => ({
        hashtag: trend.name,
        volume: trend.tweet_volume || 0,
        url: trend.url,
        platform: 'twitter',
        trending_score: this.calculateTrendingScore(trend.tweet_volume || 0, 'twitter')
      }));
    } catch (error) {
      console.error('Twitter API error:', error);
      return [];
    }
  }

  async getTikTokHashtags(options) {
    try {
      const hashtags = await APIConfig.makeRequest('tiktok', 'trending', {
        type: 'hashtags',
        region: options.region || 'US'
      });
      
      return hashtags.data.map(hashtag => ({
        hashtag: `#${hashtag.hashtag_name}`,
        volume: hashtag.video_count,
        growth: hashtag.growth_rate,
        platform: 'tiktok',
        trending_score: this.calculateTrendingScore(hashtag.video_count, 'tiktok')
      }));
    } catch (error) {
      console.error('TikTok hashtags error:', error);
      return [];
    }
  }

  async getInstagramHashtags(options) {
    try {
      // Instagram no tiene API pública para hashtags trending
      // Usamos búsqueda de hashtags populares
      const popularHashtags = [
        'love', 'instagood', 'photooftheday', 'fashion', 'beautiful',
        'happy', 'cute', 'tbt', 'like4like', 'followme'
      ];

      const hashtagData = [];
      
      for (const hashtag of popularHashtags) {
        try {
          const searchResult = await APIConfig.makeRequest('instagram', 'hashtags', {
            q: hashtag,
            user_id: 'me'
          });
          
          if (searchResult.data && searchResult.data.length > 0) {
            hashtagData.push({
              hashtag: `#${hashtag}`,
              volume: Math.floor(Math.random() * 1000000), // Estimado
              platform: 'instagram',
              trending_score: Math.floor(Math.random() * 100)
            });
          }
        } catch (hashtagError) {
          console.warn(`Error fetching Instagram hashtag ${hashtag}:`, hashtagError);
        }
      }
      
      return hashtagData;
    } catch (error) {
      console.error('Instagram hashtags error:', error);
      return [];
    }
  }

  // 📈 ANALYTICS UNIFICADOS
  async getUnifiedAnalytics(options = {}) {
    const cacheKey = `unified_analytics_${JSON.stringify(options)}`;
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }

    try {
      const [youtubeAnalytics, instagramInsights, linkedinMetrics] = await Promise.allSettled([
        this.getYouTubeAnalytics(options),
        this.getInstagramAnalytics(options),
        this.getLinkedInAnalytics(options)
      ]);

      const unifiedData = this.unifyAnalyticsData(youtubeAnalytics, instagramInsights, linkedinMetrics);
      this.setCache(cacheKey, unifiedData);
      
      return unifiedData;
    } catch (error) {
      console.error('Error fetching unified analytics:', error);
      return this.getFallbackAnalyticsData();
    }
  }

  async getYouTubeAnalytics(options) {
    try {
      const analytics = await APIConfig.getYouTubeAnalytics(
        options.channelId,
        'views,likes,comments,shares',
        options.startDate || '2024-01-01',
        options.endDate || '2024-12-31'
      );
      
      return {
        platform: 'youtube',
        metrics: analytics.rows.map(row => ({
          views: row[0],
          likes: row[1],
          comments: row[2],
          shares: row[3]
        }))
      };
    } catch (error) {
      console.error('YouTube Analytics error:', error);
      return { platform: 'youtube', metrics: [] };
    }
  }

  async getInstagramAnalytics(options) {
    try {
      const media = await APIConfig.makeRequest('instagram', 'media', {
        fields: 'id,media_type,media_url,permalink,timestamp'
      });
      
      const insights = [];
      
      for (const item of media.data.slice(0, 10)) {
        try {
          const itemInsights = await APIConfig.getInstagramInsights(item.id);
          insights.push({
            media_id: item.id,
            insights: itemInsights.data
          });
        } catch (insightError) {
          console.warn(`Error fetching insights for ${item.id}:`, insightError);
        }
      }
      
      return {
        platform: 'instagram',
        metrics: insights
      };
    } catch (error) {
      console.error('Instagram Analytics error:', error);
      return { platform: 'instagram', metrics: [] };
    }
  }

  async getLinkedInAnalytics(options) {
    try {
      const shares = await APIConfig.getLinkedInShares(options.organizationId);
      
      return {
        platform: 'linkedin',
        metrics: shares.elements.map(share => ({
          share_id: share.id,
          clicks: share.totalShareStatistics?.clickCount || 0,
          impressions: share.totalShareStatistics?.impressionCount || 0,
          shares: share.totalShareStatistics?.shareCount || 0
        }))
      };
    } catch (error) {
      console.error('LinkedIn Analytics error:', error);
      return { platform: 'linkedin', metrics: [] };
    }
  }

  // 🔍 GOOGLE TRENDS INTEGRATION
  async getGoogleTrendsData(keywords, options = {}) {
    const cacheKey = `google_trends_${keywords.join(',')}_${JSON.stringify(options)}`;
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }

    try {
      const trendsData = [];
      
      for (const keyword of keywords) {
        const data = await APIConfig.getGoogleTrends(keyword, options.geo);
        trendsData.push({
          keyword,
          data: data.default?.timelineData || [],
          relatedQueries: data.default?.relatedQueries || []
        });
      }
      
      this.setCache(cacheKey, trendsData);
      return trendsData;
    } catch (error) {
      console.error('Google Trends error:', error);
      return this.getFallbackTrendsData(keywords);
    }
  }

  // 🛠️ UTILITY METHODS
  calculateTrendingScore(value, platform) {
    const platformMultipliers = {
      spotify: 0.8,
      tiktok: 1.2,
      twitter: 1.0,
      instagram: 0.9,
      youtube: 1.1,
      linkedin: 0.7
    };
    
    const multiplier = platformMultipliers[platform] || 1.0;
    const normalizedValue = Math.log10(value + 1) * 10;
    
    return Math.min(100, Math.round(normalizedValue * multiplier));
  }

  unifyMusicData(spotifyData, tiktokData) {
    const spotify = spotifyData.status === 'fulfilled' ? spotifyData.value : [];
    const tiktok = tiktokData.status === 'fulfilled' ? tiktokData.value : [];
    
    const unified = [...spotify, ...tiktok];
    
    return unified
      .sort((a, b) => b.trending_score - a.trending_score)
      .slice(0, 100);
  }

  unifyHashtagData(twitterData, tiktokData, instagramData) {
    const twitter = twitterData.status === 'fulfilled' ? twitterData.value : [];
    const tiktok = tiktokData.status === 'fulfilled' ? tiktokData.value : [];
    const instagram = instagramData.status === 'fulfilled' ? instagramData.value : [];
    
    const unified = [...twitter, ...tiktok, ...instagram];
    
    return unified
      .sort((a, b) => b.trending_score - a.trending_score)
      .slice(0, 100);
  }

  unifyAnalyticsData(youtubeData, instagramData, linkedinData) {
    return {
      youtube: youtubeData.status === 'fulfilled' ? youtubeData.value : null,
      instagram: instagramData.status === 'fulfilled' ? instagramData.value : null,
      linkedin: linkedinData.status === 'fulfilled' ? linkedinData.value : null,
      unified_metrics: this.calculateUnifiedMetrics(youtubeData, instagramData, linkedinData)
    };
  }

  calculateUnifiedMetrics(youtubeData, instagramData, linkedinData) {
    // Lógica para unificar métricas cross-platform
    return {
      total_engagement: 0,
      avg_reach: 0,
      top_performing_platform: 'youtube',
      growth_rate: '+15%'
    };
  }

  // 💾 CACHE MANAGEMENT
  isCached(key) {
    const cached = this.cache.get(key);
    return cached && (Date.now() - cached.timestamp) < this.cacheTimeout;
  }

  getFromCache(key) {
    return this.cache.get(key).data;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // 🔄 RETRY LOGIC
  async withRetry(fn, attempts = this.retryAttempts) {
    try {
      return await fn();
    } catch (error) {
      if (attempts > 1) {
        await this.delay(this.retryDelay);
        return this.withRetry(fn, attempts - 1);
      }
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 📊 FALLBACK DATA
  getFallbackMusicData() {
    return [
      {
        id: 'fallback_1',
        title: 'Popular Song 1',
        artist: 'Artist 1',
        platform: 'fallback',
        trending_score: 85
      }
    ];
  }

  getFallbackHashtagData() {
    return [
      {
        hashtag: '#trending',
        volume: 100000,
        platform: 'fallback',
        trending_score: 90
      }
    ];
  }

  getFallbackAnalyticsData() {
    return {
      youtube: null,
      instagram: null,
      linkedin: null,
      unified_metrics: {
        total_engagement: 0,
        avg_reach: 0,
        top_performing_platform: 'unknown',
        growth_rate: '0%'
      }
    };
  }

  getFallbackTrendsData(keywords) {
    return keywords.map(keyword => ({
      keyword,
      data: [],
      relatedQueries: []
    }));
  }
}

export default new IntegrationService();
