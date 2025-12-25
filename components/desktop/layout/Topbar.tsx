import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import SearchModal from '../SearchModal';
import Breadcrumbs from './Breadcrumbs';

const Topbar: React.FC = () => {
    const { user } = useAuth();
    const { profile } = useProfile();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchModalVisible, setSearchModalVisible] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const userName = profile?.first_name || user?.email?.split('@')[0] || 'there';

    return (
        <View style={styles.wrapper}>
            <View style={styles.topbar}>
                {/* Greeting */}
                <Text style={styles.greeting}>
                    {getGreeting()}, {userName} 👋
                </Text>

                {/* Search Bar */}
                <TouchableOpacity
                    style={styles.searchContainer}
                    activeOpacity={1}
                    onPress={() => setSearchModalVisible(true)}
                >
                    <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <Text style={[styles.searchInput, { lineHeight: 44, color: searchQuery ? '#111827' : '#9CA3AF' }]}>
                        {searchQuery || "Search pets, records..."}
                    </Text>
                </TouchableOpacity>

                {/* Actions */}
                <View style={styles.actions}>
                    {/* Notifications */}
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={24} color="#6B7280" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>

                    {/* User Avatar */}
                    <TouchableOpacity style={styles.avatarButton}>
                        {profile?.photo_url ? (
                            <Image source={{ uri: profile.photo_url }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {userName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <SearchModal
                    visible={searchModalVisible}
                    onClose={() => setSearchModalVisible(false)}
                />
            </View>
            <Breadcrumbs />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#f8fafc',
        zIndex: 10,
    },
    topbar: {
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 24,
    },
    greeting: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    searchContainer: {
        flex: 1,
        maxWidth: 400,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
        outline: 'none' as any,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarButton: {
        marginLeft: 8,
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
});

export default Topbar;
