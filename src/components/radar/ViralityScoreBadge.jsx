/**
 * ViralityScoreBadge - Visual indicator for virality prediction
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, AlertTriangle, Info } from 'lucide-react';
import { getPredictionRecommendation } from '../../utils/viralityPredictor';

const ViralityScoreBadge = ({ trend, showDetails = true }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const prediction = getPredictionRecommendation(trend);

    const getScoreColor = (score) => {
        if (score >= 85) return 'from-red-500 to-orange-500';
        if (score >= 70) return 'from-orange-500 to-yellow-500';
        if (score >= 55) return 'from-yellow-500 to-green-500';
        if (score >= 40) return 'from-green-500 to-cyan-500';
        return 'from-cyan-500 to-blue-500';
    };

    const getScoreRing = (score) => {
        if (score >= 85) return 'border-red-400';
        if (score >= 70) return 'border-orange-400';
        if (score >= 55) return 'border-yellow-400';
        if (score >= 40) return 'border-green-400';
        return 'border-cyan-400';
    };

    return (
        <div className="relative inline-block">
            {/* Score Circle */}
            <div
                className="relative cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div className={`relative w-16 h-16 rounded-full border-4 ${getScoreRing(prediction.score)} bg-gray-900 flex items-center justify-center`}>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getScoreColor(prediction.score)} opacity-20 animate-pulse`}></div>
                    <div className="relative z-10 text-center">
                        <div className="text-white font-bold text-lg">{prediction.score}</div>
                        <div className="text-gray-300 text-[10px] leading-none">SCORE</div>
                    </div>
                </div>
                <div className="absolute -top-1 -right-1 text-xl">
                    {prediction.icon}
                </div>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && showDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 border border-cyan-500/30 rounded-xl p-4 shadow-2xl z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                                <h4 className="text-white font-bold">Predicción IA</h4>
                            </div>
                            <div className={`px-2 py-1 bg-gradient-to-r ${getScoreColor(prediction.score)} rounded-full`}>
                                <span className="text-white text-xs font-bold">{prediction.level}</span>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="mb-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                            <p className="text-cyan-100 text-sm font-medium mb-1">
                                {prediction.recommendation}
                            </p>
                        </div>

                        {/* Action & Timing */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="p-2 bg-gray-800/50 rounded-lg">
                                <div className="flex items-center gap-1 mb-1">
                                    <Zap className="w-3 h-3 text-yellow-400" />
                                    <span className="text-gray-400 text-xs">Acción</span>
                                </div>
                                <p className="text-white text-xs font-medium">{prediction.action}</p>
                            </div>
                            <div className="p-2 bg-gray-800/50 rounded-lg">
                                <div className="flex items-center gap-1 mb-1">
                                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                                    <span className="text-gray-400 text-xs">Timing</span>
                                </div>
                                <p className="text-white text-xs font-medium">{prediction.timing}</p>
                            </div>
                        </div>

                        {/* Factors */}
                        {prediction.factors && prediction.factors.length > 0 && (
                            <div>
                                <div className="flex items-center gap-1 mb-2">
                                    <Info className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-400 text-xs font-semibold">Factores clave</span>
                                </div>
                                <div className="space-y-1">
                                    {prediction.factors.slice(0, 3).map((factor, index) => (
                                        <div key={index} className="flex items-start gap-2 text-xs">
                                            <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${factor.impact === 'high' ? 'bg-red-400' :
                                                    factor.impact === 'medium' ? 'bg-yellow-400' :
                                                        'bg-green-400'
                                                }`}></div>
                                            <div className="flex-1">
                                                <span className="text-white font-medium">{factor.name}:</span>
                                                <span className="text-gray-400 ml-1">{factor.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                            <div className="w-3 h-3 bg-gray-900 border-b border-r border-cyan-500/30 transform rotate-45"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Compact version for lists
export const ViralityScoreCompact = ({ trend }) => {
    const prediction = getPredictionRecommendation(trend);

    const getScoreColor = (score) => {
        if (score >= 85) return 'text-red-400';
        if (score >= 70) return 'text-orange-400';
        if (score >= 55) return 'text-yellow-400';
        if (score >= 40) return 'text-green-400';
        return 'text-cyan-400';
    };

    return (
        <div className="inline-flex items-center gap-1">
            <span className={`text-xs font-bold ${getScoreColor(prediction.score)}`}>
                {prediction.score}
            </span>
            <span className="text-xs">{prediction.icon}</span>
        </div>
    );
};

export default ViralityScoreBadge;
