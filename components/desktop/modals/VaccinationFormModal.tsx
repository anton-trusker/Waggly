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
import CurrencyInput from './shared/CurrencyInput';
import PlacesAutocomplete, { Place } from '@/components/ui/PlacesAutocomplete';

cssInterop(BlurView, { className: 'style' });

interface VaccinationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const COMMON_VACCINES = ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis', 'Lyme', 'FVRCP', 'FeLV', 'Canine Influenza'];
const ADMINISTRATION_ROUTES = ['Subcutaneous', 'Intramuscular', 'Intranasal', 'Oral'];
const VACCINATION_TYPES = ['Core', 'Non-Core', 'Optional'];
const REACTION_SEVERITIES = ['None', 'Mild', 'Moderate', 'Severe', 'Anaphylaxis'];
const COMMON_REACTIONS = ['Swelling at injection site', 'Lethargy', 'Fever', 'Vomiting', 'Diarrhea', 'Itching', 'Difficulty Breathing', 'Loss of Appetite'];

export default function VaccinationFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VaccinationFormModalProps) {
    const { pets } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        vaccine_name: '',
        date_given: new Date().toISOString().split('T')[0],
        administered_time: '',
        next_due_date: '',

        // Details
        manufacturer: '',
        batch_number: '',
        lot_number: '',
        route_of_administration: 'Subcutaneous',
        administered_by: '',

        // Classification
        vaccination_type: 'Core',
        schedule_interval: '1 Year',

        // Provider
        clinic_name: '',
        clinic_address: '',
        clinic_street: '',
        clinic_city: '',
        clinic_state: '',
        clinic_zip: '',
        clinic_country: '',
        clinic_lat: null as number | null,
        clinic_lng: null as number | null,
        clinic_phone: '',

        // Cost
        cost: 0,
        currency: 'EUR',
        payment_method: '',
        insurance_provider: '',

        // Reactions
        reaction_severity: 'None',
        reactions: [] as string[],
        reaction_notes: '',

        // Reminders
        reminder_enabled: true,
        reminder_days_before: 7,
        reminder_methods: ['app'] as string[],

        notes: '',
    });

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    const handleClinicSelect = (place: Place) => {
        setFormData(prev => ({
            ...prev,
            clinic_address: place.formatted_address,
            clinic_street: place.street || '',
            clinic_city: place.city || '',
            clinic_state: place.state || '',
            clinic_zip: place.postal_code || '',
            clinic_country: place.country || '',
            clinic_lat: place.lat,
            clinic_lng: place.lng,
        }));
    };

    const resetForm = () => {
        setFormData({
            vaccine_name: '',
            date_given: new Date().toISOString().split('T')[0],
            administered_time: '',
            next_due_date: '',
            manufacturer: '',
            batch_number: '',
            lot_number: '',
            route_of_administration: 'Subcutaneous',
            administered_by: '',
            vaccination_type: 'Core',
            schedule_interval: '1 Year',
            clinic_name: '',
            clinic_address: '',
            clinic_street: '',
            clinic_city: '',
            clinic_state: '',
            clinic_zip: '',
            clinic_country: '',
            clinic_lat: null,
            clinic_lng: null,
            clinic_phone: '',
            cost: 0,
            currency: 'EUR',
            payment_method: '',
            insurance_provider: '',
            reaction_severity: 'None',
            reactions: [],
            reaction_notes: '',
            reminder_enabled: true,
            reminder_days_before: 7,
            reminder_methods: ['app'],
            notes: '',
        });
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const toggleReaction = (reaction: string) => {
        if (formData.reactions.includes(reaction)) {
            setFormData({ ...formData, reactions: formData.reactions.filter(r => r !== reaction) });
        } else {
            setFormData({ ...formData, reactions: [...formData.reactions, reaction] });
        }
    };

    const toggleReminderMethod = (method: string) => {
        if (formData.reminder_methods.includes(method)) {
            setFormData({ ...formData, reminder_methods: formData.reminder_methods.filter(m => m !== method) });
        } else {
            setFormData({ ...formData, reminder_methods: [...formData.reminder_methods, method] });
        }
    };

    const handleRepeatLast = async () => {
        if (!selectedPetId) return;
        setLoading(true);
        try {
            const { data } = await supabase
                .from('vaccinations')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('date_given', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    vaccine_name: data.name || prev.vaccine_name,
                    manufacturer: data.manufacturer || prev.manufacturer,
                    route_of_administration: data.route_of_administration || prev.route_of_administration,
                    vaccination_type: data.vaccination_type || prev.vaccination_type,
                    clinic_name: data.clinic_name || prev.clinic_name,
                    clinic_address: data.clinic_address || prev.clinic_address,
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
            const vaccinationData = {
                pet_id: selectedPetId,
                name: formData.vaccine_name,
                date_given: formData.date_given,
                administered_time: formData.administered_time || null,
                next_due_date: formData.reminder_enabled ? (formData.next_due_date || null) : null,

                manufacturer: formData.manufacturer || null,
                batch_number: formData.batch_number || null,
                lot_number: formData.lot_number || null,
                route_of_administration: formData.route_of_administration,
                administered_by: formData.administered_by || null,

                vaccination_type: formData.vaccination_type,
                schedule_interval: formData.schedule_interval || null,

                clinic_name: formData.clinic_name || null,
                clinic_address: formData.clinic_address || null,
                clinic_phone: formData.clinic_phone || null,

                cost: formData.cost || null,
                currency: formData.currency,
                payment_method: formData.payment_method || null,
                insurance_provider: formData.insurance_provider || null,

                reaction_severity: formData.reaction_severity,
                reactions: formData.reactions.length > 0 ? formData.reactions : null,
                reaction_notes: formData.reaction_notes || null,

                reminder_enabled: formData.reminder_enabled,
                reminder_days_before: formData.reminder_days_before,
                reminder_methods: formData.reminder_methods,

                notes: formData.notes || null,
            };

            const { error } = await supabase
                .from('vaccinations')
                .insert(vaccinationData as any); // Type assertion to fix Supabase type mismatch

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
                <View className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl bg-[#1C1C1E] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#2C2C2E]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#2C2C2E]">
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-[#9CA3AF] text-base font-medium">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-white text-base sm:text-lg font-bold">Add Vaccination</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text className="text-[#0A84FF] text-lg font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="p-4 sm:p-5 md:p-6" showsVerticalScrollIndicator={false}>
                        <View className="space-y-6 sm:space-y-8 pb-6 sm:pb-8">

                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                            <TouchableOpacity
                                onPress={handleRepeatLast}
                                className="flex-row items-center justify-center gap-2 bg-[#2C2C2E] py-3 rounded-xl border border-[#374151]"
                            >
                                <Ionicons name="reload" size={16} color="#0A84FF" />
                                <Text className="text-[#0A84FF] font-medium">Repeat Last Vaccination</Text>
                            </TouchableOpacity>

                            {/* Vaccine Details */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="medkit" size={20} color="#0A84FF" />
                                    <Text className="text-white text-lg font-bold">Vaccine Details</Text>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Vaccine Name *</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="e.g. Rabies, DHPP"
                                            placeholderTextColor="#4B5563"
                                            value={formData.vaccine_name}
                                            onChangeText={(text) => setFormData({ ...formData, vaccine_name: text })}
                                        />
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mt-3 gap-2">
                                            {COMMON_VACCINES.map(v => (
                                                <TouchableOpacity
                                                    key={v}
                                                    onPress={() => setFormData({ ...formData, vaccine_name: v })}
                                                    className={`px-3 py-1.5 rounded-lg border ${formData.vaccine_name === v ? 'bg-[#0A84FF] border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#374151]'
                                                        }`}
                                                >
                                                    <Text className={`text-xs ${formData.vaccine_name === v ? 'text-white' : 'text-[#9CA3AF]'}`}>{v}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    {/* Type Classification */}
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Vaccination Type</Text>
                                        <View className="flex-row gap-2">
                                            {VACCINATION_TYPES.map(type => (
                                                <TouchableOpacity
                                                    key={type}
                                                    onPress={() => setFormData({ ...formData, vaccination_type: type })}
                                                    className={`flex-1 py-2 items-center rounded-lg border ${formData.vaccination_type === type ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#374151]'
                                                        }`}
                                                >
                                                    <Text className={`text-sm font-medium ${formData.vaccination_type === type ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                        {type}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <UniversalDatePicker
                                                label="Date Given"
                                                value={formData.date_given}
                                                onChange={(text) => setFormData({ ...formData, date_given: text })}
                                                mode="date"
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Time</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="HH:MM"
                                                placeholderTextColor="#4B5563"
                                                value={formData.administered_time}
                                                onChangeText={(text) => setFormData({ ...formData, administered_time: text })}
                                            />
                                        </View>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Manufacturer</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="Pfizer, Merck, etc."
                                                placeholderTextColor="#4B5563"
                                                value={formData.manufacturer}
                                                onChangeText={(text) => setFormData({ ...formData, manufacturer: text })}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Batch/Lot #</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="Optional"
                                                placeholderTextColor="#4B5563"
                                                value={formData.batch_number}
                                                onChangeText={(text) => setFormData({ ...formData, batch_number: text })}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Route of Administration</Text>
                                        <View className="flex-row gap-2">
                                            {ADMINISTRATION_ROUTES.map(route => (
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
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Administered By</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="Dr. Smith, Veterinary Technician, etc."
                                            placeholderTextColor="#4B5563"
                                            value={formData.administered_by}
                                            onChangeText={(text) => setFormData({ ...formData, administered_by: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Reactions */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="warning" size={20} color="#EF4444" />
                                    <Text className="text-white text-lg font-bold">Reactions (if any)</Text>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row gap-2">
                                        {REACTION_SEVERITIES.map(severity => (
                                            <TouchableOpacity
                                                key={severity}
                                                onPress={() => setFormData({ ...formData, reaction_severity: severity })}
                                                className={`flex-1 py-2 items-center rounded-lg border ${formData.reaction_severity === severity
                                                    ? severity === 'None' ? 'bg-[#10B981] border-[#10B981]'
                                                        : 'bg-[#EF4444]/20 border-[#EF4444]'
                                                    : 'border-[#374151]'
                                                    }`}
                                            >
                                                <Text className={`text-xs font-medium ${formData.reaction_severity === severity
                                                    ? severity === 'None' ? 'text-white' : 'text-[#EF4444]'
                                                    : 'text-[#9CA3AF]'
                                                    }`}>
                                                    {severity}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {formData.reaction_severity !== 'None' && (
                                        <>
                                            <View>
                                                <Text className="text-[#9CA3AF] text-xs mb-2">Symptoms Observed</Text>
                                                <View className="flex-row flex-wrap gap-2">
                                                    {COMMON_REACTIONS.map(reaction => (
                                                        <TouchableOpacity
                                                            key={reaction}
                                                            onPress={() => toggleReaction(reaction)}
                                                            className={`px-3 py-1.5 rounded-lg border ${formData.reactions.includes(reaction)
                                                                ? 'bg-[#EF4444]/20 border-[#EF4444]'
                                                                : 'border-[#374151]'
                                                                }`}
                                                        >
                                                            <Text className={`text-xs ${formData.reactions.includes(reaction) ? 'text-[#EF4444]' : 'text-[#9CA3AF]'}`}>
                                                                {reaction}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>

                                            <RichTextInput
                                                label="Reaction Details"
                                                placeholder="Describe the reaction..."
                                                value={formData.reaction_notes}
                                                onChangeText={(text) => setFormData({ ...formData, reaction_notes: text })}
                                                minHeight={60}
                                            />
                                        </>
                                    )}
                                </View>
                            </View>

                            {/* Reminders */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="notifications" size={20} color="#F59E0B" />
                                    <Text className="text-white text-lg font-bold">Reminders</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-white font-medium">Enable Reminder</Text>
                                        <Switch
                                            value={formData.reminder_enabled}
                                            onValueChange={(val) => setFormData({ ...formData, reminder_enabled: val })}
                                            trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                        />
                                    </View>

                                    {formData.reminder_enabled && (
                                        <>
                                            <UniversalDatePicker
                                                label="Next Due Date"
                                                value={formData.next_due_date}
                                                onChange={(text) => setFormData({ ...formData, next_due_date: text })}
                                                mode="date"
                                                minDate={new Date()}
                                            />

                                            <View>
                                                <Text className="text-[#9CA3AF] text-xs mb-2">Remind me before</Text>
                                                <View className="flex-row gap-2">
                                                    {[7, 14, 30].map(days => (
                                                        <TouchableOpacity
                                                            key={days}
                                                            onPress={() => setFormData({ ...formData, reminder_days_before: days })}
                                                            className={`flex-1 py-2 items-center rounded-lg ${formData.reminder_days_before === days ? 'bg-[#0A84FF]' : 'bg-[#1C1C1E]'
                                                                }`}
                                                        >
                                                            <Text className={formData.reminder_days_before === days ? 'text-white' : 'text-[#9CA3AF]'}>
                                                                {days} days
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>

                                            <View>
                                                <Text className="text-[#9CA3AF] text-xs mb-2">Notification Methods</Text>
                                                <View className="flex-row gap-2">
                                                    {['App', 'Email', 'SMS'].map(method => (
                                                        <TouchableOpacity
                                                            key={method}
                                                            onPress={() => toggleReminderMethod(method.toLowerCase())}
                                                            className={`px-4 py-2 rounded-lg ${formData.reminder_methods.includes(method.toLowerCase()) ? 'bg-[#0A84FF]' : 'bg-[#1C1C1E]'
                                                                }`}
                                                        >
                                                            <Text className={formData.reminder_methods.includes(method.toLowerCase()) ? 'text-white' : 'text-[#9CA3AF]'}>
                                                                {method}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        </>
                                    )}
                                </View>
                            </View>

                            {/* Provider & Cost */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="location" size={20} color="#EC4899" />
                                    <Text className="text-white text-lg font-bold">Provider & Cost</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Clinic Name</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="Veterinary clinic"
                                            placeholderTextColor="#4B5563"
                                            value={formData.clinic_name}
                                            onChangeText={(text) => setFormData({ ...formData, clinic_name: text })}
                                        />
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Cost</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="0.00"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.cost.toString()}
                                                onChangeText={(text) => setFormData({ ...formData, cost: parseFloat(text) || 0 })}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Currency</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
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
                                placeholder="Any other details..."
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
