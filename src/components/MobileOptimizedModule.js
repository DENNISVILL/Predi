// 📱 MÓDULO OPTIMIZADO PARA MÓVIL
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, Wifi, WifiOff, Download, Share2, Bell, Settings,
  Battery, Signal, Zap, RefreshCw, Home, TrendingUp, User,
  Menu, X, ChevronDown, ChevronUp, Eye, Heart, MessageCircle
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA.js';
import { useNotifications } from '../hooks/useNotifications.js';

const MobileOptimizedModule = () => {
  const { showToast } = useNotifications();
  const {
    isInstallable,
    isInstalled,
    isOnline,
    notificationPermission,
    deviceCapabilities,
    swUpdateAvailable,
    installPWA,
    requestNotificationPermission,
    updateServiceWorker,
    shareContent,
    getCacheInfo,
    clearCache
  } = usePWA();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [batteryInfo, setBatteryInfo] = useState(null);

  // 📱 NAVEGACIÓN MÓVIL
  const mobileNavItems = [
    { id: 'dashboard', name: 'Inicio', icon: Home, color: 'purple' },
    { id: 'trends', name: 'Tendencias', icon: TrendingUp, color: 'blue' },
    { id: 'profile', name: 'Perfil', icon: User, color: 'green' },
    { id: 'settings', name: 'Config', icon: Settings, color: 'gray' }
  ];

  // 🔋 INFORMACIÓN DE BATERÍA
  useEffect(() => {
    if (deviceCapabilities.battery && typeof deviceCapabilities.battery === 'object') {
      setBatteryInfo(deviceCapabilities.battery);
    }
  }, [deviceCapabilities.battery]);

  // 📊 CARGAR INFO DE CACHE
  useEffect(() => {
    const loadCacheInfo = async () => {
      const info = await getCacheInfo();
      setCacheInfo(info);
    };
    loadCacheInfo();
  }, [getCacheInfo]);

  const handleInstallApp = async () => {
    const success = await installPWA();
    if (success) {
      setShowMobileMenu(false);
    }
  };

  const handleShare = async () => {
    await shareContent({
      title: 'Predix - Predicción de Tendencias',
      text: 'Descubre las próximas tendencias virales con IA',
      url: window.location.href
    });
  };

  const handleUpdateApp = async () => {
    await updateServiceWorker();
    showToast('🔄 Aplicación actualizada', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header Móvil */}
      <div className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-purple-400" />
            <h1 className="text-lg font-bold text-white">Predix Mobile</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Estado de conexión */}
            <div className="flex items-center gap-1">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
            </div>
            
            {/* Batería */}
            {batteryInfo && (
              <div className="flex items-center gap-1">
                <Battery className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">
                  {Math.round(batteryInfo.level * 100)}%
                </span>
              </div>
            )}
            
            {/* Menú */}
            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg bg-gray-700/50 text-white"
              whileTap={{ scale: 0.95 }}
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              className="absolute top-16 right-4 left-4 bg-gray-800 rounded-xl border border-gray-700/50 p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Estado de la App */}
              <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                <h3 className="text-white font-bold mb-2">Estado de la App</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Conexión:</span>
                    <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Instalada:</span>
                    <span className={isInstalled ? 'text-green-400' : 'text-yellow-400'}>
                      {isInstalled ? 'Sí' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Notificaciones:</span>
                    <span className={notificationPermission === 'granted' ? 'text-green-400' : 'text-red-400'}>
                      {notificationPermission === 'granted' ? 'Activadas' : 'Desactivadas'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="space-y-2">
                {!isInstalled && isInstallable && (
                  <motion.button
                    onClick={handleInstallApp}
                    className="w-full flex items-center gap-3 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    Instalar App
                  </motion.button>
                )}

                {notificationPermission !== 'granted' && (
                  <motion.button
                    onClick={requestNotificationPermission}
                    className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Bell className="w-4 h-4" />
                    Activar Notificaciones
                  </motion.button>
                )}

                <motion.button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 className="w-4 h-4" />
                  Compartir App
                </motion.button>

                {swUpdateAvailable && (
                  <motion.button
                    onClick={handleUpdateApp}
                    className="w-full flex items-center gap-3 p-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Actualizar App
                  </motion.button>
                )}
              </div>

              {/* Info del Cache */}
              {cacheInfo && (
                <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                  <h4 className="text-white font-bold mb-2">Cache Info</h4>
                  <div className="space-y-1 text-xs">
                    {Object.entries(cacheInfo).map(([cacheName, info]) => (
                      <div key={cacheName} className="flex justify-between">
                        <span className="text-gray-400 truncate">{cacheName}:</span>
                        <span className="text-white">{info.size} items</span>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    onClick={() => clearCache()}
                    className="mt-2 w-full text-xs bg-red-600/20 text-red-400 p-2 rounded"
                    whileTap={{ scale: 0.95 }}
                  >
                    Limpiar Cache
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido Principal */}
      <div className="p-4 pb-20">
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Cards de Métricas Móviles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-400">Tendencias</span>
                </div>
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-xs text-gray-400">Activas hoy</div>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">Virales</span>
                </div>
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-xs text-gray-400">Esta semana</div>
              </div>
            </div>

            {/* Lista de Tendencias Móvil */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
              <div className="p-4 border-b border-gray-700/50">
                <h3 className="text-white font-bold">Tendencias Recientes</h3>
              </div>
              
              <div className="divide-y divide-gray-700/50">
                {[1, 2, 3, 4, 5].map((item) => (
                  <motion.div
                    key={item}
                    className="p-4 hover:bg-gray-700/30 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">#TrendingTopic{item}</h4>
                        <p className="text-gray-400 text-xs mt-1">Crecimiento +{item * 50}%</p>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item * 100}K
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {item * 20}K
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white">Explorar Tendencias</h2>
            
            {/* Filtros Móviles */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Todas', 'Virales', 'Emergentes', 'Tech', 'Lifestyle'].map((filter) => (
                <motion.button
                  key={filter}
                  className="flex-shrink-0 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  {filter}
                </motion.button>
              ))}
            </div>

            {/* Grid de Tendencias */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <motion.div
                  key={item}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-bold">#TechTrend{item}</h3>
                      <p className="text-gray-400 text-sm">Tecnología • Hace 2h</p>
                    </div>
                    <div className="text-green-400 font-bold text-sm">+{item * 30}%</div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">
                    Esta tendencia está creciendo rápidamente en todas las plataformas...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item * 150}K
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {item * 25}K
                      </div>
                    </div>
                    
                    <motion.button
                      className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs"
                      whileTap={{ scale: 0.95 }}
                    >
                      Seguir
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Navegación Inferior Móvil */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                activeTab === item.id ? 'text-purple-400' : 'text-gray-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedModule;
