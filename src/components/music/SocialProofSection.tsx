/**
 * FEATURE #9: Social Proof & Success Cases
 * Top videos showcase and success analysis
 */

import React from 'react';
import type { ViralSong } from '../../types/music';

interface SocialProofSectionProps {
    song: ViralSong;
    className?: string;
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({
    song,
    className = '',
}) => {

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const videoTypeBreakdown = [
        { type: 'Dance', percentage: 45, color: 'from-pink-500 to-rose-500' },
        { type: 'Lip Sync', percentage: 30, color: 'from-purple-500 to-indigo-500' },
        { type: 'Transition', percentage: 15, color: 'from-blue-500 to-cyan-500' },
        { type: 'Other', percentage: 10, color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <div className={`social-proof-section ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    <span className="mr-2">⭐</span>
                    Social Proof & Casos de Éxito
                </h2>
                <p className="text-purple-100">Aprende de los videos más exitosos</p>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
                {/* Top 10 Videos Carousel */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">🏆</span>
                        Top 10 Videos con Esta Canción
                    </h3>

                    <div className="relative">
                        {/* Carousel Container */}
                        <div className="overflow-x-auto pb-4">
                            <div className="flex gap-4 min-w-max">
                                {song.topVideos.map((video, index) => (
                                    <div
                                        key={video.id}
                                        className="w-80 flex-shrink-0 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all group"
                                    >
                                        {/* Video Rank Badge */}
                                        <div className="relative bg-gradient-to-br from-purple-400 to-pink-500 h-48 flex items-center justify-center">
                                            <div className="absolute top-3 left-3 bg-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-purple-600 shadow-lg">
                                                #{index + 1}
                                            </div>

                                            <div className="text-center text-white">
                                                <div className="text-6xl mb-2">▶️</div>
                                                <div className="text-sm font-semibold opacity-90">Click para ver</div>
                                            </div>

                                            {/* Platform Badge */}
                                            <div className="absolute top-3 right-3 px-3 py-1 bg-black bg-opacity-60 text-white rounded-full text-xs font-bold">
                                                {video.platform === 'tiktok' ? '🎵 TikTok' :
                                                    video.platform === 'instagram' ? '📷 Instagram' :
                                                        video.platform === 'youtube' ? '▶️ YouTube' : '📱 ' + video.platform}
                                            </div>
                                        </div>

                                        {/* Video Info */}
                                        <div className="p-4">
                                            {/* Creator */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                                    {video.creatorHandle.charAt(1).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900">{video.creatorHandle}</div>
                                                    <div className="text-xs text-gray-600">{formatNumber(video.creatorFollowers || 100000)} seguidores</div>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div className="bg-red-50 rounded-lg p-2 text-center">
                                                    <div className="text-xs text-red-600">Views</div>
                                                    <div className="text-lg font-bold text-red-700">{formatNumber(video.views)}</div>
                                                </div>
                                                <div className="bg-pink-50 rounded-lg p-2 text-center">
                                                    <div className="text-xs text-pink-600">Likes</div>
                                                    <div className="text-lg font-bold text-pink-700">{formatNumber(video.likes)}</div>
                                                </div>
                                            </div>

                                            {/* Video Type & Engagement */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Tipo:</span>
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-semibold text-xs">
                                                        {video.videoType}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Engagement:</span>
                                                    <span className="font-bold text-green-600">{video.engagementRate}%</span>
                                                </div>
                                            </div>

                                            {/* View Button */}
                                            <button
                                                onClick={() => window.open(video.url, '_blank')}
                                                className="w-full mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
                                            >
                                                Ver Video →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Hint */}
                        <div className="text-center text-sm text-gray-600 mt-2">
                            ← Desliza para ver más videos →
                        </div>
                    </div>
                </div>

                {/* Success Tips */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">💡</span>
                        Tips de Éxito (Basados en Top Videos)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {song.successTips.map((tip, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border-2 border-green-200">
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{tip.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900 mb-1">{tip.text}</div>
                                        <div className="text-xs text-gray-600 mb-2">
                                            Basado en: {tip.basedOn}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${tip.confidence * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-green-600">
                                                {Math.round(tip.confidence * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Video Type Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Donut Chart */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            <span className="mr-2">📊</span>
                            Tipos de Video
                        </h3>

                        <div className="flex items-center justify-center mb-4">
                            <div className="relative w-48 h-48">
                                {/* Simple Donut Chart Representation */}
                                <svg className="w-full h-full transform -rotate-90">
                                    {videoTypeBreakdown.reduce((acc, segment, index) => {
                                        const prevPercentages = videoTypeBreakdown
                                            .slice(0, index)
                                            .reduce((sum, s) => sum + s.percentage, 0);
                                        const circumference = 2 * Math.PI * 70;
                                        const offset = (prevPercentages / 100) * circumference;
                                        const dashArray = `${(segment.percentage / 100) * circumference} ${circumference}`;

                                        acc.push(
                                            <circle
                                                key={index}
                                                cx="96"
                                                cy="96"
                                                r="70"
                                                fill="none"
                                                stroke={index === 0 ? '#ec4899' : index === 1 ? '#8b5cf6' : index === 2 ? '#3b82f6' : '#10b981'}
                                                strokeWidth="26"
                                                strokeDasharray={dashArray}
                                                strokeDashoffset={-offset}
                                            />
                                        );
                                        return acc;
                                    }, [] as JSX.Element[])}
                                </svg>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-gray-900">{song.topVideos.length}</div>
                                        <div className="text-xs text-gray-600">Videos</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-2">
                            {videoTypeBreakdown.map((segment, _index) => (
                                <div
                                    key={segment.type}
                                    className="flex items-center justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded bg-gradient-to-r ${segment.color}`} />
                                        <span className="font-semibold text-gray-900">{segment.type}</span>
                                    </div>
                                    <span className="font-bold text-purple-600">{segment.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Engagement Comparison */}
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            <span className="mr-2">📈</span>
                            Comparación de Engagement
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-700">Tu Promedio</span>
                                    <span className="text-2xl font-bold text-gray-600">8.5%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-gradient-to-r from-gray-400 to-gray-500 h-4 rounded-full"
                                        style={{ width: '68%' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-700">Top Performers</span>
                                    <span className="text-2xl font-bold text-orange-600">12.3%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-4 rounded-full"
                                        style={{ width: '98%' }}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <div className="flex items-start gap-2 mb-3">
                                    <span className="text-xl">💪</span>
                                    <div>
                                        <div className="font-semibold text-gray-900 mb-1">Gap de Mejora</div>
                                        <div className="text-2xl font-bold text-orange-600">+3.8%</div>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-700">
                                    <strong>Recomendación:</strong> Los top performers usan más{' '}
                                    <strong className="text-purple-600">Dance</strong> y{' '}
                                    <strong className="text-purple-600">Transition</strong> videos.
                                    Prueba estos formatos para mejorar tu engagement.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Creator Spotlight */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">🌟</span>
                        Top Creadores Usando Esta Canción
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {song.topVideos.slice(0, 3).map((video, index) => (
                            <div key={video.id} className="bg-white rounded-xl p-5 border-2 border-pink-200 hover:border-pink-400 transition-all">
                                <div className="text-center mb-4">
                                    {index === 0 && <div className="text-4xl mb-2">🥇</div>}
                                    {index === 1 && <div className="text-4xl mb-2">🥈</div>}
                                    {index === 2 && <div className="text-4xl mb-2">🥉</div>}

                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                                        {video.creatorHandle.charAt(1).toUpperCase()}
                                    </div>

                                    <div className="font-bold text-gray-900">{video.creatorHandle}</div>
                                    <div className="text-xs text-gray-600">{formatNumber(video.creatorFollowers || 100000)} seguidores</div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Videos:</span>
                                        <span className="font-bold">1</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Views:</span>
                                        <span className="font-bold text-pink-600">{formatNumber(video.views)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Avg Engagement:</span>
                                        <span className="font-bold text-green-600">{video.engagementRate}%</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.open(video.url, '_blank')}
                                    className="w-full mt-4 bg-pink-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition-all"
                                >
                                    Ver Perfil
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary CTA */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">🎯 Listo para Crear Contenido?</h3>
                        <p className="text-purple-100 mb-4">
                            Usa estos insights para crear videos que capten la atención como los top performers
                        </p>
                        <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition-all shadow-lg">
                            Comenzar a Crear →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialProofSection;
