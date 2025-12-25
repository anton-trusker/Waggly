import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Platform
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export interface Place {
    place_id: string;
    formatted_address: string;
    lat: number;
    lng: number;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    country_code?: string;
}

interface PlacesAutocompleteProps {
    value: string;
    onSelect: (place: Place) => void;
    placeholder?: string;
    types?: string[]; // e.g., ['address'], ['veterinary_care'], ['establishment']
    label?: string;
    error?: string;
}

export default function PlacesAutocomplete({
    value,
    onSelect,
    placeholder = 'Search address...',
    types = ['address'],
    label,
    error,
}: PlacesAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    const searchPlaces = async (text: string) => {
        if (!text || text.length < 3) {
            setPredictions([]);
            setShowPredictions(false);
            return;
        }

        setLoading(true);
        try {
            const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

            if (!apiKey) {
                console.warn('Google Maps API key not configured');
                setLoading(false);
                return;
            }

            const typeParam = types.length > 0 ? `&types=${types.join('|')}` : '';
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${apiKey}${typeParam}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK' && data.predictions) {
                setPredictions(data.predictions);
                setShowPredictions(true);
            } else {
                setPredictions([]);
                setShowPredictions(false);
            }
        } catch (error) {
            console.error('Places autocomplete error:', error);
            setPredictions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (text: string) => {
        setQuery(text);

        // Debounce search
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            searchPlaces(text);
        }, 300);
    };

    const selectPlace = async (placeId: string, description: string) => {
        try {
            setLoading(true);
            const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

            if (!apiKey) {
                console.warn('Google Maps API key not configured');
                return;
            }

            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=formatted_address,address_components,geometry`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK' && data.result) {
                const result = data.result;
                const addressComponents: AddressComponent[] = result.address_components || [];

                const getComponent = (type: string) => {
                    const component = addressComponents.find((c) => c.types.includes(type));
                    return component?.long_name || '';
                };

                const getShortComponent = (type: string) => {
                    const component = addressComponents.find((c) => c.types.includes(type));
                    return component?.short_name || '';
                };

                const place: Place = {
                    place_id: placeId,
                    formatted_address: result.formatted_address || description,
                    lat: result.geometry?.location?.lat || 0,
                    lng: result.geometry?.location?.lng || 0,
                    street: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
                    city: getComponent('locality') || getComponent('sublocality'),
                    state: getComponent('administrative_area_level_1'),
                    country: getComponent('country'),
                    postal_code: getComponent('postal_code'),
                    country_code: getShortComponent('country'),
                };

                onSelect(place);
                setQuery(result.formatted_address || description);
                setPredictions([]);
                setShowPredictions(false);
            }
        } catch (error) {
            console.error('Place details error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                    <IconSymbol
                        ios_icon_name="location"
                        android_material_icon_name="location-on"
                        size={18}
                        color={colors.textTertiary}
                    />
                </View>

                <TextInput
                    style={[styles.input, error && styles.inputError]}
                    value={query}
                    onChangeText={handleTextChange}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textTertiary}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                )}

                {query.length > 0 && !loading && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                            setQuery('');
                            setPredictions([]);
                            setShowPredictions(false);
                        }}
                    >
                        <IconSymbol
                            ios_icon_name="xmark.circle.fill"
                            android_material_icon_name="cancel"
                            size={18}
                            color={colors.textTertiary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {showPredictions && predictions.length > 0 && (
                <View style={styles.predictionsContainer}>
                    <FlatList
                        data={predictions}
                        keyExtractor={(item) => item.place_id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.predictionItem}
                                onPress={() => selectPlace(item.place_id, item.description)}
                            >
                                <IconSymbol
                                    ios_icon_name="mappin.circle"
                                    android_material_icon_name="place"
                                    size={16}
                                    color={colors.primary}
                                    style={styles.predictionIcon}
                                />
                                <View style={styles.predictionTextContainer}>
                                    <Text style={styles.predictionMainText}>
                                        {item.structured_formatting?.main_text || item.description}
                                    </Text>
                                    {item.structured_formatting?.secondary_text && (
                                        <Text style={styles.predictionSecondaryText}>
                                            {item.structured_formatting.secondary_text}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                        style={styles.predictionsList}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        zIndex: 1,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.textSecondary,
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        minHeight: 44,
    },
    iconContainer: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
        paddingVertical: 10,
    },
    inputError: {
        borderColor: colors.error,
    },
    loadingContainer: {
        marginLeft: 8,
    },
    clearButton: {
        padding: 4,
        marginLeft: 4,
    },
    errorText: {
        color: colors.error,
        fontSize: 11,
        marginTop: 4,
    },
    predictionsContainer: {
        marginTop: 4,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        maxHeight: 200,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
            },
            android: {
                elevation: 5,
            },
        }),
    },
    predictionsList: {
        maxHeight: 200,
    },
    predictionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    predictionIcon: {
        marginRight: 12,
    },
    predictionTextContainer: {
        flex: 1,
    },
    predictionMainText: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
    },
    predictionSecondaryText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
});
