import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

type Props = {
  label: string;
  tone?: 'success' | 'warning' | 'error' | 'info' | 'default';
};

export default function StatusBadge({ label, tone = 'default' }: Props) {
  const c = toneColors[tone] || toneColors.default;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }]}> 
      <Text style={[styles.text, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const toneColors = {
  success: { bg: '#E8FFF3', border: colors.success, text: colors.success },
  warning: { bg: '#FFF9E8', border: colors.warning, text: colors.warning },
  error: { bg: '#FFECEE', border: colors.error, text: colors.error },
  info: { bg: '#EAF3FF', border: colors.primary, text: colors.primary },
  default: { bg: colors.card, border: colors.border, text: colors.textSecondary },
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});

