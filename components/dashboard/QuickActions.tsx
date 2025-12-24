import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { designSystem } from '@/constants/designSystem';
import { getSpacing } from '@/utils/designSystem';
import { useLocale } from '@/hooks/useLocale';

interface QuickActionItem {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}

const quickActionsData: QuickActionItem[] = [
  {
    iconName: 'medical-bag',
    label: 'Add Visit',
    onPress: () => router.push('/(tabs)/pets/add-visit'),
    accessibilityLabel: 'Add a new vet visit',
  },
  {
    iconName: 'pill',
    label: 'Add Treatment',
    onPress: () => router.push('/(tabs)/pets/add-treatment'),
    accessibilityLabel: 'Add a new treatment',
  },
  {
    iconName: 'needle',
    label: 'Add Vaccine',
    onPress: () => router.push('/(tabs)/pets/add-vaccination'),
    accessibilityLabel: 'Add a new vaccination',
  },
  {
    iconName: 'weight-scale',
    label: 'Log Weight',
    onPress: () => router.push('/(tabs)/pets/log-weight'), // Assuming a log-weight screen/modal
    accessibilityLabel: 'Log pet\'s weight',
  },
  {
    iconName: 'calendar-plus',
    label: 'Add Event',
    onPress: () => router.push('/(tabs)/calendar/add-event'), // Assuming an add-event screen
    accessibilityLabel: 'Add a new event to the calendar',
  },
];

export function QuickActions() {
  const { t } = useLocale();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('common.quick_actions', { defaultValue: 'Quick Actions' })}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {quickActionsData.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={t(action.accessibilityLabel, { defaultValue: action.accessibilityLabel })}
          >
            <MaterialCommunityIcons 
              name={action.iconName} 
              size={designSystem.spacing[8]} 
              color={designSystem.colors.primary[500]} 
            />
            <Text style={styles.label}>{t(action.label, { defaultValue: action.label })}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: getSpacing(6),
  },
  title: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
    marginBottom: designSystem.spacing[4],
    paddingHorizontal: designSystem.spacing[5],
  },
  scrollViewContent: {
    paddingHorizontal: designSystem.spacing[5],
    gap: getSpacing(3),
  },
  card: {
    width: designSystem.spacing[25],
    height: designSystem.spacing[25],
    backgroundColor: designSystem.colors.background.secondary,
    borderRadius: designSystem.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...designSystem.shadows.sm,
  },
  label: {
    ...designSystem.typography.body.small,
    color: designSystem.colors.text.primary,
    marginTop: designSystem.spacing[2],
    textAlign: 'center',
    paddingHorizontal: getSpacing(2),
  },
});
