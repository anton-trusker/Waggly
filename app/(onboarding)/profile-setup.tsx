import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import CountrySelect from '@/components/ui/CountrySelect';
import NativeDatePicker from '@/components/ui/NativeDatePicker';
import AvatarUpload from '@/components/ui/AvatarUpload';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useLocale } from '@/hooks/useLocale';
import { uploadUserPhoto } from '@/lib/storage';
import { router } from 'expo-router';
import BottomCTA from '@/components/ui/BottomCTA';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { useTranslation } from 'react-i18next';

export default function OnboardingScreen() {
  const { user } = useAuth();
  const { upsertProfile } = useProfile();
  const { locale } = useLocale();
  const { t } = useTranslation();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState<string | undefined>(undefined);
  // language is now handled in previous step, so we use current locale as default
  const [dob, setDob] = useState<Date | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = firstName.trim().length > 0 && lastName.trim().length > 0;

  const onSave = async () => {
    if (!canSave) {
      Alert.alert(t('common.error'), t('profile.enter_first_name'));
      return;
    }
    
    setSaving(true);
    try {
      let photoUrl: string | undefined = undefined;
      if (photo && user) {
        photoUrl = await uploadUserPhoto(user.id, photo);
      }
      
      const { error } = await upsertProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        country_code: country,
        language_code: locale, // Use currently selected locale
        date_of_birth: dob ? dob.toISOString() : undefined,
        photo_url: photoUrl,
      });
      
      if (error) {
        Alert.alert(t('common.error'), typeof error === 'object' && 'message' in (error as any) ? (error as any).message : t('profile.failed_save'));
        setSaving(false);
        return;
      }
      
      router.replace('/(tabs)/(home)');
    } catch (e) {
      console.error('Onboarding save error', e);
      Alert.alert(t('common.error'), t('profile.failed_save'));
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <Text style={styles.title}>{t('onboarding.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>

          <AvatarUpload uri={photo} onChange={setPhoto} />

          <Input
            label={t('onboarding.first_name')}
            placeholder="onboarding.first_name_placeholder"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Input
            label={t('onboarding.last_name')}
            placeholder="onboarding.last_name_placeholder"
            value={lastName}
            onChangeText={setLastName}
          />

          <CountrySelect 
            value={country} 
            onChange={setCountry} 
            label={t('onboarding.country')} 
          />
          
          <NativeDatePicker 
            value={dob} 
            onChange={setDob} 
            label={t('onboarding.date_of_birth')}
            maximumDate={new Date()}
          />
        </ScrollView>
        <BottomCTA 
          onBack={() => router.back()} // Allow going back to Language Select
          onPrimary={onSave} 
          primaryLabel={t('common.save')} 
          disabled={saving || !canSave} 
        />
        <LoadingOverlay visible={saving} message={t('onboarding.saving')} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 16 },
  button: { marginTop: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
});
