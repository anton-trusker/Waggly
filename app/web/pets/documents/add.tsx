import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AddDocument() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark p-8 flex items-center justify-center">
      <View className="max-w-md w-full bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-border-light dark:border-border-dark text-center">
        <IconSymbol name="note_add" size={48} className="text-primary mx-auto mb-4" />
        <Text className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">Upload Document</Text>
        <Text className="text-muted-light dark:text-muted-dark mb-6">
          Upload medical records, prescriptions, or insurance documents for your pet.
        </Text>
        
        <Pressable 
          onPress={() => router.back()}
          className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-xl font-medium transition-colors"
        >
          <Text className="text-white font-medium">Go Back</Text>
        </Pressable>
      </View>
    </View>
  );
}