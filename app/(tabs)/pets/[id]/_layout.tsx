/**
 * Pet Detail Layout
 * 
 * This layout wraps all pet detail pages/tabs.
 * ResponsiveShell handles desktop/mobile rendering automatically.
 */
import React from 'react';
import { Stack } from 'expo-router';

export default function PetDetailLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="overview" />
            <Stack.Screen name="health" />
            <Stack.Screen name="passport" />
            <Stack.Screen name="documents" />
            <Stack.Screen name="album" />
            <Stack.Screen name="history" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="events" />
            <Stack.Screen name="edit" />
            <Stack.Screen name="share" />
        </Stack>
    );
}
