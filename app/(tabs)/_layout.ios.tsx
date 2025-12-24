
import React, { useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const { t } = useLocale();

  // Define paths where the bottom menu should be hidden
  const shouldHideTabBar = 
    pathname.includes('/add-') || 
    pathname.includes('/edit') || 
    pathname.includes('/wizard') || 
    pathname.includes('/log-') ||
    pathname.includes('/co-owners');

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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: () => '🏠',
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          tabBarIcon: () => '🐾',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: () => '🔔',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => '👤',
        }}
      />
    </Tabs>
  );
}
