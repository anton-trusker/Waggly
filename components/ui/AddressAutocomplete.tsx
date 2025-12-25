
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { colors } from '@/styles/commonStyles';
import { useAppTheme } from '@/hooks/useAppTheme';

interface AddressData {
    placeId: string;
    fullAddress: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    lat: number;
    lng: number;
}

interface AddressAutocompleteProps {
    onSelect: (data: AddressData) => void;
    placeholder?: string;
    initialValue?: string;
}

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function AddressAutocomplete({ onSelect, placeholder = 'Search address', initialValue }: AddressAutocompleteProps) {
    const { theme } = useAppTheme();

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder={placeholder}
                query={{
                    key: GOOGLE_MAPS_API_KEY,
                    language: 'en',
                }}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    if (!details) return;

                    // Extract address components
                    let street = '';
                    let city = '';
                    let state = '';
                    let zipCode = '';
                    let country = '';

                    details.address_components.forEach(component => {
                        if (component.types.includes('street_number')) {
                            street = component.long_name + ' ' + street;
                        }
                        if (component.types.includes('route')) {
                            street += component.long_name;
                        }
                        if (component.types.includes('locality')) {
                            city = component.long_name;
                        }
                        if (component.types.includes('administrative_area_level_1')) {
                            state = component.short_name;
                        }
                        if (component.types.includes('postal_code')) {
                            zipCode = component.long_name;
                        }
                        if (component.types.includes('country')) {
                            country = component.long_name;
                        }
                    });

                    const addressData: AddressData = {
                        placeId: details.place_id,
                        fullAddress: details.formatted_address,
                        street: street.trim(),
                        city,
                        state,
                        zipCode,
                        country,
                        lat: details.geometry.location.lat,
                        lng: details.geometry.location.lng,
                    };

                    onSelect(addressData);
                }}
                onFail={(error) => console.error(error)}

                styles={{
                    textInputContainer: {
                        backgroundColor: 'transparent',
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                    },
                    textInput: {
                        height: 48,
                        color: theme.colors.text.primary,
                        fontSize: 16,
                        backgroundColor: theme.colors.background.secondary,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: theme.colors.border.primary,
                        paddingHorizontal: 16,
                    },
                    predefinedPlacesDescription: {
                        color: theme.colors.text.secondary,
                    },
                    listView: {
                        backgroundColor: theme.colors.background.secondary,
                        borderRadius: 12,
                        marginTop: 8,
                        borderWidth: 1,
                        borderColor: theme.colors.border.primary,
                        zIndex: 1000,
                    },
                    row: {
                        backgroundColor: 'transparent',
                        padding: 13,
                        height: 44,
                        flexDirection: 'row',
                    },
                    separator: {
                        height: 0.5,
                        backgroundColor: theme.colors.border.primary,
                    },
                    description: {
                        color: theme.colors.text.primary,
                    }
                }}

                textInputProps={{
                    placeholderTextColor: theme.colors.text.secondary,
                    defaultValue: initialValue
                }}

                enablePoweredByContainer={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 100,
    },
});
