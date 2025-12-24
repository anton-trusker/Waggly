import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useLocale } from '@/hooks/useLocale';

type Props = {
  label?: string;
  error?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  required?: boolean;
};

export default function FormField({ label, error, children, style, required }: Props) {
  const { t } = useLocale();
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {t(label, { defaultValue: label })}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {children}
      {error && <Text style={styles.error}>{t(error, { defaultValue: error })}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  required: {
    color: colors.error,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
});
