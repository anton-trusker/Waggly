import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAllergies } from '@/hooks/useAllergies';
import { usePets } from '@/hooks/usePets';
import { Allergy } from '@/types';
import { cssInterop } from 'react-native-css-interop';

cssInterop(BlurView, { className: 'style' });

interface AllergyModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    existingAllergy?: Allergy | null;
    onSuccess?: () => void;
}

const SEVERITY_LEVELS = [
    { id: 'mild', label: 'Mild', color: '#22C55E' },
    { id: 'moderate', label: 'Moderate', color: '#F59E0B' },
    { id: 'severe', label: 'Severe', color: '#EF4444' },
];

export default function AllergyModal({ visible, onClose, petId: initialPetId, existingAllergy, onSuccess }: AllergyModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    // We need to initialize useAllergies with a petId, but it might change. 
    // The hook structure in this project seems to bind to one petId. 
    // We'll use the selectedPetId to call actions.
    const { addAllergy, updateAllergy } = useAllergies(selectedPetId);
    
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [severity, setSeverity] = useState('moderate');
    const [notes, setNotes] = useState('');
    const [reaction, setReaction] = useState('');

    useEffect(() => {
        if (visible) {
            if (initialPetId) setSelectedPetId(initialPetId);
            else if (pets.length > 0 && !selectedPetId) setSelectedPetId(pets[0].id);

            if (existingAllergy) {
                setName(existingAllergy.name);
                setSeverity(existingAllergy.severity || 'moderate');
                setNotes(existingAllergy.notes || '');
                // reaction field if exists in schema, or map to notes
            } else {
                setName('');
                setSeverity('moderate');
                setNotes('');
                setReaction('');
            }
        }
    }, [visible, existingAllergy, initialPetId, pets]);

    const handleSave = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter allergy name');
            return;
        }
        
        setLoading(true);

        const allergyData = {
            name,
            severity,
            notes: reaction ? `Reaction: ${reaction}\n${notes}` : notes
        };

        let result;
        if (existingAllergy) {
            result = await updateAllergy(existingAllergy.id, allergyData);
        } else {
            result = await addAllergy(allergyData);
        }

        setLoading(false);
        
        if (result && !result.error) {
            onSuccess?.();
            onClose();
        } else {
            Alert.alert('Error', result?.error?.message || 'Failed to save allergy');
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
                        <Text className="text-white text-lg font-bold">{existingAllergy ? 'Edit Allergy' : 'Add Allergy'}</Text>
                        <TouchableOpacity onPress={handleSave} disabled={loading}>
                            <Text className="text-[#0A84FF] text-lg font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                        <View className="space-y-8 pb-8">
                            
                            {/* Who is this for? */}
                            {!existingAllergy && (
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

                            {/* Allergy Details */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="warning" size={20} color="#F59E0B" />
                                    <Text className="text-white text-lg font-bold">Allergy Details</Text>
                                </View>
                                
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Allergy Name</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="e.g. Peanuts, Bee Stings"
                                            placeholderTextColor="#4B5563"
                                            value={name}
                                            onChangeText={setName}
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Severity</Text>
                                        <View className="flex-row gap-2">
                                            {SEVERITY_LEVELS.map((level) => (
                                                <TouchableOpacity
                                                    key={level.id}
                                                    onPress={() => setSeverity(level.id)}
                                                    className={`flex-1 py-3 rounded-xl border items-center justify-center ${
                                                        severity === level.id 
                                                        ? `bg-[${level.color}]/10 border-[${level.color}]` 
                                                        : 'bg-[#1C1C1E] border-transparent'
                                                    }`}
                                                    style={severity === level.id ? { borderColor: level.color, backgroundColor: `${level.color}20` } : {}}
                                                >
                                                    <Text 
                                                        className="font-bold text-sm"
                                                        style={{ color: severity === level.id ? level.color : '#6B7280' }}
                                                    >
                                                        {level.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Reaction Details</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="e.g. Swelling, Hives"
                                            placeholderTextColor="#4B5563"
                                            value={reaction}
                                            onChangeText={setReaction}
                                        />
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
