import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocale } from '@/hooks/useLocale';
import { Pet } from '@/types';

interface CompactPetCardProps {
    pet: Pet;
    onPress: () => void;
}

export const CompactPetCard = React.memo(({ pet, onPress }: CompactPetCardProps) => {
    const { t } = useLocale();
    const gradientColors = ['#0284C7', '#38BDF8'] as const;

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.topRow}>
                    {/* Photo */}
                    <View style={styles.photoContainer}>
                        {pet.photo_url ? (
                            <Image source={{ uri: pet.photo_url }} style={styles.photo} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <IconSymbol
                                    ios_icon_name="pawprint.fill"
                                    android_material_icon_name="pets"
                                    size={24}
                                    color="#C7D2FE"
                                />
                            </View>
                        )}
                    </View>

                    {/* Info */}
                    <View style={styles.infoContainer}>
                        <View style={styles.nameRow}>
                            <Text style={styles.nameText} numberOfLines={1}>{pet.name}</Text>
                            <View style={styles.genderBadge}>
                                <IconSymbol
                                    ios_icon_name={pet.gender === 'female' ? "female" : "male"}
                                    android_material_icon_name={pet.gender === 'female' ? "female" : "male"}
                                    size={10}
                                    color={pet.gender === 'female' ? '#EC4899' : '#3B82F6'}
                                />
                            </View>
                        </View>
                        <Text style={styles.breedText} numberOfLines={1}>
                            {pet.breed || pet.species || t('passport.unknown_breed')}
                        </Text>
                    </View>
                </View>

                {/* Mini Details Footer */}
                <View style={styles.footer}>
                    <View style={styles.detailBadge}>
                        <Text style={styles.detailText}>
                            {pet.date_of_birth
                                ? new Date(pet.date_of_birth).getFullYear()
                                : 'Age --'}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailBadge}>
                        <Text style={styles.detailText}>
                            {pet.weight ? `${pet.weight} kg` : 'Weight --'}
                        </Text>
                    </View>
                </View>

                {/* Decorative BG Icon */}
                <View style={styles.watermarkContainer}>
                    <IconSymbol
                        ios_icon_name="pawprint.fill"
                        android_material_icon_name="pets"
                        size={80}
                        color="rgba(255,255,255,0.05)"
                    />
                </View>

            </LinearGradient>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        width: 220,
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 12,
        shadowColor: '#0284C7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    gradient: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    photoContainer: {
        position: 'relative',
    },
    photo: {
        width: 48,
        height: 48,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    photoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    genderBadge: {
        backgroundColor: '#fff',
        width: 14,
        height: 14,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    breedText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
    },
    detailBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    divider: {
        width: 1,
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 8,
    },
    watermarkContainer: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        zIndex: -1,
        transform: [{ rotate: '-15deg' }],
    },
});
