import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface AppointmentsWidgetProps {
    upcomingCount: number;
    nextDate?: string;
    loading?: boolean;
}

export function AppointmentsWidget({ upcomingCount, nextDate, loading }: AppointmentsWidgetProps) {
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
                <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                    <IconSymbol android_material_icon_name="event" size={18} color="#F59E0B" />
                </View>
                <Text style={styles.title}>Appointments</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.countValue}>{upcomingCount}</Text>
                <Text style={styles.countLabel}>upcoming</Text>
                {nextDate && (
                    <View style={styles.nextBadge}>
                        <Text style={styles.nextText}>Next: {nextDate}</Text>
                    </View>
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
        color: '#F59E0B',
        fontFamily: 'Plus Jakarta Sans',
    },
    countLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
        marginTop: 2,
    },
    nextBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    nextText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#D97706',
        fontFamily: 'Plus Jakarta Sans',
    },
});
