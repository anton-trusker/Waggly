import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Medication } from '@/types';

interface PetMedicationsWidgetProps {
    medications: Medication[];
    onManage?: () => void;
}

export default function PetMedicationsWidget({ medications, onManage }: PetMedicationsWidgetProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Current Medications</Text>
                <TouchableOpacity onPress={onManage}>
                    <Text style={styles.editLink}>Manage</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                {medications.length > 0 ? (
                    medications.map(med => (
                        <View key={med.id} style={styles.listItem}>
                            <View style={[styles.listIconBox, { backgroundColor: '#E0E7FF' }]}>
                                <IconSymbol android_material_icon_name="medication" size={20} color="#4F46E5" />
                            </View>
                            <View style={styles.listItemContent}>
                                <Text style={styles.listItemTitle}>{med.medication_name}</Text>
                                <Text style={styles.listItemSubtitle}>
                                    {med.dosage_value}{med.dosage_unit} • {med.frequency}
                                </Text>
                            </View>
                            <View style={[styles.badgePill, { backgroundColor: '#6366F1' }]}>
                                <Text style={styles.badgePillText}>DAILY</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No active medications</Text>
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
        flex: 1,
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
    editLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    listIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    listItemSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    badgePill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgePillText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingVertical: 16,
    },
});
