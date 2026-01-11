// Vaccination Table Widget
// Displays vaccination history with compliance tracking and status

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useWindowDimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Vaccination, VaccinationCompliance } from '@/types/passport';
import { designSystem } from '@/constants/designSystem';

interface VaccinationTableProps {
    vaccinations: Vaccination[];
    compliance: VaccinationCompliance;
    onAdd?: () => void;
    onEdit?: (vaccination: Vaccination) => void;
    onDelete?: (id: string) => void;
}

export default function VaccinationTableWidget({
    vaccinations,
    compliance,
    onAdd,
    onEdit,
    onDelete
}: VaccinationTableProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const [filter, setFilter] = useState<'all' | 'core' | 'non-core'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter vaccinations
    const filteredVaccinations = vaccinations.filter(vac => {
        const matchesFilter = filter === 'all' || vac.category === filter;
        const matchesSearch = vac.vaccineName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Get status color
    const getStatusColor = (vaccination: Vaccination) => {
        if (vaccination.status.isOverdue) return designSystem.colors.status.error[500];
        if (vaccination.status.daysUntilDue && vaccination.status.daysUntilDue <= 30) return designSystem.colors.status.warning[500];
        return designSystem.colors.status.success[500];
    };

    // Get status icon
    const getStatusIcon = (vaccination: Vaccination) => {
        if (vaccination.status.isOverdue) return 'alert-circle';
        if (vaccination.status.daysUntilDue && vaccination.status.daysUntilDue <= 30) return 'time-outline';
        return 'checkmark-circle';
    };

    // Get status text
    const getStatusText = (vaccination: Vaccination) => {
        if (vaccination.status.isOverdue) {
            return `OVERDUE (${vaccination.status.daysOverdue}d)`;
        }
        if (vaccination.status.daysUntilDue && vaccination.status.daysUntilDue <= 30) {
            return `Due Soon (${vaccination.status.daysUntilDue}d)`;
        }
        return 'Current';
    };

    // Get compliance color
    const getComplianceColor = () => {
        if (compliance.compliancePercentage >= 90) return designSystem.colors.status.success[500];
        if (compliance.compliancePercentage >= 70) return designSystem.colors.status.warning[500];
        return designSystem.colors.status.error[500];
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Vaccination",
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
                <Text style={styles.title}>VACCINATION HISTORY</Text>
                <Ionicons name="medical" size={20} color={designSystem.colors.primary[500]} />
            </View>

            {/* Compliance Summary */}
            <View style={[styles.complianceGrid, isMobile && styles.complianceGridMobile]}>
                <View style={styles.complianceCard}>
                    <Text style={styles.complianceLabel}>Compliance</Text>
                    <Text style={[styles.complianceValue, { color: getComplianceColor() }]}>
                        {compliance.compliancePercentage}%
                    </Text>
                    <Text style={styles.complianceSubtext}>
                        ({compliance.currentVaccinations}/{compliance.totalVaccinations} current)
                    </Text>
                </View>

                <View style={styles.complianceCard}>
                    <Text style={styles.complianceLabel}>Overdue</Text>
                    <Text style={[styles.complianceValue, styles.overdueValue]}>
                        {compliance.overdueCount}
                    </Text>
                </View>

                <View style={styles.complianceCard}>
                    <Text style={styles.complianceLabel}>Due Soon</Text>
                    <Text style={[styles.complianceValue, styles.dueSoonValue]}>
                        {compliance.dueSoonCount}
                    </Text>
                </View>
            </View>

            {/* Filters and Search */}
            <View style={[styles.filterRow, isMobile && styles.filterRowMobile]}>
                <View style={styles.filterButtons}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive] as any}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'core' && styles.filterButtonActive] as any}
                        onPress={() => setFilter('core')}
                    >
                        <Text style={[styles.filterText, filter === 'core' && styles.filterTextActive]}>
                            Core
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'non-core' && styles.filterButtonActive] as any}
                        onPress={() => setFilter('non-core')}
                    >
                        <Text style={[styles.filterText, filter === 'non-core' && styles.filterTextActive]}>
                            Non-Core
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={18} color={designSystem.colors.text.tertiary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search vaccines..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={designSystem.colors.text.tertiary}
                    />
                </View>
            </View>

            {/* Vaccination List */}
            {filteredVaccinations.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="medical-outline" size={48} color={designSystem.colors.text.tertiary} />
                    <Text style={styles.emptyText}>No vaccinations found</Text>
                </View>
            ) : (
                <View style={styles.vaccinationList}>
                    {filteredVaccinations.map((vaccination) => (
                        <View
                            key={vaccination.id}
                            style={[
                                styles.vaccinationCard,
                                { borderLeftColor: getStatusColor(vaccination) },
                            ] as any}
                        >
                            <View style={styles.vaccinationHeader}>
                                <View style={styles.vaccinationInfo}>
                                    <Text style={styles.vaccineName}>{vaccination.vaccineName}</Text>
                                    <Text style={styles.vaccineCategory}>({vaccination.category})</Text>
                                </View>
                                <View style={styles.headerRight}>
                                    <View style={[
                                        styles.statusBadge,
                                        { backgroundColor: `${getStatusColor(vaccination)}20` },
                                    ]}>
                                        <Ionicons
                                            name={getStatusIcon(vaccination) as any}
                                            size={14}
                                            color={getStatusColor(vaccination)}
                                        />
                                        <Text style={[
                                            styles.statusText,
                                            { color: getStatusColor(vaccination) },
                                        ]}>
                                            {getStatusText(vaccination)}
                                        </Text>
                                    </View>

                                    {/* Actions */}
                                    {(onEdit || onDelete) && (
                                        <View style={styles.actions}>
                                            {onEdit && (
                                                <TouchableOpacity
                                                    onPress={() => onEdit(vaccination)}
                                                    style={styles.actionButton}
                                                >
                                                    <Ionicons name="create-outline" size={20} color={designSystem.colors.text.secondary} />
                                                </TouchableOpacity>
                                            )}
                                            {onDelete && (
                                                <TouchableOpacity
                                                    onPress={() => handleDelete(vaccination.id, vaccination.vaccineName)}
                                                    style={styles.actionButton}
                                                >
                                                    <Ionicons name="trash-outline" size={20} color={designSystem.colors.status.error[500]} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.vaccinationDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Date Given:</Text>
                                    <Text style={styles.detailValue}>
                                        {vaccination.dateGiven.toLocaleDateString()}
                                    </Text>
                                </View>

                                {vaccination.nextDueDate && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Next Due:</Text>
                                        <Text style={styles.detailValue}>
                                            {vaccination.nextDueDate.toLocaleDateString()}
                                        </Text>
                                    </View>
                                )}

                                {vaccination.administeringVet && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Veterinarian:</Text>
                                        <Text style={styles.detailValue}>
                                            {vaccination.administeringVet}
                                        </Text>
                                    </View>
                                )}

                                {vaccination.lotNumber && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Lot #:</Text>
                                        <Text style={[styles.detailValue, styles.monospace]}>
                                            {vaccination.lotNumber}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Add Button */}
            {onAdd && (
                <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                    <Ionicons name="add-circle-outline" size={20} color={designSystem.colors.primary[500]} />
                    <Text style={styles.addButtonText}>Add Vaccination Record</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: designSystem.colors.primary[500],
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
    },

    // Compliance Summary
    complianceGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    complianceGridMobile: {
        flexDirection: 'column',
    },
    complianceCard: {
        flex: 1,
        backgroundColor: designSystem.colors.neutral[50], // f8fafc
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    complianceLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 4,
    },
    complianceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    complianceSubtext: {
        fontSize: 10,
        color: designSystem.colors.text.tertiary,
    },
    overdueValue: {
        color: designSystem.colors.status.error[500],
    },
    dueSoonValue: {
        color: designSystem.colors.status.warning[500],
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
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: designSystem.colors.neutral[50],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
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
        color: '#ffffff',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: designSystem.colors.neutral[50],
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: designSystem.colors.text.primary,
    },

    // Vaccination List
    vaccinationList: {
        gap: 12,
    },
    vaccinationCard: {
        backgroundColor: designSystem.colors.neutral[50],
        borderRadius: 8,
        padding: 12,
        borderLeftWidth: 4,
    },
    vaccinationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    vaccinationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    vaccineName: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    vaccineCategory: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
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
    vaccinationDetails: {
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
    monospace: {
        fontFamily: 'monospace',
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

    // Add Button
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: designSystem.colors.primary[50],
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
        borderWidth: 1,
        borderColor: designSystem.colors.primary[500],
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.primary[500],
    },
});
