import React from 'react';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';

export default function PetDetailLayout() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: designSystem.colors.primary[500],
                tabBarInactiveTintColor: designSystem.colors.text.secondary,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: designSystem.colors.border.primary,
                    paddingBottom: isMobile ? 8 : 4,
                    height: isMobile ? 60 : 50,
                },
                tabBarLabelStyle: {
                    fontSize: isMobile ? 11 : 12,
                    fontWeight: '600',
                },
                tabBarIconStyle: {
                    marginTop: isMobile ? 4 : 2,
                },
            }}
        >
            <Tabs.Screen
                name="overview"
                options={{
                    title: 'Overview',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="passport"
                options={{
                    title: 'Passport',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="health"
                options={{
                    title: 'Health',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="medical-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="album"
                options={{
                    title: 'Album',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="images-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: 'Events',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="documents"
                options={{
                    title: 'Documents',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="folder-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
