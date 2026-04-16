/**
 * Export Utilities - CSV and JSON export functionality
 */

import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export const exportToCSV = (data, filename = 'radar-trends') => {
    try {
        // Flatten the data for CSV
        const flattenedData = data.map(trend => ({
            'Hashtag': trend.hashtag,
            'Plataforma': trend.platform,
            'País': trend.country,
            'Menciones': trend.mentions,
            'Crecimiento (%)': trend.growth,
            'Engagement (%)': trend.engagement,
            'Velocidad': trend.velocity,
            'Score Viral': trend.viralityScore || 0,
            'Tipo': trend.contentType,
            'Detectado': trend.detectedAt ? new Date(trend.detectedAt).toLocaleString('es-ES') : 'N/A'
        }));

        const csv = Papa.unparse(flattenedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}-${Date.now()}.csv`);

        return { success: true, message: 'CSV exportado correctamente' };
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        return { success: false, message: 'Error al exportar CSV' };
    }
};

export const exportToJSON = (data, filename = 'radar-trends') => {
    try {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        saveAs(blob, `${filename}-${Date.now()}.json`);

        return { success: true, message: 'JSON exportado correctamente' };
    } catch (error) {
        console.error('Error exporting to JSON:', error);
        return { success: false, message: 'Error al exportar JSON' };
    }
};

export const exportHashtagPerformance = (performanceData, filename = 'hashtag-performance') => {
    try {
        const flattenedData = performanceData.map(item => ({
            'Hashtag': item.tag,
            'Posts': item.posts,
            'Alcance Total': item.totalReach,
            'Engagement Total': item.totalEngagement,
            'Alcance Promedio': Math.round(item.totalReach / item.posts),
            'Engagement Promedio': Math.round(item.totalEngagement / item.posts),
            'Plataformas': Array.from(item.platforms || []).join(', '),
            'Países': Array.from(item.countries || []).join(', ')
        }));

        const csv = Papa.unparse(flattenedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}-${Date.now()}.csv`);

        return { success: true, message: 'Performance exportado correctamente' };
    } catch (error) {
        console.error('Error exporting performance:', error);
        return { success: false, message: 'Error al exportar performance' };
    }
};

export const generateReport = (trends, metrics) => {
    const report = {
        generatedAt: new Date().toISOString(),
        summary: {
            totalTrends: trends.length,
            averageGrowth: metrics.avgGrowth,
            totalMentions: metrics.totalMentions,
            activeCountries: metrics.activeCountries,
            topPlatform: getTopPlatform(trends)
        },
        trends: trends,
        topTrends: trends.slice(0, 10),
        platformBreakdown: getPlatformBreakdown(trends),
        countryBreakdown: getCountryBreakdown(trends)
    };

    return report;
};

const getTopPlatform = (trends) => {
    const platformCounts = {};
    trends.forEach(t => {
        platformCounts[t.platform] = (platformCounts[t.platform] || 0) + 1;
    });
    return Object.keys(platformCounts).reduce((a, b) =>
        platformCounts[a] > platformCounts[b] ? a : b
    );
};

const getPlatformBreakdown = (trends) => {
    const breakdown = {};
    trends.forEach(t => {
        if (!breakdown[t.platform]) {
            breakdown[t.platform] = {
                count: 0,
                totalGrowth: 0,
                totalEngagement: 0
            };
        }
        breakdown[t.platform].count++;
        breakdown[t.platform].totalGrowth += t.growth;
        breakdown[t.platform].totalEngagement += t.engagement;
    });

    Object.keys(breakdown).forEach(platform => {
        breakdown[platform].avgGrowth = Math.round(breakdown[platform].totalGrowth / breakdown[platform].count);
        breakdown[platform].avgEngagement = Math.round(breakdown[platform].totalEngagement / breakdown[platform].count);
    });

    return breakdown;
};

const getCountryBreakdown = (trends) => {
    const breakdown = {};
    trends.forEach(t => {
        if (!breakdown[t.country]) {
            breakdown[t.country] = { count: 0, totalGrowth: 0 };
        }
        breakdown[t.country].count++;
        breakdown[t.country].totalGrowth += t.growth;
    });

    Object.keys(breakdown).forEach(country => {
        breakdown[country].avgGrowth = Math.round(breakdown[country].totalGrowth / breakdown[country].count);
    });

    return breakdown;
};
