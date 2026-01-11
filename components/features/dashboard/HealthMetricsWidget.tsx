import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { HealthMetrics } from '@/hooks/useHealthMetrics';
import { designSystem } from '@/constants/designSystem';

interface HealthMetricsWidgetProps {
    metrics: HealthMetrics;
    loading?: boolean;
}

export default function HealthMetricsWidget({ metrics, loading = false }: HealthMetricsWidgetProps) {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const getVaccinationStatus = () => {
        if (metrics.vaccinations.overdue > 0) {
            return { color: '#EF4444', label: 'Overdue', icon: 'warning' };
        }
        if (metrics.vaccinations.dueSoon > 0) {
            return { color: '#F59E0B', label: 'Due Soon', icon: 'schedule' };
        }
        return { color: '#10B981', label: 'Current', icon: 'check-circle' };
    };

    const getWeightTrendIcon = () => {
        switch (metrics.weight.trend) {
            case 'gaining':
                return 'trending-up';
            case 'losing':
                return 'trending-down';
            case 'stable':
                return 'trending-flat';
            default:
                return 'help';
        }
    };

    const getWeightTrendColor = () => {
        switch (metrics.weight.trend) {
            case 'gaining':
                return '#3B82F6';
            case 'losing':
                return '#F59E0B';
            case 'stable':
                return '#10B981';
            default:
                return '#6B7280';
        }
    };

    const vaccinationStatus = getVaccinationStatus();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>💚 Health Metrics</Text>

            <View style={[styles.grid, isMobile && styles.gridMobile]}>
                {/* Vaccination Status */}
                <TouchableOpacity
                    style={styles.metricCard}
                    onPress={() => router.push('/(tabs)/health' as any)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconBadge, { backgroundColor: `${vaccinationStatus.color}20` }]}>
                        <IconSymbol
                            android_material_icon_name={vaccinationStatus.icon as any}
                            size={24}
                            color={vaccinationStatus.color}
                        />
                    </View>
                    <Text style={styles.metricLabel}>Vaccinations</Text>
                    <Text style={styles.metricValue}>
                        {metrics.vaccinations.current}/{metrics.vaccinations.total} Current
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${metrics.vaccinations.percentage}%`,
                                    backgroundColor: vaccinationStatus.color,
                                },
                            ] as any}
                        />
                    </View>
                    <Text style={[styles.metricStatus, { color: vaccinationStatus.color }]}>
                        {vaccinationStatus.label}
                    </Text>
                </TouchableOpacity>

                {/* Active Medications */}
                <TouchableOpacity
                    style={styles.metricCard}
                    onPress={() => router.push('/(tabs)/health' as any)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconBadge, { backgroundColor: '#EDE9FE' }]}>
                        <IconSymbol android_material_icon_name="medication" size={24} color="#7C3AED" />
                    </View>
                    <Text style={styles.metricLabel}>Medications</Text>
                    <Text style={styles.metricValue}>{metrics.medications.active} Active</Text>
                    <View style={styles.medicationList}>
                        {Object.entries(metrics.medications.byPet).slice(0, 2).map(([petId, count]) => (
                            <View key={petId} style={styles.medicationItem}>
                                <View style={styles.medicationDot} />
                                <Text style={styles.medicationText}>{count} med{count > 1 ? 's' : ''}</Text>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.viewAllButton}>
                        <Text style={styles.viewAllText}>View All</Text>
                        <Ionicons name="chevron-forward" size={14} color="#7C3AED" />
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* Weight Trends */}
                <TouchableOpacity
                    style={styles.metricCard}
                    onPress={() => router.push('/(tabs)/health' as any)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconBadge, { backgroundColor: `${getWeightTrendColor()}20` }]}>
                        <IconSymbol
                            android_material_icon_name={getWeightTrendIcon() as any}
                            size={24}
                            color={getWeightTrendColor()}
                        />
                    </View>
                    <Text style={styles.metricLabel}>Weight</Text>
                    <Text style={styles.metricValue}>
                        {metrics.weight.trend === 'unknown' ? 'No Data' : metrics.weight.trend.charAt(0).toUpperCase() + metrics.weight.trend.slice(1)}
                    </Text>
                    {metrics.weight.lastWeight && (
                        <Text style={styles.metricSubtext}>
                            {metrics.weight.lastWeight} {metrics.weight.unit}
                        </Text>
                    )}
                    {metrics.weight.change > 0 && (
                        <Text style={[styles.metricChange, { color: getWeightTrendColor() }]}>
                            {metrics.weight.trend === 'gaining' ? '+' : '-'}
                            {metrics.weight.change.toFixed(1)} {metrics.weight.unit}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Last Checkup */}
                <TouchableOpacity
                    style={styles.metricCard}
                    onPress={() => router.push('/(tabs)/health' as any)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconBadge, { backgroundColor: '#F3F4F6' }]}>
                        <IconSymbol android_material_icon_name="health-and-safety" size={24} color="#6B7280" />
                    </View>
                    <Text style={styles.metricLabel}>Checkups</Text>
                    <Text style={styles.metricValue}>
                        {metrics.checkups.daysSinceLastVisit} days ago
                    </Text>
                    {metrics.checkups.nextDueDate && (
                        <Text style={styles.metricSubtext}>
                            Next: {metrics.checkups.isOverdue ? 'Overdue' : `${metrics.checkups.daysUntilNext} days`}
                        </Text>
                    )}
                    {metrics.checkups.isOverdue && (
                        <View style={styles.overdueBadge}>
                            <Ionicons name="warning" size={12} color="#EF4444" />
                            <Text style={styles.overdueText}>Overdue</Text>
                        </View>
                    )}
                </TouchableOpacity>
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
        ...designSystem.shadows.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
        fontFamily: 'Plus Jakarta Sans',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridMobile: {
        flexDirection: 'column',
    },
    metricCard: {
        flex: 1,
        minWidth: 150,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    metricLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    metricValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        fontFamily: 'Plus Jakarta Sans',
    },
    metricSubtext: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    metricStatus: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
    metricChange: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    medicationList: {
        gap: 4,
        marginBottom: 8,
    },
    medicationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    medicationDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#7C3AED',
    },
    medicationText: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7C3AED',
        fontFamily: 'Plus Jakarta Sans',
    },
    overdueBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    overdueText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#EF4444',
        fontFamily: 'Plus Jakarta Sans',
    },
});
