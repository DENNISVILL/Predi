/**
 * FEATURE #7: Historical Analytics & Comparisons
 * Complete historical data visualization with song comparisons
 */

import React, { useState, useEffect } from 'react';
import type { ViralSong, TimeSeriesData } from '../../types/music';
import { generateMockTimeSeriesData } from '../../utils/mockMusicData';

interface HistoricalChartsProps {
    song: ViralSong;
    onCompareSongs?: (songIds: string[]) => void;
    className?: string;
}

const HistoricalCharts: React.FC<HistoricalChartsProps> = ({
    song,
    onCompareSongs: _onCompareSongs,
    className = '',
}) => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '60d' | '90d' | 'all'>('30d');
    const [metric, setMetric] = useState<'videos' | 'growth_rate' | 'viral_score'>('videos');
    const [historicalData, setHistoricalData] = useState<TimeSeriesData | null>(null);
    const [showComparison, setShowComparison] = useState(false);
    const [selectedForComparison, _setSelectedForComparison] = useState<string[]>([]);

    useEffect(() => {
        // Load historical data
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '60d' ? 60 : timeRange === '90d' ? 90 : 365;
        const data = generateMockTimeSeriesData(song.id, days);
        setHistoricalData(data);
    }, [song.id, timeRange]);

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const handleExport = (format: 'png' | 'csv' | 'pdf') => {
        alert(`Exporting chart as ${format.toUpperCase()}...`);
    };

    if (!historicalData) {
        return <div className="text-center py-8">Loading historical data...</div>;
    }

    const maxValue = Math.max(...historicalData.dataPoints.map(dp =>
        metric === 'videos' ? dp.videosCreated :
            metric === 'growth_rate' ? dp.growthRate : dp.viralScore
    ));

    return (
        <div className={`historical-charts ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    <span className="mr-2">📊</span>
                    Análisis Histórico
                </h2>
                <p className="text-blue-100">Evolución temporal y comparativas de viralidad</p>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    {/* Time Range Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Tiempo</label>
                        <div className="flex gap-2">
                            {(['7d', '30d', '60d', '90d', 'all'] as const).map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${timeRange === range
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {range === 'all' ? 'Todo' : range}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Metric Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Métrica</label>
                        <select
                            value={metric}
                            onChange={(e) => setMetric(e.target.value as any)}
                            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 font-semibold"
                        >
                            <option value="videos">Videos Creados</option>
                            <option value="growth_rate">Tasa de Crecimiento</option>
                            <option value="viral_score">Viral Score</option>
                        </select>
                    </div>

                    {/* Export Buttons */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Exportar</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport('png')}
                                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-all"
                            >
                                📸 PNG
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-all"
                            >
                                📄 CSV
                            </button>
                            <button
                                onClick={() => handleExport('pdf')}
                                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all"
                            >
                                📑 PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Growth Chart */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        📈 Gráfica de Evolución - {song.title}
                    </h3>

                    {/* Chart */}
                    <div className="bg-white rounded-lg p-6 mb-4" style={{ height: '350px' }}>
                        <div className="flex items-end justify-between h-full gap-1">
                            {historicalData.dataPoints.map((dataPoint, index) => {
                                const value =
                                    metric === 'videos' ? dataPoint.videosCreated :
                                        metric === 'growth_rate' ? dataPoint.growthRate :
                                            dataPoint.viralScore;

                                const height = (value / maxValue) * 100;
                                const date = new Date(dataPoint.timestamp);
                                const showLabel = index % Math.ceil(historicalData.dataPoints.length / 8) === 0;

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center group relative">
                                        {/* Bar */}
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t hover:from-blue-600 hover:to-cyan-500 transition-all cursor-pointer"
                                            style={{ height: `${height}%` }}
                                        >
                                            {/* Tooltip on hover */}
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                                    <div className="font-bold">{date.toLocaleDateString()}</div>
                                                    <div>{metric === 'videos' ? formatNumber(value) :
                                                        metric === 'growth_rate' ? `${value}%` : value}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date Label */}
                                        {showLabel && (
                                            <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-top-left">
                                                {date.toLocaleDateString('es', { month: 'short', day: 'numeric' })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Y-axis label */}
                        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                            <span>
                                {metric === 'videos' ? 'Videos' :
                                    metric === 'growth_rate' ? 'Growth %' : 'Viral Score'}
                            </span>
                            <span className="font-bold text-blue-600">
                                Max: {metric === 'videos' ? formatNumber(maxValue) :
                                    metric === 'growth_rate' ? `${maxValue}%` : maxValue}
                            </span>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 text-center border-2 border-blue-200">
                            <div className="text-sm text-gray-600 mb-1">Promedio</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatNumber(Math.round(historicalData.dataPoints.reduce((sum, dp) =>
                                    sum + (metric === 'videos' ? dp.videosCreated : metric === 'growth_rate' ? dp.growthRate : dp.viralScore), 0
                                ) / historicalData.dataPoints.length))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 text-center border-2 border-green-200">
                            <div className="text-sm text-gray-600 mb-1">Máximo</div>
                            <div className="text-2xl font-bold text-green-600">
                                {formatNumber(maxValue)}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 text-center border-2 border-purple-200">
                            <div className="text-sm text-gray-600 mb-1">Mínimo</div>
                            <div className="text-2xl font-bold text-purple-600">
                                {formatNumber(Math.min(...historicalData.dataPoints.map(dp =>
                                    metric === 'videos' ? dp.videosCreated : metric === 'growth_rate' ? dp.growthRate : dp.viralScore
                                )))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 text-center border-2 border-orange-200">
                            <div className="text-sm text-gray-600 mb-1">Tendencia</div>
                            <div className="text-2xl font-bold text-orange-600">
                                {(historicalData.dataPoints[historicalData.dataPoints.length - 1]?.growthRate || 0) > 0 ? '📈' : '📉'}
                                {Math.abs(historicalData.dataPoints[historicalData.dataPoints.length - 1]?.growthRate || 0)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Tool */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            <span className="mr-2">🔀</span>
                            Comparar Canciones
                        </h3>
                        <button
                            onClick={() => setShowComparison(!showComparison)}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                        >
                            {showComparison ? 'Ocultar ▲' : 'Mostrar ▼'}
                        </button>
                    </div>

                    {showComparison && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-700 mb-3">
                                    Selecciona hasta 2 canciones adicionales para comparar con <strong>{song.title}</strong>
                                </p>

                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar canción..."
                                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500"
                                    />
                                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                                        Buscar
                                    </button>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <div className="text-gray-600 mb-2">Canciones seleccionadas para comparar:</div>
                                    <div className="text-sm text-gray-500">
                                        {selectedForComparison.length === 0 ? 'Ninguna seleccionada' : `${selectedForComparison.length} canción(es)`}
                                    </div>

                                    {selectedForComparison.length > 0 && (
                                        <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
                                            Ver Comparación
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pattern Matching */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">🔍</span>
                        Patrones Similares
                    </h3>

                    <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3 mb-4">
                            <span className="text-2xl">💡</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Patrón de Viralidad Similar</h4>
                                <p className="text-sm text-gray-600">
                                    Esta canción tiene un patrón de crecimiento muy similar a <strong>"Flowers"</strong> de Miley Cyrus
                                    que alcanzó 5.2M videos en su peak (Marzo 2023)
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
                                <div className="text-xs text-green-600 mb-1">Similitud de Patrón</div>
                                <div className="text-2xl font-bold text-green-700">87%</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                                <div className="text-xs text-blue-600 mb-1">Precisión Estimada</div>
                                <div className="text-2xl font-bold text-blue-700">92%</div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Songs */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 text-sm">Canciones con Patrones Similares:</h4>

                        {[
                            { title: 'Flowers', artist: 'Miley Cyrus', similarity: 87, peakVideos: '5.2M' },
                            { title: 'Anti-Hero', artist: 'Taylor Swift', similarity: 82, peakVideos: '4.8M' },
                            { title: 'Calm Down', artist: 'Rema', similarity: 78, peakVideos: '3.9M' },
                        ].map((similar, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-pink-200 hover:border-pink-400 transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-900">{similar.title}</div>
                                        <div className="text-xs text-gray-600">{similar.artist}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-pink-600">{similar.similarity}% similar</div>
                                        <div className="text-xs text-gray-600">Peak: {similar.peakVideos}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-all">
                        Ver Análisis Detallado de Patrones
                    </button>
                </div>

                {/* Platform Breakdown Over Time */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">📱</span>
                        Crecimiento por Plataforma
                    </h3>

                    <div className="space-y-4">
                        {Object.entries(song.platforms).map(([platform, metrics]) => {
                            const platformData = historicalData.dataPoints.map(dp =>
                                dp.platforms[platform as keyof typeof dp.platforms]?.videos || 0
                            );
                            const maxPlatformValue = Math.max(...platformData);

                            return (
                                <div key={platform} className="bg-white rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">
                                                {platform === 'tiktok' ? '🎵' :
                                                    platform === 'instagram' ? '📷' :
                                                        platform === 'facebook' ? '👍' :
                                                            platform === 'youtube' ? '▶️' : '🎧'}
                                            </span>
                                            <span className="font-semibold text-gray-900 capitalize">{platform}</span>
                                        </div>
                                        <span className="text-sm font-bold text-orange-600">
                                            {formatNumber(metrics.videosCreated)} videos
                                        </span>
                                    </div>

                                    {/* Mini chart */}
                                    <div className="flex items-end justify-between h-16 gap-px">
                                        {platformData.map((value, index) => {
                                            const height = (value / maxPlatformValue) * 100;
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex-1 bg-gradient-to-t from-orange-400 to-yellow-400 rounded-t"
                                                    style={{ height: `${height}%` }}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                                        <span>Growth: +{metrics.growth24h}%</span>
                                        <span>Status: {metrics.status}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoricalCharts;
