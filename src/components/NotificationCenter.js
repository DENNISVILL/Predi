import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Settings,
  Filter,
  MoreVertical,
  Flame,
  Zap,
  Eye,
  Star,
  Clock
} from 'lucide-react';
import useRealTimeNotifications from '../hooks/useRealTimeNotifications';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { realtimeAlerts, markAlertAsRead, clearAlerts, alertStats } = useRealTimeNotifications();
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'viral_alert': return Flame;
      case 'microtrend': return Zap;
      case 'trend_update': return Eye;
      case 'ai_recommendation': return Star;
      default: return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'viral_alert': return 'text-red-400';
      case 'microtrend': return 'text-blue-400';
      case 'trend_update': return 'text-green-400';
      case 'ai_recommendation': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const filteredNotifications = filter === 'all' 
    ? realtimeAlerts 
    : realtimeAlerts.filter(alert => alert.type === filter);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'ahora';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel de notificaciones */}
          <motion.div
            className="fixed right-4 top-4 bottom-4 w-96 bg-[#0b0c10] border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col"
            initial={{ opacity: 0, x: 400, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#007bff]" />
                  <h2 className="text-lg font-bold text-white">Notificaciones</h2>
                  {alertStats.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {alertStats.unread}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                  </motion.button>
                  
                  <motion.button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'Todas', count: alertStats.total },
                  { id: 'viral_alert', label: 'Virales', count: alertStats.byType.viral_alert || 0 },
                  { id: 'microtrend', label: 'Micro', count: alertStats.byType.microtrend || 0 },
                  { id: 'ai_recommendation', label: 'IA', count: alertStats.byType.ai_recommendation || 0 }
                ].map((filterOption) => (
                  <motion.button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                      filter === filterOption.id
                        ? 'bg-[#007bff] text-white'
                        : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {filterOption.label}
                    {filterOption.count > 0 && (
                      <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                        {filterOption.count}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Lista de notificaciones */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Bell className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                <div className="p-2">
                  <AnimatePresence>
                    {filteredNotifications.map((notification, index) => {
                      const IconComponent = getNotificationIcon(notification.type);
                      return (
                        <motion.div
                          key={notification.id}
                          className={`p-3 mb-2 rounded-lg border transition-all cursor-pointer ${
                            notification.read 
                              ? 'bg-white/5 border-gray-700/50' 
                              : 'bg-white/10 border-gray-600'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => markAlertAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-white/10 ${getNotificationColor(notification.type)}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                                {notification.title}
                              </h4>
                              
                              {notification.trend && (
                                <div className="text-xs text-gray-400 mb-2">
                                  <span className="font-medium text-[#00ff9d]">
                                    {notification.trend.name}
                                  </span>
                                  {notification.trend.growth && (
                                    <span className="ml-2">
                                      {notification.trend.growth} • {notification.trend.platform}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {notification.recommendation && (
                                <div className="text-xs text-gray-400 mb-2">
                                  {notification.recommendation.action}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-[#007bff] rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer con acciones */}
            {filteredNotifications.length > 0 && (
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => {
                      filteredNotifications.forEach(n => markAlertAsRead(n.id));
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-gray-300 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check className="w-4 h-4" />
                    Marcar como leídas
                  </motion.button>
                  
                  <motion.button
                    onClick={clearAlerts}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm text-red-400 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
