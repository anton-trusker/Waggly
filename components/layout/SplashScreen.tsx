import React from 'react';
import { View, Image, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { designSystem, getSpacing } from '@/constants/designSystem';

export default function SplasScreen() {
  const source = Platform.OS === 'web'
    ? { uri: '/favicon.ico' }
    : require('@/public/logo.png');

  return (
    <View style={styles.container} accessibilityLabel="Splas Screen">
      <View style={styles.card}>
        <Image source={source as any} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>pawzly</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderRadius: designSystem.borderRadius['3xl'],
    backgroundColor: colors.background,
    width: 375,
    height: 812,
  },
  logo: {
    width: getSpacing(16) * 2.5,
    height: 134,
    marginBottom: 12,
  },
  brand: {
    fontSize: 24,
    fontWeight: designSystem.typography.headline.small.fontWeight,
    color: colors.text,
  },
});

