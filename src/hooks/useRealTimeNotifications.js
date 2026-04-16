import { useEffect, useCallback, useState } from 'react';
import { useNotifications } from './useNotifications';
import useStore from '../store/useStore';
import predixWebSocket from '../services/websocket';

const useRealTimeNotifications = () => {
  const { user } = useStore();
  const { showToast, requestNotificationPermission } = useNotifications();
  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    reconnectAttempts: 0,
    lastHeartbeat: null
  });
  const [realtimeAlerts, setRealtimeAlerts] = useState([]);

  // Conectar al WebSocket cuando el usuario esté autenticado
  useEffect(() => {
    if (user?.id) {
      connectToWebSocket();
    }

    return () => {
      predixWebSocket.disconnect();
    };
  }, [user?.id]);

  // Función para conectar al WebSocket
  const connectToWebSocket = useCallback(async () => {
    try {
      await predixWebSocket.connect(user?.id);
      setConnectionState(prev => ({ ...prev, isConnected: true }));
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnectionState(prev => ({ ...prev, isConnected: false }));
    }
  }, [user?.id]);

  // Configurar listeners del WebSocket
  useEffect(() => {
    // Evento de conexión exitosa
    const handleConnected = (data) => {
      setConnectionState(prev => ({
        ...prev,
        isConnected: true,
        reconnectAttempts: 0
      }));
      showToast('🔌 Conectado a notificaciones en tiempo real', 'success');
    };

    // Evento de desconexión
    const handleDisconnected = (data) => {
      setConnectionState(prev => ({ ...prev, isConnected: false }));
      showToast('🔌 Desconectado de notificaciones', 'info');
    };

    // Heartbeat para mantener la conexión activa
    const handleHeartbeat = (data) => {
      setConnectionState(prev => ({ ...prev, lastHeartbeat: data.timestamp }));
    };

    // Alerta viral
    const handleViralAlert = (data) => {
      setRealtimeAlerts(prev => [data, ...prev.slice(0, 49)]); // Mantener solo 50 alertas
      
      showToast(
        `🔥 ${data.trend.name} está explotando! ${data.trend.growth}`,
        'success',
        {
          duration: 8000,
          action: {
            label: 'Ver',
            onClick: () => console.log('Navigate to trend:', data.trend.name)
          }
        }
      );

      // Notificación del navegador
      if (Notification.permission === 'granted') {
        new Notification('🔥 Tendencia Viral Detectada', {
          body: `${data.trend.name} - ${data.trend.growth} en ${data.trend.platform}`,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'viral-alert',
          requireInteraction: true
        });
      }
    };

    // Microtendencia
    const handleMicrotrend = (data) => {
      setRealtimeAlerts(prev => [data, ...prev.slice(0, 49)]);
      
      showToast(
        `🚀 Nueva oportunidad: ${data.trend.name}`,
        'info',
        {
          duration: 6000,
          action: {
            label: 'Explorar',
            onClick: () => console.log('Explore microtrend:', data.trend.name)
          }
        }
      );
    };

    // Recomendación de IA
    const handleAIRecommendation = (data) => {
      setRealtimeAlerts(prev => [data, ...prev.slice(0, 49)]);
      
      showToast(
        `💡 ${data.recommendation.action}`,
        'info',
        {
          duration: 7000,
          action: {
            label: 'Ver más',
            onClick: () => console.log('View AI recommendation:', data.recommendation)
          }
        }
      );
    };

    // Actualización de tendencia seguida
    const handleTrendUpdate = (data) => {
      setRealtimeAlerts(prev => [data, ...prev.slice(0, 49)]);
      
      showToast(
        `📈 ${data.trend.name} creció ${data.trend.change}`,
        'success',
        {
          duration: 5000
        }
      );
    };

    // Fallo de reconexión
    const handleReconnectFailed = (data) => {
      setConnectionState(prev => ({ ...prev, isConnected: false }));
      showToast('❌ No se pudo reconectar a las notificaciones', 'error');
    };

    // Registrar listeners
    predixWebSocket.on('connected', handleConnected);
    predixWebSocket.on('disconnected', handleDisconnected);
    predixWebSocket.on('heartbeat', handleHeartbeat);
    predixWebSocket.on('viral_alert', handleViralAlert);
    predixWebSocket.on('microtrend', handleMicrotrend);
    predixWebSocket.on('ai_recommendation', handleAIRecommendation);
    predixWebSocket.on('trend_update', handleTrendUpdate);
    predixWebSocket.on('reconnect_failed', handleReconnectFailed);

    // Cleanup
    return () => {
      predixWebSocket.off('connected', handleConnected);
      predixWebSocket.off('disconnected', handleDisconnected);
      predixWebSocket.off('heartbeat', handleHeartbeat);
      predixWebSocket.off('viral_alert', handleViralAlert);
      predixWebSocket.off('microtrend', handleMicrotrend);
      predixWebSocket.off('ai_recommendation', handleAIRecommendation);
      predixWebSocket.off('trend_update', handleTrendUpdate);
      predixWebSocket.off('reconnect_failed', handleReconnectFailed);
    };
  }, [showToast]);

  // Función para enviar mensaje
  const sendMessage = useCallback((message) => {
    return predixWebSocket.send(message);
  }, []);

  // Función para reconectar manualmente
  const reconnect = useCallback(() => {
    if (user?.id) {
      predixWebSocket.reconnect(user.id);
    }
  }, [user?.id]);

  // Función para limpiar alertas
  const clearAlerts = useCallback(() => {
    setRealtimeAlerts([]);
  }, []);

  // Función para marcar alerta como leída
  const markAlertAsRead = useCallback((alertId) => {
    setRealtimeAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, read: true }
          : alert
      )
    );
  }, []);

  // Función para obtener estadísticas de alertas
  const getAlertStats = useCallback(() => {
    const total = realtimeAlerts.length;
    const unread = realtimeAlerts.filter(alert => !alert.read).length;
    const byType = realtimeAlerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {});

    return { total, unread, byType };
  }, [realtimeAlerts]);

  // Solicitar permisos de notificación al cargar
  useEffect(() => {
    if (user?.id && Notification.permission === 'default') {
      requestNotificationPermission();
    }
  }, [user?.id, requestNotificationPermission]);

  return {
    // Estado de conexión
    connectionState,
    isConnected: connectionState.isConnected,
    
    // Alertas en tiempo real
    realtimeAlerts,
    alertStats: getAlertStats(),
    
    // Funciones
    sendMessage,
    reconnect,
    clearAlerts,
    markAlertAsRead,
    
    // Estado del WebSocket
    webSocketState: predixWebSocket.getConnectionState()
  };
};

export default useRealTimeNotifications;
