import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { cssInterop } from 'react-native-css-interop';
import PetSelector from './shared/PetSelector';
import SmartAddressInput from './shared/SmartAddressInput';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';

// Apply cssInterop to components if not already done globally
cssInterop(BlurView, { className: 'style' });

interface TreatmentFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const TREATMENT_TYPES = ['Medication', 'Supplement', 'Therapy', 'Topical', 'Injection', 'Other'];
const DOSAGE_UNITS = ['mg', 'ml', 'tablet', 'capsule', 'drop', 'g', 'IU'];
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Every 12 hours', 'As needed'];

export default function TreatmentFormModal({ visible, onClose, petId: initialPetId, onSuccess }: TreatmentFormModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        treatment_type: 'Medication',
        name: '',
        dosage_value: '',
        dosage_unit: 'mg',
        frequency: 'Once daily',
        
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true,
        
        provider: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        
        cost: '',
        currency: 'EUR',
        notes: '',
        reminders_enabled: true,
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
            treatment_type: 'Medication',
            name: '',
            dosage_value: '',
            dosage_unit: 'mg',
            frequency: 'Once daily',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            is_active: true,
            provider: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            cost: '',
            currency: 'EUR',
            notes: '',
            reminders_enabled: true,
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
                .from('medications')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    name: data.name || prev.name,
                    dosage_value: data.dosage_value?.toString() || prev.dosage_value,
                    dosage_unit: data.dosage_unit || prev.dosage_unit,
                    frequency: data.frequency || prev.frequency,
                    currency: data.currency || prev.currency,
                }));
                Alert.alert('Auto-Filled', 'Details from the last medication have been applied.');
            } else {
                Alert.alert('Info', 'No previous medications found.');
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
        if (!formData.name) {
            Alert.alert('Error', 'Please enter medication name');
            return;
        }

        setLoading(true);
        try {
            const { error } = await (supabase
                .from('medications') as any)
                .insert({
                    pet_id: selectedPetId,
                    name: formData.name,
                    dosage_value: formData.dosage_value ? parseFloat(formData.dosage_value) : null,
                    dosage_unit: formData.dosage_unit,
                    frequency: formData.frequency,
                    start_date: formData.start_date,
                    end_date: formData.end_date || null,
                    reminders_enabled: formData.reminders_enabled,
                    cost: formData.cost ? parseFloat(formData.cost) : null,
                    currency: formData.currency,
                    notes: formData.notes || null,
                });

            if (error) throw error;

            Alert.alert('Success', 'Medication added successfully');
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
                        <Text className="text-white text-lg font-bold">Add Treatment</Text>
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
                                <Text className="text-[#0A84FF] font-medium">Repeat Last Medication</Text>
                            </TouchableOpacity>

                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="medkit" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Medication Details</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Medication Name</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="e.g. Amoxicillin"
                                            placeholderTextColor="#4B5563"
                                            value={formData.name}
                                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                                        />
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Dosage</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="e.g. 50"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.dosage_value}
                                                onChangeText={(text) => setFormData({ ...formData, dosage_value: text })}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Unit</Text>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-2">
                                                {DOSAGE_UNITS.map(unit => (
                                                    <TouchableOpacity
                                                        key={unit}
                                                        onPress={() => setFormData({...formData, dosage_unit: unit})}
                                                        className={`px-3 py-1.5 rounded-lg mr-2 border ${
                                                            formData.dosage_unit === unit 
                                                            ? 'bg-[#0A84FF] border-[#0A84FF]' 
                                                            : 'border-[#374151]'
                                                        }`}
                                                    >
                                                        <Text className={`text-xs ${formData.dosage_unit === unit ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                            {unit}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Frequency</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                            {FREQUENCIES.map(freq => (
                                                <TouchableOpacity
                                                    key={freq}
                                                    onPress={() => setFormData({...formData, frequency: freq})}
                                                    className={`px-3 py-1.5 rounded-lg mr-2 border ${
                                                        formData.frequency === freq 
                                                        ? 'bg-[#0A84FF] border-[#0A84FF]' 
                                                        : 'border-[#374151]'
                                                    }`}
                                                >
                                                    <Text className={`text-xs ${formData.frequency === freq ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                        {freq}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>

                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="calendar" size={20} color="#F59E0B" />
                                    <Text className="text-white text-lg font-bold">Schedule</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <UniversalDatePicker 
                                        label="Start Date"
                                        value={formData.start_date}
                                        onChange={(text) => setFormData({...formData, start_date: text})}
                                    />
                                    <UniversalDatePicker 
                                        label="End Date (Optional)"
                                        value={formData.end_date}
                                        onChange={(text) => setFormData({...formData, end_date: text})}
                                        placeholder="Ongoing if empty"
                                    />
                                    <View className="flex-row items-center justify-between pt-2">
                                        <Text className="text-white font-medium">Enable Reminders</Text>
                                        <Switch
                                            value={formData.reminders_enabled}
                                            onValueChange={(val) => setFormData({ ...formData, reminders_enabled: val })}
                                            trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="location" size={20} color="#EC4899" />
                                    <Text className="text-white text-lg font-bold">Pharmacy / Provider</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <SmartAddressInput
                                        providerName={formData.provider}
                                        setProviderName={(text) => setFormData({...formData, provider: text})}
                                        address={formData.address}
                                        setAddress={(text) => setFormData({...formData, address: text})}
                                        city={formData.city}
                                        setCity={(text) => setFormData({...formData, city: text})}
                                        state={formData.state}
                                        setState={(text) => setFormData({...formData, state: text})}
                                        zip={formData.zip}
                                        setZip={(text) => setFormData({...formData, zip: text})}
                                        country={formData.country}
                                        setCountry={(text) => setFormData({...formData, country: text})}
                                    />
                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Cost</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="0.00"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.cost}
                                                onChangeText={(text) => setFormData({...formData, cost: text})}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Currency</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                value={formData.currency}
                                                onChangeText={(text) => setFormData({...formData, currency: text})}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <RichTextInput
                                label="Instructions / Notes"
                                placeholder="e.g. Give with food..."
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
