// Treatment Table Widget
// Displays active and historical treatments/medications

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useWindowDimensions, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Treatment } from '@/types/passport';
import { designSystem } from '@/constants/designSystem';

interface TreatmentTableProps {
    treatments: Treatment[];
    onAdd?: () => void;
    onEdit?: (treatment: Treatment) => void;
    onDelete?: (id: string) => void;
}

export default function TreatmentTableWidget({
    treatments,
    onAdd,
    onEdit,
    onDelete
}: TreatmentTableProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const [filter, setFilter] = useState<'active' | 'all'>('active');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter treatments
    const filteredTreatments = treatments.filter(treatment => {
        const matchesFilter = filter === 'all' || (filter === 'active' && treatment.isActive);
        const matchesSearch = treatment.treatmentName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Calculate counts
    const activeCount = treatments.filter(t => t.isActive).length;
    const historicalCount = treatments.filter(t => !t.isActive).length;

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Medication",
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Ionicons name="medical-outline" size={20} color={designSystem.colors.primary[500]} />
                    <Text style={styles.title}>TREATMENTS</Text>
                </View>
                {onAdd && (
                    <TouchableOpacity onPress={onAdd} style={styles.headerAddButton}>
                        <Ionicons name="add" size={20} color={designSystem.colors.primary[500]} />
                        <Text style={styles.headerAddButtonText}>Add</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Summary Cards */}
            <View style={[styles.summaryGrid, isMobile && styles.summaryGridMobile]}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Active</Text>
                    <Text style={styles.summaryValue}>{activeCount}</Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Historical</Text>
                    <Text style={styles.summaryValue}>{historicalCount}</Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total</Text>
                    <Text style={styles.summaryValue}>{treatments.length}</Text>
                </View>
            </View>

            {/* Filters and Search */}
            <View style={[styles.filterRow, isMobile && styles.filterRowMobile]}>
                <View style={styles.filterButtons}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
                        onPress={() => setFilter('active')}
                    >
                        <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
                            Active
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            All
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={18} color={designSystem.colors.text.tertiary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search treatments..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={designSystem.colors.text.tertiary}
                    />
                </View>
            </View>

            {/* Treatment List */}
            {filteredTreatments.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="medical-outline" size={48} color={designSystem.colors.text.tertiary} />
                    <Text style={styles.emptyText}>No treatments found</Text>
                </View>
            ) : (
                <View style={styles.treatmentList}>
                    {filteredTreatments.map((treatment) => (
                        <View
                            key={treatment.id}
                            style={[
                                styles.treatmentCard,
                                !treatment.isActive && styles.treatmentCardInactive,
                            ]}
                        >
                            <View style={styles.treatmentHeader}>
                                <View style={styles.treatmentInfo}>
                                    <View style={styles.statusRow}>
                                        <View style={[
                                            styles.statusDot,
                                            treatment.isActive ? styles.statusDotActive : styles.statusDotInactive,
                                        ]} />
                                        <Text style={styles.treatmentName}>{treatment.treatmentName}</Text>
                                    </View>
                                    <Text style={styles.treatmentCategory}>
                                        ({treatment.category})
                                    </Text>
                                </View>

                                {/* Actions */}
                                {(onEdit || onDelete) && (
                                    <View style={styles.actions}>
                                        {onEdit && (
                                            <TouchableOpacity
                                                onPress={() => onEdit(treatment)}
                                                style={styles.actionButton}
                                            >
                                                <Ionicons name="create-outline" size={20} color={designSystem.colors.text.secondary} />
                                            </TouchableOpacity>
                                        )}
                                        {onDelete && (
                                            <TouchableOpacity
                                                onPress={() => handleDelete(treatment.id, treatment.treatmentName)}
                                                style={styles.actionButton}
                                            >
                                                <Ionicons name="trash-outline" size={20} color={designSystem.colors.status.error[500]} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>

                            <View style={styles.dosageInfo}>
                                <View style={styles.dosageRow}>
                                    <Ionicons name="water-outline" size={16} color={designSystem.colors.text.secondary} />
                                    <Text style={styles.dosageText}>
                                        {treatment.dosage}, {treatment.frequency}
                                    </Text>
                                </View>
                                {treatment.timeOfDay && (
                                    <Text style={styles.timeOfDay}>
                                        {treatment.timeOfDay}
                                    </Text>
                                )}
                                {treatment.withFood !== undefined && (
                                    <Text style={styles.withFood}>
                                        {treatment.withFood ? '🍽️ With food' : '⚠️ On empty stomach'}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.treatmentDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Started:</Text>
                                    <Text style={styles.detailValue}>
                                        {treatment.startDate.toLocaleDateString()}
                                    </Text>
                                </View>

                                {treatment.endDate && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>
                                            {treatment.isActive ? 'Ends:' : 'Ended:'}
                                        </Text>
                                        <Text style={styles.detailValue}>
                                            {treatment.endDate.toLocaleDateString()}
                                        </Text>
                                    </View>
                                )}

                                {treatment.prescribedBy && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Prescribed by:</Text>
                                        <Text style={styles.detailValue}>
                                            {treatment.prescribedBy}
                                        </Text>
                                    </View>
                                )}

                                {treatment.refillsRemaining !== undefined && treatment.refillsRemaining !== null && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Refills:</Text>
                                        <Text style={[
                                            styles.detailValue,
                                            treatment.refillsRemaining === 0 && styles.refillsLow,
                                        ]}>
                                            {treatment.refillsRemaining} remaining
                                        </Text>
                                    </View>
                                )}

                                {treatment.sideEffects && treatment.sideEffects.length > 0 && (
                                    <View style={styles.sideEffectsContainer}>
                                        <Text style={styles.sideEffectsLabel}>Side effects:</Text>
                                        <Text style={styles.sideEffectsText}>
                                            {treatment.sideEffects.join(', ')}
                                        </Text>
                                    </View>
                                )}

                                {treatment.specialInstructions && (
                                    <View style={styles.instructionsContainer}>
                                        <Ionicons name="information-circle-outline" size={14} color={designSystem.colors.primary[500]} />
                                        <Text style={styles.instructionsText}>
                                            {treatment.specialInstructions}
                                        </Text>
                                    </View>
                                )}

                                {treatment.notes && (
                                    <View style={styles.instructionsContainer}>
                                        <Text style={styles.instructionsText}>
                                            Notes: {treatment.notes}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Bottom Add Button removed - moved to header */}
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
    headerTitleRow: {
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

    // Summary Cards
    summaryGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    summaryGridMobile: {
        flexDirection: 'row', // Force single row on mobile
        gap: 8,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.sm,
        padding: designSystem.spacing[3],
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
    },

    // Filters
    filterRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    filterRowMobile: {
        flexDirection: 'column',
    },
    filterButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: designSystem.spacing[3],
        paddingVertical: designSystem.spacing[2],
        borderRadius: designSystem.borderRadius.sm,
        backgroundColor: designSystem.colors.background.tertiary,
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
    },
    filterButtonActive: {
        backgroundColor: designSystem.colors.primary[500],
        borderColor: designSystem.colors.primary[500],
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
    },
    filterTextActive: {
        color: designSystem.colors.text.inverse,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[2],
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.sm,
        paddingHorizontal: designSystem.spacing[3],
        paddingVertical: designSystem.spacing[2],
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: designSystem.colors.text.primary,
    },

    // Treatment List
    treatmentList: {
        gap: 12,
    },
    treatmentCard: {
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.sm,
        padding: designSystem.spacing[3],
        borderLeftWidth: 4,
        borderLeftColor: designSystem.colors.primary[500],
    },
    treatmentCardInactive: {
        opacity: 0.6,
        borderLeftColor: designSystem.colors.neutral[400],
    },
    treatmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    treatmentInfo: {
        flex: 1,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusDotActive: {
        backgroundColor: designSystem.colors.status.success[500],
    },
    statusDotInactive: {
        backgroundColor: designSystem.colors.neutral[400],
    },
    treatmentName: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    treatmentCategory: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
        marginLeft: 16, // Indent to align with text
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 4,
    },

    // Dosage Info
    dosageInfo: {
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
        gap: 4,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[100],
    },
    dosageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dosageText: {
        fontSize: 13,
        fontWeight: '500',
        color: designSystem.colors.text.primary,
    },
    timeOfDay: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
        marginLeft: 22,
    },
    withFood: {
        fontSize: 11,
        color: designSystem.colors.text.secondary,
        marginLeft: 22,
    },

    // Treatment Details
    treatmentDetails: {
        gap: 6,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailLabel: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
    },
    detailValue: {
        fontSize: 12,
        fontWeight: '500',
        color: designSystem.colors.text.primary,
    },
    refillsLow: {
        color: designSystem.colors.error[500],
        fontWeight: '600',
    },
    sideEffectsContainer: {
        marginTop: designSystem.spacing[2],
        padding: designSystem.spacing[2],
        backgroundColor: designSystem.colors.warning[50],
        borderRadius: designSystem.borderRadius.xs,
    },
    sideEffectsLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: designSystem.colors.warning[700],
        marginBottom: designSystem.spacing[0.5],
    },
    sideEffectsText: {
        fontSize: 11,
        color: designSystem.colors.warning[700],
    },
    instructionsContainer: {
        flexDirection: 'row',
        gap: designSystem.spacing[1.5],
        marginTop: designSystem.spacing[2],
        padding: designSystem.spacing[2],
        backgroundColor: designSystem.colors.primary[50],
        borderRadius: designSystem.borderRadius.xs,
    },
    instructionsText: {
        flex: 1,
        fontSize: 11,
        color: designSystem.colors.primary[700],
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 14,
        color: designSystem.colors.text.tertiary,
        marginTop: 8,
    },

    // Add Button in Header
    headerAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.primary[50],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    headerAddButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: designSystem.colors.primary[500],
    },
});
