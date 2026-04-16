/**
 * Platform Constants
 * Helper to convert Platform enum to array of values
 */

import { Platform } from '../types';

// Convert Platform enum to array of string values
export const PLATFORM_VALUES: Platform[] = [
    Platform.TIKTOK,
    Platform.TWITTER,
    Platform.INSTAGRAM,
    Platform.YOUTUBE,
];

// Platform display names
export const PLATFORM_NAMES: Record<Platform, string> = {
    [Platform.TIKTOK]: 'TikTok',
    [Platform.TWITTER]: 'Twitter',
    [Platform.INSTAGRAM]: 'Instagram',
    [Platform.YOUTUBE]: 'YouTube',
};

// Platform icons
export const PLATFORM_ICONS: Record<Platform, string> = {
    [Platform.TIKTOK]: '🎵',
    [Platform.TWITTER]: '🐦',
    [Platform.INSTAGRAM]: '📸',
    [Platform.YOUTUBE]: '📺',
};
