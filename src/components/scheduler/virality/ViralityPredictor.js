/**
 * Virality Predictor
 * Predice el potencial viral de un post antes de programarlo
 */

/**
 * Analiza factores de contenido
 * @param {string} content - Contenido del post
 * @returns {Object} Análisis de contenido
 */
export const analyzeContentFactors = (content) => {
    const length = content.length;
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(content);
    const hasQuestion = content.includes('?');
    const hasCallToAction = /\b(comenta|comparte|sigue|like|tag|menciona)\b/i.test(content);
    const hasNumbers = /\d/.test(content);
    const hasHook = content.split(' ').slice(0, 5).some(word =>
        ['secreto', 'increíble', 'viral', 'trending', 'nuevo', 'exclusivo'].includes(word.toLowerCase())
    );

    let score = 50; // Base score

    if (length >= 50 && length <= 150) score += 15;
    if (hasEmojis) score += 10;
    if (hasQuestion) score += 8;
    if (hasCallToAction) score += 12;
    if (hasNumbers) score += 5;
    if (hasHook) score += 15;

    return {
        score: Math.min(score, 100),
        details: {
            length: { value: length, optimal: length >= 50 && length <= 150 },
            emojis: hasEmojis,
            question: hasQuestion,
            callToAction: hasCallToAction,
            numbers: hasNumbers,
            hook: hasHook
        }
    };
};

/**
 * Analiza factores de hashtags
 * @param {Array} hashtags - Hashtags del post
 * @param {string} platform - Plataforma
 * @param {string} niche - Nicho
 * @returns {Object} Análisis de hashtags
 */
export const analyzeHashtagFactors = (hashtags, platform, niche) => {
    if (!hashtags.length) return { score: 20, details: { count: 0, trending: 0, niche: 0 } };

    let score = 30;
    score += Math.min(hashtags.length * 5, 25); // Up to 5 hashtags
    score += hashtags.length * 10; // Bonus for having hashtags

    return {
        score: Math.min(score, 100),
        details: {
            count: hashtags.length,
            trending: 0,
            niche: 0,
            optimal: hashtags.length >= 3 && hashtags.length <= 8
        }
    };
};

/**
 * Analiza factores de timing
 * @param {Date} scheduledTime - Hora programada
 * @param {string} platform - Plataforma
 * @returns {Object} Análisis de timing
 */
export const analyzeTimingFactors = (scheduledTime, platform) => {
    const hour = scheduledTime.getHours();
    const day = scheduledTime.getDay();

    const peakHours = {
        tiktok: [19, 20, 21],
        instagram: [11, 12, 19, 20],
        youtube: [14, 15, 16, 20, 21]
    };

    const isPeakHour = peakHours[platform.toLowerCase()]?.includes(hour) || false;
    const isWeekday = day >= 1 && day <= 5;

    let score = 50;
    if (isPeakHour) score += 30;
    if (isWeekday) score += 10;
    if (hour >= 18 && hour <= 23) score += 10;

    return {
        score: Math.min(score, 100),
        details: {
            hour,
            day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
            isPeakHour,
            isWeekday,
            optimal: isPeakHour && isWeekday
        }
    };
};

/**
 * Analiza factores de plataforma
 * @param {string} platform - Plataforma
 * @param {string} niche - Nicho
 * @param {string} mediaType - Tipo de media
 * @returns {Object} Análisis de plataforma
 */
export const analyzePlatformFactors = (platform, niche, mediaType) => {
    const platformOptimal = {
        tiktok: { video: 95, image: 60, text: 40 },
        instagram: { image: 90, video: 85, text: 70 },
        youtube: { video: 100, image: 30, text: 50 }
    };

    const nicheOptimal = {
        tiktok: { fitness: 90, food: 85, fashion: 95, tech: 75 },
        instagram: { fitness: 85, food: 95, fashion: 100, tech: 80 },
        youtube: { fitness: 80, food: 75, fashion: 70, tech: 95 }
    };

    const mediaScore = platformOptimal[platform]?.[mediaType] || 70;
    const nicheScore = nicheOptimal[platform]?.[niche] || 70;

    return {
        score: Math.round((mediaScore + nicheScore) / 2),
        details: {
            mediaType,
            mediaScore,
            nicheScore,
            optimal: mediaScore > 80 && nicheScore > 80
        }
    };
};

