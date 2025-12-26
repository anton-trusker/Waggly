import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';

interface HealthMetricsModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const BODY_CONDITION_DESCRIPTIONS = [
    { score: 1, label: 'Emaciated', color: '#EF4444' },
    { score: 2, label: 'Very Thin', color: '#F59E0B' },
    { score: 3, label: 'Thin', color: '#F59E0B' },
    { score: 4, label: 'Underweight', color: '#FBBF24' },
    { score: 5, label: 'Ideal', color: '#10B981' },
    { score: 6, label: 'Overweight', color: '#FBBF24' },
    { score: 7, label: 'Heavy', color: '#F59E0B' },
    { score: 8, label: 'Obese', color: '#EF4444' },
    { score: 9, label: 'Severely Obese', color: '#EF4444' },
];

export default function HealthMetricsModal({ visible, onClose, petId: initialPetId, onSuccess }: HealthMetricsModalProps) {
    const { pets } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    const [weightTrend, setWeightTrend] = useState<{ change: number, direction: 'up' | 'down' | 'stable' } | null>(null);

    const [formData, setFormData] = useState({
        recorded_at: new Date().toISOString().split('T')[0],
        recorded_time: '',
        recorded_by: '',
        weight: '',
        weight_unit: 'kg',
        temperature: '',
        temperature_unit: 'C',
        heart_rate: '',
        respiratory_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        oxygen_saturation: '',
        capillary_refill_time: '',
        body_condition_score: '',
        muscle_condition_score: '',
        hydration_status: 'Normal',
        has_lab_results: false,
        glucose_level: '',
        blood_urea_nitrogen: '',
        creatinine: '',
        alt_liver: '',
        albumin: '',
        total_protein: '',
        activity_level: 'Normal',
        appetite_level: 'Normal',
        energy_level: 'Normal',
        notes: '',
        vet_notes: '',
    });

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    useEffect(() => {
        if (formData.weight && selectedPetId) {
            calculateWeightTrend();
        }
    }, [formData.weight, selectedPetId]);

    const calculateWeightTrend = async () => {
        if (!formData.weight || !selectedPetId) return;

        try {
            const { data } = await supabase
                .from('health_metrics')
                .select('weight, weight_unit')
                .eq('pet_id', selectedPetId)
                .not('weight', 'is', null)
                .order('recorded_at', { ascending: false })
                .limit(1)
                .single();

            if (data && data.weight) {
                const currentWeight = parseFloat(formData.weight);
                const lastWeight = data.weight;

                let convertedLastWeight = lastWeight;
                if (data.weight_unit !== formData.weight_unit) {
                    convertedLastWeight = data.weight_unit === 'kg' ? lastWeight * 2.20462 : lastWeight / 2.20462;
                }

                const change = ((currentWeight - convertedLastWeight) / convertedLastWeight) * 100;
                const direction = Math.abs(change) < 2 ? 'stable' : change > 0 ? 'up' : 'down';

                setWeightTrend({ change: Math.abs(change), direction });
            }
        } catch (error) {
            console.error('Error calculating weight trend:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            recorded_at: new Date().toISOString().split('T')[0],
            recorded_time: '',
            recorded_by: '',
            weight: '',
            weight_unit: 'kg',
            temperature: '',
            temperature_unit: 'C',
            heart_rate: '',
            respiratory_rate: '',
            blood_pressure_systolic: '',
            blood_pressure_diastolic: '',
            oxygen_saturation: '',
            capillary_refill_time: '',
            body_condition_score: '',
            muscle_condition_score: '',
            hydration_status: 'Normal',
            has_lab_results: false,
            glucose_level: '',
            blood_urea_nitrogen: '',
            creatinine: '',
            alt_liver: '',
            albumin: '',
            total_protein: '',
            activity_level: 'Normal',
            appetite_level: 'Normal',
            energy_level: 'Normal',
            notes: '',
            vet_notes: '',
        });
        setWeightTrend(null);
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        setLoading(true);
        try {
            const metricsData = {
                pet_id: selectedPetId,
                recorded_at: formData.recorded_at,
                recorded_time: formData.recorded_time || null,
                recorded_by: formData.recorded_by || null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                weight_unit: formData.weight_unit,
                temperature: formData.temperature ? parseFloat(formData.temperature) : null,
                temperature_unit: formData.temperature_unit,
                heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
                respiratory_rate: formData.respiratory_rate ? parseInt(formData.respiratory_rate) : null,
                blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : null,
                blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : null,
                oxygen_saturation: formData.oxygen_saturation ? parseInt(formData.oxygen_saturation) : null,
                capillary_refill_time: formData.capillary_refill_time ? parseFloat(formData.capillary_refill_time) : null,
                body_condition_score: formData.body_condition_score ? parseInt(formData.body_condition_score) : null,
                muscle_condition_score: formData.muscle_condition_score ? parseInt(formData.muscle_condition_score) : null,
                hydration_status: formData.hydration_status,
                lab_results: formData.has_lab_results ? {
                    glucose: formData.glucose_level ? parseFloat(formData.glucose_level) : null,
                    bun: formData.blood_urea_nitrogen ? parseFloat(formData.blood_urea_nitrogen) : null,
                    creatinine: formData.creatinine ? parseFloat(formData.creatinine) : null,
                    alt: formData.alt_liver ? parseFloat(formData.alt_liver) : null,
                    albumin: formData.albumin ? parseFloat(formData.albumin) : null,
                    total_protein: formData.total_protein ? parseFloat(formData.total_protein) : null,
                } : null,
                activity_level: formData.activity_level,
                appetite_level: formData.appetite_level,
                energy_level: formData.energy_level,
                notes: formData.notes || null,
                vet_notes: formData.vet_notes || null,
            };

            const { error } = await supabase
                .from('health_metrics')
                .insert(metricsData as any);

            if (error) throw error;

            Alert.alert('Success', 'Health metrics recorded successfully');
            resetForm();
            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    const selectedBCS = BODY_CONDITION_DESCRIPTIONS.find(d => d.score.toString() === formData.body_condition_score);

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Log Health Metrics</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.formContent}>

                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <UniversalDatePicker
                                        label="Date Recorded"
                                        value={formData.recorded_at}
                                        onChange={(text) => setFormData({ ...formData, recorded_at: text })}
                                        mode="date"
                                    />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={styles.label}>Time</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="HH:MM"
                                        placeholderTextColor="#4B5563"
                                        value={formData.recorded_time}
                                        onChangeText={(text) => setFormData({ ...formData, recorded_time: text })}
                                    />
                                </View>
                            </View>

                            {/* Weight */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="scale" size={20} color="#0A84FF" />
                                    <Text style={styles.sectionTitle}>Weight</Text>
                                    {weightTrend && (
                                        <View style={[styles.trendBadge, { backgroundColor: weightTrend.direction === 'up' ? '#F59E0B20' : weightTrend.direction === 'down' ? '#3B82F620' : '#10B98120' }]}>
                                            <Text style={[styles.trendText, { color: weightTrend.direction === 'up' ? '#F59E0B' : weightTrend.direction === 'down' ? '#3B82F6' : '#10B981' }]}>
                                                {weightTrend.direction === 'stable' ? 'Stable' : `${weightTrend.direction === 'up' ? '↑' : '↓'} ${weightTrend.change.toFixed(1)}%`}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.card}>
                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Weight</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="0.00"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.weight}
                                                onChangeText={(text) => setFormData({ ...formData, weight: text })}
                                            />
                                        </View>
                                        <View style={styles.unitContainer}>
                                            <Text style={styles.label}>Unit</Text>
                                            <View style={styles.unitToggle}>
                                                {['kg', 'lbs'].map(u => (
                                                    <TouchableOpacity
                                                        key={u}
                                                        onPress={() => setFormData({ ...formData, weight_unit: u })}
                                                        style={[styles.unitButton, formData.weight_unit === u && styles.unitButtonSelected]}
                                                    >
                                                        <Text style={[styles.unitButtonText, formData.weight_unit === u && styles.unitButtonTextSelected]}>{u}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Vitals */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="pulse" size={20} color="#EF4444" />
                                    <Text style={styles.sectionTitle}>Vital Signs</Text>
                                </View>
                                <View style={styles.card}>
                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Temperature</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="38.5"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.temperature}
                                                onChangeText={(text) => setFormData({ ...formData, temperature: text })}
                                            />
                                        </View>
                                        <View style={{ width: 80 }}>
                                            <Text style={styles.label}>Unit</Text>
                                            <View style={styles.unitToggle}>
                                                {['C', 'F'].map(u => (
                                                    <TouchableOpacity
                                                        key={u}
                                                        onPress={() => setFormData({ ...formData, temperature_unit: u })}
                                                        style={[styles.unitButton, formData.temperature_unit === u && styles.unitButtonSelectedRed]}
                                                    >
                                                        <Text style={[styles.unitButtonText, formData.temperature_unit === u && styles.unitButtonTextSelected]}>{u}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Heart Rate (BPM)</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="80"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.heart_rate}
                                                onChangeText={(text) => setFormData({ ...formData, heart_rate: text })}
                                            />
                                        </View>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Respiratory (RPM)</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="20"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.respiratory_rate}
                                                onChangeText={(text) => setFormData({ ...formData, respiratory_rate: text })}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>BP Systolic</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="120"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.blood_pressure_systolic}
                                                onChangeText={(text) => setFormData({ ...formData, blood_pressure_systolic: text })}
                                            />
                                        </View>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>BP Diastolic</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="80"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.blood_pressure_diastolic}
                                                onChangeText={(text) => setFormData({ ...formData, blood_pressure_diastolic: text })}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Body Condition */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="body" size={20} color="#F59E0B" />
                                    <Text style={styles.sectionTitle}>Body Condition</Text>
                                </View>
                                <View style={styles.card}>
                                    <Text style={styles.label}>Score (1-9)</Text>
                                    <View style={styles.scoreRow}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(score => (
                                            <TouchableOpacity
                                                key={score}
                                                onPress={() => setFormData({ ...formData, body_condition_score: score.toString() })}
                                                style={[styles.scoreButton, formData.body_condition_score === score.toString() && styles.scoreButtonSelected]}
                                            >
                                                <Text style={[styles.scoreText, formData.body_condition_score === score.toString() && styles.scoreTextSelected]}>
                                                    {score}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {selectedBCS && (
                                        <View style={[styles.bcsLabel, { backgroundColor: `${selectedBCS.color}20` }]}>
                                            <Text style={[styles.bcsLabelText, { color: selectedBCS.color }]}>
                                                {selectedBCS.label}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Lab Results */}
                            <View style={styles.section}>
                                <View style={styles.labHeader}>
                                    <View style={styles.sectionHeader}>
                                        <Ionicons name="flask" size={20} color="#8B5CF6" />
                                        <Text style={styles.sectionTitle}>Lab Results</Text>
                                    </View>
                                    <Switch
                                        value={formData.has_lab_results}
                                        onValueChange={(val) => setFormData({ ...formData, has_lab_results: val })}
                                        trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                    />
                                </View>

                                {formData.has_lab_results && (
                                    <View style={styles.card}>
                                        <View style={styles.row}>
                                            <View style={styles.flex1}>
                                                <Text style={styles.label}>Glucose (mg/dL)</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="90"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.glucose_level}
                                                    onChangeText={(text) => setFormData({ ...formData, glucose_level: text })}
                                                />
                                            </View>
                                            <View style={styles.flex1}>
                                                <Text style={styles.label}>BUN (mg/dL)</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="20"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.blood_urea_nitrogen}
                                                    onChangeText={(text) => setFormData({ ...formData, blood_urea_nitrogen: text })}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.flex1}>
                                                <Text style={styles.label}>Creatinine (mg/dL)</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="1.0"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.creatinine}
                                                    onChangeText={(text) => setFormData({ ...formData, creatinine: text })}
                                                />
                                            </View>
                                            <View style={styles.flex1}>
                                                <Text style={styles.label}>ALT (U/L)</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="40"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.alt_liver}
                                                    onChangeText={(text) => setFormData({ ...formData, alt_liver: text })}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>

                            <RichTextInput
                                label="Notes"
                                placeholder="Any observations..."
                                value={formData.notes}
                                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                minHeight={80}
                            />

                            <View style={{ height: 40 }} />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        maxHeight: '90%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    cancelText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    saveText: {
        color: '#0A84FF',
        fontSize: 17,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    formContent: {
        padding: 20,
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        padding: 16,
        gap: 16,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#FFFFFF',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    unitContainer: {
        width: 96,
    },
    unitToggle: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 4,
    },
    unitButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    unitButtonSelected: {
        backgroundColor: '#0A84FF',
    },
    unitButtonSelectedRed: {
        backgroundColor: '#EF4444',
    },
    unitButtonText: {
        fontWeight: '700',
        fontSize: 12,
        color: '#6B7280',
    },
    unitButtonTextSelected: {
        color: '#FFFFFF',
    },
    trendBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '700',
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    scoreButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#374151',
    },
    scoreButtonSelected: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },
    scoreText: {
        fontWeight: '700',
        color: '#6B7280',
    },
    scoreTextSelected: {
        color: '#FFFFFF',
    },
    bcsLabel: {
        marginTop: 8,
        padding: 8,
        borderRadius: 8,
    },
    bcsLabelText: {
        textAlign: 'center',
        fontWeight: '700',
    },
    labHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
