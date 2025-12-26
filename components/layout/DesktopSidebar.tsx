import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';

interface NavItem {
    label: string;
    href: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Home', href: '/(tabs)/(home)', icon: 'home' },
    { label: 'Pets', href: '/(tabs)/pets', icon: 'paw' },
    { label: 'Calendar', href: '/(tabs)/calendar', icon: 'calendar' },
    { label: 'Documents', href: '/(tabs)/documents', icon: 'document-text' },
    { label: 'Profile', href: '/(tabs)/profile', icon: 'person' },
];

/**
 * Desktop sidebar navigation
 * Visible on screens >= 1024px
 */
export default function DesktopSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (href: string) => {
        router.push(href as any);
    };

    return (
        <View style={styles.sidebar}>
            {/* Logo/Brand */}
            <View style={styles.header}>
                <Ionicons name="paw" size={32} color={designSystem.colors.primary[500]} />
                <Text style={styles.brandName}>PawAI</Text>
            </View>

            {/* Navigation Items */}
            <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname?.startsWith(item.href);

                    return (
                        <TouchableOpacity
                            key={item.href}
                            style={[styles.navItem, isActive && styles.navItemActive]}
                            onPress={() => handleNavigation(item.href)}
                        >
                            <Ionicons
                                name={item.icon}
                                size={20}
                                color={isActive ? designSystem.colors.primary[500] : designSystem.colors.text.secondary}
                            />
                            <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.version}>v1.0.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        width: 250,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: designSystem.colors.border.primary,
        paddingVertical: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 32,
        gap: 12,
    },
    brandName: {
        fontSize: 24,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    nav: {
        flex: 1,
        paddingHorizontal: 12,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 4,
        gap: 12,
    },
    navItemActive: {
        backgroundColor: designSystem.colors.primary[50],
    },
    navItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: designSystem.colors.text.secondary,
    },
    navItemTextActive: {
        color: designSystem.colors.primary[500],
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.border.primary,
    },
    version: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
    },
});
