import React, { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, useWindowDimensions } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { DesignSystemProvider } from '@/design-system/DesignSystemProvider';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * This layout handles pet detail routes for both mobile and desktop.
 * - MOBILE: Shows the tab navigation (Overview, Health, Gallery, Documents)
 * - DESKTOP: Redirects to /web/pets/[id] for the unified pet detail page
 */
export default function PetDetailLayout() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;

    // Only redirect on desktop
    useEffect(() => {
        if (isDesktop && id) {
            router.replace(`/web/pets/${id}` as any);
        }
    }, [isDesktop, id, router]);

    // Desktop: Show loading while redirecting
    if (isDesktop) {
        return (
            <DesignSystemProvider>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
                    <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
                    <Text style={{ marginTop: 16, color: designSystem.colors.text.secondary, fontSize: 14 }}>
                        Loading pet profile...
                    </Text>
                </View>
            </DesignSystemProvider>
        );
    }

    // Mobile: Show tabs navigation
    const isMobile = width < 768;

    return (
        <DesignSystemProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: designSystem.colors.primary[500],
                    tabBarInactiveTintColor: designSystem.colors.text.secondary,
                    tabBarStyle: {
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
                {/* Hidden tabs */}
                <Tabs.Screen
                    name="history"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="share"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="passport"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="events"
                    options={{
                        href: null,
                    }}
                />
            </Tabs>
        </DesignSystemProvider>
    );
}
