import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEvents } from '@/hooks/useEvents';
import { router } from 'expo-router';
import { useLocale } from '@/hooks/useLocale';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PetImage } from '@/components/ui/PetImage';

interface UpcomingEventsPanelProps {
  petId?: string;
  showAll?: boolean;
}

export default function UpcomingEventsPanel({ petId, showAll = false }: UpcomingEventsPanelProps) {
  const { t } = useLocale();
  const { colors } = useAppTheme();
  // We can keep the filter logic or simplify it based on the design which is just "Upcoming Care" list
  // The design shows a list without visible filters, but filters are good UX. Let's keep them if they fit or just show list.
  // The design doesn't explicitly show filters, just a list. I'll stick to a list for now to match the "timeline" look closely.

  const { events, loading, error, refresh } = useEvents({
    petIds: petId ? [petId] : [],
    startDate: new Date().toISOString().slice(0, 10),
    endDate: undefined,
    types: undefined,
  });

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter(event => new Date(event.dueDate) >= now).slice(0, 5); // Limit to 5 for dashboard
  }, [events]);

  const handleRetry = useCallback(() => {
    refresh();
  }, [refresh]);

  // Dynamic styles
  const dynamicStyles = {
    title: { color: colors.text.primary },
    link: { color: colors.success[500] }, // green
    card: { backgroundColor: colors.background.tertiary }, // white/dark-slate
    textPrimary: { color: colors.text.primary },
    textSecondary: { color: colors.text.secondary },
    timelineLine: { backgroundColor: colors.neutral[200] },
  };

  if (error) {
    // keeping simplistic error view for now
    return null;
  }

  if (loading && events.length === 0) {
    return <ActivityIndicator size="small" color={colors.primary[500]} />;
  }

  if (upcomingEvents.length === 0) {
    return null; // Don't show section if empty
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, dynamicStyles.title]}>{t('events.upcoming_care', { defaultValue: 'Upcoming Care' })}</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')}>
          <Text style={[styles.link, dynamicStyles.link]}>View Calendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {upcomingEvents.map((e, index) => {
          const date = new Date(e.dueDate);
          const isLast = index === upcomingEvents.length - 1;

          // Icon logic
          let iconName = 'calendar';
          let iconColor = colors.primary[500];
          let iconBg = colors.primary[50];

          if (e.type === 'vaccination') {
            iconName = 'cross.vial'; // approx
            iconColor = colors.error[500]; // Red for medical/high priority often
            iconBg = colors.error[50];
          } else if (e.type === 'treatment') {
            iconName = 'pills';
            iconColor = colors.primary[500]; // Blue/Purple
            iconBg = colors.primary[50];
          } else if (e.type === 'grooming') {
            iconName = 'scissors';
            iconColor = '#A855F7'; // Purple
            iconBg = '#F3E8FF';
          }

          return (
            <View key={e.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                  <IconSymbol
                    ios_icon_name={iconName as any}
                    android_material_icon_name="event" // generic fallback or map properly
                    size={20}
                    color={iconColor}
                  />
                </View>
                {!isLast && <View style={[styles.timelineLine, dynamicStyles.timelineLine]} />}
              </View>

              <TouchableOpacity
                style={[styles.eventCard, dynamicStyles.card]}
                onPress={() => {
                  // Navigate to detail
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
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View>
                    {/* High Priority Badge - mock logic */}
                    {e.type === 'vaccination' && (
                      <View style={styles.priorityBadge}>
                        <Text style={styles.priorityText}>HIGH PRIORITY</Text>
                      </View>
                    )}
                    <Text style={[styles.eventTitle, dynamicStyles.textPrimary]}>{e.title}</Text>
                    <View style={styles.metaRow}>
                      <IconSymbol ios_icon_name="calendar" android_material_icon_name="calendar-today" size={14} color={colors.text.tertiary} />
                      <Text style={[styles.eventTime, dynamicStyles.textSecondary]}>
                        {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  {/* Pet Avatar if available */}
                  {/* Assuming we might have pet photo url in event or need to fetch. 
                             For now, let's use a small placeholder or skip if not in event data easily.
                             The generic hook returns standard event structure.
                          */}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 1,
    flex: 1, // fill height
    minHeight: 40, // ensure visible if content is short
    backgroundColor: '#E5E7EB',
    marginTop: -4, // tuck under icon slightly
    marginBottom: -4,
  },
  eventCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priorityBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // red-500/10
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  priorityText: {
    color: '#EF4444', // red-500
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventTime: {
    fontSize: 13,
  },
});
