// Allergy List Widget
// Displays pet allergies with severity and details

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Allergy } from '@/types/passport';
import { designSystem } from '@/constants/designSystem';

interface AllergyListProps {
    allergies: Allergy[];
    onAdd?: () => void;
    onEdit?: (allergy: Allergy) => void;
    onDelete?: (id: string) => void;
}

export default function AllergyList({
    allergies,
    onAdd,
    onEdit,
    onDelete
}: AllergyListProps) {
    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Allergy",
            `Are you sure you want to delete ${name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete?.(id)
                }
            ]
        );
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'severe': return designSystem.colors.error[500];
            case 'moderate': return designSystem.colors.warning[500];
            case 'mild': return designSystem.colors.success[500];
            default: return designSystem.colors.text.secondary;
        }
    };

    const getSeverityBg = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'severe': return designSystem.colors.error[50];
            case 'moderate': return designSystem.colors.warning[50];
            case 'mild': return designSystem.colors.success[50];
            default: return designSystem.colors.neutral[100];
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>ALLERGIES & ALERTS</Text>
                <Ionicons name="warning-outline" size={20} color={designSystem.colors.warning[500]} />
            </View>

            {allergies.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No allergies recorded</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {allergies.map((allergy) => (
                        <View key={allergy.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.headerLeft}>
                                    <View style={[styles.severityBadge, { backgroundColor: getSeverityBg(allergy.severity) }]}>
                                        <Text style={[styles.severityText, { color: getSeverityColor(allergy.severity) }]}>
                                            {allergy.severity.toUpperCase()}
                                        </Text>
                                    </View>
                                    <Text style={styles.allergenName}>{allergy.allergen}</Text>
                                </View>
                                <Text style={styles.typeText}>{allergy.type}</Text>
                            </View>

                            <View style={styles.details}>
                                <Text style={styles.reactionLabel}>Reaction:</Text>
                                <Text style={styles.reactionText}>{allergy.reactionDescription}</Text>
                            </View>

                            {allergy.notes && (
                                <View style={styles.notesContainer}>
                                    <Text style={styles.notesText}>{allergy.notes}</Text>
                                </View>
                            )}

                            {/* Actions */}
                            {(onEdit || onDelete) && (
                                <View style={styles.actions}>
                                    {onEdit && (
                                        <TouchableOpacity onPress={() => onEdit(allergy)} style={styles.actionButton}>
                                            <Ionicons name="create-outline" size={18} color={designSystem.colors.text.secondary} />
                                        </TouchableOpacity>
                                    )}
                                    {onDelete && (
                                        <TouchableOpacity onPress={() => handleDelete(allergy.id, allergy.allergen)} style={styles.actionButton}>
                                            <Ionicons name="trash-outline" size={18} color={designSystem.colors.status.error[500]} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {onAdd && (
                <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                    <Ionicons name="add" size={18} color={designSystem.colors.primary[500]} />
                    <Text style={styles.addButtonText}>Add Allergy</Text>
                </TouchableOpacity>
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
        marginBottom: designSystem.spacing[4],
        paddingBottom: designSystem.spacing[3],
        borderBottomWidth: 2,
        borderBottomColor: designSystem.colors.warning[500],
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
    },
    list: {
        gap: designSystem.spacing[3],
    },
    card: {
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.md,
        padding: designSystem.spacing[3],
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    severityBadge: {
        paddingHorizontal: designSystem.spacing[1.5],
        paddingVertical: designSystem.spacing[0.5],
        borderRadius: designSystem.borderRadius.xs,
    },
    severityText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    allergenName: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    typeText: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
    },
    details: {
        marginBottom: 8,
    },
    reactionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
    },
    reactionText: {
        fontSize: 13,
        color: designSystem.colors.text.primary,
    },
    notesContainer: {
        backgroundColor: designSystem.colors.background.primary,
        padding: 8,
        borderRadius: 6,
        marginBottom: 8,
    },
    notesText: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
        fontStyle: 'italic',
    },
    actions: { // Added actions container style
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: designSystem.spacing[3],
        marginTop: designSystem.spacing[1],
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.border.primary,
        paddingTop: designSystem.spacing[2],
    },
    actionButton: {
        padding: 4,
    },
    emptyState: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: designSystem.colors.text.tertiary,
        fontStyle: 'italic',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        paddingVertical: 8,
        gap: 4,
    },
    addButtonText: {
        color: designSystem.colors.primary[500],
        fontSize: 14,
        fontWeight: '600',
    },
});
