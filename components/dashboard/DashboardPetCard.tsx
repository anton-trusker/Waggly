import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PetImage } from '@/components/ui/PetImage';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Pet } from '@/types';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface DashboardPetCardProps {
    pet: Pet;
    onPress: (pet: Pet) => void;
}

export default function DashboardPetCard({ pet, onPress }: DashboardPetCardProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = {
        card: { backgroundColor: colors.background.tertiary }, // Or secondary, depending on contrast needs
        name: { color: colors.text.primary },
        breed: { color: colors.text.secondary },
    };

    const getStatusConfig = () => {
        // Mock status logic for now, ideally comes from pet data or calculated
        // Example: if needs meds -> warning, else active
        const needsMeds = false; // logic placeholder

        if (needsMeds) {
            return {
                label: 'Needs Meds',
                icon: 'exclamationmark.triangle.fill',
                iconAndroid: 'warning',
                color: '#EAB308', // Text yellow-400
                bg: 'rgba(0, 0, 0, 0.5)', // dark overlay
            };
        }

        return {
            label: 'Active',
            icon: null,
            indicator: true,
            color: '#FFFFFF',
            bg: 'rgba(0, 0, 0, 0.5)',
        };
    };

    const status = getStatusConfig();

    return (
        <TouchableOpacity
            style={[styles.card, dynamicStyles.card]}
            onPress={() => onPress(pet)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <PetImage
                    source={pet.photo_url ? { uri: pet.photo_url } : undefined} // Or resolve util if not full URL
                    size={144} // w-full h-36 -> approx 144px
                    borderRadius={12}
                    style={styles.image}
                    fallbackEmoji={pet.species === 'cat' ? '🐈' : '🐕'}
                />
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    {status.indicator && (
                        <View style={[styles.statusDot, { backgroundColor: '#4ADE80' }]} />
                    )}
                    {status.icon && (
                        <IconSymbol
                            ios_icon_name={status.icon as any}
                            android_material_icon_name={status.iconAndroid as any}
                            size={14}
                            color={status.color}
                        />
                    )}
                    <Text style={[styles.statusText, { color: '#FFFFFF' }]}>{status.label}</Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={[styles.name, dynamicStyles.name]}>{pet.name}</Text>
                <Text style={[styles.breed, dynamicStyles.breed]}>{pet.breed || pet.species}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 160,
        borderRadius: 16,
        padding: 12,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 144,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
        gap: 6,
        backdropFilter: 'blur(4px)', // Won't work on RN native directly, but good intent
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    infoContainer: {
        marginTop: 12,
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    breed: {
        fontSize: 12,
    },
});
