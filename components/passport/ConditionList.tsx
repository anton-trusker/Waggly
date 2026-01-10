// Condition List Widget
// Displays list of medical conditions

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MedicalCondition } from '@/types/passport';
import { designSystem } from '@/constants/designSystem';

interface ConditionListProps {
    conditions: MedicalCondition[];
    onAdd?: () => void;
    onEdit?: (condition: MedicalCondition) => void;
    onDelete?: (id: string) => void;
}

export default function ConditionList({ conditions, onAdd, onEdit, onDelete }: ConditionListProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const getStatusColor = (status: MedicalCondition['status']) => {
        switch (status) {
            case 'Active': return designSystem.colors.error[500];
            case 'Chronic': return designSystem.colors.warning[500];
            case 'Resolved': return designSystem.colors.success[500];
            case 'Watch': return designSystem.colors.info[500];
            default: return designSystem.colors.text.secondary;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Ionicons name="medkit" size={20} color={designSystem.colors.primary[500]} />
                    <Text style={styles.title}>MEDICAL CONDITIONS</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{conditions.length}</Text>
                    </View>
                </View>
                {onAdd && (
                    <TouchableOpacity onPress={onAdd} style={styles.addButton}>
                        <Ionicons name="add" size={20} color={designSystem.colors.primary[500]} />
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                )}
            </View>

            {conditions.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No known medical conditions.</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {conditions.map((condition) => (
                        <View key={condition.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardTitleRow}>
                                    <Text style={styles.conditionName}>{condition.conditionName}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(condition.status)}15` }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(condition.status) }]}>
                                            {condition.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.actions}>
                                    {onEdit && (
                                        <TouchableOpacity onPress={() => onEdit(condition)} style={styles.actionButton}>
                                            <Ionicons name="pencil" size={16} color={designSystem.colors.text.secondary} />
                                        </TouchableOpacity>
                                    )}
                                    {onDelete && (
                                        <TouchableOpacity onPress={() => onDelete(condition.id)} style={styles.actionButton}>
                                            <Ionicons name="trash-outline" size={16} color={designSystem.colors.error[500]} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            <View style={styles.detailsRow}>
                                <Text style={styles.dateLabel}>Diagnosed:</Text>
                                <Text style={styles.dateValue}>
                                    {condition.diagnosedDate ? condition.diagnosedDate.toLocaleDateString() : 'Unknown'}
                                </Text>
                            </View>

                            {condition.notes && (
                                <Text style={styles.notes} numberOfLines={2}>{condition.notes}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius['2xl'],
        padding: designSystem.spacing[5],
        marginBottom: designSystem.spacing[4],
        ...designSystem.shadows.sm,
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
        fontSize: 14,
        fontWeight: '700',
        color: designSystem.colors.text.secondary,
        letterSpacing: 0.5,
    },
    badge: {
        backgroundColor: designSystem.colors.background.tertiary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: designSystem.colors.text.secondary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.primary[50],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    addButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: designSystem.colors.primary[500],
    },
    emptyState: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: designSystem.colors.text.tertiary,
        fontStyle: 'italic',
    },
    list: {
        gap: 12,
    },
    card: {
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: designSystem.colors.primary[500],
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitleRow: {
        flex: 1,
        gap: 6,
        alignItems: 'flex-start', // Allows wrapping if name is long
    },
    conditionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 6,
    },
    dateLabel: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
    },
    dateValue: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
        fontWeight: '500',
    },
    notes: {
        fontSize: 13,
        color: designSystem.colors.text.secondary,
        fontStyle: 'italic',
    },
});
