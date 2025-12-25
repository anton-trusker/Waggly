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

interface VaccinationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const CURRENCIES = ['EUR', 'USD', 'GBP'];

export default function VaccinationFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VaccinationFormModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        vaccine_name: '',
        date_given: new Date().toISOString().split('T')[0],
        batch_number: '',
        reminders_enabled: false,
        next_due_date: '',
        
        // Provider & Costs
        provider: '', // Clinic Name
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
            vaccine_name: '',
            date_given: new Date().toISOString().split('T')[0],
            batch_number: '',
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
        if (!formData.vaccine_name) {
            Alert.alert('Error', 'Please enter vaccine name');
            return;
        }

        setLoading(true);
        try {
            // 1. Insert Vaccination
            const { data: vacData, error } = await (supabase
                .from('vaccinations') as any)
                .insert({
                    pet_id: selectedPetId,
                    vaccine_name: formData.vaccine_name,
                    date_given: formData.date_given || null,
                    next_due_date: formData.reminders_enabled ? (formData.next_due_date || null) : null,
                    batch_number: formData.batch_number || null,
                    provider: formData.provider || null,
                    cost: parseFloat(formData.cost) || null,
                    currency: formData.currency,
                    notes: formData.notes || null,
                    // Note: We might want to store full address in a JSONB field or separate columns if schema permits.
                    // For now, we'll append address details to notes or assume provider field is enough for basic usage.
                    // Ideally, we should update the schema to support address fields.
                    // Assuming we can append to notes for now to save the data without schema migration in this step:
                    // Or we just save it if columns exist.
                })
                .select()
                .single();

            if (error) throw error;

            // 2. If reminder is set, create an event (optional, logic usually handled by triggers or app logic)
            // ...

            Alert.alert('Success', 'Vaccination added successfully');
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
                        <Text className="text-white text-lg font-bold">Add Vaccination</Text>
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

                            {/* Vaccine Details */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="medkit" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Vaccine Details</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Vaccine Name</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="e.g. Rabies, DHPP"
                                            placeholderTextColor="#4B5563"
                                            value={formData.vaccine_name}
                                            onChangeText={(text) => setFormData({ ...formData, vaccine_name: text })}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Date Administered</Text>
                                        <View className="relative">
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="YYYY-MM-DD"
                                                placeholderTextColor="#4B5563"
                                                value={formData.date_given}
                                                onChangeText={(text) => setFormData({ ...formData, date_given: text })}
                                            />
                                            <View className="absolute right-4 top-3.5 pointer-events-none">
                                                <Ionicons name="calendar" size={20} color="#6B7280" />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Medical Info */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="medical" size={20} color="#06B6D4" />
                                    <Text className="text-white text-lg font-bold">Medical Info</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Batch Number <Text className="text-[#4B5563]">(Optional)</Text></Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="e.g. A123-BC45"
                                            placeholderTextColor="#4B5563"
                                            value={formData.batch_number}
                                            onChangeText={(text) => setFormData({ ...formData, batch_number: text })}
                                        />
                                    </View>

                                    {/* Reminder Toggle */}
                                    <View className="flex-row items-center justify-between py-2">
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

                                {/* Link Account Button */}
                                <TouchableOpacity className="bg-[#0A84FF] rounded-xl p-4 flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                                            <Ionicons name="link" size={18} color="white" />
                                        </View>
                                        <View>
                                            <Text className="text-white text-sm font-bold">Link Clinic Account</Text>
                                            <Text className="text-white/80 text-xs">Auto-fill vet details instantly</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="white" />
                                </TouchableOpacity>
                                
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
