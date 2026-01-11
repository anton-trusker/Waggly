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
    icon: 'cross.vial',
    androidIcon: 'vaccines',
    route: '/(tabs)/pets/add-vaccination'
  },
  {
    id: 'treatment',
    title: 'Add Meds',
    icon: 'pills',
    androidIcon: 'medication',
    route: '/(tabs)/pets/add-treatment'
  },
  {
    id: 'image',
    title: 'Add Image',
    icon: 'camera',
    androidIcon: 'add-a-photo',
    route: '/(tabs)/pets/add-photos'
  },
  {
    id: 'document',
    title: 'Add File',
    icon: 'doc',
    androidIcon: 'folder',
    route: '/(tabs)/pets/add-document' // Ensure this route exists or redirect to details->docs
  },
  {
    id: 'record',
    title: 'Add Record',
    icon: 'doc.text',
    androidIcon: 'article',
    route: '/(tabs)/pets/add-record' // Placeholder or generic wizard
  },
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
      backgroundColor: colors.background.secondary, // White background for contrast
      borderWidth: 1,
      borderColor: colors.border.primary, // Subtle border
    },
    text: { color: colors.text.primary }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, dynamicStyles.title]}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, dynamicStyles.card] as any}
            onPress={() => handleActionPress(action.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.primary[50] }]}>
              <IconSymbol
                ios_icon_name={action.icon as any}
                android_material_icon_name={action.androidIcon as any}
                size={24} // Smaller icon
                color={colors.primary[600]} // Darker primary for contrast
              />
            </View>
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
    marginBottom: 12, // Tighter spacing
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Consistent gap
    justifyContent: 'flex-start',
  },
  actionCard: {
    width: '14%', // Fits 4 columns (approx 80px on standard mobile)
    aspectRatio: 0.9, // Slightly taller/squarish
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2, // Minimal padding
    gap: 4, // Tighter gap
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  iconCircle: {
    width: 32, // Tighter circle around 24px icon
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12, // Tight line height for multiline wrapping
  },
});
