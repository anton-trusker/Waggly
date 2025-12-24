import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { usePets } from '@/hooks/usePets';
import { Pet } from '@/types';
import PetProfileForm from '@/components/features/pets/PetProfileForm';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function PetEditScreen() {
  const { id } = useLocalSearchParams();
  const { pets, loading: petsLoading } = usePets();
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    const foundPet = pets.find((p) => p.id === id);
    if (foundPet) setPet(foundPet);
  }, [id, pets]);

  if (petsLoading || !pet) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Back" accessibilityRole="button">
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="chevron-left"
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Edit Pet</Text>
          <Text style={styles.headerSubtitle}>{pet.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <PetProfileForm pet={pet} onSaved={() => router.back()} onCancel={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

