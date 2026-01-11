import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddressFormSectionProps {
  locationName: string;
  setLocationName: (text: string) => void;
  address: string;
  setAddress: (text: string) => void;
  city: string;
  setCity: (text: string) => void;
  state: string;
  setState: (text: string) => void;
  zip: string;
  setZip: (text: string) => void;
  country: string;
  setCountry: (text: string) => void;
  isDark?: boolean;
}

export default function AddressFormSection({
  locationName, setLocationName,
  address, setAddress,
  city, setCity,
  state, setState,
  zip, setZip,
  country, setCountry,
  isDark = false
}: AddressFormSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      {/* Clinic/Location Name Search */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Vet Name / Clinic</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.input, styles.searchInput] as any}
            value={locationName}
            onChangeText={setLocationName}
            placeholder="Search for a clinic or provider"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
          />
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
          </View>
        </View>
      </View>

      {/* Address Fields Toggle */}
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.toggleText}>
          {expanded ? 'Hide Address Details' : 'Add/Edit Full Address'}
        </Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={isDark ? "#60A5FA" : "#2563EB"} 
        />
      </TouchableOpacity>

      {/* Collapsible Address Fields */}
      {expanded && (
        <View style={styles.addressFields}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. 123 Vet Lane"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={state}
                onChangeText={setState}
                placeholder="State"
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Zip Code</Text>
              <TextInput
                style={styles.input}
                value={zip}
                onChangeText={setZip}
                placeholder="Zip"
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Country"
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    gap: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#E5E7EB' : '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: isDark ? '#F9FAFB' : '#111827',
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    paddingLeft: 40,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#60A5FA' : '#2563EB',
  },
  addressFields: {
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: isDark ? '#374151' : '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});
