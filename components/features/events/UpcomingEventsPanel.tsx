import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEvents } from '@/hooks/useEvents';
import { router } from 'expo-router';
import { useLocale } from '@/hooks/useLocale';

interface UpcomingEventsPanelProps {
  petId?: string;
  showAll?: boolean;
}

export default function UpcomingEventsPanel({ petId, showAll = false }: UpcomingEventsPanelProps) {
  const { t } = useLocale();
  const [filterType, setFilterType] = useState<'all' | 'vaccination' | 'visit' | 'treatment'>('all');
  const { events, loading, error, refresh } = useEvents({
    petIds: petId ? [petId] : [],
    startDate: showAll ? undefined : new Date().toISOString().slice(0, 10),
    endDate: undefined,
    types: undefined,
  });

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter(event => new Date(event.dueDate) >= now);
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return upcomingEvents;
    if (filterType === 'visit') return upcomingEvents.filter(e => e.type === 'vet');
    return upcomingEvents.filter(e => e.type === filterType);
  }, [upcomingEvents, filterType]);

  const handleRetry = useCallback(() => {
    refresh();
  }, [refresh]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('events.failed_to_load', { defaultValue: 'Failed to load events' })}</Text>
        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('common.retry', { defaultValue: 'Retry' })}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={18} color={colors.primary} />
        <Text style={styles.sectionTitle}>{t('events.upcoming_events', { defaultValue: 'Upcoming Events' })}</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterRow}
      >
        {(['all', 'vaccination', 'visit', 'treatment'] as const).map(t => (
          <TouchableOpacity 
            key={t} 
            style={[styles.filterChip, filterType === t && styles.filterChipActive]}
            onPress={() => setFilterType(t)}
          >
            <Text style={[styles.filterChipText, filterType === t && styles.filterChipTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {loading && events.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : filteredEvents.length === 0 ? (
        <Text style={styles.emptyText}>{t('events.no_upcoming', { defaultValue: 'No upcoming events found' })}</Text>
      ) : (
        <View>
          {filteredEvents.map((e, index) => {
            const date = new Date(e.dueDate);
            const currentYear = new Date().getFullYear();
            const eventYear = date.getFullYear();
            const showYear = eventYear !== currentYear;
            
            return (
              <TouchableOpacity
                key={e.id}
                style={[styles.eventItem, index === filteredEvents.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => {
                  if (e.relatedId) {
                    if (e.type === 'vaccination') {
                      router.push(`/(tabs)/pets/record-detail?type=vaccination&id=${e.relatedId}`);
                    } else if (e.type === 'treatment') {
                      router.push(`/(tabs)/pets/record-detail?type=treatment&id=${e.relatedId}`);
                    } else if (e.type === 'vet') {
                      router.push(`/(tabs)/pets/record-detail?type=visit&id=${e.relatedId}`);
                    }
                  }
                }}
              >
                <View style={styles.eventDateBox}>
                  <Text style={styles.eventDay}>{date.getDate()}</Text>
                  <Text style={styles.eventMonth}>{date.toLocaleString('default', { month: 'short' })}</Text>
                  {showYear && <Text style={styles.eventYear}>{eventYear}</Text>}
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{e.title}</Text>
                  <View style={styles.eventMetaRow}>
                    <View style={[styles.eventTypeTag, { backgroundColor: e.type === 'vaccination' ? '#DCFCE7' : e.type === 'treatment' ? '#F3E8FF' : '#E0F2FE' }]}>
                      <Text style={[styles.eventTypeText, { color: e.type === 'vaccination' ? '#16A34A' : e.type === 'treatment' ? '#9333EA' : '#0284C7' }]}>
                        {e.type === 'vet' ? 'Visit' : e.type.charAt(0).toUpperCase() + e.type.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
                <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  filterRow: {
    marginBottom: 16,
    gap: 8,
    paddingHorizontal: 8,
  },
  filterChip: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.card,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: colors.errorLight,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eventDateBox: {
    width: 50,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },
  eventDay: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  eventMonth: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  eventYear: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 2,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  eventTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  eventTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
})
