import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Platform } from 'react-native';
import 'intl-pluralrules';

import en from '../locales/en.json';
import de from '../locales/de.json';
import pt from '../locales/pt.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import pl from '../locales/pl.json';
import ru from '../locales/ru.json';

const RESOURCES = {
  en: { translation: en },
  de: { translation: de },
  pt: { translation: pt },
  fr: { translation: fr },
  es: { translation: es },
  pl: { translation: pl },
  ru: { translation: ru },
};

const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      // 1. Check AsyncStorage for user preference
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage) {
        return callback(savedLanguage);
      }

      // 2. Check Device Language
      const deviceLanguage = Localization.getLocales()[0]?.languageCode;
      
      // Check if device language is supported
      if (deviceLanguage && Object.keys(RESOURCES).includes(deviceLanguage)) {
        return callback(deviceLanguage);
      }

      // 3. Fallback to English
      return callback('en');
    } catch (error) {
      console.log('Error reading language', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.log('Error saving language', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: RESOURCES,
    fallbackLng: 'en',
    // keySeparator: false, // Allow nested keys
    saveMissing: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

// Handle RTL on init
i18n.on('initialized', async () => {
  const isRtl = RTL_LANGS.has(i18n.language);
  if (Platform.OS !== 'web') {
    I18nManager.allowRTL(isRtl);
    if (isRtl && !I18nManager.isRTL) {
      // RN requires reload on forceRTL change; skip force to avoid hard reload
    }
  }
});

i18n.on('languageChanged', async (lng) => {
  const isRtl = RTL_LANGS.has(lng);
  if (Platform.OS !== 'web') {
    I18nManager.allowRTL(isRtl);
  }
});

export default i18n;
