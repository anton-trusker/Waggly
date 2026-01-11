import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MedicationTrackerView } from '@/types';
import { useRouter } from 'expo-router';

interface MedicationWidgetProps {
    medications: MedicationTrackerView[];
    petId: string;
}

export function MedicationWidget({ medications, petId }: MedicationWidgetProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                        <IconSymbol android_material_icon_name="medication" size={24} color="#10B981" />
                    </View>
                    <Text style={styles.title}>Medications</Text>
                </View>
                <Pressable onPress={() => router.push(`/(tabs)/pets/treatment/new?petId=${petId}&type=medication`)}>
                    <Text style={styles.linkText}>+ Add</Text>
                </Pressable>
            </View>

            {/* List */}
            <View style={styles.list}>
                {medications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No active medications.</Text>
                    </View>
                ) : (
                    medications.map((med) => {
                        const needsRefill = med.refill_status === 'refill_needed';
                        return (
                            <View key={med.id} style={[styles.item, needsRefill && styles.itemAlert]}>
                                <View style={styles.iconCol}>
                                    <View style={[styles.medIcon, needsRefill ? styles.medIconAlert : styles.medIconNormal]}>
                                        <IconSymbol android_material_icon_name="pill" size={20} color={needsRefill ? '#EF4444' : '#7C3AED'} />
                                    </View>
                                </View>
                                <View style={styles.contentCol}>
                                    <Text style={styles.medName}>{med.medication_name}</Text>
                                    <Text style={styles.medDose}>{med.dosage_value} {med.dosage_unit} • {med.frequency}</Text>
                                    {needsRefill && (
                                        <View style={styles.refillBadge}>
                                            <IconSymbol android_material_icon_name="warning" size={12} color="#B91C1C" />
                                            <Text style={styles.refillText}>Low Supply</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.daysCol}>
                                    {med.days_remaining !== null && (
                                        <View style={styles.daysBadge}>
                                            <Text style={styles.daysCount}>{med.days_remaining}</Text>
                                            <Text style={styles.daysLabel}>days left</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    linkText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0EA5E9',
    },
    list: {
        gap: 12,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 14,
    },
    item: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        gap: 16,
    },
    itemAlert: {
        borderColor: '#FECACA',
        backgroundColor: '#FEF2F2',
    },
    iconCol: {
        //
    },
    medIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    medIconNormal: {
        backgroundColor: '#F3E8FF',
    },
    medIconAlert: {
        backgroundColor: '#FEE2E2',
    },
    contentCol: {
        flex: 1,
        gap: 4,
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    medDose: {
        fontSize: 14,
        color: '#6B7280',
    },
    refillBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    refillText: {
        fontSize: 12,
        color: '#B91C1C',
        fontWeight: '600',
    },
    daysCol: {
        alignItems: 'flex-end',
    },
    daysBadge: {
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 8,
        borderRadius: 8,
        minWidth: 60,
    },
    daysCount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    daysLabel: {
        fontSize: 10,
        color: '#6B7280',
        textTransform: 'uppercase',
    },
});
