// Health Dashboard Widget
// Displays overall health score, vital signs (weight, BCS), risks, and recommendations

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { HealthDashboard, PhysicalCharacteristics, WeightEntry } from '@/types/passport';
import { HEALTH_SCORE_COLORS, RISK_LEVEL_COLORS, PRIORITY_COLORS } from '@/types/passport';
import { designSystem } from '@/constants/designSystem';

interface HealthDashboardProps {
    health: HealthDashboard;
    physical?: PhysicalCharacteristics;
    onRecalculate?: () => void;
    onAddMetric?: () => void;
    onAddBCS?: () => void;
}

export default function HealthDashboardWidget({ health, physical, onRecalculate, onAddMetric, onAddBCS }: HealthDashboardProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const scoreColor = HEALTH_SCORE_COLORS[health.overallScore.category];
    const scorePercentage = health.overallScore.score;

    // Helper for trend icon
    const getTrendIcon = (trend?: 'increasing' | 'decreasing' | 'stable') => {
        switch (trend) {
            case 'increasing': return { name: 'trending-up' as const, color: designSystem.colors.error[500] }; // Usually bad for pets unless kitten
            case 'decreasing': return { name: 'trending-down' as const, color: designSystem.colors.success[500] }; // Often good if overweight
            default: return { name: 'remove' as const, color: designSystem.colors.text.tertiary };
        }
    };

    const hasWeightHistory = physical?.weightHistory && physical?.weightHistory.length >= 2;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>HEALTH DASHBOARD</Text>
                {onRecalculate && (
                    <TouchableOpacity onPress={onRecalculate} style={styles.recalculateButton}>
                        <Ionicons name="refresh-outline" size={14} color={designSystem.colors.success[500]} />
                        <Text style={styles.recalculateText}>Update</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Metrics Row: Overall Score, Weight, BCS */}
            <View style={styles.metricsRow}>
                {/* Overall Score Card */}
                <View style={[styles.scoreCard, { borderColor: scoreColor }]}>
                    <Text style={[styles.scoreValue, { color: scoreColor }]}>
                        {health.overallScore.score}
                    </Text>
                    <Text style={styles.scoreLabel}>Health</Text>
                    <Text style={[styles.scoreCategory, { color: scoreColor }]}>
                        {health.overallScore.category.toUpperCase()}
                    </Text>
                </View>

                {/* Weight Card */}
                <TouchableOpacity
                    style={styles.metricCard}
                    onPress={onAddMetric}
                    disabled={!onAddMetric}
                    activeOpacity={0.7}
                >
                    <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>WEIGHT</Text>
                        <Ionicons name="add-circle-outline" size={14} color={onAddMetric ? designSystem.colors.primary[500] : designSystem.colors.text.tertiary} />
                    </View>
                    <View style={styles.metricValueRow}>
                        <Text style={styles.metricValue}>
                            {physical?.weight?.currentKg ? `${physical.weight.currentKg}kg` : '--'}
                        </Text>
                        {physical?.weight?.trend && (
                            <Ionicons
                                name={getTrendIcon(physical.weight.trend).name}
                                size={14}
                                color={getTrendIcon(physical.weight.trend).color}
                            />
                        )}
                    </View>
                    <Text style={styles.metricSubtext} numberOfLines={1}>
                        Target: {physical?.idealWeightMin || '--'}-{physical?.idealWeightMax || '--'}kg
                    </Text>
                </TouchableOpacity>

                {/* BCS Card */}
                <TouchableOpacity
                    style={styles.metricCard}
                    onPress={onAddBCS}
                    disabled={!onAddBCS}
                    activeOpacity={0.7}
                >
                    <View style={styles.metricHeader}>
                        <Text style={styles.metricLabel}>BCS</Text>
                        <Ionicons name="add-circle-outline" size={14} color={onAddBCS ? designSystem.colors.primary[500] : designSystem.colors.text.tertiary} />
                    </View>
                    <View style={styles.metricValueRow}>
                        <Text style={styles.metricValue}>
                            {physical?.bodyConditionScore ? `${physical.bodyConditionScore.score}/9` : '--'}
                        </Text>
                    </View>
                    <Text style={styles.metricSubtext} numberOfLines={1}>
                        {physical?.bodyConditionScore?.category || 'Not set'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Component Scores (Compact) */}
            <View style={styles.componentRow}>
                <CompactScore label="Preventive" score={health.preventiveCareScore.score} />
                <View style={styles.verticalDivider} />
                <CompactScore label="Vaccination" score={health.vaccinationScore.score} />
                <View style={styles.verticalDivider} />
                <CompactScore label="Weight" score={health.weightManagementScore.score} />
            </View>

            {/* Weight History Chart (Conditional) */}
            {hasWeightHistory && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>WEIGHT HISTORY</Text>
                    <View style={styles.chartContainer}>
                        {/* Placeholder for actual chart library */}
                        <View style={styles.chartPlaceholder}>
                            <View style={styles.chartBars}>
                                {physical!.weightHistory.slice(0, 7).map((entry, i) => {
                                    // Simple visualization logic
                                    const maxWeight = Math.max(...physical!.weightHistory.slice(0, 7).map(e => e.weight));
                                    const heightPct = (entry.weight / maxWeight) * 100;
                                    return (
                                        <View key={i} style={styles.barContainer}>
                                            <View style={[styles.bar, { height: `${heightPct}%` }]} />
                                            <Text style={styles.barLabel}>{entry.date.getMonth() + 1}/{entry.date.getDate()}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Health Risks (Compact) */}
            {health.healthRisks && health.healthRisks.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ATTENTION NEEDED</Text>
                    {health.healthRisks.slice(0, 2).map((risk) => (
                        <View key={risk.id} style={[styles.alertCard, { borderLeftColor: RISK_LEVEL_COLORS[risk.riskLevel] }]}>
                            <Text style={styles.alertTitle}>{risk.riskType}</Text>
                            <Text style={styles.alertDesc} numberOfLines={2}>{risk.description}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

function CompactScore({ label, score }: { label: string, score: number }) {
    // Color logic
    let color = designSystem.colors.success[500];
    if (score < 70) color = designSystem.colors.warning[500];
    if (score < 50) color = designSystem.colors.error[500];

    return (
        <View style={styles.compactScore}>
            <Text style={styles.compactLabel}>{label}</Text>
            <Text style={[styles.compactValue, { color }]}>{score}%</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius['2xl'],
        padding: designSystem.spacing[4],
        marginBottom: designSystem.spacing[4],
        ...designSystem.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 12,
        fontWeight: '700',
        color: designSystem.colors.text.secondary,
        letterSpacing: 0.5,
    },
    recalculateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: designSystem.colors.success[50],
        borderRadius: 12,
    },
    recalculateText: {
        fontSize: 11,
        fontWeight: '600',
        color: designSystem.colors.success[500],
    },

    // Metrics Row
    metricsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    scoreCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        minHeight: 80,
    },
    scoreValue: {
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 28,
    },
    scoreLabel: {
        fontSize: 10,
        color: designSystem.colors.text.tertiary,
        marginTop: 2,
    },
    scoreCategory: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 2,
    },
    metricCard: {
        flex: 1,
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: 12,
        padding: 8,
        justifyContent: 'center',
        minHeight: 80,
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: designSystem.colors.text.tertiary,
    },
    metricValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    metricSubtext: {
        fontSize: 9,
        color: designSystem.colors.text.quaternary,
        marginTop: 2,
    },

    // Components
    componentRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: designSystem.colors.border.primary,
        marginBottom: 12,
    },
    compactScore: {
        alignItems: 'center',
    },
    compactLabel: {
        fontSize: 10,
        color: designSystem.colors.text.tertiary,
        marginBottom: 2,
    },
    compactValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    verticalDivider: {
        width: 1,
        height: 20,
        backgroundColor: designSystem.colors.border.primary,
    },

    // Chart
    section: {
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: designSystem.colors.text.tertiary,
        marginBottom: 8,
    },
    chartContainer: {
        height: 100,
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: 8,
        padding: 8,
        justifyContent: 'flex-end',
    },
    chartPlaceholder: {
        flex: 1,
    },
    chartBars: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingBottom: 4,
    },
    barContainer: {
        alignItems: 'center',
        width: 20,
        height: '100%',
        justifyContent: 'flex-end',
        gap: 4
    },
    bar: {
        width: 6,
        backgroundColor: designSystem.colors.primary[300],
        borderRadius: 3,
        minHeight: 4,
    },
    barLabel: {
        fontSize: 8,
        color: designSystem.colors.text.quaternary,
    },

    // Alerts
    alertCard: {
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: 6,
        padding: 8,
        marginBottom: 6,
        borderLeftWidth: 3,
    },
    alertTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
        marginBottom: 2,
    },
    alertDesc: {
        fontSize: 11,
        color: designSystem.colors.text.secondary,
        lineHeight: 14,
    },
});
