/**
 * ActivityFeed - Recent activity timeline
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Calendar, Bell, Zap, Check } from 'lucide-react';

const ActivityFeed = ({ activities = [] }) => {
    // Generate mock activities if none provided
    const defaultActivities = [
        {
            id: 1,
            type: 'trend',
            icon: TrendingUp,
            title: 'Nuevo trend detectado',
            description: '#México2024 está creciendo +450%',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10'
        },
        {
            id: 2,
            type: 'scheduled',
            icon: Calendar,
            title: 'Post programado',
            description: 'Contenido para mañana 10:00 AM',
            time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            color: 'text-green-400',
            bgColor: 'bg-green-500/10'
        },
        {
            id: 3,
            type: 'alert',
            icon: Bell,
            title: 'Alta a en engagement',
            description: 'Tu post alcanzó 10K interacciones',
            time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10'
        },
        {
            id: 4,
            type: 'recommendation',
            icon: Zap,
            title: 'Recomendación IA',
            description: 'Publicar ahora para máximo alcance',
            time: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10'
        },
        {
            id: 5,
            type: 'success',
            icon: Check,
            title: 'Meta alcanzada',
            description: 'Superaste tu objetivo de engagement',
            time: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10'
        }
    ];

    const displayActivities = activities.length > 0 ? activities : defaultActivities;

    const getRelativeTime = (date) => {
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
        if (hours > 0) return `hace ${hours}h`;
        const minutes = Math.floor(diff / (1000 * 60));
        return `hace ${minutes}m`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111318] border border-white/5 rounded-xl p-4 shadow-xl"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-white font-bold text-base">Actividad Reciente</h3>
                </div>
                <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                    Ver todo
                </button>
            </div>

            <div className="space-y-3">
                {displayActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-gray-700"
                        >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${activity.bgColor} flex items-center justify-center`}>
                                <Icon className={`w-4 h-4 ${activity.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-semibold text-sm mb-0.5">
                                    {activity.title}
                                </h4>
                                <p className="text-gray-400 text-xs mb-1 line-clamp-1">
                                    {activity.description}
                                </p>
                                <span className="text-gray-500 text-xs">
                                    {getRelativeTime(activity.time)}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* View more button */}
            <button className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Cargar más actividades
            </button>
        </motion.div>
    );
};

export default ActivityFeed;
