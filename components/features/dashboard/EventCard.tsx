import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import { EventType } from '@/hooks/useEvents';
import dayjs from 'dayjs';

interface EventCardProps {
  id: string;
  type: EventType;
  title: string;
  date: string;
  time?: string;
  petName: string;
  onPress: (id: string) => void;
}

const eventTypeIcons: Record<EventType, { icon: string; library: 'MaterialCommunityIcons' | 'FontAwesome5' }> = {
  vaccination: { icon: 'needle', library: 'MaterialCommunityIcons' },
  treatment: { icon: 'pill', library: 'MaterialCommunityIcons' },
  vet: { icon: 'stethoscope', library: 'FontAwesome5' },
  grooming: { icon: 'cut', library: 'MaterialCommunityIcons' },
  walking: { icon: 'dog-leash', library: 'MaterialCommunityIcons' },
  other: { icon: 'calendar-question', library: 'MaterialCommunityIcons' },
};

const eventTypeColors: Record<EventType, string> = {
  vaccination: designSystem.colors.success[500],
  treatment: designSystem.colors.warning[500],
  vet: designSystem.colors.error[500],
  grooming: designSystem.colors.primary[500],
  walking: designSystem.colors.secondary[500],
  other: designSystem.colors.warning[500],
};

export function EventCard({ id, type, title, date, time, petName, onPress }: EventCardProps) {
  const IconComponent = eventTypeIcons[type].library === 'MaterialCommunityIcons' ? MaterialCommunityIcons : FontAwesome5;
  const iconName = eventTypeIcons[type].icon;
  const eventColor = eventTypeColors[type];

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(id)} accessibilityRole="button" accessibilityLabel={`${title} for ${petName} on ${dayjs(date).format('MMMM D, YYYY')} at ${time || ''}`.trim()}>
      <View style={[styles.colorIndicator, { backgroundColor: eventColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <IconComponent name={iconName} size={18} color={eventColor} style={styles.icon} />
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        <Text style={styles.petName}>{petName}</Text>
        <Text style={styles.dateTime}>{dayjs(date).format('MMM D, YYYY')}{time && ` at ${time}`}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: designSystem.colors.background.secondary,
    borderRadius: designSystem.borderRadius.md,
    ...designSystem.shadows.sm,
    marginBottom: designSystem.spacing[3],
    overflow: 'hidden',
  },
  colorIndicator: {
    width: designSystem.spacing[2],
    height: '100%',
  },
  content: {
    flex: 1,
    padding: getSpacing(3),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(1),
  },
  icon: {
    marginRight: getSpacing(2),
  },
  title: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.primary,
    fontWeight: '600',
    flexShrink: 1,
  },
  petName: {
    ...designSystem.typography.body.small,
    color: designSystem.colors.text.secondary,
    marginBottom: designSystem.spacing[1],
  },
  dateTime: {
    ...designSystem.typography.body.small,
    color: getColor('text.tertiary'),
  },
});
