import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PetPassportCard } from '@/components/pet/PetPassportCard';
import ShareModal from '@/components/desktop/modals/ShareModal';
import { Pet } from '@/types';
import * as Haptics from 'expo-haptics';
import { CalendarEvent } from '@/hooks/useEvents';
import { designSystem } from '@/constants/designSystem';

interface MyPetsWidgetProps {
    pets: Pet[];
    loading?: boolean;
    events?: CalendarEvent[];
}

export default function MyPetsWidget({ pets, loading = false, events = [] }: MyPetsWidgetProps) {
    const router = useRouter();
    const { theme } = useAppTheme();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const [activeIndex, setActiveIndex] = useState(0);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [selectedPetForShare, setSelectedPetForShare] = useState<Pet | null>(null);

    const hasPets = pets.length > 0;

    const handleQrPress = (pet: Pet) => {
        setSelectedPetForShare(pet);
        setShareModalVisible(true);
    };

    // Responsive grid columns
    const getColumns = (screenWidth: number) => {
        if (screenWidth < 640) return 1;      // Mobile: 1 column
        if (screenWidth < 1024) return 2;     // Tablet: 2 columns
        if (screenWidth < 1440) return 3;     // Desktop: 3 columns
        return 4;                             // Wide: 4 columns
    };

    const columns = getColumns(width);
    const useGrid = width >= 768; // Use grid on tablet and above

    const cardGap = 12;
    const horizontalPadding = 16;
    const cardWidth = isMobile ? (width - (horizontalPadding * 2 + cardGap)) / 2 : useGrid ? ((width - (horizontalPadding * 2) - (cardGap * (columns - 1))) / columns) : 360;

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = cardWidth + cardGap;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);

        if (roundIndex !== activeIndex && roundIndex >= 0 && roundIndex < pets.length) {
            setActiveIndex(roundIndex);
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        }
    };

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
        <View style={styles.container}>
            {useGrid ? (
                /* Desktop/Tablet: Grid Layout */
                <FlatList
                    data={pets}
                    numColumns={columns}
                    key={`grid-${columns}`} // Force re-render when columns change
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false} // Disable scroll, parent handles it
                    contentContainerStyle={[
                        styles.gridContent,
                        { paddingHorizontal: horizontalPadding }
                    ]}
                    columnWrapperStyle={columns > 1 ? { gap: cardGap, marginBottom: cardGap } : undefined}
                    renderItem={({ item: pet }) => (
                        <View style={{ flex: 1 / columns, maxWidth: cardWidth }}>
                            <PetPassportCard
                                pet={pet}
                                onPress={() => router.push(`/(tabs)/pets/${pet.id}` as any)}
                                onQrPress={() => handleQrPress(pet)}
                                alerts={events.filter(e => e.petId === pet.id)}
                                cardWidth={cardWidth}
                            />
                        </View>
                    )}
                    keyExtractor={(pet) => pet.id}
                />
            ) : (
                /* Mobile: Horizontal Scroll */
                <>
                    <ScrollView
                        horizontal
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={[
                            styles.scrollContent,
                            { paddingHorizontal: horizontalPadding },
                        ]}
                        snapToInterval={cardWidth + cardGap}
                        snapToAlignment="start"
                        decelerationRate="fast"
                    >
                        {pets.map((pet, index) => (
                            <View
                                key={pet.id}
                                style={[
                                    styles.cardWrapper,
                                    {
                                        width: cardWidth,
                                        marginRight: index === pets.length - 1 ? 0 : cardGap
                                    }
                                ]}
                            >
                                <PetPassportCard
                                    pet={pet}
                                    onPress={() => router.push(`/(tabs)/pets/${pet.id}` as any)}
                                    onQrPress={() => handleQrPress(pet)}
                                    alerts={events.filter(e => e.petId === pet.id)}
                                    cardWidth={cardWidth}
                                />
                            </View>
                        ))}
                    </ScrollView>

                    {/* Pagination Dots */}
                    {pets.length > 2 && (
                        <View style={styles.pagination}>
                            {pets.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor: index === activeIndex
                                                ? designSystem.colors.primary[500]
                                                : 'rgba(0,0,0,0.1)',
                                            width: index === activeIndex ? 20 : 6
                                        }
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </>
            )}

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
        marginBottom: 8,
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: 8,
        justifyContent: 'center',
    },
    gridContent: {
        paddingBottom: 8,
    },
    cardWrapper: {
        // marginRight managed dynamically via cardGap
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    emptyBanner: {
        borderRadius: 24,
        padding: 32,
        ...designSystem.shadows.md,
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
