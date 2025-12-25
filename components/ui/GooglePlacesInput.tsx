import React, { forwardRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface GooglePlacesInputProps {
    placeholder?: string;
    onPress: (data: any, details: any | null) => void;
    query?: any;
}

const GooglePlacesInput = forwardRef<GooglePlacesAutocompleteRef, GooglePlacesInputProps>(({ placeholder = "Search", onPress, query }, ref) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <IconSymbol
                    ios_icon_name="magnifyingglass"
                    android_material_icon_name="search"
                    size={20}
                    color={designSystem.colors.text.tertiary}
                />
            </View>
            <GooglePlacesAutocomplete
                ref={ref}
                placeholder={placeholder}
                onPress={onPress}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Ensure this env var is set
                    language: 'en',
                    types: 'establishment', // Restrict to businesses/establishments for clinics
                    ...query,
                }}
                styles={{
                    textInputContainer: {
                        backgroundColor: 'transparent',
                        paddingLeft: 40,
                        height: 56,
                        alignItems: 'center',
                    },
                    textInput: {
                        height: 56,
                        color: designSystem.colors.text.primary,
                        fontSize: 16,
                        backgroundColor: 'transparent',
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb',
                    },
                    row: {
                        backgroundColor: designSystem.colors.neutral[0],
                        padding: 13,
                        height: 44,
                        flexDirection: 'row',
                    },
                    separator: {
                        height: 0.5,
                        backgroundColor: designSystem.colors.neutral[200],
                    },
                    description: {
                        color: designSystem.colors.text.primary,
                    },
                    container: {
                        flex: 0,
                    },
                    listView: {
                        position: 'absolute',
                        top: 60,
                        left: 0,
                        right: 0,
                        backgroundColor: designSystem.colors.neutral[0],
                        borderRadius: 12,
                        zIndex: 1000,
                        elevation: 5,
                        ...designSystem.shadows.md,
                    }
                }}
                enablePoweredByContainer={false}
                fetchDetails={true}
                textInputProps={{
                    placeholderTextColor: designSystem.colors.text.tertiary,
                }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        zIndex: 10,
    },
    iconContainer: {
        position: 'absolute',
        left: 12,
        top: 18,
        zIndex: 11,
    }
});

export default GooglePlacesInput;
