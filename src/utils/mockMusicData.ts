/**
 * Mock Data Generator for Viral Music Tracker
 * Realistic test data for all features
 */

import type {
    ViralSong,
    Platform,
    PlatformMetrics,
    LifecycleStage,
    TopVideo,
    SuccessTip,
    Playlist,
    AlertRule,
    Alert,
    ContentEvent,
    TimeSeriesData,
    DataPoint,
} from '../types/music';

// Real viral songs from 2024-2025
const MOCK_SONGS_DATA = [
    {
        title: 'Cupid - Twin Ver',
        artist: 'FIFTY FIFTY',
        genre: ['K-Pop', 'Pop'],
        mood: ['Happy', 'Romantic'],
        bpm: 122,
        duration: 174,
        language: 'Korean',
        challengeName: '#CupidChallenge',
        viralScore: 95,
        lifecycleStage: 'peak' as LifecycleStage,
    },
    {
        title: 'Unholy',
        artist: 'Sam Smith, Kim Petras',
        genre: ['Pop', 'Dance'],
        mood: ['Energetic', 'Party'],
        bpm: 134,
        duration: 156,
        language: 'English',
        challengeName: '#UnholyDance',
        viralScore: 92,
        lifecycleStage: 'declinando' as LifecycleStage,
    },
    {
        title: 'Shakira: Bzrp Music Sessions, Vol. 53',
        artist: 'Bizarrap, Shakira',
        genre: ['Reggaeton', 'Latin'],
        mood: ['Angry', 'Energetic'],
        bpm: 112,
        duration: 218,
        language: 'Spanish',
        challengeName: '#ShakiraBzrp',
        viralScore: 97,
        lifecycleStage: 'declinando' as LifecycleStage,
    },
    {
        title: 'Flowers',
        artist: 'Miley Cyrus',
        genre: ['Pop'],
        mood: ['Motivational', 'Happy'],
        bpm: 120,
        duration: 199,
        language: 'English',
        challengeName: '#FlowersChallenge',
        viralScore: 94,
        lifecycleStage: 'legacy' as LifecycleStage,
    },
    {
        title: 'Anti-Hero',
        artist: 'Taylor Swift',
        genre: ['Pop', 'Indie'],
        mood: ['Melancholic', 'Chill'],
        bpm: 97,
        duration: 200,
        language: 'English',
        challengeName: '#AntiHeroTrend',
        viralScore: 88,
        lifecycleStage: 'legacy' as LifecycleStage,
    },
    {
        title: 'Calm Down',
        artist: 'Rema, Selena Gomez',
        genre: ['Afrobeats', 'Pop'],
        mood: ['Chill', 'Romantic'],
        bpm: 105,
        duration: 239,
        language: 'English',
        challengeName: '#CalmDownDance',
        viralScore: 90,
        lifecycleStage: 'creciendo' as LifecycleStage,
    },
    {
        title: 'Ella Baila Sola',
        artist: 'Eslabon Armado, Peso Pluma',
        genre: ['Regional Mexicano', 'Latin'],
        mood: ['Sad', 'Romantic'],
        bpm: 140,
        duration: 202,
        language: 'Spanish',
        challengeName: '#EllaBailaSola',
        viralScore: 91,
        lifecycleStage: 'creciendo' as LifecycleStage,
    },
    {
        title: 'TQG',
        artist: 'KAROL G, Shakira',
        genre: ['Reggaeton', 'Latin'],
        mood: ['Energetic', 'Party'],
        bpm: 128,
        duration: 193,
        language: 'Spanish',
        challengeName: '#TQGDance',
        viralScore: 89,
        lifecycleStage: 'peak' as LifecycleStage,
    },
    {
        title: 'Boy\'s a liar Pt. 2',
        artist: 'PinkPantheress, Ice Spice',
        genre: ['Pop', 'Hip-Hop'],
        mood: ['Energetic', 'Playful'],
        bpm: 143,
        duration: 127,
        language: 'English',
        challengeName: '#BoysALiar',
        viralScore: 86,
        lifecycleStage: 'declinando' as LifecycleStage,
    },
    {
        title: 'Vampire',
        artist: 'Olivia Rodrigo',
        genre: ['Pop', 'Alternative'],
        mood: ['Angry', 'Melancholic'],
        bpm: 138,
        duration: 219,
        language: 'English',
        challengeName: '#VampireChallenge',
        viralScore: 87,
        lifecycleStage: 'legacy' as LifecycleStage,
    },
    // New emerging songs
    {
        title: 'Paint The Town Red',
        artist: 'Doja Cat',
        genre: ['Hip-Hop', 'Pop'],
        mood: ['Energetic', 'Party'],
        bpm: 110,
        duration: 213,
        language: 'English',
        challengeName: '#PaintTheTownRed',
        viralScore: 93,
        lifecycleStage: 'peak' as LifecycleStage,
    },
    {
        title: 'Snooze',
        artist: 'SZA',
        genre: ['R&B', 'Pop'],
        mood: ['Romantic', 'Chill'],
        bpm: 104,
        duration: 201,
        language: 'English',
        challengeName: '#SnoozeChallenge',
        viralScore: 84,
        lifecycleStage: 'creciendo' as LifecycleStage,
    },
    {
        title: 'Greedy',
        artist: 'Tate McRae',
        genre: ['Pop', 'Dance'],
        mood: ['Energetic', 'Happy'],
        bpm: 126,
        duration: 132,
        language: 'English',
        challengeName: '#GreedyDance',
        viralScore: 78,
        lifecycleStage: 'emergente' as LifecycleStage,
    },
    {
        title: 'Water',
        artist: 'Tyla',
        genre: ['Afrobeats', 'Pop'],
        mood: ['Energetic', 'Party'],
        bpm: 118,
        duration: 129,
        language: 'English',
        challengeName: '#WaterDance',
        viralScore: 82,
        lifecycleStage: 'emergente' as LifecycleStage,
    },
    {
        title: 'Monaco',
        artist: 'Bad Bunny',
        genre: ['Reggaeton', 'Latin'],
        mood: ['Party', 'Energetic'],
        bpm: 98,
        duration: 242,
        language: 'Spanish',
        challengeName: '#MonacoChallenge',
        viralScore: 85,
        lifecycleStage: 'creciendo' as LifecycleStage,
    },
];

