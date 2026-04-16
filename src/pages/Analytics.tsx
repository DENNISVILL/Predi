/**
 * Analytics Page - TypeScript
 * User analytics and statistics dashboard
 */

import React, { useState, useEffect } from 'react';
import apiService from '../services/apiConfig';
import type { UserStats, AnalyticsData } from '../types';

export const Analytics: React.FC = () => {
    // const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

    useEffect(() => {
        const loadAnalytics = async () => {
            setLoading(true);
            try {
                const [statsData, analyticsData] = await Promise.all([
                    apiService.get<UserStats>('/users/stats'),
                    apiService.get<AnalyticsData>(`/analytics?range=${dateRange}`),
                ]);
                setStats(statsData);
                setAnalytics(analyticsData);
            } catch (error) {
                console.error('Failed to load analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, [dateRange]);

    if (loading) {
        return <div className="analytics__loading"><div className="spinner" /></div>;
    }

    return (
        <div className="analytics">
            <header className="analytics__header">
                <h1>Analytics Dashboard</h1>
                <select
                    className="form-select"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                </select>
            </header>

            {stats && (
                <div className="analytics__stats">
                    <div className="stat-card">
                        <h3>Total Predictions</h3>
                        <p className="stat-value">{stats.total_predictions}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Avg Viral Score</h3>
                        <p className="stat-value">{stats.avg_viral_score.toFixed(1)}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Alerts</h3>
                        <p className="stat-value">{stats.total_alerts}</p>
                    </div>
                </div>
            )}

            {analytics && (
                <div className="analytics__charts">
                    <div className="chart-container">
                        <h2>Predictions Over Time</h2>
                        {/* Chart component would go here */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
