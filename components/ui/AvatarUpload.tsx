import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { designSystem, getSpacing } from '@/constants/designSystem';

type Props = {
  uri: string | null;
  onChange: (uri: string | null) => void;
};

export default function AvatarUpload({ uri, onChange }: Props) {
  const pick = async () => {
    // mediaTypes uses ImagePicker.MediaTypeOptions.Images (deprecated) or newer API
    // The warning says: Use `ImagePicker.MediaType` or an array of `ImagePicker.MediaType` instead.
    // However, the types might vary by version.
    // Let's use the non-deprecated way if possible, but keep fallback.
    // The warning specifically suggests `ImagePicker.MediaType`.
    
    // In newer expo-image-picker:
    // mediaTypes: ImagePicker.MediaTypeOptions.Images -> DEPRECATED
    // mediaTypes: ['images'] OR ImagePicker.MediaType.Images ?
    
    // Let's check typical usage. Often it's:
    // mediaTypes: ImagePicker.MediaTypeOptions.Images (which is an enum string 'Images')
    // The warning suggests the enum itself is deprecated in favor of something else?
    // Actually, usually it's `mediaTypes: ImagePicker.MediaTypeOptions.Images` that triggers it.
    
    // Let's try passing the string directly or using the newer way if we can infer it.
    // Actually, let's just ignore the warning if it works, OR fix it by casting properly.
    // But to fix it properly:
    // If version >= 14, MediaTypeOptions is deprecated.
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Newer API accepts array of strings: ['images', 'videos']
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const path = asset.uri;
      const valid = asset.type === 'image' || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png');
      if (!valid) return;
      try {
        const res = await fetch(path, { cache: 'no-store' });
        const blob = await res.blob();
        if (blob.size && blob.size > 5 * 1024 * 1024) return;
      } catch {}
      onChange(path);
    }
  };

  return (
    <View style={styles.circle}>
      {uri ? <Image source={{ uri }} style={styles.image} /> : <Text style={styles.placeholder}>🐾</Text>}
      <TouchableOpacity style={styles.overlay} onPress={pick} accessibilityRole="button" accessibilityLabel="Add photo">
        <Text style={styles.camera}>📸</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: getSpacing(35), // 140px
    height: getSpacing(35), // 140px
    borderRadius: designSystem.borderRadius.full,
    backgroundColor: designSystem.colors.background.primary,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getSpacing(4),
    position: 'relative',
    ...designSystem.shadows.sm,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: designSystem.borderRadius.full,
    resizeMode: 'cover',
  },
  placeholder: {
    ...designSystem.typography.display.large,
    opacity: 0.5,
  },
  overlay: {
    position: 'absolute',
    bottom: getSpacing(2),
    right: getSpacing(2),
    backgroundColor: designSystem.colors.background.secondary,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
    borderRadius: designSystem.borderRadius.lg,
    paddingHorizontal: getSpacing(2),
    paddingVertical: getSpacing(1.5),
    ...designSystem.shadows.sm,
  },
  camera: {
    fontSize: designSystem.iconSizes.md,
    lineHeight: designSystem.iconSizes.md,
  },
});
