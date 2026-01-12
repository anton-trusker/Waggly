import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, FlatList, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { designSystem } from '@/constants/designSystem';
import AppHeader from '@/components/layout/AppHeader';
import { usePets } from '@/hooks/usePets';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { uploadPetPhoto } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/design-system/primitives/Button';

export default function AddPhotosScreen() {
  const { petId: initialPetId } = useLocalSearchParams();
  const { user } = useAuth();
  const { pets } = usePets();
  const { width } = useWindowDimensions();

  const numColumns = width > 1024 ? 6 : width > 768 ? 4 : 3;

  const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId as string || (pets.length > 0 ? pets[0].id : null));
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickImages = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos(prev => [...prev, ...result.assets]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to use the camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos(prev => [...prev, ...result.assets]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (photos.length === 0) return;
    if (!selectedPetId || !user) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }

    setUploading(true);
    setProgress(0);
    let successCount = 0;

    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        try {
          // Upload to Storage
          // We use a different path structure for gallery photos: userId/pets/petId/gallery/timestamp
          /* const ext = photo.uri.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
          const filename = `${Date.now()}_${i}.${ext}`;
          const path = `${user.id}/pets/${selectedPetId}/gallery/${filename}`; */

          // Using uploadPetPhoto which puts it in standard bucket
          const publicUrl = await uploadPetPhoto(user.id, selectedPetId, photo.uri);

          // Insert into pet_photos table
          const { error: dbError } = await supabase
            .from('pet_photos')
            .insert({
              pet_id: selectedPetId,
              user_id: user.id,
              url: publicUrl,
            });

          if (dbError) throw dbError;

          successCount++;
          setProgress((i + 1) / photos.length);
        } catch (err) {
          console.error('Failed to upload photo', err);
        }
      }

      if (successCount === photos.length) {
        Alert.alert('Success', 'All photos uploaded successfully!');
        router.back();
      } else {
        Alert.alert('Partial Success', `${successCount} of ${photos.length} photos uploaded.`);
        setPhotos(prev => prev.slice(successCount)); // Keep failed ones
      }

    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Add Photos" showBack />

      <View style={styles.content}>
        {/* Pet Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Add to Gallery for:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petRow}>
            {pets.map(pet => (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petChip, selectedPetId === pet.id && styles.petChipSelected]}
                onPress={() => setSelectedPetId(pet.id)}
              >
                <Text style={[styles.petChipText, selectedPetId === pet.id && styles.petChipTextSelected]}>{pet.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImages} disabled={uploading}>
            <IconSymbol ios_icon_name="photo.on.rectangle" android_material_icon_name="photo-library" size={24} color={designSystem.colors.primary[500]} />
            <Text style={styles.actionText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto} disabled={uploading}>
            <IconSymbol ios_icon_name="camera" android_material_icon_name="camera-alt" size={24} color={designSystem.colors.primary[500]} />
            <Text style={styles.actionText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Grid */}
        <FlatList
          data={photos}
          key={numColumns} // Force re-render on column change
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.grid}
          renderItem={({ item, index }) => (
            <View style={[styles.photoContainer, { flex: 1 / numColumns }]}>
              <Image source={{ uri: item.uri }} style={styles.photo} />
              {!uploading && (
                <TouchableOpacity style={styles.removeButton} onPress={() => removePhoto(index)}>
                  <IconSymbol ios_icon_name="xmark" android_material_icon_name="close" size={12} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No photos selected</Text>
            </View>
          }
        />

        {/* Upload Button */}
        {photos.length > 0 && (
          <View style={styles.footer}>
            <Button
              title={uploading ? `Uploading ${Math.round(progress * 100)}%` : `Upload ${photos.length} Photos`}
              onPress={handleUpload}
              disabled={uploading}
              loading={uploading}
              fullWidth
              size="lg"
              variant="primary"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designSystem.colors.background.secondary,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    backgroundColor: designSystem.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: designSystem.colors.neutral[200],
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.text.secondary,
    marginBottom: 12,
  },
  petRow: {
    gap: 10,
  },
  petChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: designSystem.colors.background.primary,
    borderWidth: 1,
    borderColor: designSystem.colors.neutral[200],
  },
  petChipSelected: {
    backgroundColor: designSystem.colors.primary[50],
    borderColor: designSystem.colors.primary[500],
  },
  petChipText: {
    color: designSystem.colors.text.primary,
    fontWeight: '500',
  },
  petChipTextSelected: {
    color: designSystem.colors.primary[700],
  },
  actionsRow: {
    flexDirection: 'row',
    padding: 20,
    gap: 20,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: designSystem.colors.background.primary,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: designSystem.colors.neutral[200],
    gap: 8,
    ...designSystem.shadows.sm,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.text.primary,
  },
  grid: {
    padding: 10,
  },
  photoContainer: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 5,
    position: 'relative',
  },
  photo: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: designSystem.colors.neutral[100],
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: designSystem.colors.status.error[500],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: designSystem.colors.text.secondary,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: designSystem.colors.neutral[200],
    backgroundColor: designSystem.colors.background.primary,
  },
});
