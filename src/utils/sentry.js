/**
 * Sentry Integration for Frontend
 * Error tracking and performance monitoring
 */

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

/**
 * Initialize Sentry error tracking
 * Call this as early as possible in your app
 */
export const initSentry = () => {
    const dsn = process.env.REACT_APP_SENTRY_DSN;
    const environment = process.env.REACT_APP_ENVIRONMENT || "development";

    if (!dsn) {
        console.warn("⚠️ Sentry DSN not configured. Error tracking disabled.");
        return false;
    }

    try {
        Sentry.init({
            dsn: dsn,
            environment: environment,

            // Integrations
            integrations: [
                new BrowserTracing(),
            ],

            // Performance Monitoring
            tracesSampleRate: environment === "production" ? 0.2 : 1.0, // 20% in prod, 100% in dev

            // Session Replay (optional, requires additional setup)
            // replaysSessionSampleRate: 0.1,
            // replaysOnErrorSampleRate: 1.0,

            // Options
            beforeSend(event, hint) {
                // Filter out non-errors (e.g., console.log)
                const error = hint.originalException;

                // Don't send network errors that are likely user-side (offline, etc.)
                if (error && error.message) {
                    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                        // Only sample 10% of network errors
                        if (Math.random() > 0.1) {
                            return null;
                        }
                    }
                }

                // Filter sensitive data
                if (event.request) {
                    // Remove sensitive headers
                    if (event.request.headers) {
                        delete event.request.headers.Authorization;
                        delete event.request.headers.Cookie;
                    }

                    // Filter sensitive query params
                    if (event.request.query_string) {
                        const queryString = event.request.query_string;
                        if (queryString.includes('password') || queryString.includes('token')) {
                            event.request.query_string = '[Filtered]';
                        }
                    }
                }

                return event;
            },

            // Ignore certain errors
            ignoreErrors: [
                // Browser extensions
                'top.GLOBALS',
                // Random plugins/extensions
                'originalCreateNotification',
                'canvas.contentDocument',
                'MyApp_RemoveAllHighlights',
                // Facebook errors
                'fb_xd_fragment',
                // React DevTools
                '__REACT_DEVTOOLS_GLOBAL_HOOK__',
            ],

            // Allowed URLs (only send errors from your domain)
            allowUrls: environment === "production" ? [
                /https:\/\/predix\.com/,
                /https:\/\/app\.predix\.com/,
            ] : undefined,
        });

        console.log(✅ Sentry initialized for environment: ${ environment } `);
    return true;
    
  } catch (error) {
    console.error("❌ Failed to initialize Sentry:", error);
    return false;
  }
};

/**
 * Set user context for error tracking
 */
export const setUser = (user) => {
  if (!user) {
    Sentry.setUser(null);
    return;
  }
  
  Sentry.setUser({
    id: user.id,
    email: user.email, // Will be filtered if configured
    username: user.username,
  });
};

/**
 * Capture an exception manually
 */
export const captureException = (error, context = {}) => {
  Sentry.withScope((scope) => {
    // Add context
    Object.keys(context).forEach((key) => {
      scope.setContext(key, context[key]);
    });
    
    Sentry.captureException(error);
  });
};

/**
 * Capture a message
 */
export const captureMessage = (message, level = "info") => {
  Sentry.captureMessage(message, level);
};

/**
 * Set a tag for filtering
 */
export const setTag = (key, value) => {
  Sentry.setTag(key, value);
};

/**
 * Set additional context
 */
export const setContext = (name, context) => {
  Sentry.setContext(name, context);
};

/**
 * Start a performance transaction
 */
export const startTransaction = (name, op = "custom") => {
  return Sentry.startTransaction({ name, op });
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (breadcrumb) => {
  Sentry.addBreadcrumb(breadcrumb);
};

/**
 * Error Boundary Component
 * Wrap your app with this to catch React errors
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

/**
 * Higher-order component for error tracking
 */
export const withProfiler = Sentry.withProfiler;

export default {
  initSentry,
  setUser,
  captureException,
  captureMessage,
  setTag,
  setContext,
  startTransaction,
  addBreadcrumb,
  ErrorBoundary,
  withProfiler,
};
