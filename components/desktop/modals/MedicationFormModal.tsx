import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { cssInterop } from 'react-native-css-interop';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';
import PlacesAutocomplete, { Place } from '@/components/ui/PlacesAutocomplete';

cssInterop(BlurView, { className: 'style' });

interface MedicationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const TREATMENT_TYPES = ['Medication', 'Injection', 'Supplement', 'Topical', 'Eye Drops', 'Ear Drops', 'Inhaler', 'Other'];
const DOSAGE_UNITS = ['mg', 'ml', 'pills', 'tablets', 'drops', 'puffs', 'units'];
const FREQUENCIES = ['Once daily', 'Twice daily', '3 times daily', 'Every 8 hours', 'Every 12 hours', 'As needed', 'Weekly'];
const DURATION_UNITS = ['Days', 'Weeks', 'Months', 'Years'];
const ROUTE_OF_ADMIN = ['Oral', 'Topical', 'Injection (SubQ)', 'Injection (IM)', 'Injection (IV)', 'Inhalation', 'Rectal', 'Ophthalmic', 'Otic'];
const SIDE_EFFECT_SEVERITIES = ['None', 'Mild', 'Moderate', 'Severe'];
const COMMON_SIDE_EFFECTS = ['Vomiting', 'Diarrhea', 'Lethargy', 'Loss of Appetite', 'Increased Thirst', 'Increased Urination', 'Itching', 'Behavioral Changes'];

