/**
 * PredictionsView Component
 * Visualize and manage AI predictions with statistics and insights
 */
import React, { useState, useEffect } from 'react';
import { predictionsService, Prediction, PredictionStats, PredictionHistory } from '../services/predictionsService';

interface PredictionsViewProps {
    className?: string;
}

const PredictionsView: React.FC<PredictionsViewProps> = ({ className = '' }) => {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [stats, setStats] = useState<PredictionStats | null>(null);
    const [history, setHistory] = useState<PredictionHistory | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
    const [sortBy, setSortBy] = useState('created_at');
    const [days, setDays] = useState(30);

    useEffect(() => {
        loadData();
    }, [sortBy, days]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsData, historyData, predsData] = await Promise.all([
                predictionsService.getPredictionStats(),
                predictionsService.getPredictionHistory(days),
                predictionsService.getPredictions(1, 10, sortBy)
            ]);

            setStats(statsData);
            setHistory(historyData);
            setPredictions(predsData);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load predictions data');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            await predictionsService.downloadCSV();
        } catch (err: any) {
            setError('Failed to export CSV');
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'from-green-400 to-emerald-500';
        if (score >= 60) return 'from-blue-400 to-cyan-500';
        if (score >= 40) return 'from-yellow-400 to-orange-500';
        return 'from-red-400 to-pink-500';
    };

    const getConfidenceEmoji = (confidence: number) => {
        if (confidence >= 0.8) return '🎯';
        if (confidence >= 0.6) return '✅';
        if (confidence >= 0.4) return '⚠️';
        return '❌';
    };

    return (
        <div className={`predictions-view ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 mb-6 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">🤖 AI Predictions Dashboard</h1>
                        <p className="text-blue-100">Analyze viral score predictions and performance insights</p>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        📥 Export CSV
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-center">
                        <span className="text-red-500 mr-3 text-xl">⚠️</span>
                        <p className="text-red-700">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">✖</button>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">📊</span>
                            <span className="text-blue-100 text-sm font-semibold">ALL TIME</span>
                        </div>
                        <h3 className="text-4xl font-bold mb-1">{stats.total_predictions}</h3>
                        <p className="text-blue-100">Total Predictions</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">🔥</span>
                            <span className="text-purple-100 text-sm font-semibold">AVERAGE</span>
                        </div>
                        <h3 className="text-4xl font-bold mb-1">{stats.avg_viral_score.toFixed(1)}</h3>
                        <p className="text-purple-100">Avg Viral Score</p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">🎯</span>
                            <span className="text-pink-100 text-sm font-semibold">CONFIDENCE</span>
                        </div>
                        <h3 className="text-4xl font-bold mb-1">{(stats.avg_confidence * 100).toFixed(1)}%</h3>
                        <p className="text-pink-100">Avg Confidence</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">⏳</span>
                            <span className="text-green-100 text-sm font-semibold">THIS MONTH</span>
                        </div>
                        <h3 className="text-4xl font-bold mb-1">{stats.predictions_this_month}</h3>
                        <p className="text-green-100">
                            {stats.remaining_predictions === -1
                                ? 'Unlimited'
                                : `${stats.remaining_predictions} remaining`}
                        </p>
                    </div>
                </div>
            )}

            {/* Platform Distribution */}
            {history && Object.keys(history.platform_distribution).length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">📱 Platform Distribution</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Object.entries(history.platform_distribution).map(([platform, count]) => {
                            const platformIcons: Record<string, string> = {
                                tiktok: '🎵',
                                instagram: '📷',
                                youtube: '▶️',
                                facebook: '👍',
                                twitter: '🐦',
                                linkedin: '💼',
                            };
                            const total = Object.values(history.platform_distribution).reduce((a, b) => a + b, 0);
                            const percentage = ((count / total) * 100).toFixed(1);

                            return (
                                <div key={platform} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 hover:border-purple-400 transition-all">
                                    <div className="text-3xl mb-2 text-center">{platformIcons[platform.toLowerCase()] || '📱'}</div>
                                    <h3 className="text-2xl font-bold text-center text-gray-800">{count}</h3>
                                    <p className="text-sm text-gray-600 text-center capitalize">{platform}</p>
                                    <p className="text-xs text-purple-600 font-semibold text-center mt-1">{percentage}%</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 transition-all"
                        >
                            <option value="created_at">Recent First</option>
                            <option value="viral_score">Highest Score</option>
                            <option value="confidence">Highest Confidence</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Time Period</label>
                        <select
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 transition-all"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="365">Last Year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Predictions List */}
            {loading && predictions.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading predictions...</p>
                </div>
            ) : predictions.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No predictions yet</h3>
                    <p className="text-gray-500 mb-6">Create your first prediction to see AI insights</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {predictions.map(pred => (
                        <div key={pred.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-purple-200 overflow-hidden">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${getScoreColor(pred.viral_score)} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                                                {pred.viral_score}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">Viral Score Prediction</h3>
                                                <p className="text-sm text-gray-500">
                                                    {getConfidenceEmoji(pred.confidence)} Confidence: {(pred.confidence * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500">
                                            {new Date(pred.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Input Content Preview */}
                                {pred.input_data?.content && (
                                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700 mb-1">Content Analyzed:</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{pred.input_data.content}</p>
                                        {pred.input_data.platform && (
                                            <p className="text-xs text-purple-600 font-semibold mt-2">
                                                Platform: {pred.input_data.platform}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Growth Predictions */}
                                {pred.growth_predictions && Object.keys(pred.growth_predictions).length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-3">📈 Growth Predictions:</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {Object.entries(pred.growth_predictions).map(([period, value]) => (
                                                <div key={period} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3 border border-purple-200">
                                                    <p className="text-xs text-gray-600 mb-1">{period}</p>
                                                    <p className="text-lg font-bold text-purple-600">{value.toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Score Components */}
                                {pred.components && Object.keys(pred.components).length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-3">🎯 Score Components:</p>
                                        <div className="space-y-2">
                                            {Object.entries(pred.components).map(([component, score]) => (
                                                <div key={component} className="flex items-center">
                                                    <span className="text-xs text-gray-600 w-32 capitalize">{component.replace('_', ' ')}:</span>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                                        <div
                                                            className={`h-full bg-gradient-to-r ${getScoreColor(score as number)} transition-all`}
                                                            style={{ width: `${score}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 ml-3 w-10 text-right">{score}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Explanation */}
                                {pred.explanation && (
                                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                                        <p className="text-sm font-semibold text-purple-700 mb-2">💡 AI Explanation:</p>
                                        <p className="text-sm text-gray-700">{pred.explanation}</p>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {pred.recommendations && pred.recommendations.length > 0 && (
                                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                        <p className="text-sm font-semibold text-green-700 mb-3">✅ AI Recommendations:</p>
                                        <ul className="space-y-2">
                                            {pred.recommendations.map((rec, idx) => (
                                                <li key={idx} className="flex items-start text-sm text-gray-700">
                                                    <span className="text-green-500 mr-2 font-bold">{idx + 1}.</span>
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* View Details Button */}
                                <button
                                    onClick={() => setSelectedPrediction(pred)}
                                    className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    View Full Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedPrediction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedPrediction(null)}>
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Prediction Details</h2>
                            <button
                                onClick={() => setSelectedPrediction(null)}
                                className="text-4xl text-gray-400 hover:text-gray-600 leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-24 h-24 bg-gradient-to-br ${getScoreColor(selectedPrediction.viral_score)} rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-xl`}>
                                    {selectedPrediction.viral_score}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">Viral Score</h3>
                                    <p className="text-gray-600">
                                        Confidence: {(selectedPrediction.confidence * 100).toFixed(1)}% {getConfidenceEmoji(selectedPrediction.confidence)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Created: {new Date(selectedPrediction.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t-2 border-gray-200 pt-6">
                                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
                                    {JSON.stringify(selectedPrediction, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Load More */}
            {predictions.length >= 10 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => loadData()}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
                    >
                        Load More Predictions
                    </button>
                </div>
            )}
        </div>
    );
};

export default PredictionsView;
