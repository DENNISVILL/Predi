// 📱 HOOK DE PWA COMPLETO
// Maneja instalación, notificaciones, offline, background sync

import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from './useNotifications.js';

export const usePWA = () => {
  const { showToast } = useNotifications();
  
  const [state, setState] = useState({
    // Instalación
    isInstallable: false,
    isInstalled: false,
    installPrompt: null,
    
    // Conexión
    isOnline: navigator.onLine,
    connectionType: 'unknown',
    
    // Notificaciones
    notificationPermission: 'default',
    pushSubscription: null,
    
    // Service Worker
    swRegistration: null,
    swUpdateAvailable: false,
    
    // Background Sync
    backgroundSyncSupported: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    
    // Capacidades del dispositivo
    deviceCapabilities: {
      standalone: window.matchMedia('(display-mode: standalone)').matches,
      touchScreen: 'ontouchstart' in window,
      vibration: 'vibrate' in navigator,
      geolocation: 'geolocation' in navigator,
      camera: 'mediaDevices' in navigator,
      battery: 'getBattery' in navigator
    }
  });

  // 🚀 INSTALACIÓN DE PWA
  const installPWA = useCallback(async () => {
    if (!state.installPrompt) {
      showToast('La instalación no está disponible', 'warning');
      return false;
    }

    try {
      const result = await state.installPrompt.prompt();
      
      if (result.outcome === 'accepted') {
        setState(prev => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
          installPrompt: null
        }));
        
        showToast('🎉 Predix instalado correctamente', 'success');
        return true;
      } else {
        showToast('Instalación cancelada', 'info');
        return false;
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
      showToast('Error al instalar la aplicación', 'error');
      return false;
    }
  }, [state.installPrompt, showToast]);

  // 🔔 NOTIFICACIONES PUSH
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      showToast('Las notificaciones no están soportadas', 'warning');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      setState(prev => ({
        ...prev,
        notificationPermission: permission
      }));

      if (permission === 'granted') {
        showToast('✅ Notificaciones activadas', 'success');
        await subscribeToPush();
        return true;
      } else {
        showToast('Notificaciones denegadas', 'warning');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      showToast('Error al solicitar permisos', 'error');
      return false;
    }
  }, [showToast]);

  const subscribeToPush = useCallback(async () => {
    if (!state.swRegistration) {
      console.warn('Service Worker not registered');
      return null;
    }

    try {
      const subscription = await state.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || '')
      });

      setState(prev => ({
        ...prev,
        pushSubscription: subscription
      }));

      // Enviar suscripción al servidor
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      showToast('📱 Suscrito a notificaciones push', 'success');
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      showToast('Error al suscribirse a notificaciones', 'error');
      return null;
    }
  }, [state.swRegistration, showToast]);

  // 🔄 BACKGROUND SYNC
  const registerBackgroundSync = useCallback(async (tag) => {
    if (!state.backgroundSyncSupported || !state.swRegistration) {
      console.warn('Background sync not supported');
      return false;
    }

    try {
      await state.swRegistration.sync.register(tag);
      showToast(`🔄 Background sync registrado: ${tag}`, 'info');
      return true;
    } catch (error) {
      console.error('Error registering background sync:', error);
      return false;
    }
  }, [state.backgroundSyncSupported, state.swRegistration, showToast]);

  // 📱 DETECCIÓN DE CAPACIDADES
  const detectDeviceCapabilities = useCallback(async () => {
    const capabilities = { ...state.deviceCapabilities };

    // Batería
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        capabilities.battery = {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (error) {
        console.warn('Battery API not available');
      }
    }

    // Memoria del dispositivo
    if ('deviceMemory' in navigator) {
      capabilities.deviceMemory = navigator.deviceMemory;
    }

    // Conexión de red
    if ('connection' in navigator) {
      const connection = navigator.connection;
      capabilities.connection = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }

    setState(prev => ({
      ...prev,
      deviceCapabilities: capabilities
    }));

    return capabilities;
  }, [state.deviceCapabilities]);

  // 🌐 MANEJO DE CONEXIÓN
  const handleOnline = useCallback(() => {
    setState(prev => ({ ...prev, isOnline: true }));
    showToast('🌐 Conexión restaurada', 'success');
    
    // Sincronizar datos pendientes
    if (state.swRegistration) {
      registerBackgroundSync('background-sync-online');
    }
  }, [showToast, state.swRegistration, registerBackgroundSync]);

  const handleOffline = useCallback(() => {
    setState(prev => ({ ...prev, isOnline: false }));
    showToast('📴 Sin conexión - Modo offline activado', 'warning');
  }, [showToast]);

  // 🔄 ACTUALIZACIÓN DE SW
  const updateServiceWorker = useCallback(async () => {
    if (!state.swRegistration) return;

    try {
      await state.swRegistration.update();
      
      if (state.swRegistration.waiting) {
        state.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating service worker:', error);
      showToast('Error al actualizar la aplicación', 'error');
    }
  }, [state.swRegistration, showToast]);

  // 📊 CACHE MANAGEMENT
  const getCacheInfo = useCallback(async () => {
    if (!('caches' in window)) return null;

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheInfo[cacheName] = {
          size: keys.length,
          keys: keys.map(key => key.url)
        };
      }

      return cacheInfo;
    } catch (error) {
      console.error('Error getting cache info:', error);
      return null;
    }
  }, []);

  const clearCache = useCallback(async (cacheName) => {
    if (!('caches' in window)) return false;

    try {
      if (cacheName) {
        await caches.delete(cacheName);
        showToast(`🗑️ Cache ${cacheName} eliminado`, 'info');
      } else {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        showToast('🗑️ Todos los caches eliminados', 'info');
      }
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      showToast('Error al limpiar cache', 'error');
      return false;
    }
  }, [showToast]);

  // 📱 SHARE API
  const shareContent = useCallback(async (data) => {
    if (!navigator.share) {
      // Fallback para navegadores sin Share API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(data.url || data.text || '');
        showToast('📋 Enlace copiado al portapapeles', 'success');
        return true;
      }
      return false;
    }

    try {
      await navigator.share(data);
      showToast('📤 Contenido compartido', 'success');
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        showToast('Error al compartir', 'error');
      }
      return false;
    }
  }, [showToast]);

  // 🎯 EFECTOS
  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-advanced.js')
        .then(registration => {
          setState(prev => ({ ...prev, swRegistration: registration }));
          
          // Detectar actualizaciones
          registration.addEventListener('updatefound', () => {
            setState(prev => ({ ...prev, swUpdateAvailable: true }));
            showToast('🔄 Actualización disponible', 'info');
          });
        })
        .catch(error => {
          console.error('SW registration failed:', error);
        });
    }

    // Detectar instalabilidad
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: e
      }));
    };

    // Detectar instalación
    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null
      }));
      showToast('🎉 Aplicación instalada correctamente', 'success');
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detectar capacidades iniciales
    detectDeviceCapabilities();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline, detectDeviceCapabilities, showToast]);

  // Detectar modo standalone
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setState(prev => ({
      ...prev,
      deviceCapabilities: {
        ...prev.deviceCapabilities,
        standalone: isStandalone
      }
    }));
  }, []);

  return {
    // Estado
    ...state,
    
    // Instalación
    installPWA,
    
    // Notificaciones
    requestNotificationPermission,
    subscribeToPush,
    
    // Background Sync
    registerBackgroundSync,
    
    // Service Worker
    updateServiceWorker,
    
    // Cache
    getCacheInfo,
    clearCache,
    
    // Compartir
    shareContent,
    
    // Capacidades
    detectDeviceCapabilities
  };
};

// Utility function
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
