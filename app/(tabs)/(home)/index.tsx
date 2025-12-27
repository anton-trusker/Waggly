import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Desktop Components
import PetCardDesktop from '@/components/desktop/dashboard/PetCardDesktop';
import QuickActionsGrid from '@/components/desktop/dashboard/QuickActionsGrid';
import UpcomingCarePanel from '@/components/desktop/dashboard/UpcomingCarePanel';
import PriorityAlertsPanel from '@/components/desktop/dashboard/PriorityAlertsPanel';
import ActivityFeedTimeline from '@/components/desktop/dashboard/ActivityFeedTimeline';

// Mobile Components
import HomeHeader from '@/components/mobile/home/HomeHeader';
import DashboardPetCard from '@/components/dashboard/DashboardPetCard';
import { QuickActionsPanel } from '@/components/dashboard/QuickActionsPanel';
import UpcomingEventsPanel from '@/components/features/events/UpcomingEventsPanel';
import NoPetsState from '@/components/dashboard/NoPetsState';
import PWAInstallPrompt from '@/components/features/pwa/PWAInstallPrompt';

// Modals
import VisitFormModal from '@/components/desktop/modals/VisitFormModal';
import VaccinationFormModal from '@/components/desktop/modals/VaccinationFormModal';
import TreatmentFormModal from '@/components/desktop/modals/TreatmentFormModal';
import HealthMetricsModal from '@/components/desktop/modals/HealthMetricsModal';

import { usePets } from '@/hooks/usePets';
import ResponsivePageWrapper from '@/components/layout/ResponsivePageWrapper';

export default function HomePage() {
  const router = useRouter();
  const { pets, loading, refresh: refreshPets } = usePets();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  // Responsive breakpoints
  const isMobile = width < 768;
  const isDesktop = width >= 1024;

  // Modal States
  const [visitOpen, setVisitOpen] = useState(false);
  const [vaccinationOpen, setVaccinationOpen] = useState(false);
  const [treatmentOpen, setTreatmentOpen] = useState(false);
  const [healthMetricsOpen, setHealthMetricsOpen] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPets();
    setRefreshing(false);
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'visit':
        setVisitOpen(true);
        break;
      case 'vaccine':
        setVaccinationOpen(true);
        break;
      case 'meds':
        setTreatmentOpen(true);
        break;
      case 'weight':
        setHealthMetricsOpen(true);
        break;
      case 'photo':
        router.push('/(tabs)/pets/add-photos' as any);
        break;
      default:
        break;
    }
  };

  // No pets state
  if (pets.length === 0 && !loading) {
    return (
      <ResponsivePageWrapper showSidebar={isDesktop} scrollable={false}>
        {isMobile && <HomeHeader />}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <NoPetsState />
        </ScrollView>
      </ResponsivePageWrapper>
    );
  }

  // Mobile layout - use simple horizontal scroll
  if (isMobile) {
    return (
      <ResponsivePageWrapper showSidebar={false} scrollable={false}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <HomeHeader />
          <PWAInstallPrompt />

          {/* Your Companions - Horizontal Scroll */}
          <View style={styles.mobileSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.mobileSectionTitle}>Your Companions</Text>
              <TouchableOpacity
                style={styles.addButtonMobile}
                onPress={() => router.push('/(tabs)/pets/add-pet-wizard')}
              >
                <Ionicons name="add" size={20} color="#14532d" />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.petsScroll}
            >
              {pets.map(pet => (
                <DashboardPetCard
                  key={pet.id}
                  pet={pet}
                  onPress={(p) => router.push(`/(tabs)/pets/[id]/overview?id=${p.id}`)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.mobileSection}>
            <QuickActionsPanel />
          </View>

          {/* Upcoming Events */}
          <View style={styles.mobileSection}>
            <UpcomingEventsPanel />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </ResponsivePageWrapper>
    );
  }

  // Desktop/Tablet layout - use grid
  return (
    <ResponsivePageWrapper showSidebar={isDesktop} scrollable={false}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.content, !isDesktop && styles.contentTablet]}>
          {/* Main Column */}
          <View style={styles.mainColumn}>
            {/* Your Pets Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderDesktop}>
                <View style={styles.titleRow}>
                  <Text style={styles.sectionTitle}>Your Pets</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pets.length}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => router.push('/(tabs)/pets')}>
                  <Text style={styles.viewAllLink}>View All Pets</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <Text style={styles.loadingText}>Loading pets...</Text>
              ) : (
                <View style={[styles.petGrid, !isDesktop && styles.petGridTablet]}>
                  {pets.slice(0, 3).map((pet) => (
                    <View key={pet.id} style={[styles.petCardWrapper, !isDesktop && styles.petCardWrapperTablet]}>
                      <PetCardDesktop pet={pet} />
                    </View>
                  ))}
                  {pets.length < 3 && (
                    <TouchableOpacity
                      style={[styles.addPetCard, !isDesktop && styles.addPetCardTablet]}
                      onPress={() => router.push('/(tabs)/pets/add-pet-wizard')}
                    >
                      <View style={styles.addPetIconContainer}>
                        <Ionicons name="add" size={32} color="#6366F1" />
                      </View>
                      <Text style={styles.addPetText}>Add New Pet</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* Quick Actions */}
            <QuickActionsGrid onActionPress={handleQuickAction} />

            {/* Upcoming Care */}
            <UpcomingCarePanel />
          </View>

          {/* Sidebar Column - Only on desktop */}
          {isDesktop && (
            <View style={styles.sidebarColumn}>
              <PriorityAlertsPanel />
              <ActivityFeedTimeline />
            </View>
          )}
        </View>

        {/* Bottom padding for mobile tab bar on tablet */}
        {!isDesktop && <View style={{ height: 80 }} />}
      </ScrollView>

      {/* Modals */}
      <VisitFormModal visible={visitOpen} onClose={() => setVisitOpen(false)} />
      <VaccinationFormModal visible={vaccinationOpen} onClose={() => setVaccinationOpen(false)} />
      <TreatmentFormModal visible={treatmentOpen} onClose={() => setTreatmentOpen(false)} />
      <HealthMetricsModal
        visible={healthMetricsOpen}
        onClose={() => setHealthMetricsOpen(false)}
      />
    </ResponsivePageWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Mobile Styles
  mobileSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  mobileSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  addButtonMobile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#86efac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petsScroll: {
    paddingRight: 16,
    gap: 0,
  },

  // Desktop/Tablet Styles
  content: {
    flexDirection: 'row',
    gap: 32,
    padding: 32,
    maxWidth: 1440,
    alignSelf: 'center',
    width: '100%',
  },
  contentTablet: {
    flexDirection: 'column',
    padding: 24,
    gap: 24,
  },
  mainColumn: {
    flex: 2,
  },
  sidebarColumn: {
    flex: 1,
    minWidth: 320,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 40,
  },

  // Pet Grid
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  petGridTablet: {
    flexDirection: 'column',
  },
  petCardWrapper: {
    width: '31%',
    minWidth: 250,
  },
  petCardWrapperTablet: {
    width: '100%',
  },
  addPetCard: {
    width: '31%',
    minWidth: 250,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPetCardTablet: {
    width: '100%',
    paddingVertical: 32,
  },
  addPetIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addPetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
});
