
const DEEZER_API_URL = 'https://api.deezer.com';

// Mapa de códigos de país a IDs de Deezer (aproximado, Deezer usa IDs numéricos o 'limit' por ip)
// Para charts globales usamos '/chart'. Para países es más complejo, usaremos playlist IDs de "Top Mexico", etc.
// O simplemente search. Por ahora, fetch del chart general.
const PLAYLIST_IDS = {
    'MX': '1116190041', // Top Mexico
    'ES': '1116190061', // Top Spain
    'AR': '1116190081', // Top Argentina
    'CO': '1116190141', // Top Colombia
    'US': '1313621735', // Top Worldwide / USA
    'GLOBAL': '3155776842'
};

class DeezerService {
    constructor() {
        this.cache = {};
        this.jsonpCounter = 0;
    }

    /**
     * Realiza una petición JSONP a Deezer
     * @param {string} endpoint Endpoint de la API (ej: '/chart')
     * @param {object} params Parámetros adicionales
     */
    async fetchJsonp(endpoint, params = {}) {
        return new Promise((resolve, reject) => {
            const callbackName = `deezerJsonp_${Date.now()}_${this.jsonpCounter++}`;

            // Construir URL
            const url = new URL(`${DEEZER_API_URL}${endpoint}`);
            url.searchParams.append('output', 'jsonp');
            url.searchParams.append('callback', callbackName);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            // Crear script
            const script = document.createElement('script');
            script.src = url.toString();


            // Handler global
            window[callbackName] = (data) => {
                cleanup();
                if (data.error) {
                    reject(new Error(data.error.message || 'Error en Deezer API'));
                } else {
                    resolve(data);
                }
            };

            // Error handler básico
            script.onerror = () => {
                cleanup();
                reject(new Error('Network Error (JSONP blocked?)'));
            };

            // Limpieza
            const cleanup = () => {
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
            };

            document.body.appendChild(script);
        });
    }

    /**
     * Helper paramétrica para fetch con proxy
     */
    async fetchWithProxy(targetUrl) {
        try {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
            // También podemos probar: `https://cors-anywhere.herokuapp.com/${targetUrl}` si allorigins falla, pero requiere demo.
            // Usaremos allorigins.win
            console.log(`🌍 Proxy Fetch: ${proxyUrl}`);
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`Proxy Error: ${response.status}`);
            return await response.json();
        } catch (e) {
            throw new Error(`Proxy Fetch Failed: ${e.message}`);
        }
    }

    /**
     * Obtiene el Top de Canciones
     * @param {string} countryCode Código ISO (MX, ES, etc.)
     */
    async getTopSongs(countryCode = 'MX') {
        // 1. Intentar JSONP (Método preferido, mas rápido si funciona)
        try {
            const playlistId = PLAYLIST_IDS[countryCode.toUpperCase()] || PLAYLIST_IDS['GLOBAL'];
            console.log(`🎧 Deezer (JSONP): Fetching playlist ${playlistId}`);
            const data = await this.fetchJsonp(`/playlist/${playlistId}/tracks`, { limit: 50 });

            if (!data || data.error) throw new Error(data?.error?.message || 'JSONP Empty');

            return {
                success: true,
                source: 'deezer_jsonp',
                tracks: this.normalizeTracks(data.data)
            };
        } catch (jsonpError) {
            console.warn('⚠️ Deezer JSONP failed, trying Proxy Fallback...', jsonpError);
        }

        // 2. Fallback: Proxy CORS (Si JSONP falla por bloqueo de script)
        try {
            // Usar endpoint de Chart Global o Playlist via Proxy
            // Nota: Deezer API pública a veces bloquea IPs de proxies compartidos, pero vale la pena intentar.
            const targetUrl = `${DEEZER_API_URL}/chart/0/tracks?limit=50`;
            const data = await this.fetchWithProxy(targetUrl);

            return {
                success: true,
                source: 'deezer_proxy',
                tracks: this.normalizeTracks(data.data)
            };
        } catch (proxyError) {
            console.error('❌ Deezer Proxy failed too:', proxyError);
            return {
                success: false,
                error: 'All Methods Failed',
                tracks: []
            };
        }
    }

    async getGlobalChart() {
        try {
            const data = await this.fetchJsonp('/chart/0/tracks', { limit: 50 });
            return {
                success: true,
                source: 'deezer_chart',
                tracks: this.normalizeTracks(data.data)
            };
        } catch (err) {
            return { success: false, error: err.message, tracks: [] };
        }
    }

    normalizeTracks(deezerTracks) {
        if (!deezerTracks) return [];
        return deezerTracks.map((track, index) => ({
            id: track.id,
            rank: index + 1,
            name: track.title,
            artist: track.artist.name,
            album: track.album.title,
            artwork: track.album.cover_xl || track.album.cover_big || track.album.cover,
            previewUrl: track.preview, // ✅ 30s Audio Preview nativo
            url: track.link,
            duration: track.duration,
            genres: [], // Deezer track endpoint simple no trae generos a veces
            releaseDate: new Date().toISOString() // No siempre disponible en lista simple
        }));
    }
}

const deezerService = new DeezerService();
export default deezerService;
