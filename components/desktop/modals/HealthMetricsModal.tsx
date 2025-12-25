import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { cssInterop } from 'react-native-css-interop';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';

cssInterop(BlurView, { className: 'style' });

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

        // Weight
        weight: '',
        weight_unit: 'kg',

        // Vitals
        temperature: '',
        temperature_unit: 'C',
        heart_rate: '',
        respiratory_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        oxygen_saturation: '',
        capillary_refill_time: '',

        // Body Condition
        body_condition_score: '',
        muscle_condition_score: '',
        hydration_status: 'Normal',

        // Lab Results
        has_lab_results: false,
        glucose_level: '',
        blood_urea_nitrogen: '',
        creatinine: '',
        alt_liver: '',
        albumin: '',
        total_protein: '',

        // Additional Metrics
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

    // Calculate weight trend when weight is entered
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

                // Convert to same unit if needed
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
                .insert(metricsData as any); // Type assertion to fix Supabase type mismatch

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
            <View className="flex-1 bg-black/60 justify-center items-center p-4 sm:p-6 lg:p-8">
                <BlurView intensity={20} className="absolute inset-0" />
                <View className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl bg-[#1C1C1E] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#2C2C2E]">
                    <View className="flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#2C2C2E]">
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-[#9CA3AF] text-base font-medium">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-white text-base sm:text-lg font-bold">Log Health Metrics</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text className="text-[#0A84FF] text-lg font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="p-4 sm:p-5 md:p-6" showsVerticalScrollIndicator={false}>
                        <View className="space-y-6 sm:space-y-8 pb-6 sm:pb-8">

                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <UniversalDatePicker
                                        label="Date Recorded"
                                        value={formData.recorded_at}
                                        onChange={(text) => setFormData({ ...formData, recorded_at: text })}
                                        mode="date"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Time</Text>
                                    <TextInput
                                        className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                        placeholder="HH:MM"
                                        placeholderTextColor="#4B5563"
                                        value={formData.recorded_time}
                                        onChangeText={(text) => setFormData({ ...formData, recorded_time: text })}
                                    />
                                </View>
                            </View>

                            {/* Weight with Trend */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="scale" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Weight</Text>
                                    {weightTrend && (
                                        <View className={`px-2 py-1 rounded-full ${weightTrend.direction === 'up' ? 'bg-[#F59E0B]/20' :
                                            weightTrend.direction === 'down' ? 'bg-[#3B82F6]/20' : 'bg-[#10B981]/20'
                                            }`}>
                                            <Text className={`text-xs font-bold ${weightTrend.direction === 'up' ? 'text-[#F59E0B]' :
                                                weightTrend.direction === 'down' ? 'text-[#3B82F6]' : 'text-[#10B981]'
                                                }`}>
                                                {weightTrend.direction === 'stable' ? 'Stable' :
                                                    `${weightTrend.direction === 'up' ? '↑' : '↓'} ${weightTrend.change.toFixed(1)}%`}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 flex-row gap-4">
                                    <View className="flex-1">
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Weight</Text>
                                        <TextInput
                                            className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="0.00"
                                            keyboardType="numeric"
                                            placeholderTextColor="#4B5563"
                                            value={formData.weight}
                                            onChangeText={(text) => setFormData({ ...formData, weight: text })}
                                        />
                                    </View>
                                    <View className="w-24">
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Unit</Text>
                                        <View className="flex-row bg-[#1C1C1E] rounded-xl p-1">
                                            {['kg', 'lbs'].map(u => (
                                                <TouchableOpacity
                                                    key={u}
                                                    onPress={() => setFormData({ ...formData, weight_unit: u })}
                                                    className={`flex-1 py-2 rounded-lg items-center ${formData.weight_unit === u ? 'bg-[#0A84FF]' : ''}`}
                                                >
                                                    <Text className={`font-bold text-xs ${formData.weight_unit === u ? 'text-white' : 'text-[#6B7280]'}`}>{u}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Vitals */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="pulse" size={20} color="#EF4444" />
                                    <Text className="text-white text-lg font-bold">Vital Signs</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Temperature</Text>
                                            <TextInput
                                                className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                placeholder="38.5"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.temperature}
                                                onChangeText={(text) => setFormData({ ...formData, temperature: text })}
                                            />
                                        </View>
                                        <View className="w-20">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Unit</Text>
                                            <View className="flex-row bg-[#1C1C1E] rounded-xl p-1">
                                                {['C', 'F'].map(u => (
                                                    <TouchableOpacity
                                                        key={u}
                                                        onPress={() => setFormData({ ...formData, temperature_unit: u })}
                                                        className={`flex-1 py-2 rounded-lg items-center ${formData.temperature_unit === u ? 'bg-[#EF4444]' : ''}`}
                                                    >
                                                        <Text className={`font-bold text-xs ${formData.temperature_unit === u ? 'text-white' : 'text-[#6B7280]'}`}>{u}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Heart Rate (BPM)</Text>
                                            <TextInput
                                                className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                placeholder="80"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.heart_rate}
                                                onChangeText={(text) => setFormData({ ...formData, heart_rate: text })}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Respiratory (RPM)</Text>
                                            <TextInput
                                                className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                placeholder="20"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.respiratory_rate}
                                                onChangeText={(text) => setFormData({ ...formData, respiratory_rate: text })}
                                            />
                                        </View>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">BP Systolic</Text>
                                            <TextInput
                                                className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                placeholder="120"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.blood_pressure_systolic}
                                                onChangeText={(text) => setFormData({ ...formData, blood_pressure_systolic: text })}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">BP Diastolic</Text>
                                            <TextInput
                                                className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
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
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="body" size={20} color="#F59E0B" />
                                    <Text className="text-white text-lg font-bold">Body Condition</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4">
                                    <Text className="text-[#9CA3AF] text-xs font-medium mb-4">Score (1-9)</Text>
                                    <View className="flex-row justify-between mb-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(score => (
                                            <TouchableOpacity
                                                key={score}
                                                onPress={() => setFormData({ ...formData, body_condition_score: score.toString() })}
                                                className={`w-8 h-8 rounded-full items-center justify-center border ${formData.body_condition_score === score.toString()
                                                    ? 'bg-[#0A84FF] border-[#0A84FF]'
                                                    : 'border-[#374151]'
                                                    }`}
                                            >
                                                <Text className={`font-bold ${formData.body_condition_score === score.toString() ? 'text-white' : 'text-[#6B7280]'}`}>
                                                    {score}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {selectedBCS && (
                                        <View className="mt-2 p-2 rounded-lg" style={{ backgroundColor: `${selectedBCS.color}20` }}>
                                            <Text className="text-center font-bold" style={{ color: selectedBCS.color }}>
                                                {selectedBCS.label}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Lab Results */}
                            <View>
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="flask" size={20} color="#8B5CF6" />
                                        <Text className="text-white text-lg font-bold">Lab Results</Text>
                                    </View>
                                    <Switch
                                        value={formData.has_lab_results}
                                        onValueChange={(val) => setFormData({ ...formData, has_lab_results: val })}
                                        trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                    />
                                </View>

                                {formData.has_lab_results && (
                                    <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                        <View className="flex-row gap-4">
                                            <View className="flex-1">
                                                <Text className="text-[#9CA3AF] text-xs mb-2">Glucose (mg/dL)</Text>
                                                <TextInput
                                                    className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                    placeholder="90"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.glucose_level}
                                                    onChangeText={(text) => setFormData({ ...formData, glucose_level: text })}
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[#9CA3AF] text-xs mb-2">BUN (mg/dL)</Text>
                                                <TextInput
                                                    className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                    placeholder="20"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.blood_urea_nitrogen}
                                                    onChangeText={(text) => setFormData({ ...formData, blood_urea_nitrogen: text })}
                                                />
                                            </View>
                                        </View>
                                        <View className="flex-row gap-4">
                                            <View className="flex-1">
                                                <Text className="text-[#9CA3AF] text-xs mb-2">Creatinine (mg/dL)</Text>
                                                <TextInput
                                                    className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                    placeholder="1.0"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.creatinine}
                                                    onChangeText={(text) => setFormData({ ...formData, creatinine: text })}
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[#9CA3AF] text-xs mb-2">ALT (U/L)</Text>
                                                <TextInput
                                                    className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
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

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
