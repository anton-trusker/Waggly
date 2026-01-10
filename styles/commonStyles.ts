import { StyleSheet, Platform } from 'react-native';
import { colors as themeColors, spacing, typography, borderRadius } from '@/constants/theme';

export const colors = themeColors;

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.card,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 14, // 14 to compensate for border width 2?
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  textWhite: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  textPrimary: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    maxWidth: 800,
    width: '100%',
  },
  title: {
    ...typography.title,
    marginBottom: spacing.s,
  },
  subtitle: {
    ...typography.subtitle,
    marginBottom: spacing.s,
  },
  text: typography.body,
  textSecondary: typography.caption,
  section: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: spacing.m,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.l,
    padding: spacing.m,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.m,
    paddingVertical: 14,
    paddingHorizontal: spacing.m,
    fontSize: 17,
    color: colors.text,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
