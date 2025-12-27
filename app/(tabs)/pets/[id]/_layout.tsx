import React from 'react';
import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import DesktopPetDetail from '@/components/desktop/pets/DesktopPetDetail';
import { usePets } from '@/hooks/usePets';
import { useVeterinarians } from '@/hooks/useVeterinarians';
import { useConditions } from '@/hooks/useConditions';
import { Pet } from '@/types';

export default function PetDetailLayout() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const isDesktop = width >= 1024;

    // Fetch data for Desktop View
    const { pets, loading: petsLoading } = usePets();
    const pet = pets.find(p => p.id === id) as Pet | undefined;
    const { veterinarians, loading: vetsLoading } = useVeterinarians(id || null);
    const { conditions, loading: conditionsLoading } = useConditions(id || null);

    const handleEdit = () => {
        // Navigate to edit page (responsive modal or page)
        // If we have a desktop modal, we could open it here, but router is safer
        router.push(`/pets/pet-edit?id=${id}`);
    };

    const handleShare = () => {
        // Implement share logic or open share modal
        console.log('Share pet', id);
    };

    if (isDesktop) {
        if (petsLoading || vetsLoading || conditionsLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
                </View>
            );
        }

        if (!pet) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Pet not found</Text>
                </View>
            );
        }

        return (
            <DesktopPetDetail
                pet={pet}
                vets={veterinarians}
                conditions={conditions}
                onEdit={handleEdit}
                onShare={handleShare}
            />
        );
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: designSystem.colors.primary[500],
                tabBarInactiveTintColor: designSystem.colors.text.secondary,
                tabBarStyle: {
                    display: width >= 1024 ? 'none' : 'flex', // Hide on desktop logic redundant but safe
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: designSystem.colors.border.primary,
                    paddingBottom: isMobile ? 12 : 4,
                    paddingTop: isMobile ? 8 : 4,
                    height: isMobile ? 68 : 50,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: isMobile ? 0.05 : 0.02,
                    shadowRadius: 8,
                    elevation: 8,
                },
                tabBarLabelStyle: {
                    fontSize: isMobile ? 12 : 12,
                    fontWeight: '600',
                    marginTop: isMobile ? 4 : 2,
                },
                tabBarIconStyle: {
                    marginTop: isMobile ? 2 : 2,
                },
            }}
        >
            <Tabs.Screen
                name="overview"
                options={{
                    title: 'Overview',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={isMobile ? 24 : size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="health"
                options={{
                    title: 'Health',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="medical" size={isMobile ? 24 : size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="album"
                options={{
                    title: 'Gallery',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="images" size={isMobile ? 24 : size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="documents"
                options={{
                    title: 'Documents',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="folder" size={isMobile ? 24 : size} color={color} />
                    ),
                }}
            />
            {/* Hidden tabs - still accessible via navigation but not shown in tab bar */}
            <Tabs.Screen
                name="history"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="passport"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    href: null, // Hide from tab bar
                }}
            />
        </Tabs>
    );
}
