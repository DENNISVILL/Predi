import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { pricingPlans } from '../data/pricingData';

// ============================================
// TYPES & INTERFACES
// ============================================

interface User {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    planId?: string;
    tier?: string;
    [key: string]: any;
}

interface Trend {
    id: number | string;
    name: string;
    platform: string;
    growth: string;
    confidence: number;
    country?: string;
    category: string;
    description: string;
    tags: string[];
    createdAt: string;
    isFollowing: boolean;
    [key: string]: any;
}

interface Alert {
    id: number;
    title: string;
    message: string;
    type: string;
    platform: string;
    confidence: number;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
}

interface Notifications {
    viral: boolean;
    microtendencias: boolean;
    seguimiento: boolean;
    recomendaciones: boolean;
    email: boolean;
    push: boolean;
}

interface Metrics {
    emergingTrends: number;
    activePredictions: number;
    pendingAlerts: number;
    followedTrends: number;
    successRate: number;
}

interface Filters {
    platform: string;
    country: string;
    category: string;
    timeRange: string;
    confidence: number;
}

// Main Store State Interface
interface StoreState {
    // Authentication
    user: User | null;
    isAuthenticated: boolean;

    // Configuration
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    notifications: Notifications;

    // Data
    trends: Trend[];
    trendingNow: Trend[];
    alerts: Alert[];
    metrics: Metrics;
    filters: Filters;
    searchHistory: string[];
    savedTrends: Trend[];
}

// Store Actions Interface
interface StoreActions {
    // Authentication Actions
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;

    // Configuration Actions
    setTheme: (theme: 'light' | 'dark') => void;
    setLanguage: (language: 'es' | 'en') => void;
    updateNotifications: (notifications: Partial<Notifications>) => void;

    // Trends Actions
    setTrends: (trends: Trend[]) => void;
    addTrend: (trend: Trend) => void;
    updateTrend: (id: number | string, updates: Partial<Trend>) => void;
    followTrend: (trendId: number | string) => void;
    unfollowTrend: (trendId: number | string) => void;
    saveTrend: (trend: Trend) => void;
    removeSavedTrend: (trendId: number | string) => void;

    // Alerts Actions
    addAlert: (alert: Omit<Alert, 'id'>) => void;
    markAlertAsRead: (alertId: number) => void;
    removeAlert: (alertId: number) => void;
    clearAllAlerts: () => void;

    // Filters Actions
    updateFilters: (newFilters: Partial<Filters>) => void;
    resetFilters: () => void;

    // Search Actions
    addToSearchHistory: (query: string) => void;
    clearSearchHistory: () => void;

    // Metrics Actions
    updateMetrics: (newMetrics: Partial<Metrics>) => void;

    // Utility Methods
    getTrendById: (id: number | string) => Trend | undefined;
    getUnreadAlerts: () => Alert[];
    getFilteredTrends: () => Trend[];
    checkAccess: (featureKey: string) => any;
    isPlatformAllowed: (platformName: string) => boolean;
}

// Complete Store Type
type Store = StoreState & StoreActions;

// ============================================
// STORE IMPLEMENTATION
// ============================================

