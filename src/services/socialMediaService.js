// Social Media APIs Service (Instagram, TikTok, Facebook)
// Nota: Estas APIs requieren configuración específica y aprobación

class SocialMediaService {
  constructor() {
    this.instagramToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
    this.facebookToken = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN;
    this.tiktokClientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY;
  }

  // === INSTAGRAM BASIC DISPLAY API ===
  
  async getInstagramUserMedia(userId = 'me', limit = 25) {
    if (!this.instagramToken) {
      return { success: false, error: 'Instagram token not configured' };
    }

    try {
      const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${this.instagramToken}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        success: true,
        media: data.data?.map(post => ({
          id: post.id,
          caption: post.caption,
          mediaType: post.media_type,
          mediaUrl: post.media_url,
          thumbnailUrl: post.thumbnail_url,
          permalink: post.permalink,
          timestamp: post.timestamp,
          likeCount: post.like_count || 0,
          commentCount: post.comments_count || 0
        })) || []
      };
    } catch (error) {
      console.error('Error obteniendo media de Instagram:', error);
      return { success: false, error: error.message };
    }
  }

  // === FACEBOOK GRAPH API ===
  
  async getFacebookPagePosts(pageId, limit = 25) {
    if (!this.facebookToken) {
      return { success: false, error: 'Facebook token not configured' };
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,created_time,likes.summary(true),comments.summary(true),shares&limit=${limit}&access_token=${this.facebookToken}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        success: true,
        posts: data.data?.map(post => ({
          id: post.id,
          message: post.message,
          createdTime: post.created_time,
          likeCount: post.likes?.summary?.total_count || 0,
          commentCount: post.comments?.summary?.total_count || 0,
          shareCount: post.shares?.count || 0,
          url: `https://facebook.com/${post.id}`
        })) || []
      };
    } catch (error) {
      console.error('Error obteniendo posts de Facebook:', error);
      return { success: false, error: error.message };
    }
  }

  // === TIKTOK API (Research API) ===
  
  async getTikTokTrendingHashtags(region = 'MX') {
    // Nota: TikTok Research API requiere aprobación especial
    // Por ahora simulamos datos realistas
    
    const mockHashtags = {
      MX: [
        { hashtag: '#México', count: 2500000, growth: '+15%' },
        { hashtag: '#CDMX', count: 1800000, growth: '+22%' },
        { hashtag: '#Viral', count: 3200000, growth: '+8%' },
        { hashtag: '#Trending', count: 2100000, growth: '+12%' },
        { hashtag: '#FYP', count: 4500000, growth: '+5%' }
      ],
      ES: [
        { hashtag: '#España', count: 1900000, growth: '+18%' },
        { hashtag: '#Madrid', count: 1200000, growth: '+25%' },
        { hashtag: '#Viral', count: 2800000, growth: '+10%' },
        { hashtag: '#Trending', count: 1800000, growth: '+14%' },
        { hashtag: '#FYP', count: 3900000, growth: '+7%' }
      ]
    };

    return {
      success: true,
      hashtags: mockHashtags[region] || mockHashtags.MX,
      region: region,
      note: 'Datos simulados - TikTok API requiere aprobación especial'
    };
  }

  // === UTILIDADES GENERALES ===
  
  // Obtener trending general de todas las plataformas
  async getAllPlatformsTrending(region = 'MX') {
    const results = await Promise.allSettled([
      this.getInstagramUserMedia('me', 10),
      this.getFacebookPagePosts('your_page_id', 10),
      this.getTikTokTrendingHashtags(region)
    ]);

    return {
      success: true,
      instagram: results[0].status === 'fulfilled' ? results[0].value : { success: false, error: 'Instagram failed' },
      facebook: results[1].status === 'fulfilled' ? results[1].value : { success: false, error: 'Facebook failed' },
      tiktok: results[2].status === 'fulfilled' ? results[2].value : { success: false, error: 'TikTok failed' },
      region: region
    };
  }

  // Analizar engagement de contenido
  analyzeEngagement(posts) {
    if (!posts || posts.length === 0) return null;

    const totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.commentCount || 0), 0);
    const totalShares = posts.reduce((sum, post) => sum + (post.shareCount || 0), 0);

    const avgLikes = totalLikes / posts.length;
    const avgComments = totalComments / posts.length;
    const avgShares = totalShares / posts.length;

    return {
      totalEngagement: totalLikes + totalComments + totalShares,
      averages: {
        likes: Math.round(avgLikes),
        comments: Math.round(avgComments),
        shares: Math.round(avgShares)
      },
      engagementRate: ((totalLikes + totalComments) / posts.length * 100).toFixed(2) + '%'
    };
  }
}

// Instancia singleton
const socialMediaService = new SocialMediaService();

export default socialMediaService;

// Funciones de utilidad para componentes
export const getInstagramTrending = () => socialMediaService.getInstagramUserMedia();
export const getFacebookTrending = (pageId) => socialMediaService.getFacebookPagePosts(pageId);
export const getTikTokHashtags = (region) => socialMediaService.getTikTokTrendingHashtags(region);
export const getAllSocialTrending = (region) => socialMediaService.getAllPlatformsTrending(region);
