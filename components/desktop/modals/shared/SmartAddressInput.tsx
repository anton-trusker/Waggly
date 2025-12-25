import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SmartAddressInputProps {
  label?: string;
  providerName: string;
  setProviderName: (text: string) => void;
  address: string;
  setAddress: (text: string) => void;
  city?: string;
  setCity?: (text: string) => void;
  state?: string;
  setState?: (text: string) => void;
  zip?: string;
  setZip?: (text: string) => void;
  country?: string;
  setCountry?: (text: string) => void;
}

export default function SmartAddressInput({
  label = "Vet Name / Clinic",
  providerName, setProviderName,
  address, setAddress,
  city, setCity,
  state, setState,
  zip, setZip,
  country, setCountry
}: SmartAddressInputProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="space-y-3">
      {/* Clinic/Location Name Search */}
      <View>
        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">{label}</Text>
        <View className="relative">
          <TextInput
            className="w-full bg-[#1C1C1E] rounded-xl pl-10 pr-4 py-3 text-white text-base"
            value={providerName}
            onChangeText={setProviderName}
            placeholder="Search for a clinic or provider"
            placeholderTextColor="#6B7280"
          />
          <View className="absolute left-3 top-3.5">
            <Ionicons name="search" size={20} color="#6B7280" />
          </View>
        </View>
      </View>

      {/* Address Fields Toggle */}
      <TouchableOpacity 
        className="flex-row items-center gap-1"
        onPress={() => setExpanded(!expanded)}
      >
        <Text className="text-[#0A84FF] text-sm font-medium">
          {expanded ? 'Hide Address Details' : 'Add/Edit Full Address'}
        </Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#0A84FF" 
        />
      </TouchableOpacity>

      {/* Collapsible Address Fields */}
      {expanded && (
        <View className="pl-3 border-l-2 border-[#374151] space-y-3">
          <View>
            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Street Address</Text>
            <TextInput
              className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. 123 Vet Lane"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View className="flex-row gap-3">
            <View className="flex-2">
              <Text className="text-[#9CA3AF] text-xs font-medium mb-2">City</Text>
              <TextInput
                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor="#6B7280"
              />
            </View>
            <View className="flex-1">
              <Text className="text-[#9CA3AF] text-xs font-medium mb-2">State</Text>
              <TextInput
                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                value={state}
                onChangeText={setState}
                placeholder="State"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
