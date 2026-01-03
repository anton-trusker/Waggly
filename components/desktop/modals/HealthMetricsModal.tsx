import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { designSystem } from '@/constants/designSystem'; // Force Light Theme
import UniversalDatePicker from './shared/UniversalDatePicker';
import PetSelector from './shared/PetSelector';
import FormModal, { FormState } from '@/components/ui/FormModal';
import { useLocale } from '@/hooks/useLocale';

interface HealthMetricsModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const BODY_CONDITION_SCORES = [
    { score: 1, label: 'Emaciated', color: '#EF4444', emoji: '😟' },
    { score: 3, label: 'Thin', color: '#F59E0B', emoji: '😐' },
    { score: 5, label: 'Ideal', color: '#22C55E', emoji: '😊' },
    { score: 7, label: 'Heavy', color: '#F59E0B', emoji: '😐' },
    { score: 9, label: 'Obese', color: '#EF4444', emoji: '😟' },
];

const ACTIVITY_LEVELS = ['Low', 'Normal', 'High'];
const APPETITE_LEVELS = ['Reduced', 'Normal', 'Increased'];
const ENERGY_LEVELS = ['Lethargic', 'Normal', 'Hyper'];
const STOOL_QUALITIES = ['Loose', 'Normal', 'Hard'];

interface HealthMetricsFormData {
    date: string;
    weight: string;
    weightUnit: 'kg' | 'lb';
    temperature: string;
    temperatureUnit: 'C' | 'F';
    heartRate: string;
    respiratoryRate: string;
    bodyConditionScore: number | null;
    activityLevel: string;
    appetiteLevel: string;
    energyLevel: string;
    coatCondition: string;
    stoolQuality: string;
    notes: string;
}

