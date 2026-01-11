import React, { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface PetImageProps {
  source?: { uri: string } | ImageSourcePropType | null;
  size?: number;
  borderRadius?: number;
  fallbackEmoji?: string;
  style?: any;
  debugMode?: boolean;
}

export function PetImage({ 
  source, 
  size = 72, 
  borderRadius = 36, 
  fallbackEmoji = '🐾',
  style,
  debugMode = false
}: PetImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUri, setImageUri] = useState<string>('');

  useEffect(() => {
    // Reset states when source changes
    setImageError(false);
    setImageLoaded(false);
    
    if (debugMode) {
      console.log('PetImage: Source received:', source);
    }
    
    if (source && typeof source === 'object' && 'uri' in source && source.uri) {
      setImageUri(source.uri);
      if (debugMode) {
        console.log('PetImage: URI set to:', source.uri);
      }
    } else {
      setImageUri('');
    }
  }, [source, debugMode]);

  const handleImageError = (error: any) => {
    setImageError(true);
    if (debugMode) {
      console.log('PetImage: Error loading image:', error);
      console.log('PetImage: Failed URI:', imageUri);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (debugMode) {
      console.log('PetImage: Image loaded successfully');
    }
  };

  // Determine if we should show the image
  // valid if source exists, and if it's an object with uri, the uri must be non-empty
  const shouldShowImage = source && (
    typeof source === 'number' || 
    (typeof source === 'object' && 'uri' in source && source.uri)
  );

  if (debugMode) {
    console.log('PetImage: shouldShowImage:', shouldShowImage);
    console.log('PetImage: imageError:', imageError);
  }

  if (imageError || !shouldShowImage) {
    if (debugMode) {
      console.log('PetImage: Showing fallback');
    }
    return (
      <View style={[
        styles.fallbackContainer, 
        { width: size, height: size, borderRadius },
        style
      ]}>
        <Text style={[styles.fallbackEmoji, { fontSize: size * 0.5 }]}>
          {fallbackEmoji}
        </Text>
        {debugMode && (
          <Text style={[styles.debugText, { fontSize: size * 0.1 }]}>
            {imageUri ? 'ERR' : 'NA'}
          </Text>
        )}
      </View>
    );
  }

  if (debugMode) {
    console.log('PetImage: Rendering Image component');
  }

  return (
    <Image
      source={source as ImageSourcePropType}
      style={[
        styles.image,
        { width: size, height: size, borderRadius },
        style,
        !imageLoaded && styles.loadingImage
      ] as any}
      onError={handleImageError}
      onLoad={handleImageLoad}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.iconBackground,
  },
  loadingImage: {
    opacity: 0.7,
  },
  fallbackContainer: {
    backgroundColor: colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: {
    color: colors.text,
    textAlign: 'center',
  },
  debugText: {
    color: colors.textSecondary,
    textAlign: 'center',
    position: 'absolute',
    bottom: 2,
  },
});