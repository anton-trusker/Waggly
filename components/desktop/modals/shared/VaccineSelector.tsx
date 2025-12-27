import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { Ionicons } from '@expo/vector-icons';
import { useVaccines, RefVaccine } from '@/hooks/useReferenceData';

interface VaccineSelectorProps {
    species: string; // 'dog' or 'cat'
    selectedVaccine: RefVaccine | null;
    onSelect: (vaccine: RefVaccine | null) => void;
    customName?: string;
    onCustomNameChange?: (name: string) => void;
    label?: string;
    error?: string;
}

export default function VaccineSelector({
    species,
    selectedVaccine,
    onSelect,
    customName = '',
    onCustomNameChange,
    label = 'Vaccine Name',
    error,
}: VaccineSelectorProps) {
    const { vaccines, loading } = useVaccines(species);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [useCustom, setUseCustom] = useState(false);

    const filteredVaccines = useMemo(() => {
        if (!searchQuery) return vaccines;
        const query = searchQuery.toLowerCase();
        return vaccines.filter(
            v => v.vaccine_name.toLowerCase().includes(query) ||
                v.abbreviation?.toLowerCase().includes(query)
        );
    }, [vaccines, searchQuery]);

    const handleSelect = (vaccine: RefVaccine) => {
        onSelect(vaccine);
        setSearchQuery(vaccine.vaccine_name);
        setShowDropdown(false);
        setUseCustom(false);
    };

    const handleCustom = () => {
        setUseCustom(true);
        onSelect(null);
        setShowDropdown(false);
    };

    const getTypeBadgeColor = (type: string | null) => {
        if (type === 'core') return '#10B981';
        if (type === 'non-core') return '#F59E0B';
        return '#6B7280';
    };

    const getTypeBadgeText = (type: string | null) => {
        if (type === 'core') return 'CORE';
        if (type === 'non-core') return 'NON-CORE';
        return 'OTHER';
    };

    if (useCustom) {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter vaccine name..."
                        placeholderTextColor="#4B5563"
                        value={customName}
                        onChangeText={onCustomNameChange}
                    />
                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => {
                            setUseCustom(false);
                            setSearchQuery('');
                        }}
                    >
                        <Text style={styles.switchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={[styles.selectorButton, error && styles.selectorButtonError]}
                onPress={() => setShowDropdown(!showDropdown)}
            >
                <Ionicons name="search" size={18} color="#9CA3AF" />
                {selectedVaccine ? (
                    <View style={styles.selectedRow}>
                        <Text style={styles.selectedText}>{selectedVaccine.vaccine_name}</Text>
                        {selectedVaccine.vaccine_type && (
                            <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(selectedVaccine.vaccine_type) + '20' }]}>
                                <Text style={[styles.typeBadgeText, { color: getTypeBadgeColor(selectedVaccine.vaccine_type) }]}>
                                    {getTypeBadgeText(selectedVaccine.vaccine_type)}
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <Text style={styles.placeholderText}>Search vaccines...</Text>
                )}
                <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {showDropdown && (
                <View style={styles.dropdown}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={16} color="#9CA3AF" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Type to search..."
                            placeholderTextColor="#4B5563"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#0A84FF" />
                        </View>
                    ) : filteredVaccines.length > 0 ? (
                        <FlashList
                            data={filteredVaccines}
                            keyExtractor={item => item.id}
                            style={styles.list}
                            keyboardShouldPersistTaps="handled"
                            estimatedItemSize={68}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => handleSelect(item)}
                                >
                                    <View style={styles.itemContent}>
                                        <View style={styles.itemHeader}>
                                            <Text style={styles.itemName}>{item.vaccine_name}</Text>
                                            {item.abbreviation && (
                                                <Text style={styles.itemAbbr}>({item.abbreviation})</Text>
                                            )}
                                        </View>
                                        <View style={styles.itemMeta}>
                                            {item.vaccine_type && (
                                                <View style={[styles.typeBadgeSmall, { backgroundColor: getTypeBadgeColor(item.vaccine_type) + '20' }]}>
                                                    <Text style={[styles.typeBadgeTextSmall, { color: getTypeBadgeColor(item.vaccine_type) }]}>
                                                        {getTypeBadgeText(item.vaccine_type)}
                                                    </Text>
                                                </View>
                                            )}
                                            {item.booster_interval && (
                                                <Text style={styles.itemInterval}>Every {item.booster_interval}</Text>
                                            )}
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No vaccines found for {species}</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.customButton} onPress={handleCustom}>
                        <Ionicons name="add-circle-outline" size={18} color="#0A84FF" />
                        <Text style={styles.customButtonText}>Enter custom vaccine name</Text>
                    </TouchableOpacity>
                </View>
            )}

            {selectedVaccine && selectedVaccine.description && (
                <View style={styles.descriptionBox}>
                    <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
                    <Text style={styles.descriptionText}>{selectedVaccine.description}</Text>
                </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        zIndex: 100,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    selectorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    selectorButtonError: {
        borderColor: '#EF4444',
    },
    selectedRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    selectedText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    placeholderText: {
        flex: 1,
        color: '#4B5563',
        fontSize: 16,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeBadgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    dropdown: {
        marginTop: 8,
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#3C3C3E',
        overflow: 'hidden',
        maxHeight: 350,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#3C3C3E',
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
    },
    loadingContainer: {
        padding: 24,
        alignItems: 'center',
    },
    list: {
        maxHeight: 220,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#3C3C3E',
    },
    itemContent: {
        flex: 1,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    itemAbbr: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    typeBadgeSmall: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    typeBadgeTextSmall: {
        fontSize: 9,
        fontWeight: '700',
    },
    itemInterval: {
        fontSize: 12,
        color: '#6B7280',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
    },
    customButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#3C3C3E',
        backgroundColor: '#262628',
    },
    customButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0A84FF',
    },
    descriptionBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#1C1C1E',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#0A84FF',
    },
    descriptionText: {
        flex: 1,
        fontSize: 13,
        color: '#9CA3AF',
        lineHeight: 18,
    },
    inputWrapper: {
        flexDirection: 'row',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    switchButton: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    switchButtonText: {
        color: '#0A84FF',
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 6,
    },
});
