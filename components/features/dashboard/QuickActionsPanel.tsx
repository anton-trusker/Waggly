import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useAppTheme } from '@/hooks/useAppTheme';

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'visit',
    title: 'Add Visit',
    icon: 'note.text',
    route: '/(tabs)/pets/add-visit'
  },
  {
    id: 'vaccine',
    title: 'Add Vaccine',
    icon: 'syringe.fill',
    route: '/(tabs)/pets/add-vaccination'
  },
  {
    id: 'treatment',
    title: 'Add Meds',
    icon: 'pills.fill',
    route: '/(tabs)/pets/add-treatment'
  },
  {
    id: 'image',
    title: 'Add Image',
    icon: 'camera',
    route: '/(tabs)/pets/add-photos'
  },
  {
    id: 'document',
    title: 'Add File',
    icon: 'doc.fill',
    route: '/(tabs)/pets/add-document'
  },
  {
    id: 'record',
    title: 'Add Record',
    icon: 'doc.text.fill',
    route: '/(tabs)/pets/add-record'
  },
];

export function QuickActionsPanel() {
  const { colors } = useAppTheme();

  const handleActionPress = (route: string) => {
    router.push(route as any);
  };

  const dynamicStyles = {
    title: { color: colors.text.primary },
    text: { color: colors.text.primary }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, dynamicStyles.title]}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => handleActionPress(action.route)}
            activeOpacity={0.7}
          >
            <CategoryIcon
              icon={action.icon as any}
              size={48}
            />
            <Text style={[styles.actionTitle, dynamicStyles.text]}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'flex-start',
  },
  actionCard: {
    width: '22%', // Fits 4 columns nicely
    aspectRatio: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
});
