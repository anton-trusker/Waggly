import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';

export default function AlbumTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { pets } = usePets();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isLargeScreen = width >= 1024;

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');

  const pet = pets?.find(p => p.id === id);
  if (!pet) return null;

  // Mock album data
  const albums = [
    { id: '1', name: 'Puppy Days', count: 24, type: 'photos', cover: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=800' },
    { id: '2', name: 'Beach Trip 2023', count: 15, type: 'mixed', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
    { id: '3', name: 'Medical & Vet', count: 8, type: 'documents', cover: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800' },
    { id: '4', name: 'Training Progress', count: 5, type: 'videos', cover: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800' },
  ];

  // Mock photos data
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

  // Responsive columns
  const numColumns = isMobile ? 2 : isLargeScreen ? 4 : 3;
  const gap = 16;
  // Calculate item width based on container padding (assumed 24 or 32) and gap
  const containerPadding = isMobile ? 24 : 32;
  // This is an approximation for inline styles; a better way is flexBasis or percentage
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Photo Gallery</Text>
            <Text style={styles.subtitle}>Manage {pet.name}'s photos, videos, and albums.</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.btnSecondary}
              onPress={() => router.push(`/web/pets/albums/new?petId=${id}` as any)}
            >
              <IconSymbol android_material_icon_name="create_new_folder" size={20} color="#6B7280" />
              <Text style={styles.btnTextSecondary}>New Album</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.btnPrimary}
              onPress={() => router.push(`/web/pets/photos/add?petId=${id}` as any)}
            >
              <IconSymbol android_material_icon_name="add_a_photo" size={20} color="#fff" />
              <Text style={styles.btnTextPrimary}>Add Media</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Albums Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <IconSymbol android_material_icon_name="folder" size={24} color="#5E2D91" />
              <Text style={styles.sectionTitle}>Albums</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.albumsScroll}
          >
            {albums.map((album) => (
              <TouchableOpacity key={album.id} style={styles.albumCard}>
                <Image source={{ uri: album.cover }} style={styles.albumCover} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
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
            
            {/* Create Album Card */}
            <TouchableOpacity 
              style={styles.createAlbumCard}
              onPress={() => router.push(`/web/pets/albums/new?petId=${id}` as any)}
            >
              <View style={styles.createIconCircle}>
                <IconSymbol android_material_icon_name="add" size={32} color="#9CA3AF" />
              </View>
              <Text style={styles.createAlbumText}>Create Album</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Media Section */}
        <View style={styles.section}>
          {/* Filters & Sort */}
          <View style={[styles.filtersRow, isMobile && styles.filtersRowMobile]}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.filtersScroll}
              contentContainerStyle={styles.filtersContainer}
            >
              {['All', 'Photos', 'Videos', 'Favorites'].map((filter) => {
                const isActive = selectedFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => setSelectedFilter(filter)}
                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                  >
                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortButtonText}>{sortBy}</Text>
                <IconSymbol android_material_icon_name="expand_more" size={16} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            {filteredPhotos.map((photo) => (
              <TouchableOpacity 
                key={photo.id} 
                style={[
                  styles.gridItem, 
                  { width: isMobile ? '48%' : isLargeScreen ? '23%' : '31%' } // Approx percentages accounting for gap
                ]}
              >
                <Image source={{ uri: photo.url }} style={styles.gridImage} />
                
                {/* Video Duration */}
                {photo.type === 'video' && (
                  <View style={styles.videoBadge}>
                    <Text style={styles.videoDuration}>{photo.duration}</Text>
                  </View>
                )}
                
                {/* Video Icon Overlay */}
                {photo.type === 'video' && (
                  <View style={styles.playIconOverlay}>
                    <IconSymbol android_material_icon_name="play_arrow" size={20} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Load More */}
          <TouchableOpacity style={styles.loadMoreBtn}>
            <Text style={styles.loadMoreText}>Load More</Text>
            <IconSymbol android_material_icon_name="expand_more" size={20} color="#6B7280" />
          </TouchableOpacity>

        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F8',
  },
  content: {
    padding: 32,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    gap: 32,
  },
  contentMobile: {
    padding: 16,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  headerText: {
    flex: 1,
    minWidth: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#5E2D91',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#5E2D91',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    color: '#1F2937',
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5E2D91',
  },
  albumsScroll: {
    gap: 16,
    paddingRight: 16, // End padding
  },
  albumCard: {
    width: 160,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
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
  createAlbumCard: {
    width: 160,
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  createIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAlbumText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filtersRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#5E2D91',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  filterTextActive: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'flex-start',
  },
  gridItem: {
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
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
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
    paddingVertical: 12,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});
