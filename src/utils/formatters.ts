/**
 * Formatting Utilities for Predix
 */

import type { Platform } from '../types';

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Format date relative to now
 */
export function formatRelativeTime(date: string | Date): string {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) {
        return 'just now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
        return `${days}d ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return `${months}mo ago`;
    }

    const years = Math.floor(months / 12);
    return `${years}y ago`;
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, includeTime = false): string {
    const d = new Date(date);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return d.toLocaleDateString('en-US', options);
}

/**
 * Get platform icon/emoji
 */
export function getPlatformIcon(platform: Platform): string {
    const icons: Record<Platform, string> = {
        tiktok: '🎵',
        twitter: '🐦',
        instagram: '📸',
        youtube: '📺',
    };
    return icons[platform] || '📱';
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}
