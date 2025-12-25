import React, { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { designSystem } from '@/constants/designSystem';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

function RootLayoutNav() {
  const { session, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

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
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (session && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (session && !inAuthGroup && !inOnboardingGroup) {
      // Profile check logic placeholder
    }

    // Simple check: If no session, go to login.
    if (!session) {
      if (inOnboardingGroup) {
        router.replace('/(auth)/login');
      } else if (!inAuthGroup && segments[0] !== 'welcome') {
        router.replace('/(auth)/login');
      }
    }
  }, [session, segments]);

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : designSystem.colors.background.primary,
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : designSystem.colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
