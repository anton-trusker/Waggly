import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import { useWeightHistory } from '@/hooks/passport/useWeightHistory';
import WeightHistoryChart from '@/components/passport/charts/WeightHistoryChart';
import { format } from 'date-fns';

interface WeightTrackingModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    currentWeight?: number;
}

export default function WeightTrackingModal({ visible, onClose, petId, currentWeight }: WeightTrackingModalProps) {
    const { history, loading, addWeight, deleteWeight, error } = useWeightHistory(petId);

    // Form State
    const [weightInput, setWeightInput] = useState(currentWeight?.toString() || '');
    const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [submitting, setSubmitting] = useState(false);

    const handleAdd = async () => {
        if (!weightInput) return;
        try {
            setSubmitting(true);
            await addWeight(parseFloat(weightInput), dateInput);
            setWeightInput(''); // Reset
        } catch (e) {
            // Error handling done in hook logs
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Weight Tracker</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={designSystem.colors.text.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Chart Section */}
                    <View style={styles.chartContainer}>
                        <Text style={styles.sectionTitle}>Weight History</Text>
                        {loading ? (
                            <ActivityIndicator color={designSystem.colors.primary[500]} />
                        ) : (
                            <WeightHistoryChart data={history} />
                        )}
                    </View>

                    {/* Add Weight Form */}
                    <View style={styles.formCard}>
                        <View style={styles.formHeader}>
                            <Ionicons name="add-circle" size={20} color={designSystem.colors.primary[500]} />
                            <Text style={styles.formTitle}>Add New Entry</Text>
                        </View>

                        <View style={styles.inputRow}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Weight (kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={weightInput}
                                    onChangeText={setWeightInput}
                                    keyboardType="numeric"
                                    placeholder="0.0"
                                    placeholderTextColor={designSystem.colors.text.tertiary}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Date</Text>
                                <TextInput
                                    style={styles.input}
                                    value={dateInput}
                                    onChangeText={setDateInput}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={designSystem.colors.text.tertiary}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.fullWidthButton, submitting && styles.disabledButton]}
                            onPress={handleAdd}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Save Record</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* History List */}
                    <View style={styles.listContainer}>
                        <Text style={styles.sectionTitle}>Recent Entries</Text>
                        {history.map((record) => (
                            <View key={record.id} style={styles.historyItem}>
                                <View>
                                    <Text style={styles.historyWeight}>{record.weight} {record.unit}</Text>
                                    <Text style={styles.historyDate}>{format(new Date(record.date), 'MMM d, yyyy')}</Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteWeight(record.id)}>
                                    <Ionicons name="trash-outline" size={20} color={designSystem.colors.status.error} />
                                </TouchableOpacity>
                            </View>
                        ))}
                        {history.length === 0 && !loading && (
                            <Text style={styles.emptyText}>No weight records yet.</Text>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: designSystem.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[200],
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: designSystem.spacing[4],
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
        marginBottom: 16,
    },
    chartContainer: {
        marginBottom: 24,
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        ...designSystem.shadows.sm,
    },
    formCard: {
        marginBottom: 24,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        ...designSystem.shadows.sm,
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 6,
    },
    input: {
        backgroundColor: designSystem.colors.neutral[50],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    fullWidthButton: {
        backgroundColor: designSystem.colors.primary[500],
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.7,
    },
    listContainer: {
        marginBottom: 20,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    historyWeight: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    historyDate: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
    },
    emptyText: {
        textAlign: 'center',
        color: designSystem.colors.text.secondary,
        marginTop: 20,
    },
});
