import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import { useEvents, EventType } from '@/hooks/useEvents';
import { usePersistentState } from '@/utils/persistentState';
import { usePets } from '@/hooks/usePets';
import { EventCard } from './EventCard';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { useLocale } from '@/hooks/useLocale';

export function UpcomingEvents() {
  const { t } = useLocale();
  const { pets } = usePets();
  const { state: lastSelectedPetId } = usePersistentState<string | null>('lastSelectedPetId', null);
  const selectedPet = pets.find(pet => pet.id === lastSelectedPetId) || pets[0];

  const { events } = useEvents();

  // Filter events for the selected pet and only show upcoming events
  const upcomingEvents = events
    .filter(event => {
      const eventDate = dayjs(event.date);
      const isUpcoming = eventDate.isSame(dayjs(), 'day') || eventDate.isAfter(dayjs(), 'day');
      const isForSelectedPet = selectedPet ? event.petId === selectedPet.id : true; // If no pet selected, show all
      return isUpcoming && isForSelectedPet;
    })
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  const handleEventPress = (eventId: string) => {
    router.push(`/(tabs)/calendar/event-detail?id=${eventId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('events.upcoming_events', { defaultValue: 'Upcoming Events' })}</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')} accessibilityLabel={t('common.view_all', { defaultValue: 'View all events' })}>
          <Text style={styles.viewAllText}>{t('common.view_all', { defaultValue: 'View All' })}</Text>
        </TouchableOpacity>
      </View>

      {upcomingEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{t('events.no_upcoming_for_pet', { defaultValue: 'No upcoming events for {{name}}.', name: selectedPet?.name || t('pets.your_pets', { defaultValue: 'your pets' }) })}</Text>
        </View>
      ) : (
        <FlatList
          data={upcomingEvents.slice(0, 3)} // Show top 3 upcoming events
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              id={item.id}
              type={item.type as EventType}
              title={item.title}
              date={item.date}
              time={item.time}
              petName={pets.find(p => p.id === item.petId)?.name || 'Unknown Pet'}
              onPress={handleEventPress}
            />
          )}
          scrollEnabled={false} // Disable scrolling as we only show a few items
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: getSpacing(6),
    paddingHorizontal: getSpacing(5),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing(4),
  },
  title: {
    ...designSystem.typography.title.medium,
    color: getColor('text.primary'),
  },
  viewAllText: {
    ...designSystem.typography.body.small,
    color: getColor('primary.500'),
    fontWeight: '600',
  },
  emptyState: {
    padding: getSpacing(5),
    backgroundColor: getColor('background.secondary'),
    borderRadius: designSystem.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...designSystem.shadows.sm,
  },
  emptyStateText: {
    ...designSystem.typography.body.medium,
    color: getColor('text.secondary'),
    textAlign: 'center',
  },
});
