import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { designSystem } from '@/constants/designSystem';
import * as Location from 'expo-location';

// Design System
import { TextField } from '@/components/design-system/forms/TextField';
import { DateField } from '@/components/design-system/forms/DateField';
import { SelectField } from '@/components/design-system/forms/SelectField';
import { MediaWidget } from '@/components/design-system/widgets/MediaWidget';
import { Button } from '@/components/design-system/primitives/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import CountrySelect from '@/components/ui/CountrySelect'; // Keep for now if no replacement, or use SelectField with country data

interface UserOnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

interface OnboardingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dateOfBirth: Date; // DateField uses Date
  countryCode: string;
  photoUrl: string;
}

export default function UserOnboardingModal({ visible, onClose, onComplete }: UserOnboardingModalProps) {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [loading, setLoading] = useState(false);
  const hasPrefilled = useRef(false);

  const methods = useForm<OnboardingFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      gender: '',
      countryCode: 'US',
      photoUrl: ''
    }
  });

  const { control, handleSubmit, setValue, watch, formState: { errors } } = methods;

  // Auto-detect Country
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS !== 'web') {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            const address = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
            if (address && address.length > 0 && address[0].isoCountryCode) {
              setValue('countryCode', address[0].isoCountryCode);
            }
          }
        }
      } catch (error) {
        console.log('Error detecting location:', error);
      }
    })();
  }, [setValue]);

  // Prefill
  useEffect(() => {
    if (user?.user_metadata && !hasPrefilled.current) {
      const { full_name, first_name, last_name, avatar_url } = user.user_metadata;
      if (first_name) setValue('firstName', first_name);
      if (last_name) setValue('lastName', last_name);
      if (!first_name && !last_name && full_name) {
        const parts = full_name.split(' ');
        if (parts.length > 0) setValue('firstName', parts[0]);
        if (parts.length > 1) setValue('lastName', parts.slice(1).join(' '));
      }
      if (avatar_url) setValue('photoUrl', avatar_url);
      hasPrefilled.current = true;
    }
  }, [user, setValue]);

  const uploadImage = async (uri: string) => {
    try {
      if (uri.startsWith('http')) return uri; // Already remote
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop() || 'jpg'; // default extension if missing
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) return;
    setLoading(true);
    try {
      let finalPhotoUrl = data.photoUrl;
      if (finalPhotoUrl && !finalPhotoUrl.startsWith('http')) {
        const uploaded = await uploadImage(finalPhotoUrl);
        if (uploaded) finalPhotoUrl = uploaded;
      }

      const updates = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        gender: data.gender || null,
        date_of_birth: data.dateOfBirth?.toISOString() || null,
        country_code: data.countryCode,
        photo_url: finalPhotoUrl,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;

      onComplete();
      onClose();
    } catch (error: any) {
      console.error('Save error:', error);
      alert(`Failed to save profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, isDesktop && styles.containerDesktop]}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome to Waggly!</Text>
              <Text style={styles.subtitle}>Let's set up your profile to get started.</Text>
            </View>

            <FormProvider {...methods}>
              {/* Avatar */}
              <View style={styles.avatarSection}>
                <MediaWidget
                  value={watch('photoUrl')}
                  onChange={(uri) => setValue('photoUrl', uri)}
                  variant="avatar"
                />
              </View>

              {/* Form */}
              <View style={styles.form}>
                <View style={[styles.row, width < 425 && styles.rowMobile]}>
                  <View style={styles.inputWrapper}>
                    <TextField control={control} name="firstName" label="First Name" placeholder="Jane" required />
                  </View>
                  <View style={styles.rowSpacer} />
                  <View style={styles.inputWrapper}>
                    <TextField control={control} name="lastName" label="Last Name" placeholder="Doe" required />
                  </View>
                </View>

                <View style={[styles.row, { marginTop: 16 }]}>
                  {/* Country Select - Manual wrapper since we don't have SelectField with country logic yet, 
                             or we can just reuse the generic CountrySelect but wrapped in Controller?
                             For simplicity/speed, using CountrySelect directly controlled.
                         */}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Country</Text>
                    <CountrySelect
                      value={watch('countryCode')}
                      onChange={(code) => setValue('countryCode', code)}
                      label="Country"
                      // error={errors.countryCode?.message} 
                      containerStyle={{ backgroundColor: designSystem.colors.background.primary }}
                    />
                  </View>
                  <View style={{ width: 16 }} />
                  <View style={{ flex: 1 }}>
                    <TextField control={control} name="phone" label="Phone (Optional)" placeholder="+1 555..." keyboardType="phone-pad" />
                  </View>
                </View>

                <View style={[styles.row, { marginTop: 16 }]}>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      control={control}
                      name="gender"
                      label="Gender"
                      options={GENDERS}
                      placeholder="Select Gender"
                    />
                  </View>
                  <View style={{ width: 16 }} />
                  <View style={{ flex: 1 }}>
                    <DateField control={control} name="dateOfBirth" label="Date of Birth" />
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.footer}>
                <Button
                  title="Complete Setup"
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  size="lg"
                  fullWidth
                />
              </View>

            </FormProvider>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  containerDesktop: {
    maxWidth: 500,
    maxHeight: 750,
    height: 'auto',
    borderRadius: 24,
    overflow: 'hidden',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: designSystem.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: designSystem.colors.text.secondary,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
  },
  rowMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  rowSpacer: {
    width: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  footer: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.text.secondary,
    marginBottom: 8,
  }
});
