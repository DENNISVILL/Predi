/**
 * Explore Page - TypeScript
 * Browse and filter trends across platforms
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrends } from '../hooks';
import { TrendCard } from '../components/TrendCard';
import { Platform } from '../types';
import type { Trend, TrendFilters } from '../types';

const PLATFORMS: Platform[] = [Platform.TIKTOK, Platform.TWITTER, Platform.INSTAGRAM, Platform.YOUTUBE];

export const Explore: React.FC = () => {
    const navigate = useNavigate();
    const { trends, loading, error, setFilters, loadMore, hasMore } = useTrends();

    const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [minViralScore, setMinViralScore] = useState<number>(0);

    // Apply filters
    const applyFilters = useCallback(() => {
        const newFilters: TrendFilters = {};

        if (selectedPlatform !== 'all') {
            newFilters.platform = selectedPlatform;
        }

        if (searchQuery) {
            newFilters.search = searchQuery;
        }

        if (minViralScore > 0) {
            newFilters.minViralScore = minViralScore;
        }

        setFilters(newFilters);
    }, [selectedPlatform, searchQuery, minViralScore, setFilters]);

    // Handle trend click
    const handleTrendClick = useCallback((trend: Trend) => {
        navigate(`/trends/${trend.uuid}`);
    }, [navigate]);

    // Handle analyze
    const handleAnalyze = useCallback((trend: Trend) => {
        navigate(`/predictions/new?trend=${trend.uuid}`);
    }, [navigate]);

    return (
        <div className="explore">
            <header className="explore__header">
                <h1>Explore Trends</h1>
                <p>Discover what's trending across all platforms</p>
            </header>

            {/* Filters */}
            <div className="explore__filters">
                <div className="filter-group">
                    <label>Platform</label>
                    <div className="platform-tabs">
                        <button
                            className={`platform-tab ${selectedPlatform === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedPlatform('all')}
                        >
                            All
                        </button>
                        {PLATFORMS.map(platform => (
                            <button
                                key={platform}
                                className={`platform-tab ${selectedPlatform === platform ? 'active' : ''}`}
                                onClick={() => setSelectedPlatform(platform)}
                            >
                                {platform}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label htmlFor="search">Search</label>
                    <input
                        id="search"
                        type="text"
                        className="form-input"
                        placeholder="Search trends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="viral-score">Min Viral Score: {minViralScore}</label>
                    <input
                        id="viral-score"
                        type="range"
                        min="0"
                        max="100"
                        value={minViralScore}
                        onChange={(e) => setMinViralScore(parseInt(e.target.value))}
                    />
                </div>

                <button className="btn btn--primary" onClick={applyFilters}>
                    Apply Filters
                </button>
            </div>

            {/* Results */}
            {error && (
                <div className="alert alert--error">{error}</div>
            )}

            {loading && trends.length === 0 ? (
                <div className="explore__loading">
                    <div className="spinner" />
                    <p>Loading trends...</p>
                </div>
            ) : (
                <>
                    <div className="explore__results">
                        <p className="results-count">{trends.length} trends found</p>
                    </div>

                    <div className="trends-grid">
                        {trends.map(trend => (
                            <TrendCard
                                key={trend.uuid}
                                trend={trend}
                                onClick={handleTrendClick}
                                onAnalyze={handleAnalyze}
                                showActions
                                showTimestamp
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="explore__load-more">
                            <button
                                className="btn btn--secondary"
                                onClick={loadMore}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Explore;
