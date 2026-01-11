// Waggli Theme - Ocean Gradient
export const colors = {
  primary: '#0EA5E9', // Sky Blue
  primaryLight: '#7DD3FC',
  primaryDark: '#0284C7',
  secondary: '#10B981', // Emerald
  secondaryLight: '#6EE7B7',
  secondaryDark: '#059669',
  background: '#FFFFFF',
  backgroundGradientStart: '#E0F2FE', // Light sky blue
  backgroundGradientEnd: '#ECFDF5', // Light emerald
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#C7C7CC',
  accent: '#10B981', // Emerald as accent
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',
  border: '#E5E7EB',
  separator: '#E5E7EB',
  highlight: '#F0F9FF',
  iconBackground: '#F0F9FF',
  iconBackgroundBlue: '#E0F2FE',
  white: '#FFFFFF',
  errorLight: '#FEE2E2',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  title: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 22,
  },
  caption: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 20,
  },
};

export const borderRadius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 25,
  round: 9999,
};

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
};
