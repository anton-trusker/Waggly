import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import FormModal from '@/components/ui/FormModal';
import { designSystem } from '@/constants/designSystem';
import { usePets } from '@/hooks/usePets';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { uploadPetPhoto } from '@/lib/storage';
import { Pet, Veterinarian, EmergencyContact } from '@/types/index';

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
    const pet = pets.find(p => p.id === petId);

    const [activeTab, setActiveTab] = useState<TabKey>(TABS[initialTab].key);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Pet>>({});
    const [vetData, setVetData] = useState<Partial<Veterinarian>>({});
    const [emergencyData, setEmergencyData] = useState<Partial<EmergencyContact>>({});

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (pet && visible) {
            setFormData({
                ...pet,
                microchip_implantation_date: pet.microchip_implantation_date || undefined,
                sterilization_date: pet.sterilization_date || undefined,
            });
            // Reset errors when opening
            setErrors({});
        }
    }, [pet, visible]);

    const handleFieldChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when field is modified
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) newErrors.name = "Pet name is required";
        if (!formData.species?.trim()) newErrors.species = "Species is required";

        // Date validation logic could be added here

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            // Ensure we are on the tab with errors if possible, or just alert generic
            if (errors.name || errors.species) setActiveTab('basic');
            Alert.alert('Validation Error', 'Please check the required fields.');
            return;
        }

        setLoading(true);
        try {
            // 1. Upload new photo if changed (and is a local uri)
            let photoUrl = formData.photo_url;
            if (photoUrl && !photoUrl.startsWith('http') && user) {
                photoUrl = await uploadPetPhoto(user.id, petId, photoUrl);
            }

            // 2. Update Pet Data
            const petUpdates: any = {
                ...formData,
                photo_url: photoUrl,
                updated_at: new Date().toISOString(),
            };

            // Remove UI-only fields that aren't in the database
            delete petUpdates.role;
            delete petUpdates.permissions;

            await updatePet(petId, petUpdates);

            // 3. Update Contacts (Vet)
            if (vetData.id) {
                await supabase.from('veterinarians').update(vetData).eq('id', vetData.id);
            } else if (vetData.clinic_name) {
                // Insert new vet
                await supabase.from('veterinarians').insert({ ...vetData, pet_id: petId, is_primary: true });
            }

            // 4. Update Emergency Contact
            if (emergencyData.id) {
                if (!emergencyData.name) {
                    await supabase.from('emergency_contacts').delete().eq('id', emergencyData.id);
                } else {
                    await supabase.from('emergency_contacts').update(emergencyData).eq('id', emergencyData.id);
                }
            } else if (emergencyData.name) {
                await supabase.from('emergency_contacts').insert({ ...emergencyData, pet_id: petId });
            }

            Alert.alert('Success', 'Pet profile updated successfully!');
            onClose();
        } catch (error: any) {
            console.error('Failed to update pet:', error);
            Alert.alert('Error', error.message || 'Failed to update pet profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!pet) return null;

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={`Edit ${pet.name}'s Details`}
            submitLabel="Save Changes"
            onSubmit={handleSave}
            loading={loading}
        >
            {() => (
                <View style={styles.container}>
                    {/* Tabs */}
                    <View style={styles.tabBar}>
                        {TABS.map(tab => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[styles.tab, activeTab === tab.key && styles.tabActive] as any}
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
                        {activeTab === 'basic' && (
                            <EditPetBasicInfo
                                data={formData}
                                onChange={handleFieldChange}
                                errors={errors}
                            />
                        )}
                        {activeTab === 'health' && (
                            <EditPetHealth
                                data={formData}
                                onChange={handleFieldChange}
                                errors={errors}
                            />
                        )}
                        {activeTab === 'contacts' && (
                            <EditPetContacts
                                petId={petId}
                                onSaveVet={setVetData}
                                onSaveEmergency={setEmergencyData}
                                errors={errors}
                            />
                        )}
                    </ScrollView>
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    container: { minHeight: 500 },
    tabBar: {
        flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: designSystem.colors.neutral[200],
        marginBottom: 20
    },
    tab: {
        flex: 1, paddingVertical: 12, alignItems: 'center',
        borderBottomWidth: 2, borderBottomColor: 'transparent'
    },
    tabActive: { borderBottomColor: designSystem.colors.primary[500] },
    tabText: { ...designSystem.typography.label.small, color: designSystem.colors.text.secondary, fontWeight: '600' },
    tabTextActive: { color: designSystem.colors.primary[500] },
    scrollView: { maxHeight: 500 }, // Prevent modal from growing too large
    scrollContent: { paddingBottom: 20 },
});
