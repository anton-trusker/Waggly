import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Platform
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
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
    name?: string; // Business/place name
    lat: number;
    lng: number;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    country_code?: string;
}

interface Prediction {
    place_id: string;
    description: string;
    structured_formatting?: {
        main_text: string;
        secondary_text: string;
    };
}

interface PlacesAutocompleteProps {
    value: string;
    onSelect: (place: Place) => void;
    placeholder?: string;
    types?: string[]; // e.g., ['address'], ['veterinary_care'], ['establishment']
    label?: string;
    error?: string;
}

// For web, we'll use the Google Places JavaScript SDK
declare global {
    interface Window {
        google?: {
            maps: {
                places: {
                    AutocompleteService: new () => {
                        getPlacePredictions: (
                            request: any,
                            callback: (predictions: any[], status: string) => void
                        ) => void;
                    };
                    PlacesService: new (attrContainer: HTMLDivElement) => {
                        getDetails: (
                            request: any,
                            callback: (result: any, status: string) => void
                        ) => void;
                    };
                    PlacesServiceStatus: {
                        OK: string;
                    };
                };
            };
        };
        initGooglePlaces?: () => void;
    }
}

// Load Google Maps Script (web only)
const loadGoogleMapsScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Not in browser environment'));
            return;
        }

        // Already loaded
        if (window.google?.maps?.places) {
            resolve();
            return;
        }

        // Check if script is already loading
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
            return;
        }

        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            reject(new Error('Google Maps API key not configured'));
            return;
        }

        window.initGooglePlaces = () => {
            resolve();
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
    });
};

export default function PlacesAutocomplete({
    value,
    onSelect,
    placeholder = 'Search address...',
    types = ['address'],
    label,
    error,
}: PlacesAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const autocompleteService = useRef<any>(null);
    const placesService = useRef<any>(null);
    const placesContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Load Google Maps for web
    useEffect(() => {
        if (Platform.OS === 'web') {
            loadGoogleMapsScript()
                .then(() => {
                    // Create services
                    autocompleteService.current = new window.google!.maps.places.AutocompleteService();

                    // Create a hidden div for PlacesService (required)
                    if (!placesContainerRef.current) {
                        placesContainerRef.current = document.createElement('div');
                        placesContainerRef.current.style.display = 'none';
                        document.body.appendChild(placesContainerRef.current);
                    }
                    placesService.current = new window.google!.maps.places.PlacesService(placesContainerRef.current);

                    setMapsLoaded(true);
                })
                .catch((err) => {
                    console.error('Failed to load Google Maps:', err);
                });
        }

        return () => {
            // Cleanup
            if (placesContainerRef.current) {
                document.body.removeChild(placesContainerRef.current);
                placesContainerRef.current = null;
            }
        };
    }, []);

    const searchPlacesWeb = useCallback(async (text: string) => {
        if (!text || text.length < 3 || !autocompleteService.current) {
            setPredictions([]);
            setShowPredictions(false);
            return;
        }

        setLoading(true);

        const request: any = {
            input: text,
        };

        // Map types to Google's format
        // Note: 'establishment' cannot be mixed with other types
        if (types.length > 0) {
            // Filter out 'establishment' if there are other types (can't be mixed)
            let googleTypes = types.filter(t =>
                ['address', 'geocode', 'establishment', 'regions', 'cities'].includes(t) ||
                t.includes('_') // specific place types like 'veterinary_care'
            );

            // If we have 'establishment' mixed with other types, use only the first non-establishment type
            const hasEstablishment = googleTypes.includes('establishment');
            const otherTypes = googleTypes.filter(t => t !== 'establishment');

            if (hasEstablishment && otherTypes.length > 0) {
                // Can't mix establishment with other types - use only other types
                googleTypes = otherTypes;
            }

            // Only pass first type if multiple (Google only accepts one type with establishment restriction)
            if (googleTypes.length > 0) {
                request.types = [googleTypes[0]];
            }
        }

        autocompleteService.current.getPlacePredictions(
            request,
            (results: any[], status: string) => {
                setLoading(false);
                if (status === window.google?.maps.places.PlacesServiceStatus.OK && results) {
                    setPredictions(results.map((r: any) => ({
                        place_id: r.place_id,
                        description: r.description,
                        structured_formatting: r.structured_formatting,
                    })));
                    setShowPredictions(true);
                } else {
                    setPredictions([]);
                    setShowPredictions(false);
                }
            }
        );
    }, [types]);

    const searchPlacesNative = async (text: string) => {
        // For native platforms, we can use the REST API (no CORS issues)
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
            if (Platform.OS === 'web' && mapsLoaded) {
                searchPlacesWeb(text);
            } else if (Platform.OS !== 'web') {
                searchPlacesNative(text);
            }
        }, 300);
    };

    const selectPlaceWeb = useCallback(async (placeId: string, description: string, mainText?: string) => {
        if (!placesService.current) return;

        setLoading(true);

        placesService.current.getDetails(
            {
                placeId,
                fields: ['name', 'formatted_address', 'address_components', 'geometry'],
            },
            (result: any, status: string) => {
                setLoading(false);
                if (status === window.google?.maps.places.PlacesServiceStatus.OK && result) {
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
                        name: result.name || mainText || description.split(',')[0],
                        formatted_address: result.formatted_address || description,
                        lat: result.geometry?.location?.lat() || 0,
                        lng: result.geometry?.location?.lng() || 0,
                        street: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
                        city: getComponent('locality') || getComponent('sublocality'),
                        state: getComponent('administrative_area_level_1'),
                        country: getComponent('country'),
                        postal_code: getComponent('postal_code'),
                        country_code: getShortComponent('country'),
                    };

                    onSelect(place);
                    // Use the business name in the input field
                    setQuery(place.name || result.formatted_address || description);
                    setPredictions([]);
                    setShowPredictions(false);
                }
            }
        );
    }, [onSelect]);

    const selectPlaceNative = async (placeId: string, description: string, mainText?: string) => {
        try {
            setLoading(true);
            const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

            if (!apiKey) {
                console.warn('Google Maps API key not configured');
                return;
            }

            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=name,formatted_address,address_components,geometry`;
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
                    name: result.name || mainText || description.split(',')[0],
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
                // Use the business name in the input field
                setQuery(place.name || result.formatted_address || description);
                setPredictions([]);
                setShowPredictions(false);
            }
        } catch (error) {
            console.error('Place details error:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectPlace = (placeId: string, description: string, mainText?: string) => {
        if (Platform.OS === 'web' && mapsLoaded) {
            selectPlaceWeb(placeId, description, mainText);
        } else {
            selectPlaceNative(placeId, description, mainText);
        }
    };

    // Show loading state while Google Maps loads on web
    const isInitializing = Platform.OS === 'web' && !mapsLoaded;

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
                    style={[styles.input, error && styles.inputError] as any}
                    value={query}
                    onChangeText={handleTextChange}
                    placeholder={isInitializing ? 'Loading...' : placeholder}
                    placeholderTextColor={colors.textTertiary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isInitializing}
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
                    <FlashList
                        data={predictions}
                        keyExtractor={(item) => item.place_id}
                        estimatedItemSize={62}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.predictionItem}
                                onPress={() => selectPlace(item.place_id, item.description, item.structured_formatting?.main_text)}
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
            web: {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
