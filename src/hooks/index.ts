/**
 * Custom Hooks - TypeScript
 * Type-safe React hooks for common operations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
    Trend,
    TrendFilters,
    User,
    TrendPrediction,
    Alert,
    ErrorResponse,
} from '../types';
import apiService from '../services/apiConfig';

// ============================================
// useAuth Hook
// ============================================

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const userData = await apiService.get<User>('/users/me');
            setUser(userData);
            setError(null);
        } catch (err) {
            setError((err as ErrorResponse).message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            const response = await apiService.post<{
                access_token: string;
                refresh_token: string;
                user: User;
            }>('/users/login', { email, password });

            apiService.setAuthToken(response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            setUser(response.user);
            setError(null);
        } catch (err) {
            setError((err as ErrorResponse).message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await apiService.post('/users/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            apiService.setAuthToken(null);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        if (apiService.isAuthenticated()) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [fetchUser]);

    return {
        user,
        loading,
        error,
        login,
        logout,
        refreshUser: fetchUser,
        isAuthenticated: !!user,
    };
};

// ============================================
// useTrends Hook
// ============================================

interface UseTrendsReturn {
    trends: Trend[];
    loading: boolean;
    error: string | null;
    filters: TrendFilters;
    setFilters: React.Dispatch<React.SetStateAction<TrendFilters>>;
    refreshTrends: () => Promise<void>;
    loadMore: () => Promise<void>;
    hasMore: boolean;
}

export const useTrends = (initialFilters: TrendFilters = {}): UseTrendsReturn => {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<TrendFilters>(initialFilters);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchTrends = useCallback(async (reset = false): Promise<void> => {
        try {
            setLoading(true);
            const currentPage = reset ? 1 : page;

            const params = new URLSearchParams();
            if (filters.platform) params.append('platform', filters.platform);
            if (filters.search) params.append('search', filters.search);
            if (filters.minViralScore) params.append('min_viral_score', filters.minViralScore.toString());
            if (filters.sortBy) params.append('sort_by', filters.sortBy);
            if (filters.sortOrder) params.append('sort_order', filters.sortOrder);
            params.append('page', currentPage.toString());
            params.append('per_page', '20');

            const response = await apiService.get<{
                items: Trend[];
                total: number;
                page: number;
                pages: number;
            }>(`/trends?${params.toString()}`);

            if (reset) {
                setTrends(response.items);
                setPage(1);
            } else {
                setTrends((prev) => [...prev, ...response.items]);
            }

            setHasMore(response.page < response.pages);
            setError(null);
        } catch (err) {
            setError((err as ErrorResponse).message);
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    const loadMore = useCallback(async (): Promise<void> => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    }, [loading, hasMore]);

    const refreshTrends = useCallback(async (): Promise<void> => {
        await fetchTrends(true);
    }, [fetchTrends]);

    useEffect(() => {
        fetchTrends(true);
    }, [filters]);

    return {
        trends,
        loading,
        error,
        filters,
        setFilters,
        refreshTrends,
        loadMore,
        hasMore,
    };
};

// ============================================
// usePredictions Hook
// ============================================

interface UsePredictionsReturn {
    predictions: TrendPrediction[];
    loading: boolean;
    error: string | null;
    createPrediction: (data: any) => Promise<TrendPrediction>;
    refreshPredictions: () => Promise<void>;
}

export const usePredictions = (): UsePredictionsReturn => {
    const [predictions, setPredictions] = useState<TrendPrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPredictions = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await apiService.get<TrendPrediction[]>('/predictions');
            setPredictions(data);
            setError(null);
        } catch (err) {
            setError((err as ErrorResponse).message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPrediction = useCallback(async (data: any): Promise<TrendPrediction> => {
        try {
            setLoading(true);
            const prediction = await apiService.post<TrendPrediction>('/ai/predict', data);
            setPredictions((prev) => [prediction, ...prev]);
            setError(null);
            return prediction;
        } catch (err) {
            setError((err as ErrorResponse).message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPredictions();
    }, [fetchPredictions]);

    return {
        predictions,
        loading,
        error,
        createPrediction,
        refreshPredictions: fetchPredictions,
    };
};

// ============================================
// useAlerts Hook
// ============================================

interface UseAlertsReturn {
    alerts: Alert[];
    loading: boolean;
    error: string | null;
    unreadCount: number;
    markAsRead: (alertId: number) => Promise<void>;
    deleteAlert: (alertId: number) => Promise<void>;
    refreshAlerts: () => Promise<void>;
}

export const useAlerts = (): UseAlertsReturn => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAlerts = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await apiService.get<Alert[]>('/alerts');
            setAlerts(data);
            setError(null);
        } catch (err) {
            setError((err as ErrorResponse).message);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (alertId: number): Promise<void> => {
        try {
            await apiService.post(`/alerts/${alertId}/read`);
            setAlerts((prev) =>
                prev.map((alert) =>
                    alert.id === alertId ? { ...alert, is_read: true } : alert
                )
            );
        } catch (err) {
            setError((err as ErrorResponse).message);
        }
    }, []);

    const deleteAlert = useCallback(async (alertId: number): Promise<void> => {
        try {
            await apiService.delete(`/alerts/${alertId}`);
            setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
        } catch (err) {
            setError((err as ErrorResponse).message);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    const unreadCount = alerts.filter((alert) => !alert.is_read).length;

    return {
        alerts,
        loading,
        error,
        unreadCount,
        markAsRead,
        deleteAlert,
        refreshAlerts: fetchAlerts,
    };
};

// ============================================
// useDebounce Hook
// ============================================

export const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// ============================================
// useLocalStorage Hook
// ============================================

export const useLocalStorage = <T,>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

// ============================================
// useIntersectionObserver Hook (for infinite scroll)
// ============================================

export const useIntersectionObserver = (
    callback: () => void,
    options?: IntersectionObserverInit
): React.RefObject<HTMLDivElement> => {
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting) {
                callback();
            }
        }, options);

        const currentTarget = targetRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [callback, options]);

    return targetRef;
};

// ============================================
// useWebSocket Hook
// ============================================

interface UseWebSocketReturn {
    connected: boolean;
    lastMessage: any;
    send: (data: any) => void;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
    const [connected, setConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => setConnected(true);
        ws.current.onclose = () => setConnected(false);
        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLastMessage(data);
            } catch (err) {
                console.error('WebSocket message parse error:', err);
            }
        };

        return () => {
            ws.current?.close();
        };
    }, [url]);

    const send = useCallback((data: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }
    }, []);

    return { connected, lastMessage, send };
};
