import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, useWindowDimensions, ViewStyle } from 'react-native';
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
import MobileHeader from '@/components/layout/MobileHeader';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import DesktopCalendarHeader from '@/components/desktop/calendar/DesktopCalendarHeader';
import MobileCalendarView from '@/components/mobile/calendar/MobileCalendarView';
import DesktopTimelineView from '@/components/desktop/calendar/DesktopTimelineView'; // Keeping for potential week/day view ref
import DesktopCalendarMonthGrid from '@/components/desktop/calendar/DesktopCalendarMonthGrid';


export default function CalendarScreen() {
  const { pets } = usePets();
  const { locale, t } = useLocale();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  // Persistent state management
  const { state: persistentFilters, setState: setPersistentFilters } = usePersistentState(
    persistentConfigs.calendarFilters.key,
    persistentConfigs.calendarFilters.defaultValue,
    { expiration: persistentConfigs.calendarFilters.expiration }
  );


  const [selectedPetIds, setSelectedPetIds] = useState<string[]>(persistentFilters.selectedPetIds || []);
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>((persistentFilters.selectedTypes as EventType[]) || []);

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

  // Use mobile view component for mobile devices
  if (isMobile) {
    return (
      <>
        <MobileHeader showLogo={true} showNotifications={true} />
        <MobileCalendarView events={monthEvents} pets={pets} />
      </>
    );
  }

  // Desktop view  
  return (
    <DesktopShell>
      {isDesktop && (
        <DesktopCalendarHeader
          currentMonth={currentDate}
          onMonthChange={setCurrentDate}
          pets={pets}
          selectedPets={selectedPetIds}
          onPetsChange={(ids) => {
            setSelectedPetIds(ids);
            setPersistentFilters({ ...persistentFilters, selectedPetIds: ids });
          }}
          selectedTypes={selectedTypes}
          onTypesChange={(types) => {
            setSelectedTypes(types);
            setPersistentFilters({ ...persistentFilters, selectedTypes: types });
          }}
        />
      )}

      {isDesktop ? (
        <View style={styles.container as ViewStyle}>
          <DesktopCalendarMonthGrid
            events={monthEvents as any} // Cast safely or verify type match
            currentMonth={currentDate}
            onDateSelect={(date) => {
              // Optional: handle date selection (e.g. show day view modal)
              setSelectedDate(date.toISOString().slice(0, 10));
            }}
            onEventClick={(event) => {
              if (event.relatedId) {
                if (event.type === 'vaccination') router.push(`/(tabs)/pets/record-detail?type=vaccination&id=${event.relatedId}` as any);
                else if (event.type === 'treatment') router.push(`/(tabs)/pets/record-detail?type=treatment&id=${event.relatedId}` as any);
                else if (event.type === 'vet') router.push(`/(tabs)/pets/record-detail?type=visit&id=${event.relatedId}&screen=VisitDetail` as any);
                // Note: updated vet route to match pattern if needed
              }
            }}
          />
        </View>
      ) : (
        <View style={styles.container as ViewStyle}>
          <AppHeader title={t('navigation.calendar', { defaultValue: 'Calendar' })} />
          {/* Fallback for tablet/non-desktop width that isn't caught by isMobile (768-1024) - reusing old view or MobileCalendarView? 
                The explicit isMobile check above returns early for < 768. 
                So this else block is for 768 <= width < 1024. 
                Let's use MobileCalendarView here too as it's adaptive enough, or stick to a simplified list?
                Actually, let's use MobileCalendarView for this range too for consistency. 
            */}
          <MobileCalendarView events={monthEvents} pets={pets} />
        </View>
      )}
    </DesktopShell>
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
