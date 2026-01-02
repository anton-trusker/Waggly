import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useNotifications } from '@/hooks/useNotifications';
import { useLocale } from '@/hooks/useLocale';
import { LanguageSelector } from './LanguageSelector';

const SidebarNav: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const { profile } = useProfile();
    const { unreadCount } = useNotifications();
    const { t } = useLocale();

    const navItems = [
        { label: t('navigation.dashboard'), icon: 'grid-outline', path: '/(tabs)/(home)' },
        { label: t('navigation.my_pets'), icon: 'paw-outline', path: '/(tabs)/pets' },
        { label: t('navigation.calendar'), icon: 'calendar-outline', path: '/(tabs)/calendar' },
        { label: t('navigation.documents'), icon: 'folder-open-outline', path: '/(tabs)/documents' },
        // Hidden: Vets & Clinics, Community
    ];

    const isActive = (path: string) => pathname?.startsWith(path);
    const userName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : user?.email?.split('@')[0] || 'User';

    return (
        <View style={styles.sidebar}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image source={require('@/assets/images/logo.png')} style={styles.logoIcon} />
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

            {/* Bottom Actions & User Profile */}
            <View style={styles.bottomSection}>
                {/* Utilities Row */}
                <View style={styles.utilityRow}>
                    <LanguageSelector />

                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="moon-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push('/(tabs)/notifications')}
                    >
                        <Ionicons name="notifications-outline" size={20} color="#6B7280" />
                        {unreadCount > 0 && <View style={styles.notificationBadge} />}
                    </TouchableOpacity>
                </View>

                {/* User Card */}
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
                        {/* Role removed */}
                    </View>
                    <Ionicons name="settings-outline" size={20} color="#9CA3AF" />
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
        height: 100, // Increased height for better spacing
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        gap: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // Subtle separator
    },
    logoIcon: {
        width: 48, // Increased from 40
        height: 48, // Increased from 40
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    logoText: {
        fontSize: 24,
        fontWeight: '800', // Bold
        color: '#111827',
        letterSpacing: -0.5,
    },
    navContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 12, // Increased spacing
        borderRadius: 12,
        marginBottom: 4, // 4px gap
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
    },
    navItemActive: {
        backgroundColor: '#EEF2FF', // Primary-50
        borderLeftColor: '#6366F1', // Primary-600
    },
    navLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4B5563', // Gray-600
    },
    navLabelActive: {
        color: '#4F46E5', // Primary-600
        fontWeight: '600',
    },
    bottomSection: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 16,
    },
    utilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1,
        borderColor: '#fff',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
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
        fontWeight: '700',
        color: '#111827',
    },
    // Removed userRole style
});

export default SidebarNav;
