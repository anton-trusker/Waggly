import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { designSystem } from '@/constants/designSystem';
import { useTranslation } from 'react-i18next';

export default function PWAInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Check if running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (!isStandalone) {
      // Check if user has dismissed it before (could use localStorage)
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setIsVisible(true);
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (Platform.OS === 'web') {
      localStorage.setItem('pwa_prompt_dismissed', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
            <Text style={{ fontSize: 24 }}>📱</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t('pwa.install_title', { defaultValue: 'Install Waggli App' })}</Text>
          <Text style={styles.description}>
            {isIOS 
              ? t('pwa.install_ios', { defaultValue: 'Tap the Share button and select "Add to Home Screen"' })
              : t('pwa.install_android', { defaultValue: 'Tap the menu button and select "Install App"' })
            }
          </Text>
        </View>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <IconSymbol ios_icon_name="xmark" android_material_icon_name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 12,
    ...designSystem.shadows.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  closeButton: {
    padding: 8,
  },
});
