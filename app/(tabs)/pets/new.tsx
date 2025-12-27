import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import WizardStepBasicInfo from '@/components/desktop/pets/wizard/WizardStepBasicInfo';
import WizardStepContactInfo from '@/components/desktop/pets/wizard/WizardStepContactInfo';
import WizardStepDetails from '@/components/desktop/pets/wizard/WizardStepDetails';
import WizardStepReview from '@/components/desktop/pets/wizard/WizardStepReview';
import { uploadPetPhoto } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { designSystem } from '@/constants/designSystem';

const STEPS = ['Basic Info', 'Contact Info', 'Details', 'Review'];

export default function AddPetPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        species: '',
        breed: '',
        color: '',
        gender: '',
        date_of_birth: '',
        weight: 0,
        weight_unit: 'kg',
        photoUri: undefined as string | undefined,
        // Contact Info
        microchip_number: '',
        vet_name: '',
        vet_clinic_name: '',
        vet_address: '',
        vet_country: '',
        vet_phone: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        // Details
        allergies: [],
        special_needs: '',
        notes: '',
        is_spayed_neutered: false,
    });

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const handleSubmit = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('pets')
                .insert({
                    user_id: user.id,
                    name: formData.name,
                    species: formData.species,
                    breed: formData.breed || null,
                    color: formData.color || null,
                    gender: formData.gender || null,
                    date_of_birth: formData.date_of_birth || null,
                    weight: formData.weight || null,
                    weight_unit: formData.weight_unit,
                    microchip_number: formData.microchip_number || null,
                    notes: formData.notes || null,
                    is_spayed_neutered: formData.is_spayed_neutered,
                })
                .select()
                .single();

            if (error) throw error;

            const petId = data.id;

            // Create Veterinarian (if provided)
            if (formData.vet_clinic_name) {
                await supabase
                    .from('veterinarians')
                    .insert({
                        pet_id: petId,
                        clinic_name: formData.vet_clinic_name,
                        vet_name: formData.vet_name || undefined,
                        address: formData.vet_address || undefined,
                        country: formData.vet_country || undefined,
                        phone: formData.vet_phone || undefined,
                        is_primary: true,
                    });
            }

            // Upload Photo if exists
            if (formData.photoUri) {
                try {
                    const uploadedUrl = await uploadPetPhoto(user.id, petId, formData.photoUri);
                    if (uploadedUrl) {
                        await supabase
                            .from('pets')
                            .update({ photo_url: uploadedUrl })
                            .eq('id', petId);
                    }
                } catch (photoError) {
                    console.warn('Photo upload failed but pet created:', photoError);
                }
            }

            Alert.alert('Success', 'Pet added successfully!');
            router.replace(`/(tabs)/pets/${data.id}/overview` as any); // Navigate to new pet profile
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, isMobile && styles.contentMobile]}>
                {/* Header */}
                <View style={[styles.header, isMobile && styles.headerMobile]}>
                    <Text style={[styles.title, { color: designSystem.colors.text.primary }]}>Add New Pet</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color={designSystem.colors.text.tertiary} />
                    </TouchableOpacity>
                </View>

                {/* Progress Stepper */}
                <View style={[styles.stepper, isMobile && styles.stepperMobile]}>
                    {STEPS.map((step, index) => (
                        <View key={index} style={styles.stepperItem}>
                            <View style={styles.stepperLine}>
                                {index > 0 && (
                                    <View
                                        style={[
                                            styles.stepperLineSegment,
                                            index <= currentStep && { backgroundColor: designSystem.colors.primary[500] },
                                        ]}
                                    />
                                )}
                            </View>
                            <View
                                style={[
                                    styles.stepperCircle,
                                    index <= currentStep && {
                                        borderColor: designSystem.colors.primary[500],
                                        backgroundColor: designSystem.colors.primary[500]
                                    },
                                ]}
                            >
                                {index < currentStep ? (
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                ) : (
                                    <Text
                                        style={[
                                            styles.stepperNumber,
                                            index <= currentStep && { color: '#fff' },
                                        ]}
                                    >
                                        {index + 1}
                                    </Text>
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.stepperLabel,
                                    index <= currentStep && {
                                        color: designSystem.colors.primary[500],
                                        fontWeight: '600'
                                    },
                                ]}
                            >
                                {step}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Step Content */}
                <View style={[styles.stepContent, isMobile && styles.stepContentMobile]}>
                    {currentStep === 0 && (
                        <WizardStepBasicInfo
                            formData={formData}
                            onUpdate={setFormData as any}
                            onNext={handleNext}
                        />
                    )}
                    {currentStep === 1 && (
                        <WizardStepContactInfo
                            formData={formData}
                            onUpdate={setFormData as any}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    )}
                    {currentStep === 2 && (
                        <WizardStepDetails
                            formData={formData}
                            onUpdate={setFormData as any}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    )}
                    {currentStep === 3 && (
                        <WizardStepReview
                            formData={formData}
                            onBack={handleBack}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
                    )}
                </View>

                {/* Navigation Footer (if not handled inside steps) */}
                {/* Note: Standard WizardSteps handle navigation buttons internally? 
                    WizardStepBasicInfo has internal Next button (line 287 of Step 2911). 
                    Let's assume others do too, so we only need Back button for steps > 0 IF steps don't have it.
                    Step 2911 shows only Next button. 
                    Let's keep the Back button footer here just in case, but position it carefully. 
                    Actually, we pass onBack to steps > 0 (lines 191, 196, 201), so they might handle it.
                */}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
    content: {
        flex: 1,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
        padding: 32,
    },
    contentMobile: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        paddingTop: 16, // Safe area padding
    },
    headerMobile: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
    },
    stepper: {
        flexDirection: 'row',
        marginBottom: 40,
        position: 'relative',
    },
    stepperMobile: {
        marginBottom: 24,
    },
    stepperItem: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    stepperLine: {
        position: 'absolute',
        left: '50%',
        right: '-50%',
        top: 16,
        height: 2,
    },
    stepperLineSegment: {
        height: 2,
        backgroundColor: designSystem.colors.neutral[200],
    },
    stepperCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: designSystem.colors.neutral[200],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        zIndex: 1,
    },
    stepperNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
    },
    stepperLabel: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
    },
    stepContent: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        // shadows
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    stepContentMobile: {
        borderRadius: 12,
    },
});
