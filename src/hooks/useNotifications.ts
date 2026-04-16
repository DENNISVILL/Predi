import { useState, useEffect, useCallback } from 'react';
import useStore from '../store/useStore';
import toast, { ToastOptions } from 'react-hot-toast';

// ============================================
// TYPES & INTERFACES
// ============================================

type NotificationType = 'success' | 'error' | 'loading' | 'info';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface BrowserNotificationOptions {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    data?: Record<string, any>;
}

interface ToastNotificationOptions extends Partial<ToastOptions> {
    icon?: string;
    style?: React.CSSProperties;
}

interface Trend {
    id: number | string;
    name: string;
    growth: string;
    platform: string;
    confidence: number;
    [key: string]: any;
}

interface Alert {
    id?: number;
    title: string;
    message: string;
    type: string;
    platform: string;
    confidence: number;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
}

interface Prediction {
    id: number | string;
    name: string;
    platform: string;
    confidence: number;
    [key: string]: any;
}

interface MicroTrend {
    id: number | string;
    name: string;
    growth: string;
    timeframe: string;
    [key: string]: any;
}

interface ScheduledNotification {
    message: string;
    type: NotificationType;
    title?: string;
    options?: ToastNotificationOptions;
    browser?: BrowserNotificationOptions;
}

interface NotificationStats {
    totalAlerts: number;
    unreadAlerts: number;
    alertsByType: Record<string, number>;
    recentAlerts: Alert[];
    permissionStatus: NotificationPermission;
    settingsEnabled: {
        push: boolean;
        email: boolean;
        trends: boolean;
        alerts: boolean;
    };
}

interface UseNotificationsReturn {
    // Estado
    alerts: Alert[];
    permission: NotificationPermission;
    notificationSettings: any;

    // Acciones básicas
    requestPermission: () => Promise<boolean>;
    showToast: (message: string, type?: NotificationType, options?: ToastNotificationOptions) => void;
    showBrowserNotification: (title: string, options?: BrowserNotificationOptions) => Notification | null;
    dismissAllToasts: () => void;

    // Notificaciones específicas
    notifyNewTrend: (trend: Trend) => void;
    notifyAlert: (alert: Alert) => void;
    notifyPredictionConfirmed: (prediction: Prediction) => void;
    notifyMicroTrend: (microTrend: MicroTrend) => void;
    scheduleNotification: (notification: ScheduledNotification, delay: number) => void;

    // Gestión de alertas
    addAlert: (alert: Omit<Alert, 'id'>) => void;
    markAlertAsRead: (alertId: number) => void;
    removeAlert: (alertId: number) => void;
    clearAllAlerts: () => void;

    // Configuración
    updateNotificationSettings: (settings: Record<string, any>) => void;

