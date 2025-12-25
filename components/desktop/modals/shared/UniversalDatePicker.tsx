import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UniversalDatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}

export default function UniversalDatePicker({
  label,
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  minDate,
  maxDate
}: UniversalDatePickerProps) {
  return (
    <View>
      <Text className="text-[#9CA3AF] text-xs font-medium mb-2">{label}</Text>
      <View className="relative">
        <TextInput
          className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
          placeholder={placeholder}
          placeholderTextColor="#4B5563"
          value={value}
          onChangeText={onChange}
        />
        <View className="absolute right-4 top-3.5 pointer-events-none">
          <Ionicons name="calendar" size={20} color="#6B7280" />
        </View>
      </View>
    </View>
  );
}
