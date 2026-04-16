/**
 * FEATURE #1: Multi-Platform Selector
 * Advanced platform filtering with individual platform metrics
 */

import React from 'react';
import type { Platform, ViralSong } from '../../types/music';
import { PLATFORM_NAMES, PLATFORM_ICONS } from '../../types/music';

interface PlatformSelectorProps {
    selectedPlatforms: Platform[];
    onChange: (platforms: Platform[]) => void;
    songs: ViralSong[];
    className?: string;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
    selectedPlatforms,
    onChange,
    songs,
    className = '',
}) => {
    const platforms: Platform[] = [
        'tiktok',
        'instagram',
        'facebook',
        'youtube',
        'spotify',
        'apple_music',
        'soundcloud',
        'twitter',
    ];

    const togglePlatform = (platform: Platform) => {
        const newSelection = selectedPlatforms.includes(platform)
            ? selectedPlatforms.filter(p => p !== platform)
            : [...selectedPlatforms, platform];
        onChange(newSelection);
    };

    const getPlatformStats = (platform: Platform) => {
        const songsOnPlatform = songs.filter(song => song.platforms[platform]);
        const totalVideos = songsOnPlatform.reduce(
            (sum, song) => sum + (song.platforms[platform]?.videosCreated || 0),
            0
        );
        const avgGrowth = songsOnPlatform.length > 0
            ? songsOnPlatform.reduce(
                (sum, song) => sum + (song.platforms[platform]?.growth24h || 0),
                0
            ) / songsOnPlatform.length
            : 0;

        return {
            songCount: songsOnPlatform.length,
            totalVideos,
            avgGrowth: Math.round(avgGrowth),
        };
    };

    return (
        <div className={`platform-selector ${className}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        <span className="mr-2">🌐</span>
                        Plataformas
                    </h2>
                    {selectedPlatforms.length > 0 && (
                        <button
                            onClick={() => onChange([])}
                            className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                        >
                            Limpiar ({selectedPlatforms.length})
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {platforms.map(platform => {
                        const stats = getPlatformStats(platform);
                        const isSelected = selectedPlatforms.includes(platform);

                        return (
                            <button
                                key={platform}
                                onClick={() => togglePlatform(platform)}
                                className={`relative p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md'
                                        : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
                                    }`}
                            >
                                {/* Platform Icon & Name */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl">{PLATFORM_ICONS[platform]}</span>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">
                                                {PLATFORM_NAMES[platform]}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {stats.songCount} canciones
                                            </p>
                                        </div>
                                    </div>

                                    {/* Checkbox */}
                                    <div
                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${isSelected
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        {isSelected && <span className="text-white text-sm">✓</span>}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Videos:</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {stats.totalVideos >= 1000
                                                ? `${(stats.totalVideos / 1000).toFixed(1)}K`
                                                : stats.totalVideos}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Growth 24h:</span>
                                        <span className={`text-sm font-bold ${stats.avgGrowth > 50 ? 'text-green-600' : 'text-gray-900'}`}>
                                            +{stats.avgGrowth}%
                                        </span>
                                    </div>
                                </div>

                                {/* Trending Badge */}
                                {stats.avgGrowth > 100 && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                                        🔥 HOT
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Platform Comparison Chart */}
                {selectedPlatforms.length > 1 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-purple-200">
                        <h3 className="text-sm font-bold text-gray-800 mb-3">
                            📊 Comparación de Plataformas Seleccionadas
                        </h3>
                        <div className="space-y-2">
                            {selectedPlatforms.map(platform => {
                                const stats = getPlatformStats(platform);
                                const maxVideos = Math.max(
                                    ...selectedPlatforms.map(p => getPlatformStats(p).totalVideos)
                                );
                                const percentage = (stats.totalVideos / maxVideos) * 100;

                                return (
                                    <div key={platform} className="flex items-center gap-3">
                                        <span className="text-xl">{PLATFORM_ICONS[platform]}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {PLATFORM_NAMES[platform]}
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    {stats.totalVideos >= 1000
                                                        ? `${(stats.totalVideos / 1000).toFixed(1)}K`
                                                        : stats.totalVideos}{' '}
                                                    videos
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlatformSelector;
