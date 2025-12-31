import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import { Image } from 'react-native';

interface MobileHeaderProps {
    title?: string;
    showBack?: boolean;
    showLogo?: boolean;
    showNotifications?: boolean;
    onBack?: () => void;
}

/**
 * Mobile header component with logo, back button, page title, and notifications
 * - Main pages: Logo + Notifications
 * - Sub pages: Back button + Page title + Notifications
 */
export default function MobileHeader({
    title,
    showBack = false,
    showLogo = false,
    showNotifications = true,
    onBack,
}: MobileHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    // Don't show header on desktop
    if (!isMobile) {
        return null;
    }

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const handleNotifications = () => {
        router.push('/(tabs)/notifications');
    };

    return (
        <View style={styles.header}>
            {/* Left Side */}
            <View style={styles.leftSide}>
                {showBack ? (
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="chevron-back" size={24} color={designSystem.colors.text.primary} />
                    </TouchableOpacity>
                ) : showLogo ? (
                    <View style={styles.logoContainer}>
                        <Image source={{ uri: '/favicon.ico' }} style={styles.logoIcon} />
                        <Text style={styles.logoText}>Pawzly</Text>
                    </View>
                ) : null}
            </View>

            {/* Center - Title */}
            {title && (
                <View style={styles.centerContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                </View>
            )}

            {/* Right Side - Notifications */}
            <View style={styles.rightSide}>
                {showNotifications && (
                    <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
                        <Ionicons name="notifications-outline" size={24} color={designSystem.colors.text.primary} />
                        {/* Notification badge */}
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationBadgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.border.primary,
        ...Platform.select({
            ios: {
                paddingTop: 48, // iOS status bar
            },
            android: {
                paddingTop: 12,
            },
            web: {
                paddingTop: 12,
            },
        }),
    },
    leftSide: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightSide: {
        flex: 1,
        alignItems: 'flex-end',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: designSystem.colors.background.secondary,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoIcon: {
        width: 24,
        height: 24,
        borderRadius: 4,
    },
    logoText: {
        fontSize: 20,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
        textAlign: 'center',
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: designSystem.colors.background.secondary,
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: designSystem.colors.error[500],
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#fff',
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
});
