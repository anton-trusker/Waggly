import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface MedicalRecordsWidgetProps {
    vaccinationsUpToDate: boolean;
    activeMedications: number;
    loading?: boolean;
}

export function MedicalRecordsWidget({ vaccinationsUpToDate, activeMedications, loading }: MedicalRecordsWidgetProps) {
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
                <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                    <IconSymbol android_material_icon_name="medical-services" size={18} color="#EF4444" />
                </View>
                <Text style={styles.title}>Medical</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: vaccinationsUpToDate ? '#10B981' : '#F59E0B' }]} />
                    <Text style={styles.statusText}>
                        {vaccinationsUpToDate ? 'Vaccinations current' : 'Vaccines due'}
                    </Text>
                </View>
                <View style={styles.medsRow}>
                    <Text style={styles.medsCount}>{activeMedications}</Text>
                    <Text style={styles.medsLabel}>active medications</Text>
                </View>
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
        gap: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
    },
    medsRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    medsCount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#EF4444',
        fontFamily: 'Plus Jakarta Sans',
    },
    medsLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
    },
});
