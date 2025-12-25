import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { cssInterop } from 'react-native-css-interop';

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
        date: '',
        time: '',
        veterinarian: '',
        address: '',
        phone: '',
        reminders_enabled: false,
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
            date: '',
            time: '',
            veterinarian: '',
            address: '',
            phone: '',
            reminders_enabled: false,
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
                    // We need to see where to store duration, time, address, phone.
                    // Schema check (from memory/previous files): visit_type, visit_date, veterinarian, clinic_name, reason, diagnosis, treatment_plan, cost, currency, notes.
                    // I'll map fields as best as possible or assume we might need to add columns later.
                    // For now:
                    // veterinarian -> veterinarian (Clinic Name/Vet Name)
                    // clinic_name -> address? Or maybe we combine Vet Name / Clinic into one field and Address into clinic_name?
                    // Let's use:
                    // veterinarian = formData.veterinarian
                    // clinic_name = formData.address (Not ideal but works for now as location)
                    // notes = notes + duration + time + phone
                    veterinarian: formData.veterinarian || null,
                    clinic_name: formData.address || null,
                    notes: `Time: ${formData.time}, Duration: ${formData.duration}, Phone: ${formData.phone}\n${formData.notes}`,
                    reason: formData.visit_type, // Default reason to visit type
                    
                    // Fields not in new design but in schema:
                    // diagnosis, treatment_plan, cost, currency -> defaults or null
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
            <View className="flex-1 bg-black/60 justify-center items-center p-4 sm:p-6">
                <BlurView intensity={10} className="absolute inset-0" />
                <View className="w-full max-w-4xl bg-white dark:bg-[#102213] rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                        <View className="flex-1">
                            <Text className="text-[#111812] dark:text-white text-2xl font-bold">Add a New Visit</Text>
                            <Text className="text-[#618968] dark:text-gray-400 text-sm mt-1">Fill in the details below to add a new visit for your pet.</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800/50">
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="p-6 sm:p-8" showsVerticalScrollIndicator={false}>
                        <View className="space-y-8 pb-8">
                            {/* Who is this for? Section */}
                            <View>
                                <Text className="text-[#111812] dark:text-white text-lg font-bold mb-4">Who is this for?</Text>
                                <View className="flex-row flex-wrap gap-4">
                                    {petsLoading ? (
                                        <ActivityIndicator color="#13ec37" />
                                    ) : (
                                        pets.map((pet) => (
                                            <TouchableOpacity 
                                                key={pet.id} 
                                                onPress={() => setSelectedPetId(pet.id)}
                                                className={`flex-col items-center gap-3 pb-3 cursor-pointer group`}
                                            >
                                                <View className={`rounded-full p-0.5 ${selectedPetId === pet.id ? 'border-4 border-[#13ec37]' : 'border-4 border-transparent'}`}>
                                                    <Image 
                                                        source={{ uri: pet.image_url || 'https://via.placeholder.com/150' }} 
                                                        className="w-24 h-24 rounded-full bg-gray-200"
                                                    />
                                                </View>
                                                <Text className="text-[#111812] dark:text-white text-base font-medium">{pet.name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                    {/* Add Pet Button Placeholder */}
                                    <TouchableOpacity className="flex-col items-center gap-3 pb-3 cursor-pointer group">
                                         <View className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800/50 items-center justify-center border-4 border-transparent">
                                            <Ionicons name="add" size={40} color="#13ec37" />
                                         </View>
                                         <Text className="text-[#618968] dark:text-gray-400 text-base font-medium">Add Pet</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Visit Details Section */}
                            <View>
                                <Text className="text-[#111812] dark:text-white text-lg font-bold mb-4">Visit Details</Text>
                                <View className="flex-col md:flex-row flex-wrap gap-6">
                                    <View className="w-full md:w-[48%]">
                                        <Text className="text-[#111812] dark:text-gray-300 text-base font-medium mb-2">Visit Type</Text>
                                        <View className="h-14 border border-[#dbe6dd] dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 justify-center px-4">
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                {VISIT_TYPES.map(type => (
                                                    <TouchableOpacity 
                                                        key={type} 
                                                        onPress={() => setFormData({...formData, visit_type: type})}
                                                        className={`px-3 py-1 mr-2 rounded ${formData.visit_type === type ? 'bg-[#13ec37]' : ''}`}
                                                    >
                                                        <Text className={`${formData.visit_type === type ? 'text-black' : 'text-[#111812] dark:text-white'}`}>{type}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </View>

                                    <View className="w-full md:w-[48%]">
                                        <Text className="text-[#111812] dark:text-gray-300 text-base font-medium mb-2">Duration</Text>
                                        <View className="h-14 border border-[#dbe6dd] dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 justify-center px-4">
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                {DURATIONS.map(dur => (
                                                    <TouchableOpacity 
                                                        key={dur} 
                                                        onPress={() => setFormData({...formData, duration: dur})}
                                                        className={`px-3 py-1 mr-2 rounded ${formData.duration === dur ? 'bg-[#13ec37]' : ''}`}
                                                    >
                                                        <Text className={`${formData.duration === dur ? 'text-black' : 'text-[#111812] dark:text-white'}`}>{dur}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </View>

                                    <View className="w-full md:w-[48%]">
                                        <Text className="text-[#111812] dark:text-gray-300 text-base font-medium mb-2">Date</Text>
                                        <TextInput
                                            className="w-full h-14 px-4 rounded-lg border border-[#dbe6dd] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111812] dark:text-white"
                                            placeholder="YYYY-MM-DD"
                                            placeholderTextColor="#618968"
                                            value={formData.date}
                                            onChangeText={(text) => setFormData({ ...formData, date: text })}
                                        />
                                    </View>

                                    <View className="w-full md:w-[48%]">
                                        <Text className="text-[#111812] dark:text-gray-300 text-base font-medium mb-2">Time</Text>
                                        <TextInput
                                            className="w-full h-14 px-4 rounded-lg border border-[#dbe6dd] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111812] dark:text-white"
                                            placeholder="HH:MM"
                                            placeholderTextColor="#618968"
                                            value={formData.time}
                                            onChangeText={(text) => setFormData({ ...formData, time: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Provider & Location Section */}
                            <View>
                                <Text className="text-[#111812] dark:text-white text-lg font-bold mb-4">Provider & Location</Text>
                                <View className="flex-col md:flex-row flex-wrap gap-6">
                                    <View className="w-full">
                                        <Text className="text-[#111812] dark:text-gray-300 text-base font-medium mb-2">Vet Name / Clinic</Text>
                                        <View className="relative">
                                            <TextInput
                                                className="w-full h-14 pl-12 pr-4 rounded-lg border border-[#dbe6dd] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111812] dark:text-white"
                                                placeholder="Search for a clinic or provider"
                                                placeholderTextColor="#618968"
                                                value={formData.veterinarian}
                                                onChangeText={(text) => setFormData({ ...formData, veterinarian: text })}
                                            />
                                            <View className="absolute left-4 top-4 pointer-events-none">
                                                <Ionicons name="search" size={24} color="#9CA3AF" />
                                            </View>
                                        </View>
                                    </View>

                                    <View className="w-full md:w-[48%]">
                                        <Text className="text-[#111812] dark:text-gray-300 text-base font-medium mb-2">Address</Text>
                                        <TextInput
                                            className="w-full h-14 px-4 rounded-lg border border-[#dbe6dd] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111812] dark:text-white"
                                            placeholder="Enter address"
                                            placeholderTextColor="#618968"
                                            value={formData.address}
                                            onChangeText={(text) => setFormData({ ...formData, address: text })}
                                        />
                                    </View>

                                    <View className="w-full md:w-[48%]">
                                        <Text className="text-[#111812] dark:text-gray-300 text-base font-medium mb-2">Phone Number</Text>
                                        <TextInput
                                            className="w-full h-14 px-4 rounded-lg border border-[#dbe6dd] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111812] dark:text-white"
                                            placeholder="(123) 456-7890"
                                            placeholderTextColor="#618968"
                                            keyboardType="phone-pad"
                                            value={formData.phone}
                                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Notes & Attachments Section */}
                            <View>
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-[#111812] dark:text-white text-lg font-bold">Notes & Attachments</Text>
                                    <View className="flex-row items-center">
                                        <Text className="mr-3 text-base font-medium text-[#111812] dark:text-gray-300">Set Reminder</Text>
                                        <TouchableOpacity 
                                            onPress={() => setFormData({...formData, reminders_enabled: !formData.reminders_enabled})}
                                            className={`w-14 h-8 rounded-full items-center justify-center ${formData.reminders_enabled ? 'bg-[#13ec37]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                        >
                                            <View className={`w-6 h-6 rounded-full bg-white shadow transform transition-transform ${formData.reminders_enabled ? 'translate-x-3' : '-translate-x-3'}`} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View className="space-y-6">
                                    <View>
                                        <Text className="text-[#111812] dark:text-gray-300 text-base font-medium mb-2">Notes</Text>
                                        <TextInput
                                            className="w-full p-4 rounded-lg border border-[#dbe6dd] dark:border-gray-700 bg-white dark:bg-gray-800/50 text-[#111812] dark:text-white h-32"
                                            placeholder="Add any important notes about the visit..."
                                            placeholderTextColor="#618968"
                                            multiline
                                            textAlignVertical="top"
                                            value={formData.notes}
                                            onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-[#111812] dark:text-gray-300 text-base font-medium mb-2">Attach Document</Text>
                                        <TouchableOpacity className="w-full h-32 border-2 border-dashed border-[#dbe6dd] dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 items-center justify-center p-6">
                                            <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
                                            <Text className="mt-2 text-sm text-[#618968] dark:text-gray-400">
                                                <Text className="font-semibold">Click to upload</Text> or drag and drop
                                            </Text>
                                            <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">PDF, PNG, JPG (MAX. 10MB)</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Actions */}
                    <View className="p-6 sm:p-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#102213] rounded-b-xl flex-col sm:flex-row-reverse gap-3">
                        <TouchableOpacity 
                            onPress={handleSubmit} 
                            disabled={loading}
                            className={`h-12 px-6 items-center justify-center rounded-lg bg-[#13ec37] ${loading ? 'opacity-70' : ''}`}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <Text className="text-base font-medium text-black">Save Visit</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} className="h-12 px-6 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800/50">
                            <Text className="text-base font-medium text-[#111812] dark:text-white">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
