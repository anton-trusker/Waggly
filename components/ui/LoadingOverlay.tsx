import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Platform } from 'react-native';
import { getSpacing, designSystem } from '@/constants/designSystem';





interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay} accessibilityRole="progressbar" accessibilityLabel={message}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
        {!!message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designSystem.colors.overlay.default,
    zIndex: designSystem.zIndex.overlay,
  },
  card: {
    backgroundColor: designSystem.colors.background.primary,
    paddingHorizontal: getSpacing(6),
    paddingVertical: getSpacing(5),
    borderRadius: designSystem.borderRadius.lg,
    alignItems: 'center',
    ...designSystem.shadows.md,
  },
  message: {
    marginTop: getSpacing(3),
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.primary,
  },
});

export default LoadingOverlay;
