import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, useWindowDimensions, TouchableOpacity, Image, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { designSystem } from '@/constants/designSystem';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import Input from '@/components/ui/Input';
import { useLocale } from '@/hooks/useLocale';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import CountrySelect from '@/components/ui/CountrySelect';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';

interface UserOnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const GENDERS = [
  { value: 'male', label: 'Male', icon: 'male' },
  { value: 'female', label: 'Female', icon: 'female' },
  { value: 'non_binary', label: 'Non-binary', icon: 'transgender' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say', icon: 'lock-closed' },
] as const;

// Convert ISO date to DD-MM-YYYY for EnhancedDatePicker
const isoToDmy = (isoDate: string): string => {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};

// Convert DD-MM-YYYY back to ISO
const dmyToIso = (dmyDate: string): string => {
  if (!dmyDate) return '';
  const parts = dmyDate.split('-');
  if (parts.length !== 3) return dmyDate;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
};

export default function UserOnboardingModal({ visible, onClose, onComplete }: UserOnboardingModalProps) {
  const { user } = useAuth();
  const { setLocale } = useLocale();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [loading, setLoading] = useState(false);

  // Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('US'); // Default to US
  const [languageCode, setLanguageCode] = useState('en'); // Default to English
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const hasPrefilled = useRef(false);

  // Auto-detect Country on mount
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS !== 'web') {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') return;

          const location = await Location.getCurrentPositionAsync({});
          const address = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (address && address.length > 0 && address[0].isoCountryCode) {
            setCountryCode(address[0].isoCountryCode);
          }
        }
      } catch (error) {
        console.log('Error detecting location:', error);
      }
    })();
  }, []);

  // Prefill from User Metadata
  useEffect(() => {
    if (user?.user_metadata && !hasPrefilled.current) {
      const { full_name, first_name, last_name, avatar_url } = user.user_metadata;

      if (first_name) setFirstName(first_name);
      if (last_name) setLastName(last_name);

      // Fallback if split names aren't available but full_name is
      if (!first_name && !last_name && full_name) {
        const parts = full_name.split(' ');
        if (parts.length > 0) setFirstName(parts[0]);
        if (parts.length > 1) setLastName(parts.slice(1).join(' '));
      }

      // Prefill avatar if available and not already set
      if (avatar_url && !photo) {
        // We don't set 'photo' state directly with remote URL to avoid re-upload logic confusion
      }

      hasPrefilled.current = true;
    }
  }, [user]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop();
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

  const handleSave = async () => {
    if (!user) return;

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!countryCode) newErrors.countryCode = 'Country is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      let photoUrl = user.user_metadata?.avatar_url;

      if (photo) {
        const uploadedUrl = await uploadImage(photo);
        if (uploadedUrl) photoUrl = uploadedUrl;
      }

      const updates = {
        first_name: firstName,
        last_name: lastName,
        phone: phone, // Store phone string directly
        gender: gender || null,
        date_of_birth: dateOfBirth || null,
        country_code: countryCode,
        language_code: languageCode,
        photo_url: photoUrl,
        onboarding_completed: true, // Mark as completed
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      onComplete();
      onClose();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert(`Failed to save profile: ${error.message || 'Please try again.'}`);
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
              <Text style={styles.title}>Welcome to Pawzly!</Text>
              <Text style={styles.subtitle}>Let's set up your profile to get started.</Text>
            </View>

            {/* Avatar Picker */}
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.avatar} />
                ) : user?.user_metadata?.avatar_url ? (
                  <Image source={{ uri: user.user_metadata.avatar_url }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="camera" size={24} color={designSystem.colors.text.tertiary} />
                    <Text style={styles.avatarText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <View style={[styles.row, width < 425 && styles.rowMobile]}>
                <View style={[styles.inputWrapper, width < 425 && styles.inputWrapperMobile]}>
                  <Input
                    label="First Name"
                    placeholder="Jane"
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (errors.firstName) setErrors({ ...errors, firstName: '' });
                    }}
                    error={errors.firstName}
                    required
                    containerStyle={{ backgroundColor: '#fff' }}
                  />
                </View>
                <View style={[styles.rowSpacer, width < 425 && { width: 0, height: 12 }]} />
                <View style={[styles.inputWrapper, width < 425 && styles.inputWrapperMobile]}>
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (errors.lastName) setErrors({ ...errors, lastName: '' });
                    }}
                    error={errors.lastName}
                    required
                    containerStyle={{ backgroundColor: '#fff' }}
                  />
                </View>
              </View>

              {/* Country and Phone */}
              <View style={[styles.row, { marginTop: 16, zIndex: 20 }]}>
                <View style={{ flex: 1 }}>
                  <CountrySelect
                    value={countryCode}
                    onChange={(code) => {
                      setCountryCode(code);
                      if (errors.countryCode) setErrors({ ...errors, countryCode: '' });
                    }}
                    label="Country"
                    error={errors.countryCode}
                    containerStyle={{ backgroundColor: '#fff' }}
                  />
                </View>
                <View style={{ width: 16 }} />
                <View style={{ flex: 1 }}>
                  <Input
                    label="Phone (Optional)"
                    placeholder="+1 555..."
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    containerStyle={{ backgroundColor: '#fff' }}
                  />
                </View>
              </View>

              {/* Gender and DOB */}
              <View style={[styles.row, { marginTop: 16 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderContainer}>
                    {GENDERS.map((g) => (
                      <TouchableOpacity
                        key={g.value}
                        style={[
                          styles.genderChip,
                          gender === g.value && styles.genderChipActive,
                          { paddingHorizontal: 10, justifyContent: 'center' }
                        ]}
                        onPress={() => setGender(g.value)}
                      >
                        <Ionicons
                          name={g.icon as any}
                          size={20}
                          color={gender === g.value ? designSystem.colors.primary[500] : designSystem.colors.text.secondary}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  {gender ? (
                    <Text style={[styles.genderText, { marginTop: 4, fontSize: 12 }]}>
                      {GENDERS.find(g => g.value === gender)?.label}
                    </Text>
                  ) : null}
                </View>
                <View style={{ width: 16 }} />
                <View style={{ flex: 1 }}>
                  <EnhancedDatePicker
                    label="Date of Birth"
                    value={isoToDmy(dateOfBirth)}
                    onChange={(dmyDate) => setDateOfBirth(dmyToIso(dmyDate))}
                    placeholder="Select Date"
                  />
                </View>
              </View>

            </View>

            {/* Actions */}
            <View style={styles.footer}>
              <EnhancedButton
                title="Complete Setup"
                onPress={handleSave}
                loading={loading}
                fullWidth
              />
            </View>

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
    borderRadius: 0,
    overflow: 'hidden',
  },
  containerDesktop: {
    maxWidth: 500,
    maxHeight: 700,
    height: 'auto',
    borderRadius: 24,
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
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: designSystem.colors.neutral[100],
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    color: designSystem.colors.text.tertiary,
    marginTop: 4,
  },
  form: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
  },
  rowMobile: {
    flexDirection: 'column',
  },
  rowSpacer: {
    width: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  inputWrapperMobile: {
    flex: 0,
    width: '100%',
  },
  footer: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: designSystem.colors.text.primary,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
    gap: 6,
  },
  genderChipActive: {
    backgroundColor: designSystem.colors.primary[50],
    borderColor: designSystem.colors.primary[500],
  },
  genderText: {
    fontSize: 14,
    color: designSystem.colors.text.secondary,
    fontWeight: '500',
  },
});
