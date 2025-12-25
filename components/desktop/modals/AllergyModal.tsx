import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity } from 'react-native';
import GenericFormModal from './GenericFormModal';
import { useAllergies } from '@/hooks/useAllergies';
import { Allergy } from '@/types';

interface AllergyModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    existingAllergy?: Allergy | null; // If provided, edit mode
}

export default function AllergyModal({ visible, onClose, petId, existingAllergy }: AllergyModalProps) {
    const { addAllergy, updateAllergy } = useAllergies(petId);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [severity, setSeverity] = useState('moderate');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (visible) {
            if (existingAllergy) {
                setName(existingAllergy.name);
                setSeverity(existingAllergy.severity || 'moderate');
                setNotes(existingAllergy.notes || '');
            } else {
                setName('');
                setSeverity('moderate');
                setNotes('');
            }
        }
    }, [visible, existingAllergy]);

    const handleSave = async () => {
        if (!name.trim()) return;
        setLoading(true);

        let result;
        if (existingAllergy) {
            result = await updateAllergy(existingAllergy.id, { name, severity, notes });
        } else {
            result = await addAllergy({ name, severity, notes });
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
            title={existingAllergy ? 'Edit Allergy' : 'Add Allergy'}
            onPrimaryAction={handleSave}
            loading={loading}
            primaryActionLabel={existingAllergy ? 'Update' : 'Add Allergy'}
        >
            <View style={styles.formGroup}>
                <Text style={styles.label}>Allergy Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Peanuts, Bee Stings"
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Severity</Text>
                <View style={styles.severityOptions}>
                    {['mild', 'moderate', 'severe'].map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[
                                styles.severityOption,
                                severity === level && styles.severityOptionActive,
                                severity === level && { borderColor: getSeverityColor(level) }
                            ]}
                            onPress={() => setSeverity(level)}
                        >
                            <View style={[
                                styles.radioCircle,
                                severity === level && { borderColor: getSeverityColor(level) }
                            ]}>
                                {severity === level && (
                                    <View style={[styles.radioDot, { backgroundColor: getSeverityColor(level) }]} />
                                )}
                            </View>
                            <Text style={[
                                styles.severityText,
                                severity === level && { color: getSeverityColor(level) }
                            ]}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Any specific reactions or details..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    numberOfLines={3}
                />
            </View>
        </GenericFormModal>
    );
}

const getSeverityColor = (level: string) => {
    switch (level) {
        case 'mild': return '#10B981';
        case 'moderate': return '#F59E0B';
        case 'severe': return '#EF4444';
        default: return '#6B7280';
    }
};

const styles = StyleSheet.create({
    formGroup: {
        marginBottom: 20,
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
        minHeight: 100,
    },
    severityOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    severityOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    severityOptionActive: {
        backgroundColor: '#fff',
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    severityText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
});