const useStore = create<Store>()(
    persist(
        (set, get) => ({
            // ========== Initial State ==========

            // Authentication
            user: null,
            isAuthenticated: false,

            // Configuration
            theme: 'dark',
            language: 'es',
            notifications: {
                viral: true,
                microtendencias: true,
                seguimiento: false,
                recomendaciones: true,
                email: true,
                push: true
            },

            // Data
            trends: [],
            trendingNow: [
                {
                    id: 1,
                    name: '#ViralDance2025',
                    platform: 'TikTok',
                    growth: '+245%',
                    confidence: 94,
                    country: '🇲🇽',
                    category: 'Entretenimiento',
                    description: 'Nueva danza viral que está explotando en TikTok México',
                    tags: ['dance', 'viral', 'tiktok', 'mexico'],
                    createdAt: new Date().toISOString(),
                    isFollowing: false
                },
                {
                    id: 2,
                    name: 'AI Photography',
                    platform: 'Instagram',
                    growth: '+180%',
                    confidence: 87,
                    country: '🇺🇸',
                    category: 'Tecnología',
                    description: 'Fotografía generada por IA ganando tracción en Instagram',
                    tags: ['ai', 'photography', 'instagram', 'tech'],
                    createdAt: new Date().toISOString(),
                    isFollowing: false
                },
                {
                    id: 3,
                    name: 'Crypto Gaming',
                    platform: 'Twitter',
                    growth: '+156%',
                    confidence: 92,
                    country: '🇰🇷',
                    category: 'Gaming',
                    description: 'Juegos blockchain emergentes en el mercado coreano',
                    tags: ['crypto', 'gaming', 'blockchain', 'korea'],
                    createdAt: new Date().toISOString(),
                    isFollowing: false
                }
            ],
            alerts: [
                {
                    id: 1,
                    title: 'Nueva microtendencia detectada',
                    message: '#SustainableFashion está creciendo +89% en las últimas 6 horas',
                    type: 'trend',
                    platform: 'Instagram',
                    confidence: 91,
                    timestamp: new Date().toISOString(),
                    isRead: false,
                    actionUrl: '/trend/sustainable-fashion'
                },
                {
                    id: 2,
                    title: 'Predicción confirmada',
                    message: 'Tu predicción sobre #TechTok se cumplió. +156% de crecimiento',
                    type: 'prediction',
                    platform: 'TikTok',
                    confidence: 95,
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    isRead: false,
                    actionUrl: '/trend/techtok'
                }
            ],
            metrics: {
                emergingTrends: 247,
                activePredictions: 89,
                pendingAlerts: 15,
                followedTrends: 23,
                successRate: 87.5
            },
            filters: {
                platform: 'all',
                country: 'all',
                category: 'all',
                timeRange: '24h',
                confidence: 80
            },
            searchHistory: [],
            savedTrends: [],

            // ========== Actions ==========

            // Authentication
            login: (userData) => set({
                user: userData,
                isAuthenticated: true
            }),

            logout: () => set({
                user: null,
                isAuthenticated: false
            }),

            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            })),

            // Configuration
            setTheme: (theme) => set({ theme }),

            setLanguage: (language) => set({ language }),

            updateNotifications: (notifications) => set((state) => ({
                notifications: { ...state.notifications, ...notifications }
            })),

            // Trends
            setTrends: (trends) => set({ trends }),

            addTrend: (trend) => set((state) => ({
                trends: [...state.trends, trend]
            })),

            updateTrend: (id, updates) => set((state) => ({
                trends: state.trends.map(trend =>
                    trend.id === id ? { ...trend, ...updates } : trend
                ),
                trendingNow: state.trendingNow.map(trend =>
                    trend.id === id ? { ...trend, ...updates } : trend
                )
            })),

            followTrend: (trendId) => set((state) => ({
                trendingNow: state.trendingNow.map(trend =>
                    trend.id === trendId ? { ...trend, isFollowing: true } : trend
                ),
                trends: state.trends.map(trend =>
                    trend.id === trendId ? { ...trend, isFollowing: true } : trend
                )
            })),

            unfollowTrend: (trendId) => set((state) => ({
                trendingNow: state.trendingNow.map(trend =>
                    trend.id === trendId ? { ...trend, isFollowing: false } : trend
                ),
                trends: state.trends.map(trend =>
                    trend.id === trendId ? { ...trend, isFollowing: false } : trend
                )
            })),

            saveTrend: (trend) => set((state) => {
                const exists = state.savedTrends.find(t => t.id === trend.id);
                if (!exists) {
                    return {
                        savedTrends: [...state.savedTrends, { ...trend, savedAt: new Date().toISOString() }]
                    };
                }
                return state;
            }),

            removeSavedTrend: (trendId) => set((state) => ({
                savedTrends: state.savedTrends.filter(trend => trend.id !== trendId)
            })),

            // Alerts
            addAlert: (alert) => set((state) => ({
                alerts: [{ ...alert, id: Date.now() }, ...state.alerts]
            })),

            markAlertAsRead: (alertId) => set((state) => ({
                alerts: state.alerts.map(alert =>
                    alert.id === alertId ? { ...alert, isRead: true } : alert
                )
            })),

            removeAlert: (alertId) => set((state) => ({
                alerts: state.alerts.filter(alert => alert.id !== alertId)
            })),

            clearAllAlerts: () => set({ alerts: [] }),

            // Filters
            updateFilters: (newFilters) => set((state) => ({
                filters: { ...state.filters, ...newFilters }
            })),

            resetFilters: () => set({
                filters: {
                    platform: 'all',
                    country: 'all',
                    category: 'all',
                    timeRange: '24h',
                    confidence: 80
                }
            }),

            // Search
            addToSearchHistory: (query) => set((state) => {
                const exists = state.searchHistory.includes(query);
                if (!exists && query.trim()) {
                    return {
                        searchHistory: [query, ...state.searchHistory.slice(0, 9)]
                    };
                }
                return state;
            }),

            clearSearchHistory: () => set({ searchHistory: [] }),

            //Metrics
            updateMetrics: (newMetrics) => set((state) => ({
                metrics: { ...state.metrics, ...newMetrics }
            })),

            // Utilities
            getTrendById: (id) => {
                const state = get();
                return state.trends.find(trend => trend.id === id) ||
                    state.trendingNow.find(trend => trend.id === id);
            },

            getUnreadAlerts: () => {
                const state = get();
                return state.alerts.filter(alert => !alert.isRead);
            },

            getFilteredTrends: () => {
                const state = get();
                const { filters } = state;
                let filtered: Trend[] = [...state.trends, ...state.trendingNow];

                if (filters.platform !== 'all') {
                    filtered = filtered.filter(trend =>
                        trend.platform.toLowerCase() === filters.platform.toLowerCase()
                    );
                }

                if (filters.category !== 'all') {
                    filtered = filtered.filter(trend =>
                        trend.category?.toLowerCase() === filters.category.toLowerCase()
                    );
                }

                if (filters.confidence) {
                    filtered = filtered.filter(trend => trend.confidence >= filters.confidence);
                }

                return filtered;
            },

            checkAccess: (featureKey) => {
                const state = get();
                if (!state.user) return false;

                const userPlanId = state.user.planId || 'free';
                const plan = pricingPlans.find(p => p.id === userPlanId) || pricingPlans[0]!;

                if (featureKey === 'platforms') return plan.limits.platforms;

                // @ts-ignore - Dynamic property access
                if (typeof (plan.limits as any)[featureKey] === 'boolean') {
                    // @ts-ignore
                    return (plan.limits as any)[featureKey];
                }

                // @ts-ignore
                return (plan.limits as any)[featureKey];
            },

            isPlatformAllowed: (platformName) => {
                const state = get();
                if (!state.user) return false;

                const userPlanId = state.user.planId || 'free';
                const plan = pricingPlans.find(p => p.id === userPlanId) || pricingPlans[0]!;

                if (plan.limits.platforms.includes('ALL')) return true;

                return plan.limits.platforms.some((p: string) =>
                    p.toLowerCase() === platformName.toLowerCase()
                );
            }
        }),
        {
            name: 'predix-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                theme: state.theme,
                language: state.language,
                notifications: state.notifications,
                savedTrends: state.savedTrends,
                searchHistory: state.searchHistory,
                filters: state.filters
            })
        }
    )
);

export default useStore;
export type { Store, StoreState, StoreActions, User, Trend, Alert };
