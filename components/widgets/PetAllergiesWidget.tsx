import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from ' react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Allergy } from '@/types';

interface PetAllergiesWidgetProps {
    allergies: Allergy[];
    onAdd?: () => void;
    onRemove?: (allergyId: string) => void;
}

export default function PetAllergiesWidget({ allergies, onAdd, onRemove }: PetAllergiesWidgetProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Allergies</Text>
                <TouchableOpacity style={styles.addButtonSmall} onPress={onAdd}>
                    <IconSymbol android_material_icon_name="add" size={16} color="#6366F1" />
                </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
                {allergies.length > 0 ? (
                    allergies.map(a => (
                        <View key={a.id} style={styles.allergyTag}>
                            <Text style={styles.allergyTagText}>{a.name.toUpperCase()}</Text>
                            <TouchableOpacity onPress={() => onRemove?.(a.id)}>
                                <IconSymbol android_material_icon_name="close" size={14} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View style={[styles.allergyTag, { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }]}>
                        <Text style={[styles.allergyTagText, { color: '#6B7280' }]}>NO ALLERGIES</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    addButtonSmall: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    allergyTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    allergyTagText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#EF4444',
        letterSpacing: 0.5,
    },
});
