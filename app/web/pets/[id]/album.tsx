import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AlbumTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');

  const pet = pets?.find(p => p.id === id);
  if (!pet) return null;

  // Mock album data - in real app this would come from usePhotos hook
  const albums = [
    { id: '1', name: 'Puppy Days', count: 24, type: 'photos' },
    { id: '2', name: 'Beach Trip 2023', count: 15, type: 'mixed' },
    { id: '3', name: 'Medical & Vet', count: 8, type: 'documents' },
    { id: '4', name: 'Training Progress', count: 5, type: 'videos' },
  ];

  // Mock photos data - in real app this would come from usePhotos hook
  const photos = [
    { id: '1', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCbEDiKgKdgoi14MszFheHyfY0GgB8HAetYe6UGZSVqib9VSex3LGJyTgCCYyeW4QSJfoauS7rtP9YtfeaNA2PdVrXVUctP8Jbaj0TcJUrtV6x6gn_1Cl-peoopSAv0izdIONF-Wf4kLtDbHmelaKrmFMahdXSHWNfApusw4AkmPi7QJhXP7iQog2jm6QA9zKP_PAYha2uJez8ZvH0FABKniGJiAycTAJ_8h1zknYVRvkpg1pcIdkwOTYOD_2i5A_CDX-iTjblbjQ', type: 'photo', isFavorite: false },
    { id: '2', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDykpPEhmfzg5zYE8FVfpE1jX3YkkW23JOweIMw0fYU96_1HgU24OqvTAr37GRuCHr60vfKU5NKwuB-XTScy36clkHh6TSWsOw1qcATPSC9xpBpCf3a8Q7LH_t3cxik2lz_3-U430yxEqqI0xXoqWjpoA5uuf_fybibEWcYTaZAxr76HwaVJ0NJoAjCFNiXyfN5BEvdJzsDZR0TADVty3c6T1UdMRNcggxKGlDH7u91z0kKEuvkkV_dJfSy65VzMm0YgL7aUP6-4zI', type: 'video', duration: '0:45', isFavorite: false },
    { id: '3', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUy59z7UFOg3q31OjHaCV7nWgP6mkgkO3JQuNfMKz8Pf4_zFD7P4CXk3NpuRk2Hny6yeq-_nTyN_Lxcy9NURCjfHljtU6Pe1ls8FyGgDOQpSiKEfFWc7eFRQSzHZ1sVPKoimQ25PQsWQzS3_72eMIl0OB4eQAsMQ48jVQbLlV4zQF0iTzv0YTUW08MQdgiqiAM54HGkxfOp7wxX5V52bZGL3qMLbSKQIo0cjK8YaCUDV047jWyNV1jC5crbxDTR6PDtHVmATay_2s', type: 'photo', isFavorite: true },
    { id: '4', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABmFa15tf6EKIvnDZpT10-BrNBOHz62lFcA0jN15ETovJ_CVX6L07sxPjis7UwCYy7vHol8yk0629vIoVZo6Iq5H-NBXcBglNdCW6ycs7LbKyKJzy6sLORICI8p8B18bqmLvgS6B63fWxwTWPnMFoT21vfmr0UkCIqFXXtRfoD_NrFQwZOToBCaoKHJlzV3q1MWXSQGIg6YiwFqc_5uSUr-wJcxHqc3B6-7zR2tFcGkCs27tbBkwZ7u_iRiQY1R-OcQx-761hPzP0', type: 'photo', isFavorite: false },
    { id: '5', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaJesDMI7soBD7JhmKyJhu8S0ftComNeCQ05Ddv6BrThaSE-qRdZwuoOJomzGnCYXg_cQB9EAl0pQjgPvhSIUSjWi2BhIsw6upfGri70v2DQcJ_5G-c228fxtvQsGPk8MlOl9Y-0PNQ-bWTQSbiPyF9JmGnIuLeWQoHFHsPUeCPCl1BqvhQrLVbshNWbZ-WeTGzfKpkiQeAZwyGxxzopYa01nfgczh-giOWR29ZqLzblAOtszEJjX7h2S37w__1pJNxTpUM2riSyA', type: 'photo', isFavorite: false },
    { id: '6', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkwE1IB370PhQBeTKIfnCO9-M8sGPbHUSKigdVtozgXDfUPQskIZnhAoZl3e7Yd8zmB7P16qpewoybV3xgK5-YFnyx5c2frNwTLQR-eY8rp4zwJnGdtaRHSV8ouPfZniTisWX99CgwWIZm8bZCkhy9OSVjSsOH5ABoql4a97YIjW5KXLP-ecKHAEOYk-KKeLGlDJ_B6mYeWyr19sJxILI8H5tBj-EDpBo61frjlPpcW11oXS4vQZm4RjVHNqmC2MOVzd14thYLRs8', type: 'photo', isFavorite: true },
    { id: '7', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOhkT4QlxPOlNOy3wOWj7BOlV3A0Wb6FeovJP0SbZQXxmwbH3VlCDUOJxZE8QAiESEYau-tn1RPxA4FK1dbfVSiMG-qfv-shF_c0gZxuXrEqJZtb_lWB225J3QyHOXDLVR5n2migFJ2jpNbs0SpWeJyXtmj0YeSDN7OMVTrmIRyaRU9HGAlECQlPWa25iExt3UL3Gr63YnoJ4S-XAOPqfqoK3UpBwBvEt1_YWS3qnOiG9hinnsCPxmD-gZ-KiC2LRx6ofCj5352uI', type: 'photo', isFavorite: false },
    { id: '8', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxmY8PBf8qy4jpoxt_Dh7xQUkGTX2Y5lnMsMDf0nkCyn4DfTA_TIBrhJKoXGnaBWKTOXwU9kgOGIkc9syxkR5f-imjVlxzWuKbu6EU5Aqi1mGdMEeydGTX-YwDyV7Uxyj99RHUxjPI6EPyKfUov-MJg-2S7moBn04VepIrlTtJQsM6YKhPzAjZ_9jYD7lLQyEC2HoqZkf666WPgj_AXUQiI-IjR8g_4_PMFeebY6ln7SgYcgD6H8w3g4N39zwuRJj2-3RGSsVqukU', type: 'photo', isFavorite: false },
  ];

  const getAlbumIcon = (type: string) => {
    switch (type) {
      case 'mixed': return 'photo_library';
      case 'videos': return 'videocam';
      case 'documents': return 'folder';
      default: return 'photo';
    }
  };

  const filteredPhotos = selectedFilter === 'All' 
    ? photos 
    : selectedFilter === 'Photos' 
    ? photos.filter(p => p.type === 'photo')
    : selectedFilter === 'Videos'
    ? photos.filter(p => p.type === 'video')
    : photos.filter(p => p.isFavorite);

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="p-4 lg:p-8">
        <View className="max-w-7xl mx-auto space-y-6">
          {/* Header with Actions */}
          <View className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <View>
              <Text className="text-xl font-bold text-text-light dark:text-text-dark">Photo Gallery</Text>
              <Text className="text-sm text-muted-light dark:text-muted-dark mt-1">Manage {pet.name}'s photos, videos, and albums.</Text>
            </View>
            <View className="flex items-center gap-3 w-full sm:w-auto">
              <Pressable 
                onPress={() => router.push(`/web/pets/albums/new?petId=${id}`)}
                className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <IconSymbol name="create_new_folder" size={20} className="text-muted-light dark:text-muted-dark" />
                <Text>New Album</Text>
              </Pressable>
              <Pressable 
                onPress={() => router.push(`/web/pets/photos/add?petId=${id}`)}
                className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/30 text-sm font-medium transition-all transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <IconSymbol name="add_a_photo" size={20} />
                <Text>Add Media</Text>
              </Pressable>
            </View>
          </View>

          {/* Albums Section */}
          <View className="space-y-4">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-2">
                <IconSymbol name="folder" size={24} className="text-primary" />
                <Text className="text-lg font-bold text-text-light dark:text-text-dark">Albums</Text>
              </View>
              <Pressable className="text-sm text-primary hover:text-primary-dark font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Text>View All</Text>
              </Pressable>
            </View>

            <View className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {albums.map((album) => (
                <Pressable
                  key={album.id}
                  onPress={() => router.push(`/web/pets/albums/${album.id}?petId=${id}`)}
                  className="group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                >
                  <View className="aspect-square rounded-2xl overflow-hidden relative border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-sm hover:shadow-md transition-all">
                    <Image 
                      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoVxZGmk17ONkeBjIUMvsvOpMhTWh166jqGxe5VMwoBC4aTfVuQncEV03QC_N0S2kc-5tH-8tyBb6Sf5I1BnqWu4d_Ozms9dEhk8LXTAL9wpagSEMMfR-3hWHx401kSgp_itG92rya3556r15GYJtsQQeVL5HzepGtPz2kLJTgg4Xb3TBJ7iiJdGPj5ar1de6-RTqL7nEl0UNXKL23dYATAETdXO2AFjCS55Fl_FPHqcuJ12WmuV7NdCIV-RWlGDGeEV-Bkk4nKck' }} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <View className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></View>
                    <View className="absolute bottom-3 left-3 right-3">
                      <Text className="text-white font-semibold text-sm truncate">{album.name}</Text>
                      <Text className="text-white/70 text-xs">{album.count} {album.type === 'mixed' ? 'Photos • 2 Videos' : album.type === 'videos' ? 'Videos' : 'Photos'}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}

              {/* Create Album Button */}
              <Pressable
                onPress={() => router.push(`/web/pets/albums/new?petId=${id}`)}
                className="group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
              >
                <View className="aspect-square rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark bg-transparent hover:bg-card-light dark:hover:bg-slate-800/50 transition-all flex flex-col items-center justify-center text-muted-light dark:text-muted-dark group-hover:text-primary group-hover:border-primary/50">
                  <IconSymbol name="add_circle_outline" size={32} />
                  <Text className="font-medium text-sm mt-2">Create Album</Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Photos Grid Section */}
          <View className="space-y-4">
            {/* Filter and Sort Controls */}
            <View className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 bg-background-light dark:bg-background-dark py-2">
              <View className="flex items-center gap-1 bg-card-light dark:bg-card-dark p-1 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                {['All', 'Photos', 'Videos', 'Favorites'].map((filter) => (
                  <Pressable
                    key={filter}
                    onPress={() => setSelectedFilter(filter)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      selectedFilter === filter 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Text>{filter}</Text>
                  </Pressable>
                ))}
              </View>

              <View className="flex items-center gap-3">
                <View className="flex items-center gap-2 text-sm text-muted-light dark:text-muted-dark">
                  <IconSymbol name="filter_list" size={20} />
                  <Text className="hidden sm:inline">Sort by:</Text>
                </View>
                <View className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark text-sm rounded-lg focus:ring-primary focus:border-primary p-2 px-3 shadow-sm">
                  <Text>{sortBy}</Text>
                </View>
              </View>
            </View>

            {/* Photos Grid */}
            <View className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => (
                <Pressable
                  key={photo.id}
                  className="aspect-square relative group overflow-hidden rounded-xl bg-gray-200 dark:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Image 
                    source={{ uri: photo.url }} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  
                  {/* Video Duration Badge */}
                  {photo.type === 'video' && photo.duration && (
                    <View className="absolute bottom-2 left-2 text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-md">
                      <Text>{photo.duration}</Text>
                    </View>
                  )}

                  {/* Video Play Icon */}
                  {photo.type === 'video' && (
                    <View className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                      <IconSymbol name="videocam" size={16} />
                    </View>
                  )}

                  {/* Hover Overlay */}
                  <View className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white">
                    <Pressable className="p-2 hover:bg-white/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                      <IconSymbol name={photo.isFavorite ? 'favorite' : 'favorite_border'} size={20} />
                    </Pressable>
                    <Pressable className="p-2 hover:bg-white/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                      <IconSymbol name="fullscreen" size={20} />
                    </Pressable>
                    {photo.type === 'video' && (
                      <Pressable className="p-2 hover:bg-white/20 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        <IconSymbol name="play_arrow" size={20} />
                      </Pressable>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Load More Button */}
            <View className="pt-4 text-center">
              <Pressable className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <IconSymbol name="expand_more" size={20} />
                <Text>Load More</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}