import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import FormModal from '@/components/ui/FormModal';
import { designSystem } from '@/constants/designSystem';
import { usePets } from '@/hooks/usePets';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { uploadPetPhoto } from '@/lib/storage';
import { Pet } from '@/types/index';

// Sub-components (will be refactored next)
import EditPetBasicInfo from './edit/EditPetBasicInfo';
import EditPetHealth from './edit/EditPetHealth';
import EditPetContacts from './edit/EditPetContacts';

interface EditPetModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    initialTab?: number;
}

type TabKey = 'basic' | 'health' | 'contacts';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'health', label: 'Health & ID' },
    { key: 'contacts', label: 'Contacts' },
];

export default function EditPetModal({ visible, onClose, petId, initialTab = 0 }: EditPetModalProps) {
    const { pets, updatePet } = usePets();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabKey>(TABS[initialTab].key);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form Setup
    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            // Pet Basics
            name: '',
            species: '',
            breed: '',
            gender: undefined,
            date_of_birth: undefined,
            photo_url: '',
            // Physical
            color: '',
            eye_color: '',
            coat_type: '',
            tail_length: '',
            fur_description: '',
            distinguishing_marks: '',
            size: '',
            weight: null as number | null,
            height: null as number | null,
            // Health
            microchip_number: '',
            registry_provider: '',
            microchip_implantation_date: undefined,
            blood_type: '',
            is_spayed_neutered: false,
            sterilization_date: undefined,
            // Contacts (Vet & Emergency)
            vet_id: null,
            vet_clinic_name: '',
            vet_name: '',
            vet_phone: '',
            vet_address: '',
            ec_id: null,
            ec_name: '',
            ec_phone: '',
            ec_relationship: '' // if needed
        }
    });

    const { reset, handleSubmit, setValue } = methods;

    // Fetch Data on Open
    useEffect(() => {
        if (visible && petId) {
            loadData();
            setActiveTab(TABS[initialTab].key);
        }
    }, [visible, petId]);

    const loadData = async () => {
        setFetching(true);
        try {
            // 1. Get Pet Data (from props or refetch if needed, props is usually faster but lacks hydration sometimes)
            // We use the 'pets' array from hook which is reliable
            const pet = pets.find(p => p.id === petId);

            if (!pet) throw new Error('Pet not found');

            // 2. Fetch Vet & Emergency Contact
            const [vetRes, ecRes] = await Promise.all([
                supabase.from('veterinarians').select('*').eq('pet_id', petId).eq('is_primary', true).single(),
                supabase.from('emergency_contacts').select('*').eq('pet_id', petId).limit(1).single() // removed .single() strict check in case multiple, just take 1
            ]);

            const vet = vetRes.data;
            const ec = ecRes.data;

            // 3. Reset Form with merged data
            reset({
                ...pet,
                // Ensure dates are strings or nulls as expected by fields
                date_of_birth: pet.date_of_birth || undefined,

                // Vet
                vet_id: vet?.id || null,
                vet_clinic_name: vet?.clinic_name || '',
                vet_name: vet?.vet_name || '',
                vet_phone: vet?.phone || '',
                vet_address: vet?.address || '',

                // Emergency
                ec_id: ec?.id || null,
                ec_name: ec?.name || '',
                ec_phone: ec?.phone || '',
            });

        } catch (e) {
            console.error('Error loading pet details:', e);
            Alert.alert('Error', 'Failed to load details');
            onClose();
        } finally {
            setFetching(false);
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // 1. Upload Photo if changed (handled by comp? No, comp returns new URI)
            // The MediaWidget returns a URI. If it's a local file (file://), we upload.
            let finalPhotoUrl = data.photo_url;
            if (finalPhotoUrl && !finalPhotoUrl.startsWith('http') && user) {
                finalPhotoUrl = await uploadPetPhoto(user.id, petId, finalPhotoUrl);
            }

            // 2. Update Pet
            const petUpdates = {
                name: data.name,
                species: data.species,
                breed: data.breed,
                gender: data.gender,
                date_of_birth: data.date_of_birth,
                photo_url: finalPhotoUrl,
                color: data.color,
                eye_color: data.eye_color,
                coat_type: data.coat_type,
                tail_length: data.tail_length,
                fur_description: data.fur_description,
                distinguishing_marks: data.distinguishing_marks,
                weight: data.weight,
                height: data.height,
                microchip_number: data.microchip_number,
                registry_provider: data.registry_provider,
                microchip_implantation_date: data.microchip_implantation_date,
                blood_type: data.blood_type,
                is_spayed_neutered: data.is_spayed_neutered,
                sterilization_date: data.sterilization_date,
                updated_at: new Date().toISOString(),
            };

            await updatePet(petId, petUpdates);

            // 3. Update Vet
            // If we have an ID, update. If no ID but have name, insert.
            if (data.vet_clinic_name || data.vet_id) {
                const vetPayload = {
                    clinic_name: data.vet_clinic_name,
                    vet_name: data.vet_name,
                    phone: data.vet_phone,
                    address: data.vet_address,
                    is_primary: true,
                    pet_id: petId
                };

                if (data.vet_id) {
                    await supabase.from('veterinarians').update(vetPayload).eq('id', data.vet_id);
                } else {
                    await supabase.from('veterinarians').insert(vetPayload);
                }
            }

            // 4. Update Emergency Contact
            if (data.ec_name || data.ec_id) {
                const ecPayload = {
                    name: data.ec_name,
                    phone: data.ec_phone,
                    pet_id: petId
                };

                if (data.ec_id) {
                    if (!data.ec_name) {
                        // Delete if name cleared?
                        await supabase.from('emergency_contacts').delete().eq('id', data.ec_id);
                    } else {
                        await supabase.from('emergency_contacts').update(ecPayload).eq('id', data.ec_id);
                    }
                } else if (data.ec_name) {
                    await supabase.from('emergency_contacts').insert(ecPayload);
                }
            }

            Alert.alert('Success', 'Profile updated successfully');
            onClose();

        } catch (e: any) {
            console.error('Save error:', e);
            Alert.alert('Error', e.message || 'Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title="Edit Pet Details"
            submitLabel="Save Changes"
            onSubmit={handleSubmit(onSubmit)}
            loading={loading || fetching}
        >
            {() => (
                <FormProvider {...methods}>
                    <View style={styles.container}>
                        {/* Tabs */}
                        <View style={styles.tabBar}>
                            {TABS.map(tab => (
                                <TouchableOpacity
                                    key={tab.key}
                                    style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                                    onPress={() => setActiveTab(tab.key)}
                                >
                                    <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Content */}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {!fetching && (
                                <>
                                    <View style={{ display: activeTab === 'basic' ? 'flex' : 'none' }}>
                                        <EditPetBasicInfo />
                                    </View>
                                    <View style={{ display: activeTab === 'health' ? 'flex' : 'none' }}>
                                        <EditPetHealth />
                                    </View>
                                    <View style={{ display: activeTab === 'contacts' ? 'flex' : 'none' }}>
                                        <EditPetContacts />
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </FormProvider>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    container: { minHeight: 400 },
    tabBar: {
        flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: designSystem.colors.neutral[200],
        marginBottom: 20
    },
    tab: {
        flex: 1, paddingVertical: 12, alignItems: 'center',
        borderBottomWidth: 2, borderBottomColor: 'transparent'
    },
    tabActive: { borderBottomColor: designSystem.colors.primary[500] },
    tabText: { fontSize: 13, color: designSystem.colors.text.secondary, fontWeight: '600' },
    tabTextActive: { color: designSystem.colors.primary[500] },
    scrollView: { maxHeight: 500 },
    scrollContent: { paddingBottom: 20 },
});
