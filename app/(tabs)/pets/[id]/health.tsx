import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PetHealthProfile } from '@/components/health/PetHealthProfile';
import { PetProfileLayout } from '@/components/pet/PetProfileLayout';

export default function HealthTabPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <PetProfileLayout petId={id as string}>
      <PetHealthProfile petId={id as string} />
    </PetProfileLayout>
  );
}
