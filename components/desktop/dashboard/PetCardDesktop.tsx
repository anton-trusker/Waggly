import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types';

interface PetCardDesktopProps {
    pet: Pet;
    onPress?: () => void;
}

const PetCardDesktop: React.FC<PetCardDesktopProps> = ({ pet, onPress }) => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push(`/(tabs)/pets/${pet.id}` as any);
        }
    };

    const getAge = () => {
        if (!pet.birth_date) return 'Unknown';
        const dob = new Date(pet.birth_date);
        const today = new Date();
        const years = today.getFullYear() - dob.getFullYear();
        const months = today.getMonth() - dob.getMonth();

        if (years < 1) return `${months} months`;
        return `${years} ${years === 1 ? 'year' : 'years'}`;
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ hovered }: any) => [
                styles.card,
                isMobile && styles.cardMobile,
                hovered && styles.cardHover
            ]}
        >
            {/* Pet Photo */}
            <View style={[styles.photoContainer, isMobile && styles.photoContainerMobile]}>
                {pet.photo_url ? (
                    <Image source={{ uri: pet.photo_url }} style={[styles.photo, isMobile && styles.photoMobile]} />
                ) : (
                    <View style={[styles.photoPlaceholder, isMobile && styles.photoPlaceholderMobile]}>
                        <Text style={{ fontSize: isMobile ? 24 : 40 }}>
                            {pet.species === 'dog' ? '🐕' :
                                pet.species === 'cat' ? '🐈' :
                                    pet.species === 'bird' ? '🦜' :
                                        pet.species === 'rabbit' ? '🐰' :
                                            pet.species === 'reptile' ? '🦎' :
                                                '🐾'}
                        </Text>
                    </View>
                )}
                {pet.role && pet.role !== 'owner' && (
                    <View style={[
                        styles.roleBadge,
                        pet.role === 'viewer' ? styles.roleBadgeViewer : styles.roleBadgeCoOwner
                    ]}>
                        <Text style={styles.roleBadgeText}>
                            {pet.role === 'viewer' ? 'Viewer' : 'Co-Owner'}
                        </Text>
                    </View>
                )}
            </View>

            {/* Pet Info */}
            <View style={[styles.info, isMobile && styles.infoMobile]}>
                <Text style={styles.name}>{pet.name}</Text>
                <Text style={styles.breed}>{pet.breed || pet.species}</Text>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Age</Text>
                    <Text style={styles.detailValue}>{getAge()}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Sex</Text>
                    <Text style={styles.detailValue}>{pet.gender || 'N/A'}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Weight</Text>
                    <Text style={styles.detailValue}>
                        {pet.weight ? `${pet.weight} ${pet.weight_unit || 'kg'}` : 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Chevron */}
            {!isMobile && (
                <View style={styles.chevron}>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        position: 'relative',
        alignItems: 'center',
        // Smooth transition for transform/shadow if supported by web engine, 
        // RN web doesn't support 'transition' property directly in StyleSheet without workaround,
        // but often renders well enough.
    },
    cardMobile: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        borderRadius: 16,
    },
    cardHover: {
        transform: Platform.select({ web: [{ scale: 1.02 }] as any, default: [] }),
        shadowOpacity: 0.1,
        shadowRadius: 16,
        borderColor: '#C7D2FE',
        zIndex: 10,
    },
    photoContainer: {
        alignSelf: 'center',
        marginBottom: 20,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
    },
    photoContainerMobile: {
        alignSelf: 'auto',
        marginBottom: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
    roleBadge: {
        position: 'absolute',
        bottom: -8,
        alignSelf: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#fff',
    },
    roleBadgeCoOwner: {
        backgroundColor: '#F59E0B',
    },
    roleBadgeViewer: {
        backgroundColor: '#6B7280',
    },
    roleBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    photoMobile: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoPlaceholderMobile: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    info: {
        alignItems: 'center',
        marginBottom: 24,
    },
    infoMobile: {
        alignItems: 'flex-start',
        marginBottom: 0,
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: '700', // Bold
        color: '#111827',
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    breed: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        width: '100%',
        gap: 8,
    },
    detailItem: {
        alignItems: 'center',
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: 'Plus Jakarta Sans',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        fontFamily: 'Plus Jakarta Sans',
    },
    chevron: {
        position: 'absolute',
        top: 24,
        right: 24,
        opacity: 0.5,
    },
});

export default PetCardDesktop;
