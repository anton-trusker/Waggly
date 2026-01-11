import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';

interface HealthSummaryCardProps {
  iconName: string;
  iconLibrary: 'MaterialCommunityIcons' | 'FontAwesome5';
  label: string;
  value: string;
  context?: string;
  onPress: () => void;
  accessibilityLabel: string;
}

export function HealthSummaryCard({
  iconName,
  iconLibrary,
  label,
  value,
  context,
  onPress,
  accessibilityLabel,
}: HealthSummaryCardProps) {
  const IconComponent = iconLibrary === 'MaterialCommunityIcons' ? MaterialCommunityIcons : FontAwesome5;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <IconComponent name={iconName} size={designSystem.iconSizes.lg} color={getColor('primary.500')} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      {context && <Text style={styles.context} numberOfLines={1}>{context}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: getSpacing(40),
    height: getSpacing(30), // 120px
    backgroundColor: getColor('background.secondary'),
    borderRadius: designSystem.borderRadius.xl,
    padding: getSpacing(4),
    ...designSystem.shadows.sm,
    justifyContent: 'space-between',
  },
  icon: {
    marginBottom: getSpacing(2),
  },
  label: {
    ...designSystem.typography.body.small,
    color: getColor('text.secondary'),
    fontWeight: '500',
  },
  value: {
    ...designSystem.typography.headline.small,
    color: getColor('text.primary'),
    fontWeight: '700',
    marginTop: getSpacing(1),
  },
  context: {
    ...designSystem.typography.body.small,
    color: getColor('text.tertiary'),
    marginTop: getSpacing(1),
  },
});