    // Utilidades
    getUnreadAlerts: () => Alert[];
    getNotificationStats: () => NotificationStats;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export const useNotifications = (): UseNotificationsReturn => {
    const {
        alerts,
        notifications: notificationSettings,
        addAlert,
        markAlertAsRead,
        removeAlert,
        clearAllAlerts,
        getUnreadAlerts,
        updateNotifications
    } = useStore();

    const [permission, setPermission] = useState<NotificationPermission>('default');

    // Solicitar permisos de notificación
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission(result as NotificationPermission);
            return result === 'granted';
        }
        return false;
    }, []);

    // Verificar permisos al montar
    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission as NotificationPermission);
        }
    }, []);

    // Mostrar notificación del navegador
    const showBrowserNotification = useCallback((
        title: string,
        options: BrowserNotificationOptions = {}
    ): Notification | null => {
        if (permission === 'granted' && (notificationSettings as any).push) {
            const notification = new Notification(title, {
                icon: '/logo192.png',
                badge: '/logo192.png',
                ...options
            });

            // Auto-cerrar después de 5 segundos
            setTimeout(() => notification.close(), 5000);

            return notification;
        }
        return null;
    }, [permission, (notificationSettings as any).push]);

    // Mostrar toast notification
    const showToast = useCallback((
        message: string,
        type: NotificationType = 'success',
        options: ToastNotificationOptions = {}
    ): void => {
        const toastOptions: ToastOptions = {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#1f1f1f',
                color: '#ffffff',
                border: '1px solid #374151',
                borderRadius: '12px',
                ...options.style
            },
            ...options
        };

        switch (type) {
            case 'success':
                toast.success(message, toastOptions);
                break;
            case 'error':
                toast.error(message, toastOptions);
                break;
            case 'loading':
                toast.loading(message, toastOptions);
                break;
            default:
                toast(message, toastOptions);
        }
    }, []);

    // Notificar nueva tendencia
    const notifyNewTrend = useCallback((trend: Trend): void => {
        if (!(notificationSettings as any).trends) return;

        const message = `Nueva tendencia detectada: ${trend.name} (+${trend.growth})`;

        // Toast notification
        showToast(message, 'success', {
            icon: '🚀',
            duration: 6000
        });

        // Browser notification
        showBrowserNotification('Nueva Tendencia - Predix', {
            body: message,
            tag: 'new-trend',
            data: { trendId: trend.id, type: 'trend' }
        });

        // Agregar a alertas
        addAlert({
            title: 'Nueva tendencia detectada',
            message: `${trend.name} está creciendo ${trend.growth} en ${trend.platform}`,
            type: 'trend',
            platform: trend.platform,
            confidence: trend.confidence,
            timestamp: new Date().toISOString(),
            isRead: false,
            actionUrl: `/trend/${trend.id}`
        });
    }, [(notificationSettings as any).trends, showToast, showBrowserNotification, addAlert]);

    // Notificar alerta crítica
    const notifyAlert = useCallback((alert: Alert): void => {
        if (!(notificationSettings as any).alerts) return;

        // Toast notification con estilo especial para alertas
        showToast(alert.message, 'error', {
            icon: '⚠️',
            duration: 8000,
            style: {
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#ffffff',
                border: '1px solid #f87171'
            }
        });

        // Browser notification
        showBrowserNotification('Alerta Crítica - Predix', {
            body: alert.message,
            tag: 'critical-alert',
            requireInteraction: true,
            data: { alertId: alert.id, type: 'alert' }
        });
    }, [(notificationSettings as any).alerts, showToast, showBrowserNotification]);

    // Notificar predicción confirmada
    const notifyPredictionConfirmed = useCallback((prediction: Prediction): void => {
        if (!(notificationSettings as any).trends) return;

        const message = `¡Predicción confirmada! ${prediction.name} creció como esperabas`;

        showToast(message, 'success', {
            icon: '🎯',
            duration: 6000,
            style: {
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff'
            }
        });

        showBrowserNotification('Predicción Confirmada - Predix', {
            body: message,
            tag: 'prediction-confirmed',
            data: { predictionId: prediction.id, type: 'prediction' }
        });

        addAlert({
            title: 'Predicción confirmada',
            message,
            type: 'prediction',
            platform: prediction.platform,
            confidence: prediction.confidence,
            timestamp: new Date().toISOString(),
            isRead: false,
            actionUrl: `/trend/${prediction.id}`
        });
    }, [(notificationSettings as any).trends, showToast, showBrowserNotification, addAlert]);

    // Notificar microtendencia emergente
    const notifyMicroTrend = useCallback((microTrend: MicroTrend): void => {
        if (!(notificationSettings as any).alerts) return;

        const message = `Microtendencia emergente: ${microTrend.name} (+${microTrend.growth} en ${microTrend.timeframe})`;

        showToast(message, 'success', {
            icon: '⚡',
            duration: 5000,
            style: {
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: '#ffffff'
            }
        });

        showBrowserNotification('Microtendencia Emergente - Predix', {
            body: message,
            tag: 'micro-trend',
            data: { trendId: microTrend.id, type: 'microtrend' }
        });
    }, [(notificationSettings as any).alerts, showToast, showBrowserNotification]);

    //Programar notificación
    const scheduleNotification = useCallback((
        notification: ScheduledNotification,
        delay: number
    ): void => {
        setTimeout(() => {
            showToast(notification.message, notification.type, notification.options);

            if (notification.browser && notification.title) {
                showBrowserNotification(notification.title, notification.browser);
            }
        }, delay);
    }, [showToast, showBrowserNotification]);

    // Limpiar notificaciones
    const dismissAllToasts = useCallback((): void => {
        toast.dismiss();
    }, []);

    // Configurar notificaciones
    const updateNotificationSettings = useCallback((settings: Record<string, any>): void => {
        updateNotifications(settings);

        showToast('Configuración de notificaciones actualizada', 'success', {
            icon: '⚙️'
        });
    }, [updateNotifications, showToast]);

    // Obtener estadísticas de notificaciones
    const getNotificationStats = useCallback((): NotificationStats => {
        const unreadAlerts = getUnreadAlerts();

        return {
            totalAlerts: alerts.length,
            unreadAlerts: unreadAlerts.length,
            alertsByType: alerts.reduce((acc, alert) => {
                acc[alert.type] = (acc[alert.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            recentAlerts: alerts.slice(0, 5),
            permissionStatus: permission,
            settingsEnabled: {
                push: (notificationSettings as any).push,
                email: (notificationSettings as any).email,
                trends: (notificationSettings as any).trends,
                alerts: (notificationSettings as any).alerts
            }
        };
    }, [alerts, getUnreadAlerts, permission, notificationSettings]);

    return {
        // Estado
        alerts,
        permission,
        notificationSettings,

        // Acciones básicas
        requestPermission,
        showToast,
        showBrowserNotification,
        dismissAllToasts,

        // Notificaciones específicas
        notifyNewTrend,
        notifyAlert,
        notifyPredictionConfirmed,
        notifyMicroTrend,
        scheduleNotification,

        // Gestión de alertas
        addAlert,
        markAlertAsRead,
        removeAlert,
        clearAllAlerts,

        // Configuración
        updateNotificationSettings,

        // Utilidades
        getUnreadAlerts,
        getNotificationStats
    };
};

// Export types
export type {
    UseNotificationsReturn,
    NotificationType,
    NotificationPermission,
    NotificationStats,
    Trend,
    Alert,
    Prediction,
    MicroTrend
};
