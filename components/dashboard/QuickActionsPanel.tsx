import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppTheme } from '@/hooks/useAppTheme';

interface QuickAction {
  id: string;
  title: string;
  icon: string; // Using IconSymbol names
  androidIcon: string;
  route: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'visit',
    title: 'Add Visit',
    icon: 'note.text',
    androidIcon: 'event-note',
    route: '/(tabs)/pets/add-visit'
  },
  {
    id: 'vaccine',
    title: 'Add Vaccine',
    icon: 'cross.vial', // approx
    androidIcon: 'vaccines',
    route: '/(tabs)/pets/add-vaccination'
  },
  {
    id: 'treatment',
    title: 'Add Treatment',
    icon: 'pills',
    androidIcon: 'medication',
    route: '/(tabs)/pets/add-treatment'
  },
  {
    id: 'image',
    title: 'Add Image',
    icon: 'camera',
    androidIcon: 'add-a-photo',
    route: '/(tabs)/pets/add-image' // Ensure this route exists or update
  },
  {
    id: 'document',
    title: 'Add Document',
    icon: 'folder',
    androidIcon: 'folder',
    route: '/(tabs)/pets/add-document' // Ensure this route exists
  },
  {
    id: 'record',
    title: 'Add Record',
    icon: 'doc.text',
    androidIcon: 'article',
    route: '/(tabs)/pets/add-record' // Ensure this route exists
  }
];

export function QuickActionsPanel() {
  const { colors } = useAppTheme();

  const handleActionPress = (route: string) => {
    // Basic route check logic or directly push if all routes are safe
    router.push(route as any);
  };

  const dynamicStyles = {
    title: { color: colors.text.primary },
    card: {
      backgroundColor: colors.background.tertiary, // card background
      // shadow logic could vary
    },
    text: { color: colors.text.primary } // or gray-800/200 logic
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, dynamicStyles.title]}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, dynamicStyles.card]}
            onPress={() => handleActionPress(action.route)}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name={action.icon as any}
              android_material_icon_name={action.androidIcon as any}
              size={32}
              color={colors.primary[500]}
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
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // tailwind gap-4 approx
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '30%', // Grid cols 3 approx
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  actionTitle: {
    fontSize: 12, // text-xs font-semibold
    fontWeight: '600',
    textAlign: 'center',
  },
});
