import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'visit',
    title: 'Add Visit',
    icon: 'hospital-box',
    route: '/(tabs)/pets/add-visit'
  },
  {
    id: 'treatment',
    title: 'Add Treatment',
    icon: 'medication',
    route: '/(tabs)/pets/add-treatment'
  },
  {
    id: 'vaccine',
    title: 'Add Vaccine',
    icon: 'needle',
    route: '/(tabs)/pets/add-vaccination'
  },
  {
    id: 'weight',
    title: 'Log Weight',
    icon: 'weight',
    route: '/(tabs)/pets/log-weight'
  },
  {
    id: 'event',
    title: 'Add Event',
    icon: 'calendar-plus',
    route: '/(tabs)/calendar/add-event'
  }
];

export function QuickActionsPanel() {
  const handleActionPress = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {quickActions.map((action) => (
          <View key={action.id} style={styles.actionItemContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => handleActionPress(action.route)}
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <MaterialCommunityIcons
                name={action.icon}
                size={40}
                color={colors.primary}
              />
            </TouchableOpacity>
            <Text style={styles.actionTitle} numberOfLines={2}>
              {action.title}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  scrollContainer: {
    paddingHorizontal: 0,
    gap: 8,
  },
  actionItemContainer: {
    alignItems: 'center',
    width: 60,
  },
  actionCard: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    paddingHorizontal: 0,
    minWidth: 48,
    minHeight: 48,
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 12,
  },
});
