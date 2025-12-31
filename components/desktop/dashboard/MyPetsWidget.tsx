
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { usePets } from '@/hooks/usePets';
import PetCardCompact from '@/components/dashboard/PetCardCompact';

export default function MyPetsWidget() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const { pets, loading } = usePets();
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1024;

    // Cyclic pastel colors for cards
    const cardColors = [
        '#EEF2FF', // Indigo 50
        '#F0FDF4', // Emerald 50
        '#FEF2F2', // Red 50
        '#FFF7ED', // Orange 50
        '#F5F3FF', // Violet 50
        '#ECFEFF', // Cyan 50
    ];

    return (
        <View style={[styles.container, {
            borderColor: theme.colors.border.primary,
            backgroundColor: theme.colors.background.primary
        }]}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: theme.colors.text.primary }]}>My Pets</Text>
                    <View style={[styles.badge, { backgroundColor: theme.colors.primary[50] }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.primary[500] }]}>{pets.length}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => router.push('/(tabs)/pets' as any)}>
                    <Text style={[styles.link, { color: theme.colors.primary[500] }]}>Manage</Text>
                </TouchableOpacity>
            </View>

            {isLargeScreen ? (
                // Desktop: Vertical Stack of Large Cards
                <View style={styles.desktopStack}>
                    {pets.map((pet, index) => (
                        <PetCardCompact
                            key={pet.id}
                            pet={pet}
                            variant="large"
                            themeColor={cardColors[index % cardColors.length]}
                            onQuickAdd={() => { }}
                        />
                    ))}

                    <TouchableOpacity
                        style={[styles.desktopAddButton, { borderColor: theme.colors.border.secondary }]}
                        onPress={() => router.push('/(tabs)/pets/add' as any)}
                    >
                        <Ionicons name="add" size={24} color={theme.colors.text.secondary} />
                        <Text style={[styles.desktopAddText, { color: theme.colors.text.secondary }]}>Add Another Pet</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Mobile: Horizontal Scroll
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {pets.map((pet, index) => (
                        <View key={pet.id} style={styles.cardWrapper}>
                            <PetCardCompact
                                pet={pet}
                                variant="horizontal"
                                themeColor={cardColors[index % cardColors.length]}
                                onQuickAdd={() => { }}
                            />
                        </View>
                    ))}

                    {/* Compact Add Button */}
                    <TouchableOpacity
                        style={[styles.addCard, { borderColor: theme.colors.border.secondary, backgroundColor: theme.colors.background.secondary }]}
                        onPress={() => router.push('/(tabs)/pets/add' as any)}
                    >
                        <View style={styles.addIconContainer}>
                            <Ionicons name="add" size={20} color={theme.colors.text.secondary} />
                        </View>
                        <Text style={[styles.addText, { color: theme.colors.text.secondary }]}>Add Pet</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
    link: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
    scrollContent: {
        gap: 16,
        paddingRight: 16,
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
    desktopStack: {
        gap: 4,
    },
    desktopAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 20,
    },
    desktopAddText: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    }
});
