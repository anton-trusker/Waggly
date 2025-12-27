import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import SidebarNav from './SidebarNav';
import Topbar from './Topbar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'expo-router';
import { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from '@/hooks/useKeyboardShortcuts';
import KeyboardShortcutsModal from '@/components/desktop/KeyboardShortcutsModal';

interface DesktopShellProps {
    children: React.ReactNode;
}

const DesktopShell: React.FC<DesktopShellProps> = ({ children }) => {
    const { session } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Global keyboard shortcuts
    useKeyboardShortcuts({
        [KEYBOARD_SHORTCUTS.DASHBOARD]: () => router.push('/(tabs)/(home)'),
        [KEYBOARD_SHORTCUTS.CALENDAR]: () => router.push('/(tabs)/calendar'),
        [KEYBOARD_SHORTCUTS.PETS]: () => router.push('/(tabs)/pets'),
        [KEYBOARD_SHORTCUTS.NOTIFICATIONS]: () => router.push('/(tabs)/notifications'),
        [KEYBOARD_SHORTCUTS.SETTINGS]: () => router.push('/(tabs)/profile'),
        [KEYBOARD_SHORTCUTS.ADD_PET]: () => router.push('/(tabs)/pets/add-pet-wizard'),
        [KEYBOARD_SHORTCUTS.HELP]: () => setShowShortcuts(prev => !prev),
    });

    // Don't show shell on auth/onboarding pages or on mobile/tablet
    const isAuthPage = pathname?.startsWith('/(auth)') || pathname?.startsWith('/web/auth') || pathname?.startsWith('/web/onboarding');
    const showShell = session && !isAuthPage && width >= 1024;

    // Always render children, but only add shell UI on desktop
    if (!showShell) {
        return <>{children}</>;
    }

    return (
        <View style={styles.container}>
            <SidebarNav />
            <View style={styles.mainContent}>
                <Topbar />
                <View style={styles.content}>
                    {children}
                </View>
            </View>
            <KeyboardShortcutsModal
                visible={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
    },
    mainContent: {
        flex: 1,
        flexDirection: 'column',
    },
    content: {
        flex: 1,
        overflow: Platform.OS === 'web' ? ('auto' as any) : 'scroll',
    },
});

export default DesktopShell;
