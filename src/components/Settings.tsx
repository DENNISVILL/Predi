/**
 * Settings Component - TypeScript
 * User settings and preferences management
 */

import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks';
import type { NotificationSettings, PrivacySettings } from '../types';
import apiService from '../services/apiConfig';

interface SettingsProps {
    className?: string;
}

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'subscription' | 'security';

export const Settings: React.FC<SettingsProps> = ({ className = '' }) => {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Profile settings
    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || '',
        bio: user?.bio || '',
        location: user?.location || '',
    });

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        email_notifications: true,
        push_notifications: true,
        viral_spike_alerts: true,
        microtrend_alerts: true,
        weekly_report: true,
    });

    // Privacy settings
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
        profile_visibility: 'public',
        show_predictions: true,
        share_analytics: false,
    });

    // Save profile
    const saveProfile = useCallback(async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            await apiService.patch('/users/profile', profileData);
            await refreshUser();
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setIsSaving(false);
        }
    }, [profileData, refreshUser]);

    // Save notifications
    const saveNotifications = useCallback(async () => {
        setIsSaving(true);
        try {
            await apiService.patch('/users/notifications', notificationSettings);
            setMessage({ type: 'success', text: 'Notification settings saved' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setIsSaving(false);
        }
    }, [notificationSettings]);

    // Save privacy
    const savePrivacy = useCallback(async () => {
        setIsSaving(true);
        try {
            await apiService.patch('/users/privacy', privacySettings);
            setMessage({ type: 'success', text: 'Privacy settings saved' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setIsSaving(false);
        }
    }, [privacySettings]);

    /*
    // Change password (not currently used in UI)
    const _changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
        setIsSaving(true);
        try {
            await apiService.post('/users/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
            });
            setMessage({ type: 'success', text: 'Password changed successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to change password' });
        } finally {
            setIsSaving(false);
        }
    }, []);
    */

    return (
        <div className={`settings ${className}`}>
            <h1 className="settings__title">Settings</h1>

            {/* Message Banner */}
            {message && (
                <div className={`alert alert--${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="settings__tabs">
                {(['profile', 'notifications', 'privacy', 'subscription', 'security'] as SettingsTab[]).map(tab => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="settings__content">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="settings-section">
                        <h2>Profile Information</h2>

                        <div className="form-group">
                            <label htmlFor="full_name">Full Name</label>
                            <input
                                id="full_name"
                                type="text"
                                className="form-input"
                                value={profileData.full_name}
                                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                className="form-textarea"
                                value={profileData.bio}
                                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                id="location"
                                type="text"
                                className="form-input"
                                value={profileData.location}
                                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                            />
                        </div>

                        <button
                            className="btn btn--primary"
                            onClick={saveProfile}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="settings-section">
                        <h2>Notification Preferences</h2>

                        <div className="checkbox-list">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.email_notifications}
                                    onChange={(e) => setNotificationSettings(prev => ({
                                        ...prev,
                                        email_notifications: e.target.checked
                                    }))}
                                />
                                <span>Email Notifications</span>
                            </label>

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.push_notifications}
                                    onChange={(e) => setNotificationSettings(prev => ({
                                        ...prev,
                                        push_notifications: e.target.checked
                                    }))}
                                />
                                <span>Push Notifications</span>
                            </label>

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.viral_spike_alerts}
                                    onChange={(e) => setNotificationSettings(prev => ({
                                        ...prev,
                                        viral_spike_alerts: e.target.checked
                                    }))}
                                />
                                <span>Viral Spike Alerts</span>
                            </label>

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.microtrend_alerts}
                                    onChange={(e) => setNotificationSettings(prev => ({
                                        ...prev,
                                        microtrend_alerts: e.target.checked
                                    }))}
                                />
                                <span>Microtrend Alerts</span>
                            </label>

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.weekly_report}
                                    onChange={(e) => setNotificationSettings(prev => ({
                                        ...prev,
                                        weekly_report: e.target.checked
                                    }))}
                                />
                                <span>Weekly Report</span>
                            </label>
                        </div>

                        <button
                            className="btn btn--primary"
                            onClick={saveNotifications}
                            disabled={isSaving}
                        >
                            Save Notifications
                        </button>
                    </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                    <div className="settings-section">
                        <h2>Privacy Settings</h2>

                        <div className="form-group">
                            <label htmlFor="profile_visibility">Profile Visibility</label>
                            <select
                                id="profile_visibility"
                                className="form-select"
                                value={privacySettings.profile_visibility}
                                onChange={(e) => setPrivacySettings(prev => ({
                                    ...prev,
                                    profile_visibility: e.target.value as 'public' | 'private'
                                }))}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="checkbox-list">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={privacySettings.show_predictions}
                                    onChange={(e) => setPrivacySettings(prev => ({
                                        ...prev,
                                        show_predictions: e.target.checked
                                    }))}
                                />
                                <span>Show My Predictions Publicly</span>
                            </label>

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={privacySettings.share_analytics}
                                    onChange={(e) => setPrivacySettings(prev => ({
                                        ...prev,
                                        share_analytics: e.target.checked
                                    }))}
                                />
                                <span>Share Anonymous Analytics</span>
                            </label>
                        </div>

                        <button
                            className="btn btn--primary"
                            onClick={savePrivacy}
                            disabled={isSaving}
                        >
                            Save Privacy Settings
                        </button>
                    </div>
                )}

                {/* Subscription Tab */}
                {activeTab === 'subscription' && (
                    <div className="settings-section">
                        <h2>Subscription</h2>
                        <div className="subscription-card">
                            <div className="subscription-card__header">
                                <h3>{user?.role === 'premium' ? 'Pro Plan' : 'Free Plan'}</h3>
                                <span className={`badge ${user?.role === 'premium' ? 'badge--success' : 'badge--secondary'}`}>
                                    {user?.role === 'premium' ? 'Active' : 'Basic'}
                                </span>
                            </div>
                            <p className="subscription-card__description">
                                {user?.role === 'premium'
                                    ? '100 predictions per month, Advanced analytics, Priority support'
                                    : '10 predictions per month, Basic analytics'}
                            </p>

                            <div className="flex gap-3 mt-4">
                                {user?.role === 'premium' ? (
                                    <>
                                        <button className="btn btn--primary">Manage Billing</button>
                                        <button
                                            className="btn btn--danger hover:bg-red-600/20 text-red-500 border border-red-500/50"
                                            onClick={async () => {
                                                if (window.confirm('¿Estás seguro que deseas cancelar tu suscripción? Perderás acceso a las funciones Pro al final del periodo.')) {
                                                    try {
                                                        await apiService.post('/subscription/cancel');
                                                        setMessage({ type: 'success', text: 'Suscripción cancelada. Tu plan no se renovará.' });
                                                        await refreshUser();
                                                    } catch (err) {
                                                        setMessage({ type: 'error', text: 'Error al cancelar. Contacta soporte.' });
                                                    }
                                                }
                                            }}
                                        >
                                            Cancelar Suscripción
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn btn--primary">Upgrade to Pro</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="settings-section">
                        <h2>Security</h2>

                        <div className="security-card">
                            <h3>Two-Factor Authentication</h3>
                            <p>Add an extra layer of security to your account</p>
                            <button className="btn btn--secondary">
                                {user?.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                            </button>
                        </div>

                        <div className="security-card">
                            <h3>Change Password</h3>
                            <p>Update your password regularly for better security</p>
                            <button className="btn btn--secondary">Change Password</button>
                        </div>

                        <div className="security-card">
                            <h3>Active Sessions</h3>
                            <p>Manage devices where you're logged in</p>
                            <button className="btn btn--secondary">View Sessions</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
