/**
 * AlertList Component - TypeScript
 * Displays and manages user alerts with filtering and actions
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useAlerts } from '../hooks';
import { AlertType } from '../types';
import { formatRelativeTime } from '../utils/formatters';

interface AlertListProps {
    showFilters?: boolean;
    limit?: number;
    className?: string;
}

const ALERT_TYPES: AlertType[] = [AlertType.VIRAL_SPIKE, AlertType.MICROTREND, AlertType.TREND_UPDATE, AlertType.AI_RECOMMENDATION];

const ALERT_ICONS: Record<AlertType, string> = {
    [AlertType.VIRAL_SPIKE]: '🚀',
    [AlertType.MICROTREND]: '📊',
    [AlertType.TREND_UPDATE]: '🔔',
    [AlertType.AI_RECOMMENDATION]: '🤖',
};

const ALERT_COLORS: Record<AlertType, string> = {
    [AlertType.VIRAL_SPIKE]: 'success',
    [AlertType.MICROTREND]: 'info',
    [AlertType.TREND_UPDATE]: 'warning',
    [AlertType.AI_RECOMMENDATION]: 'primary',
};

export const AlertList: React.FC<AlertListProps> = ({
    showFilters = true,
    limit,
    className = '',
}) => {
    const { alerts, loading, error, markAsRead, deleteAlert, refreshAlerts } = useAlerts();
    const [selectedType, setSelectedType] = useState<AlertType | 'all'>('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    // Filter alerts
    const filteredAlerts = useMemo(() => {
        let filtered = alerts;

        if (selectedType !== 'all') {
            filtered = filtered.filter(alert => alert.type === selectedType);
        }

        if (showUnreadOnly) {
            filtered = filtered.filter(alert => !alert.is_read);
        }

        if (limit) {
            filtered = filtered.slice(0, limit);
        }

        return filtered;
    }, [alerts, selectedType, showUnreadOnly, limit]);

    // Handle mark as read
    const handleMarkAsRead = useCallback(async (alertId: number) => {
        try {
            await markAsRead(alertId);
        } catch (err) {
            console.error('Failed to mark alert as read:', err);
        }
    }, [markAsRead]);

    // Handle delete
    const handleDelete = useCallback(async (alertId: number) => {
        if (window.confirm('Delete this alert?')) {
            try {
                await deleteAlert(alertId);
            } catch (err) {
                console.error('Failed to delete alert:', err);
            }
        }
    }, [deleteAlert]);

    // Handle mark all as read
    const handleMarkAllRead = useCallback(async () => {
        const unreadAlerts = alerts.filter(alert => !alert.is_read);
        try {
            await Promise.all(unreadAlerts.map(alert => markAsRead(alert.id)));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    }, [alerts, markAsRead]);

    if (loading) {
        return (
            <div className="alert-list__loading">
                <div className="spinner" />
                <p>Loading alerts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert--error">
                <p>Failed to load alerts: {error}</p>
                <button onClick={refreshAlerts} className="btn btn--sm">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`alert-list ${className}`}>
            {/* Header */}
            <div className="alert-list__header">
                <h2 className="alert-list__title">Notifications</h2>
                {alerts.some(a => !a.is_read) && (
                    <button
                        className="btn btn--sm btn--ghost"
                        onClick={handleMarkAllRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="alert-list__filters">
                    <select
                        className="form-select form-select--sm"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as AlertType | 'all')}
                    >
                        <option value="all">All Types</option>
                        {ALERT_TYPES.map(type => (
                            <option key={type} value={type}>
                                {type.replace('_', ' ')}
                            </option>
                        ))}
                    </select>

                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={showUnreadOnly}
                            onChange={(e) => setShowUnreadOnly(e.target.checked)}
                        />
                        <span>Unread only</span>
                    </label>
                </div>
            )}

            {/* Alert List */}
            {filteredAlerts.length === 0 ? (
                <div className="alert-list__empty">
                    <p>No alerts to display</p>
                </div>
            ) : (
                <div className="alert-list__items">
                    {filteredAlerts.map(alert => (
                        <div
                            key={alert.id}
                            className={`
                alert-item
                ${!alert.is_read ? 'alert-item--unread' : ''}
                alert-item--${ALERT_COLORS[alert.type]}
              `}
                            onClick={() => !alert.is_read && handleMarkAsRead(alert.id)}
                        >
                            <div className="alert-item__icon">
                                {ALERT_ICONS[alert.type]}
                            </div>

                            <div className="alert-item__content">
                                <div className="alert-item__header">
                                    <h4 className="alert-item__title">{alert.title}</h4>
                                    <span className="alert-item__time">
                                        {formatRelativeTime(alert.created_at)}
                                    </span>
                                </div>

                                <p className="alert-item__message">{alert.message}</p>

                                {alert.metadata && (
                                    <div className="alert-item__metadata">
                                        {alert.metadata.trend_name && (
                                            <span className="metadata-tag">
                                                {alert.metadata.trend_name}
                                            </span>
                                        )}
                                        {alert.metadata.viral_score && (
                                            <span className="metadata-tag">
                                                Score: {alert.metadata.viral_score}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="alert-item__actions">
                                {!alert.is_read && (
                                    <button
                                        className="btn-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkAsRead(alert.id);
                                        }}
                                        title="Mark as read"
                                    >
                                        ✓
                                    </button>
                                )}

                                <button
                                    className="btn-icon btn-icon--danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(alert.id);
                                    }}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlertList;
