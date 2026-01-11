
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';

interface AlbumTabProps {
    onNewAlbum: () => void;
    onAddMedia: () => void;
}

export default function AlbumTab({ onNewAlbum, onAddMedia }: AlbumTabProps) {
    const { theme } = useAppTheme();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    const isLargeScreen = width >= 1024;

    const [selectedFilter, setSelectedFilter] = useState('All');

    // Mock Data (Consolidated from original file)
    const albums = [
        { id: '1', name: 'Puppy Days', count: 24, type: 'photos', cover: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=800' },
        { id: '2', name: 'Beach Trip 2023', count: 15, type: 'mixed', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
        { id: '3', name: 'Medical & Vet', count: 8, type: 'documents', cover: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800' },
        { id: '4', name: 'Training Progress', count: 5, type: 'videos', cover: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800' },
    ];

    const photos = [
        { id: '1', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800', type: 'photo', isFavorite: false },
        { id: '2', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800', type: 'video', duration: '0:45', isFavorite: false },
        { id: '3', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800', type: 'photo', isFavorite: true },
        { id: '4', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800', type: 'photo', isFavorite: false },
        { id: '5', url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800', type: 'photo', isFavorite: false },
        { id: '6', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800', type: 'photo', isFavorite: true },
        { id: '7', url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=800', type: 'photo', isFavorite: false },
        { id: '8', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800', type: 'photo', isFavorite: false },
    ];

    const filteredPhotos = selectedFilter === 'All'
        ? photos
        : selectedFilter === 'Photos'
            ? photos.filter(p => p.type === 'photo')
            : selectedFilter === 'Videos'
                ? photos.filter(p => p.type === 'video')
                : photos.filter(p => p.isFavorite);

    return (
        <ScrollView style={[styles.container, isDesktop && styles.containerDesktop]} showsVerticalScrollIndicator={false}>
            <View style={[styles.content]}>

                {/* Header Actions (Mobile Only - Desktop has header via shell/nav but we can keep inline actions if needed) */}
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.btnSecondary, { backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.secondary }] as any}
                        onPress={onNewAlbum}
                    >
                        <IconSymbol android_material_icon_name="create-new-folder" size={20} color={theme.colors.text.secondary} />
                        <Text style={[styles.btnTextSecondary, { color: theme.colors.text.secondary }]}>New Album</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnPrimary, { backgroundColor: theme.colors.primary[500] }] as any}
                        onPress={onAddMedia}
                    >
                        <IconSymbol android_material_icon_name="add-a-photo" size={20} color="#fff" />
                        <Text style={styles.btnTextPrimary}>Add Media</Text>
                    </TouchableOpacity>
                </View>

                {/* Albums Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <IconSymbol android_material_icon_name="folder" size={24} color={theme.colors.primary[500]} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Albums</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={[styles.viewAllLink, { color: theme.colors.primary[500] }]}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.albumsScroll}>
                        {albums.map((album) => (
                            <TouchableOpacity key={album.id} style={[styles.albumCard, { backgroundColor: theme.colors.background.secondary }]}>
                                <Image source={{ uri: album.cover }} style={styles.albumCover} />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)'] as any}
                                    style={styles.albumOverlay}
                                />
                                <View style={styles.albumInfo}>
                                    <Text style={styles.albumName}>{album.name}</Text>
                                    <Text style={styles.albumCount}>
                                        {album.count} {album.type === 'mixed' ? 'Items' : album.type}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Media Grid Section */}
                <View style={styles.section}>

                    {/* Filters */}
                    <View style={styles.filtersRow}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                            {['All', 'Photos', 'Videos', 'Favorites'].map((filter) => {
                                const isActive = selectedFilter === filter;
                                return (
                                    <TouchableOpacity
                                        key={filter}
                                        onPress={() => setSelectedFilter(filter)}
                                        style={[
                                            styles.filterChip,
                                            isActive ? { backgroundColor: theme.colors.primary[500] } : { backgroundColor: theme.colors.background.secondary, borderWidth: 1, borderColor: theme.colors.border.secondary }
                                        ] as any}
                                    >
                                        <Text style={[styles.filterText, isActive ? { color: '#fff' } : { color: theme.colors.text.secondary }]}>{filter}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Grid */}
                    <View style={styles.grid}>
                        {filteredPhotos.map((photo) => (
                            <TouchableOpacity
                                key={photo.id}
                                style={[
                                    styles.gridItem,
                                    {
                                        width: isDesktop
                                            ? isLargeScreen ? '23%' : '31%' // ~4 or ~3 cols on desktop
                                            : '47%', // ~2 cols on mobile
                                        backgroundColor: theme.colors.background.secondary
                                    }
                                ] as any}
                            >
                                <Image source={{ uri: photo.url }} style={styles.gridImage} />

                                {photo.type === 'video' && (
                                    <>
                                        <View style={styles.videoBadge}>
                                            <Text style={styles.videoDuration}>{photo.duration}</Text>
                                        </View>
                                        <View style={styles.playIconOverlay}>
                                            <IconSymbol android_material_icon_name="play-arrow" size={20} color="#fff" />
                                        </View>
                                    </>
                                )}
                                {photo.isFavorite && (
                                    <View style={styles.favIconOverlay}>
                                        <IconSymbol android_material_icon_name="favorite" size={16} color="#EC4899" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.loadMoreBtn}>
                        <Text style={[styles.loadMoreText, { color: theme.colors.text.secondary }]}>Load More</Text>
                        <IconSymbol android_material_icon_name="expand-more" size={20} color={theme.colors.text.secondary} />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerDesktop: {
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
        padding: 32,
    },
    content: {
        padding: 20,
        gap: 32,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'flex-end',
    },
    btnSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    btnTextSecondary: {
        fontSize: 14,
        fontWeight: '600',
    },
    btnPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    btnTextPrimary: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    section: {
        gap: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    viewAllLink: {
        fontSize: 14,
        fontWeight: '600',
    },
    albumsScroll: {
        gap: 16,
        paddingRight: 16,
    },
    albumCard: {
        width: 160,
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    albumCover: {
        width: '100%',
        height: '100%',
    },
    albumOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    albumInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
    },
    albumName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
    },
    albumCount: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    filtersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        // justifyContent: 'space-between', // gap handles spacing, start alignment is safer for last row
    },
    gridItem: {
        aspectRatio: 1,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    videoBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    videoDuration: {
        fontSize: 10,
        fontWeight: '600',
        color: '#fff',
    },
    playIconOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    favIconOverlay: {
        position: 'absolute',
        top: 8,
        left: 8,
        padding: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    loadMoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 16,
        paddingVertical: 12,
    },
    loadMoreText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