export default function MedicationFormModal({ visible, onClose, petId: initialPetId, onSuccess }: MedicationFormModalProps) {
    const { pets } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    const [interactionWarnings, setInteractionWarnings] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        // Basic Info
        medication_name: '',
        treatment_type: 'Medication',

        // Dosage
        dosage_value: '',
        dosage_unit: 'mg',
        strength: '',
        form: '', // tablet, capsule, liquid, etc.
        route_of_administration: 'Oral',

        // Schedule
        frequency: 'Once daily',
        administration_times: [] as string[], // ['09:00', '21:00']
        administration_instructions: '',
        best_time_to_give: [] as string[], // ['with_food', 'morning', etc.]

        // Duration
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        duration_value: '',
        duration_unit: 'Days',
        is_ongoing: false,

        // Prescription Info
        prescribed_by: '',
        prescription_number: '',
        pharmacy_name: '',
        pharmacy_address: '',
        pharmacy_street: '',
        pharmacy_city: '',
        pharmacy_state: '',
        pharmacy_zip: '',
        pharmacy_country: '',
        pharmacy_lat: null as number | null,
        pharmacy_lng: null as number | null,
        pharmacy_phone: '',

        // Refills
        auto_refill: false,
        refill_every: '',
        refill_quantity: '',
        refills_remaining: '',

        // Cost
        unit_price: 0,
        quantity: '',
        total_cost: 0,
        currency: 'EUR',
        insurance_coverage_percent: 0,

        // Side Effects & Safety
        side_effects: [] as string[],
        severity_rating: 'None',
        side_effect_notes: '',
        contraindications: '',
        interactions: '',
        storage_instructions: '',

        // Medical Context
        reason_for_treatment: '',
        condition_being_treated: '',
        monitor_for: '',

        notes: '',
    });

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    // Check for medication interactions
    useEffect(() => {
        if (formData.medication_name && selectedPetId) {
            checkInteractions();
        }
    }, [formData.medication_name, selectedPetId]);

    const checkInteractions = async () => {
        if (!formData.medication_name || !selectedPetId) return;

        const warnings: string[] = [];

        try {
            // Check for active medications
            const { data: activeMeds } = await supabase
                .from('medications')
                .select('medication_name, treatment_type')
                .eq('pet_id', selectedPetId)
                .or('end_date.is.null,end_date.gt.' + new Date().toISOString());

            // Check for documented allergies
            const { data: allergies } = await supabase
                .from('allergies')
                .select('allergen_name, allergy_type, severity_level')
                .eq('pet_id', selectedPetId)
                .eq('allergy_type', 'medication');

            // Check medication allergies
            if (allergies && allergies.length > 0) {
                allergies.forEach(allergy => {
                    if (formData.medication_name.toLowerCase().includes(allergy.allergen_name.toLowerCase())) {
                        warnings.push(`⚠️ ALLERGY WARNING: Pet has documented ${allergy.severity_level} allergy to ${allergy.allergen_name}`);
                    }
                });
            }

            // Mock interaction database (in production, use real drug interaction API)
            const knownInteractions: Record<string, string[]> = {
                'nsaid': ['steroid', 'aspirin'],
                'steroid': ['nsaid', 'anti-inflammatory'],
                'antibiotic': ['antacid'],
            };

            // Check for drug interactions
            if (activeMeds && activeMeds.length > 0) {
                const currentMedLower = formData.medication_name.toLowerCase();

                activeMeds.forEach(med => {
                    const activeMedLower = med.medication_name.toLowerCase();

                    // Check known interactions
                    Object.entries(knownInteractions).forEach(([drug, interactsWith]) => {
                        if (currentMedLower.includes(drug)) {
                            interactsWith.forEach(interacting => {
                                if (activeMedLower.includes(interacting)) {
                                    warnings.push(`⚠️ INTERACTION: Possible interaction between ${formData.medication_name} and active medication ${med.medication_name}`);
                                }
                            });
                        }
                    });
                });

                if (activeMeds.length >= 3) {
                    warnings.push(`ℹ️ INFO: Pet is currently on ${activeMeds.length} medications. Consider monitoring for polypharmacy effects.`);
                }
            }

            setInteractionWarnings(warnings);
        } catch (error) {
            console.error('Error checking interactions:', error);
        }
    };

    const toggleSideEffect = (effect: string) => {
        if (formData.side_effects.includes(effect)) {
            setFormData({ ...formData, side_effects: formData.side_effects.filter(e => e !== effect) });
        } else {
            setFormData({ ...formData, side_effects: [...formData.side_effects, effect] });
        }
    };

    const addAdministrationTime = () => {
        const newTime = '09:00'; // Default time
        setFormData({ ...formData, administration_times: [...formData.administration_times, newTime] });
    };

    const removeAdministrationTime = (index: number) => {
        setFormData({
            ...formData,
            administration_times: formData.administration_times.filter((_, i) => i !== index)
        });
    };

    const handlePharmacySelect = (place: Place) => {
        setFormData(prev => ({
            ...prev,
            pharmacy_address: place.formatted_address,
            pharmacy_street: place.street || '',
            pharmacy_city: place.city || '',
            pharmacy_state: place.state || '',
            pharmacy_zip: place.postal_code || '',
            pharmacy_country: place.country || '',
            pharmacy_lat: place.lat,
            pharmacy_lng: place.lng,
        }));
    };

    const resetForm = () => {
        setFormData({
            medication_name: '',
            treatment_type: 'Medication',
            dosage_value: '',
            dosage_unit: 'mg',
            strength: '',
            form: '',
            route_of_administration: 'Oral',
            frequency: 'Once daily',
            administration_times: [],
            administration_instructions: '',
            best_time_to_give: [],
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            duration_value: '',
            duration_unit: 'Days',
            is_ongoing: false,
            prescribed_by: '',
            prescription_number: '',
            pharmacy_name: '',
            pharmacy_address: '',
            pharmacy_street: '',
            pharmacy_city: '',
            pharmacy_state: '',
            pharmacy_zip: '',
            pharmacy_country: '',
            pharmacy_lat: null,
            pharmacy_lng: null,
            pharmacy_phone: '',
            auto_refill: false,
            refill_every: '',
            refill_quantity: '',
            refills_remaining: '',
            unit_price: 0,
            quantity: '',
            total_cost: 0,
            currency: 'EUR',
            insurance_coverage_percent: 0,
            side_effects: [],
            severity_rating: 'None',
            side_effect_notes: '',
            contraindications: '',
            interactions: '',
            storage_instructions: '',
            reason_for_treatment: '',
            condition_being_treated: '',
            monitor_for: '',
            notes: '',
        });
        setInteractionWarnings([]);
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!formData.medication_name) {
            Alert.alert('Error', 'Please enter medication name');
            return;
        }

        // Show warnings if they exist
        if (interactionWarnings.length > 0) {
            Alert.alert(
                'Interaction Warnings',
                interactionWarnings.join('\n\n') + '\n\nDo you want to proceed?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Proceed Anyway', onPress: submitToDatabase }
                ]
            );
        } else {
            submitToDatabase();
        }
    };

    const submitToDatabase = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('medications')
                .insert({ // Type assertion to fix Supabase type mismatch
                    pet_id: selectedPetId,
                    medication_name: formData.medication_name,
                    treatment_type: formData.treatment_type,

                    dosage_value: formData.dosage_value ? parseFloat(formData.dosage_value) : null,
                    dosage_unit: formData.dosage_unit,
                    strength: formData.strength || null,
                    form: formData.form || null,
                    route_of_administration: formData.route_of_administration,

                    frequency: formData.frequency,
                    administration_times: formData.administration_times.length > 0 ? formData.administration_times : null,
                    administration_instructions: formData.administration_instructions || null,
                    best_time_to_give: formData.best_time_to_give.length > 0 ? formData.best_time_to_give : null,

                    start_date: formData.start_date,
                    end_date: formData.end_date || null,
                    duration_value: formData.duration_value ? parseInt(formData.duration_value) : null,
                    duration_unit: formData.duration_unit,
                    is_ongoing: formData.is_ongoing,

                    prescribed_by: formData.prescribed_by || null,
                    prescription_number: formData.prescription_number || null,
                    pharmacy_name: formData.pharmacy_name || null,
                    pharmacy_phone: formData.pharmacy_phone || null,

                    auto_refill: formData.auto_refill,
                    refill_schedule: formData.auto_refill ? {
                        every: formData.refill_every,
                        quantity: formData.refill_quantity,
                    } : null,
                    refills_remaining: formData.refills_remaining ? parseInt(formData.refills_remaining) : null,

                    unit_price: formData.unit_price || null,
                    quantity: formData.quantity ? parseInt(formData.quantity) : null,
                    total_cost: formData.total_cost || null,
                    currency: formData.currency,
                    insurance_coverage_percent: formData.insurance_coverage_percent || null,

                    side_effects: formData.side_effects.length > 0 ? formData.side_effects : null,
                    severity_rating: formData.severity_rating,
                    side_effect_notes: formData.side_effect_notes || null,
                    contraindications: formData.contraindications || null,
                    interactions: formData.interactions || null,
                    storage_instructions: formData.storage_instructions || null,

                    reason_for_treatment: formData.reason_for_treatment || null,
                    condition_being_treated: formData.condition_being_treated || null,
                    monitor_for: formData.monitor_for || null,

                    notes: formData.notes || null,
                } as any); // Type assertion to fix Supabase type mismatch

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
                <View className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl bg-[#1C1C1E] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#2C2C2E]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#2C2C2E]">
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-[#9CA3AF] text-base font-medium">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-white text-base sm:text-lg font-bold">Add Medication</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text className="text-[#0A84FF] text-lg font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="p-4 sm:p-5 md:p-6" showsVerticalScrollIndicator={false}>
                        <View className="space-y-6 sm:space-y-8 pb-6 sm:pb-8">

                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                            {/* Interaction Warnings */}
                            {interactionWarnings.length > 0 && (
                                <View className="bg-[#EF4444]/20 border border-[#EF4444] rounded-xl p-4">
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <Ionicons name="warning" size={20} color="#EF4444" />
                                        <Text className="text-[#EF4444] font-bold">Warnings Detected</Text>
                                    </View>
                                    {interactionWarnings.map((warning, index) => (
                                        <Text key={index} className="text-[#EF4444] text-sm mb-1">• {warning}</Text>
                                    ))}
                                </View>
                            )}

                            {/* Medication Details */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="medkit" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Medication Details</Text>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Medication Name *</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="e.g. Apoquel, Prednisone"
                                            placeholderTextColor="#4B5563"
                                            value={formData.medication_name}
                                            onChangeText={(text) => setFormData({ ...formData, medication_name: text })}
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Treatment Type</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                            {TREATMENT_TYPES.map(type => (
                                                <TouchableOpacity
                                                    key={type}
                                                    onPress={() => setFormData({ ...formData, treatment_type: type })}
                                                    className={`px-3 py-2 rounded-lg border ${formData.treatment_type === type ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#374151]'
                                                        }`}
                                                >
                                                    <Text className={`text-xs ${formData.treatment_type === type ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                        {type}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Dosage</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="16"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.dosage_value}
                                                onChangeText={(text) => setFormData({ ...formData, dosage_value: text })}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Unit</Text>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                {DOSAGE_UNITS.map(unit => (
                                                    <TouchableOpacity
                                                        key={unit}
                                                        onPress={() => setFormData({ ...formData, dosage_unit: unit })}
                                                        className={`px-3 py-2 mr-2 rounded-lg ${formData.dosage_unit === unit ? 'bg-[#0A84FF]' : 'bg-[#1C1C1E]'
                                                            }`}
                                                    >
                                                        <Text className={formData.dosage_unit === unit ? 'text-white' : 'text-[#9CA3AF]'}>
                                                            {unit}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Frequency</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                            {FREQUENCIES.map(freq => (
                                                <TouchableOpacity
                                                    key={freq}
                                                    onPress={() => setFormData({ ...formData, frequency: freq })}
                                                    className={`px-4 py-2 rounded-lg border ${formData.frequency === freq ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#374151]'
                                                        }`}
                                                >
                                                    <Text className={`text-sm ${formData.frequency === freq ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                        {freq}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Route of Administration</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                            {ROUTE_OF_ADMIN.map(route => (
                                                <TouchableOpacity
                                                    key={route}
                                                    onPress={() => setFormData({ ...formData, route_of_administration: route })}
                                                    className={`px-3 py-2 rounded-lg border ${formData.route_of_administration === route ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#374151]'
                                                        }`}
                                                >
                                                    <Text className={`text-xs ${formData.route_of_administration === route ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                        {route}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>

                            {/* Duration & Schedule */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="calendar" size={20} color="#F59E0B" />
                                    <Text className="text-white text-lg font-bold">Duration & Schedule</Text>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <UniversalDatePicker
                                                label="Start Date"
                                                value={formData.start_date}
                                                onChange={(text) => setFormData({ ...formData, start_date: text })}
                                                mode="date"
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <UniversalDatePicker
                                                label="End Date (Optional)"
                                                value={formData.end_date}
                                                onChange={(text) => setFormData({ ...formData, end_date: text })}
                                                mode="date"
                                                minDate={new Date(formData.start_date)}
                                            />
                                        </View>
                                    </View>

                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-white font-medium">Ongoing Medication</Text>
                                        <Switch
                                            value={formData.is_ongoing}
                                            onValueChange={(val) => setFormData({ ...formData, is_ongoing: val })}
                                            trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                        />
                                    </View>

                                    {!formData.is_ongoing && (
                                        <View className="flex-row gap-4">
                                            <View className="flex-1">
                                                <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Duration</Text>
                                                <TextInput
                                                    className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                    placeholder="7"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.duration_value}
                                                    onChangeText={(text) => setFormData({ ...formData, duration_value: text })}
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Unit</Text>
                                                <ScrollView horizontal>
                                                    {DURATION_UNITS.map(unit => (
                                                        <TouchableOpacity
                                                            key={unit}
                                                            onPress={() => setFormData({ ...formData, duration_unit: unit })}
                                                            className={`px-3 py-2 mr-2 rounded-lg ${formData.duration_unit === unit ? 'bg-[#0A84FF]' : 'bg-[#1C1C1E]'
                                                                }`}
                                                        >
                                                            <Text className={formData.duration_unit === unit ? 'text-white' : 'text-[#9CA3AF]'}>
                                                                {unit}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        </View>
                                    )}

                                    <RichTextInput
                                        label="Administration Instructions"
                                        placeholder="Give with food, wait 30 minutes before eating..."
                                        value={formData.administration_instructions}
                                        onChangeText={(text) => setFormData({ ...formData, administration_instructions: text })}
                                        minHeight={60}
                                    />
                                </View>
                            </View>

                            {/* Refill Management */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="refresh" size={20} color="#10B981" />
                                    <Text className="text-white text-lg font-bold">Refill Management</Text>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-white font-medium">Auto-Refill</Text>
                                        <Switch
                                            value={formData.auto_refill}
                                            onValueChange={(val) => setFormData({ ...formData, auto_refill: val })}
                                            trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                        />
                                    </View>

                                    {formData.auto_refill && (
                                        <>
                                            <View className="flex-row gap-4">
                                                <View className="flex-1">
                                                    <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Refill Every (days)</Text>
                                                    <TextInput
                                                        className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                        placeholder="30"
                                                        keyboardType="numeric"
                                                        placeholderTextColor="#4B5563"
                                                        value={formData.refill_every}
                                                        onChangeText={(text) => setFormData({ ...formData, refill_every: text })}
                                                    />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Quantity</Text>
                                                    <TextInput
                                                        className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                        placeholder="60"
                                                        keyboardType="numeric"
                                                        placeholderTextColor="#4B5563"
                                                        value={formData.refill_quantity}
                                                        onChangeText={(text) => setFormData({ ...formData, refill_quantity: text })}
                                                    />
                                                </View>
                                            </View>
                                        </>
                                    )}

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Pharmacy Name</Text>
                                        <TextInput
                                            className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                            placeholder="Pet Pharmacy Plus"
                                            placeholderTextColor="#4B5563"
                                            value={formData.pharmacy_name}
                                            onChangeText={(text) => setFormData({ ...formData, pharmacy_name: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Side Effects */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="warning" size={20} color="#EF4444" />
                                    <Text className="text-white text-lg font-bold">Side Effects</Text>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row gap-2">
                                        {SIDE_EFFECT_SEVERITIES.map(severity => (
                                            <TouchableOpacity
                                                key={severity}
                                                onPress={() => setFormData({ ...formData, severity_rating: severity })}
                                                className={`flex-1 py-2 items-center rounded-lg border ${formData.severity_rating === severity
                                                    ? severity === 'None' ? 'bg-[#10B981] border-[#10B981]'
                                                        : 'bg-[#EF4444]/20 border-[#EF4444]'
                                                    : 'border-[#374151]'
                                                    }`}
                                            >
                                                <Text className={`text-xs font-medium ${formData.severity_rating === severity
                                                    ? severity === 'None' ? 'text-white' : 'text-[#EF4444]'
                                                    : 'text-[#9CA3AF]'
                                                    }`}>
                                                    {severity}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {formData.severity_rating !== 'None' && (
                                        <>
                                            <View>
                                                <Text className="text-[#9CA3AF] text-xs mb-2">Symptoms Observed</Text>
                                                <View className="flex-row flex-wrap gap-2">
                                                    {COMMON_SIDE_EFFECTS.map(effect => (
                                                        <TouchableOpacity
                                                            key={effect}
                                                            onPress={() => toggleSideEffect(effect)}
                                                            className={`px-3 py-1.5 rounded-lg border ${formData.side_effects.includes(effect)
                                                                ? 'bg-[#EF4444]/20 border-[#EF4444]'
                                                                : 'border-[#374151]'
                                                                }`}
                                                        >
                                                            <Text className={`text-xs ${formData.side_effects.includes(effect) ? 'text-[#EF4444]' : 'text-[#9CA3AF]'}`}>
                                                                {effect}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>

                                            <RichTextInput
                                                label="Side Effect Notes"
                                                placeholder="Describe side effects..."
                                                value={formData.side_effect_notes}
                                                onChangeText={(text) => setFormData({ ...formData, side_effect_notes: text })}
                                                minHeight={60}
                                            />
                                        </>
                                    )}
                                </View>
                            </View>

                            {/* Medical Context */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="document-text" size={20} color="#8B5CF6" />
                                    <Text className="text-white text-lg font-bold">Medical Context</Text>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Reason for Treatment</Text>
                                        <TextInput
                                            className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                            placeholder="Allergies, infection, pain management..."
                                            placeholderTextColor="#4B5563"
                                            value={formData.reason_for_treatment}
                                            onChangeText={(text) => setFormData({ ...formData, reason_for_treatment: text })}
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Condition Being Treated</Text>
                                        <TextInput
                                            className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                            placeholder="Atopic dermatitis, UTI, arthritis..."
                                            placeholderTextColor="#4B5563"
                                            value={formData.condition_being_treated}
                                            onChangeText={(text) => setFormData({ ...formData, condition_being_treated: text })}
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Prescribed By</Text>
                                        <TextInput
                                            className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                            placeholder="Dr. Smith, ABC Veterinary Clinic"
                                            placeholderTextColor="#4B5563"
                                            value={formData.prescribed_by}
                                            onChangeText={(text) => setFormData({ ...formData, prescribed_by: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Cost */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="cash" size={20} color="#10B981" />
                                    <Text className="text-white text-lg font-bold">Cost Information</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Total Cost</Text>
                                            <TextInput
                                                className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                placeholder="45.50"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.total_cost.toString()}
                                                onChangeText={(text) => setFormData({ ...formData, total_cost: parseFloat(text) || 0 })}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Currency</Text>
                                            <TextInput
                                                className="bg-[#1C1C1E] rounded-xl px-4 py-3 text-white"
                                                value={formData.currency}
                                                onChangeText={(text) => setFormData({ ...formData, currency: text })}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Notes */}
                            <RichTextInput
                                label="Additional Notes"
                                placeholder="Any other important information..."
                                value={formData.notes}
                                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                minHeight={80}
                            />

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
