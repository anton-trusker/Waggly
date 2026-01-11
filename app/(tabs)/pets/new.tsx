import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/useLocale';
import WizardLayout from '@/components/features/pets/wizard/WizardLayout';
import Step1BasicInfo, { Step1Data } from '@/components/features/pets/wizard/Step1BasicInfo';
import Step2Details, { Step2Data } from '@/components/features/pets/wizard/Step2Details';
import Step3Identification, { Step3Data } from '@/components/features/pets/wizard/Step3Identification';
import Step5Review from '@/components/features/pets/wizard/Step5Review';
import { usePets } from '@/hooks/usePets';
import { useAuth } from '@/contexts/AuthContext';
import { uploadPetPhoto } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

// Combined Data Type
type WizardData = Step1Data & Step2Data & Step3Data;

const INITIAL_DATA: WizardData = {
    name: '',
    species: 'dog',
    photoUri: undefined,
    gender: 'male',
    breed: '',
    dateOfBirth: undefined,
    weight: 0,
    weightUnit: 'kg',
    bloodType: '',
    microchipNumber: '',
    implantationDate: undefined,
    tagId: '',
    vetClinicName: '',
    vetName: '',
    vetAddress: '',
    vetCountry: '',
    vetPhone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
};

export default function AddPetWizardScreen() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<WizardData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useLocale();
    const { addPet, updatePet } = usePets();
    const { user } = useAuth();

    const totalSteps = 4;

    const updateData = (data: Partial<WizardData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleNextStep1 = (data: Step1Data) => {
        updateData(data);
        setStep(2);
    };

    const handleNextStep2 = (data: Step2Data) => {
        updateData(data);
        setStep(3);
    };

    const handleNextStep3 = (data: Step3Data) => {
        updateData(data);
        setStep(4); // Go directly to review
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            router.back();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Create Pet
            const finalWeightKg = formData.weightUnit === 'kg'
                ? formData.weight
                : Number((formData.weight * 0.453592).toFixed(2));

            const { data: petData, error: petError } = await addPet({
                name: formData.name.trim(),
                species: formData.species,
                breed: formData.breed || undefined,
                gender: formData.gender,
                date_of_birth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : undefined,
                weight_current: formData.weight > 0 ? finalWeightKg : undefined,
                blood_type: formData.bloodType || undefined,
                microchip_number: formData.microchipNumber || undefined,
                microchip_implantation_date: formData.implantationDate ? formData.implantationDate.toISOString().split('T')[0] : undefined,
                registration_id: formData.tagId || undefined,
            });

            if (petError || !petData) {
                throw new Error(petError?.message ?? t('add_pet.error_create'));
            }

            const petId = (petData as any).id;

            // 2. Upload Photo (if any)
            if (formData.photoUri && user) {
                try {
                    const uploadedUrl = await uploadPetPhoto(user.id, petId, formData.photoUri);
                    if (uploadedUrl) {
                        await updatePet(petId, { avatar_url: uploadedUrl });
                    }
                } catch (photoError) {
                    console.warn('Photo upload failed but pet created:', photoError);
                    // Non-blocking
                }
            }

            // 3. Create Veterinarian (if provided)
            if (formData.vetClinicName) {
                const { error: vetError } = await (supabase as any)
                    .from('veterinarians')
                    .insert({
                        pet_id: petId,
                        clinic_name: formData.vetClinicName,
                        vet_name: formData.vetName || undefined,
                        address: formData.vetAddress || undefined,
                        country: formData.vetCountry || undefined,
                        phone: formData.vetPhone || undefined,
                        is_primary: true,
                    } as any);

                if (vetError) {
                    console.error('Failed to save vet info:', vetError);
                }
            }

            // 4. Create Emergency Contact (if provided)
            if (formData.emergencyContactName) {
                const { error: emergencyError } = await (supabase as any)
                    .from('emergency_contacts')
                    .insert({
                        pet_id: petId,
                        name: formData.emergencyContactName,
                        phone: formData.emergencyContactPhone || undefined,
                    } as any);

                if (emergencyError) {
                    console.error('Failed to save emergency contact:', emergencyError);
                }
            }

            if (Platform.OS === 'web') {
                router.replace('/(tabs)/(home)');
            } else {
                Alert.alert(
                    t('add_pet.success_title'),
                    t('add_pet.success_message', { name: formData.name }),
                    [{ text: 'OK', onPress: () => router.replace('/(tabs)/(home)') }]
                );
            }

        } catch (error: any) {
            Alert.alert(t('common.error'), error.message || t('common.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return t('add_pet.steps.basic_info');
            case 2: return t('add_pet.steps.details');
            case 3: return t('add_pet.steps.health_id');
            case 4: return t('add_pet.steps.contacts');
            case 5: return t('add_pet.steps.review');
            default: return '';
        }
    };

    return (
        <WizardLayout
            currentStep={step}
            totalSteps={totalSteps}
            title={getStepTitle()}
            onBack={handleBack}
        >
            {step === 1 && (
                <Step1BasicInfo
                    initialData={formData}
                    onNext={handleNextStep1}
                />
            )}
            {step === 2 && (
                <Step2Details
                    initialData={formData}
                    species={formData.species}
                    onNext={handleNextStep2}
                />
            )}
            {step === 3 && (
                <Step3Identification
                    initialData={formData}
                    onNext={handleNextStep3}
                />
            )}
            {step === 4 && (
                <Step5Review
                    data={formData}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}
        </WizardLayout>
    );
}
