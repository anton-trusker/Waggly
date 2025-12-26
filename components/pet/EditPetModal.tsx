import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import FormModal from '@/components/ui/FormModal';
import { designSystem } from '@/constants/designSystem';
import { usePets } from '@/hooks/usePets';
import { Pet } from '@/types/components';

interface EditPetModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    initialTab?: number;
}

type TabKey = 'basic' | 'identification' | 'medical' | 'other';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'identification', label: 'Identification' },
    { key: 'medical', label: 'Medical' },
    { key: 'other', label: 'Insurance & Notes' },
];

export default function EditPetModal({ visible, onClose, petId, initialTab = 0 }: EditPetModalProps) {
    const { pets, updatePet } = usePets();
    const pet = pets.find(p => p.id === petId);

    const [activeTab, setActiveTab] = useState<TabKey>(TABS[initialTab].key);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        gender: '',
        date_of_birth: '',
        weight: '',
        microchip_number: '',
        color: '',
        blood_type: '',
        insurance_company: '',
        insurance_policy: '',
        special_notes: '',
    });

    useEffect(() => {
        if (pet) {
            setFormData({
                name: pet.name || '',
                species: pet.species || '',
                breed: pet.breed || '',
                gender: pet.gender || '',
                date_of_birth: pet.date_of_birth || '',
                weight: pet.weight?.toString() || '',
                microchip_number: pet.microchip_number || '',
                color: pet.color || '',
                blood_type: pet.blood_type || '',
                insurance_company: (pet as any).insurance_company || '',
                insurance_policy: (pet as any).insurance_policy || '',
                special_notes: (pet as any).special_notes || '',
            });
        }
    }, [pet, visible]);

    const handleSave = async () => {
        if (!formData.name || !formData.species) {
            Alert.alert('Validation Error', 'Name and Species are required fields.');
            return;
        }

        setLoading(true);
        try {
            const updates: Partial<Pet> = {
                name: formData.name,
                species: formData.species,
                breed: formData.breed || null,
                gender: formData.gender || null,
                date_of_birth: formData.date_of_birth || null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                microchip_number: formData.microchip_number || null,
                color: formData.color || null,
                blood_type: formData.blood_type || null,
            };

            await updatePet(petId, updates as any);
            Alert.alert('Success', 'Pet profile updated successfully!');
            onClose();
        } catch (error) {
            console.error('Failed to update pet:', error);
            Alert.alert('Error', 'Failed to update pet profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const renderBasicInfo = () => (
        <View style={styles.tabContent}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => updateField('name', value)}
                    placeholder="Enter pet name"
                    placeholderTextColor={designSystem.colors.text.tertiary}
                />
            </View>

            <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Species *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.species}
                        onChangeText={(value) => updateField('species', value)}
                        placeholder="Dog, Cat, etc."
                        placeholderTextColor={designSystem.colors.text.tertiary}
                    />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Breed</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.breed}
                        onChangeText={(value) => updateField('breed', value)}
                        placeholder="Breed"
                        placeholderTextColor={designSystem.colors.text.tertiary}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderButtons}>
                        {['Male', 'Female'].map(g => (
                            <TouchableOpacity
                                key={g}
                                style={[
                                    styles.genderButton,
                                    formData.gender === g.toLowerCase() && styles.genderButtonActive
                                ]}
                                onPress={() => updateField('gender', g.toLowerCase())}
                            >
                                <Text style={[
                                    styles.genderButtonText,
                                    formData.gender === g.toLowerCase() && styles.genderButtonTextActive
                                ]}>
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Weight</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.weight}
                        onChangeText={(value) => updateField('weight', value)}
                        placeholder="Weight (kg)"
                        keyboardType="decimal-pad"
                        placeholderTextColor={designSystem.colors.text.tertiary}
                    />
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                    style={styles.input}
                    value={formData.date_of_birth}
                    onChangeText={(value) => updateField('date_of_birth', value)}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={designSystem.colors.text.tertiary}
                />
            </View>
        </View>
    );

    const renderIdentification = () => (
        <View style={styles.tabContent}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Microchip Number</Text>
                <TextInput
                    style={styles.input}
                    value={formData.microchip_number}
                    onChangeText={(value) => updateField('microchip_number', value)}
                    placeholder="15-digit microchip number"
                    placeholderTextColor={designSystem.colors.text.tertiary}
                />
            </View>

            <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Color</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.color}
                        onChangeText={(value) => updateField('color', value)}
                        placeholder="Coat color"
                        placeholderTextColor={designSystem.colors.text.tertiary}
                    />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Blood Type</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.blood_type}
                        onChangeText={(value) => updateField('blood_type', value)}
                        placeholder="e.g. DEA 1.1+"
                        placeholderTextColor={designSystem.colors.text.tertiary}
                    />
                </View>
            </View>
        </View>
    );

    const renderMedical = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionNote}>
                Medical information like allergies and medications are managed in their respective sections.
            </Text>
        </View>
    );

    const renderOther = () => (
        <View style={styles.tabContent}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Insurance Company</Text>
                <TextInput
                    style={styles.input}
                    value={formData.insurance_company}
                    onChangeText={(value) => updateField('insurance_company', value)}
                    placeholder="Insurance provider name"
                    placeholderTextColor={designSystem.colors.text.tertiary}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Policy Number</Text>
                <TextInput
                    style={styles.input}
                    value={formData.insurance_policy}
                    onChangeText={(value) => updateField('insurance_policy', value)}
                    placeholder="Policy or member ID"
                    placeholderTextColor={designSystem.colors.text.tertiary}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Special Notes</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.special_notes}
                    onChangeText={(value) => updateField('special_notes', value)}
                    placeholder="Any special notes about your pet..."
                    placeholderTextColor={designSystem.colors.text.tertiary}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return renderBasicInfo();
            case 'identification':
                return renderIdentification();
            case 'medical':
                return renderMedical();
            case 'other':
                return renderOther();
            default:
                return null;
        }
    };

    if (!pet) return null;

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title="Edit Pet Profile"
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
                                style={[
                                    styles.tab,
                                    activeTab === tab.key && styles.tabActive
                                ]}
                                onPress={() => setActiveTab(tab.key)}
                            >
                                <Text style={[
                                    styles.tabText,
                                    activeTab === tab.key && styles.tabTextActive
                                ]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Tab Content */}
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {renderTabContent()}
                    </ScrollView>
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: 400,
    },
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.border.primary,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: designSystem.colors.primary[500],
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: designSystem.colors.text.secondary,
    },
    tabTextActive: {
        color: designSystem.colors.primary[500],
        fontWeight: '600',
    },
    scrollView: {
        maxHeight: 400,
    },
    scrollContent: {
        paddingBottom: 16,
    },
    tabContent: {
        gap: 20,
    },
    formGroup: {
        gap: 8,
    },
    formRow: {
        flexDirection: 'row',
        gap: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    input: {
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: designSystem.colors.text.primary,
        backgroundColor: '#fff',
    },
    textArea: {
        minHeight: 100,
        paddingTop: 12,
    },
    genderButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    genderButtonActive: {
        backgroundColor: designSystem.colors.primary[50],
        borderColor: designSystem.colors.primary[500],
    },
    genderButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: designSystem.colors.text.secondary,
    },
    genderButtonTextActive: {
        color: designSystem.colors.primary[500],
        fontWeight: '600',
    },
    sectionNote: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 40,
    },
});
