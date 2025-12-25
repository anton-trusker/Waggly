import { useScreenType } from './useScreenType';
import { designSystem } from '@/constants/designSystem';

// Desktop-specific theme extensions
export const desktopTheme = {
    layout: {
        sidebar: {
            width: 280,
            collapsedWidth: 80,
        },
        topbar: {
            height: 80,
        },
        contentMaxWidth: 1440,
        containerPadding: 64,
    },
    breakpoints: {
        mobile: 0,
        tablet: 768,
        desktop: 1024,
        wide: 1440,
    },
    spacing: {
        section: 48,
        containerX: 64,
        containerY: 40,
    },
    typography: {
        ...designSystem.typography,
        hero: {
            fontSize: 64,
            lineHeight: 72,
            fontWeight: '700',
        },
    },
    components: {
        ...designSystem.components,
        card: {
            ...designSystem.components.card,
            desktop: {
                padding: 32,
                borderRadius: 20,
                minHeight: 200,
            },
        },
    },
};

export interface PlatformUI {
    theme: typeof designSystem | typeof desktopTheme;
    spacing: typeof designSystem.spacing | typeof desktopTheme.spacing;
    isDesktop: boolean;
    isMobile: boolean;
    isTablet: boolean;
}

/**
 * Hook that returns platform-specific UI tokens
 * Uses screen type to determine which theme to return
 */
export const usePlatformUI = (): PlatformUI => {
    const { isDesktop, isMobile, isTablet } = useScreenType();

    return {
        theme: isDesktop ? desktopTheme : designSystem,
        spacing: isDesktop ? desktopTheme.spacing : designSystem.spacing,
        isDesktop,
        isMobile,
        isTablet,
    };
};
