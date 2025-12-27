import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { usePets } from '@/hooks/usePets';
import { uploadPetPhoto } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export default function AddPetPhotoPage() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const { user } = useAuth();
  const { pets } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const selectedPet = useMemo(() => pets.find(p => p.id === selectedPetId), [pets, selectedPetId]);

  useEffect(() => {
    if (petId) {
      setSelectedPetId(petId);
      return;
    }

    if (!selectedPetId && pets.length > 0) {
      setSelectedPetId(pets[0].id);
    }
  }, [petId, pets, selectedPetId]);

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPreviewUri(result.assets[0].uri);
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to pick image');
    }
  };

  const upload = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }
    if (!selectedPetId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }
    if (!previewUri) {
      Alert.alert('Error', 'Please choose a photo');
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadPetPhoto(user.id, selectedPetId, previewUri);

      const { error } = await supabase
        .from('pet_photos')
        .insert({
          pet_id: selectedPetId,
          user_id: user.id,
          url: publicUrl,
        } as any);

      if (error) throw error;

      router.back();
    } catch (e: any) {
      Alert.alert('Upload failed', e?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Add Photo</Text>
          <Text style={styles.subtitle}>Upload a new photo to the gallery</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Pet</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petRow}>
          {pets.map((p) => {
            const active = p.id === selectedPetId;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.petChip, active && styles.petChipActive]}
                onPress={() => setSelectedPetId(p.id)}
                disabled={uploading}
              >
                <Text style={[styles.petChipText, active && styles.petChipTextActive]} numberOfLines={1}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.divider} />

        <Text style={styles.label}>Photo</Text>
        {previewUri ? (
          <View style={styles.previewRow}>
            <View style={styles.previewImageWrap}>
              <Image source={{ uri: previewUri }} style={styles.previewImage} />
            </View>
            <View style={styles.previewMeta}>
              <Text style={styles.previewTitle} numberOfLines={1}>
                {selectedPet ? `For ${selectedPet.name}` : 'Selected'}
              </Text>
              <Text style={styles.previewHint}>You can pick a different image</Text>
              <View style={styles.previewActions}>
                <TouchableOpacity style={styles.secondaryButton} onPress={pickPhoto} disabled={uploading}>
                  <Ionicons name="image-outline" size={18} color="#374151" />
                  <Text style={styles.secondaryButtonText}>Choose</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryDangerButton}
                  onPress={() => setPreviewUri(null)}
                  disabled={uploading}
                >
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  <Text style={styles.secondaryDangerText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.pickArea} onPress={pickPhoto} disabled={uploading}>
            <Ionicons name="cloud-upload-outline" size={28} color="#6B7280" />
            <Text style={styles.pickTitle}>Choose an image</Text>
            <Text style={styles.pickSubtitle}>JPG or PNG</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()} disabled={uploading}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryButton, uploading && styles.primaryButtonDisabled]} onPress={upload} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="arrow-up-circle-outline" size={18} color="#fff" />
                <Text style={styles.primaryButtonText}>Upload</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 32,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  petRow: {
    gap: 10,
    paddingVertical: 4,
  },
  petChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxWidth: 160,
  },
  petChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  petChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  petChipTextActive: {
    color: '#4338CA',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  pickArea: {
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pickTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  pickSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  previewRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  previewImageWrap: {
    width: 140,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewMeta: {
    flex: 1,
    gap: 8,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  previewHint: {
    fontSize: 13,
    color: '#6B7280',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#6366F1',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryDangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  secondaryDangerText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
