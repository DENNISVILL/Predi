/**
 * 🔗 MODULE CONNECTOR - Sistema de conexiones entre módulos de Predix
 * 
 * Permite comunicación e integración fluida entre:
 * - Chat IA ↔ Calendario
 * - Tendencias ↔ Chat IA
 * - Música Viral ↔ Calendario
 * - Dashboard ↔ Otros módulos
 */

export const moduleConnector = {
    /**
     * Enviar contenido desde Chat IA al Calendario
     * @param {string} content - El copy/caption generado
     * @param {string} platform - Plataforma (instagram, tiktok, etc.)
     * @param {Date|string} date - Fecha programada
     * @returns {object} Evento creado
     */
    sendToCalendar: (content, platform = 'instagram', date = new Date()) => {
        const event = {
            id: Date.now(),
            title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
            content: content,
            platform: platform,
            scheduledDate: date,
            type: 'social-post',
            source: 'chat-ia',
            createdAt: new Date().toISOString(),
            metadata: {
                generatedBy: 'chat-ia',
                platforms: [platform]
            }
        };

        // Guardar en localStorage para que el Calendario lo recoja
        const pendingEvents = JSON.parse(localStorage.getItem('pendingCalendarEvents') || '[]');
        pendingEvents.push(event);
        localStorage.setItem('pendingCalendarEvents', JSON.stringify(pendingEvents));

        console.log('📅 Evento enviado al Calendario:', event);
        return event;
    },

    /**
     * Obtener eventos pendientes para el Calendario
     * @returns {Array} Lista de eventos pendientes
     */
    getPendingCalendarEvents: () => {
        const events = JSON.parse(localStorage.getItem('pendingCalendarEvents') || '[]');
        return events;
    },

    /**
     * Limpiar eventos pendientes (después de procesarlos)
     */
    clearPendingCalendarEvents: () => {
        localStorage.removeItem('pendingCalendarEvents');
    },

    /**
     * Abrir Chat IA con contexto de tendencia pre-cargado
     * @param {object} trendData - Datos de la tendencia
     * @returns {string} URL para navegar
     */
    openChatWithTrend: (trendData) => {
        const prompt = `Genera 3 captions creativos sobre "${trendData.name || trendData.title}" para ${trendData.platform || 'Instagram'}. 

Contexto: ${trendData.description || 'Trending topic'}
Urgencia: ${trendData.viralityScore || 'Alta'}`;

        sessionStorage.setItem('chatIAPreload', prompt);
        sessionStorage.setItem('chatIAContext', JSON.stringify({
            type: 'trend',
            source: trendData
        }));

        console.log('💬 Abriendo Chat IA con contexto de tendencia');
        return '/chat-ia';
    },

    /**
     * Enviar track viral de música al Calendario
     * @param {object} track - Datos del track viral
     * @param {string} platform - Plataforma
     * @param {Date|string} date - Fecha programada
     * @returns {object} Evento creado
     */
    sendTrackToCalendar: (track, platform = 'tiktok', date = new Date()) => {
        const content = `🎵 "${track.title || track.name}" - ${track.artist || 'Artista'}

🔥 Track viral #${track.rank || '1'} en ${platform}
💯 Viralidad: ${track.viralityScore || 95}%

${track.description || 'Úsalo para aumentar el engagement de tus posts'}

#MúsicaViral #${platform} ${track.hashtags || ''}`;

        const event = {
            id: Date.now(),
            title: `🎵 ${track.title || track.name}`,
            content: content,
            platform: platform,
            scheduledDate: date,
            type: 'music-post',
            source: 'musica-viral',
            createdAt: new Date().toISOString(),
            metadata: {
                trackId: track.id,
                trackTitle: track.title || track.name,
                artist: track.artist,
                viralityScore: track.viralityScore,
                platforms: [platform]
            }
        };

        const pendingEvents = JSON.parse(localStorage.getItem('pendingCalendarEvents') || '[]');
        pendingEvents.push(event);
        localStorage.setItem('pendingCalendarEvents', JSON.stringify(pendingEvents));

        console.log('📅 Track viral enviado al Calendario:', event);
        return event;
    },

    /**
     * Navegar entre módulos con filtros pre-aplicados
     * @param {string} module - Módulo destino
     * @param {object} filters - Filtros a aplicar
     * @returns {string} URL para navegar
     */
    navigateWithFilters: (module, filters) => {
        sessionStorage.setItem(`${module}Filters`, JSON.stringify(filters));
        sessionStorage.setItem(`${module}FiltersApplied`, 'true');

        console.log(`🔗 Navegando a ${module} con filtros:`, filters);
        return `/${module}`;
    },

    /**
     * Obtener filtros pre-aplicados para un módulo
     * @param {string} module - Nombre del módulo
     * @returns {object|null} Filtros guardados
     */
    getModuleFilters: (module) => {
        const filtersApplied = sessionStorage.getItem(`${module}FiltersApplied`);
        if (filtersApplied === 'true') {
            const filters = JSON.parse(sessionStorage.getItem(`${module}Filters`) || 'null');
            // Limpiar después de obtener
            sessionStorage.removeItem(`${module}FiltersApplied`);
            return filters;
        }
        return null;
    },

    /**
     * Notificar al usuario sobre una conexión exitosa
     * @param {string} from - Módulo origen
     * @param {string} to - Módulo destino
     * @param {string} action - Acción realizada
     */
    notifyConnection: (from, to, action) => {
        const notification = {
            id: Date.now(),
            from: from,
            to: to,
            action: action,
            timestamp: new Date().toISOString()
        };

        // Guardar historial de conexiones
        const history = JSON.parse(localStorage.getItem('connectionHistory') || '[]');
        history.unshift(notification);
        // Mantener solo últimas 50
        const trimmedHistory = history.slice(0, 50);
        localStorage.setItem('connectionHistory', JSON.stringify(trimmedHistory));

        console.log(`✅ Conexión: ${from} → ${to} (${action})`);
        return notification;
    },

    /**
     * Obtener historial de conexiones
     * @returns {Array} Historial de conexiones
     */
    getConnectionHistory: () => {
        return JSON.parse(localStorage.getItem('connectionHistory') || '[]');
    }
};

export default moduleConnector;
