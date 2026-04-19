// Spotify Web API Service
// Documentación: https://developer.spotify.com/documentation/web-api

const TOP_PLAYLISTS = {
  'GLOBAL': '37i9dQZEVXbMDoHDwVN2tF',
  'MX': '37i9dQZEVXbO3qyFbwd14B',
  'US': '37i9dQZEVXbLRQDuF5jeBp',
  'ES': '37i9dQZEVXbNFJfN1Vq8d9',
  'AR': '37i9dQZEVXbMMy2roB9myp',
  'CO': '37i9dQZEVXbOa2lmxNORXQ'
};

class SpotifyService {
  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Obtener token de acceso (Client Credentials Flow)
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();

      if (data.access_token) {
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000);
        return this.accessToken;
      }

      throw new Error('No se pudo obtener el token de Spotify');
    } catch (error) {
      console.error('Error obteniendo token de Spotify:', error);
      return null;
    }
  }

  // Obtener playlists trending por país
  async getTrendingByCountry(country = 'MX', limit = 50) {
    const token = await this.getAccessToken();
    if (!token) {
      // MOCK DATA
      return {
        success: true,
        playlists: [
          { id: '1', name: 'Top 50 - México', description: 'Las canciones más escuchadas' },
          { id: '2', name: 'Éxitos México', description: 'Los éxitos del momento' }
        ],
        country: country
      };
    }

    try {
      // Obtener playlists featured por país
      const response = await fetch(
        `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      return {
        success: true,
        playlists: data.playlists?.items || [],
        country: country
      };
    } catch (error) {
      console.error('Error obteniendo trending de Spotify:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener top tracks de una playlist
  async getPlaylistTracks(playlistId, limit = 50) {
    const token = await this.getAccessToken();
    
    const mockData = { 
        success: true, 
        tracks: [
          { id: '1', rank: 1, name: 'Canción Viral 1', artist: 'Artista Trending', album: 'Album Hit', duration: 180, popularity: 95, url: '#' },
          { id: '2', rank: 2, name: 'Sonido de TikTok', artist: 'Creador X', album: 'Viral Sounds', duration: 150, popularity: 90, url: '#' },
          { id: '3', rank: 3, name: 'Verano Mix', artist: 'DJ Verano', album: 'Hits 2024', duration: 200, popularity: 88, url: '#' },
          { id: '4', rank: 4, name: 'Challenge Dance', artist: 'Pop Star', album: 'Dance Edition', duration: 160, popularity: 85, url: '#' },
          { id: '5', rank: 5, name: 'Trend Acoustic', artist: 'Indie Artist', album: 'Chill Vibes', duration: 190, popularity: 80, url: '#' }
        ]
      };

    if (!token) return mockData;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      return {
        success: true,
        tracks: data.items?.filter(item => item.track).map((item, index) => ({
          id: item.track.id,
          rank: index + 1,
          name: item.track.name,
          artist: item.track.artists[0]?.name,
          album: item.track.album.name,
          artwork: item.track.album.images[0]?.url,
          previewUrl: item.track.preview_url,
          url: item.track.external_urls.spotify,
          duration: Math.floor(item.track.duration_ms / 1000), // convert ms to seconds
          popularity: item.track.popularity
        })) || []
      };
    } catch (error) {
      console.error('Error obteniendo tracks de playlist:', error);
      
      // MOCK DATA PARA OFFLINE MODE
      return { 
        success: true, 
        tracks: [
          { id: '1', rank: 1, name: 'Canción Viral 1', artist: 'Artista Trending', album: 'Album Hit', duration: 180, popularity: 95 },
          { id: '2', rank: 2, name: 'Sonido de TikTok', artist: 'Creador X', album: 'Viral Sounds', duration: 150, popularity: 90 },
          { id: '3', rank: 3, name: 'Verano Mix', artist: 'DJ Verano', album: 'Hits 2024', duration: 200, popularity: 88 },
          { id: '4', rank: 4, name: 'Challenge Dance', artist: 'Pop Star', album: 'Dance Edition', duration: 160, popularity: 85 },
          { id: '5', rank: 5, name: 'Trend Acoustic', artist: 'Indie Artist', album: 'Chill Vibes', duration: 190, popularity: 80 }
        ]
      };
    }
  }

  // Obtener Top 50 Oficial por Pais (Wrapper para getPlaylistTracks)
  async getTopSongs(countryCode = 'MX') {
    const playlistId = TOP_PLAYLISTS[countryCode.toUpperCase()] || TOP_PLAYLISTS['GLOBAL'];
    console.log(`🎧 Spotify: Fetching Top 50 Playlist ${playlistId} for ${countryCode}`);

    return await this.getPlaylistTracks(playlistId, 50);
  }

  // Buscar canciones por género o término
  async searchTracks(query, type = 'track', limit = 20) {
    const token = await this.getAccessToken();
    if (!token) return { success: true, tracks: [] };

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      return {
        success: true,
        tracks: data.tracks?.items?.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0]?.name,
          album: track.album.name,
          preview_url: track.preview_url,
          popularity: track.popularity,
          image: track.album.images[0]?.url,
          external_url: track.external_urls.spotify
        })) || []
      };
    } catch (error) {
      console.error('Error buscando en Spotify:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener géneros disponibles
  async getAvailableGenres() {
    const token = await this.getAccessToken();
    if (!token) return { success: true, genres: ['pop', 'rock', 'reggaeton', 'latin', 'electronic'] };

    try {
      const response = await fetch(
        'https://api.spotify.com/v1/recommendations/available-genre-seeds',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      return {
        success: true,
        genres: data.genres || []
      };
    } catch (error) {
      console.error('Error obteniendo géneros de Spotify:', error);
      return { success: false, error: error.message };
    }
  }
}

// Instancia singleton
const spotifyService = new SpotifyService();

export default spotifyService;

// Funciones de utilidad para componentes
export const getSpotifyTrending = (country = 'MX') => spotifyService.getTrendingByCountry(country);
export const searchSpotifyTracks = (query) => spotifyService.searchTracks(query);
export const getPlaylistTracks = (playlistId) => spotifyService.getPlaylistTracks(playlistId);
