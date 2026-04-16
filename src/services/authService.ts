/**
 * Auth Service - TypeScript
 * Authentication and authorization utilities
 */

import apiService from './apiConfig';
import type { User, LoginCredentials, RegisterCredentials } from '../types';

class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';

    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const response = await apiService.post<{
            user: User;
            access_token: string;
            refresh_token: string;
        }>('/users/login', credentials);

        this.setToken(response.access_token);
        this.setRefreshToken(response.refresh_token);
        apiService.setAuthToken(response.access_token);

        return {
            user: response.user,
            token: response.access_token,
        };
    }

    /**
     * Register new user
     */
    async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
        const response = await apiService.post<{
            user: User;
            access_token: string;
            refresh_token: string;
        }>('/users/register', credentials);

        this.setToken(response.access_token);
        this.setRefreshToken(response.refresh_token);
        apiService.setAuthToken(response.access_token);

        return {
            user: response.user,
            token: response.access_token,
        };
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await apiService.post('/users/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearTokens();
            apiService.setAuthToken(null);
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<string> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiService.post<{ access_token: string }>('/users/refresh', {
            refresh_token: refreshToken,
        });

        this.setToken(response.access_token);
        apiService.setAuthToken(response.access_token);

        return response.access_token;
    }

    /**
     * Get current user
     */
    async getCurrentUser(): Promise<User> {
        return apiService.get<User>('/users/me');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Get stored refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Set token
     */
    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Set refresh token
     */
    private setRefreshToken(token: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    /**
     * Clear all tokens
     */
    clearTokens(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
}

export const authService = new AuthService();
export default authService;
