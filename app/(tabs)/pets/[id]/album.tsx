import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
import AlbumTab from '@/components/features/pets/profile/AlbumTab';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import MobileHeader from '@/components/layout/MobileHeader';
import PetProfileHeader from '@/components/desktop/pets/PetProfileHeader';

export default function AlbumScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();
  const { theme } = useAppTheme();

  const pet = pets?.find(p => p.id === id);

  if (!pet) return null;

  const handleAction = (type: string) => {
    // Placeholder navigation for now
    console.log('Navigating to', type);
    if (type === 'new_album') {
      router.push(`/web/pets/albums/new?petId=${id}` as any);
    } else if (type === 'add_media') {
      router.push(`/web/pets/photos/add?petId=${id}` as any);
    }
  };

  const content = (
    <AlbumTab
      onNewAlbum={() => handleAction('new_album')}
      onAddMedia={() => handleAction('add_media')}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <DesktopShell>
        <PetProfileHeader pet={pet} />
        {content}
      </DesktopShell>
    </View>
  );
}
