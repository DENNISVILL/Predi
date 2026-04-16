/**
 * Viral Music Service
 * API client for all music tracker features
 */

import apiClient from './apiClient';
import type {
    ViralSong,
    MusicFilters,
    Platform,
    Playlist,
    ContentEvent,
    AlertRule,
    Alert,
    TimeSeriesData,
    SongComparison,
    ContentIdea,
    VideoTemplate,
    PaginatedResponse,
    TopVideo,
    LicenseInfo,
    Demographics,
} from '../types/music';

class ViralMusicService {
    // ===== FEATURE #1: Multi-Platform =====

    async getSongsByPlatform(platform: Platform, limit: number = 20): Promise<ViralSong[]> {
        const response = await apiClient.get(`/music/platform/${platform}`, {
            params: { limit }
        });
        return response.data as ViralSong[];
    }

    async getAllPlatformSongs(limit: number = 50): Promise<ViralSong[]> {
        const response = await apiClient.get('/music/viral', {
            params: { limit }
        });
        return response.data as ViralSong[];
    }

    // ===== FEATURE #2: Advanced Filters & Search =====

    async searchSongs(filters: Partial<MusicFilters>, page: number = 1, limit: number = 20): Promise<PaginatedResponse<ViralSong>> {
        const response = await apiClient.post('/music/search', filters, {
            params: { page, limit }
        });
        return response.data as PaginatedResponse<ViralSong>;
    }

    async autocompleteSearch(query: string): Promise<{ title: string; artist: string; id: string }[]> {
        const response = await apiClient.get('/music/autocomplete', {
            params: { q: query }
        });
        return response.data as { title: string; artist: string; id: string }[];
    }

    // ===== FEATURE #3: Viral Analysis =====

    async getSongDetails(songId: string): Promise<ViralSong> {
        const response = await apiClient.get(`/music/${songId}`);
        return response.data as ViralSong;
    }

    async getViralAnalysis(songId: string): Promise<ViralSong['analysis']> {
        const response = await apiClient.get(`/music/${songId}/analysis`);
        return response.data as ViralSong['analysis'];
    }

    // ===== FEATURE #4: AI Predictions =====

    async getPredictions(songId: string): Promise<{
        viralScore: number;
        lifecycleStage: ViralSong['lifecycleStage'];
        peakForecast: ViralSong['peakForecast'];
        confidence: number;
    }> {
        const response = await apiClient.get(`/music/${songId}/predictions`);
        return response.data as any;
    }

    async getEmergingSongs(limit: number = 10): Promise<ViralSong[]> {
        const response = await apiClient.get('/music/emerging', {
            params: { limit }
        });
        return response.data as ViralSong[];
    }

    async getPeakingSoons(daysAhead: number = 7): Promise<ViralSong[]> {
        const response = await apiClient.get('/music/peaking-soon', {
            params: { days: daysAhead }
        });
        return response.data as ViralSong[];
    }

    // ===== FEATURE #5: Creation Integration =====

    async generateContentIdeas(songId: string, count: number = 5): Promise<ContentIdea[]> {
        const response = await apiClient.post(`/music/${songId}/content-ideas`, {
            count
        });
        return response.data as ContentIdea[];
    }

    async getVideoTemplates(songId: string): Promise<VideoTemplate[]> {
        const response = await apiClient.get(`/music/${songId}/templates`);
        return response.data as VideoTemplate[];
    }

    async generateCaption(songId: string, contentType: string): Promise<{
        caption: string;
        hashtags: string[];
        hooks: string[];
    }> {
        const response = await apiClient.post(`/music/${songId}/generate-caption`, {
            contentType
        });
        return response.data as any;
    }

