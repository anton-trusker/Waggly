import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { designSystem } from '@/constants/designSystem';
import { getSpacing } from '@/utils/designSystem';
import { useLocale } from '@/hooks/useLocale';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { IconSymbolName } from '@/components/ui/IconSymbol';

interface QuickActionItem {
  iconName: IconSymbolName;
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}

const quickActionsData: QuickActionItem[] = [
  {
    iconName: 'note.text',
    label: 'Add Visit',
    onPress: () => router.push('/(tabs)/pets/add-visit'),
    accessibilityLabel: 'Add a new vet visit',
  },
  {
    iconName: 'pills.fill',
    label: 'Add Treatment',
    onPress: () => router.push('/(tabs)/pets/add-treatment'),
    accessibilityLabel: 'Add a new treatment',
  },
  {
    iconName: 'syringe.fill',
    label: 'Add Vaccine',
    onPress: () => router.push('/(tabs)/pets/add-vaccination'),
    accessibilityLabel: 'Add a new vaccination',
  },
  {
    iconName: 'heart.text.square.fill',
    label: 'Health Record',
    onPress: () => router.push('/(tabs)/pets/add-health-record'),
    accessibilityLabel: 'Log pet\'s health record',
  },
  {
    iconName: 'calendar',
    label: 'Add Event',
    onPress: () => router.push('/(tabs)/calendar/add-event'),
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
            <CategoryIcon
              icon={action.iconName}
              size={56}
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
    height: 'auto',
    backgroundColor: 'transparent',
    borderRadius: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: 'transparent',
    elevation: 0,
  },
  label: {
    ...designSystem.typography.body.small,
    color: designSystem.colors.text.primary,
    marginTop: designSystem.spacing[2],
    textAlign: 'center',
    paddingHorizontal: 0,
  },
});
