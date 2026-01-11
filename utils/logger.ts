/**
 * Production-safe logger utility
 * Logs are only shown in development mode
 */

const isDev = __DEV__;

export const logger = {
    /**
     * Debug-level logs (verbose, development only)
     */
    debug: (...args: any[]) => {
        if (isDev) {
            console.log('[DEBUG]', ...args);
        }
    },

    /**
     * Info-level logs (general information)
     */
    info: (...args: any[]) => {
        if (isDev) {
            console.log('[INFO]', ...args);
        }
    },

    /**
     * Warning-level logs (shown in production)
     */
    warn: (...args: any[]) => {
        console.warn('[WARN]', ...args);
    },

    /**
     * Error-level logs (always shown, tracked in production)
     */
    error: (...args: any[]) => {
        console.error('[ERROR]', ...args);
        // In production, you might want to send to error tracking service
        // e.g., Sentry.captureException(args[0]);
    },

    /**
     * Track events (for analytics)
     */
    event: (eventName: string, properties?: Record<string, any>) => {
        if (isDev) {
            console.log('[EVENT]', eventName, properties);
        }
        // In production, this would go to PostHog or similar
    },
};

export default logger;
