import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'expo-router';
import SidebarNav from '@/components/desktop/layout/SidebarNav';
import AppHeader from '@/components/layout/AppHeader';

import FloatingTabBarWithPlus, { TabBarItem } from '@/components/layout/FloatingTabBarWithPlus';
import KeyboardShortcutsModal from '@/components/desktop/KeyboardShortcutsModal';
import AddActionsModal from '@/components/features/actions/AddActionsModal';
import { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from '@/hooks/useKeyboardShortcuts';
import { useRouter } from 'expo-router';

interface ResponsiveShellProps {
    children: React.ReactNode;
}

export default function ResponsiveShell({ children }: ResponsiveShellProps) {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const { session } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [quickActionVisible, setQuickActionVisible] = useState(false);

    // Global keyboard shortcuts - DISABLED
    // useKeyboardShortcuts({
    //     [KEYBOARD_SHORTCUTS.DASHBOARD]: () => router.push('/(tabs)/(home)'),
    //     [KEYBOARD_SHORTCUTS.CALENDAR]: () => router.push('/(tabs)/calendar'),
    //     [KEYBOARD_SHORTCUTS.PETS]: () => router.push('/(tabs)/pets'),
    //     [KEYBOARD_SHORTCUTS.NOTIFICATIONS]: () => router.push('/(tabs)/notifications'),
    //     [KEYBOARD_SHORTCUTS.SETTINGS]: () => router.push('/(tabs)/profile'),
    //     [KEYBOARD_SHORTCUTS.ADD_PET]: () => router.push('/(tabs)/pets/add-pet-wizard'),
    //     [KEYBOARD_SHORTCUTS.HELP]: () => setShowShortcuts(prev => !prev),
    // });

    // Don't show shell on auth/onboarding pages
    const isAuthPage = pathname?.startsWith('/(auth)') || pathname?.startsWith('/(onboarding)');
    const showShell = session && !isAuthPage;

    // Hide bottom navigation during wizard flows and add-record forms
    const isWizardRoute = pathname?.includes('/pets/new') || pathname?.includes('/add-pet') || pathname?.includes('/add-');

    if (!showShell) {
        return <View style={styles.fullScreen}>{children}</View>;
    }

    const mobileTabs: TabBarItem[] = [
        {
            name: 'dashboard',
            label: 'navigation.home',
            icon: 'home' as any,
            route: '/(tabs)/(home)',
        },
        {
            name: 'calendar',
            label: 'navigation.calendar',
            icon: 'event' as any,
            route: '/(tabs)/calendar',
        },
        {
            name: 'pets',
            label: 'navigation.pets',
            icon: 'pets' as any,
            route: '/(tabs)/pets',
        },
        {
            name: 'settings',
            label: 'Settings',
            icon: 'settings' as any,
            route: '/(tabs)/profile',
        },
    ];

    return (
        <View style={styles.container}>
            {isDesktop && <SidebarNav />}

            <View style={styles.mainContent}>
                <AppHeader />

                <View style={[styles.content, !isDesktop && styles.contentMobile]}>
                    {children}
                </View>

                {!isDesktop && !isWizardRoute && (
                    <FloatingTabBarWithPlus
                        tabs={mobileTabs}
                        onPlusPress={() => setQuickActionVisible(true)}
                    />
                )}
            </View>

            {isDesktop && (
                <KeyboardShortcutsModal
                    visible={showShortcuts}
                    onClose={() => setShowShortcuts(false)}
                />
            )}

            <AddActionsModal
                visible={quickActionVisible}
                onClose={() => setQuickActionVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
        flexDirection: 'row', // Desktop: Row (Sidebar + Main)
        backgroundColor: '#f8fafc',
    },
    mainContent: {
        flex: 1,
        flexDirection: 'column',
        position: 'relative',
    },
    content: {
        flex: 1,
        overflow: Platform.OS === 'web' ? ('auto' as any) : 'scroll',
    },
    contentMobile: {
        // paddingBottom removed as per user request to remove blocking section
    },
});
