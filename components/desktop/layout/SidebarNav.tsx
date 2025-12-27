import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const SidebarNav: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const { profile } = useProfile();

    const navItems = [
        { label: 'Dashboard', icon: 'grid-outline', path: '/web/dashboard' },
        { label: 'My Pets', icon: 'paw-outline', path: '/web/pets' },
        { label: 'Calendar', icon: 'calendar-outline', path: '/web/calendar' },
        { label: 'Documents', icon: 'folder-open-outline', path: '/web/documents' },
        // Hidden: Vets & Clinics, Community
    ];

    const isActive = (path: string) => pathname?.startsWith(path);
    const userName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : user?.email?.split('@')[0] || 'User';

    return (
        <View style={styles.sidebar}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image source={{ uri: '/favicon.ico' }} style={styles.logoIcon} />
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

            {/* User Profile Card (Bottom) */}
            <View style={styles.userCardContainer}>
                <TouchableOpacity style={styles.userCard} onPress={() => router.push('/(tabs)/profile')}>
                    {profile?.photo_url ? (
                        <Image source={{ uri: profile.photo_url }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {userName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.userInfo}>
                        <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
                        <Text style={styles.userRole}>Pro Member</Text>
                    </View>
                    <Ionicons name="settings-outline" size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
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
        height: '100%',
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
    userCardContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    userRole: {
        fontSize: 12,
        color: '#6B7280',
    },
});

export default SidebarNav;
