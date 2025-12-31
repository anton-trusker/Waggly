import React from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';

export default function ShareScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this pet profile on Pawzly! https://pawzly.app/pets/${id}`,
                url: `https://pawzly.app/pets/${id}`,
                title: 'Pet Profile'
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="share-social" size={64} color={designSystem.colors.primary[500]} />
                </View>
                <Text style={styles.title}>Share Profile</Text>
                <Text style={styles.description}>
                    Share this pet's profile with family, friends, or your veterinarian.
                </Text>

                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Ionicons name="share-outline" size={20} color="#fff" />
                    <Text style={styles.shareButtonText}>Share Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: designSystem.colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    description: {
        fontSize: 16,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
        maxWidth: '80%',
        marginBottom: 24,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: designSystem.colors.primary[500],
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
