import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import WizardStepBasicInfo from '@/components/desktop/pets/wizard/WizardStepBasicInfo';
import WizardStepContactInfo from '@/components/desktop/pets/wizard/WizardStepContactInfo';
import WizardStepDetails from '@/components/desktop/pets/wizard/WizardStepDetails';
import WizardStepReview from '@/components/desktop/pets/wizard/WizardStepReview';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
        // Contact Info
        microchip_number: '',
        vet_name: '',
        vet_address: '',
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
        }
    };

    const handleSubmit = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('pets')
                .insert({
                    profile_id: user.id,
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

            Alert.alert('Success', 'Pet added successfully!');
            router.push(`/web/pets/${data.id}` as any);
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
                    <Text style={styles.title}>Add New Pet</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color="#6B7280" />
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
                                            index <= currentStep && styles.stepperLineSegmentActive,
                                        ]}
                                    />
                                )}
                            </View>
                            <View
                                style={[
                                    styles.stepperCircle,
                                    index <= currentStep && styles.stepperCircleActive,
                                ]}
                            >
                                {index < currentStep ? (
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                ) : (
                                    <Text
                                        style={[
                                            styles.stepperNumber,
                                            index <= currentStep && styles.stepperNumberActive,
                                        ]}
                                    >
                                        {index + 1}
                                    </Text>
                                )}
                            </View>
                            {/* Hide stepper labels on very small screens if needed, or keep them small */}
                            <Text
                                style={[
                                    styles.stepperLabel,
                                    index <= currentStep && styles.stepperLabelActive,
                                ]}
                            >
                                {step}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Step Content */}
                <View style={styles.stepContent}>
                    {currentStep === 0 && (
                        <WizardStepBasicInfo
                            formData={formData}
                            onUpdate={setFormData}
                            onNext={handleNext}
                        />
                    )}
                    {currentStep === 1 && (
                        <WizardStepContactInfo
                            formData={formData}
                            onUpdate={setFormData}
                            onNext={handleNext}
                            onBack={handleBack}
                        />
                    )}
                    {currentStep === 2 && (
                        <WizardStepDetails
                            formData={formData}
                            onUpdate={setFormData}
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

                {/* Navigation Footer */}
                {currentStep > 0 && (
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={20} color="#6366F1" />
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
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
    },
    headerMobile: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
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
        backgroundColor: '#E5E7EB',
    },
    stepperLineSegmentActive: {
        backgroundColor: '#6366F1',
    },
    stepperCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        zIndex: 1,
    },
    stepperCircleActive: {
        borderColor: '#6366F1',
        backgroundColor: '#6366F1',
    },
    stepperNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    stepperNumberActive: {
        color: '#fff',
    },
    stepperLabel: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    stepperLabelActive: {
        color: '#6366F1',
        fontWeight: '600',
    },
    stepContent: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    footer: {
        marginTop: 24,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
});
