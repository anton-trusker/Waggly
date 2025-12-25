import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, Platform } from 'react-native';
import GenericFormModal from './GenericFormModal';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { WeightEntry } from '@/types';

interface WeightModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    existingEntry?: WeightEntry | null; // If provided, edit mode
}

export default function WeightModal({ visible, onClose, petId, existingEntry }: WeightModalProps) {
    const { addWeightEntry, updateWeightEntry } = useWeightEntries(petId);
    const [loading, setLoading] = useState(false);

    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('kg');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (visible) {
            if (existingEntry) {
                setWeight(String(existingEntry.weight));
                setUnit(existingEntry.unit);
                setDate(existingEntry.date.split('T')[0]);
                setNotes(existingEntry.notes || '');
            } else {
                setWeight('');
                setUnit('kg'); // Default to kg, could be user preference
                setDate(new Date().toISOString().split('T')[0]);
                setNotes('');
            }
        }
    }, [visible, existingEntry]);

    const handleSave = async () => {
        if (!weight || isNaN(Number(weight))) return;
        setLoading(true);

        const numericWeight = parseFloat(weight);

        let result;
        if (existingEntry) {
            result = await updateWeightEntry(existingEntry.id, {
                weight: numericWeight,
                unit,
                date,
                notes
            });
        } else {
            result = await addWeightEntry({
                weight: numericWeight,
                unit,
                date,
                notes
            });
        }

        setLoading(false);
        if (!result.error) {
            onClose();
        }
    };

    return (
        <GenericFormModal
            visible={visible}
            onClose={onClose}
            title={existingEntry ? 'Edit Weight' : 'Log Weight'}
            onPrimaryAction={handleSave}
            loading={loading}
            primaryActionLabel={existingEntry ? 'Update' : 'Save'}
        >
            <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Weight</Text>
                    <TextInput
                        style={styles.input}
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="decimal-pad"
                        autoFocus
                    />
                </View>

                <View style={[styles.formGroup, { width: 120 }]}>
                    <Text style={styles.label}>Unit</Text>
                    <View style={styles.unitToggle}>
                        <TouchableOpacity
                            style={[styles.unitOption, unit === 'kg' && styles.unitOptionActive]}
                            onPress={() => setUnit('kg')}
                        >
                            <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>kg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.unitOption, unit === 'lbs' && styles.unitOptionActive]}
                            onPress={() => setUnit('lbs')}
                        >
                            <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>lbs</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Optional notes..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    numberOfLines={2}
                />
            </View>
        </GenericFormModal>
    );
}

const styles = StyleSheet.create({
    formGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
        backgroundColor: '#F9FAFB',
    },
    textArea: {
        minHeight: 80,
    },
    helperText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    unitToggle: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    unitOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 6,
    },
    unitOptionActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    unitText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    unitTextActive: {
        color: '#111827',
        fontWeight: '600',
    },
});
