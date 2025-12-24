import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { usePets } from '@/hooks/usePets';
import { Pet } from '@/types';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatAge } from '@/lib/age';
import { useEvents } from '@/hooks/useEvents';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import { handleApiError } from '@/utils/errorHandler';

// Feature Components
import PetHealthPassport from '@/components/features/pets/PetHealthPassport';
import PetGallery from '@/components/features/pets/PetGallery';
import PetDocuments from '@/components/features/pets/PetDocuments';
import AppHeader from '@/components/layout/AppHeader';

type TabType = 'Main' | 'Details' | 'Health' | 'Photos' | 'Documents';

// Type definitions for component props
interface UpcomingEventsProps {
  petId: string;
  todayISO: string;
  showAll?: boolean;
}

type PetDetailScreenParams = {
  id: string;
}

const UpcomingEvents = React.memo(({ 
  petId, 
  todayISO, 
  showAll = false
}: UpcomingEventsProps) => {
  const [filterType, setFilterType] = useState<'all' | 'vaccination' | 'visit' | 'treatment'>('all');
  const { events, loading, refreshEvents } = useEvents({
    petIds: [petId],
    startDate: showAll ? undefined : todayISO,
    endDate: undefined,
    types: undefined,
  });

  // Filter to show only upcoming events (future dates)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter(event => new Date(event.dueDate) >= now);
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return upcomingEvents;
    if (filterType === 'visit') return upcomingEvents.filter(e => e.type === 'vet');
    return upcomingEvents.filter(e => e.type === filterType);
  }, [upcomingEvents, filterType]);

  const handleRetry = useCallback(() => {
    refreshEvents();
  }, [refreshEvents]);

  if (loading && events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={18} color={colors.primary} />
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterRow}
      >
        {(['all', 'vaccination', 'visit', 'treatment'] as const).map(t => (
          <TouchableOpacity 
            key={t} 
            style={[styles.filterChip, filterType === t && styles.filterChipActive]}
            onPress={() => setFilterType(t)}
          >
            <Text style={[styles.filterChipText, filterType === t && styles.filterChipTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {loading && events.length > 0 && (
        <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
      )}
      
      {filteredEvents.length === 0 ? (
        <Text style={styles.emptyText}>No upcoming events found</Text>
      ) : (
        <View>
          {filteredEvents.map((e, index) => {
            const date = new Date(e.dueDate);
            const currentYear = new Date().getFullYear();
            const eventYear = date.getFullYear();
            const showYear = eventYear !== currentYear;
            
            return (
              <TouchableOpacity
                key={e.id}
                style={[styles.eventItem, index === filteredEvents.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => {
                  if (e.relatedId) {
                    if (e.type === 'vaccination') {
                      router.push(`/(tabs)/pets/record-detail?type=vaccination&id=${e.relatedId}`);
                    } else if (e.type === 'treatment') {
                      router.push(`/(tabs)/pets/record-detail?type=treatment&id=${e.relatedId}`);
                    } else if (e.type === 'vet') {
                      router.push(`/(tabs)/pets/record-detail?type=visit&id=${e.relatedId}`);
                    }
                  }
                }}
              >
                <View style={styles.eventDateBox}>
                  <Text style={styles.eventDay}>{date.getDate()}</Text>
                  <Text style={styles.eventMonth}>{date.toLocaleString('default', { month: 'short' })}</Text>
                  {showYear && <Text style={styles.eventYear}>{eventYear}</Text>}
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{e.title}</Text>
                  <View style={styles.eventMetaRow}>
                    <View style={[styles.eventTypeTag, { backgroundColor: e.type === 'vaccination' ? '#DCFCE7' : e.type === 'treatment' ? '#F3E8FF' : '#E0F2FE' }]}>
                      <Text style={[styles.eventTypeText, { color: e.type === 'vaccination' ? '#16A34A' : e.type === 'treatment' ? '#9333EA' : '#0284C7' }]}>
                        {e.type === 'vet' ? 'Visit' : e.type.charAt(0).toUpperCase() + e.type.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
                <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
});

const PetDetailScreenContent = () => {
  const { id } = useLocalSearchParams<PetDetailScreenParams>();
  const { pets, loading: petsLoading, refreshPets } = usePets();
  const [pet, setPet] = useState<Pet | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('Main');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const todayISO = new Date().toISOString().slice(0, 10);

  const loadPetData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refreshPets();
    } catch (error) {
      handleApiError(error, 'Failed to load pet data');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshPets]);

  useEffect(() => {
    const foundPet = pets.find((p) => p.id === id);
    if (foundPet) {
      setPet(foundPet);
    }
  }, [pets, id]);

  useFocusEffect(
    useCallback(() => {
      loadPetData();
    }, [loadPetData])
  );

  const handleRefresh = useCallback(async () => {
    await loadPetData();
  }, [loadPetData]);

  if (petsLoading || !pet) {
    return (
      <View style={[styles.container, styles.center]} testID="loading-container">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderMainTab = () => (
    <View style={styles.tabContent} testID="main-tab-content">
      {/* Profile Card - Only shown on Main Tab */}
      <View style={styles.profileCard}>
        <View style={styles.profileRow}>
          <View style={styles.profileImage}>
            {pet.photo_url ? (
              <Image source={{ uri: pet.photo_url }} style={styles.profileImagePhoto} />
            ) : (
              <Text style={styles.profileEmoji}>
                {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
              </Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{pet.name}</Text>
            <Text style={styles.profileBreed}>{pet.breed || 'Unknown Breed'}</Text>
            <View style={styles.ageBadge}>
              <Text style={styles.ageText}>{pet.date_of_birth ? formatAge(new Date(pet.date_of_birth)) : '—'}</Text>
            </View>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/(tabs)/pets/add-visit?petId=${pet.id}`)}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
              <IconSymbol ios_icon_name="stethoscope" android_material_icon_name="medical-services" size={20} color="#0284C7" />
            </View>
            <Text style={styles.actionLabel}>Add Visit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/(tabs)/pets/add-vaccination?petId=${pet.id}`)}>
            <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
              <IconSymbol ios_icon_name="cross.case.fill" android_material_icon_name="vaccines" size={20} color="#16A34A" />
            </View>
            <Text style={styles.actionLabel}>Add Vaccine</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/(tabs)/pets/add-treatment?petId=${pet.id}`)}>
            <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
              <IconSymbol ios_icon_name="pills.fill" android_material_icon_name="medication" size={20} color="#9333EA" />
            </View>
            <Text style={styles.actionLabel}>Add Meds</Text>
          </TouchableOpacity>
        </View>
      </View>

      <UpcomingEvents 
        petId={pet.id} 
        todayISO={todayISO} 
        showAll={true} 
      />
    </View>
  );

  const renderDetailsTab = () => (
    <View style={styles.tabContent} testID="details-tab-content">
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Basic Info</Text>
        <View style={styles.detailGrid}>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Species</Text>
            <Text style={styles.detailValueCompact}>{pet.species}</Text>
          </View>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Breed</Text>
            <Text style={styles.detailValueCompact}>{pet.breed || 'Mixed'}</Text>
          </View>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Gender</Text>
            <Text style={styles.detailValueCompact}>{pet.gender}</Text>
          </View>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Age</Text>
            <Text style={styles.detailValueCompact}>{pet.date_of_birth ? formatAge(new Date(pet.date_of_birth)) : '—'}</Text>
          </View>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Weight</Text>
            <Text style={styles.detailValueCompact}>{pet.weight ? `${pet.weight} kg` : '—'}</Text>
          </View>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Size</Text>
            <Text style={styles.detailValueCompact}>{pet.size}</Text>
          </View>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Color</Text>
            <Text style={styles.detailValueCompact}>{pet.color}</Text>
          </View>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Spayed/Neutered</Text>
            <Text style={styles.detailValueCompact}>{pet.is_spayed_neutered === true ? 'Yes' : pet.is_spayed_neutered === false ? 'No' : '—'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Medical Info</Text>
        <View style={styles.detailGrid}>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Microchip</Text>
            <Text style={styles.detailValueCompact}>{pet.microchip_number || '—'}</Text>
          </View>
          <View style={styles.detailItemCompact}>
            <Text style={styles.detailLabelCompact}>Registration ID</Text>
            <Text style={styles.detailValueCompact}>{pet.registration_id || '—'}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Main':
        return renderMainTab();
      case 'Details':
        return renderDetailsTab();
      case 'Health':
        return <PetHealthPassport petId={pet.id} />;
      case 'Photos':
        return <PetGallery petId={pet.id} gallery={pet.photo_gallery || []} />;
      case 'Documents':
        return <PetDocuments petId={pet.id} />;
      default:
        return renderMainTab();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Pet Profile"
        showBack
        backPosition="left"
        hideAvatar
        showEdit
        onEdit={() => router.push(`/(tabs)/pets/pet-edit?id=${pet.id}`)}
        onBack={() => router.back()}
      />

      {/* Tabs - Now positioned right after header */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {(['Main', 'Details', 'Health', 'Photos', 'Documents'] as TabType[]).map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          {renderTabContent()}
        </View>

        {/* Bottom padding to prevent content being hidden */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Main component with error boundary
export default function PetDetailScreen() {
  return (
    <ErrorBoundary>
      <PetDetailScreenContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
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
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    margin: 16,
    marginTop: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileImagePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileEmoji: {
    fontSize: 32,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileBreed: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ageBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  ageText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  tabsWrapper: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  tabsContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  tabTextActive: {
    color: colors.card,
  },
  tabContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabContent: {
    paddingBottom: 24,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItemCompact: {
    width: '45%',
    marginBottom: 12,
  },
  detailLabelCompact: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValueCompact: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  filterRow: {
    marginBottom: 16,
    gap: 8,
    paddingHorizontal: 8,
  },
  filterChip: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.card,
  },
  loadingIndicator: {
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: colors.errorLight,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eventDateBox: {
    width: 50,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },
  eventDay: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  eventMonth: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  eventYear: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 2,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  eventTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  eventTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  pastLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
