/**
 * Main Dashboard Component Tests
 * Comprehensive test suite for dashboard functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import MainDashboard from '../../components/MainDashboard';

// Mock dependencies
jest.mock('../../services/apiConfig', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

jest.mock('../../hooks/useTrends', () => ({
    __esModule: true,
    default: () => ({
        trends: mockTrends,
        loading: false,
        error: null,
        refreshTrends: jest.fn(),
    }),
}));

const mockTrends = [
    {
        id: 1,
        name: '#TestTrend1',
        platform: 'tiktok',
        viral_score: 85.5,
        views: 1000000,
        growth_rate_24h: 0.45,
    },
    {
        id: 2,
        name: '#TestTrend2',
        platform: 'twitter',
        viral_score: 72.3,
        views: 500000,
        growth_rate_24h: 0.32,
    },
];

describe('MainDashboard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render dashboard title', () => {
            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        });

        it('should render navigation menu', () => {
            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            expect(screen.getByText(/Explore/i)).toBeInTheDocument();
            expect(screen.getByText(/Analytics/i)).toBeInTheDocument();
            expect(screen.getByText(/Settings/i)).toBeInTheDocument();
        });

        it('should render stats cards', () => {
            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            // Check for stat cards
            expect(screen.getByText(/Total Predictions/i)).toBeInTheDocument();
            expect(screen.getByText(/Active Alerts/i)).toBeInTheDocument();
        });
    });

    describe('Trends Display', () => {
        it('should display trends list', async () => {
            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('#TestTrend1')).toBeInTheDocument();
                expect(screen.getByText('#TestTrend2')).toBeInTheDocument();
            });
        });

        it('should show viral scores', async () => {
            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByText(/85\.5/)).toBeInTheDocument();
                expect(screen.getByText(/72\.3/)).toBeInTheDocument();
            });
        });

        it('should filter trends by platform', async () => {
            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            // Click TikTok filter
            const tiktokFilter = screen.getByRole('button', { name: /TikTok/i });
            fireEvent.click(tiktokFilter);

            await waitFor(() => {
                expect(screen.getByText('#TestTrend1')).toBeInTheDocument();
                expect(screen.queryByText('#TestTrend2')).not.toBeInTheDocument();
            });
        });
    });

    describe('User Interactions', () => {
        it('should handle refresh button click', async () => {
            const mockRefresh = jest.fn();

            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            const refreshButton = screen.getByRole('button', { name: /Refresh/i });
            fireEvent.click(refreshButton);

            // Should trigger refresh
            await waitFor(() => {
                expect(mockRefresh).toHaveBeenCalled();
            });
        });

        it('should navigate to trend details on click', async () => {
            const { container } = render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            await waitFor(() => {
                const trendCard = screen.getByText('#TestTrend1').closest('div[role="button"]');
                fireEvent.click(trendCard);
            });

            // Should navigate (check URL or modal open)
        });

        it('should open prediction modal', async () => {
            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            const predictButton = screen.getByRole('button', { name: /New Prediction/i });
            fireEvent.click(predictButton);

            await waitFor(() => {
                expect(screen.getByText(/AI Prediction/i)).toBeInTheDocument();
            });
        });
    });

    describe('Loading States', () => {
        it('should show loading skeleton', () => {
            // Mock loading state
            jest.mock('../../hooks/useTrends', () => ({
                __esModule: true,
                default: () => ({
                    trends: [],
                    loading: true,
                    error: null,
                }),
            }));

            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('should display error message', () => {
            // Mock error state
            jest.mock('../../hooks/useTrends', () => ({
                __esModule: true,
                default: () => ({
                    trends: [],
                    loading: false,
                    error: 'Failed to load trends',
                }),
            }));

            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
        });
    });

    describe('Responsive Design', () => {
        it('should adapt to mobile viewport', () => {
            // Set mobile viewport
            global.innerWidth = 375;
            global.innerHeight = 667;

            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            // Check mobile-specific elements
            expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
        });
    });

    describe('Real-time Updates', () => {
        it('should update trends when WebSocket message received', async () => {
            // Mock WebSocket
            const mockWebSocket = {
                addEventListener: jest.fn(),
                send: jest.fn(),
            };

            global.WebSocket = jest.fn(() => mockWebSocket);

            render(
                <MemoryRouter>
                    <MainDashboard />
                </MemoryRouter>
            );

            // Simulate WebSocket message
            const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
                call => call[0] === 'message'
            )[1];

            messageHandler({
                data: JSON.stringify({
                    type: 'trend_update',
                    trend: {
                        id: 3,
                        name: '#NewTrend',
                        viral_score: 95.0,
                    },
                }),
            });

            await waitFor(() => {
                expect(screen.getByText('#NewTrend')).toBeInTheDocument();
            });
        });
    });
});
