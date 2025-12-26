import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';

interface CityPrediction {
    place_id: string;
    main_text: string;
    secondary_text: string;
    description: string;
}

interface UseCityAutocompleteReturn {
    query: string;
    setQuery: (text: string) => void;
    predictions: CityPrediction[];
    loading: boolean;
    selectCity: (prediction: CityPrediction) => void;
    clearCity: () => void;
    selectedCity: string;
}

// Load Google Places script once
let googleScriptLoaded = false;
let googleScriptLoading = false;
const loadCallbacks: (() => void)[] = [];

const loadGooglePlacesScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (Platform.OS !== 'web') {
            reject(new Error('Google Places JS SDK only works on web'));
            return;
        }

        if (googleScriptLoaded && (window as any).google?.maps?.places) {
            resolve();
            return;
        }

        loadCallbacks.push(resolve);

        if (googleScriptLoading) {
            return;
        }

        googleScriptLoading = true;

        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            reject(new Error('Google Maps API key not configured'));
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            googleScriptLoaded = true;
            loadCallbacks.forEach(cb => cb());
            loadCallbacks.length = 0;
        };

        script.onerror = () => {
            reject(new Error('Failed to load Google Places SDK'));
        };

        document.head.appendChild(script);
    });
};

export function useCityAutocomplete(countryCode?: string): UseCityAutocompleteReturn {
    const [query, setQuery] = useState('');
    const [predictions, setPredictions] = useState<CityPrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const autocompleteService = useRef<any>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load Google SDK on mount
    useEffect(() => {
        if (Platform.OS === 'web') {
            loadGooglePlacesScript()
                .then(() => {
                    autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
                    setSdkLoaded(true);
                })
                .catch(err => console.error('Google Places SDK error:', err));
        }
    }, []);

    const searchCities = useCallback((text: string) => {
        setQuery(text);

        if (!text || text.length < 2) {
            setPredictions([]);
            return;
        }

        if (!sdkLoaded || !autocompleteService.current) {
            return;
        }

        // Debounce the search
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            setLoading(true);

            const request: any = {
                input: text,
                types: ['(cities)'],
            };

            // Add country restriction if provided
            if (countryCode) {
                request.componentRestrictions = { country: countryCode.toLowerCase() };
            }

            autocompleteService.current.getPlacePredictions(request, (results: any[], status: string) => {
                setLoading(false);

                if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && results) {
                    const formattedPredictions: CityPrediction[] = results.slice(0, 5).map((result: any) => ({
                        place_id: result.place_id,
                        main_text: result.structured_formatting?.main_text || result.description.split(',')[0],
                        secondary_text: result.structured_formatting?.secondary_text || '',
                        description: result.description,
                    }));
                    setPredictions(formattedPredictions);
                } else {
                    setPredictions([]);
                }
            });
        }, 300);
    }, [sdkLoaded, countryCode]);

    const selectCity = useCallback((prediction: CityPrediction) => {
        setSelectedCity(prediction.main_text);
        setQuery(prediction.main_text);
        setPredictions([]);
    }, []);

    const clearCity = useCallback(() => {
        setSelectedCity('');
        setQuery('');
        setPredictions([]);
    }, []);

    // Wrap setQuery to also search
    const handleSetQuery = useCallback((text: string) => {
        searchCities(text);
    }, [searchCities]);

    return {
        query,
        setQuery: handleSetQuery,
        predictions,
        loading,
        selectCity,
        clearCity,
        selectedCity,
    };
}
