import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface WeightWidgetProps {
    currentWeight?: string;
    trend: 'up' | 'down' | 'stable';
    changePercent?: number;
    loading?: boolean;
}

export function WeightWidget({ currentWeight, trend, changePercent, loading }: WeightWidgetProps) {
    if (loading) {
        return (
            <View style={[styles.container, styles.loading]}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const getTrendColor = () => {
        if (trend === 'stable') return '#10B981';
        return '#6B7280';
    };

    const getTrendIcon = () => {
        if (trend === 'up') return 'trending-up';
        if (trend === 'down') return 'trending-down';
        return 'trending-flat';
    };

    const getTrendIconIOS = () => {
        if (trend === 'up') return 'arrow.up.right';
        if (trend === 'down') return 'arrow.down.right';
        return 'arrow.right';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
                    <IconSymbol android_material_icon_name="monitor-weight" size={18} color="#A855F7" />
                </View>
                <Text style={styles.title}>Weight</Text>
            </View>

            <View style={styles.content}>
                {currentWeight ? (
                    <>
                        <Text style={styles.weightValue}>{currentWeight}</Text>
                        <View style={styles.trendRow}>
                            <IconSymbol
                                android_material_icon_name={getTrendIcon()}
                                ios_icon_name={getTrendIconIOS()}
                                size={14}
                                color={getTrendColor()}
                            />
                            {changePercent !== undefined && changePercent !== 0 && (
                                <Text style={[styles.trendText, { color: getTrendColor() }]}>
                                    {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
                                </Text>
                            )}
                            <Text style={styles.trendLabel}>{trend}</Text>
                        </View>
                    </>
                ) : (
                    <Text style={styles.noDataText}>No weight data</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 12,
        paddingBottom: 14,
        flex: 1,
        minWidth: 140,
        maxWidth: 280,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Plus Jakarta Sans',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    weightValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#A855F7',
        fontFamily: 'Plus Jakarta Sans',
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
    },
    trendLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
        textTransform: 'capitalize',
    },
    noDataText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
        fontFamily: 'Plus Jakarta Sans',
    },
});
