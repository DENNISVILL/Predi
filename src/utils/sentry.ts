/**
 * Sentry Error Tracking Utilities
 * Mock implementation for local development
 */

/**
 * Capture exception and send to Sentry
 */
export function captureException(error: Error | string, context?: Record<string, any>): void {
    if (import.meta.env.MODE === 'development') {
        console.error('[Sentry]', error, context);
        return;
    }

    // In production, this would send to Sentry
    // For now, just log to console
    console.error('[Sentry]', error, context);
}

/**
 * Capture message (non-error)
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (import.meta.env.MODE === 'development') {
        console.log(`[Sentry ${level.toUpperCase()}]`, message);
        return;
    }

    console.log(`[Sentry ${level.toUpperCase()}]`, message);
}

/**
 * Set user context for Sentry
 */
export function setUserContext(user: { id: number; email?: string; username?: string }): void {
    if (import.meta.env.MODE === 'development') {
        console.log('[Sentry] User context set:', user);
    }
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(crumb: { message: string; category?: string; level?: string }): void {
    if (import.meta.env.MODE === 'development') {
        console.log('[Sentry Breadcrumb]', crumb);
    }
}
