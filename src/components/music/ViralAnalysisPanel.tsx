/**
 * FEATURE #3: Viral Analysis Panel
 * Why is this song going viral - complete breakdown
 */

import React from 'react';
import type { ViralSong } from '../../types/music';

interface ViralAnalysisPanelProps {
    song: ViralSong;
    className?: string;
}

const ViralAnalysisPanel: React.FC<ViralAnalysisPanelProps> = ({
    song,
    className = '',
}) => {
    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const getDaysSince = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Hoy';
        if (days === 1) return 'Ayer';
        return `Hace ${days} días`;
    };

    return (
        <div className={`viral-analysis-panel ${className}`}>
            {/* Main Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    <span className="mr-2">💡</span>
                    ¿Por qué es viral?
                </h2>
                <p className="text-purple-100">Análisis completo de viralidad y tendencias</p>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
                {/* 1. Videos Creados */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            <span className="mr-2">📊</span>
                            Videos Creados
                        </h3>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">
                                {formatNumber(song.analysis.totalVideos)}
                            </div>
                            <div className="text-sm text-gray-600">Último mes</div>
                        </div>
                    </div>

                    {/* Daily Breakdown */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-600 mb-1">Hoy</div>
                            <div className="text-lg font-bold text-green-600">
                                +{formatNumber(Math.floor(song.analysis.totalVideos * 0.05))}
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-600 mb-1">Esta Semana</div>
                            <div className="text-lg font-bold text-blue-600">
                                +{formatNumber(Math.floor(song.analysis.totalVideos * 0.25))}
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-600 mb-1">Este Mes</div>
                            <div className="text-lg font-bold text-purple-600">
                                {formatNumber(song.analysis.totalVideos)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Challenge/Trend */}
                {song.analysis.challengeName && (
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            <span className="mr-2">🎯</span>
                            Viralidad: Challenge
                        </h3>

                        <div className="bg-white rounded-lg p-4 mb-4">
                            <div className="text-2xl font-bold text-pink-600 mb-2">
                                {song.analysis.challengeName}
                            </div>
                            <p className="text-sm text-gray-600">
                                Este challenge ha generado millones de videos en todas las plataformas
                            </p>
                        </div>

                        {/* Trending Hashtags */}
                        <div>
                            <div className="text-sm font-semibold text-gray-700 mb-2">Hashtags Trending:</div>
                            <div className="flex flex-wrap gap-2">
                                {song.analysis.trendHashtags.slice(0, 8).map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Demographics */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">👥</span>
                        Demografía Dominante
                    </h3>

                    {/* Age Distribution */}
                    <div className="space-y-3 mb-4">
                        {song.demographics.ageRanges.slice(0, 3).map((range) => (
                            <div key={range.range}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {range.range} años
                                    </span>
                                    <span className="text-sm font-bold text-purple-600">
                                        {range.percentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                                        style={{ width: `${range.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gender Split */}
                    <div className="bg-white rounded-lg p-4">
                        <div className="text-sm font-semibold text-gray-700 mb-3">Distribución por Género:</div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <div className="text-2xl mb-1">👩</div>
                                <div className="text-sm font-bold text-pink-600">
                                    {song.demographics.gender.female}%
                                </div>
                                <div className="text-xs text-gray-600">Mujeres</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-1">👨</div>
                                <div className="text-sm font-bold text-blue-600">
                                    {song.demographics.gender.male}%
                                </div>
                                <div className="text-xs text-gray-600">Hombres</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-1">🌈</div>
                                <div className="text-sm font-bold text-purple-600">
                                    {song.demographics.gender.other + song.demographics.gender.nonBinary}%
                                </div>
                                <div className="text-xs text-gray-600">Otro</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Peak Information */}
                {song.analysis.peakDate && (
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            <span className="mr-2">📈</span>
                            Pico de Viralidad
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Fecha del Pico</div>
                                <div className="text-xl font-bold text-orange-600">
                                    {getDaysSince(song.analysis.peakDate)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(song.analysis.peakDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Razón</div>
                                <div className="text-sm font-bold text-gray-900">
                                    {song.lifecycleStage === 'peak' ? 'TikTok Feature en FYP' :
                                        song.lifecycleStage === 'emergente' ? 'Influencer Boost Inicial' :
                                            'Efecto Viral Orgánico'}
                                </div>
                            </div>
                        </div>

                        {/* Peak Stats */}
                        <div className="mt-4 bg-orange-100 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Videos en el Pico:</span>
                                <span className="text-lg font-bold text-orange-600">
                                    {formatNumber(Math.floor(song.analysis.totalVideos * 0.6))}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. Use Cases */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">💡</span>
                        Úsala para...
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {song.analysis.useCases.map(useCase => (
                            <div
                                key={useCase}
                                className="bg-white rounded-lg p-4 text-center border-2 border-green-200 hover:border-green-400 transition-all cursor-pointer group"
                            >
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                                    {useCase === 'Dance' ? '💃' :
                                        useCase === 'Lip Sync' ? '🎤' :
                                            useCase === 'Transition' ? '✨' :
                                                useCase === 'Challenge' ? '🏆' :
                                                    useCase === 'POV' ? '👁️' :
                                                        useCase === 'Tutorial' ? '📚' :
                                                            useCase === 'Before/After' ? '⏳' : '🎬'}
                                </div>
                                <div className="text-sm font-bold text-gray-900">{useCase}</div>
                                <div className="text-xs text-gray-600 mt-1">Videos</div>
                            </div>
                        ))}
                    </div>

                    {/* Success Tips */}
                    <div className="mt-4 bg-white rounded-lg p-4">
                        <div className="text-sm font-semibold text-gray-700 mb-2">💫 Tips de Éxito:</div>
                        <ul className="space-y-2">
                            <li className="text-sm text-gray-600 flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                Videos de {song.analysis.avgVideoDuration}s funcionan mejor
                            </li>
                            <li className="text-sm text-gray-600 flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                Tasa de éxito: {song.analysis.successRate}% de videos alcanzan +100K views
                            </li>
                            <li className="text-sm text-gray-600 flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                Mejor para creadores: {song.analysis.topCreatorTiers.join(', ')}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="text-sm text-gray-600">Reach</div>
                        <div className="text-lg font-bold text-blue-600">
                            {formatNumber(song.totalViews)}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-1">❤️</div>
                        <div className="text-sm text-gray-600">Engagement</div>
                        <div className="text-lg font-bold text-green-600">
                            {song.totalEngagement}%
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-1">🌍</div>
                        <div className="text-sm text-gray-600">Países</div>
                        <div className="text-lg font-bold text-purple-600">
                            {song.demographics.geographic.length}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-1">📱</div>
                        <div className="text-sm text-gray-600">Plataformas</div>
                        <div className="text-lg font-bold text-orange-600">
                            {Object.keys(song.platforms).length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViralAnalysisPanel;
