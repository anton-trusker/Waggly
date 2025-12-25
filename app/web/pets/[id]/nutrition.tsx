import React from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function NutritionTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();

  const pet = pets?.find(p => p.id === id);
  if (!pet) return null;

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="p-4 lg:p-8">
        <View className="max-w-7xl mx-auto space-y-6">
          <View className="bg-card-light dark:bg-card-dark rounded-xl p-8 border border-border-light dark:border-border-dark text-center">
            <IconSymbol name="restaurant" size={48} className="text-muted-light dark:text-muted-dark mx-auto mb-4" />
            <Text className="text-lg font-bold text-text-light dark:text-text-dark mb-2">Nutrition Tracker Coming Soon</Text>
            <Text className="text-sm text-muted-light dark:text-muted-dark mb-4">Track {pet.name}'s diet, calories, and weight goals.</Text>
            <Pressable 
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <IconSymbol name="notifications_active" size={16} />
              <Text>Notify Me</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}