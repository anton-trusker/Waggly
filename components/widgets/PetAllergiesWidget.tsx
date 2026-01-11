import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Allergy } from '@/types/v2/schema';

interface PetAllergiesWidgetProps {
    allergies: Allergy[];
    onAdd?: () => void;
    onEdit?: (allergy: Allergy) => void;
    onRemove?: (allergyId: string) => void;
}

export default function PetAllergiesWidget({ allergies, onAdd, onEdit, onRemove }: PetAllergiesWidgetProps) {

    const getSeverityColor = (severity?: string) => {
        const s = severity?.toLowerCase();
        if (s === 'severe' || s === 'high') return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' }; // Red
        if (s === 'moderate' || s === 'medium') return { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C' }; // Orange
        if (s === 'mild' || s === 'low') return { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' }; // Blue
        return { bg: '#FAFAFA', border: '#E5E7EB', text: '#525252' }; // Gray
    };

    const getTypeIcon = (type?: string) => {
        const t = type?.toLowerCase();
        if (t === 'food') return 'restaurant';
        if (t === 'medication' || t === 'drug') return 'medication';
        if (t === 'environment' || t === 'environmental') return 'nature';
        return 'warning';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <IconSymbol android_material_icon_name="warning" size={20} color="#F59E0B" />
                    <Text style={styles.title}>Allergies</Text>
                </View>
                {onAdd && (
                    <TouchableOpacity onPress={onAdd} style={styles.addButton}>
                        <IconSymbol android_material_icon_name="add" size={20} color="#4F46E5" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                {allergies.length > 0 ? (
                    <View style={styles.tagsContainer}>
                        {allergies.map((allergy) => {
                            const name = allergy.name; // V2 uses name
                            const type = allergy.type || 'Unknown';
                            const severity = allergy.severity;
                            const colors = getSeverityColor(severity);

                            return (
                                <Pressable
                                    key={allergy.id}
                                    style={[styles.allergyTag, { backgroundColor: colors.bg, borderColor: colors.border }]}
                                    onPress={() => onEdit?.(allergy)}
                                >
                                    <View style={styles.tagHeader}>
                                        <Text style={[styles.tagName, { color: colors.text }]}>{name}</Text>
                                        {severity && (
                                            <View style={[styles.severityDot, { backgroundColor: colors.text }]} />
                                        )}
                                    </View>
                                    <Text style={styles.tagType}>{type}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No known allergies.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        minHeight: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    allergyTag: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        minWidth: 80,
    },
    tagHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    tagName: {
        fontSize: 14,
        fontWeight: '600',
    },
    severityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    tagType: {
        fontSize: 11,
        color: '#6B7280',
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    emptyState: {
        paddingVertical: 8,
    },
    emptyText: {
        color: '#9CA3AF',
        fontStyle: 'italic',
        fontSize: 14,
    },
});
