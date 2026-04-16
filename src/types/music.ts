/**
 * Viral Music Tracker - Type Definitions
 * Complete type system for all 12 features
 */

// ===== PLATFORM TYPES =====
export type Platform =
    | 'tiktok'
    | 'instagram'
    | 'facebook'
    | 'youtube'
    | 'spotify'
    | 'apple_music'
    | 'soundcloud'
    | 'twitter';

export type PlatformStatus = 'VIRAL' | 'HOT' | 'TRENDING' | 'RISING' | 'STABLE';

export type LifecycleStage =
    | 'emergente'    // 🌱 Just starting to grow - USE NOW!
    | 'creciendo'    // 📈 Growing fast
    | 'peak'         // 🔥 At maximum - saturated
    | 'declinando'   // 📉 Declining - avoid
    | 'legacy';      // Archive

// ===== FILTER TYPES (Feature #2) =====
export type SortOption =
    | 'growth_rate'
    | 'usage_24h'
    | 'usage_7d'
    | 'usage_30d'
    | 'viral_score'
    | 'created_date'
    | 'alphabetical';

export type ContentType =
    | 'Dance'
    | 'Lip Sync'
    | 'Transition'
    | 'Challenge'
    | 'POV'
    | 'Tutorial'
    | 'Comedy'
    | 'Before/After'
    | 'Music'
    | 'Vlog';

// ===== MAIN INTERFACES =====

export interface PlatformMetrics {
    platform: Platform;
    status: PlatformStatus;
    videosCreated: number;
    growth24h: number;              // percentage
    growth7d: number;
    growth30d: number;
    avgViews: number;
    avgEngagement: number;          // percentage (likes+comments+shares / views)
    peakTime?: string;              // ISO date when it peaked
    lastUpdated: string;
}

export interface ViralSong {
    id: string;
    title: string;
    artist: string;
    album?: string;
    releaseDate: string;
    coverArt: string;
    previewUrl?: string;            // Audio preview URL

    // Audio properties
    duration: number;                // seconds
    bpm: number;
    genre: string[];
    mood: string[];
    language: string;
    explicit: boolean;

    // Multi-platform metrics (Feature #1)
    platforms: {
        [key in Platform]?: PlatformMetrics;
    };

    // Overall aggregated metrics
    totalVideos: number;
    totalViews: number;
    totalEngagement: number;

    // AI Predictions (Feature #4)
    viralScore: number;              // 1-100
    lifecycleStage: LifecycleStage;
    peakForecast: PeakForecast;
    confidence: number;              // 0-1 prediction confidence

    // Viral Analysis (Feature #3)
    analysis: ViralAnalysis;

    // Demographics (Feature #6)
    demographics: Demographics;

    // Social Proof (Feature #9)
    topVideos: TopVideo[];
    successTips: SuccessTip[];

    // Licensing (Feature #12)
    licensing: LicenseInfo;

    // Historical data reference
    historicalDataAvailable: boolean;

    // Metadata
    createdAt: string;
    updatedAt: string;
    isFavorite?: boolean;
    playlists?: string[];            // playlist IDs this song belongs to
}

export interface PeakForecast {
    daysUntilPeak: number;
    estimatedPeakDate: string;
    confidence: number;               // 0-1
    predictedMaxVideos: number;
    currentTrajectory: 'accelerating' | 'steady' | 'slowing';
}

export interface ViralAnalysis {
    totalVideos: number;
    challengeName?: string;
    trendHashtags: string[];
    peakDate?: string;
    useCases: ContentType[];
    avgVideoDuration: number;         // seconds
    successRate: number;              // percentage of videos that go viral
    topCreatorTiers: ('mega' | 'macro' | 'micro' | 'nano')[];
}

export interface Demographics {
    geographic: CountryDistribution[];
    gender: GenderBreakdown;
    ageRanges: AgeDistribution[];
    niches: string[];
    timeOfDay: TimeDistribution[];
}

export interface CountryDistribution {
    country: string;
    countryCode: string;              // ISO 2-letter
    flag: string;                     // emoji
    percentage: number;
    videoCount: number;
}

export interface GenderBreakdown {
    male: number;
    female: number;
    other: number;
    nonBinary: number;
}

export interface AgeDistribution {
    range: string;                    // "13-17", "18-24", "25-34", "35-44", "45+"
    percentage: number;
    engagement: number;               // avg engagement for this age group
}

export interface TimeDistribution {
    hour: number;                     // 0-23
    percentage: number;
    timezone: string;
}

