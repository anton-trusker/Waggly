import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { usePets } from '@/hooks/usePets';
import { WeightEntry } from '@/types';
import { cssInterop } from 'react-native-css-interop';

cssInterop(BlurView, { className: 'style' });

interface WeightModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    existingEntry?: WeightEntry | null;
    onSuccess?: () => void;
}

export default function WeightModal({ visible, onClose, petId: initialPetId, existingEntry, onSuccess }: WeightModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    
    // Hooks depend on petId, but we might switch pets.
    // For now, we use the selectedPetId to call actions.
    const { addWeightEntry, updateWeightEntry } = useWeightEntries(selectedPetId);
    
    const [loading, setLoading] = useState(false);

    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('kg');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (visible) {
            if (initialPetId) setSelectedPetId(initialPetId);
            else if (pets.length > 0 && !selectedPetId) setSelectedPetId(pets[0].id);

            if (existingEntry) {
                setWeight(String(existingEntry.weight));
                setUnit(existingEntry.unit);
                setDate(existingEntry.date.split('T')[0]);
                // Time extraction from ISO string if needed
                setNotes(existingEntry.notes || '');
            } else {
                setWeight('');
                setUnit('kg');
                setDate(new Date().toISOString().split('T')[0]);
                setTime('');
                setNotes('');
            }
        }
    }, [visible, existingEntry, initialPetId, pets]);

    const handleSave = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!weight || isNaN(Number(weight))) {
            Alert.alert('Error', 'Please enter a valid weight');
            return;
        }
        
        setLoading(true);

        const numericWeight = parseFloat(weight);
        const entryData = {
            weight: numericWeight,
            unit,
            date, // Should include time ideally
            notes
        };

        let result;
        if (existingEntry) {
            result = await updateWeightEntry(existingEntry.id, entryData);
        } else {
            result = await addWeightEntry(entryData);
        }

        setLoading(false);
        
        if (result && !result.error) {
            onSuccess?.();
            onClose();
        } else {
            Alert.alert('Error', result?.error?.message || 'Failed to save weight entry');
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
                        <Text className="text-white text-lg font-bold">{existingEntry ? 'Edit Weight' : 'Log Weight'}</Text>
                        <TouchableOpacity onPress={handleSave} disabled={loading}>
                            <Text className="text-[#0A84FF] text-lg font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                        <View className="space-y-8 pb-8">
                            
                            {/* Who is this for? */}
                            {!existingEntry && (
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
                            )}

                            {/* Weight Details */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="scale" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Weight Details</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Weight</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="0.00"
                                                placeholderTextColor="#4B5563"
                                                keyboardType="decimal-pad"
                                                value={weight}
                                                onChangeText={setWeight}
                                            />
                                        </View>
                                        <View className="w-1/3">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Unit</Text>
                                            <View className="flex-row bg-[#1C1C1E] rounded-xl p-1">
                                                <TouchableOpacity 
                                                    onPress={() => setUnit('kg')}
                                                    className={`flex-1 py-2 rounded-lg items-center ${unit === 'kg' ? 'bg-[#3A3A3C]' : ''}`}
                                                >
                                                    <Text className={`font-bold ${unit === 'kg' ? 'text-white' : 'text-[#6B7280]'}`}>kg</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    onPress={() => setUnit('lbs')}
                                                    className={`flex-1 py-2 rounded-lg items-center ${unit === 'lbs' ? 'bg-[#3A3A3C]' : ''}`}
                                                >
                                                    <Text className={`font-bold ${unit === 'lbs' ? 'text-white' : 'text-[#6B7280]'}`}>lbs</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Date</Text>
                                            <View className="relative">
                                                <TextInput
                                                    className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                    placeholder="YYYY-MM-DD"
                                                    placeholderTextColor="#4B5563"
                                                    value={date}
                                                    onChangeText={setDate}
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
                                                    value={time}
                                                    onChangeText={setTime}
                                                />
                                                <View className="absolute right-3 top-3.5 pointer-events-none">
                                                    <Ionicons name="time" size={18} color="#6B7280" />
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Notes</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl p-4 text-white text-base min-h-[100px]"
                                            placeholder="Additional notes..."
                                            placeholderTextColor="#4B5563"
                                            multiline
                                            textAlignVertical="top"
                                            value={notes}
                                            onChangeText={setNotes}
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
