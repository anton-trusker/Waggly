import React from 'react';
import { View, ScrollView, Text, Pressable, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocale } from '@/hooks/useLocale';

export default function EventsTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();
  const { events } = useEvents({ petIds: [id] });
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isLargeScreen = width >= 1024;
  const { t, locale } = useLocale();

  const pet = pets?.find(p => p.id === id);
  if (!pet) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getEventIcon = (type?: string) => {
    switch (type) {
      case 'vaccination': return 'vaccines';
      case 'treatment': return 'medication';
      case 'vet': return 'medical_services';
      case 'grooming': return 'spa';
      case 'walking': return 'directions_walk';
      case 'feeding': return 'restaurant';
      default: return 'event';
    }
  };

  const getEventColor = (type?: string) => {
    switch (type) {
      case 'vaccination': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'treatment': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400';
      case 'vet': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'grooming': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'walking': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'feeding': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const upcomingEvents = events?.filter(e => new Date(e.date) > new Date()) || [];
  const pastEvents = events?.filter(e => new Date(e.date) <= new Date()) || [];

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="p-4 lg:p-8">
        <View className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{t('pet_profile.events.title')}</Text>
              <Text style={styles.subtitle}>{t('pet_profile.events.subtitle', { name: pet.name })}</Text>
            </View>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => router.push(`/(tabs)/pets/calendar/new?petId=${id}` as any)}
            >
              <IconSymbol android_material_icon_name="add" size={20} color="#fff" />
              <Text style={styles.btnTextPrimary}>{t('pet_profile.events.actions.add_event')}</Text>
            </TouchableOpacity>
          </View>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <View className="space-y-4">
              <View style={styles.sectionHeader}>
                <IconSymbol android_material_icon_name="event" size={24} color="#5E2D91" />
                <Text style={styles.sectionTitle}>{t('pet_profile.events.sections.upcoming')}</Text>
              </View>
              <View className="space-y-3">
                {upcomingEvents.map((event) => {
                  const daysUntil = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <View key={event.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
                      <View className="flex items-center gap-4">
                        <View className={`w-12 h-12 rounded-full ${getEventColor(event.type)} flex items-center justify-center flex-shrink-0`}>
                          <IconSymbol name={getEventIcon(event.type)} size={24} />
                        </View>
                        <View className="flex-1">
                          <View className="flex justify-between items-start">
                            <Text className="font-bold text-text-light dark:text-text-dark">{event.title}</Text>
                            <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {daysUntil === 0 ? t('common.today') : daysUntil === 1 ? t('common.tomorrow') : t('common.in_x_days', { count: daysUntil })}
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <IconSymbol android_material_icon_name="calendar_today" size={14} color="#6B7280" />
                            <Text style={styles.eventTimeText}>{formatDate(event.date)}</Text>
                            <IconSymbol android_material_icon_name="access_time" size={14} color="#6B7280" />
                            <Text style={styles.eventTimeText}>
                              {event.allDay ? t('pet_profile.events.time.all_day') : formatTime(event.date)}
                            </Text>
                          </View>
                          {event.location && (
                            <Text className="text-sm text-muted-light dark:text-muted-dark">{event.location}</Text>
                          )}
                          {event.notes && (
                            <Text className="text-sm text-text-light dark:text-text-dark mt-2">{event.notes}</Text>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <View className="space-y-4">
              <View style={styles.sectionHeader}>
                <IconSymbol android_material_icon_name="history" size={24} color="#6B7280" />
                <Text style={styles.sectionTitle}>{t('pet_profile.events.sections.past')}</Text>
              </View>
              <View className="space-y-3">
                {pastEvents.map((event) => (
                  <View key={event.id} className="bg-card-light dark:bg-card-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
                    <View className="flex items-center gap-4">
                      <View className={`w-12 h-12 rounded-full ${getEventColor(event.type)} flex items-center justify-center flex-shrink-0`}>
                        <IconSymbol name={getEventIcon(event.type)} size={24} />
                      </View>
                      <View className="flex-1">
                        <View className="flex justify-between items-start">
                          <Text className="font-bold text-text-light dark:text-text-dark">{event.title}</Text>
                          <Text className="text-sm text-muted-light dark:text-muted-dark">{formatDate(event.date)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                          <IconSymbol android_material_icon_name="access_time" size={14} color="#6B7280" />
                          <Text style={styles.eventTimeText}>
                            {event.allDay ? t('pet_profile.events.time.all_day') : formatTime(event.date)}
                          </Text>
                        </View>
                        {event.location && (
                          <Text className="text-sm text-muted-light dark:text-muted-dark">{event.location}</Text>
                        )}
                        {event.notes && (
                          <Text className="text-sm text-text-light dark:text-text-dark mt-2">{event.notes}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {events.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol android_material_icon_name="event-busy" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>{t('pet_profile.events.empty.title')}</Text>
              <Text style={styles.emptyStateDesc}>{t('pet_profile.events.empty.desc')}</Text>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => router.push(`/(tabs)/pets/calendar/new?petId=${id}` as any)}
              >
                <IconSymbol android_material_icon_name="add" size={20} color="#fff" />
                <Text style={styles.btnTextPrimary}>{t('pet_profile.events.actions.add_first')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}