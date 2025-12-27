import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PetEventsHeader from '@/components/features/pets/PetEventsHeader';
import PetEventsList from '@/components/features/pets/PetEventsList';
import { useEvents } from '@/hooks/useEvents';
import { usePets } from '@/hooks/usePets'; // Keep usePets for pet details

export default function PetEventsTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { pets } = usePets(); // Fetch pets to find the current pet
  const { events } = useEvents({ petIds: id ? [id] : [] });

  const pet = pets?.find(p => p.id === id);
  if (!pet) return null;

  // The rest of the original file's logic, adapted to the new structure
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
          <View className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <View>
              <Text className="text-xl font-bold text-text-light dark:text-text-dark">Events & Schedule</Text>
              <Text className="text-sm text-muted-light dark:text-muted-dark mt-1">Manage {pet.name}'s appointments and activities.</Text>
            </View>
            <View className="flex items-center gap-3 w-full sm:w-auto">
              <Pressable
                onPress={() => router.push(`/web/pets/events/new?petId=${id}`)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/30 text-sm font-medium transition-all transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <IconSymbol name="add" size={20} />
                <Text>Add Event</Text>
              </Pressable>
            </View>
          </View>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <View className="space-y-4">
              <Text className="text-lg font-bold text-text-light dark:text-text-dark flex items-center gap-2">
                <IconSymbol name="schedule" size={24} className="text-primary" />
                Upcoming Events
              </Text>
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
                              {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                            </Text>
                          </View>
                          <Text className="text-sm text-muted-light dark:text-muted-dark mt-1">{formatDate(event.date)} • {event.time || 'All day'}</Text>
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
              <Text className="text-lg font-bold text-text-light dark:text-text-dark flex items-center gap-2">
                <IconSymbol name="history" size={24} className="text-primary" />
                Past Events
              </Text>
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
                        <Text className="text-sm text-muted-light dark:text-muted-dark mt-1">{event.time || 'All day'}</Text>
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
          {(!events || events.length === 0) && (
            <View className="bg-card-light dark:bg-card-dark rounded-xl p-8 border border-border-light dark:border-border-dark text-center">
              <IconSymbol name="event" size={48} className="text-muted-light dark:text-muted-dark mx-auto mb-4" />
              <Text className="text-lg font-bold text-text-light dark:text-text-dark mb-2">No events yet</Text>
              <Text className="text-sm text-muted-light dark:text-muted-dark mb-4">Add events to track your pet's care schedule</Text>
              <Pressable
                onPress={() => router.push(`/web/pets/events/new?petId=${id}`)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <IconSymbol name="add" size={16} />
                <Text>Add First Event</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}