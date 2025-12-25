import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image, Switch } from 'react-native';
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

interface VisitFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const VISIT_TYPES = ['Routine Check-up', 'Emergency Visit', 'Vaccination', 'Specialist', 'Dental', 'Surgery', 'Lab Work', 'Other'];
const URGENCY_LEVELS = [
    { label: 'Routine', value: 'routine', color: '#10B981' },
    { label: 'Urgent', value: 'urgent', color: '#FBBF24' },
    { label: 'Emergency', value: 'emergency', color: '#EF4444' },
];
const COMMON_SYMPTOMS = ['Vomiting', 'Diarrhea', 'Limping', 'Ear Infection', 'Eye Discharge', 'Fever', 'Loss of Appetite', 'Coughing'];

export default function VisitFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VisitFormModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        visit_type: 'Routine Check-up',
        urgency: 'routine',
        date: new Date().toISOString().split('T')[0],
        time: '',
        
        // Provider & Location
        provider: '', // Clinic Name
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        
        reason: '',
        symptoms: [] as string[],
        diagnosis: '',
        notes: '',
        
        cost: '',
        currency: 'EUR',
        
        follow_up_date: '',
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
            visit_type: 'Routine Check-up',
            urgency: 'routine',
            date: new Date().toISOString().split('T')[0],
            time: '',
            provider: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            reason: '',
            symptoms: [],
            diagnosis: '',
            notes: '',
            cost: '',
            currency: 'EUR',
            follow_up_date: '',
        });
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    }

    const toggleSymptom = (symptom: string) => {
        if (formData.symptoms.includes(symptom)) {
            setFormData({...formData, symptoms: formData.symptoms.filter(s => s !== symptom)});
        } else {
            setFormData({...formData, symptoms: [...formData.symptoms, symptom]});
        }
    };

    const handleRepeatLast = async () => {
        if (!selectedPetId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('medical_visits')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('date', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    provider: data.clinic_name || '',
                    address: data.clinic_address || '',
                    visit_type: data.visit_type || prev.visit_type,
                    currency: data.currency || prev.currency,
                }));
                Alert.alert('Auto-Filled', 'Details from the last visit have been applied.');
            } else {
                Alert.alert('Info', 'No previous visits found for this pet.');
            }
        } catch (err) {
            console.log('Error fetching last visit:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!formData.date) {
            Alert.alert('Error', 'Please enter visit date');
            return;
        }

        setLoading(true);
        try {
            const { error } = await (supabase
                .from('medical_visits') as any)
                .insert({
                    pet_id: selectedPetId,
                    visit_type: formData.visit_type,
                    urgency: formData.urgency,
                    date: formData.date,
                    reason: formData.reason || formData.visit_type,
                    symptoms: formData.symptoms,
                    diagnosis: formData.diagnosis,
                    clinic_name: formData.provider,
                    clinic_address: formData.address, // We might want to store full JSON address if schema allows
                    notes: formData.notes,
                    cost: formData.cost ? parseFloat(formData.cost) : null,
                    currency: formData.currency,
                    follow_up_date: formData.follow_up_date || null,
                });

            if (error) throw error;

            Alert.alert('Success', 'Visit added successfully');
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
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-5 border-b border-[#2C2C2E]">
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-[#9CA3AF] text-base font-medium">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-white text-lg font-bold">Add New Visit</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text className="text-[#0A84FF] text-lg font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                        <View className="space-y-8 pb-8">
                            
                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />
                            
                            {/* Smart Action: Repeat Last */}
                            <TouchableOpacity 
                                onPress={handleRepeatLast}
                                className="flex-row items-center justify-center gap-2 bg-[#2C2C2E] py-3 rounded-xl border border-[#374151]"
                            >
                                <Ionicons name="reload" size={16} color="#0A84FF" />
                                <Text className="text-[#0A84FF] font-medium">Repeat Last Visit Details</Text>
                            </TouchableOpacity>

                            {/* Visit Details */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="calendar" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Visit Details</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    {/* Urgency Selector */}
                                    <View className="flex-row gap-2 mb-2">
                                        {URGENCY_LEVELS.map((level) => (
                                            <TouchableOpacity
                                                key={level.value}
                                                onPress={() => setFormData({...formData, urgency: level.value})}
                                                className={`flex-1 py-2 items-center rounded-lg border ${
                                                    formData.urgency === level.value 
                                                    ? `bg-[${level.color}]/20 border-[${level.color}]` 
                                                    : 'border-[#374151]'
                                                }`}
                                                style={{ 
                                                    backgroundColor: formData.urgency === level.value ? `${level.color}20` : 'transparent',
                                                    borderColor: formData.urgency === level.value ? level.color : '#374151'
                                                }}
                                            >
                                                <Text style={{ color: formData.urgency === level.value ? level.color : '#9CA3AF' }} className="font-bold text-xs uppercase">
                                                    {level.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* Visit Type */}
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Visit Type</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                            {VISIT_TYPES.map(type => (
                                                <TouchableOpacity
                                                    key={type}
                                                    onPress={() => setFormData({...formData, visit_type: type})}
                                                    className={`px-4 py-2 rounded-full mr-2 border ${
                                                        formData.visit_type === type 
                                                        ? 'bg-[#0A84FF] border-[#0A84FF]' 
                                                        : 'bg-transparent border-[#4B5563]'
                                                    }`}
                                                >
                                                    <Text className={`text-sm font-medium ${formData.visit_type === type ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                        {type}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <UniversalDatePicker 
                                        label="Date"
                                        value={formData.date}
                                        onChange={(text) => setFormData({...formData, date: text})}
                                    />

                                    <RichTextInput
                                        label="Reason for Visit"
                                        placeholder="e.g. Annual check-up, ear infection..."
                                        value={formData.reason}
                                        onChangeText={(text) => setFormData({...formData, reason: text})}
                                        minHeight={60}
                                    />
                                </View>
                            </View>

                            {/* Symptoms */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="pulse" size={20} color="#EF4444" />
                                    <Text className="text-white text-lg font-bold">Symptoms & Diagnosis</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row flex-wrap gap-2">
                                        {COMMON_SYMPTOMS.map(symptom => (
                                            <TouchableOpacity
                                                key={symptom}
                                                onPress={() => toggleSymptom(symptom)}
                                                className={`px-3 py-1.5 rounded-lg border ${
                                                    formData.symptoms.includes(symptom)
                                                    ? 'bg-[#EF4444]/20 border-[#EF4444]'
                                                    : 'border-[#374151]'
                                                }`}
                                            >
                                                <Text className={`text-xs font-medium ${
                                                    formData.symptoms.includes(symptom) ? 'text-[#EF4444]' : 'text-[#9CA3AF]'
                                                }`}>
                                                    {symptom}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <RichTextInput
                                        label="Diagnosis / Assessment"
                                        placeholder="What did the vet say?"
                                        value={formData.diagnosis}
                                        onChangeText={(text) => setFormData({...formData, diagnosis: text})}
                                    />
                                </View>
                            </View>

                            {/* Provider & Location */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="location" size={20} color="#EC4899" />
                                    <Text className="text-white text-lg font-bold">Provider & Location</Text>
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
                                </View>
                            </View>

                            {/* Cost */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="cash" size={20} color="#10B981" />
                                    <Text className="text-white text-lg font-bold">Cost</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 flex-row gap-4">
                                    <View className="flex-1">
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Total Cost</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="0.00"
                                            placeholderTextColor="#4B5563"
                                            keyboardType="numeric"
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
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
