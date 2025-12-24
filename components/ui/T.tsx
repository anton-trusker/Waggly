import React from 'react';
import { Text, TextProps } from 'react-native';
import { useLocale } from '@/hooks/useLocale';

type TProps = TextProps & {
  i18nKey?: string;
  values?: Record<string, any>;
  children?: React.ReactNode;
};

export default function T({ i18nKey, values, children, ...props }: TProps) {
  const { t } = useLocale();
  const childStr = typeof children === 'string' ? children : undefined;
  const key = i18nKey || childStr || '';
  const translated = key ? t(key, { defaultValue: childStr || key, ...(values || {}) }) : childStr;
  return (
    <Text {...props}>{translated ?? children}</Text>
  );
}

