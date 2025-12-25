import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { cssInterop } from 'react-native-css-interop';
import PetSelector from './shared/PetSelector';
import BusinessSearch from './shared/BusinessSearch';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';
import CurrencyInput from './shared/CurrencyInput';
import PlacesAutocomplete, { Place } from '@/components/ui/PlacesAutocomplete';

cssInterop(BlurView, { className: 'style' });

interface VisitFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const PROVIDER_TYPES = [
    { type: 'veterinary', label: 'Veterinary', icon: 'medical', color: '#EF4444' },
    { type: 'groomer', label: 'Grooming', icon: 'cut', color: '#06B6D4' },
    { type: 'trainer', label: 'Training', icon: 'school', color: '#8B5CF6' },
    { type: 'boarder', label: 'Boarding', icon: 'bed', color: '#F59E0B' },
    { type: 'daycare', label: 'Daycare', icon: 'home', color: '#10B981' },
    { type: 'walker', label: 'Walker', icon: 'walk', color: '#3B82F6' },
    { type: 'sitter', label: 'Sitter', icon: 'person', color: '#EC4899' },
    { type: 'behaviorist', label: 'Behaviorist', icon: 'psychology', color: '#6366F1' },
    { type: 'nutritionist', label: 'Nutritionist', icon: 'restaurant', color: '#14B8A6' },
] as const;

const SERVICE_CATEGORIES: Record<string, string[]> = {
    veterinary: ['Routine Check-up', 'Emergency', 'Vaccination', 'Specialist', 'Dental', 'Surgery', 'Lab Work', 'Follow-up'],
    groomer: ['Full Grooming', 'Bath Only', 'Nail Trim', 'Haircut', 'De-shedding', 'Teeth Brushing'],
    trainer: ['Obedience', 'Behavioral', 'Puppy Class', 'Agility', 'Private Session', 'Group Class'],
    boarder: ['Overnight Boarding', 'Extended Stay', 'Daycare Boarding'],
    daycare: ['Full Day', 'Half Day', 'Trial Day'],
    walker: ['30min Walk', '1hr Walk', 'Group Walk', 'Private Walk'],
    sitter: ['In-Home', 'Drop-In Visit', 'Overnight'],
    behaviorist: ['Assessment', 'Training Session', 'Follow-up'],
    nutritionist: ['Consultation', 'Diet Plan', 'Follow-up'],
};

const URGENCY_LEVELS = [
    { label: 'Routine', value: 'routine', color: '#10B981' },
    { label: 'Urgent', value: 'urgent', color: '#FBBF24' },
    { label: 'Emergency', value: 'emergency', color: '#EF4444' },
];

const COMMON_SYMPTOMS = ['Vomiting', 'Diarrhea', 'Limping', 'Ear Infection', 'Eye Discharge', 'Fever', 'Loss of Appetite', 'Coughing'];

