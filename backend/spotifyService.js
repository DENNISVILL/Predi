const axios = require('axios');
const qs = require('querystring');

let spotifyToken = null;
let tokenExpiration = 0;

const getAccessToken = async () => {
    // Check if token is valid (with 60s buffer)
    if (spotifyToken && Date.now() < tokenExpiration - 60000) {
        return spotifyToken;
    }

    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('MISSING_KEYS');
        }

        const response = await axios.post('https://accounts.spotify.com/api/token',
            qs.stringify({ grant_type: 'client_credentials' }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
                }
            }
        );

        spotifyToken = response.data.access_token;
        tokenExpiration = Date.now() + (response.data.expires_in * 1000);
        console.log('🎵 Spotify Token Refreshed');
        return spotifyToken;

    } catch (error) {
        console.error('Spotify Auth Error:', error.response?.data || error.message);
        throw error;
    }
};

// Map of Country Codes to Viral 50 Playlist IDs
const VIRAL_PLAYLISTS = {
    'Global': '37i9dQZEVXbLiRSafSXMaD',
    'Mexico': '37i9dQZEVXbLu376NAPRZF',
    'USA': '37i9dQZEVXbKuaTI1Z1Afx',
    'Spain': '37i9dQZEVXbNFJfN1Vw8d9',
    'Argentina': '37i9dQZEVXbJufxb7260Pk',
    'Colombia': '37i9dQZEVXbOa2lmxNORXQ',
    'Ecuador': '37i9dQZEVXbJp41aWFzhxJ' // Vital for this user
};

const getViralTrends = async (country = 'Global') => {
    try {
        const token = await getAccessToken();
        const playlistId = VIRAL_PLAYLISTS[country] || VIRAL_PLAYLISTS['Global'];

        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { limit: 50 }
        });

        // Transform to ViralSong format
        return response.data.items.map((item, index) => {
            const track = item.track;
            return {
                id: track.id,
                title: track.name,
                artist: track.artists.map(a => a.name).join(', '),
                coverArt: track.album.images[0]?.url,
                viralScore: 100 - index, // Rank based score
                url: track.external_urls.spotify,
                previewUrl: track.preview_url,
                duration: Math.round(track.duration_ms / 1000),
                album: track.album.name,
                popularity: track.popularity,
                platforms: {
                    spotify: {
                        status: 'VIRAL',
                        rank: index + 1
                    }
                }
            };
        });

    } catch (error) {
        console.error(`Error fetching trends for ${country}:`, error.message);
        if (error.message === 'MISSING_KEYS') return { error: 'missing_keys' };
        return { error: 'api_error' };
    }
};

module.exports = { getViralTrends };
