import React, { useState } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useLocale } from '@/hooks/useLocale';
import { useTranslation } from 'react-i18next';
import { uploadUserPhoto } from '@/lib/storage';
import { designSystem } from '@/constants/designSystem';

import LanguageStep from '@/components/features/onboarding/LanguageStep';
import NameStep from '@/components/features/onboarding/NameStep';
import GenderStep from '@/components/features/onboarding/GenderStep';
import PhotoStep from '@/components/features/onboarding/PhotoStep';

export default function OnboardingScreen() {
    const { user } = useAuth();
    const { upsertProfile } = useProfile();
    const { setLocale } = useLocale();
    const { t } = useTranslation();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        language: 'en',
        firstName: '',
        lastName: '',
        gender: '',
        photoUri: null as string | null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleLanguageNext = (language: string) => {
        updateData({ language });
        setLocale(language);
        nextStep();
    };

    const handleNameNext = (firstName: string, lastName: string) => {
        updateData({ firstName, lastName });
        nextStep();
    };

    const handleGenderNext = (gender: string) => {
        updateData({ gender });
        nextStep();
    };

    const handlePhotoNext = async (photoUri: string | null) => {
        updateData({ photoUri });
        await handleSubmit(photoUri); // Pass directly to avoid stale state
    };

    const handleSubmit = async (finalPhotoUri: string | null) => {
        setIsSubmitting(true);
        try {
            let photoUrl: string | undefined = undefined;

            if (finalPhotoUri && user) {
                photoUrl = await uploadUserPhoto(user.id, finalPhotoUri);
            }

            const { error } = await upsertProfile({
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
                language_code: formData.language,
                gender: (formData.gender || undefined) as 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | undefined,
                photo_url: photoUrl,
            });

            if (error) {
                throw error;
            }

            router.replace('/(tabs)/(home)');
        } catch (e: any) {
            console.error('Onboarding save error', e);
            Alert.alert('Error', e.message || 'Failed to save profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {step === 1 && (
                <LanguageStep onNext={handleLanguageNext} />
            )}
            {step === 2 && (
                <NameStep
                    initialFirstName={formData.firstName}
                    initialLastName={formData.lastName}
                    onNext={handleNameNext}
                    onBack={prevStep}
                />
            )}
            {step === 3 && (
                <GenderStep
                    initialGender={formData.gender}
                    onNext={handleGenderNext}
                    onBack={prevStep}
                />
            )}
            {step === 4 && (
                <PhotoStep
                    onNext={handlePhotoNext}
                    onBack={prevStep}
                    isSubmitting={isSubmitting}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
});
