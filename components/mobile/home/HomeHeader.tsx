import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { designSystem } from '@/constants/designSystem';

export default function HomeHeader() {
    const { user } = useAuth();
    const { profile } = useProfile();
    const insets = useSafeAreaInsets();

    const firstName = profile?.first_name || user?.email?.split('@')[0] || 'User';

    return (
        <LinearGradient
            colors={['#A8D5FF', '#E8F4FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, { paddingTop: insets.top + 10 }]}
        >
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile' as any)} style={styles.profileLink}>
                <View style={styles.avatarContainer}>
                    {profile?.photo_url ? (
                        <Image source={{ uri: profile.photo_url }} style={styles.avatar} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>
                                {firstName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.name}>{firstName}</Text>
                </View>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    profileLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderRadius: 24,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    placeholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 20,
        fontWeight: '600',
        color: designSystem.colors.primary[600],
    },
    greetingContainer: {
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 14,
        color: '#1E293B', // Darker for better contrast on gradient
        fontFamily: Platform.select({ ios: 'Plus Jakarta Sans', android: 'PlusJakartaSans-Regular', default: 'System' }),
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        fontFamily: Platform.select({ ios: 'Plus Jakarta Sans', android: 'PlusJakartaSans-Bold', default: 'System' }),
    },
});
