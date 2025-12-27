import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'expo-router';
import SidebarNav from '@/components/desktop/layout/SidebarNav';
import Topbar from '@/components/desktop/layout/Topbar';
import FloatingTabBar, { TabBarItem } from '@/components/layout/FloatingTabBar';
import KeyboardShortcutsModal from '@/components/desktop/KeyboardShortcutsModal';
import { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from '@/hooks/useKeyboardShortcuts';

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

    // Global keyboard shortcuts (Desktop only mainly, but safe to have)
    useKeyboardShortcuts({
        [KEYBOARD_SHORTCUTS.DASHBOARD]: () => router.push('/(tabs)/(home)'),
        [KEYBOARD_SHORTCUTS.CALENDAR]: () => router.push('/(tabs)/calendar'),
        [KEYBOARD_SHORTCUTS.PETS]: () => router.push('/(tabs)/pets'),
        [KEYBOARD_SHORTCUTS.NOTIFICATIONS]: () => router.push('/(tabs)/notifications'),
        [KEYBOARD_SHORTCUTS.SETTINGS]: () => router.push('/(tabs)/profile'),
        [KEYBOARD_SHORTCUTS.ADD_PET]: () => router.push('/(tabs)/pets/add-pet-wizard'),
        [KEYBOARD_SHORTCUTS.HELP]: () => setShowShortcuts(prev => !prev),
    });

    // Don't show shell on auth/onboarding pages
    const isAuthPage = pathname?.startsWith('/web/auth') || pathname?.startsWith('/web/onboarding');
    const showShell = session && !isAuthPage;

    if (!showShell) {
        return <View style={styles.fullScreen}>{children}</View>;
    }

    const mobileTabs: TabBarItem[] = [
        {
            name: 'dashboard',
            label: 'Home',
            icon: 'home' as any,
            route: '/(tabs)/(home)',
        },
        {
            name: 'calendar',
            label: 'Calendar',
            icon: 'calendar_today' as any,
            route: '/web/calendar',
        },
        {
            name: 'pets',
            label: 'Pets',
            icon: 'pets' as any,
            route: '/web/pets',
        },
        {
            name: 'notifications',
            label: 'Alerts',
            icon: 'notifications' as any,
            route: '/web/notifications',
        },
        {
            name: 'menu',
            label: 'Menu',
            icon: 'menu' as any,
            route: '/web/settings',
        },
    ];

    return (
        <View style={styles.container}>
            {isDesktop && <SidebarNav />}

            <View style={styles.mainContent}>
                {isDesktop && <Topbar />}

                <View style={[styles.content, !isDesktop && styles.contentMobile]}>
                    {children}
                </View>

                {!isDesktop && (
                    <FloatingTabBar
                        tabs={mobileTabs}
                        containerWidth={Math.min(width - 32, 400)}
                        borderRadius={24}
                    />
                )}
            </View>

            {isDesktop && (
                <KeyboardShortcutsModal
                    visible={showShortcuts}
                    onClose={() => setShowShortcuts(false)}
                />
            )}
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
        paddingBottom: 80, // Space for floating tab bar
    },
});
