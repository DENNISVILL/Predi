/**
 * Country Festivals Manager
 * Gestiona festividades nacionales por país para optimización de contenido
 */

/**
 * Obtiene las festividades de un país específico
 * @param {string} countryCode - Código del país (ES, MX, CO, etc.)
 * @returns {Array} Lista de festividades
 */
export const getCountryFestivals = (countryCode = 'MX') => {
    const currentYear = new Date().getFullYear();

    const festivals = {
        'ES': [
            { name: 'Día de Reyes', date: new Date(currentYear, 0, 6), emoji: '👑', type: 'nacional' },
            { name: 'San Valentín', date: new Date(currentYear, 1, 14), emoji: '💕', type: 'comercial' },
            { name: 'Día del Padre', date: new Date(currentYear, 2, 19), emoji: '👨‍👧‍👦', type: 'familiar' },
            { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
            { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
            { name: 'San Juan', date: new Date(currentYear, 5, 24), emoji: '🔥', type: 'tradicional' },
            { name: 'Santiago Apóstol', date: new Date(currentYear, 6, 25), emoji: '⛪', type: 'religioso' },
            { name: 'Asunción', date: new Date(currentYear, 7, 15), emoji: '🙏', type: 'religioso' },
            { name: 'Día de la Hispanidad', date: new Date(currentYear, 9, 12), emoji: '🇪🇸', type: 'nacional' },
            { name: 'Todos los Santos', date: new Date(currentYear, 10, 1), emoji: '👼', type: 'religioso' },
            { name: 'Constitución', date: new Date(currentYear, 11, 6), emoji: '📜', type: 'nacional' },
            { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
        ],
        'MX': [
            { name: 'Año Nuevo', date: new Date(currentYear, 0, 1), emoji: '🎊', type: 'nacional' },
            { name: 'Día de la Candelaria', date: new Date(currentYear, 1, 2), emoji: '🕯️', type: 'religioso' },
            { name: 'Día de la Bandera', date: new Date(currentYear, 1, 24), emoji: '🇲🇽', type: 'nacional' },
            { name: 'Día de la Constitución', date: new Date(currentYear, 1, 5), emoji: '📜', type: 'nacional' },
            { name: 'Natalicio de Benito Juárez', date: new Date(currentYear, 2, 21), emoji: '👨‍⚖️', type: 'nacional' },
            { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
            { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
            { name: 'Cinco de Mayo', date: new Date(currentYear, 4, 5), emoji: '🎉', type: 'nacional' },
            { name: 'Día de las Madres', date: new Date(currentYear, 4, 10), emoji: '👩‍👧‍👦', type: 'familiar' },
            { name: 'Independencia', date: new Date(currentYear, 8, 16), emoji: '🇲🇽', type: 'nacional' },
            { name: 'Día de Muertos', date: new Date(currentYear, 10, 2), emoji: '💀', type: 'tradicional' },
            { name: 'Revolución Mexicana', date: new Date(currentYear, 10, 20), emoji: '⚔️', type: 'nacional' },
            { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
        ],
        'CO': [
            { name: 'Año Nuevo', date: new Date(currentYear, 0, 1), emoji: '🎊', type: 'nacional' },
            { name: 'Reyes Magos', date: new Date(currentYear, 0, 8), emoji: '👑', type: 'religioso' },
            { name: 'San José', date: new Date(currentYear, 2, 20), emoji: '⛪', type: 'religioso' },
            { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
            { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
            { name: 'Ascensión', date: new Date(currentYear, 4, 22), emoji: '☁️', type: 'religioso' },
            { name: 'Corpus Christi', date: new Date(currentYear, 5, 12), emoji: '🍞', type: 'religioso' },
            { name: 'Sagrado Corazón', date: new Date(currentYear, 5, 19), emoji: '❤️', type: 'religioso' },
            { name: 'San Pedro y San Pablo', date: new Date(currentYear, 5, 3), emoji: '⛪', type: 'religioso' },
            { name: 'Independencia', date: new Date(currentYear, 6, 20), emoji: '🇨🇴', type: 'nacional' },
            { name: 'Batalla de Boyacá', date: new Date(currentYear, 7, 7), emoji: '⚔️', type: 'nacional' },
            { name: 'Asunción', date: new Date(currentYear, 7, 21), emoji: '🙏', type: 'religioso' },
            { name: 'Día de la Raza', date: new Date(currentYear, 9, 16), emoji: '🌎', type: 'nacional' },
            { name: 'Todos los Santos', date: new Date(currentYear, 10, 6), emoji: '👼', type: 'religioso' },
            { name: 'Independencia de Cartagena', date: new Date(currentYear, 10, 13), emoji: '🏰', type: 'nacional' },
            { name: 'Inmaculada Concepción', date: new Date(currentYear, 11, 8), emoji: '👸', type: 'religioso' },
            { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
        ],
        'AR': [
            { name: 'Año Nuevo', date: new Date(currentYear, 0, 1), emoji: '🎊', type: 'nacional' },
            { name: 'Carnaval', date: new Date(currentYear, 1, 28), emoji: '🎭', type: 'cultural' },
            { name: 'Día de la Memoria', date: new Date(currentYear, 2, 24), emoji: '🕊️', type: 'nacional' },
            { name: 'Malvinas', date: new Date(currentYear, 3, 2), emoji: '🇦🇷', type: 'nacional' },
            { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
            { name: 'Revolución de Mayo', date: new Date(currentYear, 4, 25), emoji: '🎗️', type: 'nacional' },
            { name: 'Día de la Bandera', date: new Date(currentYear, 5, 20), emoji: '🇦🇷', type: 'nacional' },
            { name: 'Independencia', date: new Date(currentYear, 6, 9), emoji: '🇦🇷', type: 'nacional' },
            { name: 'Día de la Diversidad', date: new Date(currentYear, 9, 12), emoji: '🌎', type: 'nacional' },
            { name: 'Inmaculada Concepción', date: new Date(currentYear, 11, 8), emoji: '👸', type: 'religioso' },
            { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
        ],
        'PE': [
            { name: 'Año Nuevo', date: new Date(currentYear, 0, 1), emoji: '🎊', type: 'nacional' },
            { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
            { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
            { name: 'San Pedro y San Pablo', date: new Date(currentYear, 5, 29), emoji: '⛪', type: 'religioso' },
            { name: 'Fiestas Patrias', date: new Date(currentYear, 6, 28), emoji: '🇵🇪', type: 'nacional' },
            { name: 'Santa Rosa', date: new Date(currentYear, 7, 30), emoji: '🌹', type: 'religioso' },
            { name: 'Combate de Angamos', date: new Date(currentYear, 9, 8), emoji: '⚓', type: 'nacional' },
            { name: 'Todos los Santos', date: new Date(currentYear, 10, 1), emoji: '👼', type: 'religioso' },
            { name: 'Inmaculada Concepción', date: new Date(currentYear, 11, 8), emoji: '👸', type: 'religioso' },
            { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
        ],
        'EC': [
            { name: 'Año Nuevo', date: new Date(currentYear, 0, 1), emoji: '🎊', type: 'nacional' },
            { name: 'Carnaval', date: new Date(currentYear, 1, 28), emoji: '🎭', type: 'cultural' },
            { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
            { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
            { name: 'Batalla de Pichincha', date: new Date(currentYear, 4, 24), emoji: '⚔️', type: 'nacional' },
            { name: 'Independencia de Quito', date: new Date(currentYear, 7, 10), emoji: '🇪🇨', type: 'nacional' },
            { name: 'Independencia de Guayaquil', date: new Date(currentYear, 9, 9), emoji: '🇪🇨', type: 'nacional' },
            { name: 'Día de los Difuntos', date: new Date(currentYear, 10, 2), emoji: '🕯️', type: 'tradicional' },
            { name: 'Independencia de Cuenca', date: new Date(currentYear, 10, 3), emoji: '🇪🇨', type: 'nacional' },
            { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
        ],
        'CL': [
            { name: 'Año Nuevo', date: new Date(currentYear, 0, 1), emoji: '🎊', type: 'nacional' },
            { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
            { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
            { name: 'Glorias Navales', date: new Date(currentYear, 4, 21), emoji: '⚓', type: 'nacional' },
            { name: 'San Pedro y San Pablo', date: new Date(currentYear, 5, 29), emoji: '⛪', type: 'religioso' },
            { name: 'Asunción', date: new Date(currentYear, 7, 15), emoji: '🙏', type: 'religioso' },
            { name: 'Independencia', date: new Date(currentYear, 8, 18), emoji: '🇨🇱', type: 'nacional' },
            { name: 'Día de la Raza', date: new Date(currentYear, 9, 12), emoji: '🌎', type: 'nacional' },
            { name: 'Todos los Santos', date: new Date(currentYear, 10, 1), emoji: '👼', type: 'religioso' },
            { name: 'Inmaculada Concepción', date: new Date(currentYear, 11, 8), emoji: '👸', type: 'religioso' },
            { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
        ],
        'VE': [
            { name: 'Año Nuevo', date: new Date(currentYear, 0, 1), emoji: '🎊', type: 'nacional' },
            { name: 'Carnaval', date: new Date(currentYear, 1, 28), emoji: '🎭', type: 'cultural' },
            { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
            { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
            { name: 'Batalla de Carabobo', date: new Date(currentYear, 5, 24), emoji: '⚔️', type: 'nacional' },
            { name: 'Independencia', date: new Date(currentYear, 6, 5), emoji: '🇻🇪', type: 'nacional' },
            { name: 'Natalicio de Bolívar', date: new Date(currentYear, 6, 24), emoji: '👨‍⚖️', type: 'nacional' },
            { name: 'Día de la Resistencia', date: new Date(currentYear, 9, 12), emoji: '🌎', type: 'nacional' },
            { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
        ]
    };

    return festivals[countryCode] || festivals['MX']; // Default to Mexico
};

/**
 * Obtiene festividades cercanas a una fecha
 * @param {Date} date - Fecha de referencia
 * @param {string} countryCode - Código del país
 * @param {number} daysRange - Rango de días antes/después
 * @returns {Array} Festividades cercanas
 */
export const getUpcomingFestivals = (date, countryCode = 'MX', daysRange = 30) => {
    const festivals = getCountryFestivals(countryCode);
    const targetTime = date.getTime();
    const rangeMs = daysRange * 24 * 60 * 60 * 1000;

    return festivals.filter(festival => {
        const festivalTime = festival.date.getTime();
        const diff = festivalTime - targetTime;
        return diff >= 0 && diff <= rangeMs;
    }).sort((a, b) => a.date - b.date);
};

/**
 * Verifica si una fecha es festividad
 * @param {Date} date - Fecha a verificar
 * @param {string} countryCode - Código del país
 * @returns {Object|null} Festividad si existe, null si no
 */
export const isFestivalDate = (date, countryCode = 'MX') => {
    const festivals = getCountryFestivals(countryCode);
    return festivals.find(festival =>
        festival.date.getDate() === date.getDate() &&
        festival.date.getMonth() === date.getMonth()
    ) || null;
};

export default {
    getCountryFestivals,
    getUpcomingFestivals,
    isFestivalDate
};
