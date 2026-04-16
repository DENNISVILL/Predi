/**
 * FilterBar Component
 * Filter controls for trends and content
 */

import React from 'react';
import type { Platform, TrendFilters } from '../types';

export interface FilterBarProps {
    filters: TrendFilters;
    onFilterChange: (filters: Partial<TrendFilters>) => void;
    onPlatformSelect?: (platform: Platform | null) => void;
    className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    filters,
    onFilterChange,
    className = '',
}) => {
    return (
        <div className={`filter-bar ${className}`}>
            <div className="filter-bar__group">
                <label htmlFor="platform-filter">Platform:</label>
                <select
                    id="platform-filter"
                    value={filters.platform || ''}
                    onChange={(e) => onFilterChange({ platform: e.target.value as Platform | undefined })}
                >
                    <option value="">All Platforms</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                </select>
            </div>

            <div className="filter-bar__group">
                <label htmlFor="search-filter">Search:</label>
                <input
                    id="search-filter"
                    type="text"
                    value={filters.search || ''}
                    onChange={(e) => onFilterChange({ search: e.target.value })}
                    placeholder="Search trends..."
                />
            </div>

            <div className="filter-bar__group">
                <label htmlFor="sort-filter">Sort by:</label>
                <select
                    id="sort-filter"
                    value={filters.sortBy || 'viral_score'}
                    onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                >
                    <option value="viral_score">Viral Score</option>
                    <option value="views">Views</option>
                    <option value="created_at">Date</option>
                </select>
            </div>
        </div>
    );
};
