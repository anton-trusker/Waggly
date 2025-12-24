import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import { HealthSummaryCard } from './HealthSummaryCard';
import { usePets } from '@/hooks/usePets';
import { usePersistentState } from '@/utils/persistentState';
import { router } from 'expo-router';
import dayjs from 'dayjs';

import { usePetHealthData } from '@/hooks/usePetHealthData';

export function PetHealthSummary() {
  const { pets } = usePets();
  const { state: lastSelectedPetId } = usePersistentState<string | null>('lastSelectedPetId', null);
  const selectedPet = pets.find(pet => pet.id === lastSelectedPetId) || pets[0];
  const { healthData, loading, error } = usePetHealthData(selectedPet?.id);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Health Summary</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Loading health data...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Health Summary</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Error loading health data: {error}</Text>
        </View>
      </View>
    );
  }

  const handleCardPress = (route: string) => {
    if (selectedPet) {
      router.push(route);
    }
  };

  if (!selectedPet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Health Summary</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Please select a pet to view health summary.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Summary</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {healthData?.lastVetVisit && (
          <HealthSummaryCard
            iconName="stethoscope"
            iconLibrary="FontAwesome5"
            label="Last Vet Visit"
            value={dayjs(healthData.lastVetVisit.date).format('MMM D, YYYY')}
            context={healthData.lastVetVisit.reason}
            onPress={() => handleCardPress(`/(tabs)/pets/pet-detail?id=${selectedPet.id}&section=visits`)}
            accessibilityLabel={`Last vet visit on ${dayjs(healthData.lastVetVisit.date).format('MMMM D, YYYY')} for ${healthData.lastVetVisit.reason}`}
          />
        )}
        {healthData?.nextVaccineDue && (
          <HealthSummaryCard
            iconName="needle"
            iconLibrary="MaterialCommunityIcons"
            label="Next Vaccine Due"
            value={`${healthData.nextVaccineDue.name} (${dayjs(healthData.nextVaccineDue.date).format('MMM D, YYYY')})`}
            context={dayjs(healthData.nextVaccineDue.date).isBefore(dayjs(), 'day') ? 'Overdue' : 'Upcoming'}
            onPress={() => handleCardPress(`/(tabs)/pets/pet-detail?id=${selectedPet.id}&section=vaccinations`)}
            accessibilityLabel={`Next vaccine due: ${healthData.nextVaccineDue.name} on ${dayjs(healthData.nextVaccineDue.date).format('MMMM D, YYYY')}`}
          />
        )}
        {healthData?.currentWeight && (
          <HealthSummaryCard
            iconName="weight-scale"
            iconLibrary="MaterialCommunityIcons"
            label="Current Weight"
            value={healthData.currentWeight.value}
            context={`Recorded ${dayjs(healthData.currentWeight.date).format('MMM D, YYYY')}`}
            onPress={() => handleCardPress(`/(tabs)/pets/pet-detail?id=${selectedPet.id}&section=weight`)}
            accessibilityLabel={`Current weight: ${healthData.currentWeight.value} recorded on ${dayjs(healthData.currentWeight.date).format('MMMM D, YYYY')}`}
          />
        )}
        {healthData?.activeTreatments !== undefined && (
          <HealthSummaryCard
            iconName="pill"
            iconLibrary="MaterialCommunityIcons"
            label="Active Treatments"
            value={`${healthData.activeTreatments} ongoing`}
            context="Medication reminders"
            onPress={() => handleCardPress(`/(tabs)/pets/pet-detail?id=${selectedPet.id}&section=treatments`)}
            accessibilityLabel={`${healthData.activeTreatments} active treatments`}
          />
        )}
        {healthData?.allergies !== undefined && (
          <HealthSummaryCard
            iconName="allergies"
            iconLibrary="FontAwesome5"
            label="Allergies/Conditions"
            value={healthData.allergies.length > 0 ? 'Yes' : 'None recorded'}
            context={healthData.allergies.length > 0 ? healthData.allergies.join(', ') : undefined}
            onPress={() => handleCardPress(`/(tabs)/pets/pet-detail?id=${selectedPet.id}&section=conditions`)}
            accessibilityLabel={healthData.allergies.length > 0 ? `Allergies and conditions: ${healthData.allergies.join(', ')}` : 'No allergies or conditions recorded'}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: getSpacing(6),
  },
  title: {
    ...designSystem.typography.title.medium,
    color: getColor('text.primary'),
    marginBottom: getSpacing(4),
    paddingHorizontal: getSpacing(5),
  },
  scrollViewContent: {
    paddingHorizontal: getSpacing(5),
    gap: getSpacing(3),
  },
  emptyState: {
    padding: getSpacing(5),
    backgroundColor: getColor('background.secondary'),
    borderRadius: designSystem.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...designSystem.shadows.sm,
  },
  emptyStateText: {
    ...designSystem.typography.body.medium,
    color: getColor('text.secondary'),
    textAlign: 'center',
  },
});
