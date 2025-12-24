import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/useLocale';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { colors } from '@/styles/commonStyles';
import BottomCTA from '@/components/ui/BottomCTA';
import { IconSymbol } from '@/components/ui/IconSymbol';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const [selectedLang, setSelectedLang] = useState(locale.split('-')[0] || 'en');

  const handleSave = () => {
    setLocale(selectedLang);
    router.push('/(onboarding)/profile-setup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('onboarding.select_language_title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.select_language_subtitle')}</Text>
        </View>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langItem,
                selectedLang === lang.code && styles.selectedItem
              ]}
              onPress={() => setSelectedLang(lang.code)}
            >
              <View style={styles.langInfo}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={[
                  styles.langName,
                  selectedLang === lang.code && styles.selectedText
                ]}>
                  {lang.label}
                </Text>
              </View>
              {selectedLang === lang.code && (
                <IconSymbol
                  ios_icon_name="checkmark"
                  android_material_icon_name="check"
                  size={20}
                  color={designSystem.colors.primary[500]}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <BottomCTA
        primaryLabel={t('common.continue')}
        onPrimary={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: getSpacing(5),
  },
  header: {
    marginTop: getSpacing(4),
    marginBottom: getSpacing(6),
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: getSpacing(2),
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  list: {
    flex: 1,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getSpacing(4),
    paddingHorizontal: getSpacing(4),
    backgroundColor: colors.card,
    marginBottom: getSpacing(3),
    borderRadius: designSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...designSystem.shadows.sm,
  },
  selectedItem: {
    borderColor: designSystem.colors.primary[500],
    backgroundColor: designSystem.colors.primary[50],
  },
  langInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 24,
  },
  langName: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.text,
  },
  selectedText: {
    color: designSystem.colors.primary[700],
    fontWeight: '700',
  },
});
