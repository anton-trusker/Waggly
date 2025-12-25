import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { cssInterop } from 'react-native-css-interop';
import AddressFormSection from './AddressFormSection';

// Apply cssInterop to components if not already done globally
cssInterop(BlurView, { className: 'style' });

interface TreatmentFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const TREATMENT_TYPES = ['Medication', 'Therapy', 'Surgery', 'Other'];
const CURRENCIES = ['EUR', 'USD', 'GBP'];

export default function TreatmentFormModal({ visible, onClose, petId: initialPetId, onSuccess }: TreatmentFormModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        treatment_type: 'Medication',
        name: '',
        date_administered: new Date().toISOString().split('T')[0],
        frequency_duration: '',
        reminders_enabled: false,
        next_due_date: '',
        
        // Provider & Costs
        provider: '', // Clinic/Vet Name
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        
        cost: '',
        currency: 'EUR',
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
            treatment_type: 'Medication',
            name: '',
            date_administered: new Date().toISOString().split('T')[0],
            frequency_duration: '',
            reminders_enabled: false,
            next_due_date: '',
            provider: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            cost: '',
            currency: 'EUR',
            notes: '',
        });
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    }

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!formData.name) {
            Alert.alert('Error', 'Please enter treatment name');
            return;
        }

        setLoading(true);
        try {
            const { error } = await (supabase
                .from('treatments') as any)
                .insert({
                    pet_id: selectedPetId,
                    treatment_type: formData.treatment_type,
                    diagnosis: formData.name, // Using name as diagnosis for now based on schema assumptions
                    veterinarian: formData.provider || null,
                    treatment_date: formData.date_administered || null,
                    frequency: formData.frequency_duration || null,
                    notes: formData.notes || null,
                    cost: parseFloat(formData.cost) || null,
                    currency: formData.currency,
                    // Note: reminders_enabled might not be in schema, ignoring for now or assuming handled elsewhere
                });

            if (error) throw error;

            Alert.alert('Success', 'Treatment added successfully');
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
                        <Text className="text-white text-lg font-bold">Add Treatment</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text className="text-[#0A84FF] text-lg font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                        <View className="space-y-8 pb-8">
                            
                            {/* Who is this for? */}
                            <View>
                                <Text className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider mb-4">WHO IS THIS FOR?</Text>
                                <View className="flex-row flex-wrap gap-4">
                                    {petsLoading ? (
                                        <ActivityIndicator color="#0A84FF" />
                                    ) : (
                                        pets.map((pet) => (
                                            <TouchableOpacity 
                                                key={pet.id} 
                                                onPress={() => setSelectedPetId(pet.id)}
                                                className="items-center gap-2"
                                            >
                                                <View className={`w-16 h-16 rounded-full items-center justify-center ${selectedPetId === pet.id ? 'bg-[#0A84FF]' : 'bg-[#2C2C2E]'}`}>
                                                    {pet.image_url ? (
                                                        <Image source={{ uri: pet.image_url }} className="w-14 h-14 rounded-full" />
                                                    ) : (
                                                        <Ionicons name="paw" size={32} color={selectedPetId === pet.id ? '#FFFFFF' : '#6B7280'} />
                                                    )}
                                                    {selectedPetId === pet.id && (
                                                        <View className="absolute -bottom-1 -right-1 bg-[#22C55E] rounded-full p-0.5 border-2 border-[#1C1C1E]">
                                                            <Ionicons name="checkmark" size={12} color="white" />
                                                        </View>
                                                    )}
                                                </View>
                                                <Text className={`text-sm font-medium ${selectedPetId === pet.id ? 'text-[#0A84FF]' : 'text-[#6B7280]'}`}>
                                                    {pet.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </View>
                            </View>

                            {/* Treatment Details */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="bandage" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Treatment Details</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    {/* Treatment Type Pills */}
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Treatment Type</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                            {TREATMENT_TYPES.map(type => (
                                                <TouchableOpacity
                                                    key={type}
                                                    onPress={() => setFormData({...formData, treatment_type: type})}
                                                    className={`px-4 py-2 rounded-full mr-2 border ${
                                                        formData.treatment_type === type 
                                                        ? 'bg-[#0A84FF] border-[#0A84FF]' 
                                                        : 'bg-transparent border-[#4B5563]'
                                                    }`}
                                                >
                                                    <Text className={`text-sm font-medium ${formData.treatment_type === type ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                        {type}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Treatment Name</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="e.g. Flea & Tick Prevention"
                                            placeholderTextColor="#4B5563"
                                            value={formData.name}
                                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                                        />
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Date Administered</Text>
                                            <View className="relative">
                                                <TextInput
                                                    className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                    placeholder="YYYY-MM-DD"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.date_administered}
                                                    onChangeText={(text) => setFormData({ ...formData, date_administered: text })}
                                                />
                                                <View className="absolute right-3 top-3.5 pointer-events-none">
                                                    <Ionicons name="calendar" size={18} color="#6B7280" />
                                                </View>
                                            </View>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Frequency / Duration</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="e.g. Daily for 7 days"
                                                placeholderTextColor="#4B5563"
                                                value={formData.frequency_duration}
                                                onChangeText={(text) => setFormData({ ...formData, frequency_duration: text })}
                                            />
                                        </View>
                                    </View>

                                    {/* Reminder Toggle */}
                                    <View className="flex-row items-center justify-between py-2 border-t border-[#3A3A3C] mt-2 pt-4">
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-8 h-8 rounded-full bg-[#1C1C1E] items-center justify-center">
                                                <Ionicons name="notifications" size={16} color="#0A84FF" />
                                            </View>
                                            <View>
                                                <Text className="text-white text-sm font-bold">Set Reminder</Text>
                                                <Text className="text-[#9CA3AF] text-xs">Alert me when due</Text>
                                            </View>
                                        </View>
                                        <Switch
                                            value={formData.reminders_enabled}
                                            onValueChange={(val) => setFormData({ ...formData, reminders_enabled: val })}
                                            trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                            thumbColor={'#FFFFFF'}
                                        />
                                    </View>

                                    {formData.reminders_enabled && (
                                        <View>
                                            <View className="relative">
                                                <TextInput
                                                    className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                    placeholder="Next Due Date (YYYY-MM-DD)"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.next_due_date}
                                                    onChangeText={(text) => setFormData({ ...formData, next_due_date: text })}
                                                />
                                                <View className="absolute right-4 top-3.5 pointer-events-none">
                                                    <Ionicons name="calendar" size={20} color="#6B7280" />
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Provider & Costs */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="wallet" size={20} color="#EC4899" />
                                    <Text className="text-white text-lg font-bold">Provider & Costs</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <AddressFormSection
                                        isDark={true}
                                        locationName={formData.provider}
                                        setLocationName={(text) => setFormData({...formData, provider: text})}
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
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Currency</Text>
                                            <View className="bg-[#1C1C1E] rounded-xl overflow-hidden">
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
                                                    {CURRENCIES.map(curr => (
                                                        <TouchableOpacity 
                                                            key={curr}
                                                            onPress={() => setFormData({...formData, currency: curr})}
                                                            className={`px-3 py-2 rounded-lg mr-2 ${formData.currency === curr ? 'bg-[#3A3A3C]' : ''}`}
                                                        >
                                                            <Text className={`text-sm font-bold ${formData.currency === curr ? 'text-white' : 'text-[#6B7280]'}`}>
                                                                {curr}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Total Cost</Text>
                                            <View className="relative">
                                                <TextInput
                                                    className="w-full bg-[#1C1C1E] rounded-xl pl-10 pr-4 py-3 text-white text-base"
                                                    placeholder="0.00"
                                                    placeholderTextColor="#4B5563"
                                                    keyboardType="numeric"
                                                    value={formData.cost}
                                                    onChangeText={(text) => setFormData({ ...formData, cost: text })}
                                                />
                                                <View className="absolute left-3 top-3.5 pointer-events-none">
                                                    <Ionicons name="cash-outline" size={20} color="#6B7280" />
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Notes</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl p-4 text-white text-base min-h-[100px]"
                                            placeholder="Any side effects or observations?"
                                            placeholderTextColor="#4B5563"
                                            multiline
                                            textAlignVertical="top"
                                            value={formData.notes}
                                            onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Attach Record Image */}
                            <TouchableOpacity className="border border-dashed border-[#0A84FF] bg-[#0A84FF]/10 rounded-3xl p-8 items-center justify-center gap-2">
                                <View className="w-12 h-12 rounded-full bg-[#0A84FF]/20 items-center justify-center">
                                    <Ionicons name="camera" size={24} color="#0A84FF" />
                                </View>
                                <Text className="text-white font-bold text-base">Attach Record Image</Text>
                                <Text className="text-[#9CA3AF] text-sm">Photo of sticker or certificate</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
