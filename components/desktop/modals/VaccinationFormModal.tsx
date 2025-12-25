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

interface VaccinationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const COMMON_VACCINES = ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis', 'Lyme', 'FVRCP', 'FeLV'];

export default function VaccinationFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VaccinationFormModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        vaccine_name: '',
        date_given: new Date().toISOString().split('T')[0],
        next_due_date: '',
        batch_number: '',
        
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
            vaccine_name: '',
            date_given: new Date().toISOString().split('T')[0],
            next_due_date: '',
            batch_number: '',
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
                .from('vaccinations')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('date', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    vaccine_name: data.name || prev.vaccine_name,
                    provider: data.provider || prev.provider,
                    currency: data.currency || prev.currency,
                }));
                Alert.alert('Auto-Filled', 'Details from the last vaccination have been applied.');
            } else {
                Alert.alert('Info', 'No previous vaccinations found.');
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
        if (!formData.vaccine_name) {
            Alert.alert('Error', 'Please enter vaccine name');
            return;
        }

        setLoading(true);
        try {
            const { error } = await (supabase
                .from('vaccinations') as any)
                .insert({
                    pet_id: selectedPetId,
                    name: formData.vaccine_name,
                    date: formData.date_given,
                    next_due_date: formData.reminders_enabled ? (formData.next_due_date || null) : null,
                    batch_number: formData.batch_number || null,
                    provider: formData.provider || null,
                    cost: formData.cost ? parseFloat(formData.cost) : null,
                    currency: formData.currency,
                    notes: formData.notes || null,
                });

            if (error) throw error;

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
                    <View className="flex-row items-center justify-between px-6 py-5 border-b border-[#2C2C2E]">
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-[#9CA3AF] text-base font-medium">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-white text-lg font-bold">Add Vaccination</Text>
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
                                <Text className="text-[#0A84FF] font-medium">Repeat Last Vaccination</Text>
                            </TouchableOpacity>

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
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mt-3">
                                            {COMMON_VACCINES.map(v => (
                                                <TouchableOpacity
                                                    key={v}
                                                    onPress={() => setFormData({...formData, vaccine_name: v})}
                                                    className="bg-[#1C1C1E] border border-[#374151] px-3 py-1.5 rounded-lg mr-2"
                                                >
                                                    <Text className="text-white text-xs">{v}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <UniversalDatePicker 
                                        label="Date Administered"
                                        value={formData.date_given}
                                        onChange={(text) => setFormData({...formData, date_given: text})}
                                    />

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Batch / Lot Number</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="Optional"
                                            placeholderTextColor="#4B5563"
                                            value={formData.batch_number}
                                            onChangeText={(text) => setFormData({ ...formData, batch_number: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="notifications" size={20} color="#F59E0B" />
                                    <Text className="text-white text-lg font-bold">Reminders</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-white font-medium">Set Next Due Date</Text>
                                        <Switch
                                            value={formData.reminders_enabled}
                                            onValueChange={(val) => setFormData({ ...formData, reminders_enabled: val })}
                                            trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                        />
                                    </View>
                                    {formData.reminders_enabled && (
                                        <UniversalDatePicker 
                                            label="Next Due Date"
                                            value={formData.next_due_date}
                                            onChange={(text) => setFormData({...formData, next_due_date: text})}
                                        />
                                    )}
                                </View>
                            </View>

                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="location" size={20} color="#EC4899" />
                                    <Text className="text-white text-lg font-bold">Provider & Cost</Text>
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
                                label="Notes / Side Effects"
                                placeholder="Any reactions?"
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
