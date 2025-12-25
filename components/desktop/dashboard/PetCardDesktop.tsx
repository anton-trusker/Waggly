import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types';

interface PetCardDesktopProps {
    pet: Pet;
    onPress?: () => void;
}

const PetCardDesktop: React.FC<PetCardDesktopProps> = ({ pet, onPress }) => {
    const router = useRouter();

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
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            {/* Pet Photo */}
            <View style={styles.photoContainer}>
                {pet.photo_url ? (
                    <Image source={{ uri: pet.photo_url }} style={styles.photo} />
                ) : (
                    <View style={styles.photoPlaceholder}>
                        <Ionicons
                            name="paw"
                            size={32}
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
            <View style={styles.info}>
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
            <Ionicons
                name="chevron-forward"
                size={20}
                color="#9CA3AF"
                style={styles.chevron}
            />
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
    photoContainer: {
        alignSelf: 'center',
        marginBottom: 16,
        position: 'relative',
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
    photoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        alignItems: 'center',
        marginBottom: 16,
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
