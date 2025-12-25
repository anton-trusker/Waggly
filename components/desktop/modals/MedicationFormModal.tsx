import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { cssInterop } from 'react-native-css-interop';

// Apply cssInterop to components if not already done globally
cssInterop(BlurView, { className: 'style' });

interface MedicationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const DOSAGE_UNITS = ['mg', 'ml', 'pills', 'drops'];
const FREQUENCIES = ['Once a day', 'Twice a day', 'Every 8 hours', 'As needed'];
const CURRENCIES = ['EUR', 'USD', 'GBP'];

export default function MedicationFormModal({ visible, onClose, petId: initialPetId, onSuccess }: MedicationFormModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        dosage_value: '',
        dosage_unit: 'mg',
        frequency: 'Once a day',
        start_date: '',
        end_date: '',
        reminders_enabled: false,
        pharmacy: '',
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
            name: '',
            dosage_value: '',
            dosage_unit: 'mg',
            frequency: 'Once a day',
            start_date: '',
            end_date: '',
            reminders_enabled: false,
            pharmacy: '',
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
                    dosage_value: parseFloat(formData.dosage_value) || null,
                    dosage_unit: formData.dosage_unit,
                    frequency: formData.frequency,
                    start_date: formData.start_date || null,
                    end_date: formData.end_date || null,
                    reminders_enabled: formData.reminders_enabled,
                    provider: formData.pharmacy || null, // Mapping pharmacy to provider field if it exists, or just storing it
                    cost: parseFloat(formData.cost) || null,
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
            <View className="flex-1 bg-black/40 justify-center items-center p-4 sm:p-6 lg:p-8">
                <BlurView intensity={10} className="absolute inset-0" />
                <View className="w-full max-w-4xl bg-white dark:bg-[#1C2C1F] rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <Text className="text-[#111812] dark:text-white text-2xl font-bold">Add Medication</Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
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
                                                className={`flex-col items-center gap-2 pb-3 cursor-pointer ${selectedPetId === pet.id ? '' : 'opacity-60'}`}
                                            >
                                                <View className={`rounded-full p-1 ${selectedPetId === pet.id ? 'border-4 border-[#13ec37]' : 'border-4 border-transparent'}`}>
                                                    <Image 
                                                        source={{ uri: pet.image_url || 'https://via.placeholder.com/150' }} 
                                                        className="w-20 h-20 rounded-full bg-gray-200"
                                                    />
                                                </View>
                                                <Text className="text-[#111812] dark:text-gray-100 text-base font-medium">{pet.name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </View>
                            </View>

                            {/* Medication Details Section */}
                            <View>
                                <Text className="text-[#111812] dark:text-white text-lg font-bold mb-4">Medication Details</Text>
                                <View className="flex-col md:flex-row flex-wrap gap-4">
                                    <View className="w-full">
                                        <Text className="text-[#111812] dark:text-gray-200 text-sm font-medium mb-2">Medication Name</Text>
                                        <TextInput
                                            className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111812] dark:text-white"
                                            placeholder="e.g., Apoquel"
                                            placeholderTextColor="#9CA3AF"
                                            value={formData.name}
                                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                                        />
                                    </View>

                                    <View className="flex-row gap-4 w-full">
                                        <View className="flex-1">
                                            <Text className="text-[#111812] dark:text-gray-200 text-sm font-medium mb-2">Dosage</Text>
                                            <View className="flex-row">
                                                <TextInput
                                                    className="flex-1 h-12 px-4 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111812] dark:text-white"
                                                    placeholder="e.g., 16"
                                                    placeholderTextColor="#9CA3AF"
                                                    keyboardType="numeric"
                                                    value={formData.dosage_value}
                                                    onChangeText={(text) => setFormData({ ...formData, dosage_value: text })}
                                                />
                                                <View className="w-28 h-12 bg-gray-50 dark:bg-gray-700 border-t border-b border-r border-gray-300 dark:border-gray-600 rounded-r-lg justify-center px-2">
                                                     {/* Simple Dropdown simulation for React Native */}
                                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                        {DOSAGE_UNITS.map(unit => (
                                                            <TouchableOpacity 
                                                                key={unit} 
                                                                onPress={() => setFormData({...formData, dosage_unit: unit})}
                                                                className={`px-2 py-1 mr-1 rounded ${formData.dosage_unit === unit ? 'bg-[#13ec37]' : ''}`}
                                                            >
                                                                <Text className={`${formData.dosage_unit === unit ? 'text-black' : 'text-[#111812] dark:text-white'}`}>{unit}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="w-full">
                                        <Text className="text-[#111812] dark:text-gray-200 text-sm font-medium mb-2">Frequency</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                            {FREQUENCIES.map(freq => (
                                                <TouchableOpacity
                                                    key={freq}
                                                    onPress={() => setFormData({...formData, frequency: freq})}
                                                    className={`px-4 py-3 rounded-lg border ${formData.frequency === freq ? 'bg-[#13ec37] border-[#13ec37]' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}`}
                                                >
                                                    <Text className={`${formData.frequency === freq ? 'text-black font-semibold' : 'text-[#111812] dark:text-white'}`}>{freq}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <View className="w-full">
                                        <Text className="text-[#111812] dark:text-gray-200 text-sm font-medium mb-2">Start Date</Text>
                                        <View className="relative">
                                            <TextInput
                                                className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111812] dark:text-white"
                                                placeholder="YYYY-MM-DD"
                                                placeholderTextColor="#9CA3AF"
                                                value={formData.start_date}
                                                onChangeText={(text) => setFormData({ ...formData, start_date: text })}
                                            />
                                            <View className="absolute right-3 top-3 pointer-events-none">
                                                <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
                                            </View>
                                        </View>
                                    </View>

                                    <View className="w-full">
                                        <Text className="text-[#111812] dark:text-gray-200 text-sm font-medium mb-2">Administration Notes</Text>
                                        <TextInput
                                            className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111812] dark:text-white h-24"
                                            placeholder="e.g., Give with food..."
                                            placeholderTextColor="#9CA3AF"
                                            multiline
                                            textAlignVertical="top"
                                            value={formData.notes}
                                            onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Pharmacy/Provider & Costs Section */}
                            <View>
                                <Text className="text-[#111812] dark:text-white text-lg font-bold mb-4">Pharmacy/Provider & Costs</Text>
                                <View className="flex-col gap-4">
                                    <View className="w-full">
                                        <Text className="text-[#111812] dark:text-gray-200 text-sm font-medium mb-2">Pharmacy / Clinic</Text>
                                        <View className="relative">
                                            <TextInput
                                                className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111812] dark:text-white"
                                                placeholder="Search or add new"
                                                placeholderTextColor="#9CA3AF"
                                                value={formData.pharmacy}
                                                onChangeText={(text) => setFormData({ ...formData, pharmacy: text })}
                                            />
                                            <View className="absolute right-3 top-3">
                                                <Ionicons name="add-circle-outline" size={24} color="#9CA3AF" />
                                            </View>
                                        </View>
                                    </View>

                                    <View className="w-full">
                                        <Text className="text-[#111812] dark:text-gray-200 text-sm font-medium mb-2">Total Cost</Text>
                                        <View className="flex-row">
                                            <View className="w-24 h-12 bg-gray-50 dark:bg-gray-700 border-t border-b border-l border-gray-300 dark:border-gray-600 rounded-l-lg justify-center px-2">
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    {CURRENCIES.map(curr => (
                                                        <TouchableOpacity 
                                                            key={curr} 
                                                            onPress={() => setFormData({...formData, currency: curr})}
                                                            className={`px-2 py-1 mr-1 rounded ${formData.currency === curr ? 'bg-[#13ec37]' : ''}`}
                                                        >
                                                            <Text className={`${formData.currency === curr ? 'text-black' : 'text-[#111812] dark:text-white'}`}>{curr}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                            <TextInput
                                                className="flex-1 h-12 px-4 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111812] dark:text-white"
                                                placeholder="e.g., 45.50"
                                                placeholderTextColor="#9CA3AF"
                                                keyboardType="numeric"
                                                value={formData.cost}
                                                onChangeText={(text) => setFormData({ ...formData, cost: text })}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Reminders & Attachments */}
                            <View>
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-[#111812] dark:text-white text-lg font-bold">Set Reminder</Text>
                                    <TouchableOpacity 
                                        onPress={() => setFormData({...formData, reminders_enabled: !formData.reminders_enabled})}
                                        className={`w-11 h-6 rounded-full items-center justify-center ${formData.reminders_enabled ? 'bg-[#13ec37]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                    >
                                        <View className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${formData.reminders_enabled ? 'translate-x-2.5' : '-translate-x-2.5'}`} />
                                    </TouchableOpacity>
                                </View>

                                <View className="w-full mt-4">
                                    <Text className="text-[#111812] dark:text-gray-200 text-sm font-medium mb-2">Attach Prescription/Document</Text>
                                    <TouchableOpacity className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 items-center justify-center">
                                        <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
                                        <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Text className="font-semibold">Click to upload</Text> or drag and drop
                                        </Text>
                                        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, PNG, JPG (MAX. 5MB)</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Actions */}
                    <View className="flex-row items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 space-x-3 bg-white dark:bg-[#1C2C1F] rounded-b-xl">
                        <TouchableOpacity onPress={onClose} className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 mr-3">
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleSubmit} 
                            disabled={loading}
                            className={`px-6 py-2.5 rounded-lg bg-[#13ec37] ${loading ? 'opacity-70' : ''}`}
                        >
                             {loading ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <Text className="text-sm font-semibold text-black">Save Medication</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
