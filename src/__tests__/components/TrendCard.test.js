/**
 * Comprehensive Tests for TrendCard Component
 * Tests rendering, interactions, and visual states
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TrendCard from '../../components/TrendCard';

// Mock data
const mockTrend = {
    id: 1,
    uuid: 'trend-123',
    platform: 'tiktok',
    content_type: 'video',
    name: '#TestTrend',
    description: 'This is a test trend',
    views: 1500000,
    likes: 75000,
    shares: 15000,
    comments: 5000,
    engagement_rate: 6.33,
    growth_rate_24h: 25.5,
    growth_rate_7d: 150.0,
    viral_score: 85.5,
    confidence: 0.92,
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T12:00:00Z',
};

// Helper to render with router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('TrendCard Component', () => {
    // ============================================
    // Rendering Tests
    // ============================================

    test('renders trend card with all basic information', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        expect(screen.getByText('#TestTrend')).toBeInTheDocument();
        expect(screen.getByText(/1.5M views/i)).toBeInTheDocument();
        expect(screen.getByText(/85.5/)).toBeInTheDocument(); // Viral score
    });

    test('renders platform badge correctly', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        const platformBadge = screen.getByText(/tiktok/i);
        expect(platformBadge).toBeInTheDocument();
        expect(platformBadge).toHaveClass('platform-badge');
    });

    test('renders viral score with correct color coding', () => {
        const { rerender } = renderWithRouter(<TrendCard trend={mockTrend} />);

        // High viral score (green)
        let scoreElement = screen.getByText(/85.5/);
        expect(scoreElement).toHaveClass('viral-score');
        expect(scoreElement.className).toMatch(/high|success|green/i);

        // Medium viral score (yellow/orange)
        const mediumTrend = { ...mockTrend, viral_score: 65.0 };
        rerender(
            <BrowserRouter>
                <TrendCard trend={mediumTrend} />
            </BrowserRouter>
        );
        scoreElement = screen.getByText(/65.0/);
        expect(scoreElement.className).toMatch(/medium|warning|yellow/i);

        // Low viral score (red)
        const lowTrend = { ...mockTrend, viral_score: 35.0 };
        rerender(
            <BrowserRouter>
                <TrendCard trend={lowTrend} />
            </BrowserRouter>
        );
        scoreElement = screen.getByText(/35.0/);
        expect(scoreElement.className).toMatch(/low|danger|red/i);
    });

    test('renders engagement metrics correctly', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        expect(screen.getByText(/75K/i)).toBeInTheDocument(); // Likes
        expect(screen.getByText(/15K/i)).toBeInTheDocument(); // Shares
        expect(screen.getByText(/5K/i)).toBeInTheDocument(); // Comments
    });

    test('renders growth rate indicator', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        const growthElement = screen.getByText(/25.5%/i);
        expect(growthElement).toBeInTheDocument();
        expect(growthElement.closest('div')).toHaveClass(/growth/i);
    });

    test('renders confidence indicator', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        // Confidence shown as percentage
        expect(screen.getByText(/92%/i)).toBeInTheDocument();
    });

    test('renders description when provided', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        expect(screen.getByText('This is a test trend')).toBeInTheDocument();
    });

    test('does not render description when not provided', () => {
        const trendWithoutDesc = { ...mockTrend, description: null };
        renderWithRouter(<TrendCard trend={trendWithoutDesc} />);

        expect(screen.queryByText('This is a test trend')).not.toBeInTheDocument();
    });

    // ============================================
    // Interaction Tests
    // ============================================

    test('calls onClick handler when card is clicked', async () => {
        const handleClick = jest.fn();
        renderWithRouter(<TrendCard trend={mockTrend} onClick={handleClick} />);

        const card = screen.getByRole('article');
        await userEvent.click(card);

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith(mockTrend);
    });

    test('navigates to trend details on click when onClick not provided', async () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        const card = screen.getByRole('article');
        const link = card.querySelector('a');

        expect(link).toHaveAttribute('href', `/trends/${mockTrend.uuid}`);
    });

    test('does not navigate when onClick is provided', async () => {
        const handleClick = jest.fn();
        renderWithRouter(<TrendCard trend={mockTrend} onClick={handleClick} />);

        const card = screen.getByRole('article');
        await userEvent.click(card);

        expect(handleClick).toHaveBeenCalled();
    });

    test('shows hover effects on mouse enter', async () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        const card = screen.getByRole('article');

        fireEvent.mouseEnter(card);
        await waitFor(() => {
            expect(card).toHaveClass(/hover|elevated|shadow/i);
        });
    });

    test('removes hover effects on mouse leave', async () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        const card = screen.getByRole('article');

        fireEvent.mouseEnter(card);
        fireEvent.mouseLeave(card);

        await waitFor(() => {
            expect(card).not.toHaveClass(/hover|elevated/i);
        });
    });

    // ============================================
    // Action Buttons Tests
    // ============================================

    test('renders action buttons when showActions is true', () => {
        renderWithRouter(<TrendCard trend={mockTrend} showActions />);

        expect(screen.getByLabelText(/favorite|save/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/share/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/analyze|predict/i)).toBeInTheDocument();
    });

    test('does not render action buttons when showActions is false', () => {
        renderWithRouter(<TrendCard trend={mockTrend} showActions={false} />);

        expect(screen.queryByLabelText(/favorite/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/share/i)).not.toBeInTheDocument();
    });

    test('calls onFavorite when favorite button clicked', async () => {
        const handleFavorite = jest.fn();
        renderWithRouter(
            <TrendCard trend={mockTrend} showActions onFavorite={handleFavorite} />
        );

        const favoriteBtn = screen.getByLabelText(/favorite/i);
        await userEvent.click(favoriteBtn);

        expect(handleFavorite).toHaveBeenCalledWith(mockTrend);
    });

    test('calls onShare when share button clicked', async () => {
        const handleShare = jest.fn();
        renderWithRouter(
            <TrendCard trend={mockTrend} showActions onShare={handleShare} />
        );

        const shareBtn = screen.getByLabelText(/share/i);
        await userEvent.click(shareBtn);

        expect(handleShare).toHaveBeenCalledWith(mockTrend);
    });

    test('calls onAnalyze when analyze button clicked', async () => {
        const handleAnalyze = jest.fn();
        renderWithRouter(
            <TrendCard trend={mockTrend} showActions onAnalyze={handleAnalyze} />
        );

        const analyzeBtn = screen.getByLabelText(/analyze|predict/i);
        await userEvent.click(analyzeBtn);

        expect(handleAnalyze).toHaveBeenCalledWith(mockTrend);
    });

    test('action buttons do not trigger card onClick', async () => {
        const handleClick = jest.fn();
        const handleFavorite = jest.fn();

        renderWithRouter(
            <TrendCard
                trend={mockTrend}
                onClick={handleClick}
                showActions
                onFavorite={handleFavorite}
            />
        );

        const favoriteBtn = screen.getByLabelText(/favorite/i);
        await userEvent.click(favoriteBtn);

        expect(handleFavorite).toHaveBeenCalled();
        expect(handleClick).not.toHaveBeenCalled();
    });

    // ============================================
    // Visual State Tests
    // ============================================

    test('shows inactive state when trend is not active', () => {
        const inactiveTrend = { ...mockTrend, is_active: false };
        renderWithRouter(<TrendCard trend={inactiveTrend} />);

        const card = screen.getByRole('article');
        expect(card).toHaveClass(/inactive|disabled|faded/i);
    });

    test('shows featured badge for high viral score', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        // Viral score > 80 should show featured badge
        expect(screen.getByText(/featured|trending|hot/i)).toBeInTheDocument();
    });

    test('shows new badge for recent trends', () => {
        const recentTrend = {
            ...mockTrend,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        };

        renderWithRouter(<TrendCard trend={recentTrend} />);

        expect(screen.getByText(/new/i)).toBeInTheDocument();
    });

    test('shows rising indicator for positive growth', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        // Growth rate > 0 should show rising indicator
        const growthElement = screen.getByText(/25.5%/i).closest('div');
        expect(growthElement).toContainHTML(/up|rising|increase/i);
    });

    test('shows falling indicator for negative growth', () => {
        const decliningTrend = { ...mockTrend, growth_rate_24h: -15.5 };
        renderWithRouter(<TrendCard trend={decliningTrend} />);

        const growthElement = screen.getByText(/15.5%/i).closest('div');
        expect(growthElement).toContainHTML(/down|falling|decrease/i);
    });

    // ============================================
    // Responsive Design Tests
    // ============================================

    test('renders compact version on small screens', () => {
        // Mock window.matchMedia for mobile
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: query === '(max-width: 768px)',
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });

        renderWithRouter(<TrendCard trend={mockTrend} compact />);

        const card = screen.getByRole('article');
        expect(card).toHaveClass(/compact|small/i);
    });

    // ============================================
    // Accessibility Tests
    // ============================================

    test('has proper ARIA attributes', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        const card = screen.getByRole('article');
        expect(card).toHaveAttribute('aria-label');
        expect(card.getAttribute('aria-label')).toContain('#TestTrend');
    });

    test('has keyboard navigation support', async () => {
        const handleClick = jest.fn();
        renderWithRouter(<TrendCard trend={mockTrend} onClick={handleClick} />);

        const card = screen.getByRole('article');
        card.focus();

        fireEvent.keyDown(card, { key: 'Enter' });
        await waitFor(() => {
            expect(handleClick).toHaveBeenCalled();
        });
    });

    test('has proper tab index for keyboard navigation', () => {
        renderWithRouter(<TrendCard trend={mockTrend} />);

        const card = screen.getByRole('article');
        expect(card).toHaveAttribute('tabindex', '0');
    });

    // ============================================
    // Loading State Tests
    // ============================================

    test('renders skeleton loader when loading', () => {
        renderWithRouter(<TrendCard loading />);

        expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
        expect(screen.queryByText('#TestTrend')).not.toBeInTheDocument();
    });

    // ============================================
    // Error Handling Tests
    // ============================================

    test('handles missing trend data gracefully', () => {
        const incompleteTrend = {
            id: 1,
            uuid: 'trend-incomplete',
            platform: 'tiktok',
            name: '#Incomplete',
            viral_score: 50,
            confidence: 0.5,
        };

        expect(() => {
            renderWithRouter(<TrendCard trend={incompleteTrend} />);
        }).not.toThrow();
    });

    test('shows fallback values for missing metrics', () => {
        const incompleteTrend = {
            ...mockTrend,
            views: null,
            likes: null,
        };

        renderWithRouter(<TrendCard trend={incompleteTrend} />);

        // Should show 0 or N/A instead of crashing
        expect(screen.getByText(/N\/A|0/)).toBeInTheDocument();
    });

    // ============================================
    // Formatting Tests
    // ============================================

    test('formats large numbers correctly', () => {
        const trendWithLargeNumbers = {
            ...mockTrend,
            views: 1500000,
            likes: 75000,
            shares: 15000,
        };

        renderWithRouter(<TrendCard trend={trendWithLargeNumbers} />);

        expect(screen.getByText(/1.5M/i)).toBeInTheDocument(); // Views
        expect(screen.getByText(/75K/i)).toBeInTheDocument(); // Likes
        expect(screen.getByText(/15K/i)).toBeInTheDocument(); // Shares
    });

    test('formats dates correctly', () => {
        renderWithRouter(<TrendCard trend={mockTrend} showTimestamp />);

        // Should show relative time or formatted date
        expect(screen.getByText(/ago|today|yesterday/i)).toBeInTheDocument();
    });

    // ============================================
    // Custom Styling Tests
    // ============================================

    test('applies custom className', () => {
        renderWithRouter(<TrendCard trend={mockTrend} className="custom-class" />);

        const card = screen.getByRole('article');
        expect(card).toHaveClass('custom-class');
    });

    test('applies custom style prop', () => {
        const customStyle = { backgroundColor: 'red' };
        renderWithRouter(<TrendCard trend={mockTrend} style={customStyle} />);

        const card = screen.getByRole('article');
        expect(card).toHaveStyle('background-color: red');
    });
});
