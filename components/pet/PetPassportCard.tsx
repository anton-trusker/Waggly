import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocale } from '@/hooks/useLocale';
import { Pet } from '@/types';
import { usePetHealthScore } from '@/hooks/usePetHealthScore';
import { differenceInYears, differenceInMonths, format } from 'date-fns';
import { designSystem } from '@/constants/designSystem';
import { CalendarEvent } from '@/hooks/useEvents';

interface PetPassportCardProps {
    pet: Pet;
    onPress?: () => void;
    onQrPress?: () => void;
    alerts?: CalendarEvent[];
    cardWidth?: number;
}

export const PetPassportCard = React.memo(({ pet, onPress, onQrPress, alerts = [], cardWidth }: PetPassportCardProps) => {
    const { t } = useLocale();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const { score, loading: scoreLoading } = usePetHealthScore(pet);

    const gradientColors = ['#5B21B6', '#7C3AED'] as const; // Richer purple gradient

    const getScoreColor = (s: number) => {
        if (s >= 80) return '#10B981';
        if (s >= 50) return '#F59E0B';
        return '#EF4444';
    };

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

    const urgentAlerts = useMemo(() => {
        return alerts
            .filter(a => a.priority === 'high')
            .slice(0, 1);
    }, [alerts]);

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBackground}
            >
                {/* Horizontal Layout: Photo Left, Info Right */}
                <View style={styles.cardContent}>
                    {/* Pet Photo */}
                    <View style={styles.photoWrapper}>
                        {pet.photo_url ? (
                            <Image source={{ uri: pet.photo_url }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <IconSymbol ios_icon_name="pawprint.fill" android_material_icon_name="pets" size={20} color="rgba(255,255,255,0.5)" />
                            </View>
                        )}
                        <View style={styles.statusBadge}>
                            <IconSymbol ios_icon_name="checkmark.seal.fill" android_material_icon_name="verified" size={8} color="#10B981" />
                        </View>
                    </View>

                    {/* Pet Info */}
                    <View style={styles.infoColumn}>
                        <Text style={styles.name} numberOfLines={1}>{pet.name}</Text>
                        <Text style={styles.breed} numberOfLines={1}>
                            {pet.breed || pet.species || t('passport.unknown_breed')}
                        </Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <View style={[styles.scoreDot, { backgroundColor: getScoreColor(score) }]} />
                                <Text style={[styles.statValue, { color: getScoreColor(score) }]}>
                                    {scoreLoading ? '--' : `${score}%`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Decorative Paw */}
                <View style={styles.pawWatermark}>
                    <IconSymbol ios_icon_name="pawprint.fill" android_material_icon_name="pets" size={70} color="rgba(255,255,255,0.03)" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 40, // High radius for pill/rounded effect
        overflow: 'hidden',
        ...designSystem.shadows.md,
        marginVertical: 4,
        height: 80, // Compact height
        width: 160, // Wider for horizontal layout
    },
    gradientBackground: {
        padding: 8,
        flex: 1,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    photoWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25, // Fully circular
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        width: 14,
        height: 14,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        ...designSystem.shadows.sm,
    },
    infoColumn: {
        flex: 1,
        justifyContent: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 3,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    statDivider: {
        width: 1,
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    scoreDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    statValue: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '800',
    },
    name: {
        fontSize: 15,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.3,
    },
    breed: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.75)',
        fontWeight: '600',
        marginTop: 1,
    },
    pawWatermark: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        transform: [{ rotate: '-15deg' }],
        zIndex: 0,
        opacity: 0.8,
    },
});
