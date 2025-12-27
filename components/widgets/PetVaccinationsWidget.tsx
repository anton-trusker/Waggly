import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Vaccination } from '@/types';

interface PetVaccinationsWidgetProps {
    vaccinations: Vaccination[];
    onSeeAll?: () => void;
}

export default function PetVaccinationsWidget({ vaccinations, onSeeAll }: PetVaccinationsWidgetProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Vaccinations</Text>
                <TouchableOpacity onPress={onSeeAll}>
                    <Text style={styles.editLink}>See All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                {vaccinations.length > 0 ? (
                    vaccinations.map(vac => (
                        <View key={vac.id} style={styles.listItem}>
                            <View style={[styles.listIconBox, { backgroundColor: '#D1FAE5' }]}>
                                <IconSymbol android_material_icon_name="vaccines" size={20} color="#059669" />
                            </View>
                            <View style={styles.listItemContent}>
                                <Text style={styles.listItemTitle}>{vac.vaccine_name}</Text>
                                <Text style={styles.listItemSubtitle}>
                                    {vac.next_due_date ? new Date(vac.next_due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date'}
                                </Text>
                            </View>
                            <View style={[styles.badgePill, { backgroundColor: '#10B981' }]}>
                                <Text style={styles.badgePillText}>ACTIVE</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No active vaccinations</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    editLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    listIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    listItemSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    badgePill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgePillText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingVertical: 16,
    },
});