export interface TopVideo {
    id: string;
    creator: string;
    creatorHandle: string;
    creatorAvatar?: string;
    creatorFollowers?: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    platform: Platform;
    videoType: ContentType;
    url: string;
    thumbnailUrl: string;
    createdAt: string;
    engagementRate: number;
}

export interface SuccessTip {
    icon: string;                     // emoji
    text: string;
    basedOn: string;                  // "15.2M combined views"
    confidence: number;               // 0-1
}

export interface LicenseInfo {
    isLicensed: boolean;
    rightsHolder?: string;
    allowedPlatforms: Platform[];
    restrictedPlatforms: Platform[];
    monetizationAllowed: boolean;
    cost?: {
        amount: number;
        currency: string;
        period: 'monthly' | 'yearly' | 'one-time';
        tier: 'basic' | 'premium' | 'enterprise';
    };
    termsUrl?: string;
    copyrightStrikeRisk: 'low' | 'medium' | 'high';
    alternatives?: string[];          // Alternative song IDs with similar vibe
}

// ===== FILTERS (Feature #2) =====

export interface MusicFilters {
    // Platform filters
    platforms: Platform[];

    // Audio properties
    genres: string[];
    bpmRange: [number, number];      // [min, max] e.g., [120, 140]
    moods: string[];
    durationRange: [number, number]; // seconds [min, max]
    languages: string[];
    explicitContent: 'all' | 'clean' | 'explicit';

    // Geographic
    countries: string[];              // country codes
    regions: string[];                // e.g., "North America", "Latin America"

    // Viral metrics
    viralScoreRange: [number, number]; // [0, 100]
    lifecycleStages: LifecycleStage[];
    minVideos: number;
    minGrowthRate: number;            // percentage

    // Sort & order
    sortBy: SortOption;
    sortOrder: 'asc' | 'desc';

    // Content type
    contentTypes: ContentType[];

    // Date range
    dateRange?: {
        start: string;
        end: string;
    };
}

export const DEFAULT_FILTERS: MusicFilters = {
    platforms: [],
    genres: [],
    bpmRange: [60, 200],
    moods: [],
    durationRange: [0, 300],
    languages: [],
    explicitContent: 'all',
    countries: [],
    regions: [],
    viralScoreRange: [0, 100],
    lifecycleStages: [],
    minVideos: 0,
    minGrowthRate: 0,
    sortBy: 'viral_score',
    sortOrder: 'desc',
    contentTypes: [],
};

// ===== PLAYLISTS (Feature #10) =====

export interface Playlist {
    id: string;
    name: string;
    description?: string;
    category: 'reels' | 'dance' | 'background' | 'challenges' | 'trending' | 'custom';
    songs: string[];                  // song IDs
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
    isPublic: boolean;
    sharedWith: string[];             // user IDs
    color?: string;                   // hex color for UI
    icon?: string;                    // emoji
}

// ===== CALENDAR (Feature #11) =====

export interface ContentEvent {
    id: string;
    songId: string;
    date: string;                     // ISO date
    time?: string;                    // "14:00"
    contentType: ContentType;
    platform: Platform;
    caption?: string;
    hashtags?: string[];
    status: 'planned' | 'scheduled' | 'posted' | 'cancelled';
    remindersBefore: number[];        // hours before [24, 2, 0.5]
    notes?: string;
    assignedTo?: string;              // user ID
}

export interface CalendarView {
    mode: 'day' | 'week' | 'month';
    currentDate: string;
    events: ContentEvent[];
}

// ===== ALERTS (Feature #8) =====

export interface AlertRule {
    id: string;
    name: string;
    enabled: boolean;
    type: 'new_emerging' | 'threshold_reached' | 'peak_approaching' | 'pattern_match';

    conditions: {
        viralScore?: { min?: number; max?: number };
        growthRate?: { min: number; period: '24h' | '7d' | '30d' };
        platforms?: Platform[];
        genres?: string[];
        lifecycleStage?: LifecycleStage[];
        minVideos?: number;
    };

    channels: {
        push: boolean;
        email: boolean;
        slack?: {
            webhookUrl: string;
            channel: string;
        };
        discord?: {
            webhookUrl: string;
        };
    };

    frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
    quietHours?: {
        start: string;                  // "22:00"
        end: string;                    // "08:00"
        timezone: string;
    };

    createdAt: string;
    lastTriggered?: string;
}

