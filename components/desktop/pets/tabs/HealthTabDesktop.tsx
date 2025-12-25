import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAllergies } from '@/hooks/useAllergies';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import AllergyModal from '@/components/desktop/modals/AllergyModal';
import WeightModal from '@/components/desktop/modals/WeightModal';

interface HealthTabProps {
    petId: string;
}

export default function HealthTabDesktop({ petId }: HealthTabProps) {
    const { allergies, loading: allergiesLoading } = useAllergies(petId);
    const { weightEntries, loading: weightLoading } = useWeightEntries(petId);

    const [allergyModalVisible, setAllergyModalVisible] = useState(false);
    const [weightModalVisible, setWeightModalVisible] = useState(false);

    // Get latest weight
    const currentWeight = weightEntries[0];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Quick Actions Row */}
            <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setAllergyModalVisible(true)}>
                    <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
                    <Text style={styles.actionButtonText}>Add Allergy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => setWeightModalVisible(true)}>
                    <Ionicons name="scale-outline" size={20} color="#10B981" />
                    <Text style={styles.actionButtonText}>Log Weight</Text>
                </TouchableOpacity>
            </View>

            {/* Metrics Grid */}
            <View style={styles.grid}>
                {/* Weight Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardIcon}>
                            <Ionicons name="scale" size={20} color="#10B981" />
                        </View>
                        <Text style={styles.cardTitle}>Weight</Text>
                    </View>
                    {currentWeight ? (
                        <View style={styles.metricContent}>
                            <Text style={styles.metricValue}>
                                {currentWeight.weight} <Text style={styles.metricUnit}>{currentWeight.unit}</Text>
                            </Text>
                            <Text style={styles.metricDate}>
                                {new Date(currentWeight.date).toLocaleDateString()}
                            </Text>
                            {/* Trend indicator could go here */}
                        </View>
                    ) : (
                        <View style={styles.emptyCard}>
                            <Text style={styles.emptyText}>No weight recorded</Text>
                        </View>
                    )}
                </View>

                {/* Allergies Card */}
                <View style={[styles.card, { flex: 2 }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIcon, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="alert-circle" size={20} color="#EF4444" />
                        </View>
                        <Text style={styles.cardTitle}>Allergies & Conditions</Text>
                    </View>

                    {allergies.length > 0 ? (
                        <View style={styles.tagContainer}>
                            {allergies.map((allergy) => (
                                <View key={allergy.id} style={styles.allergyTag}>
                                    <Text style={styles.allergyText}>{allergy.name}</Text>
                                    {allergy.severity === 'severe' && (
                                        <Ionicons name="warning" size={12} color="#EF4444" />
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyCard}>
                            <Text style={styles.emptyText}>No known allergies</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Modals */}
            <AllergyModal
                visible={allergyModalVisible}
                onClose={() => setAllergyModalVisible(false)}
                petId={petId}
            />
            <WeightModal
                visible={weightModalVisible}
                onClose={() => setWeightModalVisible(false)}
                petId={petId}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    grid: {
        flexDirection: 'row',
        gap: 24,
        flexWrap: 'wrap',
    },
    card: {
        flex: 1,
        minWidth: 250,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    cardIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    metricContent: {
        alignItems: 'flex-start',
    },
    metricValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
    },
    metricUnit: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    metricDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    emptyCard: {
        paddingVertical: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    allergyTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    allergyText: {
        fontSize: 13,
        color: '#991B1B',
        fontWeight: '500',
    },
});
