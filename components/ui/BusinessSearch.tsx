import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface BusinessSearchProps {
  providerType: 'veterinary' | 'groomer' | 'trainer' | 'boarder' | 'daycare' | 'walker' | 'sitter' | 'behaviorist' | 'nutritionist' | 'other';
  value?: {
    businessName: string;
    providerName?: string;
    placeId?: string;
    address?: string;
    phone?: string;
    website?: string;
    lat?: number;
    lng?: number;
  };
  onChange: (business: Business) => void;
  userLocation?: { lat: number; lng: number };
  label?: string;
  required?: boolean;
  error?: string;
}

interface Business {
  businessName: string;
  providerName?: string;
  placeId?: string;
  address?: string;
  phone?: string;
  website?: string;
  lat?: number;
  lng?: number;
  distance?: number;
  rating?: number;
}

const PROVIDER_TYPE_LABELS: Record<string, string> = {
  veterinary: 'Veterinary Clinic',
  groomer: 'Grooming Salon',
  trainer: 'Training Center',
  boarder: 'Boarding Facility',
  daycare: 'Daycare Center',
  walker: 'Dog Walker',
  sitter: 'Pet Sitter',
  behaviorist: 'Behaviorist',
  nutritionist: 'Pet Nutritionist',
  other: 'Service Provider',
};

