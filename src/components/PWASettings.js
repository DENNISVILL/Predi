import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Download, 
  Bell, 
  Wifi, 
  WifiOff, 
  Settings, 
  Moon, 
  Sun,
  Globe,
  Volume2,
  VolumeX,
  Zap,
  Shield,
  Database,
  Trash2
} from 'lucide-react';
import useStore from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';

const PWASettings = () => {
  const { 
    theme, 
    language, 
    notifications, 
    setTheme, 
    setLanguage, 
    updateNotifications 
  } = useStore();
  
  const { 
    permission, 
    requestPermission, 
    updateNotificationSettings,
    showToast 
  } = useNotifications();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: 0, quota: 0 });

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Detectar prompt de instalación PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Obtener uso de almacenamiento
  useEffect(() => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(({ usage, quota }) => {
        setStorageUsage({ 
          used: usage || 0, 
          quota: quota || 0 
        });
      });
    }
  }, []);

  // Instalar PWA
  const handleInstall = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      showToast('¡Predix instalado correctamente!', 'success');
    }
    setInstallPrompt(null);
  };

  // Solicitar permisos de notificación
  const handleNotificationPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      showToast('Permisos de notificación concedidos', 'success');
    } else {
      showToast('Permisos de notificación denegados', 'error');
    }
  };

  // Limpiar caché
  const clearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        showToast('Caché limpiado correctamente', 'success');
      }
    } catch (error) {
      showToast('Error al limpiar caché', 'error');
    }
  };

  // Formatear bytes
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const settingSections = [
    {
      title: 'Instalación PWA',
      icon: Smartphone,
      items: [
        {
          label: 'Estado de instalación',
          description: isInstalled ? 'Predix está instalado como PWA' : 'Predix no está instalado',
          value: isInstalled ? 'Instalado' : 'No instalado',
          action: !isInstalled && installPrompt ? (
            <motion.button
              onClick={handleInstall}
              className="btn-primary text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Instalar
            </motion.button>
          ) : null
        },
        {
          label: 'Conexión',
          description: isOnline ? 'Conectado a internet' : 'Modo offline activo',
          value: (
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">Offline</span>
                </>
              )}
            </div>
          )
        }
      ]
    },
    {
      title: 'Notificaciones',
      icon: Bell,
      items: [
        {
          label: 'Permisos del navegador',
          description: 'Permitir notificaciones push del navegador',
          value: permission === 'granted' ? 'Concedido' : 'Denegado',
          action: permission !== 'granted' ? (
            <motion.button
              onClick={handleNotificationPermission}
              className="btn-secondary text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Solicitar
            </motion.button>
          ) : null
        },
        {
          label: 'Notificaciones push',
          description: 'Recibir alertas de nuevas tendencias',
          value: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.push}
                onChange={(e) => updateNotifications({ push: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          )
        },
        {
          label: 'Alertas de tendencias',
          description: 'Notificar cuando se detecten nuevas tendencias',
          value: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.trends}
                onChange={(e) => updateNotifications({ trends: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          )
        },
        {
          label: 'Alertas críticas',
          description: 'Notificar alertas importantes y microtendencias',
          value: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.alerts}
                onChange={(e) => updateNotifications({ alerts: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          )
        }
      ]
    },
    {
      title: 'Apariencia',
      icon: Settings,
      items: [
        {
          label: 'Tema',
          description: 'Cambiar entre modo claro y oscuro',
          value: (
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-lg ${theme === 'light' ? 'bg-[#007bff] text-white' : 'bg-gray-700 text-gray-300'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sun className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#007bff] text-white' : 'bg-gray-700 text-gray-300'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Moon className="w-4 h-4" />
              </motion.button>
            </div>
          )
        },
        {
          label: 'Idioma',
          description: 'Seleccionar idioma de la interfaz',
          value: (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-primary text-sm w-32"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          )
        }
      ]
    },
    {
      title: 'Almacenamiento',
      icon: Database,
      items: [
        {
          label: 'Uso de almacenamiento',
          description: `${formatBytes(storageUsage.used)} de ${formatBytes(storageUsage.quota)} utilizados`,
          value: (
            <div className="w-24 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] h-2 rounded-full"
                style={{ 
                  width: `${storageUsage.quota > 0 ? (storageUsage.used / storageUsage.quota) * 100 : 0}%` 
                }}
              ></div>
            </div>
          )
        },
        {
          label: 'Limpiar caché',
          description: 'Eliminar datos temporales y caché de la aplicación',
          action: (
            <motion.button
              onClick={clearCache}
              className="btn-secondary text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              Limpiar
            </motion.button>
          )
        }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Configuración PWA</h1>
        <p className="text-gray-400">
          Configurar la experiencia de aplicación web progresiva
        </p>
      </motion.div>

      <div className="space-y-8">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-lg">
                <section.icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  className="flex items-center justify-between p-4 bg-[#1f1f1f] rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{item.label}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {item.value && (
                      <div className="text-sm text-gray-300">
                        {item.value}
                      </div>
                    )}
                    {item.action}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* PWA Info */}
      <motion.div
        className="mt-8 p-6 bg-gradient-to-r from-[#007bff]/10 to-[#00ff9d]/10 rounded-2xl border border-[#007bff]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-[#00ff9d]" />
          <h3 className="text-lg font-bold text-white">Beneficios de la PWA</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#007bff]" />
            <span>Funciona offline</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00ff9d]" />
            <span>Carga instantánea</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#8b5cf6]" />
            <span>Notificaciones push</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#f59e0b]" />
            <span>Experiencia nativa</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PWASettings;
