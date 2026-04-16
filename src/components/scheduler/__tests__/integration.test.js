/**
 * ContentSchedulerModule Tests
 * Tests básicos para verificar funcionalidad
 */
import { describe, it, expect } from '@jest/globals';
import {
    getCountryFestivals,
    getUpcomingFestivals
} from '../festivals/CountryFestivalsManager';
import {
    optimizeSchedulingTime,
    generateOptimizedCalendar
} from '../optimizer/ScheduleOptimizer';
import { generateSmartHashtags } from '../hashtags/HashtagsData';
import { predictVirality } from '../virality/ViralityPredictor';
import { getCalendarAnalytics } from '../analytics/PostAnalytics';

describe('CountryFestivalsManager', () => {
    it('should return festivals for Mexico', () => {
        const festivals = getCountryFestivals('MX');
        expect(festivals).toBeDefined();
        expect(festivals.length).toBeGreaterThan(0);
        expect(festivals[0]).toHaveProperty('name');
        expect(festivals[0]).toHaveProperty('date');
        expect(festivals[0]).toHaveProperty('emoji');
    });

    it('should return upcoming festivals', () => {
        const date = new Date();
        const upcoming = getUpcomingFestivals(date, 'MX', 30);
        expect(Array.isArray(upcoming)).toBe(true);
    });
});

describe('ScheduleOptimizer', () => {
    it('should optimize scheduling time', () => {
        const result = optimizeSchedulingTime('tiktok', 'food', 'post');
        expect(result).toHaveProperty('hour');
        expect(result).toHaveProperty('confidence');
        expect(result).toHaveProperty('reason');
        expect(result.hour).toBeGreaterThanOrEqual(0);
        expect(result.hour).toBeLessThan(24);
    });

    it('should generate optimized calendar', () => {
        const calendar = generateOptimizedCalendar(7);
        expect(Array.isArray(calendar)).toBe(true);
        expect(calendar.length).toBeGreaterThan(0);
        expect(calendar[0]).toHaveProperty('platform');
        expect(calendar[0]).toHaveProperty('date');
    });
});

describe('HashtagsData', () => {
    it('should generate smart hashtags', () => {
        const hashtags = generateSmartHashtags('food', 'tiktok', 'mexico');
        expect(Array.isArray(hashtags)).toBe(true);
        expect(hashtags.length).toBeGreaterThan(0);
        expect(hashtags[0]).toHaveProperty('tag');
        expect(hashtags[0]).toHaveProperty('score');
        expect(hashtags[0]).toHaveProperty('rank');
    });
});

describe('ViralityPredictor', () => {
    it('should predict virality', () => {
        const prediction = predictVirality({
            content: 'Test content with emojis 🔥 and call to action!',
            hashtags: ['#test', '#viral'],
            platform: 'tiktok',
            niche: 'food',
            scheduledTime: new Date(),
            mediaType: 'video'
        });

        expect(prediction).toHaveProperty('score');
        expect(prediction).toHaveProperty('confidence');
        expect(prediction).toHaveProperty('factors');
        expect(prediction.score).toBeGreaterThanOrEqual(0);
        expect(prediction.score).toBeLessThanOrEqual(100);
    });
});

describe('PostAnalytics', () => {
    it('should calculate calendar analytics', () => {
        const posts = [
            {
                id: '1',
                status: 'scheduled',
                reach: 10000,
                likes: 800,
                comments: 50,
                shares: 30,
                saves: 20,
                viralScore: 85
            },
            {
                id: '2',
                status: 'published',
                reach: 15000,
                likes: 1200,
                comments: 80,
                shares: 60,
                saves: 40,
                viralScore: 90
            }
        ];

        const analytics = getCalendarAnalytics(posts);
        expect(analytics).toHaveProperty('totalScheduled');
        expect(analytics).toHaveProperty('totalReach');
        expect(analytics).toHaveProperty('avgEngagementRate');
        expect(analytics).toHaveProperty('avgViralScore');
        expect(analytics.totalReach).toBe(25000);
    });
});

describe('Integration Tests', () => {
    it('should work together: optimize + predict + analyze', () => {
        // 1. Optimize scheduling
        const optimization = optimizeSchedulingTime('tiktok', 'food', 'post');
        expect(optimization.hour).toBeDefined();

        // 2. Generate hashtags
        const hashtags = generateSmartHashtags('food', 'tiktok');
        expect(hashtags.length).toBeGreaterThan(0);

        // 3. Predict virality
        const prediction = predictVirality({
            content: 'Delicious recipe! 🍽️ Try it now!',
            hashtags: hashtags.slice(0, 5).map(h => h.tag),
            platform: 'tiktok',
            niche: 'food',
            scheduledTime: new Date(),
            mediaType: 'video'
        });
        expect(prediction.score).toBeGreaterThan(0);

        // 4. Create post and analyze
        const post = {
            id: 'test',
            status: 'scheduled',
            reach: prediction.prediction.reach.estimated,
            viralScore: prediction.score
        };
        const analytics = getCalendarAnalytics([post]);
        expect(analytics.avgViralScore).toBe(prediction.score);
    });
});
