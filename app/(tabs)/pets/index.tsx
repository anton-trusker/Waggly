import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { usePets } from '@/hooks/usePets';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { usePersistentState, persistentConfigs } from '@/utils/persistentState';
import { Pet } from '@/types';
import AppHeader from '@/components/layout/AppHeader';
import ResponsivePageWrapper from '@/components/layout/ResponsivePageWrapper';
import PetCardDesktop from '@/components/desktop/dashboard/PetCardDesktop';
import VisitFormModal from '@/components/desktop/modals/VisitFormModal';
import MobileHeader from '@/components/layout/MobileHeader';

export default function PetsScreen() {
  const { pets, loading, refreshPets } = usePets();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [visitPetId, setVisitPetId] = useState<string | null>(null);

  // Responsive breakpoints
  const isMobile = width < 768;
  const isDesktop = width >= 1024;

  // Persistent state for pet selection
  const { state: lastSelectedPetId, setState: setLastSelectedPetId } = usePersistentState(
    persistentConfigs.petSelection.key,
    persistentConfigs.petSelection.defaultValue,
    { expiration: persistentConfigs.petSelection.expiration }
  );

  const handlePetPress = (pet: Pet) => {
    setLastSelectedPetId(pet.id);
    router.push(`/(tabs)/pets/${pet.id}/overview` as any);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPets();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <ResponsivePageWrapper showSidebar={isDesktop}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
        </View>
      </ResponsivePageWrapper>
    );
  }

  return (
    <ResponsivePageWrapper showSidebar={isDesktop} scrollable={false}>
      <MobileHeader showLogo={true} showNotifications={true} />
      <View style={styles.container}>
        <AppHeader title="My Pets" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
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
          {/* Header with Add Button */}
          <View style={[styles.header, isDesktop && styles.headerDesktop]}>
            <View>
              {isDesktop && (
                <>
                  <Text style={styles.title}>My Pets</Text>
                  <Text style={styles.subtitle}>Manage your pets and their health</Text>
                </>
              )}
            </View>
            <EnhancedButton
              title="Add Pet"
              icon="add"
              variant="primary"
              size={isMobile ? "sm" : "md"}
              onPress={() => router.push('/(tabs)/pets/add-pet-wizard')}
            />
          </View>

          {/* Empty State */}
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
            /* Pet Cards Grid */
            <View style={[
              styles.petsList,
              !isMobile && styles.petsGrid,
              isDesktop && styles.petsGridDesktop,
            ]}>
              {pets.map((pet) => (
                isDesktop ? (
                  /* Desktop: Use PetCardDesktop with actions */
                  <View key={pet.id} style={styles.desktopCardWrapper}>
                    <PetCardDesktop pet={pet} />
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handlePetPress(pet)}
                      >
                        <Ionicons name="eye-outline" size={18} color="#374151" />
                        <Text style={styles.actionButtonText}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setVisitPetId(pet.id)}
                      >
                        <Ionicons name="calendar-outline" size={18} color="#374151" />
                        <Text style={styles.actionButtonText}>Book Visit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* Mobile/Tablet: Use detailed mobile card */
                  <TouchableOpacity
                    key={pet.id}
                    style={[
                      styles.petCard,
                      lastSelectedPetId === pet.id && styles.petCardSelected,
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
                            {pet.species === 'dog' ? '🐕' :
                              pet.species === 'cat' ? '🐈' :
                                pet.species === 'bird' ? '🦜' :
                                  pet.species === 'rabbit' ? '🐰' :
                                    pet.species === 'reptile' ? '🦎' :
                                      '🐾'}
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
                )
              ))}
            </View>
          )}

          {/* Bottom padding for mobile tab bar */}
          {!isDesktop && <View style={{ height: 80 }} />}
        </ScrollView>

        {/* Desktop Modal */}
        <VisitFormModal
          visible={!!visitPetId}
          petId={visitPetId || ''}
          onClose={() => setVisitPetId(null)}
        />
      </View>
    </ResponsivePageWrapper>
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
    paddingTop: getSpacing(6),
    paddingHorizontal: getSpacing(4),
    paddingBottom: getSpacing(8),
  },
  contentDesktop: {
    paddingHorizontal: getSpacing(8),
    paddingTop: getSpacing(8),
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: getSpacing(6),
  },
  headerDesktop: {
    justifyContent: 'space-between',
    marginBottom: getSpacing(8),
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Empty State
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

  // Pet Lists/Grid
  petsList: {
    gap: getSpacing(4),
  },
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  petsGridDesktop: {
    gap: 24,
  },

  // Mobile Pet Card
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

  // Desktop Card
  desktopCardWrapper: {
    width: 'calc(33.333% - 16px)' as any,
    minWidth: 280,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
});
