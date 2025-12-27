// Paw_AI Color Design Tokens
// Based on your current brand colors

export const colors = {
    // Primary - Indigo (your main brand color #6366F1)
    primary50: '#EEF2FF',
    primary100: '#E0E7FF',
    primary200: '#C7D2FE',
    primary300: '#A5B4FC',
    primary400: '#818CF8',
    primary500: '#6366F1', // Main brand
    primary600: '#4F46E5',
    primary700: '#4338CA',
    primary800: '#3730A3',
    primary900: '#312E81',

    // Success - Green
    success50: '#ECFDF5',
    success100: '#D1FAE5',
    success500: '#10B981',
    success600: '#059669',
    success700: '#047857',

    // Warning - Amber
    warning50: '#FFFBEB',
    warning100: '#FEF3C7',
    warning500: '#F59E0B',
    warning600: '#D97706',
    warning700: '#B45309',

    // Error - Red
    error50: '#FEF2F2',
    error100: '#FEE2E2',
    error500: '#EF4444',
    error600: '#DC2626',
    error700: '#B91C1C',

    // Info - Blue
    info50: '#EFF6FF',
    info100: '#DBEAFE',
    info500: '#3B82F6',
    info600: '#2563EB',
    info700: '#1D4ED8',

    // Neutral - Gray scale
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Special
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // App specific (from your current design)
    background: '#F6F6F8',
    backgroundCard: '#FFFFFF',
    backgroundElevated: '#FFFFFF',

    // Text
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverted: '#FFFFFF',

    // Borders
    borderLight: '#E5E7EB',
    borderMedium: '#D1D5DB',
    borderDark: '#9CA3AF',
};

export type ColorToken = keyof typeof colors;
