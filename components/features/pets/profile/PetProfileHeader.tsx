
import React from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Pet } from '@/types';
import { formatAge } from '@/lib/age';
import { useRouter } from 'expo-router';

interface PetProfileHeaderProps {
    pet: Pet;
    onEdit: () => void;
}

export default function PetProfileHeader({ pet, onEdit }: PetProfileHeaderProps) {
    const { theme, isDark } = useAppTheme();
    const router = useRouter();

    // Determine gender icon and color
    const isFemale = pet.gender === 'female';
    const genderColor = isFemale ? '#EC4899' : '#3B82F6';
    const genderBg = isFemale ? (isDark ? 'rgba(236, 72, 153, 0.2)' : '#FCE7F3') : (isDark ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF');
    const genderIcon = isFemale ? 'female' : 'male'; // SF Symbol names

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
            {/* Header Gradient Background */}
            <View style={styles.headerBackground}>
                <LinearGradient
                    colors={isDark
                        ? ['rgba(30, 64, 175, 0.3)', 'transparent']
                        : ['#EFF6FF', 'transparent']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>

            {/* Navigation Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)' }]}
                    onPress={() => router.back()}
                >
                    <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back-ios-new" size={20} color={theme.colors.text.primary} />
                </TouchableOpacity>

                {/* Logo or Title could go here */}

                <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)' }]}
                    onPress={onEdit}
                >
                    <IconSymbol ios_icon_name="pencil" android_material_icon_name="edit" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Main Profile Content */}
            <View style={styles.profileContent}>
                {/* Avatar with Ring */}
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatarRing, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                        {pet.photo_url ? (
                            <Image source={{ uri: pet.photo_url }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primaryLight }]}>
                                <Text style={{ fontSize: 40 }}>{pet.species === 'cat' ? '🐈' : '🐕'}</Text>
                            </View>
                        )}
                    </View>

                    {/* Verified Badge */}
                    <View style={styles.verifiedBadge}>
                        <IconSymbol ios_icon_name="checkmark.seal.fill" android_material_icon_name="verified" size={20} color={colors.primary} />
                    </View>
                </View>

                {/* Name and Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.petName, { color: theme.colors.text.primary }]}>{pet.name}</Text>
                        <IconSymbol ios_icon_name="checkmark.seal.fill" android_material_icon_name="verified" size={24} color={colors.primary} />
                    </View>

                    <View style={[styles.subtitleBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
                        <Text style={[styles.subtitleText, { color: theme.colors.text.secondary }]}>
                            {pet.breed || 'Mixed Breed'} • {pet.date_of_birth ? formatAge(new Date(pet.date_of_birth)) : 'Age Unknown'}
                        </Text>
                    </View>

                    {/* Location (New) */}
                    {(pet.address_json as any)?.city && (
                        <View style={styles.locationContainer}>
                            <IconSymbol ios_icon_name="location.fill" android_material_icon_name="location-on" size={14} color={theme.colors.text.secondary} />
                            <Text style={[styles.locationText, { color: theme.colors.text.secondary }]}>
                                {(pet.address_json as any).city}, {(pet.address_json as any).country}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
        overflow: 'hidden',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        zIndex: 10,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)', // iOS support for glassmorphism
    },
    profileContent: {
        alignItems: 'center',
        marginTop: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarRing: {
        padding: 6,
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 2,
    },
    infoContainer: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    petName: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitleBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 14,
        fontWeight: '600',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '500',
    },
});
