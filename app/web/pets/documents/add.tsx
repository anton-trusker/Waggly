import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useDocuments } from '@/hooks/useDocuments';
import { usePets } from '@/hooks/usePets';

const DOCUMENT_TYPES = [
  { id: 'medical', label: 'Medical Record', icon: 'fitness' },
  { id: 'vaccination', label: 'Vaccination', icon: 'medical' },
  { id: 'prescription', label: 'Prescription', icon: 'bandage' },
  { id: 'lab_result', label: 'Lab Result', icon: 'flask' },
  { id: 'insurance', label: 'Insurance', icon: 'shield-checkmark' },
  { id: 'invoice', label: 'Invoice', icon: 'receipt' },
  { id: 'other', label: 'Other', icon: 'document-text' },
];

export default function AddDocument() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { pets } = usePets();
  const { uploadDocument } = useDocuments(petId);

  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('medical');
  const [notes, setNotes] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string>(petId || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (petId) setSelectedPetId(petId);
    else if (pets.length > 0 && !selectedPetId) setSelectedPetId(pets[0].id);
  }, [petId, pets]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      setFile(asset);
      if (!name) setName(asset.name);
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleUpload = async () => {
    if (!file || !name) return;
    const targetPetId = petId || selectedPetId;
    if (!targetPetId) return;
    setLoading(true);
    try {
      const { error } = await uploadDocument(
        file.uri,
        type as any,
        name,
        { size_bytes: file.size, notes },
        file.mimeType,
        targetPetId
      );
      if (error) {
        console.error('Upload failed:', error);
      } else {
        router.push(`/web/pets/${targetPetId}/documents` as any);
      }
    } catch (error) {
      console.error('Upload exception:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Document</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()} disabled={loading}>
          <Ionicons name="close" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>File</Text>
          {file ? (
            <View style={styles.filePreview}>
              <View style={styles.fileIcon}>
                <Ionicons name="document" size={24} color="#6366F1" />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                <Text style={styles.fileSize}>
                  {file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setFile(null)}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadArea} onPress={handlePickFile}>
              <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
              <Text style={styles.uploadText}>Click to select a file</Text>
              <Text style={styles.uploadSubtext}>PDF, JPG, PNG up to 10MB</Text>
            </TouchableOpacity>
          )}
        </View>

        {!petId && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Pet</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.typeOption, selectedPetId === pet.id && styles.typeOptionActive]}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Ionicons name="paw" size={16} color={selectedPetId === pet.id ? '#6366F1' : '#6B7280'} />
                  <Text style={[styles.typeText, selectedPetId === pet.id && styles.typeTextActive]}>
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Document Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Vaccination Certificate 2024"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            {DOCUMENT_TYPES.map((docType) => (
              <TouchableOpacity
                key={docType.id}
                style={[styles.typeOption, type === docType.id && styles.typeOptionActive]}
                onPress={() => setType(docType.id)}
              >
                <Ionicons
                  name={docType.icon as any}
                  size={16}
                  color={type === docType.id ? '#6366F1' : '#6B7280'}
                />
                <Text style={[styles.typeText, type === docType.id && styles.typeTextActive]}>
                  {docType.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes or details..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()} disabled={loading}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
          onPress={handleUpload}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>{loading ? 'Uploading...' : 'Upload'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    minHeight: 80,
  },
  uploadArea: {
    height: 120,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  fileSize: {
    fontSize: 12,
    color: '#6B7280',
  },
  typeScroll: {
    flexDirection: 'row',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  typeOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  typeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    minWidth: 80,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
