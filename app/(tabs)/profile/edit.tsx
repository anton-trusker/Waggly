import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/contexts/AuthContext';
import CountrySelect from '@/components/ui/CountrySelect';
import LanguageSelect from '@/components/ui/LanguageSelect';
import DateInput from '@/components/ui/DateInput';
import AvatarUpload from '@/components/ui/AvatarUpload';
import Input from '@/components/ui/Input';
import GenderSelect from '@/components/ui/GenderSelect';
import PhoneInput from '@/components/ui/PhoneInput';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';
import { uploadUserPhoto } from '@/lib/storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import MobileHeader from '@/components/layout/MobileHeader';

export default function EditProfileScreen() {
  const { profile, upsertProfile, loading: profileLoading } = useProfile();
  const { setLocale, t } = useLocale();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [dob, setDob] = useState<string | undefined>(undefined);
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canSave = useMemo(() => firstName.trim().length > 0 && lastName.trim().length > 0, [firstName, lastName]);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [locationDetails, setLocationDetails] = useState<{ lat: number; lng: number; placeId: string; name: string } | null>(null);
  const [phone, setPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('US');
  const [bio, setBio] = useState<string | undefined>(undefined);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [website, setWebsite] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setCountry(profile.country_code || undefined);
      setLanguage(profile.language_code || undefined);
      setDob(profile.date_of_birth || undefined);
      setPhoto(profile.photo_url || null);
      setAddress(profile.address || undefined);
      setPhone(profile.phone || '');
      setPhoneCountryCode(profile.phone_country_code || 'US');
      setBio(profile.bio || undefined);
      setGender(profile.gender || undefined);
      setWebsite(profile.website || undefined);
      setCity(profile.city || undefined);

      if (profile.location_lat != null && profile.location_lng != null && profile.place_id) {
        setLocationDetails({
          lat: profile.location_lat,
          lng: profile.location_lng,
          placeId: profile.place_id,
          name: profile.address || '',
        });
      } else {
        setLocationDetails(null);
      }
    }
  }, [profile]);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      let photoUrl: string | undefined = profile?.photo_url || undefined;
      if (photo && user && photo !== profile?.photo_url) {
        photoUrl = await uploadUserPhoto(user.id, photo, profile?.photo_url || null);
      }
      const { error } = await upsertProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        country_code: country,
        language_code: language,
        date_of_birth: dob,
        photo_url: photoUrl,
        address: address,
        location_lat: locationDetails?.lat || null,
        location_lng: locationDetails?.lng || null,
        place_id: locationDetails?.placeId || null,
        phone: phone?.trim() || null,
        phone_country_code: phoneCountryCode,
        bio: bio?.trim() || null,
        gender: gender || null,
        website: website?.trim() || null,
        city: city?.trim() || null,
      });
      if (error) {
        setSaving(false);
        Alert.alert('Error', typeof error === 'object' && 'message' in (error as any) ? (error as any).message : 'Failed to save profile');
        return;
      }
      if (language) {
        setLocale(language);
      }
      Alert.alert(t('common.save'), t('profile.saved_message'));
      router.back();
    } catch (e: any) {
      setSaving(false);
      console.error(e);
      Alert.alert(t('common.error'), e.message || t('profile.failed_save'));
    }
  };

  if (profileLoading && !profile) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
      </View>
    );
  }

  return (
    <DesktopShell>
      <MobileHeader
        title={t('profile.edit_profile')}
        showBack={true}
        rightAction={{
          icon: 'save',
          onPress: onSave,
          disabled: saving || !canSave,
          loading: saving
        }}
      />
      <View style={styles.container}>
        {/* Desktop Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('profile.edit_profile')}</Text>
          <TouchableOpacity onPress={onSave} disabled={saving || !canSave} style={styles.saveButton}>
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* Avatar */}
            <View style={styles.avatarSection}>
              <AvatarUpload uri={photo} onChange={setPhoto} />
              <Text style={styles.avatarHint}>Tap to change photo</Text>
            </View>

            {/* Basic Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person" size={20} color={designSystem.colors.primary[500]} />
                <Text style={styles.sectionTitle}>Basic Information</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.flex1}>
                    <Input
                      label={t('profile.first_name')}
                      placeholder="John"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  <View style={styles.flex1}>
                    <Input
                      label={t('profile.last_name')}
                      placeholder="Doe"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.flex1}>
                    <DateInput
                      value={dob}
                      onChange={setDob}
                      label="Date of Birth"
                    />
                  </View>
                  <View style={styles.flex1}>
                    <GenderSelect
                      value={gender}
                      onChange={setGender}
                      label={t('profile.gender')}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Contact Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="call" size={20} color={designSystem.colors.success[500]} />
                <Text style={styles.sectionTitle}>Contact Information</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <PhoneInput
                  value={phone}
                  onChangeText={handlePhoneChange}
                  defaultCountryCode={phoneCountryCode}
                />
                <Input
                  label={t('profile.website')}
                  placeholder="https://yourwebsite.com"
                  value={website || ''}
                  onChangeText={setWebsite}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location" size={20} color={designSystem.colors.warning[500]} />
                <Text style={styles.sectionTitle}>Location</Text>
              </View>

              <View style={styles.card}>
                <CountrySelect value={country} onChange={setCountry} label="Country" />

                <Input
                  label="City"
                  placeholder="New York"
                  value={city || ''}
                  onChangeText={setCity}
                />

                <LocationAutocomplete
                  label={t('profile.address')}
                  value={address}
                  onChangeText={(text) => setAddress(text)}
                  onPlaceSelected={(details) => {
                    setAddress(details.address);
                    setLocationDetails({
                      lat: details.lat,
                      lng: details.lng,
                      placeId: details.placeId,
                      name: details.name,
                    });
                  }}
                />

                <LanguageSelect value={language} onChange={setLanguage} label={t('common.language')} />
              </View>
            </View>

            {/* About */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text" size={20} color={designSystem.colors.info[500]} />
                <Text style={styles.sectionTitle}>About You</Text>
              </View>

              <View style={styles.card}>
                <Input
                  label={t('profile.bio')}
                  placeholder="Tell us about yourself and your pets..."
                  value={bio || ''}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </DesktopShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designSystem.colors.background.primary,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getSpacing(6),
    backgroundColor: designSystem.colors.background.primary,
    // On mobile, header is hidden/different
    display: Platform.OS === 'web' && window.innerWidth > 768 ? 'flex' : 'none',
    // ^ simplified check, in reality DesktopShell handles layout
  },
  headerTitle: {
    ...designSystem.typography.headline.medium,
    color: designSystem.colors.text.primary,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: designSystem.colors.primary[500],
    borderRadius: designSystem.borderRadius.md,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  saveTextDisabled: {
    opacity: 0.7,
  },
  content: {
    padding: getSpacing(5),
    paddingBottom: 60,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: getSpacing(6),
  },
  avatarHint: {
    fontSize: 13,
    color: designSystem.colors.text.tertiary,
    marginTop: 8,
  },
  section: {
    marginBottom: getSpacing(6),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: getSpacing(3),
  },
  sectionTitle: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
  },
  card: {
    backgroundColor: getColor('background.secondary'),
    borderRadius: designSystem.borderRadius.lg,
    padding: getSpacing(5),
    gap: getSpacing(4),
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
  },
  row: {
    flexDirection: 'row',
    gap: getSpacing(4),
  },
  flex1: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: designSystem.colors.text.secondary,
    marginBottom: 8,
  },
});