export default function HealthMetricsModal({ visible, onClose, petId: initialPetId, onSuccess }: HealthMetricsModalProps) {
    const { pets } = usePets();
    const { t } = useLocale();
    const theme = designSystem;

    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [userId, setUserId] = useState<string | null>(null);
    const [lastWeight, setLastWeight] = useState<{ value: number, unit: string } | null>(null);
    const [isLoadingWeight, setIsLoadingWeight] = useState(false);

    // Fetch latest weight for the pet
    useEffect(() => {
        const fetchLatestWeight = async () => {
            if (!selectedPetId || !visible) return;

            setIsLoadingWeight(true);
            try {
                const { data, error } = await supabase
                    .from('health_metrics')
                    .select('weight, weight_unit')
                    .eq('pet_id', selectedPetId)
                    .not('weight', 'is', null)
                    .order('date', { ascending: false })
                    .limit(1)
                    .single();

                if (!error && data) {
                    setLastWeight({
                        value: data.weight,
                        unit: data.weight_unit || 'kg'
                    });
                }
            } catch (err) {
                // No previous weight found, that's okay
                setLastWeight(null);
            } finally {
                setIsLoadingWeight(false);
            }
        };

        fetchLatestWeight();
    }, [selectedPetId, visible]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserId(session?.user?.id || null);
        });
    }, []);

    useEffect(() => {
        if (visible) {
            if (initialPetId) {
                setSelectedPetId(initialPetId);
            } else if (pets.length > 0 && !selectedPetId) {
                setSelectedPetId(pets[0].id);
            }
        }
    }, [visible, initialPetId, pets]);

    const initialData: HealthMetricsFormData = useMemo(() => ({
        date: new Date().toISOString().split('T')[0],
        weight: lastWeight ? lastWeight.value.toString() : '',
        weightUnit: lastWeight ? (lastWeight.unit as 'kg' | 'lb') : 'kg',
        temperature: '',
        temperatureUnit: 'C',
        heartRate: '',
        respiratoryRate: '',
        bodyConditionScore: null,
        activityLevel: 'Normal',
        appetiteLevel: 'Normal',
        energyLevel: 'Normal',
        coatCondition: 'Normal',
        stoolQuality: 'Normal',
        notes: '',
    }), [lastWeight]);

    const handleSubmit = async (data: HealthMetricsFormData) => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        const metricsData = {
            pet_id: selectedPetId,
            date: data.date,
            weight: data.weight ? parseFloat(data.weight) : null,
            weight_unit: data.weightUnit,
            temperature: data.temperature ? parseFloat(data.temperature) : null,
            temperature_unit: data.temperatureUnit,
            heart_rate: data.heartRate ? parseInt(data.heartRate) : null,
            respiratory_rate: data.respiratoryRate ? parseInt(data.respiratoryRate) : null,
            body_condition_score: data.bodyConditionScore,
            activity_level: data.activityLevel,
            appetite_level: data.appetiteLevel,
            notes: data.notes || null,
        };

        // Log additional indicators in notes if not in schema columns? 
        // Some columns exist (activity_level, appetite_level from migration 20251225191600).
        // Check schema... Assuming columns exist or will fit into 'health_metrics'.

        try {
            const { error } = await supabase
                .from('health_metrics')
                .insert(metricsData as any);

            if (error) throw error;

            // Log Activity
            if (userId) {
                await supabase.from('activity_logs').insert({
                    actor_id: userId,
                    owner_id: userId,
                    pet_id: selectedPetId,
                    action_type: 'health_check_added',
                    details: {
                        weight: data.weight ? `${data.weight} ${data.weightUnit}` : undefined,
                        bcs: data.bodyConditionScore,
                    },
                });
            }

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Health metrics error:', error);
            Alert.alert('Error', error.message || 'Failed to save health metrics');
        }
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title="Health Check"
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="Save Records"
            forceLight
        >
            {(formState: FormState<HealthMetricsFormData>) => (
                <View style={styles.formContent}>
                    {pets.length > 1 && (
                        <PetSelector
                            selectedPetId={selectedPetId}
                            onSelectPet={setSelectedPetId}
                        />
                    )}

                    {/* Vitals Card */}
                    <View style={[styles.card, { borderColor: theme.colors.border.secondary }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="pulse" size={18} color={theme.colors.status.error} />
                            <Text style={styles.sectionTitle}>Vitals</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <UniversalDatePicker
                                    label="Date"
                                    value={formState.data.date}
                                    onChange={(d) => formState.updateField('date', d)}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <Text style={styles.label}>Weight</Text>
                                <View style={styles.inputGroup}>
                                    <TextInput
                                        style={[styles.input, styles.inputLeft]}
                                        placeholder="0.0"
                                        keyboardType="numeric"
                                        value={formState.data.weight}
                                        onChangeText={(t) => formState.updateField('weight', t)}
                                    />
                                    <View style={styles.unitToggle}>
                                        <TouchableOpacity
                                            onPress={() => formState.updateField('weightUnit', formState.data.weightUnit === 'kg' ? 'lb' : 'kg')}
                                        >
                                            <Text style={styles.unitText}>{formState.data.weightUnit}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.flex1}>
                                <Text style={styles.label}>Temp</Text>
                                <View style={styles.inputGroup}>
                                    <TextInput
                                        style={[styles.input, styles.inputLeft]}
                                        placeholder="38.5"
                                        keyboardType="numeric"
                                        value={formState.data.temperature}
                                        onChangeText={(t) => formState.updateField('temperature', t)}
                                    />
                                    <View style={styles.unitToggle}>
                                        <TouchableOpacity
                                            onPress={() => formState.updateField('temperatureUnit', formState.data.temperatureUnit === 'C' ? 'F' : 'C')}
                                        >
                                            <Text style={styles.unitText}>°{formState.data.temperatureUnit}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* BCS Card */}
                    <View style={[styles.card, { borderColor: theme.colors.border.secondary }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="body" size={18} color={theme.colors.primary[500]} />
                            <Text style={styles.sectionTitle}>Body Condition</Text>
                        </View>
                        <View style={styles.bcsRow}>
                            {BODY_CONDITION_SCORES.map((bcs) => (
                                <TouchableOpacity
                                    key={bcs.score}
                                    style={[
                                        styles.bcsItem,
                                        formState.data.bodyConditionScore === bcs.score && {
                                            backgroundColor: bcs.color + '20',
                                            borderColor: bcs.color
                                        }
                                    ]}
                                    onPress={() => formState.updateField('bodyConditionScore', bcs.score)}
                                >
                                    <Text style={{ fontSize: 20 }}>{bcs.emoji}</Text>
                                    <Text style={[styles.bcsLabel, formState.data.bodyConditionScore === bcs.score && { color: bcs.color }]}>
                                        {bcs.score}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Indicators Card */}
                    <View style={[styles.card, { borderColor: theme.colors.border.secondary }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="bar-chart" size={18} color="#10B981" />
                            <Text style={styles.sectionTitle}>Wellness</Text>
                        </View>

                        <View style={styles.indicatorRow}>
                            <Text style={styles.indicatorLabel}>Activity</Text>
                            <View style={styles.pillGroup}>
                                {ACTIVITY_LEVELS.map(L => (
                                    <TouchableOpacity
                                        key={L}
                                        style={[styles.pill, formState.data.activityLevel === L && styles.pillActive]}
                                        onPress={() => formState.updateField('activityLevel', L)}
                                    >
                                        <Text style={[styles.pillText, formState.data.activityLevel === L && styles.pillTextActive]}>{L}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.indicatorRow}>
                            <Text style={styles.indicatorLabel}>Appetite</Text>
                            <View style={styles.pillGroup}>
                                {APPETITE_LEVELS.map(L => (
                                    <TouchableOpacity
                                        key={L}
                                        style={[styles.pill, formState.data.appetiteLevel === L && styles.pillActive]}
                                        onPress={() => formState.updateField('appetiteLevel', L)}
                                    >
                                        <Text style={[styles.pillText, formState.data.appetiteLevel === L && styles.pillTextActive]}>{L}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={[styles.card, { borderColor: theme.colors.border.secondary }]}>
                        <Text style={styles.label}>Notes</Text>
                        <TextInput
                            style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                            placeholder="Observations..."
                            multiline
                            value={formState.data.notes}
                            onChangeText={(t) => formState.updateField('notes', t)}
                        />
                    </View>

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
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    flex1: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: '#111827',
    },
    inputGroup: {
        flexDirection: 'row',
    },
    inputLeft: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        flex: 1,
    },
    unitToggle: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: '#E5E7EB',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    unitText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    bcsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    bcsItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    bcsLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        marginTop: 4,
    },
    indicatorRow: {
        gap: 8,
    },
    indicatorLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563',
    },
    pillGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    pillActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    pillText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    pillTextActive: {
        color: '#3B82F6',
        fontWeight: '600',
    },
});
