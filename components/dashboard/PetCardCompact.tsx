import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Pet } from '@/types';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface PetCardCompactProps {
    pet: Pet;
}

export default function PetCardCompact({ pet }: PetCardCompactProps) {
    const handlePress = () => {
        router.push(`/(tabs)/pets/${pet.id}/overview` as any);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
            <View style={styles.imageContainer}>
                {pet.photo_url ? (
                    <Image
                        source={{ uri: pet.photo_url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <IconSymbol
                            android_material_icon_name="pets"
                            size={32}
                            color="#9CA3AF"
                        />
                    </View>
                )}
            </View>
            <Text style={styles.name} numberOfLines={1}>
                {pet.name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        minWidth: 80,
        maxWidth: 100,
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
        maxWidth: 80,
    },
});
