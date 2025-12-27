import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
import HistoryTab from '@/components/features/pets/profile/HistoryTab';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import MobileHeader from '@/components/layout/MobileHeader';
import PetProfileHeader from '@/components/desktop/pets/PetProfileHeader';

export default function HistoryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { pets } = usePets();
    const { theme } = useAppTheme();

    const pet = pets?.find(p => p.id === id);

    if (!pet) return null;

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
            <DesktopShell>
                <PetProfileHeader pet={pet} />
                <HistoryTab petId={id} />
            </DesktopShell>
        </View>
    );
}
