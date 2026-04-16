/**
 * TrendCard Component - TypeScript
 * Displays trend information with interactive features
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Trend } from '../types';
import { formatNumber, formatRelativeTime, getPlatformIcon } from '../utils/formatters';

interface TrendCardProps {
    trend: Trend;
    onClick?: (trend: Trend) => void;
    onFavorite?: (trend: Trend) => void;
    onShare?: (trend: Trend) => void;
    onAnalyze?: (trend: Trend) => void;
    showActions?: boolean;
    showTimestamp?: boolean;
    compact?: boolean;
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
}

export const TrendCard: React.FC<TrendCardProps> = ({
    trend,
    onClick,
    onFavorite,
    onShare,
    onAnalyze,
    showActions = false,
    showTimestamp = false,
    compact = false,
    className = '',
    style,
    loading = false,
}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    // Calculate viral score color
    const viralScoreColor = useMemo(() => {
        if (trend.viral_score >= 80) return 'success';
        if (trend.viral_score >= 60) return 'warning';
        return 'danger';
    }, [trend.viral_score]);

    // Check if trend is new (within last 3 hours)
    const isNew = useMemo(() => {
        const createdAt = new Date(trend.created_at);
        const now = new Date();
        const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        return diffHours < 3;
    }, [trend.created_at]);

    // Check if trend is featured (high viral score)
    const isFeatured = useMemo(() => trend.viral_score >= 80, [trend.viral_score]);

    // Handle card click
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (onClick) {
            onClick(trend);
        } else {
            navigate(`/trends/${trend.uuid}`);
        }
    }, [onClick, trend, navigate]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as any);
        }
    }, [handleClick]);

    // Handle favorite click
    const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
        onFavorite?.(trend);
    }, [isFavorited, onFavorite, trend]);

    // Handle share click
    const handleShareClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onShare?.(trend);
    }, [onShare, trend]);

    // Handle analyze click
    const handleAnalyzeClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onAnalyze?.(trend);
    }, [onAnalyze, trend]);

    // Loading skeleton
    if (loading) {
        return (
            <div className="trend-card skeleton" data-testid="skeleton-loader">
                <div className="skeleton-header" />
                <div className="skeleton-content" />
                <div className="skeleton-footer" />
            </div>
        );
    }

    return (
        <article
            className={`
        trend-card
        ${compact ? 'trend-card--compact' : ''}
        ${!trend.is_active ? 'trend-card--inactive' : ''}
        ${isHovered ? 'trend-card--hovered' : ''}
        ${className}
      `}
            style={style}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
            tabIndex={0}
            aria-label={`Trend: ${trend.name}, Viral score: ${trend.viral_score}`}
        >
            {/* Header */}
            <div className="trend-card__header">
                {/* Platform Badge */}
                <span className={`platform-badge platform-badge--${trend.platform}`}>
                    {getPlatformIcon(trend.platform)}
                    {!compact && <span className="platform-badge__text">{trend.platform}</span>}
                </span>

                {/* Badges */}
                <div className="trend-card__badges">
                    {isNew && <span className="badge badge--new">New</span>}
                    {isFeatured && <span className="badge badge--featured">Featured</span>}
                </div>
            </div>

            {/* Content */}
            <div className="trend-card__content">
                {/* Trend Name */}
                <h3 className="trend-card__title">{trend.name}</h3>

                {/* Description */}
                {trend.description && !compact && (
                    <p className="trend-card__description">{trend.description}</p>
                )}

                {/* Metrics */}
                <div className="trend-card__metrics">
                    <div className="metric">
                        <span className="metric__icon">👁️</span>
                        <span className="metric__value">{formatNumber(trend.views)}</span>
                        <span className="metric__label">views</span>
                    </div>

                    <div className="metric">
                        <span className="metric__icon">❤️</span>
                        <span className="metric__value">{formatNumber(trend.likes)}</span>
                        <span className="metric__label">likes</span>
                    </div>

                    {!compact && (
                        <>
                            <div className="metric">
                                <span className="metric__icon">💬</span>
                                <span className="metric__value">{formatNumber(trend.comments)}</span>
                                <span className="metric__label">comments</span>
                            </div>

                            <div className="metric">
                                <span className="metric__icon">🔄</span>
                                <span className="metric__value">{formatNumber(trend.shares)}</span>
                                <span className="metric__label">shares</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="trend-card__footer">
                {/* Viral Score */}
                <div className={`viral-score viral-score--${viralScoreColor}`}>
                    <span className="viral-score__label">Viral Score</span>
                    <span className="viral-score__value">{trend.viral_score.toFixed(1)}</span>
                </div>

                {/* Growth Rate */}
                <div className={`growth-rate ${trend.growth_rate_24h > 0 ? 'growth-rate--up' : 'growth-rate--down'}`}>
                    <span className="growth-rate__icon">
                        {trend.growth_rate_24h > 0 ? '📈' : '📉'}
                    </span>
                    <span className="growth-rate__value">
                        {Math.abs(trend.growth_rate_24h).toFixed(1)}%
                    </span>
                </div>

                {/* Confidence */}
                {!compact && (
                    <div className="confidence">
                        <span className="confidence__label">Confidence</span>
                        <span className="confidence__value">{(trend.confidence * 100).toFixed(0)}%</span>
                    </div>
                )}

                {/* Timestamp */}
                {showTimestamp && (
                    <div className="timestamp">
                        {formatRelativeTime(trend.created_at)}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {showActions && (
                <div className="trend-card__actions">
                    <button
                        className={`action-btn ${isFavorited ? 'action-btn--active' : ''}`}
                        onClick={handleFavoriteClick}
                        aria-label="Favorite trend"
                        title="Save to favorites"
                    >
                        {isFavorited ? '⭐' : '☆'}
                    </button>

                    <button
                        className="action-btn"
                        onClick={handleShareClick}
                        aria-label="Share trend"
                        title="Share this trend"
                    >
                        📤
                    </button>

                    <button
                        className="action-btn action-btn--primary"
                        onClick={handleAnalyzeClick}
                        aria-label="Analyze trend"
                        title="AI Analysis"
                    >
                        🎯
                    </button>
                </div>
            )}
        </article>
    );
};

export default TrendCard;
