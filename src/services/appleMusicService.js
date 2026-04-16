// Apple Music RSS Service
// Documentación: https://rss.applemarketingtools.com/

// Mapeo de códigos de país (ISO 3166-1 alpha-2) a nombres amigables
export const APPLE_STOREFRONTS = {
    'MX': { code: 'mx', name: 'México' },
    'ES': { code: 'es', name: 'España' },
    'CO': { code: 'co', name: 'Colombia' },
    'AR': { code: 'ar', name: 'Argentina' },
    'PE': { code: 'pe', name: 'Perú' },
    'VE': { code: 've', name: 'Venezuela' }, // Puede no tener feed dedicado
    'CL': { code: 'cl', name: 'Chile' },
    'EC': { code: 'ec', name: 'Ecuador' },
    'US': { code: 'us', name: 'Estados Unidos' }, // Para referencia global
    'GT': { code: 'gt', name: 'Guatemala' },
    'CR': { code: 'cr', name: 'Costa Rica' },
    'PA': { code: 'pa', name: 'Panamá' },
    'DO': { code: 'do', name: 'República Dominicana' },
    'UY': { code: 'uy', name: 'Uruguay' },
    'PY': { code: 'py', name: 'Paraguay' },
    'BO': { code: 'bo', name: 'Bolivia' },
    'SV': { code: 'sv', name: 'El Salvador' },
    'HN': { code: 'hn', name: 'Honduras' },
    'NI': { code: 'ni', name: 'Nicaragua' }
};

const CACHE_DURATION = 1000 * 60 * 60; // 1 hora de caché

class AppleMusicService {
    constructor() {
        this.cache = {};
    }

    /**
     * Obtiene las canciones más populares de un país
     * @param {string} countryCode Código ISO (MX, ES, AR, etc.)
     * @param {number} limit Límite de resultados (default 50)
     */
    async getTopSongs(countryCode = 'MX', limit = 50) {
        // Normalizar código de país
        const country = APPLE_STOREFRONTS[countryCode.toUpperCase()] ? APPLE_STOREFRONTS[countryCode.toUpperCase()].code : 'mx';
        const cacheKey = `top_songs_${country}_${limit}`;

        // Verificar caché
        if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < CACHE_DURATION) {
            console.log(`🍎 Usando caché para ${country}`);
            return this.cache[cacheKey].data;
        }

        try {
            // URL Pública de Apple Music RSS
            const targetUrl = `https://rss.applemarketingtools.com/api/v2/${country}/music/most-played/${limit}/songs.json`;

            // Usamos un proxy CORS para evitar el bloqueo del navegador
            // api.allorigins.win/raw devuelve el contenido tal cual (JSON puro)
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

            console.log(`🍎 Fetching via Proxy: ${proxyUrl}`);

            const response = await fetch(proxyUrl);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            // Transformar datos al formato unificado de Predix
            const tracks = data.feed.results.map((song, index) => ({
                id: song.id,
                rank: index + 1,
                name: song.name,
                artist: song.artistName,
                album: song.name, // RSS feed a veces no trae album separado, usamos nombre canción
                artwork: song.artworkUrl100?.replace('100x100', '600x600'), // Hack para HD
                previewUrl: null, // RSS feed no trae preview de audio (limitación conocida)
                url: song.url,
                genres: song.genres?.map(g => g.name) || [],
                releaseDate: song.releaseDate
            }));

            const result = {
                success: true,
                source: 'Apple Music RSS',
                country: country.toUpperCase(),
                updated: new Date().toISOString(),
                tracks: tracks
            };

            // Guardar en caché
            this.cache[cacheKey] = {
                timestamp: Date.now(),
                data: result
            };

            return result;

        } catch (error) {
            console.error('❌ Error Apple Music Service:', error);
            return {
                success: false,
                error: error.message,
                tracks: [] // Retornar array vacío para no romper la UI
            };
        }
    }
    /**
     * Enriquece la lista de canciones con URLs de preview de audio usando iTunes Lookup API
     * @param {Array} tracks Lista de canciones con ID
     * @param {string} countryCode Código de país
     */
    async hydrateAudioPreviews(tracks, countryCode = 'MX') {
        if (!tracks || tracks.length === 0) return tracks;

        const trackIds = tracks.map(t => t.id).join(',');
        const country = APPLE_STOREFRONTS[countryCode.toUpperCase()] ? APPLE_STOREFRONTS[countryCode.toUpperCase()].code : 'mx';

        try {
            // iTunes Lookup API
            // Nota: Usamos 'mx' o el país que sea para coincidir con disponibilidad
            const targetUrl = `https://itunes.apple.com/lookup?id=${trackIds}&country=${country}`;

            // Proxy para asegurar CORS (iTunes API a veces falla en clientes puros)
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

            console.log(`🎧 Fetching Previews: ${proxyUrl.substring(0, 50)}...`);

            const response = await fetch(proxyUrl);
            if (!response.ok) return tracks;

            const data = await response.json();
            const results = data.results || [];

            // Mapa de ID -> PreviewURL
            const previewMap = {};
            results.forEach(item => {
                if (item.previewUrl) {
                    previewMap[item.collectionId] = item.previewUrl; // A veces viene como video preview o track preview
                    previewMap[item.trackId] = item.previewUrl;
                }
            });

            // Fusionar con los tracks originales
            return tracks.map(track => ({
                ...track,
                previewUrl: previewMap[track.id] || null
            }));

        } catch (error) {
            console.error('Error hydrating previews:', error);
            return tracks; // Retorna original si falla
        }
    }
}

const appleMusicService = new AppleMusicService();

export default appleMusicService;
