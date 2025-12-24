import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { getSpacing, getColor, getBorderRadius } from '@/utils/designSystem';

import { usePets } from '@/hooks/usePets';
import { useEvents, EventType } from '@/hooks/useEvents';
import { IconSymbol } from '@/components/ui/IconSymbol';
import CalendarMonthView from '@/components/features/calendar/CalendarMonthView';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useLocale } from '@/hooks/useLocale';
import EnhancedDropdown from '@/components/ui/EnhancedDropdown';
import { usePersistentState, persistentConfigs } from '@/utils/persistentState';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import AppHeader from '@/components/layout/AppHeader';
 

export default function CalendarScreen() {
  const { pets } = usePets();
  const { locale, t } = useLocale();
  
  // Persistent state management
  const { state: persistentFilters, setState: setPersistentFilters } = usePersistentState(
    persistentConfigs.calendarFilters.key,
    persistentConfigs.calendarFilters.defaultValue,
    { expiration: persistentConfigs.calendarFilters.expiration }
  );
  
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>(persistentFilters.selectedPetIds);
  const [selectedTypes, setSelectedTypes] = useState<EventType[] | undefined>(persistentFilters.selectedTypes);
  
  // State for calendar navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Selected date state - default to today
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Calculate start and end of the currently viewed month
  const viewStart = useMemo(() => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    d.setDate(d.getDate() - 7); 
    return d.toISOString().split('T')[0];
  }, [currentDate]);

  const viewEnd = useMemo(() => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }, [currentDate]);

  // Fetch events for the month (for markers)
  const { events: monthEvents, loading: loadingMonth, filters, setFilters, refreshEvents } = useEvents({
    petIds: selectedPetIds.length > 0 ? selectedPetIds : undefined,
    types: selectedTypes,
    startDate: viewStart,
    endDate: viewEnd,
  });

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const localizedMonthLabel = currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  const petOptions = useMemo(() => pets.map((p) => ({ label: p.name, value: p.id })), [pets]);

  // Markers for calendar
  const markers = useMemo(() => {
    const map: Record<string, string[]> = {};
    monthEvents.forEach((e) => {
      const iso = e.dueDate.slice(0, 10);
      if (!map[iso]) map[iso] = [];
      if (map[iso].length < 3) map[iso].push(e.color);
    });
    return map;
  }, [monthEvents]);

  // Filter events for the SELECTED DATE
  const selectedDayEvents = useMemo(() => {
      return monthEvents.filter(e => e.dueDate.startsWith(selectedDate));
  }, [monthEvents, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      refreshEvents();
    }, [refreshEvents])
  );

  return (
    <View style={styles.container}>
      <AppHeader title={t('navigation.calendar', { defaultValue: 'Calendar' })} />
      <View style={styles.headerContainer}>
        <View style={styles.monthHeader}>
          <EnhancedButton
            title=""
            icon="chevron.left"
            variant="ghost"
            size="sm"
            onPress={goToPrevMonth}
            style={styles.monthNavButton}
          />
          <Text style={styles.monthLabel}>{localizedMonthLabel}</Text>
          <EnhancedButton
            title=""
            icon="chevron.right"
            variant="ghost"
            size="sm"
            onPress={goToNextMonth}
            style={styles.monthNavButton}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingMonth}
            onRefresh={refreshEvents}
            tintColor={getColor('primary.500')}
            colors={[getColor('primary.500')]}
          />
        }
      >
        <CalendarMonthView
          year={currentDate.getFullYear()}
          month={currentDate.getMonth()}
          selected={selectedDate}
          onSelect={setSelectedDate}
          markers={markers}
          locale={locale}
        />

        <View style={styles.filters}>
          <EnhancedDropdown
            label={t('calendar.filter_by_pet', { defaultValue: 'Filter by pet' })}
            options={petOptions}
            selectedValues={selectedPetIds}
            onSelect={(values) => {
              setSelectedPetIds(values);
              setPersistentFilters({ ...persistentFilters, selectedPetIds: values });
            }}
            multiSelect
            placeholder={t('calendar.all_pets', { defaultValue: 'All Pets' })}
            style={styles.filterDropdown}
          />
        </View>

        <View style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
                <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={18} color={getColor('primary.500')} />
                <Text style={styles.sectionTitle}>
                    {new Date(selectedDate).toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
            </View>

            {loadingMonth ? (
                <ActivityIndicator style={{ padding: 20 }} />
            ) : selectedDayEvents.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>{t('calendar.no_events_for_day', { defaultValue: 'No events for this day' })}</Text>
                    <TouchableOpacity style={styles.addEventButton} onPress={() => router.push('/(tabs)/calendar/add-event')}>
                        <Text style={styles.addEventText}>{t('calendar.add_event', { defaultValue: 'Add Event' })}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.eventList}>
                    {selectedDayEvents.map((event) => (
                         <TouchableOpacity 
                            key={event.id} 
                            style={styles.eventCard}
                            onPress={() => {
                                if (event.relatedId) {
                                    if (event.type === 'vaccination') router.push(`/(tabs)/pets/record-detail?type=vaccination&id=${event.relatedId}`);
                                    else if (event.type === 'treatment') router.push(`/(tabs)/pets/record-detail?type=treatment&id=${event.relatedId}`);
                                    else if (event.type === 'vet') router.push(`/(tabs)/pets/record-detail?type=visit&id=${event.relatedId}`);
                                }
                            }}
                         >
                             <View style={[styles.eventTimeBox, { backgroundColor: event.color + '20' }]}>
                                 <Text style={[styles.eventTime, { color: event.color }]}>
                                     {new Date(event.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </Text>
                             </View>
                             <View style={styles.eventDetails}>
                                 <Text style={styles.eventTitle}>{event.title}</Text>
                                 <View style={styles.eventMeta}>
                                     {event.petName && <Text style={styles.eventPet}>{event.petName}</Text>}
                                     <View style={[styles.eventTypeTag, { backgroundColor: event.color + '20' }]}>
                                         <Text style={[styles.eventTypeText, { color: event.color }]}>{event.type}</Text>
                                     </View>
                                 </View>
                             </View>
                             <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={16} color={getColor('text.tertiary')} />
                         </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor('background.primary'),
  },
  headerContainer: {
    paddingTop: getSpacing(4),
    paddingHorizontal: getSpacing(5),
    backgroundColor: getColor('background.primary'),
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: getSpacing(5),
    paddingBottom: getSpacing(16),
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing(4),
    backgroundColor: getColor('background.secondary'),
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: getColor('border.primary'),
  },
  monthNavButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    ...designSystem.typography.title.medium,
    color: getColor('text.primary'),
  },
  filters: {
    marginBottom: getSpacing(4),
  },
  filterDropdown: {
    marginBottom: 0,
  },
  eventsSection: {
    backgroundColor: getColor('background.secondary'),
    borderRadius: 16,
    padding: 16,
    minHeight: 200,
    borderWidth: 1,
    borderColor: getColor('border.primary'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: getColor('border.primary'),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: getColor('text.primary'),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: getColor('text.secondary'),
    marginBottom: 16,
  },
  addEventButton: {
    backgroundColor: getColor('primary.500'),
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addEventText: {
    color: '#fff',
    fontWeight: '600',
  },
  eventList: {
    gap: 12,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: getColor('background.primary'),
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: getColor('border.primary'),
  },
  eventTimeBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  eventTime: {
    fontSize: 12,
    fontWeight: '700',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: getColor('text.primary'),
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventPet: {
    fontSize: 12,
    color: getColor('text.secondary'),
  },
  eventTypeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  eventTypeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
