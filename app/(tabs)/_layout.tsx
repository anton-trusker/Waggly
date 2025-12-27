
import React, { useEffect, useState } from 'react';
import { Stack, router, usePathname } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import FloatingTabBarWithPlus, { TabBarItem } from '@/components/layout/FloatingTabBarWithPlus';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import { colors } from '@/styles/commonStyles';
import AddActionsModal from '@/components/features/actions/AddActionsModal';
import { useLocale } from '@/hooks/useLocale';
import { usePets } from '@/hooks/usePets';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [quickActionVisible, setQuickActionVisible] = useState(false);
  const { t } = useLocale();
  const { pets } = usePets();

  // Desktop detection (>= 1024px)
  const isDesktop = width >= 1024;

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

  const tabs: TabBarItem[] = [
    {
      name: 'home',
      route: '/(tabs)/(home)',
      icon: 'home',
      label: 'navigation.home',
    },
    {
      name: 'calendar',
      route: '/(tabs)/calendar',
      icon: 'calendar-today',
      label: 'navigation.calendar',
    },
    {
      name: 'pets',
      route: '/(tabs)/pets',
      icon: 'pets',
      label: 'navigation.pets',
    },
    {
      name: 'settings',
      route: '/(tabs)/profile',
      icon: 'settings',
      label: 'navigation.settings',
    },
  ];

  const handleTabPressOverride = (route: string) => {
    if (route === '/(tabs)/pets' && pets && pets.length === 1) {
      router.push(`/(tabs)/pets/[id]/overview?id=${pets[0].id}`);
      return true; // Handled
    }
    return false; // Not handled, proceed with default
  };

  return (
    <>
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
      {/* Mobile Tab Bar - Hidden on desktop (sidebar shown instead) */}
      {!shouldHideTabBar && !isDesktop && (
        <FloatingTabBarWithPlus
          tabs={tabs}
          onPlusPress={() => setQuickActionVisible(true)}
          onTabPressOverride={handleTabPressOverride}
        />
      )}
      <AddActionsModal visible={quickActionVisible} onClose={() => setQuickActionVisible(false)} />
    </>
  );
}
