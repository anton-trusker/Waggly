import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useAllergies } from '@/hooks/useAllergies';
import { useMedications } from '@/hooks/useMedications';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Pet } from '@/types';
import MobileHeader from '@/components/layout/MobileHeader';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import PetProfileHeader from '@/components/desktop/pets/PetProfileHeader';
import PetKeyInfoWidget from '@/components/widgets/PetKeyInfoWidget';
import PetAllergiesWidget from '@/components/widgets/PetAllergiesWidget';
import PetPastConditionsWidget from '@/components/widgets/PetPastConditionsWidget';
import PetHealthStatusWidget from '@/components/widgets/PetHealthStatusWidget';
import PetMedicationsWidget from '@/components/widgets/PetMedicationsWidget';
import PetVaccinationsWidget from '@/components/widgets/PetVaccinationsWidget';
import PetUpcomingEventsWidget from '@/components/widgets/PetUpcomingEventsWidget';

export default function OverviewTab() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params.id as string;
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  const isMobile = width < 768; // Mobile breakpoint

  const { theme } = useAppTheme();
  const { pets } = usePets();
  const pet = pets.find(p => p.id === petId) as Pet | undefined;

  // Modal states removed - use global plus button instead

  const { events } = useEvents({ petIds: pet ? [pet.id] : [], startDate: new Date().toISOString().slice(0, 10) });
  const { vaccinations } = useVaccinations(petId);
  const { allergies } = useAllergies(petId);
  const { medications } = useMedications(petId);

  // Filter for upcoming events
  const upcomingEvents = events.slice(0, 2);

  // Filter for active vaccines (next due date in future or not set)
  const activeVaccines = vaccinations.filter(v => {
    if (!v.next_due_date) return true;
    return new Date(v.next_due_date) >= new Date();
  }).slice(0, 2); // Show top 2

  // Get next vaccine due date for status card
  const nextVaccineDue = vaccinations
    .filter(v => v.next_due_date && new Date(v.next_due_date) >= new Date())
    .sort((a, b) => new Date(a.next_due_date!).getTime() - new Date(b.next_due_date!).getTime())[0];

  const activeMedications = medications.slice(0, 2); // Show top 2

  if (!pet) {
    return (
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>Loading pet overview...</Text>
      </View>
    );
  }

  // Quick actions removed - use global plus button for actions

  return (
    <>
      {width >= 1024 ? (
        <DesktopShell>
          <PetProfileHeader pet={pet} />
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.desktopLayout}>
                {/* Left Column */}
                <View style={styles.leftColumn}>
                  <PetKeyInfoWidget pet={pet} />
                  <PetAllergiesWidget allergies={allergies} />
                  <PetPastConditionsWidget />
                </View>

                {/* Right Column */}
                <View style={styles.rightColumn}>
                  <PetHealthStatusWidget nextVaccineDue={nextVaccineDue} />

                  <View style={styles.gridRow}>
                    <PetMedicationsWidget medications={activeMedications} />
                    <PetVaccinationsWidget vaccinations={activeVaccines} />
                  </View>

                  <PetUpcomingEventsWidget events={upcomingEvents} />
                </View>
              </View>
            </View>
          </ScrollView>
        </DesktopShell>
      ) : (
        <>
          <MobileHeader title={pet.name} showBack={true} showNotifications={true} />
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <PetHealthStatusWidget nextVaccineDue={nextVaccineDue} />
              <PetUpcomingEventsWidget events={upcomingEvents} />

              <View style={styles.gridRow}>
                <PetMedicationsWidget medications={activeMedications} />
                <PetVaccinationsWidget vaccinations={activeVaccines} />
              </View>

              <PetKeyInfoWidget pet={pet} />
              <PetAllergiesWidget allergies={allergies} />
              <PetPastConditionsWidget />
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F8',
  },
  content: {
    padding: 24,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  desktopLayout: {
    flexDirection: 'row',
    gap: 24,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 2,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 24,
  },
});
