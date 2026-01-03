import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { HealthDashboardSummary } from '@/types';

interface QuickVitalsProps {
    summary: HealthDashboardSummary['weight_summary'] | undefined;
}

export function QuickVitalsWidget({ summary }: QuickVitalsProps) {
    // Format weight
    const weightDisplay = summary?.current ? `${summary.current} kg` : 'Add Data';

    // Format trend
    const getTrendIcon = (trend: string | null | undefined) => {
        if (trend === 'increasing') return 'arrow-upward';
        if (trend === 'decreasing') return 'arrow-downward';
        return 'remove'; // stable or null
    };
    const trendColor = summary?.trend === 'increasing' ? '#EF4444' : summary?.trend === 'decreasing' ? '#16A34A' : '#6B7280'; // Assuming weight loss is generally good for pets, but could be bad. Neutral for now? Let's use standard logic or context.
    // Actually, for pets, "stable" is usually best unless on a diet. Let's stick to neutral colors for trend arrows unless specifically flagged.

    return (
        <View style={styles.container}>
            {/* Weight Card */}
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.label}>Weight</Text>
                    <IconSymbol android_material_icon_name="monitor-weight" size={16} color="#6B7280" />
                </View>
                <View style={styles.valueRow}>
                    <Text style={styles.valueText}>{weightDisplay}</Text>
                    {summary?.current && (
                        <IconSymbol
                            android_material_icon_name={getTrendIcon(summary.trend)}
                            size={16}
                            color={trendColor}
                        />
                    )}
                </View>
                <Text style={styles.dateText}>
                    {summary?.last_measured ? new Date(summary.last_measured).toLocaleDateString() : 'No recent entry'}
                </Text>
            </View>



            {/* Activity Placeholder */}
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.label}>Activity</Text>
                    <IconSymbol android_material_icon_name="directions-run" size={16} color="#6B7280" />
                </View>
                <View style={styles.valueRow}>
                    <Text style={styles.valueText}>Normal</Text>
                </View>
                <Text style={styles.dateText}>Last 7 days</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
        minHeight: 100,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    valueText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    dateText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
});
