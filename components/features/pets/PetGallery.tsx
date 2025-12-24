import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  ActivityIndicator,
  Modal,
  Dimensions
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePets } from '@/hooks/usePets';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

// Calculate image size for 4 columns with proper spacing
const IMAGE_SIZE = (screenWidth - 48) / 4; // 48 = 16*2 padding + 16 spacing (4*4)

type Props = {
  petId: string;
  gallery: string[];
};

export default function PetGallery({ petId, gallery }: Props) {
  const { updatePet } = usePets();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(gallery || []);
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setImages(gallery || []);
  }, [gallery]);

  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        aspect: [1, 1], // Force square aspect ratio
      });

      if (!result.canceled && user) {
        setLoading(true);
        const uri = result.assets[0].uri;
        
        // Upload
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
        const fileName = `gallery_${Date.now()}.jpg`;
        const filePath = `${user.id}/${petId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('pet-photos')
          .upload(filePath, decode(base64), { contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('pet-photos')
          .getPublicUrl(filePath);

        // Update Pet
        const newGallery = [publicUrl, ...(images || [])];
        await updatePet(petId, { photo_gallery: newGallery });
        setImages(newGallery);
      }
    } catch (error) {
      console.error('Error adding photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (index: number) => {
    if (!user) return;
    
    try {
      setImageLoading(prev => ({ ...prev, [index]: true }));
      
      const newImages = images.filter((_, i) => i !== index);
      await updatePet(petId, { photo_gallery: newImages });
      setImages(newImages);
      
      // Close modal if we're deleting the currently viewed image
      if (selectedImageIndex === index) {
        setModalVisible(false);
        setSelectedImageIndex(null);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    } finally {
      setImageLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const renderImageItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => handleImagePress(index)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item }} 
        style={styles.image}
        onLoadStart={() => setImageLoading(prev => ({ ...prev, [index]: true }))}
        onLoadEnd={() => setImageLoading(prev => ({ ...prev, [index]: false }))}
        resizeMode="cover" // Ensure images fill the square container
      />
      {imageLoading[index] && (
        <View style={styles.imageLoadingOverlay}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeletePhoto(index)}
        disabled={imageLoading[index]}
      >
        <IconSymbol ios_icon_name="xmark.circle.fill" android_material_icon_name="close" size={16} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyTitle}>No Photos Yet</Text>
          <Text style={styles.emptyText}>Add photos of your pet to create memories</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          numColumns={4}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderImageItem}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={handleAddPhoto} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <IconSymbol ios_icon_name="plus" android_material_icon_name="add" size={20} color="#fff" />
            <Text style={styles.uploadText}>Add Photo</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Full Screen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton} 
            onPress={() => setModalVisible(false)}
          >
            <IconSymbol ios_icon_name="xmark" android_material_icon_name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {selectedImageIndex !== null && (
            <>
              <Image
                source={{ uri: images[selectedImageIndex] }}
                style={styles.modalImage}
                resizeMode="contain"
              />

              {/* Navigation arrows */}
              {selectedImageIndex > 0 && (
                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalPrevButton]}
                  onPress={handlePrevImage}
                >
                  <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="chevron-left" size={20} color="#fff" />
                </TouchableOpacity>
              )}

              {selectedImageIndex < images.length - 1 && (
                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalNextButton]}
                  onPress={handleNextImage}
                >
                  <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color="#fff" />
                </TouchableOpacity>
              )}

              {/* Image counter */}
              <View style={styles.modalCounter}>
                <Text style={styles.modalCounterText}>
                  {selectedImageIndex + 1} / {images.length}
                </Text>
              </View>

              {/* Delete button */}
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={() => handleDeletePhoto(selectedImageIndex)}
              >
                <IconSymbol ios_icon_name="trash" android_material_icon_name="delete" size={16} color="#fff" />
                <Text style={styles.modalDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  uploadText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 2,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 2,
  },
  listContent: {
    paddingBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    padding: 10,
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderRadius: 12,
  },
  modalNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  modalPrevButton: {
    left: 20,
  },
  modalNextButton: {
    right: 20,
  },
  modalCounter: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalCounterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalDeleteButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalDeleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});