export interface Alert {
    id: string;
    ruleId: string;
    songId: string;
    type: AlertRule['type'];
    title: string;
    message: string;
    metric?: string;                  // "+890% in 12 hours"
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    readAt?: string;
    dismissedAt?: string;
    actionTaken?: 'viewed' | 'added_to_playlist' | 'scheduled' | 'ignored';
}

// ===== HISTORICAL DATA (Feature #7) =====

export interface TimeSeriesData {
    songId: string;
    dataPoints: DataPoint[];
    granularity: 'hourly' | 'daily' | 'weekly';
}

export interface DataPoint {
    timestamp: string;
    videosCreated: number;
    growthRate: number;
    viralScore: number;
    platforms: {
        [key in Platform]?: {
            videos: number;
            growth: number;
        };
    };
}

export interface SongComparison {
    songs: ViralSong[];
    metrics: ComparisonMetric[];
    timeSeries: {
        [songId: string]: TimeSeriesData;
    };
    winner?: {
        songId: string;
        reason: string;
    };
}

export interface ComparisonMetric {
    name: string;
    label: string;
    values: {
        [songId: string]: number | string;
    };
    winner?: string;                  // song ID with best value
}

// ===== CONTENT IDEAS (Feature #5) =====

export interface ContentIdea {
    id: string;
    type: ContentType;
    title: string;
    description: string;
    caption: string;
    hashtags: string[];
    hooks: string[];                  // Opening lines
    tips: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedViews: string;           // "100K-500K"
    successRate: number;              // 0-1
    exampleVideos?: string[];         // URLs
}

export interface VideoTemplate {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    duration: number;                 // seconds
    scenes: TemplateScene[];
    difficulty: 'easy' | 'medium' | 'hard';
    trending: boolean;
    usageCount: number;
}

export interface TemplateScene {
    id: string;
    order: number;
    duration: number;
    type: 'intro' | 'main' | 'transition' | 'outro';
    instruction: string;
    example?: string;                 // example video URL or image
}

// ===== API RESPONSES =====

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: {
        code: string;
        message: string;
    };
    meta?: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

// ===== ENUMS & CONSTANTS =====

export const GENRES = [
    'Pop',
    'Hip-Hop',
    'Reggaeton',
    'EDM',
    'Dance',
    'Rock',
    'Latin',
    'R&B',
    'Country',
    'K-Pop',
    'J-Pop',
    'Afrobeats',
    'Trap',
    'House',
    'Indie',
    'Alternative',
] as const;

export const MOODS = [
    'Happy',
    'Sad',
    'Energetic',
    'Chill',
    'Romantic',
    'Angry',
    'Motivational',
    'Melancholic',
    'Party',
    'Relaxing',
    'Intense',
    'Playful',
] as const;

export const LANGUAGES = [
    'English',
    'Spanish',
    'Portuguese',
    'French',
    'German',
    'Korean',
    'Japanese',
    'Chinese',
    'Hindi',
    'Arabic',
    'Other',
] as const;

export const PLATFORM_NAMES: Record<Platform, string> = {
    tiktok: 'TikTok',
    instagram: 'Instagram',
    facebook: 'Facebook',
    youtube: 'YouTube Shorts',
    spotify: 'Spotify',
    apple_music: 'Apple Music',
    soundcloud: 'SoundCloud',
    twitter: 'Twitter/X',
};

export const PLATFORM_ICONS: Record<Platform, string> = {
    tiktok: '🎵',
    instagram: '📷',
    facebook: '👍',
    youtube: '▶️',
    spotify: '🎧',
    apple_music: '🍎',
    soundcloud: '☁️',
    twitter: '🐦',
};

export const LIFECYCLE_ICONS: Record<LifecycleStage, string> = {
    emergente: '🌱',
    creciendo: '📈',
    peak: '🔥',
    declinando: '📉',
    legacy: '📚',
};

export const LIFECYCLE_LABELS: Record<LifecycleStage, string> = {
    emergente: 'Emergente - ¡Usa YA!',
    creciendo: 'Creciendo Rápido',
    peak: 'En Peak - Saturado',
    declinando: 'Declinando - Evita',
    legacy: 'Clásico',
};

export const LIFECYCLE_COLORS: Record<LifecycleStage, string> = {
    emergente: 'from-green-400 to-emerald-500',
    creciendo: 'from-blue-400 to-cyan-500',
    peak: 'from-red-400 to-pink-500',
    declinando: 'from-gray-400 to-gray-500',
    legacy: 'from-purple-400 to-indigo-500',
};
