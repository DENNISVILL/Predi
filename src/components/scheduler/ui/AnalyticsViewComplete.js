/**
 * AnalyticsViewComplete - Dashboard completo de analytics
 * Componente lazy-loaded con métricas y visualizaciones
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    Heart,
    Share2,
    BarChart3,
    Calendar,
    Target,
    Zap
} from 'lucide-react';

const AnalyticsViewComplete = ({
    analytics = {},
    posts = [],
    theme = 'dark'
}) => {
    const {
        totalScheduled = 0,
        totalReach = 0,
        avgEngagementRate = 0,
        avgCtr = 0,
        followerGrowth = 0,
        successRate = 0,
        avgViralScore = 0,
        topPosts = []
    } = analytics;

    // Métricas principales
    const mainMetrics = [
        {
            title: 'Posts Programados',
            value: totalScheduled,
            change: '+12%',
            trend: 'up',
            icon: Calendar,
            color: 'blue'
        },
        {
            title: 'Alcance Total',
            value: formatNumber(totalReach),
            change: '+24%',
            trend: 'up',
            icon: Eye,
            color: 'green'
        },
        {
            title: 'Engagement Rate',
            value: `${avgEngagementRate.toFixed(1)}%`,
            change: '+5.2%',
            trend: 'up',
            icon: Heart,
            color: 'purple'
        },
        {
            title: 'Score Viral Promedio',
            value: `${avgViralScore.toFixed(0)}/100`,
            change: '+8%',
            trend: 'up',
            icon: Zap,
            color: 'orange'
        }
    ];

    // Distribución por plataforma
    const platformDistribution = posts.reduce((acc, post) => {
        const platform = post.platform || 'other';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
    }, {});

    const platforms = Object.entries(platformDistribution).map(([platform, count]) => ({
        platform,
        count,
        percentage: ((count / posts.length) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count);

    // Distribución por estado
    const statusDistribution = posts.reduce((acc, post) => {
        const status = post.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    📊 Analytics Dashboard
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Resumen de rendimiento y métricas clave
                </p>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainMetrics.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl border ${theme === 'dark'
                                ? 'bg-gray-800/50 border-gray-700'
                                : 'bg-white border-gray-200'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${getColorClasses(metric.color, theme).bg}`}>
                                <metric.icon className={`w-6 h-6 ${getColorClasses(metric.color, theme).text}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend === 'up'
                                    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                    : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                }`}>
                                {metric.trend === 'up' ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                {metric.change}
                            </div>
                        </div>

                        <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            {metric.title}
                        </div>

                        <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                            {metric.value}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-5 rounded-xl border ${theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Target className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Tasa de Éxito
                        </div>
                    </div>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        {successRate.toFixed(1)}%
                    </div>
                </div>

                <div className={`p-5 rounded-xl border ${theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Crecimiento Followers
                        </div>
                    </div>
                    <div className={`text-2xl font-bold ${followerGrowth >= 0
                            ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}>
                        {followerGrowth >= 0 ? '+' : ''}{formatNumber(followerGrowth)}
                    </div>
                </div>

                <div className={`p-5 rounded-xl border ${theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Share2 className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            CTR Promedio
                        </div>
                    </div>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        {avgCtr.toFixed(2)}%
                    </div>
                </div>
            </div>

            {/* Platform Distribution */}
            <div className={`p-6 rounded-xl border ${theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    Distribución por Plataforma
                </h3>

                <div className="space-y-3">
                    {platforms.map((platform) => (
                        <div key={platform.platform}>
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-sm font-medium capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    {getPlatformIcon(platform.platform)} {platform.platform}
                                </span>
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {platform.count} posts ({platform.percentage}%)
                                </span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                }`}>
                                <div
                                    className={`h-full rounded-full ${getPlatformColor(platform.platform)}`}
                                    style={{ width: `${platform.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Posts */}
            {topPosts && topPosts.length > 0 && (
                <div className={`p-6 rounded-xl border ${theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}>
                    <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        🏆 Top Posts
                    </h3>

                    <div className="space-y-3">
                        {topPosts.slice(0, 5).map((post, index) => (
                            <div
                                key={post.id}
                                className={`p-4 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-700/30 border-gray-600'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg font-bold">#{index + 1}</span>
                                            <span className={`text-sm px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {post.platform}
                                            </span>
                                        </div>
                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {post.title || 'Sin título'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Score
                                        </div>
                                        <div className={`text-xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                            }`}>
                                            {post.viralScore || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper functions
const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const getColorClasses = (color, theme) => {
    const colors = {
        blue: {
            bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
            text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        },
        green: {
            bg: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
            text: theme === 'dark' ? 'text-green-400' : 'text-green-600'
        },
        purple: {
            bg: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
            text: theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
        },
        orange: {
            bg: theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100',
            text: theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
        }
    };
    return colors[color] || colors.blue;
};

const getPlatformIcon = (platform) => {
    const icons = {
        tiktok: '🎵',
        instagram: '📸',
        youtube: '📹',
        facebook: '👥',
        linkedin: '💼',
        twitter: '🐦'
    };
    return icons[platform?.toLowerCase()] || '📱';
};

const getPlatformColor = (platform) => {
    const colors = {
        tiktok: 'bg-gradient-to-r from-pink-500 to-purple-500',
        instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
        youtube: 'bg-red-500',
        facebook: 'bg-blue-600',
        linkedin: 'bg-blue-700',
        twitter: 'bg-sky-500'
    };
    return colors[platform?.toLowerCase()] || 'bg-gray-500';
};

export default AnalyticsViewComplete;
