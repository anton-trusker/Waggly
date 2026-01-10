import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocale } from '@/hooks/useLocale';
import { Pet } from '@/types';
import { usePetHealthScore } from '@/hooks/usePetHealthScore';
import { differenceInYears, differenceInMonths, format } from 'date-fns';
import { designSystem } from '@/constants/designSystem';

interface PetDetailedCardProps {
    pet: Pet;
    onPress?: () => void;
    onQrPress?: () => void;
}

export const PetDetailedCard = React.memo(({ pet, onPress, onQrPress }: PetDetailedCardProps) => {
    const { t } = useLocale();
    const { score, loading: scoreLoading } = usePetHealthScore(pet);

    const gradientColors = ['#5B21B6', '#7C3AED'] as const;

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

    const weightLabel = pet.weight ? `${pet.weight} kg` : '--';
    const sexLabel = pet.sex ? (pet.sex === 'male' ? 'Male' : 'Female') : '--';

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
                {/* Share Button */}
                <TouchableOpacity style={styles.shareButton} onPress={onQrPress}>
                    <IconSymbol ios_icon_name="square.and.arrow.up" android_material_icon_name="share" size={16} color="#fff" />
                </TouchableOpacity>

                <View style={styles.cardContent}>
                    {/* Left Section: Photo & Basic Info */}
                    <View style={styles.leftSection}>
                        <View style={styles.photoWrapper}>
                            {pet.photo_url ? (
                                <Image source={{ uri: pet.photo_url }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <IconSymbol ios_icon_name="pawprint.fill" android_material_icon_name="pets" size={32} color="rgba(255,255,255,0.5)" />
                                </View>
                            )}
                            <View style={styles.statusBadge}>
                                <IconSymbol ios_icon_name="checkmark.seal.fill" android_material_icon_name="verified" size={12} color="#10B981" />
                            </View>
                        </View>
                        <View style={styles.basicInfo}>
                            <Text style={styles.name} numberOfLines={1}>{pet.name}</Text>
                            <Text style={styles.species} numberOfLines={1}>{pet.species || 'Unknown'}</Text>
                            <Text style={styles.breed} numberOfLines={1}>{pet.breed || 'Unknown breed'}</Text>
                        </View>
                    </View>

                    {/* Center Section: Key Stats */}
                    <View style={styles.centerSection}>
                        <View style={styles.statRow}>
                            <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={14} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.statLabel}>Age:</Text>
                            <Text style={styles.statValue}>{ageLabel}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <IconSymbol ios_icon_name="scalemass" android_material_icon_name="monitor-weight" size={14} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.statLabel}>Weight:</Text>
                            <Text style={styles.statValue}>{weightLabel}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <IconSymbol ios_icon_name={pet.sex === 'male' ? 'person' : 'person.fill'} android_material_icon_name={pet.sex === 'male' ? 'male' : 'female'} size={14} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.statLabel}>Sex:</Text>
                            <Text style={styles.statValue}>{sexLabel}</Text>
                        </View>
                        {pet.microchip_number && (
                            <View style={styles.statRow}>
                                <IconSymbol ios_icon_name="memorychip" android_material_icon_name="memory" size={14} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.statLabel}>Chip:</Text>
                                <Text style={styles.statValue} numberOfLines={1}>{pet.microchip_number}</Text>
                            </View>
                        )}
                    </View>

                    {/* Right Section: Health Score */}
                    <View style={styles.rightSection}>
                        <View style={styles.healthScoreContainer}>
                            <View style={[styles.scoreCircle, { borderColor: getScoreColor(score) }]}>
                                <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>
                                    {scoreLoading ? '--' : score}
                                </Text>
                                <Text style={styles.scorePercent}>%</Text>
                            </View>
                            <Text style={styles.healthLabel}>Health</Text>
                        </View>
                    </View>
                </View>

                {/* Decorative Paw */}
                <View style={styles.pawWatermark}>
                    <IconSymbol ios_icon_name="pawprint.fill" android_material_icon_name="pets" size={80} color="rgba(255,255,255,0.03)" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        ...designSystem.shadows.md,
        marginVertical: 8,
        height: 180,
    },
    gradientBackground: {
        padding: 16,
        flex: 1,
    },
    shareButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        ...designSystem.shadows.sm,
    },
    cardContent: {
        flexDirection: 'row',
        gap: 16,
        flex: 1,
        zIndex: 1,
    },
    leftSection: {
        flexDirection: 'row',
        gap: 12,
        flex: 1.2,
    },
    photoWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    statusBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#fff',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        ...designSystem.shadows.md,
    },
    basicInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    species: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        marginBottom: 2,
    },
    breed: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.65)',
        fontWeight: '500',
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        gap: 8,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
        minWidth: 50,
    },
    statValue: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '700',
        flex: 1,
    },
    rightSection: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    healthScoreContainer: {
        alignItems: 'center',
        gap: 8,
    },
    scoreCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    scoreText: {
        fontSize: 26,
        fontWeight: '900',
        lineHeight: 28,
    },
    scorePercent: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '700',
    },
    healthLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    pawWatermark: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        transform: [{ rotate: '-15deg' }],
        zIndex: 0,
        opacity: 0.8,
    },
});
