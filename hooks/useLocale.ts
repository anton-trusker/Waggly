import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLocale() {
  const { t, i18n } = useTranslation();

  const setLocale = useCallback((locale: string) => {
    i18n.changeLanguage(locale);
  }, [i18n]);

  return {
    locale: i18n.language,
    setLocale,
    t
  };
}
