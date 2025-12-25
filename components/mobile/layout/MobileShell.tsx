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
    const isAuthPage = pathname?.startsWith('/web/auth') || pathname?.startsWith('/web/onboarding');
    const showShell = session && !isAuthPage;

    if (!showShell) {
        return <View style={styles.container}>{children}</View>;
    }

    const tabs: TabBarItem[] = [
        {
            name: 'dashboard',
            label: 'Home',
            icon: 'home' as any,
            route: '/web/dashboard',
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
