import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/commonStyles';
import { useLocale } from '@/hooks/useLocale';

export default function MobileHeader() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useLocale();

    // Determine title based on route
    const getTitle = () => {
        if (pathname === '/(tabs)/(home)' || pathname === '/') return t('navigation.home');
        if (pathname.startsWith('/(tabs)/pets')) return t('navigation.pets');
        if (pathname.startsWith('/(tabs)/calendar')) return t('navigation.calendar');
        if (pathname.startsWith('/(tabs)/notifications')) return t('navigation.notifications');
        if (pathname.startsWith('/(tabs)/profile')) return t('navigation.profile');
        return 'PawAI';
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <Text style={styles.title}>{getTitle()}</Text>
                <TouchableOpacity
                    style={styles.alertButton}
                    onPress={() => router.push('/(tabs)/notifications')}
                >
                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                    {/* Optional: Add red dot if unread notifications exist */}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6366F1', // Primary color
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 100,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        paddingTop: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans',
    },
    alertButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
});
