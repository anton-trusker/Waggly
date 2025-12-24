import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '@/styles/commonStyles';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/hooks/useLocale';

interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
  isImage?: boolean;
}

interface DocumentUploaderProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

export default function DocumentUploader({ files, onFilesChange, maxFiles = 5 }: DocumentUploaderProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useLocale();

  const pickImage = async () => {
    if (files.length >= maxFiles) {
        Alert.alert('Limit Reached', `You can only upload up to ${maxFiles} files.`);
        return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: maxFiles - files.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newFiles = result.assets.map(asset => ({
        uri: asset.uri,
        name: asset.fileName || 'photo.jpg',
        type: 'image/jpeg',
        isImage: true
      }));
      onFilesChange([...files, ...newFiles]);
    }
  };

  const pickDocument = async () => {
    if (files.length >= maxFiles) {
        Alert.alert('Limit Reached', `You can only upload up to ${maxFiles} files.`);
        return;
    }
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            multiple: true,
            copyToCacheDirectory: true
        });

        if (!result.canceled) {
            const newFiles = result.assets.map(asset => ({
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType || 'application/octet-stream',
                size: asset.size,
                isImage: asset.mimeType?.startsWith('image/')
            }));
            onFilesChange([...files, ...newFiles]);
        }
    } catch (err) {
        console.error(err);
    }
  };

  const takePhoto = async () => {
    if (files.length >= maxFiles) {
        Alert.alert('Limit Reached', `You can only upload up to ${maxFiles} files.`);
        return;
    }
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
        const asset = result.assets[0];
        const newFile = {
            uri: asset.uri,
            name: asset.fileName || `photo_${Date.now()}.jpg`,
            type: 'image/jpeg',
            isImage: true
        };
        onFilesChange([...files, newFile]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  const getFileIcon = (file: UploadedFile) => {
      if (file.isImage) return 'photo';
      if (file.type.includes('pdf')) return 'doc.text.fill';
      return 'doc.fill';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('documents.title', { defaultValue: 'Documents & Photos' })}</Text>
      
      <View style={styles.buttonsRow}>
         <TouchableOpacity style={styles.actionButton} onPress={pickDocument}>
             <IconSymbol ios_icon_name="doc.badge.plus" android_material_icon_name="note-add" size={20} color={colors.primary} />
             <Text style={styles.actionText}>{t('documents.add_document', { defaultValue: 'Add Document' })}</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
             <IconSymbol ios_icon_name="photo.on.rectangle" android_material_icon_name="photo-library" size={20} color={colors.primary} />
             <Text style={styles.actionText}>{t('common.gallery', { defaultValue: 'Gallery' })}</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
             <IconSymbol ios_icon_name="camera" android_material_icon_name="camera-alt" size={20} color={colors.primary} />
             <Text style={styles.actionText}>{t('common.camera', { defaultValue: 'Camera' })}</Text>
         </TouchableOpacity>
      </View>

      {files.length > 0 && (
          <View style={styles.fileList}>
              {files.map((file, index) => (
                  <View key={index} style={styles.fileItem}>
                      <View style={styles.fileIcon}>
                          {file.isImage ? (
                              <Image source={{ uri: file.uri }} style={styles.thumbnail} />
                          ) : (
                              <IconSymbol 
                                ios_icon_name="doc.text.fill" 
                                android_material_icon_name="description" 
                                size={24} 
                                color={colors.textSecondary} 
                              />
                          )}
                      </View>
                      <View style={styles.fileInfo}>
                          <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                          <Text style={styles.fileType}>{file.type.split('/')[1]?.toUpperCase() || 'FILE'} • {(file.size ? (file.size / 1024).toFixed(0) + ' KB' : '')}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeFile(index)} style={styles.removeButton}>
                          <IconSymbol ios_icon_name="xmark.circle.fill" android_material_icon_name="close" size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                  </View>
              ))}
          </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  fileList: {
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  fileType: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
});
