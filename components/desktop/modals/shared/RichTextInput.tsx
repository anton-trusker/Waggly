import React from 'react';
import { View, Text, TextInput } from 'react-native';

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
    <View>
      <Text className="text-[#9CA3AF] text-xs font-medium mb-2">{label}</Text>
      <TextInput
        className="w-full bg-[#1C1C1E] rounded-xl p-4 text-white text-base"
        placeholder={placeholder}
        placeholderTextColor="#4B5563"
        multiline
        textAlignVertical="top"
        style={{ minHeight }}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
