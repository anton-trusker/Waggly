import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import FloatingTabBar, { TabBarItem } from '@/components/layout/FloatingTabBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'expo-router';

interface MobileShellProps {
    children: React.ReactNode;
}

const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
    const { session } = useAuth();
    const pathname = usePathname();
    const { width } = useWindowDimensions();

    // Don't show shell on auth/onboarding pages
    const isAuthPage = pathname?.startsWith('/(auth)') || pathname?.startsWith('/(onboarding)');
    const showShell = session && !isAuthPage;

    if (!showShell) {
        return <View style={styles.container}>{children}</View>;
    }

    const tabs: TabBarItem[] = [
        {
            name: 'dashboard',
            label: 'Home',
            icon: 'home' as any,
            route: '/(tabs)/(home)',
        },
        {
            name: 'calendar',
            label: 'Calendar',
            icon: 'event' as any,
            route: '/(tabs)/calendar',
        },
        {
            name: 'pets',
            label: 'Pets',
            icon: 'pets' as any,
            route: '/(tabs)/pets',
        },
        {
            name: 'notifications',
            label: 'Alerts',
            icon: 'notifications' as any,
            route: '/(tabs)/notifications',
        },
        {
            name: 'menu',
            label: 'Menu',
            icon: 'menu' as any,
            route: '/(tabs)/profile',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>
            <FloatingTabBar
                tabs={tabs}
                containerWidth={Math.min(width - 32, 400)}
                borderRadius={24}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        flex: 1,
        // Add padding bottom to avoid overlap with floating tab bar
        paddingBottom: 80,
    },
});

export default MobileShell;
