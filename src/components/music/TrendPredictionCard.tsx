/**
 * FEATURE #4: Trend Prediction with AI
 * Early detection, viral score, peak forecast, lifecycle stages
 */

import React from 'react';
import type { ViralSong, LifecycleStage } from '../../types/music';
import { LIFECYCLE_ICONS, LIFECYCLE_LABELS, LIFECYCLE_COLORS } from '../../types/music';

interface TrendPredictionCardProps {
    song: ViralSong;
    className?: string;
}

const TrendPredictionCard: React.FC<TrendPredictionCardProps> = ({
    song,
    className = '',
}) => {
    const getStageAction = (stage: LifecycleStage): { text: string; color: string; urgency: string } => {
        switch (stage) {
            case 'emergente':
                return { text: '¡USA YA!', color: 'green', urgency: 'ALTA PRIORIDAD' };
            case 'creciendo':
                return { text: 'Oportunidad', color: 'blue', urgency: 'BUENA OPORTUNIDAD' };
            case 'peak':
                return { text: 'Saturado', color: 'red', urgency: 'CONSIDERAR' };
            case 'declinando':
                return { text: 'EVITA', color: 'gray', urgency: 'NO RECOMENDADO' };
            case 'legacy':
                return { text: 'Clásico', color: 'purple', urgency: 'CONTENIDO EVERGREEN' };
        }
    };

    const action = getStageAction(song.lifecycleStage);
    const confidence = Math.round(song.confidence * 100);

    return (
        <div className={`trend-prediction-card ${className}`}>
            {/* Header with Viral Score */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">
                        <span className="mr-2">🔮</span>
                        Predicción IA
                    </h2>
                    <div className="text-right">
                        <div className="text-xs opacity-75 mb-1">VIRAL SCORE</div>
                        <div className="text-4xl font-bold">{song.viralScore}/100</div>
                    </div>
                </div>

                {/* Confidence Indicator */}
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Confianza del Modelo:</span>
                        <span className="text-sm font-bold">{confidence}%</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full"
                            style={{ width: `${confidence}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
                {/* Lifecycle Stage - Main Feature */}
                <div className={`rounded-xl p-6 border-4 bg-gradient-to-br ${LIFECYCLE_COLORS[song.lifecycleStage]}`}>
                    <div className="bg-white bg-opacity-90 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="text-xs text-gray-600 mb-1">ETAPA ACTUAL</div>
                                <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="text-3xl">{LIFECYCLE_ICONS[song.lifecycleStage]}</span>
                                    {LIFECYCLE_LABELS[song.lifecycleStage]}
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-full font-bold text-sm bg-${action.color}-600 text-white shadow-lg`}>
                                {action.text}
                            </div>
                        </div>

                        {/* Urgency Banner */}
                        <div className={`mt-3 p-3 rounded-lg bg-${action.color}-50 border-2 border-${action.color}-300`}>
                            <div className="flex items-center gap-2">
                                <span className="text-xl">
                                    {song.lifecycleStage === 'emergente' ? '⚡' :
                                        song.lifecycleStage === 'creciendo' ? '📈' :
                                            song.lifecycleStage === 'peak' ? '🔥' :
                                                song.lifecycleStage === 'declinando' ? '⚠️' : 'ℹ️'}
                                </span>
                                <div>
                                    <div className={`text-sm font-bold text-${action.color}-900`}>{action.urgency}</div>
                                    <div className="text-xs text-gray-700">
                                        {song.lifecycleStage === 'emergente' && 'Crecimiento explosivo detectado. Crear contenido ahora para maximizar alcance.'}
                                        {song.lifecycleStage === 'creciendo' && 'Sigue creciendo fuerte. Aún hay buena oportunidad de viralización.'}
                                        {song.lifecycleStage === 'peak' && 'En máxima saturación. Difícil destacar entre la competencia.'}
                                        {song.lifecycleStage === 'declinando' && 'Tendencia en decline. Busca alternativas más recientes.'}
                                        {song.lifecycleStage === 'legacy' && 'Canción clásica establecida. Audiencia predecible y estable.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Peak Forecast */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">📅</span>
                        Forecast del Pico
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Días hasta el pico</div>
                            <div className="text-3xl font-bold text-orange-600">
                                {song.peakForecast.daysUntilPeak > 0 ? song.peakForecast.daysUntilPeak : 'EN PEAK'}
                            </div>
                            {song.peakForecast.daysUntilPeak > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(song.peakForecast.estimatedPeakDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Videos Predichos</div>
                            <div className="text-2xl font-bold text-purple-600">
                                {song.peakForecast.predictedMaxVideos >= 1000000
                                    ? `${(song.peakForecast.predictedMaxVideos / 1000000).toFixed(1)}M`
                                    : `${(song.peakForecast.predictedMaxVideos / 1000).toFixed(0)}K`}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Total esperado</div>
                        </div>
                    </div>

                    {/* Trajectory Indicator */}
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">Trayectoria Actual:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${song.peakForecast.currentTrajectory === 'accelerating' ? 'bg-green-100 text-green-700' :
                                    song.peakForecast.currentTrajectory === 'steady' ? 'bg-blue-100 text-blue-700' :
                                        'bg-orange-100 text-orange-700'
                                }`}>
                                {song.peakForecast.currentTrajectory === 'accelerating' ? '🚀 Acelerando' :
                                    song.peakForecast.currentTrajectory === 'steady' ? '➡️ Estable' :
                                        '🐌 Desacelerando'}
                            </span>
                        </div>

                        {/* Visual Trajectory */}
                        <div className="flex items-center gap-2 mt-3">
                            {Array.from({ length: 10 }).map((_, i) => {
                                const height =
                                    song.peakForecast.currentTrajectory === 'accelerating' ? (i + 1) * 3 :
                                        song.peakForecast.currentTrajectory === 'steady' ? 15 :
                                            (10 - i) * 3;

                                return (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t ${song.peakForecast.currentTrajectory === 'accelerating' ? 'bg-green-500' :
                                                song.peakForecast.currentTrajectory === 'steady' ? 'bg-blue-500' :
                                                    'bg-orange-500'
                                            }`}
                                        style={{ height: `${height}px` }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Forecast Confidence */}
                    <div className="mt-4 bg-orange-100 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Precisión del Forecast:</span>
                            <span className="text-sm font-bold text-orange-700">
                                {Math.round(song.peakForecast.confidence * 100)}% confiable
                            </span>
                        </div>
                    </div>
                </div>

                {/* Early Detection Alert (only for emerging) */}
                {song.lifecycleStage === 'emergente' && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 shadow-lg animate-pulse">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">🚨</span>
                            <div>
                                <div className="font-bold text-xl">EARLY DETECTION ALERT!</div>
                                <div className="text-sm text-green-100">Canción emergente con alto potencial</div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <div className="text-2xl font-bold">
                                        +{Object.values(song.platforms)[0]?.growth24h || 0}%
                                    </div>
                                    <div className="text-xs">Growth 24h</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {(song.totalVideos / 1000).toFixed(1)}K
                                    </div>
                                    <div className="text-xs">Videos</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{song.viralScore}</div>
                                    <div className="text-xs">AI Score</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-all shadow-lg">
                                🎬 Crear Contenido AHORA
                            </button>
                        </div>
                    </div>
                )}

                {/* AI Score Breakdown */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">🤖</span>
                        Desglose del Viral Score IA
                    </h3>

                    <div className="space-y-3">
                        {[
                            { label: 'Tasa de Crecimiento', value: 35, max: 35 },
                            { label: 'Volumen de Videos', value: 25, max: 25 },
                            { label: 'Engagement Rate', value: 20, max: 20 },
                            { label: 'Diversidad Plataformas', value: 10, max: 10 },
                            { label: 'Tier de Creadores', value: 10, max: 10 },
                        ].map(({ label, value, max }) => {
                            const score = Math.round((song.viralScore / 100) * value);
                            const percentage = (score / max) * 100;

                            return (
                                <div key={label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                                        <span className="text-sm font-bold text-purple-600">{score}/{max}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recommendation */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                        <span className="mr-2">💡</span>
                        Recomendación IA
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        {song.lifecycleStage === 'emergente' && (
                            <>
                                <strong className="text-green-600">ALTA PRIORIDAD:</strong> Esta canción está en fase de explosión inicial.
                                Crear contenido en las próximas 24-48 horas puede resultar en alcance masivo debido al algoritmo favoreciendo
                                contenido early-adopter. Recomendamos {song.analysis.useCases[0]} como formato principal.
                            </>
                        )}
                        {song.lifecycleStage === 'creciendo' && (
                            <>
                                <strong className="text-blue-600">OPORTUNIDAD:</strong> Sigue en crecimiento activo con buena tracción.
                                Aún hay espacio para destacar si produces contenido de alta calidad. Considera usar {song.analysis.useCases[0]}
                                o {song.analysis.useCases[1]} para maximizar engagement.
                            </>
                        )}
                        {song.lifecycleStage === 'peak' && (
                            <>
                                <strong className="text-orange-600">SATURADO:</strong> En máxima popularidad pero alta competencia.
                                Solo recomendado si tienes un angle único o audiencia establecida. Considera esperar a la próxima tendencia
                                o usar esta canción para contenido evergreen.
                            </>
                        )}
                        {song.lifecycleStage === 'declinando' && (
                            <>
                                <strong className="text-red-600">NO RECOMENDADO:</strong> La tendencia está en decline.
                                Te sugerimos enfocarte en canciones emergentes o en crecimiento para mejor ROI.
                                Revisa la sección "Early Detection" para alternativas.
                            </>
                        )}
                        {song.lifecycleStage === 'legacy' && (
                            <>
                                <strong className="text-purple-600">EVERGREEN:</strong> Canción clásica con audiencia predecible.
                                Ideal para contenido educativo, tutoriales o posts programados. No esperes viralidad explosiva
                                pero sí engagement consistente.
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrendPredictionCard;
