import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useMedications, RefMedication } from '@/hooks/useReferenceData';

interface MedicationSelectorProps {
    species?: string;
    selectedMedication: RefMedication | null;
    onSelect: (med: RefMedication | null) => void;
    customName?: string;
    onCustomNameChange?: (name: string) => void;
    label?: string;
    error?: string;
}

export default function MedicationSelector({
    species,
    selectedMedication,
    onSelect,
    customName = '',
    onCustomNameChange,
    label = 'Medication Name',
    error,
}: MedicationSelectorProps) {
    const { medications, loading } = useMedications(species);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [useCustom, setUseCustom] = useState(false);

    const filteredMedications = useMemo(() => {
        if (!searchQuery) return medications;
        const query = searchQuery.toLowerCase();
        return medications.filter(
            m => (m.medication_name || m.name || '').toLowerCase().includes(query) ||
                (m.active_ingredient && m.active_ingredient.toLowerCase().includes(query))
        );
    }, [medications, searchQuery]);

    const handleSelect = (med: RefMedication) => {
        onSelect(med);
        setSearchQuery(med.medication_name || med.name || '');
        setShowDropdown(false);
        setUseCustom(false);
    };

    const handleCustom = () => {
        setUseCustom(true);
        onSelect(null);
        setShowDropdown(false);
    };

    if (useCustom) {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter medication name..."
                        placeholderTextColor="#9CA3AF"
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
                style={[styles.selectorButton, error && styles.selectorButtonError] as any}
                onPress={() => setShowDropdown(!showDropdown)}
            >
                <Ionicons name="search" size={18} color="#6B7280" />
                {selectedMedication ? (
                    <View style={styles.selectedRow}>
                        <Text style={styles.selectedText}>{selectedMedication.medication_name}</Text>
                    </View>
                ) : (
                    <Text style={[styles.placeholderText, !searchQuery && { color: '#6B7280' }]}>
                        {searchQuery || "Search medications..."}
                    </Text>
                )}
                <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#6B7280" />
            </TouchableOpacity>

            {showDropdown && (
                <View style={styles.dropdown}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={16} color="#6B7280" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Type to search..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#0A84FF" />
                        </View>
                    ) : filteredMedications.length > 0 ? (
                        <FlashList
                            {...({
                                data: filteredMedications,
                                keyExtractor: (item: any) => item.id,
                                style: styles.list,
                                estimatedItemSize: 60,
                                keyboardShouldPersistTaps: "handled",
                                renderItem: ({ item }: any) => (
                                    <TouchableOpacity
                                        style={styles.listItem}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <View style={styles.itemContent}>
                                            <Text style={styles.itemName}>{item.medication_name || item.name}</Text>
                                            {item.active_ingredient && (
                                                <Text style={styles.itemMeta}>({item.active_ingredient})</Text>
                                            )}
                                            {item.category && (
                                                <Text style={styles.itemCategory}>{item.category}</Text>
                                            )}
                                        </View>
                                        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                                    </TouchableOpacity>
                                ),
                            } as any)}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No medications found.</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.customButton} onPress={handleCustom}>
                        <Ionicons name="add-circle-outline" size={18} color="#2563EB" />
                        <Text style={styles.customButtonText}>Enter custom medication name</Text>
                    </TouchableOpacity>
                </View>
            )}
            {selectedMedication && (selectedMedication.common_uses || selectedMedication.typical_dosage_range) && (
                <View style={styles.descriptionBox}>
                    <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
                    <View style={{ flex: 1 }}>
                        {selectedMedication.common_uses && <Text style={styles.descriptionText}>Uses: {selectedMedication.common_uses}</Text>}
                        {selectedMedication.typical_dosage_range && <Text style={styles.descriptionText}>Dosage: {selectedMedication.typical_dosage_range}</Text>}
                    </View>
                </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16, zIndex: 100 },
    label: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    selectorButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, gap: 12, borderWidth: 1, borderColor: '#E5E7EB' },
    selectorButtonError: { borderColor: '#EF4444' },
    selectedRow: { flex: 1 },
    selectedText: { color: '#111827', fontSize: 16 },
    placeholderText: { flex: 1, fontSize: 16 },
    dropdown: { marginTop: 8, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden', maxHeight: 350, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 10, gap: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    searchInput: { flex: 1, color: '#111827', fontSize: 15 },
    loadingContainer: { padding: 24, alignItems: 'center' },
    list: { maxHeight: 220 },
    listItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    itemContent: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '600', color: '#111827' },
    itemMeta: { fontSize: 13, color: '#6B7280' },
    itemCategory: { fontSize: 11, color: '#9CA3AF', marginTop: 2, textTransform: 'uppercase' },
    emptyContainer: { padding: 24, alignItems: 'center' },
    emptyText: { fontSize: 14, color: '#6B7280' },
    customButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
    customButtonText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
    inputWrapper: { flexDirection: 'row', gap: 8 },
    input: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#111827', fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    switchButton: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
    switchButtonText: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
    errorText: { fontSize: 12, color: '#EF4444', marginTop: 6 },
    descriptionBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#EFF6FF', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#3B82F6' },
    descriptionText: { fontSize: 13, color: '#4B5563', lineHeight: 18 },
});