    async downloadAudioPreview(songId: string, format: 'mp3' | 'wav' = 'mp3'): Promise<Blob> {
        const response = await apiClient.get(`/music/${songId}/download`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data as Blob;
    }

    // ===== FEATURE #6: Demographics =====

    async getDemographics(songId: string): Promise<Demographics> {
        const response = await apiClient.get(`/music/${songId}/demographics`);
        return response.data as Demographics;
    }

    async getGeographicData(songId: string): Promise<Demographics['geographic']> {
        const response = await apiClient.get(`/music/${songId}/geographic`);
        return response.data as Demographics['geographic'];
    }

    // ===== FEATURE #7: Historical Analytics =====

    async getHistoricalData(songId: string, days: number = 30): Promise<TimeSeriesData> {
        const response = await apiClient.get(`/music/${songId}/historical`, {
            params: { days }
        });
        return response.data as TimeSeriesData;
    }

    async compareSongs(songIds: string[]): Promise<SongComparison> {
        const response = await apiClient.post('/music/compare', {
            songIds
        });
        return response.data as SongComparison;
    }

    async findSimilarPatterns(songId: string): Promise<ViralSong[]> {
        const response = await apiClient.get(`/music/${songId}/similar-patterns`);
        return response.data as ViralSong[];
    }

    async exportHistoricalData(songId: string, format: 'csv' | 'json' | 'pdf'): Promise<Blob> {
        const response = await apiClient.get(`/music/${songId}/export`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data as Blob;
    }

    // ===== FEATURE #8: Alerts =====

    async createAlert(rule: Omit<AlertRule, 'id' | 'createdAt'>): Promise<AlertRule> {
        const response = await apiClient.post('/music/alerts', rule);
        return response.data as AlertRule;
    }

    async getAlerts(): Promise<AlertRule[]> {
        const response = await apiClient.get('/music/alerts');
        return response.data as AlertRule[];
    }

    async updateAlert(id: string, updates: Partial<AlertRule>): Promise<AlertRule> {
        const response = await apiClient.patch(`/music/alerts/${id}`, updates);
        return response.data as AlertRule;
    }

    async deleteAlert(id: string): Promise<void> {
        await apiClient.delete(`/music/alerts/${id}`);
    }

    async getAlertHistory(limit: number = 50): Promise<Alert[]> {
        const response = await apiClient.get('/music/alerts/history', {
            params: { limit }
        });
        return response.data as Alert[];
    }

    async markAlertRead(alertId: string): Promise<void> {
        await apiClient.patch(`/music/alerts/history/${alertId}/read`);
    }

    async dismissAlert(alertId: string): Promise<void> {
        await apiClient.patch(`/music/alerts/history/${alertId}/dismiss`);
    }

    // ===== FEATURE #9: Social Proof =====

    async getTopVideos(songId: string, limit: number = 10): Promise<TopVideo[]> {
        const response = await apiClient.get(`/music/${songId}/top-videos`, {
            params: { limit }
        });
        return response.data as TopVideo[];
    }

    async getSuccessTips(songId: string): Promise<ViralSong['successTips']> {
        const response = await apiClient.get(`/music/${songId}/success-tips`);
        return response.data as ViralSong['successTips'];
    }

    // ===== FEATURE #10: Playlists =====

    async createPlaylist(playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<Playlist> {
        const response = await apiClient.post('/music/playlists', playlist);
        return response.data as Playlist;
    }

    async getPlaylists(): Promise<Playlist[]> {
        const response = await apiClient.get('/music/playlists');
        return response.data as Playlist[];
    }

    async getPlaylist(id: string): Promise<Playlist> {
        const response = await apiClient.get(`/music/playlists/${id}`);
        return response.data as Playlist;
    }

    async updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist> {
        const response = await apiClient.patch(`/music/playlists/${id}`, updates);
        return response.data as Playlist;
    }

    async deletePlaylist(id: string): Promise<void> {
        await apiClient.delete(`/music/playlists/${id}`);
    }

    async addSongToPlaylist(playlistId: string, songId: string): Promise<Playlist> {
        const response = await apiClient.post(`/music/playlists/${playlistId}/songs`, {
            songId
        });
        return response.data as Playlist;
    }

    async removeSongFromPlaylist(playlistId: string, songId: string): Promise<Playlist> {
        const response = await apiClient.delete(`/music/playlists/${playlistId}/songs/${songId}`);
        return response.data as Playlist;
    }

    async exportPlaylist(id: string, format: 'csv' | 'json' | 'spotify'): Promise<Blob | { spotifyUrl: string }> {
        const response = await apiClient.get(`/music/playlists/${id}/export`, {
            params: { format },
            responseType: format === 'spotify' ? 'json' : 'blob'
        });
        return response.data as any;
    }

    async sharePlaylist(id: string, userIds: string[]): Promise<Playlist> {
        const response = await apiClient.post(`/music/playlists/${id}/share`, {
            userIds
        });
        return response.data as Playlist;
    }

    // ===== FEATURE #11: Calendar =====

    async createContentEvent(event: Omit<ContentEvent, 'id'>): Promise<ContentEvent> {
        const response = await apiClient.post('/music/calendar/events', event);
        return response.data as ContentEvent;
    }

    async getCalendarEvents(startDate: string, endDate: string): Promise<ContentEvent[]> {
        const response = await apiClient.get('/music/calendar/events', {
            params: { start: startDate, end: endDate }
        });
        return response.data as ContentEvent[];
    }

    async updateContentEvent(id: string, updates: Partial<ContentEvent>): Promise<ContentEvent> {
        const response = await apiClient.patch(`/music/calendar/events/${id}`, updates);
        return response.data as ContentEvent;
    }

    async deleteContentEvent(id: string): Promise<void> {
        await apiClient.delete(`/music/calendar/events/${id}`);
    }

    async autoScheduleSongs(songIds: string[], strategy: 'peak_timing' | 'spread_evenly' | 'weekends', frequency: number): Promise<ContentEvent[]> {
        const response = await apiClient.post('/music/calendar/auto-schedule', {
            songIds,
            strategy,
            frequency
        });
        return response.data as ContentEvent[];
    }

    // ===== FEATURE #12: Licensing =====

    async getLicenseInfo(songId: string): Promise<LicenseInfo> {
        const response = await apiClient.get(`/music/${songId}/license`);
        return response.data as LicenseInfo;
    }

    async checkLicenseCompatibility(songId: string, platform: Platform): Promise<{
        allowed: boolean;
        monetizable: boolean;
        restrictions: string[];
    }> {
        const response = await apiClient.get(`/music/${songId}/license/check`, {
            params: { platform }
        });
        return response.data as any;
    }

    async purchaseLicense(songId: string, tier: 'basic' | 'premium' | 'enterprise'): Promise<{
        success: boolean;
        licenseKey: string;
        validUntil: string;
    }> {
        const response = await apiClient.post(`/music/${songId}/license/purchase`, {
            tier
        });
        return response.data as any;
    }

    async getAlternativeSongs(songId: string, limit: number = 5): Promise<ViralSong[]> {
        const response = await apiClient.get(`/music/${songId}/alternatives`, {
            params: { limit }
        });
        return response.data as ViralSong[];
    }

    // ===== FAVORITES =====

    async toggleFavorite(songId: string): Promise<{ isFavorite: boolean }> {
        const response = await apiClient.post(`/music/${songId}/favorite`);
        return response.data as { isFavorite: boolean };
    }

    async getFavorites(): Promise<ViralSong[]> {
        const response = await apiClient.get('/music/favorites');
        return response.data as ViralSong[];
    }
}

export const viralMusicService = new ViralMusicService();
export default viralMusicService;