export default function BusinessSearch({
  providerType,
  value,
  onChange,
  userLocation,
  label,
  required = false,
  error,
}: BusinessSearchProps) {
  const [searchQuery, setSearchQuery] = useState(value?.businessName || '');
  const [showResults, setShowResults] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  
  // Mock recent/saved businesses (in real implementation, fetch from database)
  const recentBusinesses: Business[] = [];
  
  // Mock search results (in real implementation, integrate with Google Places API)
  const searchResults: Business[] = searchQuery.length > 2 ? [
    {
      businessName: `${searchQuery} - Example 1`,
      address: '123 Main Street, City, State 12345',
      phone: '(555) 123-4567',
      rating: 4.5,
      distance: 2.3,
      placeId: 'example_1',
    },
    {
      businessName: `${searchQuery} - Example 2`,
      address: '456 Oak Avenue, City, State 12345',
      phone: '(555) 987-6543',
      rating: 4.8,
      distance: 3.7,
      placeId: 'example_2',
    },
  ] : [];

  const handleSelectBusiness = (business: Business) => {
    setSearchQuery(business.businessName);
    setShowResults(false);
    onChange(business);
  };

  const handleManualEntry = () => {
    setIsManualEntry(true);
    setShowResults(false);
  };

  const providerLabel = label || `Select ${PROVIDER_TYPE_LABELS[providerType]}`;

  if (isManualEntry) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>
            {providerLabel}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
          <TouchableOpacity onPress={() => setIsManualEntry(false)} style={styles.backButton}>
            <IconSymbol android_material_icon_name="search" size={16} color="#0EA5E9" />
            <Text style={styles.backButtonText}>Search Instead</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.manualEntryContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Name *</Text>
            <TextInput
              style={styles.input}
              value={value?.businessName || ''}
              onChangeText={(text) => onChange({ ...value!, businessName: text })}
              placeholder="Enter business name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Provider Name (Optional)</Text>
            <TextInput
              style={styles.input}
              value={value?.providerName || ''}
              onChangeText={(text) => onChange({ ...value!, providerName: text })}
              placeholder="Dr. Smith, Jane Doe, etc."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address (Optional)</Text>
            <TextInput
              style={styles.input}
              value={value?.address || ''}
              onChangeText={(text) => onChange({ ...value!, address: text })}
              placeholder="123 Main St, City, State"
              placeholderTextColor="#9CA3AF"
              multiline
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.inputLabel}>Phone (Optional)</Text>
              <TextInput
                style={styles.input}
                value={value?.phone || ''}
                onChangeText={(text) => onChange({ ...value!, phone: text })}
                placeholder="(555) 123-4567"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.inputLabel}>Website (Optional)</Text>
              <TextInput
                style={styles.input}
                value={value?.website || ''}
                onChangeText={(text) => onChange({ ...value!, website: text })}
                placeholder="www.example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
              />
            </View>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {providerLabel}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconSymbol android_material_icon_name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setShowResults(text.length > 0);
            }}
            onFocus={() => setShowResults(searchQuery.length > 0)}
            placeholder={`Search ${PROVIDER_TYPE_LABELS[providerType].toLowerCase()}...`}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setShowResults(false);
            }}>
              <IconSymbol android_material_icon_name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {showResults && (
          <View style={styles.resultsContainer}>
            {/* Recent/Saved Businesses */}
            {recentBusinesses.length > 0 && searchQuery.length === 0 && (
              <>
                <Text style={styles.resultsSection}>Recent & Saved</Text>
                {recentBusinesses.map((business, index) => (
                  <BusinessResultItem
                    key={`recent-${index}`}
                    business={business}
                    onSelect={handleSelectBusiness}
                    showDistance={!!userLocation}
                  />
                ))}
              </>
            )}

            {/* Search Results */}
            {searchResults.length > 0 ? (
              <>
                {searchQuery.length > 0 && (
                  <Text style={styles.resultsSection}>Search Results</Text>
                )}
                {searchResults.map((business, index) => (
                  <BusinessResultItem
                    key={`result-${index}`}
                    business={business}
                    onSelect={handleSelectBusiness}
                    showDistance={!!userLocation}
                  />
                ))}
              </>
            ) : searchQuery.length > 2 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No results found</Text>
              </View>
            ) : null}

            {/* Manual Entry Option */}
            <TouchableOpacity style={styles.manualEntryButton} onPress={handleManualEntry}>
              <IconSymbol android_material_icon_name="edit" size={18} color="#0EA5E9" />
              <Text style={styles.manualEntryButtonText}>Enter manually</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Selected Business Display */}
      {value && !showResults && (
        <View style={styles.selectedBusinessContainer}>
          <View style={styles.selectedBusinessInfo}>
            <Text style={styles.selectedBusinessName}>{value.businessName}</Text>
            {value.address && (
              <Text style={styles.selectedBusinessAddress}>{value.address}</Text>
            )}
            {value.phone && (
              <Text style={styles.selectedBusinessPhone}>{value.phone}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setShowResults(true)}>
            <IconSymbol android_material_icon_name="edit" size={20} color="#0EA5E9" />
          </TouchableOpacity>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

interface BusinessResultItemProps {
  business: Business;
  onSelect: (business: Business) => void;
  showDistance: boolean;
}

function BusinessResultItem({ business, onSelect, showDistance }: BusinessResultItemProps) {
  return (
    <TouchableOpacity style={styles.resultItem} onPress={() => onSelect(business)}>
      <View style={styles.resultIconContainer}>
        <IconSymbol android_material_icon_name="location-on" size={20} color="#0EA5E9" />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{business.businessName}</Text>
        {business.address && (
          <Text style={styles.resultAddress}>{business.address}</Text>
        )}
        <View style={styles.resultMetadata}>
          {business.rating && (
            <View style={styles.ratingContainer}>
              <IconSymbol android_material_icon_name="star" size={14} color="#FBBF24" />
              <Text style={styles.ratingText}>{business.rating}</Text>
            </View>
          )}
          {showDistance && business.distance && (
            <Text style={styles.distanceText}>{business.distance} km</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#EF4444',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0EA5E9',
  },
  searchContainer: {
    position: 'relative',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  resultsSection: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  resultItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  resultAddress: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  resultMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  distanceText: {
    fontSize: 13,
    color: '#6B7280',
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  manualEntryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0EA5E9',
  },
  selectedBusinessContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    gap: 12,
  },
  selectedBusinessInfo: {
    flex: 1,
  },
  selectedBusinessName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedBusinessAddress: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  selectedBusinessPhone: {
    fontSize: 13,
    color: '#6B7280',
  },
  manualEntryContainer: {
    gap: 16,
    marginTop: 8,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 4,
  },
});
