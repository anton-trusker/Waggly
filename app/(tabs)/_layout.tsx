
import React, { useEffect, useState } from 'react';
import { Stack, router, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/styles/commonStyles';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import AddActionsModal from '@/components/features/actions/AddActionsModal';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [quickActionVisible, setQuickActionVisible] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ResponsiveShell>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="pets" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="profile" />
      </Stack>
      <AddActionsModal visible={quickActionVisible} onClose={() => setQuickActionVisible(false)} />
    </ResponsiveShell>
  );
}
