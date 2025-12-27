import { createTamagui, createTokens } from 'tamagui';
import { shorthands } from '@tamagui/shorthands';
import { themes as defaultThemes, tokens as defaultTokens } from '@tamagui/themes';
import { createInterFont } from '@tamagui/font-inter';
import { createAnimations } from '@tamagui/animations-react-native';
import { colors } from './design-system/tokens/colors';
import { spacing } from './design-system/tokens/spacing';
import { typography } from './design-system/tokens/typography';
import { radii } from './design-system/tokens/radii';

// Create fonts using our typography tokens
const interFont = createInterFont({
    size: {
        // Map numeric steps to our values, plus add semantic aliases
        1: typography.fontSize.xs,
        2: typography.fontSize.sm,
        3: typography.fontSize.base,
        4: typography.fontSize.lg,
        5: typography.fontSize.xl,
        6: typography.fontSize['2xl'],
        7: typography.fontSize['3xl'],
        8: typography.fontSize['4xl'],
        9: typography.fontSize['5xl'],
        10: typography.fontSize['6xl'],
        // Semantic aliases for usage like fontSize="$xl"
        xs: typography.fontSize.xs,
        sm: typography.fontSize.sm,
        base: typography.fontSize.base,
        lg: typography.fontSize.lg,
        xl: typography.fontSize.xl,
        '2xl': typography.fontSize['2xl'],
        '3xl': typography.fontSize['3xl'],
        true: typography.fontSize.base, // Default
    },
    weight: {
        4: '400',
        5: '500',
        6: '600',
        7: '700',
    },
});

// Create tokens from our design system
const tokens = createTokens({
    color: colors,
    space: spacing,
    size: spacing, // Use spacing for sizes too
    radius: radii,
    zIndex: {
        0: 0,
        1: 100,
        2: 200,
        3: 300,
        4: 400,
        5: 500,
    },
});

// Create animations
const animations = createAnimations({
    bouncy: {
        type: 'spring',
        damping: 10,
        mass: 0.9,
        stiffness: 100,
    },
    lazy: {
        type: 'spring',
        damping: 20,
        stiffness: 60,
    },
    quick: {
        type: 'spring',
        damping: 20,
        mass: 1.2,
        stiffness: 250,
    },
    fast: {
        type: 'spring',
        damping: 15,
        mass: 0.8,
        stiffness: 300,
    },
    slow: {
        type: 'spring',
        damping: 20,
        stiffness: 40,
    },
});

// Create the configuration
const config = createTamagui({
    animations,
    defaultTheme: 'light',
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
    shorthands,
    fonts: {
        heading: interFont,
        body: interFont,
    },
    themes: {
        light: {
            background: colors.background,
            backgroundHover: colors.gray100,
            backgroundPress: colors.gray200,
            backgroundFocus: colors.gray100,
            borderColor: colors.borderLight,
            borderColorHover: colors.borderMedium,
            borderColorFocus: colors.primary500,
            color: colors.textPrimary,
            colorHover: colors.textPrimary,
            colorPress: colors.textPrimary,
            colorFocus: colors.textPrimary,
            colorTransparent: 'transparent',
            placeholderColor: colors.textTertiary,
            shadowColor: colors.black,
            shadowColorHover: colors.black,
            shadowColorPress: colors.black,
            shadowColorFocus: colors.black,
        },
        dark: {
            background: colors.gray900,
            backgroundHover: colors.gray800,
            backgroundPress: colors.gray700,
            backgroundFocus: colors.gray800,
            borderColor: colors.gray700,
            borderColorHover: colors.gray600,
            borderColorFocus: colors.primary500,
            color: colors.white,
            colorHover: colors.white,
            colorPress: colors.white,
            colorFocus: colors.white,
            colorTransparent: 'transparent',
            placeholderColor: colors.gray400,
            shadowColor: colors.black,
            shadowColorHover: colors.black,
            shadowColorPress: colors.black,
            shadowColorFocus: colors.black,
        },
    },
    tokens,
    media: {
        xs: { maxWidth: 660 },
        sm: { maxWidth: 800 },
        md: { maxWidth: 1020 },
        lg: { maxWidth: 1280 },
        xl: { maxWidth: 1420 },
        xxl: { maxWidth: 1600 },
        gtXs: { minWidth: 660 + 1 },
        gtSm: { minWidth: 800 + 1 },
        gtMd: { minWidth: 1020 + 1 },
        gtLg: { minWidth: 1280 + 1 },
        short: { maxHeight: 820 },
        tall: { minHeight: 820 },
        hoverNone: { hover: 'none' },
        pointerCoarse: { pointer: 'coarse' },
    },
});

type Conf = typeof config;

declare module 'tamagui' {
    interface TamaguiCustomConfig extends Conf { }
}

export default config;
