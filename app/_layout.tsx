import '@/lib/i18n';
import React, { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { designSystem } from '@/constants/designSystem';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { DesignSystemProvider } from '@/design-system/DesignSystemProvider';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemeProvider as ThemeContextProvider } from '@/contexts/ThemeContext';
import { useAppTheme } from '@/hooks/useAppTheme';

function RootLayoutNav() {
  const { session, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Handle Deep Linking
  useEffect(() => {
    // ... existing code ...
    const handleDeepLink = async (event: { url: string }) => {
      const { path, queryParams } = Linking.parse(event.url);

      // Check for Invite Token in URL (mypawzly://invite/TOKEN)
      if (path && path.startsWith('invite/') && user) {
        const token = path.split('/')[1];
        if (token) {
          try {
            // Find invite by token
            const { data, error } = await supabase
              .from('co_owners')
              .select('*')
              .eq('invite_token', token)
              .single();

            if (error || !data) {
              Alert.alert('Error', 'Invalid or expired invite link.');
              return;
            }

            if (data.status === 'accepted') {
              Alert.alert('Info', 'This invite has already been accepted.');
              return;
            }

            // Accept Invite
            const { error: updateError } = await supabase
              .from('co_owners')
              .update({
                status: 'accepted',
                co_owner_id: user.id,
                co_owner_email: user.email, // Update with actual email
                invite_token: null // Consume token
              })
              .eq('id', data.id);

            if (updateError) throw updateError;

            Alert.alert('Success', 'You have successfully joined as a co-owner!');
            router.push('/(tabs)/profile/co-owners');

          } catch (err: any) {
            Alert.alert('Error', 'Failed to accept invite: ' + err.message);
          }
        }
      }
    };

    // Listen for incoming links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check initial link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)' || (segments[0] === 'web' && segments[1] === 'auth');
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const isPublicRoute = segments[0] === 'pet' && segments[1] === 'shared';

    // If logged in and still in auth pages, go to home
    if (session && inAuthGroup) {
      router.replace('/(tabs)/(home)');
    }

    // If not logged in and not in auth/onboarding or public route, go to login
    if (!session && !inAuthGroup && !inOnboardingGroup && !isPublicRoute) {
      router.replace('/(auth)/login');
    }
  }, [session, segments]);

  return (
    <NavigationThemeProvider />
  );
}

function NavigationThemeProvider() {
  const { isDark } = useAppTheme();
  // We can still use React Navigation's themes if we want, or make custom ones
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#000' : designSystem.colors.background.primary,
          },
          headerTintColor: isDark ? '#fff' : designSystem.colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <DesignSystemProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeContextProvider>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </ThemeContextProvider>
      </GestureHandlerRootView>
    </DesignSystemProvider>
  );
}
