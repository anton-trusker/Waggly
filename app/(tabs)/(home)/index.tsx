import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

// Design System
import { designSystem } from '@/constants/designSystem';
import { PetCard } from '@/components/design-system/widgets/PetCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

// Hooks / Context
import { useAuth } from '@/context/AuthContext';
import { usePets } from '@/hooks/usePets';
import { usePetProfileData } from '@/hooks/usePetProfileData';
import { usePetHealthData } from '@/hooks/usePetHealthData';

// Features (Legacy components we might migrate later: ActivityFeed, QuickActions)
import ActivityFeed from '@/components/features/dashboard/ActivityFeed';
import QuickActions from '@/components/features/dashboard/QuickActions';

export default function HomeScreen() {
    const { user } = useAuth();
    const { pets, loading: petsLoading, refreshPets } = usePets();
    const [refreshing, setRefreshing] = useState(false);

    // We might just show the first pet's quick stats if available, or summary logic
    // For now, let's keep the dashboard focused on the Pet List and Feed

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refreshPets();
        // Refresh other data if needed
        setRefreshing(false);
    }, [refreshPets]);

    const handlePetPress = (petId: string) => {
        router.push(`/(tabs)/pets/${petId}`);
    };

    const handleAddPet = () => {
        router.push('/(tabs)/pets/add-pet');
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.user_metadata?.full_name?.split(' ')[0] || 'Friend'} 👋</Text>
                    <Text style={styles.subtitle}>Welcome back to Waggly</Text>
                </View>
                <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
                    {/* If we had a user avatar, we'd show it here. For now, a simple icon */}
                    <IconSymbol android_material_icon_name="person" ios_icon_name="person.crop.circle" size={24} color={designSystem.colors.primary[500]} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={designSystem.colors.primary[500]} />}
            >
                {/* Pets Horizontal List */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Your Pets</Text>
                        <TouchableOpacity onPress={handleAddPet}>
                            <IconSymbol android_material_icon_name="add" ios_icon_name="plus" size={24} color={designSystem.colors.primary[500]} />
                        </TouchableOpacity>
                    </View>

                    {pets.length === 0 && !petsLoading ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No pets yet. Add one to get started!</Text>
                            <Button
                                title="Add Pet"
                                onPress={handleAddPet}
                                variant="primary"
                                size="sm"
                            />
                        </View>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petsList}>
                            {/* Add New Card (First item usually) */}
                            <TouchableOpacity style={styles.addPetCard} onPress={handleAddPet}>
                                <View style={styles.addPetIcon}>
                                    <IconSymbol android_material_icon_name="add" ios_icon_name="plus" size={24} color={designSystem.colors.primary[500]} />
                                </View>
                                <Text style={styles.addPetText}>Add Pet</Text>
                            </TouchableOpacity>

                            {/* Pet Cards */}
                            {pets.map(pet => (
                                <PetCard
                                    key={pet.id}
                                    pet={pet}
                                    variant="compact" // Compact looks best for horizontal/dashboard
                                    onPress={() => handlePetPress(pet.id)}
                                    style={styles.petCardSpacing}
                                />
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Quick Actions (Keep existing logic but styled?) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <QuickActions />
                </View>

                {/* Activity Feed */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <ActivityFeed limit={5} />
                </View>

                <View style={{ height: 80 }} />
            </ScrollView>

            <LoadingOverlay visible={petsLoading && !refreshing && pets.length === 0} />
        </SafeAreaView>
    );
}

// Temporary Button import if not available globally yet (or remove if using DesignSystem Button always)
import { Button } from '@/components/design-system/primitives/Button';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: designSystem.colors.background.secondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: designSystem.colors.background.primary,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    subtitle: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
    },
    profileButton: {
        padding: 8,
        backgroundColor: designSystem.colors.neutral[50],
        borderRadius: 20,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingBottom: 40,
    },
    section: {
        marginTop: 24,
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
        color: designSystem.colors.text.primary,
        marginBottom: 12, // For sections without header row
    },
    petsList: {
        paddingRight: 20,
        gap: 12,
    },
    petCardSpacing: {
        // Optional spacing overrides if needed
    },
    addPetCard: {
        width: 140, // Match compact card width
        padding: 16,
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: designSystem.colors.neutral[200],
        borderStyle: 'dashed',
        height: 156, // Approx height of compact card to align
    },
    addPetIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: designSystem.colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    addPetText: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.primary[500],
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 16,
    },
    emptyText: {
        color: designSystem.colors.text.secondary,
        marginBottom: 16,
    }
});
