/**
 * Profile Component - TypeScript
 * User profile display and management
 */

import React, { useState, useCallback } from 'react';
import { useAuth } from '../hooks';
import type { User } from '../types';
import { formatNumber, formatDate } from '../utils/formatters';
import apiService from '../services/apiConfig';

interface ProfileProps {
    userId?: number;
    isOwnProfile?: boolean;
    className?: string;
}

interface ProfileStats {
    total_predictions: number;
    avg_viral_score: number;
    total_alerts: number;
    account_age_days: number;
    predictions_this_month: number;
    accuracy_rate: number;
}

export const Profile: React.FC<ProfileProps> = ({
    userId,
    isOwnProfile = true,
    className = '',
}) => {
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState<User | null>(isOwnProfile ? currentUser : null);
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({
        full_name: user?.full_name || '',
        bio: user?.bio || '',
        location: user?.location || '',
    });

    // Load user profile
    const loadProfile = useCallback(async () => {
        if (!userId && !isOwnProfile) return;

        setLoading(true);
        try {
            const endpoint = isOwnProfile ? '/users/me' : `/users/${userId}`;
            const userData = await apiService.get<User>(endpoint);
            setUser(userData);

            // Load stats
            const statsData = await apiService.get<ProfileStats>(`/users/${userData.id}/stats`);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, isOwnProfile]);

    // Save profile changes
    const saveProfile = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const updated = await apiService.patch<User>('/users/profile', editData);
            setUser(updated);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setLoading(false);
        }
    }, [editData, user]);

    React.useEffect(() => {
        if (userId || !isOwnProfile) {
            loadProfile();
        }
    }, [userId, isOwnProfile, loadProfile]);

    if (loading && !user) {
        return (
            <div className="profile__loading">
                <div className="spinner" />
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile__error">
                <p>User not found</p>
            </div>
        );
    }

    return (
        <div className={`profile ${className}`}>
            {/* Header */}
            <div className="profile__header">
                <div className="profile__avatar">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name || user.username} />
                    ) : (
                        <div className="profile__avatar-placeholder">
                            {(user.full_name || user.username).charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="profile__header-info">
                    {!isEditing ? (
                        <>
                            <h1 className="profile__name">{user.full_name || user.username}</h1>
                            <p className="profile__username">@{user.username}</p>
                            {user.bio && <p className="profile__bio">{user.bio}</p>}
                            {user.location && (
                                <p className="profile__location">
                                    📍 {user.location}
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="profile__edit-form">
                            <input
                                type="text"
                                className="form-input"
                                value={editData.full_name}
                                onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                                placeholder="Full name"
                            />
                            <textarea
                                className="form-textarea"
                                value={editData.bio}
                                onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Bio"
                                rows={3}
                            />
                            <input
                                type="text"
                                className="form-input"
                                value={editData.location}
                                onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Location"
                            />
                        </div>
                    )}
                </div>

                {isOwnProfile && (
                    <div className="profile__actions">
                        {!isEditing ? (
                            <button
                                className="btn btn--secondary"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    className="btn btn--primary"
                                    onClick={saveProfile}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    className="btn btn--secondary"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditData({
                                            full_name: user.full_name || '',
                                            bio: user.bio || '',
                                            location: user.location || '',
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Stats */}
            {stats && (
                <div className="profile__stats">
                    <div className="stat-card">
                        <div className="stat-card__icon">🎯</div>
                        <div className="stat-card__value">{formatNumber(stats.total_predictions)}</div>
                        <div className="stat-card__label">Total Predictions</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon">📊</div>
                        <div className="stat-card__value">{stats.avg_viral_score.toFixed(1)}</div>
                        <div className="stat-card__label">Avg Viral Score</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon">🔔</div>
                        <div className="stat-card__value">{formatNumber(stats.total_alerts)}</div>
                        <div className="stat-card__label">Total Alerts</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card__icon">✅</div>
                        <div className="stat-card__value">{stats.accuracy_rate.toFixed(0)}%</div>
                        <div className="stat-card__label">Accuracy Rate</div>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="profile__info">
                <div className="info-item">
                    <span className="info-item__label">Role:</span>
                    <span className={`badge badge--${user.role}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                </div>

                <div className="info-item">
                    <span className="info-item__label">Member since:</span>
                    <span className="info-item__value">
                        {formatDate(user.created_at)}
                    </span>
                </div>

                {stats && (
                    <div className="info-item">
                        <span className="info-item__label">Account age:</span>
                        <span className="info-item__value">
                            {stats.account_age_days} days
                        </span>
                    </div>
                )}

                {user.last_login_at && (
                    <div className="info-item">
                        <span className="info-item__label">Last active:</span>
                        <span className="info-item__value">
                            {formatDate(user.last_login_at)}
                        </span>
                    </div>
                )}
            </div>

            {/* Activity */}
            {isOwnProfile && stats && (
                <div className="profile__activity">
                    <h2>This Month's Activity</h2>
                    <div className="activity-stats">
                        <div className="activity-stat">
                            <span className="activity-stat__value">
                                {stats.predictions_this_month}
                            </span>
                            <span className="activity-stat__label">Predictions</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
