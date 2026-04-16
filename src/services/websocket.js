// Simulador de WebSocket para notificaciones en tiempo real
class PredixWebSocket {
  constructor() {
    this.listeners = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.heartbeatInterval = null;
    this.simulationInterval = null;
  }

  // Conectar al WebSocket (simulado)
  connect(userId) {
    return new Promise((resolve) => {
      console.log(`🔌 Connecting to Predix WebSocket for user: ${userId}`);
      
      // Simular conexión
      setTimeout(() => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Iniciar heartbeat
        this.startHeartbeat();
        
        // Iniciar simulación de eventos
        this.startSimulation();
        
        // Emitir evento de conexión
        this.emit('connected', { userId, timestamp: new Date() });
        
        console.log('✅ Connected to Predix WebSocket');
        resolve(true);
      }, 1000);
    });
  }

  // Desconectar
  disconnect() {
    this.isConnected = false;
    this.stopHeartbeat();
    this.stopSimulation();
    this.emit('disconnected', { timestamp: new Date() });
    console.log('🔌 Disconnected from Predix WebSocket');
  }

  // Suscribirse a eventos
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Desuscribirse de eventos
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emitir evento
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${event}:`, error);
        }
      });
    }
  }

  // Enviar mensaje (simulado)
  send(message) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected');
      return false;
    }

    console.log('📤 Sending message:', message);
    
    // Simular respuesta del servidor
    setTimeout(() => {
      this.emit('message', {
        type: 'response',
        data: { status: 'received', originalMessage: message },
        timestamp: new Date()
      });
    }, 100);

    return true;
  }

  // Iniciar heartbeat
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.emit('heartbeat', { timestamp: new Date() });
      }
    }, 30000); // Cada 30 segundos
  }

  // Detener heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Iniciar simulación de eventos
  startSimulation() {
    const events = [
      {
        type: 'viral_alert',
        probability: 0.1,
        generator: () => ({
          id: Date.now(),
          type: 'viral_alert',
          title: '🔥 Tendencia viral detectada',
          trend: {
            name: '#TechInnovation' + Math.floor(Math.random() * 1000),
            growth: '+' + Math.floor(Math.random() * 300 + 100) + '%',
            platform: ['TikTok', 'Instagram', 'Twitter'][Math.floor(Math.random() * 3)],
            confidence: Math.floor(Math.random() * 20 + 80)
          },
          timestamp: new Date()
        })
      },
      {
        type: 'microtrend',
        probability: 0.15,
        generator: () => ({
          id: Date.now(),
          type: 'microtrend',
          title: '🚀 Nueva microtendencia emergente',
          trend: {
            name: '#EmergingTrend' + Math.floor(Math.random() * 1000),
            growth: '+' + Math.floor(Math.random() * 150 + 50) + '%',
            platform: ['LinkedIn', 'YouTube', 'Pinterest'][Math.floor(Math.random() * 3)],
            confidence: Math.floor(Math.random() * 30 + 60)
          },
          timestamp: new Date()
        })
      },
      {
        type: 'ai_recommendation',
        probability: 0.08,
        generator: () => ({
          id: Date.now(),
          type: 'ai_recommendation',
          title: '💡 Recomendación personalizada de IA',
          recommendation: {
            action: 'Crear contenido sobre sostenibilidad',
            reason: 'Basado en tu perfil, esta tendencia tiene 94% de compatibilidad',
            expectedReach: Math.floor(Math.random() * 1000000 + 500000).toLocaleString(),
            confidence: Math.floor(Math.random() * 20 + 80)
          },
          timestamp: new Date()
        })
      },
      {
        type: 'trend_update',
        probability: 0.12,
        generator: () => ({
          id: Date.now(),
          type: 'trend_update',
          title: '📈 Actualización de tendencia seguida',
          trend: {
            name: '#FollowedTrend' + Math.floor(Math.random() * 100),
            previousGrowth: '+150%',
            currentGrowth: '+' + Math.floor(Math.random() * 200 + 200) + '%',
            change: '+' + Math.floor(Math.random() * 50 + 10) + '%',
            platform: 'Instagram'
          },
          timestamp: new Date()
        })
      }
    ];

    this.simulationInterval = setInterval(() => {
      if (!this.isConnected) return;

      events.forEach(eventConfig => {
        if (Math.random() < eventConfig.probability) {
          const eventData = eventConfig.generator();
          this.emit(eventConfig.type, eventData);
          this.emit('notification', eventData);
        }
      });
    }, 10000); // Cada 10 segundos
  }

  // Detener simulación
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  // Reconectar automáticamente
  reconnect(userId) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('reconnect_failed', { attempts: this.reconnectAttempts });
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(userId).catch(() => {
        this.reconnect(userId);
      });
    }, this.reconnectInterval);
  }

  // Obtener estado de conexión
  getConnectionState() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }
}

// Instancia singleton
const predixWebSocket = new PredixWebSocket();

export default predixWebSocket;
