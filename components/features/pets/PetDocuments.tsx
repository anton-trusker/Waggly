import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Image, Modal, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useDocuments } from '@/hooks/useDocuments';
import DocumentUpload from '@/components/ui/DocumentUpload';
import * as WebBrowser from 'expo-web-browser';

type Props = {
  petId: string;
};

export default function PetDocuments({ petId }: Props) {
  const { documents, uploadDocument, deleteDocument, loading } = useDocuments(petId);
  const [showUpload, setShowUpload] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [selectedDocType, setSelectedDocType] = useState<string>('other');

  const docTypes = ['all', 'medical', 'prescription', 'lab_result', 'other'];
  const uploadDocTypes = ['medical', 'prescription', 'lab_result', 'vaccination', 'insurance', 'other'];

  const handleUpload = async (uri: string, mimeType?: string, name?: string, size?: number) => {
    const fileName = name || `doc_${Date.now()}`;
    // Use selected document type from dropdown
    await uploadDocument(uri, selectedDocType as any, fileName, { size_bytes: size }, mimeType);
    setShowUpload(false);
    setSelectedDocType('other'); // Reset to default
  };

  const handleDelete = (id: string, url: string) => {
    Alert.alert('Delete Document', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteDocument(id, url) }
    ]);
  };

  const openPreview = async (url: string, mimeType?: string | null) => {
    if (mimeType && mimeType.startsWith('image/')) {
      setPreviewImage(url);
      return;
    }
    await WebBrowser.openBrowserAsync(url);
  };

  const filteredDocuments = useMemo(() => {
    if (filter === 'all') return documents;
    return documents.filter(doc => doc.type === filter);
  }, [documents, filter]);

  return (
    <View style={styles.container}>
      {showUpload ? (
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadLabel}>Select Document Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
            {uploadDocTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, selectedDocType === type && styles.typeChipActive] as any}
                onPress={() => setSelectedDocType(type)}
              >
                <Text style={[styles.typeText, selectedDocType === type && styles.typeTextActive]}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <DocumentUpload onSelect={handleUpload} label="Select Document" />
          <TouchableOpacity onPress={() => setShowUpload(false)} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {docTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.filterChip, filter === type && styles.filterChipActive] as any}
                  onPress={() => setFilter(type)}
                >
                  <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.list}>
            {filteredDocuments.map(doc => (
              <TouchableOpacity
                key={doc.id}
                style={styles.card}
                onPress={() => openPreview(doc.file_url, doc.mime_type)}
              >
                <View style={styles.iconBox}>
                  <IconSymbol
                    ios_icon_name={doc.mime_type?.startsWith('image/') ? 'photo' : 'doc.fill'}
                    android_material_icon_name={doc.mime_type?.startsWith('image/') ? 'photo' : 'description'}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.content}>
                  <Text style={styles.name}>{doc.file_name}</Text>
                  <Text style={styles.meta}>
                    {doc.type} • {new Date(doc.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(doc.id, doc.file_url)} style={styles.delBtn}>
                  <IconSymbol name="trash" size={20} color={colors.error} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {!loading && filteredDocuments.length === 0 && (
              <Text style={styles.empty}>
                {documents.length === 0 ? 'No documents yet.' : 'No documents match this filter.'}
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.addButton} onPress={() => setShowUpload(true)}>
            <IconSymbol name="plus" size={20} color="#fff" />
            <Text style={styles.addText}>Upload Document</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal visible={!!previewImage} transparent onRequestClose={() => setPreviewImage(null)}>
        <View style={styles.previewBackdrop}>
          <View style={styles.previewSheet}>
            {previewImage ? <Image source={{ uri: previewImage }} style={styles.previewImage} /> : null}
            <TouchableOpacity style={styles.previewClose} onPress={() => setPreviewImage(null)}>
              <Text style={styles.previewCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  uploadContainer: {
    marginBottom: 20,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: '#fff',
  },
  filterRow: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.card,
  },
  list: {
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  delBtn: {
    padding: 8,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  cancelBtn: {
    alignItems: 'center',
    padding: 12,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewSheet: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  previewClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  previewCloseText: {
    color: '#fff',
    fontWeight: '600',
  },
});