/**
 * Calcula score viral básico
 * @param {Object} factors - Factores analizados
 * @returns {number} Score viral (0-100)
 */
export const calculateBasicViralScore = (factors) => {
    const weights = {
        content: 0.25,
        hashtags: 0.2,
        timing: 0.25,
        platform: 0.3
    };

    const score =
        (factors.content?.score || 50) * weights.content +
        (factors.hashtags?.score || 50) * weights.hashtags +
        (factors.timing?.score || 50) * weights.timing +
        (factors.platform?.score || 50) * weights.platform;

    return Math.round(score);
};

/**
 * Genera recomendaciones básicas
 * @param {Object} factors - Factores analizados
 * @param {number} viralScore - Score viral
 * @returns {Array} Recomendaciones
 */
export const generateBasicViralRecommendations = (factors, viralScore) => {
    const recommendations = [];

    if (factors.content?.score < 70) {
        recommendations.push({
            type: 'content',
            priority: 'high',
            message: 'Mejora tu contenido: agrega emojis, call-to-action y hook au00ad el inicio'
        });
    }

    if (factors.hashtags?.score < 60) {
        recommendations.push({
            type: 'hashtags',
            priority: 'high',
            message: 'Usa 5-8 hashtags trending relevantes para tu nicho'
        });
    }

    if (factors.timing?.score < 70) {
        recommendations.push({
            type: 'timing',
            priority: 'medium',
            message: 'Programa en horario pico (19:00-21:00) para mejor alcance'
        });
    }

    if (factors.platform?.score < 70) {
        recommendations.push({
            type: 'platform',
            priority: 'medium',
            message: 'Ajusta el tipo de contenido para esta plataforma'
        });
    }

    return recommendations;
};

/**
 * Estima alcance del post
 * @param {number} viralScore - Score viral
 * @param {string} platform - Plataforma
 * @param {string} niche - Nicho
 * @returns {Object} Estimación de alcance
 */
export const estimateReach = (viralScore, platform, niche) => {
    const baseReach = {
        tiktok: 5000,
        instagram: 3000,
        youtube: 2000
    };

    const base = baseReach[platform.toLowerCase()] || 3000;
    const estimated = Math.round(base * (viralScore / 50));

    return {
        min: Math.round(estimated * 0.7),
        max: Math.round(estimated * 1.5),
        estimated
    };
};

/**
 * Estima engagement
 * @param {number} viralScore - Score viral
 * @param {string} platform - Plataforma
 * @returns {Object} Estimación de engagement
 */
export const estimateEngagement = (viralScore, platform) => {
    const baseRate = {
        tiktok: 0.06,
        instagram: 0.04,
        youtube: 0.05
    };

    const rate = (baseRate[platform.toLowerCase()] || 0.04) * (viralScore / 70);

    return {
        rate: Math.min(rate, 0.15),
        formatted: `${(rate * 100).toFixed(2)}%`
    };
};

/**
 * Predice viralidad completa
 * @param {Object} postData - Data del post
 * @returns {Object} Predicción completa
 */
export const predictVirality = (postData) => {
    const {
        content,
        hashtags = [],
        platform,
        niche,
        scheduledTime,
        mediaType = 'image'
    } = postData;

    const factors = {
        content: analyzeContentFactors(content),
        hashtags: analyzeHashtagFactors(hashtags, platform, niche),
        timing: analyzeTimingFactors(scheduledTime, platform),
        platform: analyzePlatformFactors(platform, niche, mediaType)
    };

    const viralScore = calculateBasicViralScore(factors);
    const recommendations = generateBasicViralRecommendations(factors, viralScore);

    return {
        score: viralScore,
        confidence: Math.min(viralScore + Math.random() * 10, 100),
        factors,
        recommendations,
        prediction: {
            reach: estimateReach(viralScore, platform, niche),
            engagement: estimateEngagement(viralScore, platform)
        }
    };
};

export default {
    analyzeContentFactors,
    analyzeHashtagFactors,
    analyzeTimingFactors,
    analyzePlatformFactors,
    calculateBasicViralScore,
    generateBasicViralRecommendations,
    estimateReach,
    estimateEngagement,
    predictVirality
};
