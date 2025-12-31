import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
import EventsTab from '@/components/features/pets/profile/EventsTab';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import MobileHeader from '@/components/layout/MobileHeader';
import PetProfileHeader from '@/components/desktop/pets/PetProfileHeader';

export default function EventsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();
  const { theme } = useAppTheme();

  const pet = pets?.find(p => p.id === id);

  if (!pet) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <MobileHeader title="Events" showBack />
      <EventsTab petId={id} />
    </View>
  );
}