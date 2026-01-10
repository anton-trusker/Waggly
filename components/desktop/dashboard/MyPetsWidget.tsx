import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { DashboardPetCard } from '@/components/desktop/dashboard/DashboardPetCard';
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
    const isMobile = width < designSystem.breakpoints.tablet;
    const [activeIndex, setActiveIndex] = useState(0);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [selectedPetForShare, setSelectedPetForShare] = useState<Pet | null>(null);

    const handleQrPress = (pet: Pet) => {
        setSelectedPetForShare(pet);
        setShareModalVisible(true);
    };

    // Responsive grid columns
    const getColumns = (screenWidth: number) => {
        if (screenWidth < designSystem.breakpoints.tablet) return 1;
        if (screenWidth < designSystem.breakpoints.desktop) return 2;
        if (screenWidth < designSystem.breakpoints.wide) return 3;
        return 4;
    };

    const columns = getColumns(width);
    const useGrid = !isMobile;

    const cardGap = designSystem.spacing[4];
    const horizontalPadding = isMobile ? designSystem.spacing[4] : 0; // No padding on desktop container, parent handles it

    // Calculate card width
    const containerWidth = width - (isMobile ? 0 : (designSystem.spacing[6] * 2) + 260); // Approx width accounting for sidebar
    // Simplified width logic for robust responsiveness
    const cardWidth = isMobile
        ? width * 0.85
        : (containerWidth / columns) - cardGap;

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

    const AddPetCard = () => (
        <TouchableOpacity
            style={[styles.addCard, { width: isMobile ? cardWidth : '100%', height: isMobile ? undefined : 180 }]}
            onPress={() => router.push('/(tabs)/pets/new')}
        >
            <View style={styles.addCardContent}>
                <View style={styles.addIconCircle}>
                    <Ionicons name="add" size={32} color={designSystem.colors.primary[500]} />
                </View>
                <Text style={styles.addCardTitle}>Add New Pet</Text>
                <Text style={styles.addCardSubtitle}>Track another furry friend</Text>
            </View>
        </TouchableOpacity>
    );

    // Combine pets and "Add New" for the grid list
    const gridData = [...pets, { id: 'add-new-pet-action' } as any];

    return (
        <View style={styles.container}>
            {useGrid ? (
                /* Desktop/Tablet: Grid Layout */
                <View style={styles.gridContainer}>
                    {gridData.map((item, index) => (
                        <View
                            key={item.id}
                            style={{
                                width: `calc(${100 / columns}% - ${cardGap - (cardGap / columns)}px)`,
                                marginBottom: cardGap
                            }}
                        >
                            {item.id === 'add-new-pet-action' ? (
                                <AddPetCard />
                            ) : (
                                <DashboardPetCard
                                    pet={item}
                                    onPress={() => router.push(`/(tabs)/pets/${item.id}` as any)}
                                    onQrPress={() => handleQrPress(item)}
                                    cardWidth={undefined} // Autosize to container
                                />
                            )}
                        </View>
                    ))}
                </View>
            ) : (
                /* Mobile: Horizontal Scroll */
                <View>
                    <View style={styles.mobileHeader}>
                        <Text style={styles.sectionTitle}>Your Pets</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/pets/new')}>
                            <Text style={styles.seeAllText}>Add New</Text>
                        </TouchableOpacity>
                    </View>

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
                        decelerationRate="fast"
                        snapToInterval={cardWidth + cardGap}
                    >
                        {pets.map((pet, index) => (
                            <View
                                key={pet.id}
                                style={[
                                    styles.cardWrapper,
                                    {
                                        width: cardWidth,
                                        marginRight: cardGap
                                    }
                                ]}
                            >
                                <DashboardPetCard
                                    pet={pet}
                                    onPress={() => router.push(`/(tabs)/pets/${pet.id}` as any)}
                                    onQrPress={() => handleQrPress(pet)}
                                    cardWidth={cardWidth}
                                />
                            </View>
                        ))}
                        <View style={{ width: cardWidth }}>
                            <AddPetCard />
                        </View>
                    </ScrollView>
                </View>
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
        marginBottom: designSystem.spacing[6],
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: designSystem.spacing[4],
    },
    scrollContent: {
        paddingBottom: designSystem.spacing[4],
    },
    cardWrapper: {
        // marginRight managed dynamically
    },
    mobileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: designSystem.spacing[4],
        marginBottom: designSystem.spacing[3],
    },
    sectionTitle: {
        ...designSystem.typography.headline.small,
        fontSize: 20,
        color: designSystem.colors.text.primary,
    },
    seeAllText: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.primary[500],
    },
    addCard: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius.lg,
        borderWidth: 2,
        borderColor: designSystem.colors.border.primary,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 180, // Match typical card height
    },
    addCardContent: {
        alignItems: 'center',
        gap: designSystem.spacing[2],
    },
    addIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: designSystem.colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: designSystem.spacing[1],
    },
    addCardTitle: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.primary[600],
    },
    addCardSubtitle: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.text.secondary,
    },
});


