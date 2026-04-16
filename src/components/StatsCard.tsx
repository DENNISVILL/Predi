/**
 * StatsCard Component
 * Display statistics in a card format
 */

import React from 'react';

export interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: string;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon = '📊',
    trend = 'neutral',
    className = '',
}) => {
    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    const trendClass = `trend-${trend}`;

    return (
        <div className={`stats-card ${className}`}>
            <div className="stats-card__header">
                <span className="stats-card__icon">{icon}</span>
                <h3 className="stats-card__title">{title}</h3>
            </div>
            <div className="stats-card__body">
                <p className="stats-card__value">{value}</p>
                <span className={`stats-card__trend ${trendClass}`}>
                    {trendIcon}
                </span>
            </div>
        </div>
    );
};
