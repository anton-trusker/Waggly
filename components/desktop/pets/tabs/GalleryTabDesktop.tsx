import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types';
import { usePets } from '@/hooks/usePets';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { useAuth } from '@/contexts/AuthContext';

interface GalleryTabProps {
    pet: Pet;
}

export default function GalleryTabDesktop({ pet }: GalleryTabProps) {
    const { updatePet } = usePets();
    const { user } = useAuth();
    const [images, setImages] = useState<string[]>(pet.gallery || []);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (pet.gallery) {
            setImages(pet.gallery);
        }
    }, [pet.gallery]);

    const handleAddPhoto = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setLoading(true);
                const asset = result.assets[0];
                const uri = asset.uri;

                if (!user) return;

                const timestamp = new Date().getTime();
                const fileName = `${user.id}/${pet.id}/gallery_${timestamp}.jpg`;

                let uploadBody;
                if (Platform.OS === 'web') {
                    const response = await fetch(uri);
                    uploadBody = await response.blob();
                } else {
                    uploadBody = decode(asset.base64 || '');
                }

                const { error: uploadError } = await supabase.storage
                    .from('pet-photos')
                    .upload(fileName, uploadBody, {
                        contentType: 'image/jpeg',
                        upsert: false,
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('pet-photos')
                    .getPublicUrl(fileName);

                const newGallery = [...images, publicUrl];
                const { error: updateError } = await updatePet(pet.id, { gallery: newGallery });

                if (updateError) throw updateError;

                setImages(newGallery);
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            Alert.alert('Error', 'Failed to upload photo');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePhoto = async (photoUrl: string) => {
        Alert.alert(
            "Delete Photo",
            "Are you sure you want to delete this photo?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const newGallery = images.filter(img => img !== photoUrl);
                            
                            // 1. Update DB first to remove reference
                            const { error: updateError } = await updatePet(pet.id, { gallery: newGallery });
                            if (updateError) throw updateError;

                            // 2. Try to delete from storage (optional, best effort)
                            const path = photoUrl.split('/pet-photos/')[1];
                            if (path) {
                                await supabase.storage.from('pet-photos').remove([path]);
                            }

                            setImages(newGallery);
                            if (selectedImage === photoUrl) setSelectedImage(null);
                        } catch (error) {
                            console.error('Error deleting photo:', error);
                            Alert.alert('Error', 'Failed to delete photo');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Gallery</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={handleAddPhoto} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#0EA5E9" />
                    ) : (
                        <>
                            <Ionicons name="add" size={20} color="#0EA5E9" />
                            <Text style={styles.uploadButtonText}>Add Photo</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {images.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="images-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No photos yet</Text>
                    <Text style={styles.emptyStateSubtext}>Add photos of your pet to create a gallery</Text>
                </View>
            ) : (
                <View style={styles.grid}>
                    {images.map((img, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.imageContainer}
                            onPress={() => setSelectedImage(img)}
                        >
                            <Image source={{ uri: img }} style={styles.thumbnail} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Full Screen Image Modal */}
            <Modal
                visible={!!selectedImage}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => setSelectedImage(null)}
                    >
                        <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>

                    {selectedImage && (
                        <View style={styles.fullImageContainer}>
                            <Image 
                                source={{ uri: selectedImage }} 
                                style={styles.fullImage} 
                                resizeMode="contain"
                            />
                            <TouchableOpacity 
                                style={styles.deleteButton}
                                onPress={() => handleDeletePhoto(selectedImage)}
                            >
                                <Ionicons name="trash-outline" size={20} color="#fff" />
                                <Text style={styles.deleteButtonText}>Delete Photo</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0EA5E9',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 64,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 12,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#D1D5DB',
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    imageContainer: {
        width: 160,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 40,
        zIndex: 10,
        padding: 8,
    },
    fullImageContainer: {
        width: '100%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    deleteButton: {
        position: 'absolute',
        bottom: -60,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#EF4444',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
