/**
 * Schedule Optimizer
 * Optimiza horarios de publicación basado en audiencia, plataforma y país
 */

/**
 * Data de horarios óptimos por país
 */
export const COUNTRY_SCHEDULES = {
    'ES': {
        name: 'España',
        flag: '🇪🇸',
        timezone: 'CET (UTC+1)',
        morning: '08:00 - 10:00',
        afternoon: '14:00 - 16:00',
        evening: '21:00 - 23:00',
        peak: '22:00-24:00',
        contentTypes: {
            comida: { breakfast: '07:00 - 09:00', lunch: '13:00 - 15:00', dinner: '20:00 - 22:00' },
            fashion: { outfit: '08:00 - 10:00', looks: '18:00 - 20:00', weekend: 'Sábados 17:00' },
            fitness: { morning: '06:00 - 08:00', motivation: '17:00 - 19:00', night: '19:00 - 21:00' },
            tech: { tips: '07:00 - 09:00', tutorials: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
    },
    'MX': {
        name: 'México',
        flag: '🇲🇽',
        timezone: 'CST (UTC-6)',
        morning: '08:00 - 10:00',
        afternoon: '19:00 - 21:00',
        evening: '22:00 - 24:00',
        peak: '21:00-23:00',
        contentTypes: {
            comida: { desayuno: '07:00 - 09:00', almuerzo: '11:30 - 13:30', cena: '18:00 - 20:00' },
            fashion: { outfit: '08:00 - 10:00', looks: '18:00 - 20:00', weekend: 'Viernes 17:00' },
            fitness: { rutina: '06:00 - 08:00', motivación: '17:00 - 19:00', noche: '19:00 - 21:00' },
            tech: { tips: '07:00 - 09:00', tutoriales: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
    },
    'CO': {
        name: 'Colombia',
        flag: '🇨🇴',
        timezone: 'COT (UTC-5)',
        morning: '06:00 - 08:00',
        afternoon: '18:00 - 20:00',
        evening: '21:00 - 23:00',
        peak: '20:00-22:00',
        contentTypes: {
            comida: { desayuno: '06:00 - 08:00', almuerzo: '12:00 - 14:00', cena: '18:00 - 20:00' },
            fashion: { outfit: '07:00 - 09:00', looks: '17:00 - 19:00', weekend: 'Viernes 16:00' },
            fitness: { rutina: '05:00 - 07:00', motivación: '16:00 - 18:00', noche: '18:00 - 20:00' },
            tech: { tips: '06:00 - 08:00', tutoriales: '14:00 - 16:00', reviews: '19:00 - 21:00' }
        }
    },
    'AR': {
        name: 'Argentina',
        flag: '🇦🇷',
        timezone: 'ART (UTC-3)',
        morning: '08:00 - 10:00',
        afternoon: '18:30 - 20:00',
        evening: '21:00 - 23:00',
        peak: '20:00-22:00',
        contentTypes: {
            comida: { desayuno: '08:00 - 10:00', almuerzo: '12:30 - 14:30', cena: '20:00 - 22:00' },
            fashion: { outfit: '09:00 - 11:00', looks: '19:00 - 21:00', weekend: 'Sábados 18:00' },
            fitness: { rutina: '07:00 - 09:00', motivación: '18:00 - 20:00', noche: '20:00 - 22:00' },
            tech: { tips: '08:00 - 10:00', tutoriales: '16:00 - 18:00', reviews: '21:00 - 23:00' }
        }
    },
    'PE': {
        name: 'Perú',
        flag: '🇵🇪',
        timezone: 'PET (UTC-5)',
        morning: '07:00 - 09:00',
        afternoon: '18:00 - 20:00',
        evening: '20:00 - 22:00',
        peak: '19:00-21:00',
        contentTypes: {
            comida: { desayuno: '07:00 - 09:00', almuerzo: '12:00 - 14:00', cena: '18:00 - 20:00' },
            fashion: { outfit: '08:00 - 10:00', looks: '17:00 - 19:00', weekend: 'Domingos 16:00' },
            fitness: { rutina: '06:00 - 08:00', motivación: '17:00 - 19:00', noche: '19:00 - 21:00' },
            tech: { tips: '07:00 - 09:00', tutoriales: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
    },
    'EC': {
        name: 'Ecuador',
        flag: '🇪🇨',
        timezone: 'ECT (UTC-5)',
        morning: '07:00 - 09:00',
        afternoon: '17:00 - 19:00',
        evening: '20:00 - 22:00',
        peak: '19:00-21:00',
        contentTypes: {
            comida: { desayuno: '07:00 - 09:00', almuerzo: '12:00 - 14:00', cena: '18:00 - 20:00' },
            fashion: { outfit: '08:00 - 10:00', looks: '17:00 - 19:00', weekend: 'Viernes 17:00' },
            fitness: { rutina: '06:00 - 08:00', motivación: '17:00 - 19:00', noche: '19:00 - 21:00' },
            tech: { tips: '07:00 - 09:00', tutoriales: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
    },
    'CL': {
        name: 'Chile',
        flag: '🇨🇱',
        timezone: 'CLT (UTC-4)',
        morning: '08:00 - 10:00',
        afternoon: '18:00 - 20:00',
        evening: '21:00 - 23:00',
        peak: '20:00-22:00',
        contentTypes: {
            comida: { desayuno: '08:00 - 10:00', almuerzo: '13:00 - 15:00', cena: '19:00 - 21:00' },
            fashion: { outfit: '09:00 - 11:00', looks: '18:00 - 20:00', weekend: 'Sábados 17:00' },
            fitness: { rutina: '07:00 - 09:00', motivación: '18:00 - 20:00', noche: '20:00 - 22:00' },
            tech: { tips: '08:00 - 10:00', tutoriales: '16:00 - 18:00', reviews: '21:00 - 23:00' }
        }
    },
    'VE': {
        name: 'Venezuela',
        flag: '🇻🇪',
        timezone: 'VET (UTC-4)',
        morning: '07:00 - 09:00',
        afternoon: '17:00 - 19:00',
        evening: '20:00 - 22:00',
        peak: '19:00-21:00',
        contentTypes: {
            comida: { desayuno: '07:00 - 09:00', almuerzo: '12:00 - 14:00', cena: '18:00 - 20:00' },
            fashion: { outfit: '08:00 - 10:00', looks: '17:00 - 19:00', weekend: 'Domingos 16:00' },
            fitness: { rutina: '06:00 - 08:00', motivación: '17:00 - 19:00', noche: '19:00 - 21:00' },
            tech: { tips: '07:00 - 09:00', tutoriales: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
    }
};

/**
 * Data de audiencia por plataforma
 */
export const DEFAULT_AUDIENCE_DATA = {
    demographics: {
        age: { '18-24': 35, '25-34': 40, '35-44': 20, '45+': 5 },
        location: { 'Ecuador': 45, 'Colombia': 30, 'Mexico': 15, 'Others': 10 },
        gender: { 'Female': 58, 'Male': 42 }
    },
    engagement: {
        tiktok: {
            peak_hours: [19, 20, 21],
            engagement_by_hour: {
                6: 12, 7: 18, 8: 25, 9: 35, 10: 45, 11: 55, 12: 65,
                13: 70, 14: 75, 15: 80, 16: 85, 17: 88, 18: 92, 19: 98,
                20: 100, 21: 95, 22: 85, 23: 70, 0: 45, 1: 25, 2: 15, 3: 10
            },
            best_days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            timezone_offset: -5
        },
        instagram: {
            peak_hours: [11, 12, 19, 20],
            engagement_by_hour: {
                6: 15, 7: 22, 8: 30, 9: 45, 10: 60, 11: 85, 12: 90,
                13: 75, 14: 65, 15: 70, 16: 75, 17: 80, 18: 85, 19: 95,
                20: 92, 21: 80, 22: 65, 23: 45, 0: 30, 1: 20, 2: 12, 3: 8
            },
            best_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            timezone_offset: -5
        },
        youtube: {
            peak_hours: [14, 15, 16, 20, 21],
            engagement_by_hour: {
                6: 8, 7: 12, 8: 18, 9: 25, 10: 35, 11: 45, 12: 55,
                13: 65, 14: 85, 15: 90, 16: 88, 17: 75, 18: 70, 19: 75,
                20: 95, 21: 100, 22: 85, 23: 65, 0: 35, 1: 20, 2: 12, 3: 8
            },
            best_days: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
            timezone_offset: -5
        }
    }
};

/**
 * Optimiza horarios de publicación basado en audiencia
 * @param {string} platform - Plataforma (tiktok, instagram, youtube)
 * @param {string} niche - Nicho (food, fitness, fashion, tech)
 * @param {string} contentType - Tipo de contenido
 * @param {Object} audienceData - Data de audiencia (opcional)
 * @returns {Object} Recomendación de horario optimizado
 */
export const optimizeSchedulingTime = (platform, niche, contentType, audienceData = DEFAULT_AUDIENCE_DATA) => {
    const platformData = audienceData.engagement[platform.toLowerCase()];
    if (!platformData) return { hour: 19, confidence: 70, reason: 'Default optimal time' };

    const currentHour = new Date().getHours();
    const engagementData = platformData.engagement_by_hour;

    // Encontrar las 3 mejores horas
    const sortedHours = Object.entries(engagementData)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    // Seleccionar la mejor hora disponible (no en el pasado)
    let bestHour = sortedHours[0];
    for (let [hour, engagement] of sortedHours) {
        if (parseInt(hour) > currentHour) {
            bestHour = [hour, engagement];
            break;
        }
    }

    // Ajustar por nicho
    const nicheMultipliers = {
        food: { 11: 1.2, 12: 1.3, 13: 1.2, 19: 1.1, 20: 1.1 },
        fitness: { 6: 1.3, 7: 1.2, 18: 1.1, 19: 1.1, 20: 1.1 },
        fashion: { 10: 1.1, 11: 1.1, 18: 1.2, 19: 1.3, 20: 1.2 },
        tech: { 9: 1.1, 14: 1.2, 15: 1.2, 16: 1.1, 21: 1.1 }
    };

    const multiplier = nicheMultipliers[niche]?.[bestHour[0]] || 1;
    const optimizedEngagement = bestHour[1] * multiplier;

    return {
        hour: parseInt(bestHour[0]),
        confidence: Math.min(optimizedEngagement, 100),
        reason: `Peak engagement (${optimizedEngagement.toFixed(0)}%) for ${niche} on ${platform}`,
        expectedIncrease: `+${((optimizedEngagement - 70) * 4).toFixed(0)}%`,
        audienceActive: `${Math.floor(optimizedEngagement * 0.8)}% of your audience`
    };
};

/**
 * Genera calendario optimizado
 * @param {number} days - Número de días
 * @param {Object} audienceData - Data de audiencia
 * @returns {Array} Calendario de posts optimizados
 */
export const generateOptimizedCalendar = (days = 7, audienceData = DEFAULT_AUDIENCE_DATA) => {
    const calendar = [];
    const platforms = ['tiktok', 'instagram', 'youtube'];
    const niches = ['food', 'fitness', 'fashion', 'tech'];

    for (let day = 0; day < days; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);

        const postsPerDay = Math.floor(Math.random() * 2) + 2;

        for (let post = 0; post < postsPerDay; post++) {
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            const niche = niches[Math.floor(Math.random() * niches.length)];
            const optimization = optimizeSchedulingTime(platform, niche, 'post', audienceData);

            date.setHours(optimization.hour, Math.floor(Math.random() * 60), 0, 0);

            calendar.push({
                id: `opt_${day}_${post}`,
                date: new Date(date),
                platform,
                niche,
                optimization,
                title: `${niche.charAt(0).toUpperCase() + niche.slice(1)} content for ${platform}`,
                estimatedReach: Math.floor(optimization.confidence * 500 + Math.random() * 10000),
                viralScore: Math.floor(optimization.confidence * 0.9 + Math.random() * 10)
            });
        }
    }

    return calendar.sort((a, b) => a.date - b.date);
};

/**
 * Obtiene horarios de un país
 * @param {string} countryCode - Código del país
 * @returns {Object} Horarios del país
 */
export const getCountrySchedules = (countryCode = 'MX') => {
    return COUNTRY_SCHEDULES[countryCode] || COUNTRY_SCHEDULES['MX'];
};

export default {
    COUNTRY_SCHEDULES,
    DEFAULT_AUDIENCE_DATA,
    optimizeSchedulingTime,
    generateOptimizedCalendar,
    getCountrySchedules
};
