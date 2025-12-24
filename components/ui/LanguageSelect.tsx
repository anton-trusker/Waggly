import React from 'react';
import { LANGUAGES } from '@/data/languages';
import SearchableSelect from './SearchableSelect';
import { useLocale } from '@/hooks/useLocale';

type Props = {
  value?: string;
  onChange: (code: string) => void;
  label?: string;
};

export default function LanguageSelect({ value, onChange, label }: Props) {
  const { t } = useLocale();
  const items = LANGUAGES.map(l => ({
    value: l.code,
    label: l.name,
    icon: l.flag
  }));

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      items={items}
      label={label ?? t('common.language')}
      placeholder={t('common.select_language')}
      searchPlaceholder={t('common.search_language')}
    />
  );
}
