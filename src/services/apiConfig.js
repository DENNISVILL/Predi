// 🔌 CONFIGURACIÓN COMPLETA DE TODAS LAS APIs
// Sistema robusto de integración con manejo de errores y rate limiting

class APIConfig {
  constructor() {
    this.endpoints = {
      // TikTok Research API
      tiktok: {
        baseUrl: 'https://open.tiktokapis.com/v2',
        endpoints: {
          trending: '/research/trending/hashtags',
          videos: '/research/video/query',
          users: '/research/user/info',
          sounds: '/research/sound/info'
        },
        rateLimit: {
          requests: 1000,
          window: 3600000 // 1 hora
        },
        auth: {
          type: 'oauth2',
          clientId: import.meta.env.VITE_TIKTOK_CLIENT_ID,
          clientSecret: import.meta.env.VITE_TIKTOK_CLIENT_SECRET,
          redirectUri: import.meta.env.VITE_TIKTOK_REDIRECT_URI
        }
      },

      // Instagram Graph API
      instagram: {
        baseUrl: 'https://graph.instagram.com/v18.0',
        endpoints: {
          media: '/me/media',
          insights: '/{media-id}/insights',
          hashtags: '/ig_hashtag_search',
          stories: '/me/stories'
        },
        rateLimit: {
          requests: 200,
          window: 3600000
        },
        auth: {
          type: 'oauth2',
          accessToken: import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN,
          appId: import.meta.env.VITE_INSTAGRAM_APP_ID,
          appSecret: import.meta.env.VITE_INSTAGRAM_APP_SECRET
        }
      },

      // YouTube Analytics API
      youtube: {
        baseUrl: 'https://youtubeanalytics.googleapis.com/v2',
        endpoints: {
          reports: '/reports',
          videos: '/videos',
          channels: '/channels',
          search: '/search'
        },
        rateLimit: {
          requests: 10000,
          window: 86400000 // 24 horas
        },
        auth: {
          type: 'oauth2',
          apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
          clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
          clientSecret: import.meta.env.VITE_YOUTUBE_CLIENT_SECRET
        }
      },

      // Twitter API v2
      twitter: {
        baseUrl: 'https://api.twitter.com/2',
        endpoints: {
          tweets: '/tweets',
          users: '/users',
          trends: '/trends/by/woeid/{woeid}',
          search: '/tweets/search/recent'
        },
        rateLimit: {
          requests: 300,
          window: 900000 // 15 minutos
        },
        auth: {
          type: 'bearer',
          bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN,
          apiKey: import.meta.env.VITE_TWITTER_API_KEY,
          apiSecret: import.meta.env.VITE_TWITTER_API_SECRET
        }
      },

      // LinkedIn API
      linkedin: {
        baseUrl: 'https://api.linkedin.com/v2',
        endpoints: {
          shares: '/shares',
          ugcPosts: '/ugcPosts',
          organizationalEntityAcls: '/organizationalEntityAcls',
          socialActions: '/socialActions'
        },
        rateLimit: {
          requests: 500,
          window: 86400000
        },
        auth: {
          type: 'oauth2',
          clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
          clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET,
          accessToken: import.meta.env.VITE_LINKEDIN_ACCESS_TOKEN
        }
      },

      // Spotify Web API
      spotify: {
        baseUrl: 'https://api.spotify.com/v1',
        endpoints: {
          playlists: '/browse/featured-playlists',
          tracks: '/tracks',
          search: '/search',
          trending: '/browse/new-releases'
        },
        rateLimit: {
          requests: 100,
          window: 60000 // 1 minuto
        },
        auth: {
          type: 'client_credentials',
          clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
        }
      },

      // Google Trends API (Unofficial)
      googleTrends: {
        baseUrl: 'https://trends.googleapis.com/trends/api',
        endpoints: {
          explore: '/explore',
          dailyTrends: '/dailytrends',
          realtime: '/realtimetrends',
          related: '/widgetdata/relatedsearches'
        },
        rateLimit: {
          requests: 100,
          window: 3600000
        },
        auth: {
          type: 'api_key',
          apiKey: import.meta.env.VITE_GOOGLE_TRENDS_API_KEY
        }
      }
    };

    this.rateLimiters = new Map();
    this.authTokens = new Map();
    this.initializeRateLimiters();
  }

  initializeRateLimiters() {
    Object.keys(this.endpoints).forEach(platform => {
      this.rateLimiters.set(platform, {
        requests: 0,
        resetTime: Date.now() + this.endpoints[platform].rateLimit.window
      });
    });
  }

