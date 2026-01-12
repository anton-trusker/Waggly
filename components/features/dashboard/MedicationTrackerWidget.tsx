import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { Treatment } from '@/types';
import { designSystem } from '@/constants/designSystem';

interface MedicationTrackerWidgetProps {
    medications: Treatment[];
    onMarkGiven?: (id: string) => void;
    onAddNew?: () => void;
    onMedicationPress?: (medication: Treatment) => void;
}

export default function MedicationTrackerWidget({
    medications,
    onMarkGiven,
    onAddNew,
    onMedicationPress,
}: MedicationTrackerWidgetProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const activeMedications = medications.filter(m => m.is_active && m.category === 'Medication');

    // Group by pet
    const medicationsByPet = activeMedications.reduce((acc, med) => {
        if (!acc[med.pet_id]) {
            acc[med.pet_id] = [];
        }
        acc[med.pet_id].push(med);
        return acc;
    }, {} as Record<string, Treatment[]>);

    const formatNextDose = (dateString?: string) => {
        if (!dateString) return 'Not scheduled';
        const date = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date < now) {
            return 'Overdue';
        } else if (date.toDateString() === today.toDateString()) {
            return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        } else {
            const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${daysUntil} days)`;
        }
    };

    const isOverdue = (dateString?: string) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    if (activeMedications.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>💊 Active Medications</Text>
                    <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
                        <Ionicons name="add" size={16} color="#7C3AED" />
                        <Text style={styles.addButtonText}>Add New</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>💊</Text>
                    <Text style={styles.emptyTitle}>No active medications</Text>
                    <Text style={styles.emptySubtitle}>Add medications to track dosing schedules</Text>
                    <TouchableOpacity style={styles.emptyButton} onPress={onAddNew}>
                        <Text style={styles.emptyButtonText}>Add Medication</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>💊 Active Medications</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>{activeMedications.length}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
                    <Ionicons name="add" size={16} color="#7C3AED" />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            >
                {Object.entries(medicationsByPet).map(([petId, meds]) => (
                    <View key={petId} style={styles.petGroup}>
                        {/* Pet name header could be added here if we had pet data */}
                        {meds.map((med) => (
                            <TouchableOpacity
                                key={med.id}
                                style={[
                                    styles.medicationCard,
                                    isOverdue(med.next_due_date || undefined) && styles.medicationCardOverdue,
                                ] as any}
                                onPress={() => onMedicationPress?.(med)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.medicationHeader}>
                                    <View style={styles.medicationIcon}>
                                        <IconSymbol android_material_icon_name="medication" size={20} color="#7C3AED" />
                                    </View>
                                    <View style={styles.medicationInfo}>
                                        <Text style={styles.medicationName}>{med.treatment_name}</Text>
                                        <Text style={styles.medicationDosage}>
                                            {med.dosage_value ? `${med.dosage_value}${med.dosage_unit || ''}` : med.dosage || 'No dosage'}, {med.frequency}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.medicationFooter}>
                                    <View style={styles.nextDoseInfo}>
                                        <Ionicons
                                            name="time-outline"
                                            size={14}
                                            color={isOverdue(med.next_due_date || undefined) ? '#EF4444' : '#6B7280'}
                                        />
                                        <Text
                                            style={[
                                                styles.nextDoseText,
                                                isOverdue(med.next_due_date || undefined) && styles.nextDoseTextOverdue,
                                            ] as any}
                                        >
                                            Next dose: {formatNextDose(med.next_due_date || undefined)}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.markGivenButton}
                                        onPress={() => onMarkGiven?.(med.id)}
                                    >
                                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                        <Text style={styles.markGivenText}>Mark Given</Text>
                                    </TouchableOpacity>
                                </View>

                                {isOverdue(med.next_due_date || undefined) && (
                                    <View style={styles.overdueStrip}>
                                        <Ionicons name="warning" size={12} color="#fff" />
                                        <Text style={styles.overdueStripText}>Overdue</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
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
        ...designSystem.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
    },
    countBadge: {
        backgroundColor: '#7C3AED',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
    },
    countBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#EDE9FE',
    },
    addButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7C3AED',
        fontFamily: 'Plus Jakarta Sans',
    },
    list: {
        maxHeight: 350,
    },
    petGroup: {
        marginBottom: 12,
    },
    medicationCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
        overflow: 'hidden',
    },
    medicationCardOverdue: {
        borderColor: '#FCA5A5',
        backgroundColor: '#FEF2F2',
    },
    medicationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    medicationIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EDE9FE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    medicationInfo: {
        flex: 1,
    },
    medicationName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
        fontFamily: 'Plus Jakarta Sans',
    },
    medicationDosage: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
    },
    medicationFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextDoseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    nextDoseText: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
    },
    nextDoseTextOverdue: {
        color: '#EF4444',
        fontWeight: '600',
    },
    markGivenButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#D1FAE5',
    },
    markGivenText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#10B981',
        fontFamily: 'Plus Jakarta Sans',
    },
    overdueStrip: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomLeftRadius: 8,
    },
    overdueStripText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
        fontFamily: 'Plus Jakarta Sans',
    },
    emptyButton: {
        backgroundColor: '#7C3AED',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    emptyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans',
    },
});
