import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { EntityCard } from './EntityCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Pet as PetV2 } from '@/types/v2/schema';
import { Pet as PetLegacy } from '@/types/index';

// If Pet is not exported from schema.ts, we define a compatible subset interface here
// based on what we see in usage
interface PetSummary {
    id: string;
    name: string;
    breed?: string | null;
    image_url?: string | null;
    photo_url?: string | null;
    avatar_url?: string | null;
    date_of_birth?: string | null;
    gender?: 'male' | 'female' | null;
    weight?: number | null;
    weight_current?: number | null;
    weight_unit?: string | null;
}

interface PetCardProps {
    pet: PetSummary | PetV2 | PetLegacy; // Accept either standard Pet (Legacy or V2) or our summary
    variant?: 'detailed' | 'compact' | 'minimal';
    onPress?: () => void;
    style?: ViewStyle;
}

const getAge = (dobString?: string | null) => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    const now = new Date();
    const diff = now.getTime() - dob.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (years === 0) {
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        return `${months} mos`;
    }
    return `${years} yrs`;
};

export const PetCard = ({ pet, variant = 'detailed', onPress, style }: PetCardProps) => {
    const defaultImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'; // Placeholder
    const imageSource = { uri: (pet as any).image_url || (pet as any).photo_url || (pet as any).avatar_url || defaultImage };

    if (variant === 'minimal') {
        return (
            <EntityCard variant="flat" onPress={onPress} style={[styles.minimalCard, style]}>
                <View style={styles.minimalContent}>
                    <Image source={imageSource} style={styles.avatarSmall} />
                    <View>
                        <Text style={styles.nameText}>{pet.name}</Text>
                        {pet.breed && <Text style={styles.subText}>{pet.breed}</Text>}
                    </View>
                </View>
                <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={20} color={designSystem.colors.text.tertiary} />
            </EntityCard>
        );
    }

    if (variant === 'compact') {
        return (
            <EntityCard variant="elevated" onPress={onPress} style={[styles.compactCard, style]}>
                <Image source={imageSource} style={styles.avatarMedium} />
                <View style={styles.compactInfo}>
                    <Text style={styles.nameTextLarge}>{pet.name}</Text>
                    <Text style={styles.subText}>{pet.breed}</Text>
                </View>
            </EntityCard>
        );
    }

    // Detailed Variant
    return (
        <EntityCard variant="elevated" onPress={onPress} style={style}>
            <View style={styles.header}>
                <Image source={imageSource} style={styles.avatarLarge} />
                <View style={styles.headerInfo}>
                    <View style={styles.titleRow}>
                        <Text style={styles.nameTitle}>{pet.name}</Text>
                        {pet.gender && (
                            <IconSymbol
                                android_material_icon_name={pet.gender === 'male' ? 'male' : 'female'}
                                ios_icon_name={pet.gender === 'male' ? 'circle' : 'circle'} // fallback 
                                size={20}
                                color={pet.gender === 'male' ? '#3b82f6' : '#ec4899'}
                            />
                        )}
                    </View>
                    <Text style={styles.subTextLarge}>{pet.breed}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statChip}>
                            <Text style={styles.statLabel}>{getAge(pet.date_of_birth)}</Text>
                        </View>
                        {((pet as any).weight || (pet as any).weight_current) && (
                            <View style={styles.statChip}>
                                <Text style={styles.statLabel}>{(pet as any).weight || (pet as any).weight_current} {pet.weight_unit || 'kg'}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </EntityCard>
    );
};

const styles = StyleSheet.create({
    // Minimal
    minimalCard: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
    },
    minimalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: designSystem.colors.neutral[200],
    },
    nameText: {
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    subText: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
    },

    // Compact
    compactCard: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
        width: 140, // Fixed width for grid?
    },
    avatarMedium: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 8,
        backgroundColor: designSystem.colors.neutral[200],
    },
    compactInfo: {
        alignItems: 'center',
    },
    nameTextLarge: {
        fontSize: 16,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },

    // Detailed
    header: {
        flexDirection: 'row',
        gap: 16,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: designSystem.colors.neutral[200],
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    nameTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    subTextLarge: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    statChip: {
        backgroundColor: designSystem.colors.neutral[100],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
    }
});
