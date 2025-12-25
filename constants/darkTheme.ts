import { designSystem } from './designSystem';

export const darkTheme = {
    ...designSystem,
    colors: {
        ...designSystem.colors,
        // Neutral Colors - Inverted/Shifted for Dark Mode
        neutral: {
            0: '#111827', // Darkest background (was white)
            50: '#1F2937',
            100: '#374151',
            200: '#4B5563',
            300: '#6B7280',
            400: '#9CA3AF',
            500: '#D1D5DB',
            600: '#E5E7EB',
            700: '#F3F4F6',
            800: '#F9FAFB',
            900: '#FFFFFF',
            1000: '#FFFFFF',
        },

        // Background Colors
        background: {
            primary: '#000000', // AMOLED Black or very dark gray
            secondary: '#111827',
            tertiary: '#1F2937',
            gradient: {
                start: '#001C3D',
                end: '#003170',
            },
        },

        // Text Colors
        text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            tertiary: '#9CA3AF',
            quaternary: '#6B7280',
            inverse: '#111827',
        },

        // Border Colors
        border: {
            primary: '#374151',
            secondary: '#4B5563',
            focus: '#33B4FF',
        },

        // Overlay colors
        overlay: {
            default: 'rgba(0, 0, 0, 0.7)',
            strong: 'rgba(0, 0, 0, 0.9)',
        },
    },
    // Update shadows to be visible on dark background? usually harder.
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 2,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 4,
        },
        xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 8,
        },
    }
};
