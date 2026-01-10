import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '@/hooks/useLocale';
import { Pet } from '@/types';
import { differenceInYears, differenceInMonths } from 'date-fns';
import { designSystem } from '@/constants/designSystem';

interface DashboardPetCardProps {
    pet: Pet;
    onPress?: () => void;
    onQrPress?: () => void;
    cardWidth?: number;
}

export const DashboardPetCard = React.memo(({ pet, onPress, onQrPress, cardWidth }: DashboardPetCardProps) => {
    const { t } = useLocale();

    const ageLabel = useMemo(() => {
        if (!pet.date_of_birth) return '--';
        const dob = new Date(pet.date_of_birth);
        const years = differenceInYears(new Date(), dob);
        if (years > 0) {
            return years === 1 ? `1 ${t('common.year', { defaultValue: 'year' })}` : `${years} ${t('common.years', { defaultValue: 'years' })}`;
        }
        const months = differenceInMonths(new Date(), dob);
        return months === 1 ? `1 ${t('common.month', { defaultValue: 'month' })}` : `${months} ${t('common.months', { defaultValue: 'months' })}`;
    }, [pet.date_of_birth, t]);

    const city = pet.address_json?.city || 'Unknown City';

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.cardContent}>
                {/* Header: Photo & Name */}
                <View style={styles.header}>
                    <View style={styles.photoWrapper}>
                        {pet.photo_url ? (
                            <Image source={{ uri: pet.photo_url }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <IconSymbol ios_icon_name="pawprint.fill" android_material_icon_name="pets" size={24} color={designSystem.colors.primary[300]} />
                            </View>
                        )}
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.name} numberOfLines={1}>{pet.name}</Text>
                        <Text style={styles.breed} numberOfLines={1}>
                            {pet.breed || pet.species || t('passport.unknown_breed')}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.moreButton} onPress={onQrPress}>
                        <Ionicons name="ellipsis-vertical" size={20} color={designSystem.colors.neutral[400]} />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Age</Text>
                        <Text style={styles.detailValue}>{ageLabel}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Sex</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>
                            {pet.gender ? (pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)) : '--'}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Weight</Text>
                        <Text style={styles.detailValue}>{pet.weight ? `${pet.weight} kg` : '--'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Location</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>{city}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: designSystem.borderRadius['2xl'],
        backgroundColor: designSystem.colors.background.secondary,
        // Deeper shadow for "floating" effect
        ...designSystem.shadows.md as any,
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
        overflow: 'hidden',
    },
    cardContent: {
        padding: designSystem.spacing[5], // 20px
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[4], // 16px
        marginBottom: designSystem.spacing[4],
    },
    photoWrapper: {
        width: 56,
        height: 56,
        // Add a subtle shadow to the image itself
        ...designSystem.shadows.sm as any,
        borderRadius: designSystem.borderRadius.xl,
        backgroundColor: '#fff', // Ensure shadow shows
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: designSystem.borderRadius.xl,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: designSystem.borderRadius.xl,
        backgroundColor: designSystem.colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: designSystem.colors.primary[100],
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        ...designSystem.typography.title.medium,
        fontSize: 18, // Slightly larger
        color: designSystem.colors.text.primary,
        marginBottom: 2,
    },
    breed: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.text.secondary,
        fontWeight: '500',
    },
    moreButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: designSystem.colors.neutral[50],
    },
    divider: {
        height: 1,
        backgroundColor: designSystem.colors.border.primary,
        marginBottom: designSystem.spacing[4],
        opacity: 0.5,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: designSystem.spacing[3],
    },
    detailItem: {
        width: '50%', // Exactly 2 columns
        paddingRight: 8,
    },
    detailLabel: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.tertiary,
        marginBottom: 2,
        textTransform: 'uppercase',
        fontSize: 10,
        letterSpacing: 0.5,
    },
    detailValue: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.primary,
        fontWeight: '600',
    },
});
