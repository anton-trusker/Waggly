export const colors = {
  primary: '#0A84FF',
  primaryLight: '#9CC6FF',
  primaryDark: '#0062D6',
  background: '#FFFFFF',
  backgroundGradientStart: '#A8D5FF',
  backgroundGradientEnd: '#E8F4FF',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#C7C7CC',
  accent: '#FF9500',
  success: '#10B981',
  warning: '#FF9500',
  error: '#EF4444',
  info: '#0A84FF',
  border: '#E5E7EB',
  separator: '#E5E7EB',
  highlight: '#F8FAFC',
  iconBackground: '#F8FAFC',
  iconBackgroundBlue: '#E3F2FF',
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
