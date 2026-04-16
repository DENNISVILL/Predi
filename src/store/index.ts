/**
 * Zustand Store - TypeScript
 * Global state management for Predix application
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, Trend, TrendPrediction, Alert } from '../types';

interface AppState {
    // User state
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;

    // Trends state
    trends: Trend[];
    setTrends: (trends: Trend[]) => void;
    addTrend: (trend: Trend) => void;
    updateTrend: (uuid: string, updates: Partial<Trend>) => void;

    // Predictions state
    predictions: TrendPrediction[];
    setPredictions: (predictions: TrendPrediction[]) => void;
    addPrediction: (prediction: TrendPrediction) => void;

    // Alerts state
    alerts: Alert[];
    unreadCount: number;
    setAlerts: (alerts: Alert[]) => void;
    markAlertAsRead: (alertId: number) => void;
    removeAlert: (alertId: number) => void;

    // UI state
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    toggleSidebar: () => void;
    setTheme: (theme: 'light' | 'dark') => void;

    // Loading states
    loading: {
        trends: boolean;
        predictions: boolean;
        alerts: boolean;
    };
    setLoading: (key: keyof AppState['loading'], value: boolean) => void;
}

export const useStore = create<AppState>()(
    devtools(
        persist(
            (set, _get) => ({
                // Initial state
                user: null,
                isAuthenticated: false,
                trends: [],
                predictions: [],
                alerts: [],
                unreadCount: 0,
                sidebarOpen: true,
                theme: 'light',
                loading: {
                    trends: false,
                    predictions: false,
                    alerts: false,
                },

                // User actions
                setUser: (user) =>
                    set({ user, isAuthenticated: !!user }, false, 'setUser'),

                clearUser: () =>
                    set({ user: null, isAuthenticated: false }, false, 'clearUser'),

                // Trends actions
                setTrends: (trends) => set({ trends }, false, 'setTrends'),

                addTrend: (trend) =>
                    set((state) => ({ trends: [trend, ...state.trends] }), false, 'addTrend'),

                updateTrend: (uuid, updates) =>
                    set(
                        (state) => ({
                            trends: state.trends.map((t) =>
                                t.uuid === uuid ? { ...t, ...updates } : t
                            ),
                        }),
                        false,
                        'updateTrend'
                    ),

                // Predictions actions
                setPredictions: (predictions) => set({ predictions }, false, 'setPredictions'),

                addPrediction: (prediction) =>
                    set(
                        (state) => ({ predictions: [prediction, ...state.predictions] }),
                        false,
                        'addPrediction'
                    ),

                // Alerts actions
                setAlerts: (alerts) =>
                    set(
                        {
                            alerts,
                            unreadCount: alerts.filter((a) => !a.is_read).length,
                        },
                        false,
                        'setAlerts'
                    ),

                markAlertAsRead: (alertId) =>
                    set(
                        (state) => {
                            const alerts = state.alerts.map((a) =>
                                a.id === alertId ? { ...a, is_read: true } : a
                            );
                            return {
                                alerts,
                                unreadCount: alerts.filter((a) => !a.is_read).length,
                            };
                        },
                        false,
                        'markAlertAsRead'
                    ),

                removeAlert: (alertId) =>
                    set(
                        (state) => {
                            const alerts = state.alerts.filter((a) => a.id !== alertId);
                            return {
                                alerts,
                                unreadCount: alerts.filter((a) => !a.is_read).length,
                            };
                        },
                        false,
                        'removeAlert'
                    ),

                // UI actions
                toggleSidebar: () =>
                    set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),

                setTheme: (theme) => set({ theme }, false, 'setTheme'),

                // Loading actions
                setLoading: (key, value) =>
                    set(
                        (state) => ({
                            loading: { ...state.loading, [key]: value },
                        }),
                        false,
                        'setLoading'
                    ),
            }),
            {
                name: 'predix-storage',
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                    theme: state.theme,
                    sidebarOpen: state.sidebarOpen,
                }),
            }
        ),
        { name: 'PredixStore' }
    )
);

export default useStore;
