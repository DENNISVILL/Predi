/**
 * MetricCard - Enhanced metric card with comparisons
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    comparison, // { value: "+2.3%", trend: "up", period: "vs ayer" }
    color = "cyan",
    gradient = "from-cyan-500 to-blue-600",
    onClick
}) => {
    const getTrendIcon = () => {
        if (!comparison) return null;
        if (comparison.trend === 'up') return TrendingUp;
        if (comparison.trend === 'down') return TrendingDown;
        return Minus;
    };

    const getTrendColor = () => {
        if (!comparison) return '';
        if (comparison.trend === 'up') return 'text-green-400 bg-green-500/10 border-green-500/20';
        if (comparison.trend === 'down') return 'text-red-400 bg-red-500/10 border-red-500/20';
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    };

    const TrendIcon = getTrendIcon();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl border border-gray-700/50 p-6 ${onClick ? 'cursor-pointer hover:border-gray-600' : ''
                } transition-all`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>
                {comparison && TrendIcon && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full border ${getTrendColor()}`}>
                        <TrendIcon className="w-3 h-3" />
                        <span className="text-xs font-semibold">{comparison.value}</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                <p className="text-gray-400 text-sm mb-2">{title}</p>
                {subtitle && (
                    <p className="text-gray-500 text-xs">{subtitle}</p>
                )}
                {comparison && comparison.period && (
                    <p className="text-gray-500 text-xs mt-2">
                        {comparison.period}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default MetricCard;
