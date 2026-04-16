/**
 * API Configuration Service - TypeScript
 * Centralized API client with interceptors and error handling
 */

import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance 
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error: any) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: any) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Response] ${response.config.url}`, response.data);
        }
        return response;
    },
    async (error: any) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
                        refresh_token: refreshToken,
                    });

                    const { access_token } = response.data as { access_token: string };
                    localStorage.setItem('token', access_token);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    }
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API Service
const apiService = {
    // Set auth token
    setAuthToken: (token: string | null): void => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },

    // Check if authenticated
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    // Generic GET request
    get: async <T = any>(url: string, config?: any): Promise<T> => {
        const response = await apiClient.get(url, config);
        return response.data as T;
    },

    // Generic POST request
    post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
        const response = await apiClient.post(url, data, config);
        return response.data as T;
    },

    // Generic PUT request
    put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
        const response = await apiClient.put(url, data, config);
        return response.data as T;
    },

    // Generic PATCH request
    patch: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
        const response = await apiClient.patch(url, data, config);
        return response.data as T;
    },

    // Generic DELETE request
    delete: async <T = any>(url: string, config?: any): Promise<T> => {
        const response = await apiClient.delete(url, config);
        return response.data as T;
    },
};

export default apiService;
export { apiClient };
