import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { PetImage } from '@/components/ui/PetImage';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAppTheme } from '@/hooks/useAppTheme';

function resolveImageUrl(url?: string): string | undefined {
    if (!url) return undefined;
    if (/^https?:\/\//.test(url)) return url;
    if (url.startsWith('user-photos/')) {
        const { data } = supabase.storage.from('user-photos').getPublicUrl(url);
        return data.publicUrl;
    }
    return url;
}

export default function HomeHeader() {
    const { user } = useAuth();
    const { profile } = useProfile();
    const { colors } = useAppTheme();

    const firstName =
        profile?.first_name
            ? profile.first_name
            : profile?.full_name
                ? profile.full_name.split(' ')[0]
                : user?.email
                    ? user.email.split('@')[0]
                    : 'User';

    const avatarUri = resolveImageUrl(profile?.photo_url || profile?.avatar_url || undefined);

    const dynamicStyles = {
        welcomeText: { color: colors.text.secondary },
        nameText: { color: colors.text.primary },
        notificationButton: { backgroundColor: colors.neutral[100] },
        statusDot: { borderColor: colors.background.primary }
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <View style={styles.avatarContainer}>
                    <PetImage
                        source={avatarUri ? { uri: avatarUri } : undefined}
                        size={48}
                        borderRadius={24}
                        fallbackEmoji={firstName.charAt(0).toUpperCase()}
                    />
                    <View style={[styles.statusDot, dynamicStyles.statusDot]} />
                </View>
                <View>
                    <Text style={[styles.welcomeText, dynamicStyles.welcomeText]}>WELCOME BACK</Text>
                    <Text style={[styles.nameText, dynamicStyles.nameText]}>{firstName}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.notificationButton, dynamicStyles.notificationButton]}
                onPress={() => router.push('/(tabs)/notifications')}
            >
                <IconSymbol
                    ios_icon_name="bell.fill"
                    android_material_icon_name="notifications"
                    size={24}
                    color={colors.text.secondary}
                />
                {/* Add Badge logic here if needed */}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 60, // Adjust for status bar if needed, or use SafeAreaView parent
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    statusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4ADE80', // Green-400
        borderWidth: 2,
        // borderColor set dynamically
    },
    welcomeText: {
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    nameText: {
        fontSize: 20,
        fontWeight: '700',
    },
    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor set dynamically
    },
});
