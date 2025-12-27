
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useAllergies } from '@/hooks/useAllergies';
import { useMedications } from '@/hooks/useMedications';
import { useTreatments } from '@/hooks/useTreatments';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Pet } from '@/types';
import MobileHeader from '@/components/layout/MobileHeader';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import PetProfileHeader from '@/components/desktop/pets/PetProfileHeader';
import HealthTab from '@/components/features/pets/profile/HealthTab';
// Use local Condition type if needed, but imported from types
import { Condition } from '@/types';


export default function PetHealthScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768; // Matching previous DesktopShell logic

  const { theme } = useAppTheme();
  const { pets } = usePets();
  const pet = pets?.find(p => p.id === id) as Pet | undefined;

  // Data Hooks
  const { events } = useEvents({ petIds: id ? [id] : [], startDate: new Date().toISOString().slice(0, 10) });
  const { vaccinations } = useVaccinations(id);
  const { allergies } = useAllergies(id);
  const { medications } = useMedications(id); // Passed for future use or if HealthTab processes meds
  const { treatments } = useTreatments(id);

  // Use 'conditions' from treatments or medical_history if available
  // For now assuming treatments hook might provide it or separate hook. 
  // If not available, we pass empty array or fetch if we had a hook.
  // The old code mocked logs. Providing mock empty array for now or derived data.
  const conditions: Condition[] = []; // TODO: Add useMedicalHistory hook

  const handleAddRecord = (type: string) => {
    switch (type) {
      case 'visit':
        router.push(`/web/pets/visit/new?petId=${id}`);
        break;
      case 'vaccination':
        router.push(`/web/pets/vaccination/new?petId=${id}`);
        break;
      case 'treatment':
        router.push(`/web/pets/treatment/new?petId=${id}`);
        break;
      case 'document':
        router.push(`/web/pets/documents/add?petId=${id}`);
        break;
      case 'photo':
        router.push(`/web/pets/photos/add?petId=${id}`);
        break;
      case 'allergy':
      // Add allergy route? Or modal? Assuming a new route for now
      case 'allergy':
        router.push(`/web/pets/allergy/new?petId=${id}`);
        break;
      default:
        console.log("Unknown record type", type);
    }
  };

  if (!pet) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ color: theme.colors.text.secondary }}>Loading pet health data...</Text>
      </View>
    );
  }

  const content = (
    <HealthTab
      pet={pet}
      vaccinations={vaccinations}
      treatments={treatments}
      conditions={conditions}
      allergies={allergies}
      visits={events} // Events serve as visits
      onAddRecord={handleAddRecord}
    />
  );

  if (isDesktop) {
    return (
      <DesktopShell>
        <PetProfileHeader pet={pet} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      </DesktopShell>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <MobileHeader title={`${pet.name}'s Health`} showBack />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {content}
      </ScrollView>
    </View>
  );
}
