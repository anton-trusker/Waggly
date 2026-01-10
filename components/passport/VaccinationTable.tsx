// Vaccination Table Widget
// Displays vaccination history with compliance tracking and status

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Vaccination, VaccinationCompliance } from '@/types/passport';
import { designSystem } from '@/constants/designSystem';

interface VaccinationTableProps {
    vaccinations: Vaccination[];
    compliance: VaccinationCompliance;
    onAdd?: () => void;
}

export default function VaccinationTableWidget({
    vaccinations,
    compliance,
    onAdd
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
        if (vaccination.status.isOverdue) return designSystem.colors.error[500];
        if (vaccination.status.daysUntilDue && vaccination.status.daysUntilDue <= 30) return designSystem.colors.warning[500];
        return designSystem.colors.success[500];
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
        if (compliance.compliancePercentage >= 90) return designSystem.colors.success[500];
        if (compliance.compliancePercentage >= 70) return designSystem.colors.warning[500];
        return designSystem.colors.error[500];
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Ionicons name="shield-checkmark" size={20} color={designSystem.colors.success[500]} />
                    <Text style={styles.title}>VACCINATIONS</Text>
                </View>
                {onAdd && (
                    <TouchableOpacity onPress={onAdd} style={styles.headerAddButton}>
                        <Ionicons name="add" size={20} color={designSystem.colors.success[500]} />
                        <Text style={styles.headerAddButtonText}>Add</Text>
                    </TouchableOpacity>
                )}
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
                        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'core' && styles.filterButtonActive]}
                        onPress={() => setFilter('core')}
                    >
                        <Text style={[styles.filterText, filter === 'core' && styles.filterTextActive]}>
                            Core
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'non-core' && styles.filterButtonActive]}
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
                        placeholderTextColor={designSystem.colors.text.quaternary}
                    />
                </View>
            </View>

            {/* Vaccination List */}
            {filteredVaccinations.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="medical-outline" size={48} color={designSystem.colors.text.quaternary} />
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
                            ]}
                        >
                            <View style={styles.vaccinationHeader}>
                                <View style={styles.vaccinationInfo}>
                                    <Text style={styles.vaccineName}>{vaccination.vaccineName}</Text>
                                    <Text style={styles.vaccineCategory}>({vaccination.category})</Text>
                                </View>
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
        marginBottom: designSystem.spacing[4],
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

    // Compliance Summary
    complianceGrid: {
        flexDirection: 'row',
        gap: designSystem.spacing[3],
        marginBottom: designSystem.spacing[4],
    },
    complianceGridMobile: {
        flexDirection: 'row', // Force single row on mobile
        gap: 8,
    },
    complianceCard: {
        flex: 1,
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.sm,
        padding: designSystem.spacing[3],
        alignItems: 'center',
    },
    complianceLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: designSystem.spacing[1],
    },
    complianceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: designSystem.spacing[0.5],
    },
    complianceSubtext: {
        fontSize: 10,
        color: designSystem.colors.text.tertiary,
    },
    overdueValue: {
        color: designSystem.colors.error[500],
    },
    dueSoonValue: {
        color: designSystem.colors.warning[500],
    },

    // Filters
    filterRow: {
        flexDirection: 'row',
        gap: designSystem.spacing[3],
        marginBottom: designSystem.spacing[4],
    },
    filterRowMobile: {
        flexDirection: 'column',
    },
    filterButtons: {
        flexDirection: 'row',
        gap: designSystem.spacing[2],
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
        backgroundColor: designSystem.colors.success[500],
        borderColor: designSystem.colors.success[500],
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

    // Vaccination List
    vaccinationList: {
        gap: designSystem.spacing[3],
    },
    vaccinationCard: {
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.sm,
        padding: designSystem.spacing[3],
        borderLeftWidth: 4,
    },
    vaccinationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: designSystem.spacing[3],
    },
    vaccinationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[2],
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
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[1],
        paddingHorizontal: designSystem.spacing[2],
        paddingVertical: designSystem.spacing[1],
        borderRadius: designSystem.borderRadius.full,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    vaccinationDetails: {
        gap: designSystem.spacing[1.5],
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
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        padding: designSystem.spacing[8],
    },
    emptyText: {
        fontSize: 14,
        color: designSystem.colors.text.tertiary,
        marginTop: designSystem.spacing[2],
    },

    // Add Button in Header
    headerAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.success[50],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    headerAddButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: designSystem.colors.success[500],
    },
});
