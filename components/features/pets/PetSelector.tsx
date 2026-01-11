import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';

interface PetSelectorProps {
  selectedPetId: string;
  onSelectPet: (id: string) => void;
}

export default function PetSelector({ selectedPetId, onSelectPet }: PetSelectorProps) {
  const { pets, loading } = usePets();
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text.secondary }]}>WHO IS THIS FOR?</Text>
      <View style={styles.list}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary[500]} />
        ) : pets.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No pets found.</Text>
        ) : (
          pets.map((pet) => {
            const isSelected = selectedPetId === pet.id;
            return (
              <TouchableOpacity
                key={pet.id}
                onPress={() => onSelectPet(pet.id)}
                style={styles.item}
              >
                <View style={[
                  styles.avatarContainer,
                  { backgroundColor: isSelected ? theme.colors.primary[500] : theme.colors.neutral[800] }
                  // Note: neutral[800] for unselected dark circle, or adjust based on theme mode?
                  // Using card background or specific color from original design? Original was #2C2C2E.
                ]}>
                  {pet.photo_url ? (
                    <Image source={{ uri: pet.photo_url }} style={styles.avatar} />
                  ) : (
                    <Ionicons name="paw" size={32} color={isSelected ? '#FFFFFF' : theme.colors.text.tertiary} />
                  )}
                  {isSelected && (
                    <View style={[styles.checkmark, { backgroundColor: theme.colors.status.success, borderColor: theme.colors.background.card }]}>
                      <Ionicons name="checkmark" size={12} color="white" />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.petName,
                  { color: isSelected ? theme.colors.primary[500] : theme.colors.text.secondary }
                ]}>
                  {pet.name}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  item: {
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  checkmark: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
  },
  petName: {
    fontSize: 14,
    fontWeight: '500',
  },
});
