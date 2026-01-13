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
