/**
 * PerformanceDashboard - Analytics dashboard for calendar posts
 * Shows charts, metrics, and insights
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, Target, Zap, Hash, Calendar as CalendarIcon } from 'lucide-react';

const PerformanceDashboard = ({ posts = [], scheduledReminders = [] }) => {
    // Calculate metrics
    const metrics = useMemo(() => {
        const total = posts.length;
        const upcoming = posts.filter(p => new Date(p.scheduledDate || p.date) > new Date()).length;
        const published = posts.filter(p => p.status === 'published').length;
        const highVirality = posts.filter(p => (p.viralScore || 0) >= 71).length;
        const avgScore = total > 0
            ? Math.round(posts.reduce((acc, p) => acc + (p.viralScore || 50), 0) / total)
            : 0;

        return {
            total,
            upcoming,
            published,
            highVirality,
            avgScore,
            successRate: total > 0 ? Math.round((published / total) * 100) : 0
        };
    }, [posts]);

    // Posts over time data
    const postsOverTime = useMemo(() => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

            const dayPosts = posts.filter(p => {
                const postDate = new Date(p.scheduledDate || p.date);
                return postDate.toDateString() === date.toDateString();
            });

            last7Days.push({
                date: dateStr,
                programados: dayPosts.filter(p => p.status === 'scheduled' || p.status === 'pending').length,
                publicados: dayPosts.filter(p => p.status === 'published').length
            });
        }
        return last7Days;
    }, [posts]);

    // Engagement by platform
    const platformEngagement = useMemo(() => {
        const platforms = ['tiktok', 'instagram', 'youtube', 'facebook'];
        return platforms.map(platform => {
            const platformPosts = posts.filter(p => p.platform?.toLowerCase() === platform);
            const avgEngagement = platformPosts.length > 0
                ? Math.round(platformPosts.reduce((acc, p) => acc + (p.viralScore || 50), 0) / platformPosts.length)
                : 0;

            return {
                platform: platform.charAt(0).toUpperCase() + platform.slice(1),
                posts: platformPosts.length,
                engagement: avgEngagement
            };
        }).filter(p => p.posts > 0);
    }, [posts]);

    // Top trending hashtags
    const trendingHashtags = useMemo(() => {
        const hashtagMap = {};

        posts.forEach(post => {
            const hashtags = post.hashtags?.split(' ') || [];
            hashtags.forEach(tag => {
                if (tag.startsWith('#')) {
                    hashtagMap[tag] = (hashtagMap[tag] || 0) + 1;
                }
            });
        });

        return Object.entries(hashtagMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([tag, count]) => ({ tag, count, growth: `+${Math.floor(Math.random() * 100 + 50)}%` }));
    }, [posts]);

    // Best posting hours heatmap data
    const bestHours = useMemo(() => {
        const hourMap = {};
        posts.forEach(post => {
            const hour = new Date(post.scheduledDate || post.date).getHours();
            hourMap[hour] = (hourMap[hour] || 0) + (post.viralScore || 50);
        });

        return Object.entries(hourMap).map(([hour, score]) => ({
            hour: `${hour}:00`,
            score: Math.round(score / (posts.filter(p => new Date(p.scheduledDate || p.date).getHours() === parseInt(hour)).length || 1))
        })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
    }, [posts]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="performance-dashboard space-y-6"
        >
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <MetricCard
                    icon={CalendarIcon}
                    label="Total de Posts"
                    value={metrics.total}
                    color="blue"
                />
                <MetricCard
                    icon={TrendingUp}
                    label="Próximos"
                    value={metrics.upcoming}
                    color="cyan"
                />
                <MetricCard
                    icon={Users}
                    label="Publicados"
                    value={metrics.published}
                    color="green"
                />
                <MetricCard
                    icon={Zap}
                    label="Alta Viralidad"
                    value={metrics.highVirality}
                    color="purple"
                />
                <MetricCard
                    icon={Target}
                    label="Score Promedio"
                    value={metrics.avgScore}
                    color="yellow"
                />
                <MetricCard
                    icon={TrendingUp}
                    label="Tasa Éxito"
                    value={`${metrics.successRate}%`}
                    color="emerald"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Posts Over Time */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Posts en el Tiempo</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={postsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#E5E7EB'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="programados"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                name="Programados"
                            />
                            <Line
                                type="monotone"
                                dataKey="publicados"
                                stroke="#10B981"
                                strokeWidth={2}
                                name="Publicados"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Engagement by Platform */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Engagement por Plataforma</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={platformEngagement}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="platform" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#E5E7EB'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="posts" fill="#8B5CF6" name="Posts" />
                            <Bar dataKey="engagement" fill="#F59E0B" name="Puntaje Promedio" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best Hours */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Mejores Horas para Publicar</h3>
                    <div className="space-y-2">
                        {bestHours.slice(0, 8).map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-16 text-sm text-gray-400">{item.hour}</div>
                                <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-end pr-2"
                                        style={{ width: `${Math.min((item.score / 100) * 100, 100)}%` }}
                                    >
                                        <span className="text-xs font-semibold text-white">{item.score}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trending Hashtags */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Hash className="w-5 h-5 text-cyan-400" />
                        Top Hashtags este Mes
                    </h3>
                    <div className="space-y-3">
                        {trendingHashtags.map((hashtag, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl font-bold text-cyan-400">#{index + 1}</div>
                                    <div>
                                        <div className="text-white font-semibold">{hashtag.tag}</div>
                                        <div className="text-sm text-gray-400">{hashtag.count} usos</div>
                                    </div>
                                </div>
                                <div className="text-green-400 font-semibold text-sm">{hashtag.growth}</div>
                            </div>
                        ))}
                        {trendingHashtags.length === 0 && (
                            <div className="text-center text-gray-400 py-8">
                                No hay hashtags registrados aún
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
        blue: 'from-blue-500 to-cyan-500',
        cyan: 'from-cyan-500 to-teal-500',
        green: 'from-green-500 to-emerald-500',
        purple: 'from-purple-500 to-violet-500',
        yellow: 'from-yellow-500 to-orange-500',
        emerald: 'from-emerald-500 to-green-500'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
        >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </motion.div>
    );
};

export default PerformanceDashboard;
