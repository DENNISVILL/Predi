import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simplified Mobile Store
const useStore = create(
    persist(
        (set, get) => ({
            // ========== Initial State ==========
            user: null,
            isAuthenticated: false,

            // Configuration
            theme: 'dark', // 'light' | 'dark'

            // Data
            trendingNow: [
                {
                    id: 1,
                    name: '#ViralDance2025',
                    platform: 'TikTok',
                    growth: '+245%',
                    description: 'Nueva danza viral que está explotando en TikTok México',
                    category: 'Entretenimiento',
                    icon: 'TrendingUp',
                    color: 'purple'
                },
                {
                    id: 2,
                    name: 'AI Photography',
                    platform: 'Instagram',
                    growth: '+180%',
                    description: 'Fotografía generada por IA ganando tracción',
                    category: 'Tecnología',
                    icon: 'Camera',
                    color: 'pink'
                },
                {
                    id: 3,
                    name: 'Crypto Gaming',
                    platform: 'Twitter',
                    growth: '+156%',
                    description: 'Juegos blockchain emergentes',
                    category: 'Gaming',
                    icon: 'Gamepad2',
                    color: 'blue'
                }
            ],

            notifications: {
                push: true,
                email: true
            },

            // ========== Actions ==========

            login: (userData) => set({
                user: userData,
                isAuthenticated: true
            }),

            logout: () => set({
                user: null,
                isAuthenticated: false
            }),

            setTheme: (theme) => set({ theme }),

            addTrend: (trend) => set((state) => ({
                trendingNow: [trend, ...state.trendingNow]
            })),

            updateUser: (updates) => set((state) => ({
                user: { ...state.user, ...updates }
            })),
        }),
        {
            name: 'predix-mobile-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useStore;
