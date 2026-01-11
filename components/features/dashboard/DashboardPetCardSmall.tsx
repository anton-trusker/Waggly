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
        card: { backgroundColor: colors.background.secondary }, // White for contrast
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
            style={[styles.card, dynamicStyles.card] as any}
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
        width: 100, // Minimized width
        borderRadius: 12,
        padding: 6,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 90, // Minimized height
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        top: 4,
        left: 4,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 100,
        gap: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    statusDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    statusText: {
        fontSize: 9, // Smaller text
        fontWeight: '600',
    },
    infoContainer: {
        marginTop: 6,
        alignItems: 'center',
    },
    name: {
        fontSize: 12, // Compact name
        fontWeight: '700',
        marginBottom: 0,
    },
    breed: {
        fontSize: 10,
        opacity: 0.7,
        textAlign: 'center',
    },
});
