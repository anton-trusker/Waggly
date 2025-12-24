
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { usePets } from '@/hooks/usePets';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { usePersistentState, persistentConfigs } from '@/utils/persistentState';
import { Pet } from '@/types';
import AppHeader from '@/components/layout/AppHeader';

export default function PetsScreen() {
  const { pets, loading, refreshPets } = usePets();
  
  // Persistent state for pet selection
  const { state: lastSelectedPetId, setState: setLastSelectedPetId } = usePersistentState(
    persistentConfigs.petSelection.key,
    persistentConfigs.petSelection.defaultValue,
    { expiration: persistentConfigs.petSelection.expiration }
  );
  
  const [refreshing, setRefreshing] = useState(false);

  const handlePetPress = (pet: Pet) => {
    // Store the selected pet ID for future reference
    setLastSelectedPetId(pet.id);
    
    // Navigate to pet detail
    router.push(`/(tabs)/pets/pet-detail?id=${pet.id}`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPets();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="My Pets" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={designSystem.colors.primary[500]}
            colors={[designSystem.colors.primary[500]]}
          />
        }
      >
        <View style={styles.header}>
          <EnhancedButton
            title="Add Pet"
            icon="add"
            variant="primary"
            size="sm"
            onPress={() => router.push('/(tabs)/pets/add-pet-wizard')}
          />
        </View>

        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐾</Text>
            <Text style={styles.emptyTitle}>No Pets Yet</Text>
            <Text style={styles.emptyText}>
              Add your first pet to start tracking their health and care
            </Text>
            <EnhancedButton
              title="Add Your First Pet"
              icon="pets"
              variant="primary"
              onPress={() => router.push('/(tabs)/pets/add-pet-wizard')}
              style={styles.addFirstPetButton}
            />
          </View>
        ) : (
          <View style={styles.petsList}>
            {pets.map((pet, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.petCard,
                  lastSelectedPetId === pet.id && styles.petCardSelected
                ]}
                onPress={() => handlePetPress(pet)}
                activeOpacity={0.8}
              >
                <View style={styles.petCardHeader}>
                  <View style={styles.petIcon}>
                    {pet.photo_url ? (
                      <Image source={{ uri: pet.photo_url }} style={styles.petImage} />
                    ) : (
                      <Text style={styles.petIconText}>
                        {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
                      </Text>
                    )}
                  </View>
                  <View style={styles.petCardInfo}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petBreed}>{pet.breed || pet.species}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </View>
                
                <View style={styles.petCardDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailValue}>{pet.gender || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Weight</Text>
                    <Text style={styles.detailValue}>
                      {pet.weight ? `${pet.weight} kg` : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Size</Text>
                    <Text style={styles.detailValue}>{pet.size || 'N/A'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designSystem.colors.background.primary,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: getSpacing(8),
    paddingHorizontal: getSpacing(5),
    paddingBottom: getSpacing(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getSpacing(6),
  },
  title: {
    ...designSystem.typography.headline.small,
    color: designSystem.colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: getSpacing(16),
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: getSpacing(4),
  },
  emptyTitle: {
    ...designSystem.typography.title.large,
    color: designSystem.colors.text.primary,
    marginBottom: getSpacing(2),
  },
  emptyText: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: getSpacing(10),
    marginBottom: getSpacing(6),
  },
  addFirstPetButton: {
    marginTop: getSpacing(4),
  },
  petsList: {
    gap: getSpacing(4),
  },
  petCard: {
    backgroundColor: designSystem.colors.neutral[0],
    borderRadius: designSystem.borderRadius.xl,
    padding: getSpacing(4),
    ...designSystem.shadows.md,
    borderWidth: 1,
    borderColor: designSystem.colors.neutral[200],
  },
  petCardSelected: {
    borderColor: designSystem.colors.primary[500],
    borderWidth: 2,
    backgroundColor: designSystem.colors.primary[50],
  },
  petCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(4),
  },
  petIcon: {
    width: getSpacing(15),
    height: getSpacing(15),
    borderRadius: designSystem.borderRadius.full,
    backgroundColor: designSystem.colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getSpacing(3),
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  petIconText: {
    fontSize: 32,
  },
  petCardInfo: {
    flex: 1,
  },
  petName: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
    marginBottom: getSpacing(0.5),
  },
  petBreed: {
    ...designSystem.typography.body.small,
    color: designSystem.colors.text.secondary,
  },
  arrow: {
    ...designSystem.typography.display.small,
    color: designSystem.colors.text.secondary,
  },
  petCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: getSpacing(4),
    borderTopWidth: 1,
    borderTopColor: designSystem.colors.border.primary,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    ...designSystem.typography.label.small,
    color: designSystem.colors.text.secondary,
    marginBottom: getSpacing(1),
  },
  detailValue: {
    ...designSystem.typography.label.medium,
    color: designSystem.colors.text.primary,
    fontWeight: '600',
  },
});
