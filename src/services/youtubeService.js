// YouTube Data API v3 Service
// Documentación: https://developers.google.com/youtube/v3

class YouTubeService {
  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  // Verificar si la API key está disponible
  isAvailable() {
    return !!this.apiKey && this.apiKey !== 'your_youtube_api_key_here';
  }

  // Obtener videos trending por región
  async getTrendingVideos(regionCode = 'MX', categoryId = '0', maxResults = 25) {
    if (!this.isAvailable()) {
      return { success: false, error: 'YouTube API key not configured' };
    }

    try {
      const url = `${this.baseUrl}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&categoryId=${categoryId}&maxResults=${maxResults}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        success: true,
        videos: data.items?.map(video => ({
          id: video.id,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium?.url,
          publishedAt: video.snippet.publishedAt,
          viewCount: parseInt(video.statistics.viewCount || 0),
          likeCount: parseInt(video.statistics.likeCount || 0),
          commentCount: parseInt(video.statistics.commentCount || 0),
          url: `https://www.youtube.com/watch?v=${video.id}`,
          categoryId: video.snippet.categoryId
        })) || [],
        region: regionCode
      };
    } catch (error) {
      console.error('Error obteniendo trending de YouTube:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar videos por término
  async searchVideos(query, maxResults = 25, order = 'relevance') {
    if (!this.isAvailable()) {
      return { success: false, error: 'YouTube API key not configured' };
    }

    try {
      const url = `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&order=${order}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      // Obtener estadísticas de los videos
      const videoIds = data.items?.map(item => item.id.videoId).join(',');
      const statsUrl = `${this.baseUrl}/videos?part=statistics&id=${videoIds}&key=${this.apiKey}`;
      
      const statsResponse = await fetch(statsUrl);
      const statsData = await statsResponse.json();

      return {
        success: true,
        videos: data.items?.map((video, index) => ({
          id: video.id.videoId,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium?.url,
          publishedAt: video.snippet.publishedAt,
          viewCount: parseInt(statsData.items?.[index]?.statistics?.viewCount || 0),
          likeCount: parseInt(statsData.items?.[index]?.statistics?.likeCount || 0),
          commentCount: parseInt(statsData.items?.[index]?.statistics?.commentCount || 0),
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`
        })) || [],
        query: query
      };
    } catch (error) {
      console.error('Error buscando en YouTube:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener categorías de videos
  async getVideoCategories(regionCode = 'MX') {
    if (!this.isAvailable()) {
      return { success: false, error: 'YouTube API key not configured' };
    }

    try {
      const url = `${this.baseUrl}/videoCategories?part=snippet&regionCode=${regionCode}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        success: true,
        categories: data.items?.map(category => ({
          id: category.id,
          title: category.snippet.title,
          assignable: category.snippet.assignable
        })) || []
      };
    } catch (error) {
      console.error('Error obteniendo categorías de YouTube:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener estadísticas de un canal
  async getChannelStats(channelId) {
    if (!this.isAvailable()) {
      return { success: false, error: 'YouTube API key not configured' };
    }

    try {
      const url = `${this.baseUrl}/channels?part=snippet,statistics&id=${channelId}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const channel = data.items?.[0];
      if (!channel) {
        throw new Error('Canal no encontrado');
      }

      return {
        success: true,
        channel: {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnail: channel.snippet.thumbnails.medium?.url,
          subscriberCount: parseInt(channel.statistics.subscriberCount || 0),
          videoCount: parseInt(channel.statistics.videoCount || 0),
          viewCount: parseInt(channel.statistics.viewCount || 0),
          publishedAt: channel.snippet.publishedAt
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas del canal:', error);
      return { success: false, error: error.message };
    }
  }
}

// Instancia singleton
const youtubeService = new YouTubeService();

export default youtubeService;

// Funciones de utilidad para componentes
export const getYouTubeTrending = (region = 'MX') => youtubeService.getTrendingVideos(region);
export const searchYouTubeVideos = (query) => youtubeService.searchVideos(query);
export const getYouTubeCategories = (region = 'MX') => youtubeService.getVideoCategories(region);
