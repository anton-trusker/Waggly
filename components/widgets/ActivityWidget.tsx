import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface ActivityWidgetProps {
    activityCount: number;
    latestActivity?: string;
    loading?: boolean;
}

export function ActivityWidget({ activityCount, latestActivity, loading }: ActivityWidgetProps) {
    if (loading) {
        return (
            <View style={[styles.container, styles.loading]}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
                    <IconSymbol android_material_icon_name="timeline" size={18} color="#3B82F6" />
                </View>
                <Text style={styles.title}>Activity</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.countValue}>{activityCount}</Text>
                <Text style={styles.countLabel}>events this week</Text>
                {latestActivity && (
                    <Text style={styles.latestText} numberOfLines={1}>{latestActivity}</Text>
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
    countValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#3B82F6',
        fontFamily: 'Plus Jakarta Sans',
    },
    countLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
        marginTop: 2,
    },
    latestText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontStyle: 'italic',
        fontFamily: 'Plus Jakarta Sans',
        marginTop: 8,
    },
});
