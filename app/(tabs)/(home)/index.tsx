import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { IconSymbol } from '@/components/ui/IconSymbol';
import PetQuickViewModal from '@/components/features/pets/PetQuickViewModal';
import { QuickActionsPanel } from '@/components/dashboard/QuickActionsPanel';
import UpcomingEventsPanel from '@/components/features/events/UpcomingEventsPanel';
import PWAInstallPrompt from '@/components/features/pwa/PWAInstallPrompt';
import HomeHeader from '@/components/dashboard/HomeHeader';
import DashboardPetCard from '@/components/dashboard/DashboardPetCard';
import NoPetsState from '@/components/dashboard/NoPetsState';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Pet } from '@/types';

export default function HomeScreen() {
  const { pets, refresh: refreshPets, loading: petsLoading } = usePets();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useAppTheme();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPets();
    // In a real app, we'd also refresh events here via a global refresh or by triggering event hook refresh
    setRefreshing(false);
  };

  const dynamicStyles = {
    container: { backgroundColor: colors.background.primary },
    sectionTitle: { color: colors.text.primary },
    addButton: { backgroundColor: colors.success[300] } // green-300 light
  };

  if (pets.length === 0 && !petsLoading) {
    return (
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <HomeHeader />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <NoPetsState />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <HomeHeader />
        <PWAInstallPrompt />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Your Companions</Text>
            <TouchableOpacity
              style={[styles.addButton, dynamicStyles.addButton]}
              onPress={() => router.push('/(tabs)/pets/add-pet-wizard')}
            >
              <IconSymbol ios_icon_name="plus" android_material_icon_name="add" size={20} color="#14532d" />
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
                onPress={setSelectedPet}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <QuickActionsPanel />
        </View>

        <View style={styles.section}>
          <UpcomingEventsPanel />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {selectedPet && (
        <PetQuickViewModal
          pet={selectedPet}
          visible={!!selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petsScroll: {
    paddingRight: 20, // To allow scrolling the last item fully into view with margin
    gap: 0,
  },
});

