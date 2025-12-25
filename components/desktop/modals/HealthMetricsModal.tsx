import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { cssInterop } from 'react-native-css-interop';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';

// Apply cssInterop to components if not already done globally
cssInterop(BlurView, { className: 'style' });

interface HealthMetricsModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

export default function HealthMetricsModal({ visible, onClose, petId: initialPetId, onSuccess }: HealthMetricsModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        weight_unit: 'kg',
        temperature: '',
        temperature_unit: 'C',
        heart_rate: '',
        respiratory_rate: '',
        body_condition_score: '', // 1-9
        notes: '',
    });

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    const resetForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            weight: '',
            weight_unit: 'kg',
            temperature: '',
            temperature_unit: 'C',
            heart_rate: '',
            respiratory_rate: '',
            body_condition_score: '',
            notes: '',
        });
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    }

    const handleRepeatLast = async () => {
        if (!selectedPetId) return;
        setLoading(true);
        try {
            const { data } = await supabase
                .from('health_metrics')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('date', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    weight: data.weight?.toString() || prev.weight,
                    weight_unit: data.weight_unit || prev.weight_unit,
                    body_condition_score: data.body_condition_score?.toString() || prev.body_condition_score,
                }));
                Alert.alert('Auto-Filled', 'Last recorded metrics applied.');
            } else {
                Alert.alert('Info', 'No previous metrics found.');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        setLoading(true);
        try {
            const { error } = await (supabase
                .from('health_metrics') as any)
                .insert({
                    pet_id: selectedPetId,
                    date: formData.date,
                    weight: formData.weight ? parseFloat(formData.weight) : null,
                    weight_unit: formData.weight_unit,
                    temperature: formData.temperature ? parseFloat(formData.temperature) : null,
                    temperature_unit: formData.temperature_unit,
                    heart_rate: formData.heart_rate ? parseFloat(formData.heart_rate) : null,
                    respiratory_rate: formData.respiratory_rate ? parseFloat(formData.respiratory_rate) : null,
                    body_condition_score: formData.body_condition_score ? parseFloat(formData.body_condition_score) : null,
                    notes: formData.notes || null,
                });

            if (error) throw error;

            // Also insert into weight_entries for backward compatibility if needed, 
            // but we'll assume health_metrics is the new standard.

            Alert.alert('Success', 'Health metrics recorded');
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

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 bg-black/60 justify-center items-center p-4 sm:p-6 lg:p-8">
                <BlurView intensity={20} className="absolute inset-0" />
                <View className="w-full max-w-xl bg-[#1C1C1E] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#2C2C2E]">
                    <View className="flex-row items-center justify-between px-6 py-5 border-b border-[#2C2C2E]">
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-[#9CA3AF] text-base font-medium">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-white text-lg font-bold">Log Health Metrics</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text className="text-[#0A84FF] text-lg font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                        <View className="space-y-8 pb-8">
                            
                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                            <TouchableOpacity 
                                onPress={handleRepeatLast}
                                className="flex-row items-center justify-center gap-2 bg-[#2C2C2E] py-3 rounded-xl border border-[#374151]"
                            >
                                <Ionicons name="reload" size={16} color="#0A84FF" />
                                <Text className="text-[#0A84FF] font-medium">Repeat Last Entry</Text>
                            </TouchableOpacity>

                            <UniversalDatePicker 
                                label="Date Recorded"
                                value={formData.date}
                                onChange={(text) => setFormData({...formData, date: text})}
                            />

                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="scale" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Weight</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 flex-row gap-4">
                                    <View className="flex-1">
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Weight</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="0.00"
                                            placeholderTextColor="#4B5563"
                                            keyboardType="numeric"
                                            value={formData.weight}
                                            onChangeText={(text) => setFormData({...formData, weight: text})}
                                        />
                                    </View>
                                    <View className="w-1/3">
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Unit</Text>
                                        <View className="flex-row bg-[#1C1C1E] rounded-xl p-1">
                                            {['kg', 'lbs'].map(u => (
                                                <TouchableOpacity 
                                                    key={u}
                                                    onPress={() => setFormData({...formData, weight_unit: u})}
                                                    className={`flex-1 py-2 rounded-lg items-center ${formData.weight_unit === u ? 'bg-[#3A3A3C]' : ''}`}
                                                >
                                                    <Text className={`font-bold ${formData.weight_unit === u ? 'text-white' : 'text-[#6B7280]'}`}>{u}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="thermometer" size={20} color="#EF4444" />
                                    <Text className="text-white text-lg font-bold">Vitals</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Temperature</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="0.0"
                                                keyboardType="numeric"
                                                value={formData.temperature}
                                                onChangeText={(text) => setFormData({...formData, temperature: text})}
                                            />
                                        </View>
                                        <View className="w-1/3">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Unit</Text>
                                            <View className="flex-row bg-[#1C1C1E] rounded-xl p-1">
                                                {['C', 'F'].map(u => (
                                                    <TouchableOpacity 
                                                        key={u}
                                                        onPress={() => setFormData({...formData, temperature_unit: u})}
                                                        className={`flex-1 py-2 rounded-lg items-center ${formData.temperature_unit === u ? 'bg-[#3A3A3C]' : ''}`}
                                                    >
                                                        <Text className={`font-bold ${formData.temperature_unit === u ? 'text-white' : 'text-[#6B7280]'}`}>{u}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Heart Rate (BPM)</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="e.g. 80"
                                                keyboardType="numeric"
                                                value={formData.heart_rate}
                                                onChangeText={(text) => setFormData({...formData, heart_rate: text})}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Respiratory (RPM)</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="e.g. 20"
                                                keyboardType="numeric"
                                                value={formData.respiratory_rate}
                                                onChangeText={(text) => setFormData({...formData, respiratory_rate: text})}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

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
                                                onPress={() => setFormData({...formData, body_condition_score: score.toString()})}
                                                className={`w-8 h-8 rounded-full items-center justify-center border ${
                                                    formData.body_condition_score === score.toString()
                                                    ? 'bg-[#0A84FF] border-[#0A84FF]'
                                                    : 'border-[#374151]'
                                                }`}
                                            >
                                                <Text className={`font-bold ${
                                                    formData.body_condition_score === score.toString() ? 'text-white' : 'text-[#6B7280]'
                                                }`}>{score}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    <Text className="text-[#6B7280] text-xs text-center mt-2">
                                        1 = Emaciated, 5 = Ideal, 9 = Obese
                                    </Text>
                                </View>
                            </View>

                            <RichTextInput
                                label="Notes"
                                placeholder="Any observations..."
                                value={formData.notes}
                                onChangeText={(text) => setFormData({...formData, notes: text})}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