  async checkRateLimit(platform) {
    const limiter = this.rateLimiters.get(platform);
    const config = this.endpoints[platform].rateLimit;
    
    if (Date.now() > limiter.resetTime) {
      limiter.requests = 0;
      limiter.resetTime = Date.now() + config.window;
    }
    
    if (limiter.requests >= config.requests) {
      const waitTime = limiter.resetTime - Date.now();
      throw new Error(`Rate limit exceeded for ${platform}. Wait ${waitTime}ms`);
    }
    
    limiter.requests++;
    return true;
  }

  async getAuthToken(platform) {
    const config = this.endpoints[platform].auth;
    
    switch (config.type) {
      case 'oauth2':
        return await this.getOAuth2Token(platform, config);
      case 'bearer':
        return config.bearerToken;
      case 'client_credentials':
        return await this.getClientCredentialsToken(platform, config);
      case 'api_key':
        return config.apiKey;
      default:
        throw new Error(`Unknown auth type: ${config.type}`);
    }
  }

  async getOAuth2Token(platform, config) {
    const cached = this.authTokens.get(platform);
    if (cached && cached.expires > Date.now()) {
      return cached.token;
    }

    try {
      const response = await fetch(`${this.endpoints[platform].baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.clientId,
          client_secret: config.clientSecret
        })
      });

      const data = await response.json();
      
      this.authTokens.set(platform, {
        token: data.access_token,
        expires: Date.now() + (data.expires_in * 1000)
      });

      return data.access_token;
    } catch (error) {
      console.error(`OAuth2 token error for ${platform}:`, error);
      throw error;
    }
  }

  async getClientCredentialsToken(platform, config) {
    const cached = this.authTokens.get(platform);
    if (cached && cached.expires > Date.now()) {
      return cached.token;
    }

    try {
      const credentials = btoa(`${config.clientId}:${config.clientSecret}`);
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();
      
      this.authTokens.set(platform, {
        token: data.access_token,
        expires: Date.now() + (data.expires_in * 1000)
      });

      return data.access_token;
    } catch (error) {
      console.error(`Client credentials error for ${platform}:`, error);
      throw error;
    }
  }

  getHeaders(platform, token) {
    const config = this.endpoints[platform].auth;
    
    switch (config.type) {
      case 'oauth2':
      case 'client_credentials':
        return {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
      case 'bearer':
        return {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
      case 'api_key':
        return {
          'X-API-Key': token,
          'Content-Type': 'application/json'
        };
      default:
        return {
          'Content-Type': 'application/json'
        };
    }
  }

  async makeRequest(platform, endpoint, params = {}, method = 'GET') {
    try {
      await this.checkRateLimit(platform);
      
      const token = await this.getAuthToken(platform);
      const headers = this.getHeaders(platform, token);
      
      const baseUrl = this.endpoints[platform].baseUrl;
      const endpointUrl = this.endpoints[platform].endpoints[endpoint];
      
      let url = `${baseUrl}${endpointUrl}`;
      
      // Replace path parameters
      Object.keys(params).forEach(key => {
        if (url.includes(`{${key}}`)) {
          url = url.replace(`{${key}}`, params[key]);
          delete params[key];
        }
      });
      
      // Add query parameters for GET requests
      if (method === 'GET' && Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
      }
      
      const options = {
        method,
        headers
      };
      
      if (method !== 'GET' && Object.keys(params).length > 0) {
        options.body = JSON.stringify(params);
      }
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request error for ${platform}:`, error);
      throw error;
    }
  }

  // Métodos específicos por plataforma
  async getTikTokTrending(region = 'US') {
    return await this.makeRequest('tiktok', 'trending', { region });
  }

  async getInstagramInsights(mediaId) {
    return await this.makeRequest('instagram', 'insights', { 'media-id': mediaId });
  }

  async getYouTubeAnalytics(channelId, metrics, startDate, endDate) {
    return await this.makeRequest('youtube', 'reports', {
      ids: `channel==${channelId}`,
      metrics,
      startDate,
      endDate
    });
  }

  async getTwitterTrends(woeid = 1) {
    return await this.makeRequest('twitter', 'trends', { woeid });
  }

  async getLinkedInShares(organizationId) {
    return await this.makeRequest('linkedin', 'shares', { organizationId });
  }

  async getSpotifyTrending(country = 'US', limit = 50) {
    return await this.makeRequest('spotify', 'trending', { country, limit });
  }

  async getGoogleTrends(keyword, geo = 'US') {
    return await this.makeRequest('googleTrends', 'explore', { 
      comparisonItem: [{ keyword, geo, time: 'today 12-m' }]
    });
  }
}

export default new APIConfig();
