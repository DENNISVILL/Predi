/**
 * Dashboard Page - TypeScript
 * Main dashboard with trends, predictions, and quick actions
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTrends, usePredictions, useAlerts } from '../hooks';
import { TrendCard } from '../components/TrendCard';
import { AlertList } from '../components/AlertList';
import type { Trend } from '../types';

interface DashboardProps {
    className?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        trends,
        loading: trendsLoading,
        error: trendsError,
        refreshTrends,
    } = useTrends({ sortBy: 'viral_score', sortOrder: 'desc' });

    const {
        predictions,
        loading: predictionsLoading,
    } = usePredictions();

    const { alerts, unreadCount } = useAlerts();

    // Handle trend click
    const handleTrendClick = useCallback((trend: Trend) => {
        navigate(`/trends/${trend.uuid}`);
    }, [navigate]);

    // Handle new prediction
    const handleNewPrediction = useCallback(() => {
        navigate('/predictions/new');
    }, [navigate]);

    // Handle analyze trend
    const handleAnalyzeTrend = useCallback((trend: Trend) => {
        navigate(`/predictions/new?trend=${trend.uuid}`);
    }, [navigate]);

    return (
        <div className={`dashboard ${className}`}>
            {/* Welcome Header */}
            <header className="dashboard__header">
                <div className="dashboard__welcome">
                    <h1>Welcome back, {user?.full_name || user?.username}!</h1>
                    <p className="dashboard__subtitle">
                        Here's what's trending right now
                    </p>
                </div>

                <div className="dashboard__actions">
                    <button
                        className="btn btn--primary"
                        onClick={handleNewPrediction}
                    >
                        <span className="btn__icon">🎯</span>
                        New Prediction
                    </button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="dashboard__stats">
                <div className="stat-card stat-card--primary">
                    <div className="stat-card__icon">📊</div>
                    <div className="stat-card__content">
                        <div className="stat-card__value">{predictions.length}</div>
                        <div className="stat-card__label">Your Predictions</div>
                    </div>
                </div>

                <div className="stat-card stat-card--success">
                    <div className="stat-card__icon">🔔</div>
                    <div className="stat-card__content">
                        <div className="stat-card__value">{unreadCount}</div>
                        <div className="stat-card__label">New Alerts</div>
                    </div>
                </div>

                <div className="stat-card stat-card--info">
                    <div className="stat-card__icon">🚀</div>
                    <div className="stat-card__content">
                        <div className="stat-card__value">{trends.filter(t => t.viral_score >= 80).length}</div>
                        <div className="stat-card__label">Hot Trends</div>
                    </div>
                </div>

                <div className="stat-card stat-card--warning">
                    <div className="stat-card__icon">👑</div>
                    <div className="stat-card__content">
                        <div className="stat-card__value">
                            {user?.role === 'premium' ? 'Pro' : 'Free'}
                        </div>
                        <div className="stat-card__label">Plan</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard__content">
                {/* Trending Section */}
                <section className="dashboard__section dashboard__section--main">
                    <div className="section-header">
                        <h2>Trending Now</h2>
                        <div className="section-header__actions">
                            <button
                                className="btn btn--sm btn--ghost"
                                onClick={refreshTrends}
                                disabled={trendsLoading}
                            >
                                🔄 Refresh
                            </button>
                            <button
                                className="btn btn--sm btn--outline"
                                onClick={() => navigate('/explore')}
                            >
                                View All
                            </button>
                        </div>
                    </div>

                    {trendsError && (
                        <div className="alert alert--error">
                            <p>Failed to load trends: {trendsError}</p>
                            <button onClick={refreshTrends} className="btn btn--sm">
                                Retry
                            </button>
                        </div>
                    )}

                    {trendsLoading && trends.length === 0 ? (
                        <div className="dashboard__loading">
                            <div className="spinner" />
                            <p>Loading trends...</p>
                        </div>
                    ) : (
                        <div className="trends-grid">
                            {trends.slice(0, 6).map((trend) => (
                                <TrendCard
                                    key={trend.uuid}
                                    trend={trend}
                                    onClick={handleTrendClick}
                                    onAnalyze={handleAnalyzeTrend}
                                    showActions
                                />
                            ))}
                        </div>
                    )}

                    {trends.length === 0 && !trendsLoading && (
                        <div className="empty-state">
                            <div className="empty-state__icon">📊</div>
                            <h3>No trends available</h3>
                            <p>Check back later for trending content</p>
                        </div>
                    )}
                </section>

                {/* Sidebar */}
                <aside className="dashboard__sidebar">
                    {/* Recent Alerts */}
                    <section className="dashboard__section">
                        <h3>Recent Alerts</h3>
                        <AlertList limit={5} showFilters={false} />
                        {alerts.length > 5 && (
                            <button
                                className="btn btn--sm btn--block btn--ghost"
                                onClick={() => navigate('/alerts')}
                            >
                                View All Alerts
                            </button>
                        )}
                    </section>

                    {/* Recent Predictions */}
                    <section className="dashboard__section">
                        <div className="section-header">
                            <h3>Recent Predictions</h3>
                            <button
                                className="btn btn--sm btn--ghost"
                                onClick={() => navigate('/predictions')}
                            >
                                View All
                            </button>
                        </div>

                        {predictionsLoading ? (
                            <div className="dashboard__loading">
                                <div className="spinner" />
                            </div>
                        ) : predictions.length > 0 ? (
                            <div className="prediction-list">
                                {predictions.slice(0, 5).map((prediction) => (
                                    <div
                                        key={prediction.id}
                                        className="prediction-item"
                                        onClick={() => navigate(`/predictions/${prediction.uuid}`)}
                                    >
                                        <div className="prediction-item__header">
                                            <span className="prediction-item__platform">
                                                {prediction.input_data?.platform || 'Unknown'}
                                            </span>
                                            <span className={`viral-score viral-score--${prediction.viral_score >= 80 ? 'high' :
                                                prediction.viral_score >= 60 ? 'medium' : 'low'
                                                }`}>
                                                {prediction.viral_score.toFixed(1)}
                                            </span>
                                        </div>
                                        <p className="prediction-item__content">
                                            {prediction.input_data?.name || 'Prediction'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state empty-state--sm">
                                <p>No predictions yet</p>
                                <button
                                    className="btn btn--sm btn--primary"
                                    onClick={handleNewPrediction}
                                >
                                    Create First Prediction
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Quick Actions */}
                    <section className="dashboard__section">
                        <h3>Quick Actions</h3>
                        <div className="quick-actions">
                            <button
                                className="quick-action"
                                onClick={() => navigate('/explore')}
                            >
                                <span className="quick-action__icon">🔍</span>
                                <span className="quick-action__label">Explore Trends</span>
                            </button>
                            <button
                                className="quick-action"
                                onClick={() => navigate('/analytics')}
                            >
                                <span className="quick-action__icon">📈</span>
                                <span className="quick-action__label">View Analytics</span>
                            </button>
                            <button
                                className="quick-action"
                                onClick={() => navigate('/settings')}
                            >
                                <span className="quick-action__icon">⚙️</span>
                                <span className="quick-action__label">Settings</span>
                            </button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;
