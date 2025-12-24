import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { colors } from '@/styles/commonStyles';
import FormField from './FormField';
import { IconSymbol } from './IconSymbol';

const GOOGLE_PLACES_API_KEY = process.env.expo_public_GOOGLE_MAPS_API_KEY || '';

type Props = {
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onPlaceSelected?: (details: {
    address: string;
    placeId: string;
    lat: number;
    lng: number;
    name: string;
  }) => void;
  onChangeText?: (text: string) => void;
  containerStyle?: ViewStyle;
};

export default function LocationAutocomplete({
  label,
  placeholder = 'Search location...',
  error,
  required,
  value,
  onPlaceSelected,
  onChangeText,
  containerStyle,
}: Props) {
  const ref = useRef<GooglePlacesAutocomplete>(null);

  useEffect(() => {
    if (value && ref.current) {
      ref.current.setAddressText(value);
    }
  }, [value]);

  return (
    <FormField label={label} error={error} required={required} style={[styles.container, containerStyle]}>
      <View style={styles.wrapper}>
        <GooglePlacesAutocomplete
          ref={ref}
          placeholder={placeholder}
          onPress={(data: GooglePlaceData, details: GooglePlaceDetail | null = null) => {
            // 'details' is provided when fetchDetails = true
            if (details && onPlaceSelected) {
              onPlaceSelected({
                address: data.description,
                placeId: data.place_id,
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
                name: details.name || data.description,
              });
            }
            if (onChangeText) {
                onChangeText(data.description);
            }
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en', // language of the results
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          textInputProps={{
            placeholderTextColor: colors.textSecondary,
            onChangeText: (text) => {
                if (onChangeText) onChangeText(text);
            },
            style: {
                color: colors.text,
                fontSize: 15,
                height: 44,
                width: '100%',
            }
          }}
          styles={{
            container: {
              flex: 0,
            },
            textInputContainer: {
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              paddingHorizontal: 4, // Adjust padding
              height: 44,
              alignItems: 'center',
            },
            textInput: {
              backgroundColor: 'transparent',
              color: colors.text,
              fontSize: 15,
              height: 44,
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
              paddingLeft: 8,
            },
            listView: {
              backgroundColor: colors.card,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
              marginTop: 4,
              zIndex: 1000, // Make sure it floats above other elements
              position: 'absolute',
              top: 45,
              left: 0,
              right: 0,
            },
            row: {
              backgroundColor: 'transparent',
              padding: 13,
              height: 44,
              flexDirection: 'row',
            },
            separator: {
              height: 0.5,
              backgroundColor: colors.border,
            },
            description: {
              color: colors.text,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={300}
        />
        <View style={styles.iconContainer}>
          <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color={colors.textSecondary} />
        </View>
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000, // Ensure dropdown is visible
  },
  wrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
    pointerEvents: 'none', // Allow clicks to pass through to the input
  },
});
