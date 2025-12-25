import { useState, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';

export type ScreenType = 'mobile' | 'tablet' | 'desktop' | 'wide';

interface UseScreenTypeReturn {
    screenType: ScreenType;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isWide: boolean;
    width: number;
    height: number;
}

/**
 * Hook to determine the current screen type based on window dimensions
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop: 1024px - 1439px
 * - Wide: >= 1440px
 */
export const useScreenType = (): UseScreenTypeReturn => {
    const { width, height } = useWindowDimensions();

    const getScreenType = useCallback((w: number): ScreenType => {
        if (w < 768) return 'mobile';
        if (w < 1024) return 'tablet';
        if (w < 1440) return 'desktop';
        return 'wide';
    }, []);

    const screenType = getScreenType(width);

    return {
        screenType,
        isMobile: screenType === 'mobile',
        isTablet: screenType === 'tablet',
        isDesktop: screenType === 'desktop' || screenType === 'wide',
        isWide: screenType === 'wide',
        width,
        height,
    };
};
