import PostHog from 'posthog-react-native';

export const POSTHOG_API_KEY = "phc_V69oo6nlMMA57eE6zWC4uyfCop2RgR6Wuh8tC1KhPbu";
export const POSTHOG_HOST = "https://eu.i.posthog.com";

export const posthogConfig = {
    apiKey: POSTHOG_API_KEY,
    options: {
        host: POSTHOG_HOST,
        enableSessionReplay: true,
    },
    autocapture: true,
};

// Singleton instance for non-reactive tracking (e.g. in utility functions)
let posthogInstance: PostHog | null = null;

export const getPostHog = async () => {
    if (!posthogInstance) {
        // @ts-ignore - Some versions of posthog-react-native have different init patterns
        posthogInstance = await PostHog.init?.(POSTHOG_API_KEY, {
            host: POSTHOG_HOST,
        });
    }
    return posthogInstance;
};
