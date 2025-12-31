
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
import FormModal, { FormState } from '@/components/ui/FormModal';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';
import { Condition } from '@/types';

interface ConditionFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    existingCondition?: Condition | null;
    onSuccess?: () => void;
}

interface ConditionFormData {
    name: string;
    status: 'active' | 'resolved' | 'recurring';
    diagnosed_date: string;
    resolved_date: string;
    notes: string;
    severity: 'mild' | 'moderate' | 'severe';
    treatment_plan: string;
}

const SEVERITY_LEVELS = ['mild', 'moderate', 'severe'];
const STATUS_OPTIONS = ['active', 'resolved', 'recurring'];

export default function ConditionFormModal({ visible, onClose, petId: initialPetId, existingCondition, onSuccess }: ConditionFormModalProps) {
    const { theme } = useAppTheme();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');

    useEffect(() => {
        if (visible) {
            if (existingCondition?.pet_id) {
                setSelectedPetId(existingCondition.pet_id);
            } else if (initialPetId) {
                setSelectedPetId(initialPetId);
            }
        }
    }, [visible, initialPetId, existingCondition]);

    const initialData: ConditionFormData = useMemo(() => {
        if (existingCondition) {
            return {
                name: existingCondition.name,
                status: existingCondition.status,
                diagnosed_date: existingCondition.diagnosed_date,
                resolved_date: existingCondition.resolved_date || '',
                notes: existingCondition.notes || '',
                severity: existingCondition.severity || 'mild',
                treatment_plan: existingCondition.treatment_plan || '',
            };
        }
        return {
            name: '',
            status: 'active',
            diagnosed_date: new Date().toISOString().split('T')[0],
            resolved_date: '',
            notes: '',
            severity: 'mild',
            treatment_plan: '',
        };
    }, [existingCondition]);

    const validate = (data: ConditionFormData) => {
        const errors: Record<string, string> = {};
        if (!data.name.trim()) errors.name = 'Condition name is required';
        if (!data.diagnosed_date) errors.diagnosed_date = 'Date is required';
        return errors;
    };

    const handleSubmit = async (data: ConditionFormData) => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        try {
            const payload = {
                pet_id: selectedPetId,
                name: data.name,
                status: data.status,
                diagnosed_date: data.diagnosed_date,
                resolved_date: data.resolved_date || null,
                notes: data.notes || null,
                severity: data.severity,
                treatment_plan: data.treatment_plan || null,
            };

            let error;
            if (existingCondition) {
                const { error: updateError } = await supabase
                    .from('conditions')
                    .update(payload)
                    .eq('id', existingCondition.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('conditions')
                    .insert(payload);
                error = insertError;
            }

            if (error) throw error;

            // Log activity
            await supabase.from('activity_logs').insert({
                pet_id: selectedPetId,
                action_type: existingCondition ? 'health_updated' : 'health_added',
                description: `${existingCondition ? 'Updated' : 'Added'} condition record: ${data.name}`,
                metadata: { condition_name: data.name, status: data.status }
            });

            onSuccess?.();
            onClose();
        } catch (err: any) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={existingCondition ? "Edit Condition" : "Add Condition"}
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel={existingCondition ? "Update Condition" : "Save Condition"}
            validate={validate}
        >
            {(formState: FormState<ConditionFormData>) => (
                <View style={styles.formContent}>
                    {/* Name & Status */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Condition Name</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: theme.colors.background.secondary,
                                    color: theme.colors.text.primary,
                                    borderColor: formState.errors.name ? theme.colors.status.error[500] : theme.colors.border.primary
                                }
                            ]}
                            placeholder="e.g. Arthritis, Diabetes"
                            placeholderTextColor={theme.colors.text.tertiary}
                            value={formState.data.name}
                            onChangeText={(text) => formState.updateField('name', text)}
                        />
                        {formState.errors.name && (
                            <Text style={{ color: theme.colors.status.error[500], fontSize: 12 }}>{formState.errors.name}</Text>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Status</Text>
                        <View style={styles.chipRow}>
                            {STATUS_OPTIONS.map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => formState.updateField('status', status as any)}
                                    style={[
                                        styles.chip,
                                        { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary },
                                        formState.data.status === status && { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                                    ]}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        { color: theme.colors.text.secondary },
                                        formState.data.status === status && { color: '#FFFFFF' }
                                    ]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Severity</Text>
                        <View style={styles.chipRow}>
                            {SEVERITY_LEVELS.map((sev) => (
                                <TouchableOpacity
                                    key={sev}
                                    onPress={() => formState.updateField('severity', sev as any)}
                                    style={[
                                        styles.chip,
                                        { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary },
                                        formState.data.severity === sev && { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                                    ]}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        { color: theme.colors.text.secondary },
                                        formState.data.severity === sev && { color: '#FFFFFF' }
                                    ]}>{sev.charAt(0).toUpperCase() + sev.slice(1)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <UniversalDatePicker
                                label="Diagnosed Date"
                                value={formState.data.diagnosed_date}
                                onChange={(text) => formState.updateField('diagnosed_date', text)}
                            />
                        </View>
                        {formState.data.status === 'resolved' && (
                            <View style={styles.halfWidth}>
                                <UniversalDatePicker
                                    label="Resolved Date"
                                    value={formState.data.resolved_date}
                                    onChange={(text) => formState.updateField('resolved_date', text)}
                                />
                            </View>
                        )}
                    </View>

                    <RichTextInput
                        label="Treatment Plan / Notes"
                        placeholder="Details about treatment or observations..."
                        value={formState.data.notes}
                        onChangeText={(text) => formState.updateField('notes', text)}
                        height={100}
                    />

                    <View style={{ height: 20 }} />
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    formContent: {
        gap: 16,
    },
    section: {
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfWidth: {
        flex: 1,
    },
});
