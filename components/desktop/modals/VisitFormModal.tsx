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

interface VisitFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const VISIT_TYPES = ['Vet Check-up', 'Grooming', 'Training', 'Emergency'];
const DURATIONS = ['30 minutes', '1 hour', '1 hour 30 minutes', '2 hours'];

export default function VisitFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VisitFormModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        visit_type: 'Vet Check-up',
        duration: '30 minutes',
        date: new Date().toISOString().split('T')[0],
        time: '',
        reminders_enabled: false,
        
        // Provider & Location
        provider: '', // Vet Name / Clinic
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        
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
            visit_type: 'Vet Check-up',
            duration: '30 minutes',
            date: new Date().toISOString().split('T')[0],
            time: '',
            reminders_enabled: false,
            provider: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            phone: '',
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
                    visit_date: formData.date,
                    veterinarian: formData.provider || null,
                    clinic_name: formData.address || null, // Mapping address to clinic_name as per previous logic, or update schema ideally
                    notes: `Time: ${formData.time}, Duration: ${formData.duration}, Phone: ${formData.phone}\n${formData.notes}`,
                    reason: formData.visit_type, 
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
                        <Text className="text-white text-lg font-bold">Add a New Visit</Text>
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
                                    
                                    {/* Add Pet Button */}
                                    <TouchableOpacity className="items-center gap-2">
                                        <View className="w-16 h-16 rounded-full items-center justify-center bg-[#2C2C2E] border border-dashed border-[#4B5563]">
                                            <Ionicons name="add" size={32} color="#0A84FF" />
                                        </View>
                                        <Text className="text-sm font-medium text-[#0A84FF]">Add Pet</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Visit Details */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="calendar" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Visit Details</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    {/* Visit Type Pills */}
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

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Duration</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                            {DURATIONS.map(dur => (
                                                <TouchableOpacity
                                                    key={dur}
                                                    onPress={() => setFormData({...formData, duration: dur})}
                                                    className={`px-4 py-2 rounded-full mr-2 border ${
                                                        formData.duration === dur 
                                                        ? 'bg-[#0A84FF] border-[#0A84FF]' 
                                                        : 'bg-transparent border-[#4B5563]'
                                                    }`}
                                                >
                                                    <Text className={`text-sm font-medium ${formData.duration === dur ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                        {dur}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Date</Text>
                                            <View className="relative">
                                                <TextInput
                                                    className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                    placeholder="YYYY-MM-DD"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.date}
                                                    onChangeText={(text) => setFormData({ ...formData, date: text })}
                                                />
                                                <View className="absolute right-3 top-3.5 pointer-events-none">
                                                    <Ionicons name="calendar" size={18} color="#6B7280" />
                                                </View>
                                            </View>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Time</Text>
                                            <View className="relative">
                                                <TextInput
                                                    className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                    placeholder="HH:MM"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.time}
                                                    onChangeText={(text) => setFormData({ ...formData, time: text })}
                                                />
                                                <View className="absolute right-3 top-3.5 pointer-events-none">
                                                    <Ionicons name="time" size={18} color="#6B7280" />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Provider & Location */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="location" size={20} color="#EC4899" />
                                    <Text className="text-white text-lg font-bold">Provider & Location</Text>
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

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Phone Number</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="(123) 456-7890"
                                            placeholderTextColor="#4B5563"
                                            keyboardType="phone-pad"
                                            value={formData.phone}
                                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Notes & Attachments */}
                            <View>
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="document-text" size={20} color="#F59E0B" />
                                        <Text className="text-white text-lg font-bold">Notes & Attachments</Text>
                                    </View>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Notes</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl p-4 text-white text-base min-h-[100px]"
                                            placeholder="Add any important notes about the visit..."
                                            placeholderTextColor="#4B5563"
                                            multiline
                                            textAlignVertical="top"
                                            value={formData.notes}
                                            onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                        />
                                    </View>

                                    {/* Attach Record Image */}
                                    <TouchableOpacity className="border border-dashed border-[#0A84FF] bg-[#0A84FF]/10 rounded-xl p-6 items-center justify-center gap-2">
                                        <Ionicons name="cloud-upload" size={24} color="#0A84FF" />
                                        <Text className="text-white font-bold text-sm">Click to upload <Text className="text-[#9CA3AF] font-normal">or drag and drop</Text></Text>
                                        <Text className="text-[#9CA3AF] text-xs">PDF, PNG, JPG (MAX. 10MB)</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
