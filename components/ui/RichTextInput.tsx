import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { formColors } from '@/styles/formStyles';

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
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { minHeight }] as any}
        placeholder={placeholder}
        placeholderTextColor={formColors.inputPlaceholder}
        multiline
        textAlignVertical="top"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
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
