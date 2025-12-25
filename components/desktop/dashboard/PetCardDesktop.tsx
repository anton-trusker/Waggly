import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
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
            router.push(`/web/pets/${pet.id}` as any);
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
        <TouchableOpacity style={[styles.card, isMobile && styles.cardMobile]} onPress={handlePress}>
            {/* Pet Photo */}
            <View style={[styles.photoContainer, isMobile && styles.photoContainerMobile]}>
                {pet.photo_url ? (
                    <Image source={{ uri: pet.photo_url }} style={[styles.photo, isMobile && styles.photoMobile]} />
                ) : (
                    <View style={[styles.photoPlaceholder, isMobile && styles.photoPlaceholderMobile]}>
                        <Ionicons
                            name="paw"
                            size={isMobile ? 24 : 32}
                            color="#6366F1"
                        />
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
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#9CA3AF"
                    style={styles.chevron}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        position: 'relative',
    },
    cardMobile: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
    },
    photoContainer: {
        alignSelf: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    photoContainerMobile: {
        alignSelf: 'auto',
        marginBottom: 0,
    },
    roleBadge: {
        position: 'absolute',
        bottom: -8,
        alignSelf: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fff',
    },
    roleBadgeCoOwner: {
        backgroundColor: '#F59E0B', // Amber
    },
    roleBadgeViewer: {
        backgroundColor: '#6B7280', // Gray
    },
    roleBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
    photo: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    photoMobile: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    photoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoPlaceholderMobile: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    info: {
        alignItems: 'center',
        marginBottom: 16,
    },
    infoMobile: {
        alignItems: 'flex-start',
        marginBottom: 0,
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    breed: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        width: '100%',
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    chevron: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});

export default PetCardDesktop;
