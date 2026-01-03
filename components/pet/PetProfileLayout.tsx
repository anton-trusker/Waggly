import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import PetProfileHeader from '@/components/desktop/pets/PetProfileHeader';
import { usePets } from '@/hooks/usePets';

interface PetProfileLayoutProps {
    petId: string;
    children: React.ReactNode;
}

export function PetProfileLayout({ petId, children }: PetProfileLayoutProps) {
    const { pets, loading } = usePets();
    const pet = pets?.find(p => p.id === petId);

    if (loading && !pet) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    if (!pet) {
        return (
            <View style={styles.center}>
                <Text>Pet not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PetProfileHeader pet={pet} />
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
