import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import FormField from './FormField';
import { useLocale } from '@/hooks/useLocale';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  required?: boolean;
};

export default function Input({ label, error, required, style, placeholder, ...props }: Props) {
  const { t } = useLocale();
  return (
    <FormField label={label} error={error} required={required}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textSecondary}
        placeholder={placeholder ? t(placeholder, { defaultValue: placeholder }) : undefined}
        {...props}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    color: colors.text,
    fontSize: 15,
  },
});
