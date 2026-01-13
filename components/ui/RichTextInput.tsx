import React from 'react';
import { Input } from '@/components/design-system/primitives/Input';

interface RichTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  minHeight = 100
}: RichTextInputProps) {
  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      minHeight={minHeight}
      multiline
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    color: formColors.labelText,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    backgroundColor: formColors.inputBackground,
    color: formColors.inputText,
    borderColor: formColors.inputBorder,
  }
});
