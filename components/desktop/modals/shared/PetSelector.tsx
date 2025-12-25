import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';

interface PetSelectorProps {
  selectedPetId: string;
  onSelectPet: (id: string) => void;
}

export default function PetSelector({ selectedPetId, onSelectPet }: PetSelectorProps) {
  const { pets, loading } = usePets();

  return (
    <View>
      <Text className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider mb-4">WHO IS THIS FOR?</Text>
      <View className="flex-row flex-wrap gap-4">
        {loading ? (
          <ActivityIndicator color="#0A84FF" />
        ) : (
          pets.map((pet) => (
            <TouchableOpacity 
              key={pet.id} 
              onPress={() => onSelectPet(pet.id)}
              className="items-center gap-2"
            >
              <View className={`w-16 h-16 rounded-full items-center justify-center ${selectedPetId === pet.id ? 'bg-[#0A84FF]' : 'bg-[#2C2C2E]'}`}>
                {pet.image_url ? (
                  <Image source={{ uri: pet.image_url }} className="w-14 h-14 rounded-full" />
                ) : (
                  <Ionicons name="paw" size={32} color={selectedPetId === pet.id ? '#FFFFFF' : '#6B7280'} />
                )}
                {selectedPetId === pet.id && (
                  <View className="absolute -bottom-1 -right-1 bg-[#22C55E] rounded-full p-0.5 border-2 border-[#1C1C1E]">
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                )}
              </View>
              <Text className={`text-sm font-medium ${selectedPetId === pet.id ? 'text-[#0A84FF]' : 'text-[#6B7280]'}`}>
                {pet.name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
}
