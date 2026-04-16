/**
 * NotificationCenter - Real-time alerts and notification system
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Flame, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const NotificationCenter = ({ trends, alertSettings, onUpdateSettings }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);


    // Check for new alerts
    useEffect(() => {
        if (!trends || trends.length === 0 || !alertSettings?.enabled) return;

        const newNotifications = [];
        const now = Date.now();

        trends.forEach(trend => {
            // Viral Alert (Growth > threshold)
            if (trend.growth >= (alertSettings.growthThreshold || 400)) {
                newNotifications.push({
                    id: `viral-${trend.id}-${now}`,
                    type: 'viral',
                    title: '🔥 Trend Viral Detectado!',
                    message: `${trend.hashtag} está creciendo +${trend.growth}%`,
                    trend,
                    timestamp: now,
                    read: false,
                    priority: 'high'
                });
            }

            // Hot Alert (Growth > 200%)
            else if (trend.growth >= 200 && trend.growth < (alertSettings.growthThreshold || 400)) {
                newNotifications.push({
                    id: `hot-${trend.id}-${now}`,
                    type: 'hot',
                    title: '⚡ Trend Caliente',
                    message: `${trend.hashtag} en ${trend.platform}`,
                    trend,
                    timestamp: now,
                    read: false,
                    priority: 'medium'
                });
            }

            // High Engagement Alert
            if (trend.engagement >= (alertSettings.engagementThreshold || 85)) {
                newNotifications.push({
                    id: `engagement-${trend.id}-${now}`,
                    type: 'engagement',
                    title: '💎 Alto Engagement',
                    message: `${trend.hashtag} tiene ${trend.engagement}% engagement`,
                    trend,
                    timestamp: now,
                    read: false,
                    priority: 'medium'
                });
            }
        });

        if (newNotifications.length > 0) {
            setNotifications(prev => [...newNotifications, ...prev].slice(0, 50)); // Keep last 50
        }
    }, [trends, alertSettings]);



    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'viral': return <Flame className="w-5 h-5 text-red-400" />;
            case 'hot': return <Zap className="w-5 h-5 text-orange-400" />;
            case 'engagement': return <TrendingUp className="w-5 h-5 text-green-400" />;
            case 'emergente': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            default: return <CheckCircle className="w-5 h-5 text-blue-400" />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'viral': return 'border-red-500/30 bg-red-500/10';
            case 'hot': return 'border-orange-500/30 bg-orange-500/10';
            case 'engagement': return 'border-green-500/30 bg-green-500/10';
            default: return 'border-blue-500/30 bg-blue-500/10';
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-colors"
            >
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                        <span className="text-white text-xs font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </motion.div>
                )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-96 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-white font-bold">Notificaciones</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                                        {unreadCount} nuevas
                                    </span>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-cyan-400 hover:text-cyan-300"
                                >
                                    Limpiar todo
                                </button>
                            )}

                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No hay notificaciones</p>
                                </div>
                            ) : (
                                <div className="p-2 space-y-2">
                                    {notifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} ${notification.read ? 'opacity-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {getNotificationIcon(notification.type)}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white text-sm font-semibold mb-1">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-gray-300 text-xs mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(notification.timestamp).toLocaleTimeString('es-ES', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="text-xs text-cyan-400 hover:text-cyan-300"
                                                            >
                                                                Marcar leído
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setNotifications(prev => prev.filter(n => n.id !== notification.id));
                                                    }}
                                                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Settings Footer */}
                        <div className="p-3 border-t border-gray-700 bg-gray-800/50">
                            <button
                                onClick={() => {
                                    // Toggle alert settings (could open settings modal)
                                    if (onUpdateSettings) {
                                        onUpdateSettings({
                                            ...alertSettings,
                                            enabled: !alertSettings.enabled
                                        });
                                    }
                                }}
                                className="w-full py-2 text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                {alertSettings?.enabled ? 'Desactivar alertas' : 'Activar alertas'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default NotificationCenter;