function generateId(): string {
    return `song_${Math.random().toString(36).substr(2, 9)}`;
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray<T>(arr: T[]): T {
    const index = Math.floor(Math.random() * arr.length);
    const value = arr[index];
    // Type assertion - array is never empty in our usage
    if (value === undefined) return arr[0]!;
    return value;
}

function generatePlatformMetrics(
    platform: Platform,
    baseVideos: number,
    lifecycleStage: LifecycleStage
): PlatformMetrics {
    const growthMultiplier = {
        emergente: { min: 100, max: 500 },
        creciendo: { min: 50, max: 150 },
        peak: { min: 10, max: 50 },
        declinando: { min: -20, max: 10 },
        legacy: { min: -10, max: 5 },
    }[lifecycleStage];

    const statusMap: Record<LifecycleStage, PlatformMetrics['status']> = {
        emergente: 'RISING',
        creciendo: 'TRENDING',
        peak: 'VIRAL',
        declinando: 'STABLE',
        legacy: 'STABLE',
    };

    return {
        platform,
        status: statusMap[lifecycleStage],
        videosCreated: Math.floor(baseVideos * (platform === 'tiktok' ? 1 : platform === 'instagram' ? 0.6 : 0.3)),
        growth24h: randomInt(growthMultiplier.min, growthMultiplier.max),
        growth7d: randomInt(growthMultiplier.min * 1.5, growthMultiplier.max * 1.5),
        growth30d: randomInt(growthMultiplier.min * 2, growthMultiplier.max * 2),
        avgViews: randomInt(50000, 5000000),
        avgEngagement: randomInt(4, 15),
        lastUpdated: new Date().toISOString(),
    };
}

export function generateMockSong(index: number = 0): ViralSong {
    const baseData = MOCK_SONGS_DATA[index % MOCK_SONGS_DATA.length]!;
    const id = generateId();
    const baseVideos = randomInt(10000, 500000);

    const platforms: ViralSong['platforms'] = {
        tiktok: generatePlatformMetrics('tiktok', baseVideos, baseData.lifecycleStage),
        instagram: generatePlatformMetrics('instagram', baseVideos, baseData.lifecycleStage),
        youtube: generatePlatformMetrics('youtube', baseVideos, baseData.lifecycleStage),
        facebook: Math.random() > 0.3 ? generatePlatformMetrics('facebook', baseVideos, baseData.lifecycleStage) : undefined,
    };

    const daysUntilPeak = {
        emergente: randomInt(3, 7),
        creciendo: randomInt(1, 3),
        peak: 0,
        declinando: -randomInt(5, 15),
        legacy: -randomInt(30, 90),
    }[baseData.lifecycleStage];

    return {
        id,
        title: baseData.title,
        artist: baseData.artist,
        releaseDate: new Date(Date.now() - randomInt(30, 180) * 24 * 60 * 60 * 1000).toISOString(),
        coverArt: `https://i.scdn.co/image/${id}`,
        previewUrl: `https://audio.example.com/${id}.mp3`,

        duration: baseData.duration,
        bpm: baseData.bpm,
        genre: baseData.genre,
        mood: baseData.mood,
        language: baseData.language,
        explicit: Math.random() > 0.7,

        platforms,
        totalVideos: baseVideos,
        totalViews: baseVideos * randomInt(50000, 500000),
        totalEngagement: randomInt(5, 15),

        viralScore: baseData.viralScore,
        lifecycleStage: baseData.lifecycleStage,
        peakForecast: {
            daysUntilPeak,
            estimatedPeakDate: new Date(Date.now() + daysUntilPeak * 24 * 60 * 60 * 1000).toISOString(),
            confidence: Math.random() * 0.3 + 0.7,
            predictedMaxVideos: Math.floor(baseVideos * randomInt(15, 30) / 10),
            currentTrajectory: baseData.lifecycleStage === 'emergente' ? 'accelerating' : baseData.lifecycleStage === 'creciendo' ? 'steady' : 'slowing',
        },
        confidence: Math.random() * 0.3 + 0.7,

        analysis: {
            totalVideos: baseVideos,
            challengeName: baseData.challengeName,
            trendHashtags: [
                baseData.challengeName,
                `#${baseData.title.replace(/\s+/g, '')}`,
                '#fyp',
                '#viral',
                '#trending',
            ],
            peakDate: baseData.lifecycleStage === 'peak' || baseData.lifecycleStage === 'declinando' || baseData.lifecycleStage === 'legacy'
                ? new Date(Date.now() - Math.abs(daysUntilPeak) * 24 * 60 * 60 * 1000).toISOString()
                : undefined,
            useCases: randomFromArray([
                ['Dance', 'Transition'],
                ['Lip Sync', 'POV'],
                ['Challenge', 'Dance'],
                ['Before/After', 'Transition'],
            ]),
            avgVideoDuration: randomInt(15, 60),
            successRate: randomInt(15, 45),
            topCreatorTiers: ['mega', 'macro', 'micro'],
        },

        demographics: {
            geographic: [
                { country: 'United States', countryCode: 'US', flag: '🇺🇸', percentage: randomInt(30, 50), videoCount: Math.floor(baseVideos * 0.4) },
                { country: 'Brazil', countryCode: 'BR', flag: '🇧🇷', percentage: randomInt(15, 25), videoCount: Math.floor(baseVideos * 0.2) },
                { country: 'Mexico', countryCode: 'MX', flag: '🇲🇽', percentage: randomInt(10, 20), videoCount: Math.floor(baseVideos * 0.15) },
                { country: 'Philippines', countryCode: 'PH', flag: '🇵🇭', percentage: randomInt(5, 15), videoCount: Math.floor(baseVideos * 0.1) },
                { country: 'India', countryCode: 'IN', flag: '🇮🇳', percentage: randomInt(5, 10), videoCount: Math.floor(baseVideos * 0.08) },
            ],
            gender: {
                male: randomInt(25, 45),
                female: randomInt(50, 70),
                other: randomInt(1, 5),
                nonBinary: randomInt(1, 3),
            },
            ageRanges: [
                { range: '13-17', percentage: randomInt(15, 25), engagement: randomInt(8, 12) },
                { range: '18-24', percentage: randomInt(40, 60), engagement: randomInt(10, 15) },
                { range: '25-34', percentage: randomInt(15, 25), engagement: randomInt(6, 10) },
                { range: '35-44', percentage: randomInt(5, 10), engagement: randomInt(4, 7) },
                { range: '45+', percentage: randomInt(2, 5), engagement: randomInt(3, 5) },
            ],
            niches: randomFromArray([
                ['Fashion', 'Dance', 'Beauty'],
                ['Fitness', 'Lifestyle', 'Dance'],
                ['Comedy', 'POV', 'Lifestyle'],
                ['Beauty', 'Tutorial', 'Fashion'],
            ]),
            timeOfDay: [
                { hour: 14, percentage: 18, timezone: 'EST' },
                { hour: 19, percentage: 25, timezone: 'EST' },
                { hour: 21, percentage: 22, timezone: 'EST' },
            ],
        },

        topVideos: generateTopVideos(id, 10),
        successTips: generateSuccessTips(baseData.challengeName),

        licensing: {
            isLicensed: Math.random() > 0.4,
            allowedPlatforms: ['tiktok', 'instagram', 'facebook'] as Platform[],
            restrictedPlatforms: Math.random() > 0.5 ? ['youtube'] as Platform[] : [],
            monetizationAllowed: Math.random() > 0.3,
            copyrightStrikeRisk: randomFromArray(['low', 'medium', 'high']),
            termsUrl: 'https://example.com/license-terms',
        },

        historicalDataAvailable: true,
        createdAt: new Date(Date.now() - randomInt(30, 90) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
    };
}

function generateTopVideos(songId: string, count: number): TopVideo[] {
    const creators = [
        { name: 'Charli D\'Amelio', handle: '@charlidamelio', avatar: 'https://avatar1.jpg' },
        { name: 'Addison Rae', handle: '@addisonre', avatar: 'https://avatar2.jpg' },
        { name: 'Bella Poarch', handle: '@bellapoarch', avatar: 'https://avatar3.jpg' },
        { name: 'Zach King', handle: '@zachking', avatar: 'https://avatar4.jpg' },
        { name: 'Loren Gray', handle: '@lorengray', avatar: 'https://avatar5.jpg' },
    ];

    return Array.from({ length: count }, (_, i) => {
        const creator = randomFromArray(creators);
        const views = randomInt(1000000, 50000000);
        const likes = Math.floor(views * randomInt(8, 15) / 100);

        return {
            id: `video_${i}_${songId}`,
            creator: creator.name,
            creatorHandle: creator.handle,
            creatorAvatar: creator.avatar,
            creatorFollowers: randomInt(500000, 100000000),
            views,
            likes,
            comments: Math.floor(likes * 0.1),
            shares: Math.floor(likes * 0.05),
            platform: randomFromArray(['tiktok', 'instagram', 'youtube'] as Platform[]),
            videoType: randomFromArray(['Dance', 'Lip Sync', 'Transition', 'Challenge', 'POV']),
            url: `https://tiktok.com/@${creator.handle}/video/${randomInt(1000000000, 9999999999)}`,
            thumbnailUrl: `https://thumbnail.example.com/${i}.jpg`,
            createdAt: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
            engagementRate: randomInt(8, 15),
        };
    });
}

function generateSuccessTips(challengeName: string): SuccessTip[] {
    return [
        {
            icon: '💡',
            text: `Videos tipo "Transformation" funcionan mejor con ${challengeName}`,
            basedOn: '15.2M combined views',
            confidence: 0.92,
        },
        {
            icon: '⏰',
            text: 'Post between 2-4 PM EST for maximum reach',
            basedOn: 'Peak engagement analysis',
            confidence: 0.87,
        },
        {
            icon: '🎬',
            text: 'Start with a strong hook in the first 3 seconds',
            basedOn: 'Top 100 videos analysis',
            confidence: 0.95,
        },
        {
            icon: '🔍',
            text: 'Use 5-8 relevant hashtags including trending ones',
            basedOn: 'Algorithm optimization',
            confidence: 0.89,
        },
    ];
}

export function generateMockSongs(count: number = 15): ViralSong[] {
    return Array.from({ length: count }, (_, i) => generateMockSong(i));
}

export function generateMockPlaylist(): Playlist {
    return {
        id: `playlist_${generateId()}`,
        name: randomFromArray(['Dance Hits', 'Trending Now', 'My Favorites', 'For Reels', 'Challenges']),
        description: 'My curated collection of viral songs',
        category: randomFromArray(['reels', 'dance', 'challenges', 'trending', 'custom']),
        songs: generateMockSongs(randomInt(5, 15)).map(s => s.id),
        isPublic: Math.random() > 0.5,
        sharedWith: [],
        color: randomFromArray(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']),
        icon: randomFromArray(['🎵', '🔥', '💃', '🎶', '⭐']),
        createdAt: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export function generateMockContentEvent(songId: string): ContentEvent {
    const date = new Date(Date.now() + randomInt(1, 30) * 24 * 60 * 60 * 1000);

    return {
        id: `event_${generateId()}`,
        songId,
        date: date.toISOString(),
        time: `${randomInt(8, 22)}:00`,
        contentType: randomFromArray(['Dance', 'Lip Sync', 'Challenge', 'Transition']),
        platform: randomFromArray(['tiktok', 'instagram', 'youtube'] as Platform[]),
        caption: 'New trending video coming!',
        hashtags: ['#viral', '#trending', '#fyp'],
        status: randomFromArray(['planned', 'scheduled']),
        remindersBefore: [24, 2],
        notes: 'Remember to film during golden hour',
    };
}

export function generateMockAlertRule(): AlertRule {
    return {
        id: `alert_${generateId()}`,
        name: 'New Emerging Songs',
        enabled: true,
        type: 'new_emerging',
        conditions: {
            viralScore: { min: 75 },
            growthRate: { min: 100, period: '24h' },
            platforms: ['tiktok', 'instagram'],
            lifecycleStage: ['emergente', 'creciendo'],
        },
        channels: {
            push: true,
            email: true,
        },
        frequency: 'instant',
        createdAt: new Date().toISOString(),
    };
}

export function generateMockAlert(songId: string): Alert {
    return {
        id: `alert_notif_${generateId()}`,
        ruleId: `alert_${generateId()}`,
        songId,
        type: 'new_emerging',
        title: '🚨 Nueva canción emergente detectada',
        message: 'Shakira - Copa Vacía está creciendo rápidamente',
        metric: '+890% en 12 horas',
        priority: 'high',
        createdAt: new Date(Date.now() - randomInt(1, 120) * 60 * 1000).toISOString(),
    };
}

export function generateMockTimeSeriesData(songId: string, days: number = 30): TimeSeriesData {
    const dataPoints: DataPoint[] = [];
    const now = Date.now();

    for (let i = days; i >= 0; i--) {
        const timestamp = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();
        const baseVideos = randomInt(1000, 50000) * (days - i + 1) / days;

        dataPoints.push({
            timestamp,
            videosCreated: Math.floor(baseVideos),
            growthRate: randomInt(10, 200),
            viralScore: randomInt(50, 100),
            platforms: {
                tiktok: { videos: Math.floor(baseVideos * 0.6), growth: randomInt(20, 150) },
                instagram: { videos: Math.floor(baseVideos * 0.3), growth: randomInt(15, 100) },
                youtube: { videos: Math.floor(baseVideos * 0.1), growth: randomInt(10, 80) },
            },
        });
    }

    return {
        songId,
        dataPoints,
        granularity: 'daily',
    };
}

export const mockMusicData = {
    songs: generateMockSongs(20),
    playlists: Array.from({ length: 5 }, () => generateMockPlaylist()),
};
