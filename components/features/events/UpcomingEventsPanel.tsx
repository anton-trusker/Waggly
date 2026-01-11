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
    card: { backgroundColor: colors.background.secondary }, // White cards
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

  const getEventStyles = (type: string) => {
    switch (type) {
      case 'vaccination':
        return {
          bg: '#FEF2F2', // red-50
          text: '#EF4444', // red-500
          icon: 'cross.vial',
          iconName: 'vaccines',
          borderColor: '#FECACA',
        };
      case 'medication':
      case 'treatment':
        return {
          bg: '#EFF6FF', // blue-50
          text: '#3B82F6', // blue-500
          icon: 'pills',
          iconName: 'medication',
          borderColor: '#BFDBFE',
        };
      case 'grooming':
        return {
          bg: '#FAF5FF', // purple-50
          text: '#A855F7', // purple-500
          icon: 'scissors',
          iconName: 'content_cut',
          borderColor: '#E9D5FF',
        };
      default: // visit/checkup
        return {
          bg: '#F0FDFA', // teal-50
          text: '#14B8A6', // teal-500
          icon: 'stethoscope',
          iconName: 'medical-services',
          borderColor: '#99F6E4',
        };
    }
  };

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
          const style = getEventStyles(e.type);

          return (
            <View key={e.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.iconCircle, { backgroundColor: style.bg }]}>
                  <IconSymbol
                    ios_icon_name={style.icon as any}
                    android_material_icon_name={style.iconName as any}
                    size={20}
                    color={style.text}
                  />
                </View>
                {!isLast && <View style={[styles.timelineLine, dynamicStyles.timelineLine]} />}
              </View>

              <TouchableOpacity
                style={[styles.eventCard, dynamicStyles.card] as any}
                onPress={() => {
                  if (e.relatedId) {
                    const routeMap: Record<string, string> = {
                      vaccination: 'vaccination',
                      treatment: 'treatment',
                      visit: 'visit'
                    };
                    const detailType = routeMap[e.type] || 'visit';
                    router.push(`/(tabs)/pets/record-detail?type=${detailType}&id=${e.relatedId}` as any);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    {/* Priority Badge for Vax or Urgent */}
                    {(e.type === 'vaccination' || e.title.includes('Urgent')) && (
                      <View style={[styles.priorityBadge, { backgroundColor: style.bg }]}>
                        <IconSymbol ios_icon_name="exclamationmark.triangle.fill" android_material_icon_name="warning" size={10} color={style.text} />
                        <Text style={[styles.priorityText, { color: style.text }]}>HIGH PRIORITY</Text>
                      </View>
                    )}

                    <Text style={[styles.eventTitle, dynamicStyles.textPrimary]} numberOfLines={1}>{e.title}</Text>

                    <View style={styles.metaRow}>
                      <View style={[styles.dateTag, { backgroundColor: colors.neutral[100] }]}>
                        <IconSymbol ios_icon_name="calendar" android_material_icon_name="calendar-today" size={12} color={colors.text.tertiary} />
                        <Text style={[styles.eventTime, dynamicStyles.textSecondary]}>
                          {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Icon */}
                  <View style={styles.actionIcon}>
                    <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={16} color={colors.neutral[400]} />
                  </View>
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
    fontSize: 13,
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
    width: 36,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: '#E5E7EB',
    marginTop: -4,
    marginBottom: -4,
  },
  eventCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Center vertically
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionIcon: {
    marginLeft: 8,
  },
});
