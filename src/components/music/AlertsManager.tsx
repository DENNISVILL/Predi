/**
 * FEATURE #8: Alerts Manager
 * Real-time alerting system with multiple notification channels
 */

import React, { useState } from 'react';
import type { AlertRule, Alert } from '../../types/music';
import { generateMockAlertRule, generateMockAlert } from '../../utils/mockMusicData';

interface AlertsManagerProps {
    className?: string;
}

const AlertsManager: React.FC<AlertsManagerProps> = ({ className = '' }) => {
    const [activeTab, setActiveTab] = useState<'rules' | 'history'>('rules');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Mock data
    const [alertRules, setAlertRules] = useState<AlertRule[]>([
        generateMockAlertRule(),
    ]);

    const [alertHistory, setAlertHistory] = useState<Alert[]>([
        { ...generateMockAlert('song1'), unread: true },
        { ...generateMockAlert('song2'), priority: 'urgent', unread: true },
        { ...generateMockAlert('song3'), readAt: new Date().toISOString() },
    ] as Alert[]);

    const [newRule, setNewRule] = useState<Partial<AlertRule>>({
        name: '',
        type: 'new_emerging',
        enabled: true,
        conditions: {},
        channels: { push: true, email: false },
        frequency: 'instant',
    });

    const handleCreateRule = () => {
        const rule: AlertRule = {
            id: `alert_${Date.now()}`,
            name: newRule.name || 'Nueva Alerta',
            enabled: true,
            type: newRule.type || 'new_emerging',
            conditions: newRule.conditions || {},
            channels: newRule.channels || { push: true, email: false },
            frequency: newRule.frequency || 'instant',
            createdAt: new Date().toISOString(),
        };

        setAlertRules([...alertRules, rule]);
        setShowCreateModal(false);
        setNewRule({
            name: '',
            type: 'new_emerging',
            enabled: true,
            conditions: {},
            channels: { push: true, email: false },
            frequency: 'instant',
        });
    };

    const toggleRule = (id: string) => {
        setAlertRules(alertRules.map(rule =>
            rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
        ));
    };

    const deleteRule = (id: string) => {
        if (window.confirm('¿Seguro que quieres eliminar esta regla de alerta?')) {
            setAlertRules(alertRules.filter(rule => rule.id !== id));
        }
    };

    const markAsRead = (id: string) => {
        setAlertHistory(alertHistory.map(alert =>
            alert.id === id ? { ...alert, readAt: new Date().toISOString() } : alert
        ));
    };

    const dismissAlert = (id: string) => {
        setAlertHistory(alertHistory.map(alert =>
            alert.id === id ? { ...alert, dismissedAt: new Date().toISOString() } : alert
        ));
    };

    const unreadCount = alertHistory.filter(a => !a.readAt && !a.dismissedAt).length;

    return (
        <div className={`alerts-manager ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            <span className="mr-2">🔔</span>
                            Alertas en Tiempo Real
                        </h2>
                        <p className="text-red-100">Mantente informado de canciones emergentes y tendencias</p>
                    </div>
                    {unreadCount > 0 && (
                        <div className="bg-white text-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl animate-pulse">
                            {unreadCount}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('rules')}
                        className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'rules'
                            ? 'border-b-4 border-red-600 text-red-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        ⚙️ Reglas de Alerta ({alertRules.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 px-6 py-4 font-semibold transition-all relative ${activeTab === 'history'
                            ? 'border-b-4 border-red-600 text-red-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        📜 Historial ({alertHistory.length})
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="p-6">
                    {/* Alert Rules Tab */}
                    {activeTab === 'rules' && (
                        <div className="space-y-6">
                            {/* Create Button */}
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                <span className="mr-2">➕</span>
                                Crear Nueva Regla de Alerta
                            </button>

                            {/* Active Rules */}
                            <div className="space-y-4">
                                {alertRules.map(rule => (
                                    <div
                                        key={rule.id}
                                        className={`bg-gradient-to-br rounded-xl p-6 border-2 transition-all ${rule.enabled
                                            ? 'from-green-50 to-emerald-50 border-green-300'
                                            : 'from-gray-50 to-gray-100 border-gray-300 opacity-60'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900">{rule.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${rule.enabled ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                                                        }`}>
                                                        {rule.enabled ? '✓ Activa' : '⏸ Pausada'}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Tipo:</span>
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                                            {rule.type === 'new_emerging' ? '🌱 Nueva Emergente' :
                                                                rule.type === 'threshold_reached' ? '📊 Umbral Alcanzado' :
                                                                    rule.type === 'peak_approaching' ? '🔥 Peak Cerca' : '🔍 Pattern Match'}
                                                        </span>
                                                    </div>

                                                    {rule.conditions.viralScore && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">Viral Score:</span>
                                                            <span>≥ {rule.conditions.viralScore.min}</span>
                                                        </div>
                                                    )}

                                                    {rule.conditions.growthRate && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">Crecimiento:</span>
                                                            <span>≥ {rule.conditions.growthRate.min}% ({rule.conditions.growthRate.period})</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Canales:</span>
                                                        <div className="flex gap-1">
                                                            {rule.channels.push && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">📱 Push</span>}
                                                            {rule.channels.email && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">📧 Email</span>}
                                                            {rule.channels.slack && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">💬 Slack</span>}
                                                            {rule.channels.discord && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">🎮 Discord</span>}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">Frecuencia:</span>
                                                        <span className="capitalize">{rule.frequency}</span>
                                                    </div>

                                                    {rule.lastTriggered && (
                                                        <div className="text-xs text-gray-600">
                                                            Última activación: {new Date(rule.lastTriggered).toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleRule(rule.id)}
                                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${rule.enabled
                                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                >
                                                    {rule.enabled ? '⏸ Pausar' : '▶ Activar'}
                                                </button>
                                                <button
                                                    onClick={() => deleteRule(rule.id)}
                                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition-all"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {alertRules.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                                        <div className="text-4xl mb-3">🔕</div>
                                        <p className="text-gray-600 mb-4">No tienes reglas de alerta configuradas</p>
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                                        >
                                            Crear Primera Regla
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Alert History Tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            {alertHistory
                                .filter(alert => !alert.dismissedAt)
                                .map(alert => (
                                    <div
                                        key={alert.id}
                                        className={`rounded-xl p-5 border-2 transition-all cursor-pointer ${!alert.readAt
                                            ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300 shadow-md'
                                            : 'bg-white border-gray-200'
                                            }`}
                                        onClick={() => !alert.readAt && markAsRead(alert.id)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Alert Icon */}
                                            <div className={`text-4xl ${alert.priority === 'urgent' ? 'animate-bounce' : ''
                                                }`}>
                                                {alert.type === 'new_emerging' ? '🚨' :
                                                    alert.type === 'threshold_reached' ? '📊' :
                                                        alert.type === 'peak_approaching' ? '🔥' : '🔍'}
                                            </div>

                                            {/* Alert Content */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-lg">{alert.title}</h4>
                                                        <p className="text-gray-700 mt-1">{alert.message}</p>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {!alert.readAt && (
                                                            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                                                                NUEVO
                                                            </span>
                                                        )}
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.priority === 'urgent' ? 'bg-red-500 text-white' :
                                                            alert.priority === 'high' ? 'bg-orange-500 text-white' :
                                                                alert.priority === 'medium' ? 'bg-yellow-500 text-white' :
                                                                    'bg-gray-500 text-white'
                                                            }`}>
                                                            {alert.priority?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {alert.metric && (
                                                    <div className="bg-purple-100 rounded-lg p-3 mb-3">
                                                        <div className="text-sm font-semibold text-purple-900">
                                                            {alert.metric}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-gray-600">
                                                        {new Date(alert.createdAt).toLocaleString()}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.alert(`Viendo detalles de canción...`);
                                                            }}
                                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200"
                                                        >
                                                            Ver Canción
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                dismissAlert(alert.id);
                                                            }}
                                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold hover:bg-gray-200"
                                                        >
                                                            Descartar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            {alertHistory.filter(a => !a.dismissedAt).length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <div className="text-4xl mb-3">📪</div>
                                    <p className="text-gray-600">No hay alertas recientes</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Alert Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900">Crear Regla de Alerta</h3>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Rule Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre de la Regla
                                </label>
                                <input
                                    type="text"
                                    value={newRule.name}
                                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                                    placeholder="Ej: Canciones Emergentes K-Pop"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                                />
                            </div>

                            {/* Alert Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tipo de Alerta
                                </label>
                                <select
                                    value={newRule.type}
                                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500"
                                >
                                    <option value="new_emerging">🌱 Nueva Canción Emergente</option>
                                    <option value="threshold_reached">📊 Umbral Alcanzado</option>
                                    <option value="peak_approaching">🔥 Peak Cerca (1-2 días)</option>
                                    <option value="pattern_match">🔍 Patrón Similar</option>
                                </select>
                            </div>

                            {/* Conditions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Condiciones</h4>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            Viral Score Mínimo
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="75"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            onChange={(e) => setNewRule({
                                                ...newRule,
                                                conditions: { ...newRule.conditions, viralScore: { min: parseInt(e.target.value) } }
                                            })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            Crecimiento Mínimo (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="100"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            onChange={(e) => setNewRule({
                                                ...newRule,
                                                conditions: { ...newRule.conditions, growthRate: { min: parseInt(e.target.value), period: '24h' } }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notification Channels */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Canales de Notificación
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { key: 'push', label: '📱 Push Notifications', desc: 'Notificaciones en el navegador' },
                                        { key: 'email', label: '📧 Email', desc: 'Correo electrónico' },
                                        { key: 'slack', label: '💬 Slack', desc: 'Webhook de Slack' },
                                        { key: 'discord', label: '🎮 Discord', desc: 'Webhook de Discord' },
                                    ].map(channel => (
                                        <label key={channel.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                            <input
                                                type="checkbox"
                                                checked={(newRule.channels as any)?.[channel.key] || false}
                                                onChange={(e) => {
                                                    setNewRule({
                                                        ...newRule,
                                                        channels: {
                                                            push: newRule.channels?.push ?? false,
                                                            email: newRule.channels?.email ?? false,
                                                            slack: newRule.channels?.slack,
                                                            discord: newRule.channels?.discord,
                                                            [channel.key]: e.target.checked
                                                        } as AlertRule['channels']
                                                    });
                                                }}
                                                className="w-5 h-5"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">{channel.label}</div>
                                                <div className="text-xs text-gray-600">{channel.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Frequency */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Frecuencia
                                </label>
                                <select
                                    value={newRule.frequency}
                                    onChange={(e) => setNewRule({ ...newRule, frequency: e.target.value as any })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500"
                                >
                                    <option value="instant">⚡ Instantáneo</option>
                                    <option value="hourly">⏰ Cada Hora</option>
                                    <option value="daily">📅 Diario</option>
                                    <option value="weekly">📆 Semanal</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateRule}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700"
                            >
                                Crear Regla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertsManager;
