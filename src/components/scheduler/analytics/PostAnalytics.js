/**
 * PostAnalytics
 * Análisis de métricas de posts programados
 */

/**
 * Calcula engagement rate de un post
 * @param {Object} post - Post a analizar
 * @returns {number} Engagement rate (0-1)
 */
export const getPostEngagementRate = (post) => {
    const interactions = (post.likes || 0) + (post.comments || 0) + (post.shares || 0) + (post.saves || 0);
    const reach = post.reach || post.estimatedReach || 0;
    if (!reach || reach <= 0) return 0;
    return interactions / reach;
};

/**
 * Calcula promedio seguro de valores
 * @param {Array} values - Valores a promediar
 * @returns {number} Promedio
 */
export const getSafeAverage = (values) => {
    const valid = values.filter(v => typeof v === 'number' && !isNaN(v));
    if (!valid.length) return 0;
    return valid.reduce((acc, v) => acc + v, 0) / valid.length;
};

/**
 * Calcula analytics completo del calendario
 * @param {Array} scheduledPosts - Posts programados
 * @returns {Object} Analytics
 */
export const getCalendarAnalytics = (scheduledPosts) => {
    if (!scheduledPosts || !scheduledPosts.length) {
        return {
            totalScheduled: 0,
            totalReach: 0,
            avgEngagementRate: 0,
            avgCtr: 0,
            followerGrowth: 0,
            successRate: 0,
            avgViralScore: 0,
            topPosts: []
        };
    }

    const totalScheduled = scheduledPosts.filter(p => p.status === 'scheduled' || p.status === 'pending').length;
    const totalReach = scheduledPosts.reduce((acc, post) => acc + (post.reach || post.estimatedReach || 0), 0);

    const engagementRates = scheduledPosts.map(getPostEngagementRate);
    const ctrValues = scheduledPosts.map(post => {
        const clicks = post.clicks || 0;
        const reach = post.reach || post.estimatedReach || 0;
        if (!reach || reach <= 0) return 0;
        return clicks / reach;
    });

    const followerGrowth = scheduledPosts.reduce((acc, post) => {
        if (typeof post.followersBefore === 'number' && typeof post.followersAfter === 'number') {
            return acc + (post.followersAfter - post.followersBefore);
        }
        return acc;
    }, 0);

    const published = scheduledPosts.filter(p => p.status === 'published').length;
    const successRate = scheduledPosts.length ? (published / scheduledPosts.length) * 100 : 0;

    const avgViralScore = getSafeAverage(scheduledPosts.map(p => p.viralScore || 0));

    // Top posts por engagement rate
    const topPosts = [...scheduledPosts]
        .map(post => ({ post, er: getPostEngagementRate(post) }))
        .sort((a, b) => b.er - a.er)
        .slice(0, 5)
        .map(item => item.post);

    return {
        totalScheduled,
        totalReach,
        avgEngagementRate: getSafeAverage(engagementRates) * 100,
        avgCtr: getSafeAverage(ctrValues) * 100,
        followerGrowth,
        successRate,
        avgViralScore,
        topPosts
    };
};

export default {
    getPostEngagementRate,
    getSafeAverage,
    getCalendarAnalytics
};
