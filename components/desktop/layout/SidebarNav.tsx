import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SidebarNav: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', icon: 'grid-outline', path: '/web/dashboard' },
        { label: 'Plan', icon: 'calendar-outline', path: '/web/calendar' },
        { label: 'Health', icon: 'medical-outline', path: '/web/health' },
        { label: 'Documents', icon: 'folder-open-outline', path: '/web/documents' },
        { label: 'Pets', icon: 'paw-outline', path: '/web/pets' },
    ];

    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <View style={styles.sidebar}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <LinearGradient
                    colors={['#6366F1', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.logoIcon}
                >
                    <Ionicons name="paw" size={20} color="#fff" />
                </LinearGradient>
                <Text style={styles.logoText}>Pawzly</Text>
            </View>

            {/* Navigation */}
            <ScrollView style={styles.navContainer} showsVerticalScrollIndicator={false}>
                {navItems.map((item) => (
                    <TouchableOpacity
                        key={item.path}
                        style={[styles.navItem, isActive(item.path) && styles.navItemActive]}
                        onPress={() => router.push(item.path as any)}
                    >
                        <Ionicons
                            name={item.icon as any}
                            size={20}
                            color={isActive(item.path) ? '#6366F1' : '#6B7280'}
                        />
                        <Text style={[styles.navLabel, isActive(item.path) && styles.navLabelActive]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Upgrade Card */}
            <View style={styles.upgradeCard}>
                <View style={styles.upgradeHeader}>
                    <View style={styles.upgradeIconContainer}>
                        <Ionicons name="diamond-outline" size={16} color="#6366F1" />
                    </View>
                    <View>
                        <Text style={styles.upgradeTitle}>Pawzly Pro</Text>
                        <Text style={styles.upgradeSubtitle}>Manage unlimited pets</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.upgradeButton}>
                    <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
                </TouchableOpacity>
            </View>

            {/* Settings */}
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => router.push('/web/settings' as any)}
            >
                <Ionicons name="settings-outline" size={20} color="#6B7280" />
                <Text style={styles.navLabel}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        width: 280,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        flexDirection: 'column',
    },
    logoContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        gap: 12,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    logoText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    navContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    navItemActive: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },
    navLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    navLabelActive: {
        color: '#6366F1',
        fontWeight: '600',
    },
    upgradeCard: {
        margin: 16,
        padding: 16,
        backgroundColor: '#1e293b',
        borderRadius: 16,
    },
    upgradeHeader: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    upgradeIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    upgradeTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    upgradeSubtitle: {
        fontSize: 12,
        color: '#94a3b8',
    },
    upgradeButton: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    upgradeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
});

export default SidebarNav;
