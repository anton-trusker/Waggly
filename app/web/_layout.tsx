import '@/lib/i18n';
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import ResponsiveShell from '@/components/layout/ResponsiveShell';

export default function WebLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <ThemeProvider>
                <AuthProvider>
                    <ResponsiveShell>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="auth" />
                            <Stack.Screen name="onboarding" />
                            <Stack.Screen name="dashboard" />
                            <Stack.Screen name="calendar" />
                            <Stack.Screen name="pets" />
                            <Stack.Screen name="health" />
                            <Stack.Screen name="share" />
                            <Stack.Screen name="notifications" />
                            <Stack.Screen name="settings" />
                            <Stack.Screen name="documents" />
                        </Stack>
                    </ResponsiveShell>
                </AuthProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