export default function VisitFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VisitFormModalProps) {
    const { pets } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        provider_type: 'veterinary' as 'veterinary' | 'groomer' | 'trainer' | 'boarder' | 'daycare' | 'walker' | 'sitter' | 'behaviorist' | 'nutritionist',
        service_category: 'Routine Check-up',
        urgency: 'routine',
        date: new Date().toISOString().split('T')[0],
        visit_time: '',
        duration_minutes: '',
        business_name: '',
        provider_name: '',
        business_place_id: '',
        business_address: '',
        business_street: '',
        business_city: '',
        business_state: '',
        business_zip: '',
        business_country: '',
        business_lat: null as number | null,
        business_lng: null as number | null,
        business_phone: '',
        business_website: '',
        reason: '',
        symptoms: [] as string[],
        diagnosis: '',
        notes: '',
        cost: 0,
        currency: 'EUR',
        payment_method: '',
        follow_up_date: '',
        reminder_enabled: false,
    });

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    // Update service category when provider type changes
    useEffect(() => {
        const categories = SERVICE_CATEGORIES[formData.provider_type];
        if (categories && categories.length > 0) {
            setFormData(prev => ({ ...prev, service_category: categories[0] }));
        }
    }, [formData.provider_type]);

    const resetForm = () => {
        setFormData({
            provider_type: 'veterinary',
            service_category: 'Routine Check-up',
            urgency: 'routine',
            date: new Date().toISOString().split('T')[0],
            visit_time: '',
            duration_minutes: '',
            business_name: '',
            provider_name: '',
            business_place_id: '',
            business_address: '',
            business_street: '',
            business_city: '',
            business_state: '',
            business_zip: '',
            business_country: '',
            business_lat: null,
            business_lng: null,
            business_phone: '',
            business_website: '',
            reason: '',
            symptoms: [],
            diagnosis: '',
            notes: '',
            cost: 0,
            currency: 'EUR',
            payment_method: '',
            follow_up_date: '',
            reminder_enabled: false,
        });
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const toggleSymptom = (symptom: string) => {
        if (formData.symptoms.includes(symptom)) {
            setFormData({ ...formData, symptoms: formData.symptoms.filter(s => s !== symptom) });
        } else {
            setFormData({ ...formData, symptoms: [...formData.symptoms, symptom] });
        }
    };

    const handlePlaceSelect = (place: Place) => {
        setFormData(prev => ({
            ...prev,
            business_address: place.formatted_address,
            business_place_id: place.place_id,
            business_street: place.street || '',
            business_city: place.city || '',
            business_state: place.state || '',
            business_zip: place.postal_code || '',
            business_country: place.country || '',
            business_lat: place.lat,
            business_lng: place.lng,
        }));
    };

    const handleRepeatLast = async () => {
        if (!selectedPetId) return;
        setLoading(true);
        try {
            const { data } = await supabase
                .from('medical_visits')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('date', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    provider_type: data.provider_type || 'veterinary',
                    service_category: data.service_category || prev.service_category,
                    business_name: data.business_name || '',
                    provider_name: data.provider_name || '',
                    business_address: data.business_address || '',
                    business_phone: data.business_phone || '',
                    currency: data.currency || prev.currency,
                }));
                Alert.alert('Auto-Filled', 'Details from the last visit have been applied.');
            } else {
                Alert.alert('Info', 'No previous visits found for this pet.');
            }
        } catch (err) {
            console.log('Error fetching last visit:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!formData.date) {
            Alert.alert('Error', 'Please enter visit date');
            return;
        }
        if (!formData.business_name) {
            Alert.alert('Error', 'Please enter provider/business name');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('medical_visits')
                .insert({
                    pet_id: selectedPetId,
                    provider_type: formData.provider_type,
                    service_category: formData.service_category,
                    urgency: formData.urgency,
                    date: formData.date,
                    visit_time: formData.visit_time || null,
                    duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
                    business_name: formData.business_name,
                    provider_name: formData.provider_name || null,
                    business_place_id: formData.business_place_id || null,
                    business_address: formData.business_address || null,
                    business_phone: formData.business_phone || null,
                    business_website: formData.business_website || null,
                    reason: formData.reason || formData.service_category,
                    symptoms: formData.provider_type === 'veterinary' ? formData.symptoms : null,
                    diagnosis: formData.provider_type === 'veterinary' ? formData.diagnosis : null,
                    notes: formData.notes || null,
                    cost: formData.cost || null,
                    currency: formData.currency,
                    payment_method: formData.payment_method || null,
                    follow_up_date: formData.follow_up_date || null,
                    reminder_enabled: formData.reminder_enabled,
                } as any); // Type assertion to fix Supabase type mismatch

            if (error) throw error;

            Alert.alert('Success', `${PROVIDER_TYPES.find(p => p.type === formData.provider_type)?.label} visit added successfully`);
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

    const selectedProvider = PROVIDER_TYPES.find(p => p.type === formData.provider_type);
    const availableCategories = SERVICE_CATEGORIES[formData.provider_type] || [];

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
                        <Text className="text-white text-lg font-bold">Add New Visit</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text className="text-[#0A84FF] text-lg font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView className="p-4 sm:p-5 md:p-6" showsVerticalScrollIndicator={false}>
                        <View className="space-y-6 sm:space-y-8 pb-6 sm:pb-8">

                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                            {/* Repeat Last Button */}
                            <TouchableOpacity
                                onPress={handleRepeatLast}
                                className="flex-row items-center justify-center gap-2 bg-[#2C2C2E] py-3 rounded-xl border border-[#374151]"
                            >
                                <Ionicons name="reload" size={16} color="#0A84FF" />
                                <Text className="text-[#0A84FF] font-medium">Repeat Last Visit Details</Text>
                            </TouchableOpacity>

                            {/* Provider Type Selector */}
                            <View>
                                <Text className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider mb-4">PROVIDER TYPE</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                                    {PROVIDER_TYPES.map(provider => (
                                        <TouchableOpacity
                                            key={provider.type}
                                            onPress={() => setFormData({ ...formData, provider_type: provider.type as any })}
                                            className="items-center"
                                            style={{ minWidth: 80 }}
                                        >
                                            <View
                                                className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                                                style={{
                                                    backgroundColor: formData.provider_type === provider.type ? provider.color : '#2C2C2E',
                                                    borderWidth: 2,
                                                    borderColor: formData.provider_type === provider.type ? provider.color : '#374151'
                                                }}
                                            >
                                                <Ionicons
                                                    name={provider.icon as any}
                                                    size={28}
                                                    color={formData.provider_type === provider.type ? '#FFFFFF' : '#9CA3AF'}
                                                />
                                            </View>
                                            <Text
                                                className="text-xs font-medium text-center"
                                                style={{ color: formData.provider_type === provider.type ? provider.color : '#9CA3AF' }}
                                            >
                                                {provider.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Visit Details */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="calendar" size={20} color={selectedProvider?.color} />
                                    <Text className="text-white text-base sm:text-lg font-bold">Add Visit Record</Text>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    {/* Urgency */}
                                    <View className="flex-row gap-2">
                                        {URGENCY_LEVELS.map((level) => (
                                            <TouchableOpacity
                                                key={level.value}
                                                onPress={() => setFormData({ ...formData, urgency: level.value })}
                                                className="flex-1 py-2 items-center rounded-lg border"
                                                style={{
                                                    backgroundColor: formData.urgency === level.value ? `${level.color}20` : 'transparent',
                                                    borderColor: formData.urgency === level.value ? level.color : '#374151'
                                                }}
                                            >
                                                <Text style={{ color: formData.urgency === level.value ? level.color : '#9CA3AF' }} className="font-bold text-xs uppercase">
                                                    {level.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* Service Category */}
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Service Type</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                            {availableCategories.map(category => (
                                                <TouchableOpacity
                                                    key={category}
                                                    onPress={() => setFormData({ ...formData, service_category: category })}
                                                    className={`px-4 py-2 rounded-full mr-2 border ${formData.service_category === category
                                                        ? 'border-[#0A84FF]'
                                                        : 'border-[#4B5563]'
                                                        }`}
                                                    style={{
                                                        backgroundColor: formData.service_category === category ? '#0A84FF' : 'transparent'
                                                    }}
                                                >
                                                    <Text className={`text-sm font-medium ${formData.service_category === category ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                                        {category}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    {/* Date, Time, Duration */}
                                    <UniversalDatePicker
                                        label="Date"
                                        value={formData.date}
                                        onChange={(text) => setFormData({ ...formData, date: text })}
                                    />

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Time (Optional)</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="HH:MM"
                                                placeholderTextColor="#4B5563"
                                                value={formData.visit_time}
                                                onChangeText={(text) => setFormData({ ...formData, visit_time: text })}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Duration (min)</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="30"
                                                placeholderTextColor="#4B5563"
                                                keyboardType="numeric"
                                                value={formData.duration_minutes}
                                                onChangeText={(text) => setFormData({ ...formData, duration_minutes: text })}
                                            />
                                        </View>
                                    </View>

                                    <RichTextInput
                                        label="Reason for Visit"
                                        placeholder="e.g. Annual check-up, bath and nail trim..."
                                        value={formData.reason}
                                        onChangeText={(text) => setFormData({ ...formData, reason: text })}
                                        minHeight={60}
                                    />
                                </View>
                            </View>

                            {/* Medical Fields (Veterinary Only) */}
                            {formData.provider_type === 'veterinary' && (
                                <View>
                                    <View className="flex-row items-center gap-2 mb-4">
                                        <Ionicons name="pulse" size={20} color="#EF4444" />
                                        <Text className="text-white text-lg font-bold">Medical Details</Text>
                                    </View>

                                    <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
                                            <View className="flex-row gap-2 px-1">
                                                {COMMON_SYMPTOMS.map(symptom => (
                                                    <TouchableOpacity
                                                        key={symptom}
                                                        onPress={() => toggleSymptom(symptom)}
                                                        className={`px-3 py-1.5 rounded-lg border ${formData.symptoms.includes(symptom)
                                                            ? 'bg-[#EF4444]/20 border-[#EF4444]'
                                                            : 'border-[#374151]'
                                                            }`}
                                                    >
                                                        <Text className={`text-xs font-medium ${formData.symptoms.includes(symptom) ? 'text-[#EF4444]' : 'text-[#9CA3AF]'
                                                            }`}>
                                                            {symptom}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>

                                        <RichTextInput
                                            label="Diagnosis / Assessment"
                                            placeholder="What did the vet say?"
                                            value={formData.diagnosis}
                                            onChangeText={(text) => setFormData({ ...formData, diagnosis: text })}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Provider & Location */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="location" size={20} color="#EC4899" />
                                    <Text className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Provider & Location</Text>
                                </View>

                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Business Name *</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder={`Enter ${selectedProvider?.label.toLowerCase()} name...`}
                                            placeholderTextColor="#4B5563"
                                            value={formData.business_name}
                                            onChangeText={(text) => setFormData({ ...formData, business_name: text })}
                                        />
                                    </View>

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Provider Name (Optional)</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="Dr. Smith, Jane Doe, etc."
                                            placeholderTextColor="#4B5563"
                                            value={formData.provider_name}
                                            onChangeText={(text) => setFormData({ ...formData, provider_name: text })}
                                        />
                                    </View>

                                    {/* Address with Google Places Autocomplete */}
                                    <PlacesAutocomplete
                                        value={formData.business_address}
                                        onSelect={handlePlaceSelect}
                                        placeholder="Search for clinic, groomer, or business..."
                                        types={['veterinary_care', 'establishment']}
                                        label="Business Address (Optional)"
                                    />

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Phone</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="(555) 123-4567"
                                                placeholderTextColor="#4B5563"
                                                value={formData.business_phone}
                                                onChangeText={(text) => setFormData({ ...formData, business_phone: text })}
                                                keyboardType="phone-pad"
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Website</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="www.example.com"
                                                placeholderTextColor="#4B5563"
                                                value={formData.business_website}
                                                onChangeText={(text) => setFormData({ ...formData, business_website: text })}
                                                keyboardType="url"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Cost */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="cash" size={20} color="#10B981" />
                                    <Text className="text-white text-lg font-bold">Cost</Text>
                                </View>
                                <View className="bg-[#2C2C2E] rounded-2xl p-4 space-y-4">
                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Total Cost</Text>
                                            <TextInput
                                                className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                                placeholder="0.00"
                                                placeholderTextColor="#4B5563"
                                                keyboardType="numeric"
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

                                    <View>
                                        <Text className="text-[#9CA3AF] text-xs font-medium mb-2">Payment Method (Optional)</Text>
                                        <TextInput
                                            className="w-full bg-[#1C1C1E] rounded-xl px-4 py-3 text-white text-base"
                                            placeholder="Cash, Card, Insurance..."
                                            placeholderTextColor="#4B5563"
                                            value={formData.payment_method}
                                            onChangeText={(text) => setFormData({ ...formData, payment_method: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Notes */}
                            <View>
                                <RichTextInput
                                    label="Additional Notes"
                                    placeholder="Any other details about this visit..."
                                    value={formData.notes}
                                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                    minHeight={80}
                                />
                            </View>

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
