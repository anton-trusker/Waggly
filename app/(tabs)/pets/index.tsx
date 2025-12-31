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
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function PetsScreen() {
  const { pets, loading, refreshPets } = usePets();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [visitPetId, setVisitPetId] = useState<string | null>(null);

  // Responsive breakpoints
  const isMobile = width < 768;
  const isDesktop = width >= 1024;
  const showGradientHeader = isDesktop; // Only show gradient header on desktop

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
      <DesktopShell>
        <MobileHeader showLogo={true} showNotifications={true} />
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
        </View>
      </DesktopShell>
    );
  }

  return (
    <DesktopShell>
      <MobileHeader showLogo={true} showNotifications={true} />
      <View style={styles.container}>
        {!isDesktop && (
          <View style={styles.mobileHeader}>
            <Text style={styles.mobileTitle}>My Pets</Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
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
          {/* Gradient Header for Desktop */}
          {showGradientHeader && (
            <LinearGradient
              colors={['#667EEA', '#764BA2']} // 135deg gradient equivalent
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientHeader}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={styles.title}>My Pets</Text>
                  <Text style={styles.subtitle}>Manage your pets and their health</Text>
                </View>
                <EnhancedButton
                  title="Add Pet"
                  icon="add"
                  variant="primary" // Logic might need override for white button on gradient, but generic primary is okay for now or custom style
                  // Actually design requested Primary Gradient bg for button usually, but on a gradient header, a white button looks better.
                  // For now sticking to standard button to ensure functionality first.
                  onPress={() => router.push('/(tabs)/pets/new')}
                  style={{ backgroundColor: '#fff', borderColor: '#fff' }}
                  textStyle={{ color: '#4F46E5' }}
                  iconColor="#4F46E5"
                />
              </View>
            </LinearGradient>
          )}

          <View style={[styles.content, isDesktop && styles.contentDesktop]}>
            {/* Mobile Add Button if not Desktop header */}
            {!isDesktop && (
              <View style={{ marginBottom: 20, alignItems: 'flex-end' }}>
                <EnhancedButton
                  title="Add Pet"
                  icon="add"
                  variant="primary"
                  size="sm"
                  onPress={() => router.push('/(tabs)/pets/new')}
                />
              </View>
            )}

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
                  onPress={() => router.push('/(tabs)/pets/new')}
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
          </View>
        </ScrollView>

        {/* Desktop Modal */}
        <VisitFormModal
          visible={!!visitPetId}
          petId={visitPetId || ''}
          onClose={() => setVisitPetId(null)}
        />
      </View>
    </DesktopShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Gray-50
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  gradientHeader: {
    paddingTop: getSpacing(8),
    paddingHorizontal: getSpacing(8),
    paddingBottom: getSpacing(8),
    marginBottom: getSpacing(6),
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    paddingHorizontal: getSpacing(4),
    paddingBottom: getSpacing(8),
  },
  contentDesktop: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 40, // 40px padding
  },
  mobileHeader: {
    padding: getSpacing(4),
  },
  mobileTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 400,
    marginBottom: 24,
  },
  addFirstPetButton: {
    marginTop: 16,
  },

  // Pet Lists/Grid
  petsList: {
    gap: 16,
  },
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  petsGridDesktop: {
    gap: 24,
  },

  // Mobile Pet Card
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  petCardSelected: {
    borderColor: '#6366F1',
    borderWidth: 2,
    backgroundColor: '#EEF2FF',
  },
  petCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  petIconText: {
    fontSize: 28,
  },
  petCardInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  petCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  // Desktop Card Wrapper
  desktopCardWrapper: {
    width: '31%', // Approx 1/3 minus gap
    minWidth: 300,
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
