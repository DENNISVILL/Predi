/**
 * Virality Predictor - AI-powered prediction model
 * Predicts the probability of a hashtag/trend going viral
 */

export const calculateViralityScore = (trend) => {
    if (!trend) return 0;

    // Weighted factors
    const factors = {
        growthRate: 0.25,      // 25% weight
        engagement: 0.20,       // 20% weight
        velocity: 0.15,         // 15% weight
        platform: 0.15,         // 15% weight
        recency: 0.10,          // 10% weight
        mentions: 0.10,         // 10% weight
        country: 0.05           // 5% weight
    };

    // Calculate growth score (0-100)
    const growthScore = Math.min(100, (trend.growth / 5));

    // Calculate engagement score (0-100)
    const engagementScore = trend.engagement || 0;

    // Calculate velocity score (how fast it's growing)
    const velocityScore = Math.min(100, (trend.velocity / 10));

    // Platform weight (TikTok = higher viral potential)
    const platformScores = {
        tiktok: 100,
        instagram: 85,
        facebook: 70
    };
    const platformScore = platformScores[trend.platform] || 75;

    // Recency score (newer = higher potential)
    const hoursSinceDetection = trend.detectedAt
        ? (Date.now() - new Date(trend.detectedAt).getTime()) / (1000 * 60 * 60)
        : 24;
    const recencyScore = Math.max(0, 100 - (hoursSinceDetection * 4));

    // Mentions score (logarithmic scale)
    const mentionsScore = Math.min(100, Math.log10(trend.mentions || 1) * 12);

    // Country weight (larger markets = higher potential)
    const countryScores = {
        espana: 95,
        mexico: 90,
        argentina: 85,
        colombia: 80,
        peru: 75,
        ecuador: 70
    };
    const countryScore = countryScores[trend.country] || 75;

    // Calculate weighted total
    const totalScore =
        (growthScore * factors.growthRate) +
        (engagementScore * factors.engagement) +
        (velocityScore * factors.velocity) +
        (platformScore * factors.platform) +
        (recencyScore * factors.recency) +
        (mentionsScore * factors.mentions) +
        (countryScore * factors.country);

    return Math.round(totalScore);
};

export const getViralityLevel = (score) => {
    if (score >= 85) return { level: 'EXTREMO', color: '#FF0000', icon: '🔥🔥🔥' };
    if (score >= 70) return { level: 'MUY ALTO', color: '#FF6B00', icon: '🔥🔥' };
    if (score >= 55) return { level: 'ALTO', color: '#FFA500', icon: '🔥' };
    if (score >= 40) return { level: 'MEDIO', color: '#FFD700', icon: '⚡' };
    if (score >= 25) return { level: 'BAJO', color: '#90EE90', icon: '🌱' };
    return { level: 'MUY BAJO', color: '#808080', icon: '📊' };
};

export const getViralityFactors = (trend) => {
    const score = calculateViralityScore(trend);
    const factors = [];

    // Analyze which factors contribute most
    if (trend.growth >= 400) {
        factors.push({
            name: 'Crecimiento Explosivo',
            impact: 'high',
            value: `+${trend.growth}%`,
            description: 'El crecimiento es extremadamente alto'
        });
    }

    if (trend.engagement >= 85) {
        factors.push({
            name: 'Alto Engagement',
            impact: 'high',
            value: `${trend.engagement}%`,
            description: 'La audiencia está muy comprometida'
        });
    }

    if (trend.platform === 'tiktok') {
        factors.push({
            name: 'Plataforma TikTok',
            impact: 'medium',
            value: 'TikTok',
            description: 'Plataforma con mayor potencial viral'
        });
    }

    const hoursSinceDetection = trend.detectedAt
        ? (Date.now() - new Date(trend.detectedAt).getTime()) / (1000 * 60 * 60)
        : 24;

    if (hoursSinceDetection < 6) {
        factors.push({
            name: 'Recién Detectado',
            impact: 'high',
            value: '< 6h',
            description: 'Trend muy reciente, alto potencial'
        });
    }

    if (trend.mentions >= 3000000) {
        factors.push({
            name: 'Alto Volumen',
            impact: 'medium',
            value: `${(trend.mentions / 1000000).toFixed(1)}M`,
            description: 'Muchas menciones activas'
        });
    }

    return { score, factors };
};

export const getPredictionRecommendation = (trend) => {
    const { score, factors } = getViralityFactors(trend);
    const level = getViralityLevel(score);

    let recommendation = '';
    let action = '';
    let timing = '';

    if (score >= 85) {
        recommendation = '¡ACTÚA AHORA! Este trend tiene potencial viral extremo.';
        action = 'Crear contenido INMEDIATAMENTE';
        timing = 'Próximas 2-4 horas';
    } else if (score >= 70) {
        recommendation = 'Excelente oportunidad. Prepara contenido de calidad.';
        action = 'Planificar y ejecutar hoy';
        timing = 'Próximas 6-12 horas';
    } else if (score >= 55) {
        recommendation = 'Buena oportunidad, pero requiere contenido original.';
        action = 'Desarrollar estrategia creativa';
        timing = 'Próximas 24 horas';
    } else if (score >= 40) {
        recommendation = 'Monitorear evolución antes de actuar.';
        action = 'Observar y analizar';
        timing = 'Próximos 2-3 días';
    } else {
        recommendation = 'Bajo potencial de virality en este momento.';
        action = 'Buscar otras oportunidades';
        timing = 'No urgente';
    }

    return {
        score,
        level: level.level,
        color: level.color,
        icon: level.icon,
        recommendation,
        action,
        timing,
        factors
    };
};

// Generate mock historical data for charts
export const generateHistoricalData = (trend, days = 7) => {
    const data = [];
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;

    for (let i = days; i >= 0; i--) {
        const date = new Date(now - (i * msPerDay));
        const dateStr = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

        // Simulate growth curve
        const progress = 1 - (i / days);
        const growthFactor = Math.pow(progress, 2); // Exponential growth

        data.push({
            date: dateStr,
            mentions: Math.round(trend.mentions * growthFactor),
            engagement: Math.round(trend.engagement * (0.7 + (0.3 * growthFactor))),
            growth: Math.round(trend.growth * growthFactor),
            timestamp: date.getTime()
        });
    }

    return data;
};
