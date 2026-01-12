import { usePostHog } from 'posthog-react-native';
import { useMemo } from 'react';

export interface RemoteBannerConfig {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    link?: string;
    active: boolean;
}

export function usePostHogExtras() {
    const posthog = usePostHog();

    /**
     * Get a banner configuration from PostHog feature flags.
     * Expects a feature flag (e.g., 'app-banner') with a JSON payload matching RemoteBannerConfig.
     */
    const getBanner = (flagName: string): RemoteBannerConfig | null => {
        const isEnabled = posthog.getFeatureFlag(flagName);
        const payload = posthog.getFeatureFlagPayload(flagName) as any;

        if (!isEnabled || !payload) return null;

        return {
            id: payload.id || flagName,
            title: payload.title || '',
            message: payload.message || '',
            type: payload.type || 'info',
            link: payload.link,
            active: !!isEnabled,
        };
    };

    /**
     * Simplified event tracking helper
     */
    const trackEvent = (name: string, properties?: Record<string, any>) => {
        posthog.capture(name, properties);
    };

    return {
        posthog,
        getBanner,
        trackEvent,
        featureFlags: posthog.getFeatureFlags(),
    };
}
