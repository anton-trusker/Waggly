import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { usePets } from '@/hooks/usePets';
import { PetPassportCard } from '@/components/pet/PetPassportCard';
import ShareModal from '@/components/desktop/modals/ShareModal';
import { Pet } from '@/types';


export default function MyPetsWidget() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const { pets, loading } = usePets();
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1024;

    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [selectedPetForShare, setSelectedPetForShare] = useState<Pet | null>(null);

    const hasPets = pets.length > 0;

    const handleQrPress = (pet: Pet) => {
        setSelectedPetForShare(pet);
        setShareModalVisible(true);
    };

    // Empty State Banner
    if (!hasPets && !loading) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.emptyBanner}
                >
                    <View style={styles.emptyContent}>
                        <View style={styles.emptyIconContainer}>
                            <Text style={styles.emptyIcon}>🐾</Text>
                        </View>
                        <View style={styles.emptyTextContainer}>
                            <Text style={styles.emptyTitle}>Add Your First Pet</Text>
                            <Text style={styles.emptySubtitle}>
                                Start tracking your pet's health, vaccinations, and more
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => router.push('/(tabs)/pets/new' as any)}
                        >
                            <Ionicons name="add" size={20} color="#6366F1" />
                            <Text style={styles.emptyButtonText}>Add Pet</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    return (
        <View style={[styles.container, {
            borderColor: theme.colors.border.primary,
            backgroundColor: theme.colors.background.primary
        }]}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {pets.map((pet) => (
                    <View key={pet.id} style={styles.cardWrapper}>
                        <PetPassportCard
                            pet={pet}
                            onPress={() => router.push(`/(tabs)/pets/${pet.id}` as any)}
                            onQrPress={() => handleQrPress(pet)}
                        />
                    </View>
                ))}
            </ScrollView>

            {/* Share Modal */}
            {selectedPetForShare && (
                <ShareModal
                    visible={shareModalVisible}
                    onClose={() => {
                        setShareModalVisible(false);
                        setSelectedPetForShare(null);
                    }}
                    petId={selectedPetForShare.id}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // No marginBottom - grid gap handles spacing
    },

    scrollContent: {
        gap: 16,
        paddingRight: 16,
        justifyContent: 'center', // Center cards on mobile
        flexGrow: 1, // Allow centering when content is smaller than viewport
    },
    cardWrapper: {
        // width: 'auto',
    },
    addCard: {
        width: 140, // Match horizontal card width roughly or smaller
        height: 72, // Match horizontal card height roughly (40 + padding)
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    addIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addText: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
    addText: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
    // Empty State Styles
    emptyBanner: {
        borderRadius: 20,
        padding: 24,
        overflow: 'hidden',
    },
    emptyContent: {
        alignItems: 'center',
        gap: 16,
    },
    emptyIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIcon: {
        fontSize: 32,
    },
    emptyTextContainer: {
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        fontFamily: 'Plus Jakarta Sans',
    },
    emptySubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        maxWidth: 280,
        fontFamily: 'Plus Jakarta Sans',
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    emptyButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6366F1',
        fontFamily: 'Plus Jakarta Sans',
    },
});
