/**
 * Main Dashboard Component - TypeScript
 * Complete type-safe implementation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
    Trend,
    TrendFilters,
    Platform,
    UserStats,
} from '../types';
import { useTrends, useAuth } from '../hooks';
import { TrendCard } from './TrendCard';
import { StatsCard } from './StatsCard';
import { FilterBar } from './FilterBar';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface MainDashboardProps {
    className?: string;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ className }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        trends,
        loading,
        error,
        filters,
        setFilters,
        refreshTrends,
    } = useTrends();

    // const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
    const [showPredictionModal, setShowPredictionModal] = useState(false);
    const [stats, setStats] = useState<UserStats | null>(null);

    // Fetch user stats on mount
    useEffect(() => {
        const fetchStats = async (): Promise<void> => {
            try {
                const response = await fetch('/api/v1/users/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data: UserStats = await response.json();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };

        fetchStats();
    }, []);

    // Handle filter change
    const handleFilterChange = useCallback((newFilters: Partial<TrendFilters>): void => {
        setFilters((prev: TrendFilters) => ({ ...prev, ...newFilters }));
    }, [setFilters]);

    // Handle trend click
    const handleTrendClick = useCallback((trend: Trend): void => {
        // setSelectedTrend(trend);
        navigate(`/trends/${trend.uuid}`);
    }, [navigate]);

    // Handle new prediction
    const handleNewPrediction = useCallback((): void => {
        setShowPredictionModal(true);
    }, []);

    // Handle platform filter
    const handlePlatformFilter = useCallback((platform: Platform | null): void => {
        handleFilterChange({ platform: platform || undefined });
    }, [handleFilterChange]);

    // Render loading state
    if (loading && trends.length === 0) {
        return (
            <div className="dashboard-container" data-testid="loading-skeleton">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="dashboard-container">
                <ErrorMessage
                    error={error}
                    retry={refreshTrends}
                />
            </div>
        );
    }

    return (
        <div className={`dashboard-container ${className || ''}`}>
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Welcome back, {user?.full_name || user?.username}
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleNewPrediction}
                    aria-label="Create new prediction"
                >
                    New Prediction
                </button>
            </header>

            {/* Stats Cards */}
            {stats && (
                <div className="stats-grid" data-testid="stats-cards">
                    <StatsCard
                        title="Total Predictions"
                        value={stats.total_predictions}
                        icon="chart"
                        trend={stats.predictions_this_month > 0 ? 'up' : 'neutral'}
                        data-testid="total-predictions"
                    />
                    <StatsCard
                        title="Active Alerts"
                        value={stats.total_alerts}
                        icon="bell"
                        trend="neutral"
                        data-testid="active-alerts"
                    />
                    <StatsCard
                        title="Avg Viral Score"
                        value={stats.avg_viral_score?.toFixed(1) || 'N/A'}
                        icon="trending"
                        trend={stats.avg_viral_score && stats.avg_viral_score > 70 ? 'up' : 'neutral'}
                    />
                    <StatsCard
                        title="Account Age"
                        value={`${stats.account_age_days} days`}
                        icon="calendar"
                        trend="neutral"
                    />
                </div>
            )}

            {/* Filter Bar */}
            <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onPlatformSelect={handlePlatformFilter}
            />

            {/* Trends Grid */}
            <div className="trends-section">
                <div className="section-header">
                    <h2>Trending Now</h2>
                    <button
                        className="btn-secondary"
                        onClick={refreshTrends}
                        aria-label="Refresh trends"
                    >
                        Refresh
                    </button>
                </div>

                {trends.length === 0 ? (
                    <div className="empty-state">
                        <p>No trends found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="trends-grid" data-testid="trends-list">
                        {trends.map((trend: Trend) => (
                            <TrendCard
                                key={trend.uuid}
                                trend={trend}
                                onClick={handleTrendClick}
                                showActions
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Prediction Modal */}
            {showPredictionModal && (
                <div className="modal-overlay" onClick={() => setShowPredictionModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Create AI Prediction</h2>
                        {/* PredictionForm component would go here */}
                        <button onClick={() => setShowPredictionModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainDashboard;
