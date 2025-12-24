import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

type Props = {
  onSelect: (uri: string, mimeType?: string, name?: string, size?: number) => void;
  label?: string;
};

export default function DocumentUpload({ onSelect, label = 'Upload Document' }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, multiple: false });
      if (result.type === 'success') {
        setImage(result.uri);
        onSelect(result.uri, result.mimeType || undefined, result.name || undefined, result.size || undefined);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : image ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.preview} />
            <View style={styles.changeOverlay}>
              <Text style={styles.changeText}>Change</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <IconSymbol
              ios_icon_name="doc.text.viewfinder"
              android_material_icon_name="upload-file"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.subLabel}>Tap to select file</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  uploadBox: {
    height: 160,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  subLabel: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#000',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    alignItems: 'center',
  },
  changeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
