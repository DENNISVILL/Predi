/**
 * WebSocket Service - TypeScript
 * Real-time communication with WebSocket
 */

import type { WebSocketMessage, Trend, Alert } from '../types';

type MessageHandler = (data: any) => void;
type EventType = 'trend_update' | 'new_alert' | 'viral_spike' | 'connection' | 'error';

class WebSocketService {
    private ws: WebSocket | null = null;
    private url: string = '';
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private handlers: Map<EventType, Set<MessageHandler>> = new Map();
    private heartbeatInterval: NodeJS.Timeout | null = null;

    /**
     * Connect to WebSocket server
     */
    connect(url: string, token?: string): void {
        this.url = url;
        const wsUrl = token ? `${url}?token=${token}` : url;

        try {
            this.ws = new WebSocket(wsUrl);
            this.setupEventListeners();
        } catch (error) {
            console.error('WebSocket connection error:', error);
            this.handleReconnect();
        }
    }

    /**
     * Setup WebSocket event listeners
     */
    private setupEventListeners(): void {
        if (!this.ws) return;

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            this.emit('connection', { status: 'connected' });
        };

        this.ws.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                console.error('WebSocket message parse error:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.emit('error', { error });
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.stopHeartbeat();
            this.emit('connection', { status: 'disconnected' });
            this.handleReconnect();
        };
    }

    /**
     * Handle incoming messages
     */
    private handleMessage(message: WebSocketMessage): void {
        const { type, data } = message;

        switch (type) {
            case 'trend_update':
                this.emit('trend_update', data as Trend);
                break;
            case 'new_alert':
                this.emit('new_alert', data as Alert);
                break;
            case 'viral_spike':
                this.emit('viral_spike', data);
                break;
            case 'pong':
                // Heartbeat response
                break;
            default:
                console.warn('Unknown message type:', type);
        }
    }

    /**
     * Send message to server
     */
    send(type: string, data: any): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, data }));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    /**
     * Subscribe to trend updates
     */
    subscribeTrends(platform?: string): void {
        this.send('subscribe', { channel: 'trends', platform });
    }

    /**
     * Subscribe to alerts
     */
    subscribeAlerts(): void {
        this.send('subscribe', { channel: 'alerts' });
    }

    /**
     * Unsubscribe from channel
     */
    unsubscribe(channel: string): void {
        this.send('unsubscribe', { channel });
    }

    /**
     * Add event listener
     */
    on(event: EventType, handler: MessageHandler): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler);
    }

    /**
     * Remove event listener
     */
    off(event: EventType, handler: MessageHandler): void {
        const handlers = this.handlers.get(event);
        if (handlers) {
            handlers.delete(handler);
        }
    }

    /**
     * Emit event to listeners
     */
    private emit(event: EventType, data: any): void {
        const handlers = this.handlers.get(event);
        if (handlers) {
            handlers.forEach((handler) => handler(data));
        }
    }

    /**
     * Start heartbeat
     */
    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            this.send('ping', {});
        }, 30000); // 30 seconds
    }

    /**
     * Stop heartbeat
     */
    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Handle reconnection
     */
    private handleReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * this.reconnectAttempts;

            console.log(`Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts})`);

            setTimeout(() => {
                this.connect(this.url);
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    /**
     * Disconnect WebSocket
     */
    disconnect(): void {
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.handlers.clear();
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
}

export const websocketService = new WebSocketService();
export default websocketService;
