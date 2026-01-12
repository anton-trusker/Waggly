import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { Input } from '../primitives/Input';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

// Define the standard Address object
export interface AddressValue {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    formattedAddress?: string;
    location?: {
        lat: number;
        lng: number;
    };
}

interface AddressWidgetProps {
    label?: string;
    value?: AddressValue;
    onChange?: (value: AddressValue) => void;
    error?: string;
}

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export const AddressWidget = ({
    label,
    value,
    onChange,
    error,
}: AddressWidgetProps) => {
    // Local state for the individual fields
    const [address, setAddress] = useState<AddressValue>({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        ...value,
    });

    const ref = useRef<GooglePlacesAutocompleteRef>(null);

    // Sync prop value to local state
    useEffect(() => {
        if (value) {
            setAddress(prev => ({ ...prev, ...value }));
            // Optional: Update the search text to match formatted address if provided?
            // ref.current?.setAddressText(value.formattedAddress || '');
        }
    }, [value]);

    const updateField = (field: keyof AddressValue, text: string) => {
        const newAddress = { ...address, [field]: text };
        setAddress(newAddress);
        onChange?.(newAddress);
    };

    const handlePlaceSelect = (data: any, details: any = null) => {
        if (!details) return;

        // Parse Google Places details
        const components = details.address_components;
        let streetNumber = '';
        let route = '';
        let city = '';
        let state = '';
        let country = '';
        let zipCode = '';

        components.forEach((component: any) => {
            const types = component.types;
            if (types.includes('street_number')) streetNumber = component.long_name;
            if (types.includes('route')) route = component.long_name;
            if (types.includes('locality')) city = component.long_name;
            if (types.includes('administrative_area_level_1')) state = component.short_name;
            if (types.includes('country')) country = component.long_name;
            if (types.includes('postal_code')) zipCode = component.long_name;
        });

        const newAddress: AddressValue = {
            street: `${streetNumber} ${route}`.trim(),
            city,
            state,
            zipCode,
            country,
            formattedAddress: data.description,
            location: details.geometry?.location,
        };

        setAddress(newAddress);
        onChange?.(newAddress);

        // Clear the search text to encourage looking at the filled fields? 
        // Or keep it? Usually better to keep it or update it to the formatted address.
        ref.current?.setAddressText(newAddress.formattedAddress || '');
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.sectionLabel}>{label}</Text>}

            {/* 1. Search Bar */}
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    ref={ref}
                    placeholder="Search for an address..."
                    onPress={handlePlaceSelect}
                    query={{
                        key: GOOGLE_PLACES_API_KEY,
                        language: 'en',
                    }}
                    fetchDetails={true}
                    enablePoweredByContainer={false}
                    styles={{
                        container: {
                            flex: 0,
                        },
                        textInput: styles.searchInput,
                        listView: styles.listView,
                        row: styles.row,
                    }}
                    textInputProps={{
                        placeholderTextColor: designSystem.colors.text.tertiary,
                        clearButtonMode: 'never', // We might want our own or native
                    }}
                />
                {/* We might need to wrap the library component to match our Input style strictly, 
            but passing styles is usually enough. */}
            </View>

            {/* 2. Detailed Fields */}
            <View style={styles.fieldsContainer}>
                <Input
                    label="Street Address"
                    value={address.street}
                    onChangeText={(t) => updateField('street', t)}
                    placeholder="123 Main St"
                />

                <View style={styles.rowContainer}>
                    <View style={{ flex: 1 }}>
                        <Input
                            label="City"
                            value={address.city}
                            onChangeText={(t) => updateField('city', t)}
                            placeholder="San Francisco"
                        />
                    </View>
                    <View style={{ width: 12 }} />
                    <View style={{ flex: 0.6 }}>
                        <Input
                            label="State"
                            value={address.state}
                            onChangeText={(t) => updateField('state', t)}
                            placeholder="CA"
                        />
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={{ flex: 1 }}>
                        <Input
                            label="Zip Code"
                            value={address.zipCode}
                            onChangeText={(t) => updateField('zipCode', t)}
                            placeholder="94105"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{ width: 12 }} />
                    <View style={{ flex: 1.5 }}>
                        <Input
                            label="Country"
                            value={address.country}
                            onChangeText={(t) => updateField('country', t)}
                            placeholder="United States"
                        />
                    </View>
                </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 8,
    },
    searchContainer: {
        marginBottom: 16,
        zIndex: 999, // Crucial for dropdown to show over other fields
    },
    fieldsContainer: {
        gap: 0, // Inputs have their own bottom margin (16)
    },
    rowContainer: {
        flexDirection: 'row',
    },

    // Google Places Customization
    searchInput: {
        height: 44,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: designSystem.colors.text.primary,
        backgroundColor: designSystem.colors.background.primary,
    },
    listView: {
        position: 'absolute',
        top: 48,
        left: 0,
        right: 0,
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        ...designSystem.shadows.md,
        zIndex: 1000,
    },
    row: {
        padding: 12,
        backgroundColor: 'transparent',
    },

    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: designSystem.colors.status.error[500],
    },
});
