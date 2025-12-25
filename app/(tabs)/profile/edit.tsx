import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { useProfile } from '@/hooks/useProfile';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/contexts/AuthContext';
import CountrySelect from '@/components/ui/CountrySelect';
import LanguageSelect from '@/components/ui/LanguageSelect';
import DateInput from '@/components/ui/DateInput';
import AvatarUpload from '@/components/ui/AvatarUpload';
import Input from '@/components/ui/Input';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';
import { uploadUserPhoto } from '@/lib/storage';
import { router } from 'expo-router';

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
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState<string | undefined>(undefined);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [website, setWebsite] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setCountry(profile.country_code || undefined);
      setLanguage(profile.language_code || undefined);
      setDob(profile.date_of_birth || undefined);
      setPhoto(profile.photo_url || null);
      setAddress(profile.address || undefined);
      setPhone(profile.phone || undefined);
      setBio(profile.bio || undefined);
      setGender(profile.gender || undefined);
      setWebsite(profile.website || undefined);
      
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
        bio: bio?.trim() || null,
        gender: gender || null,
        website: website?.trim() || null,
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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <Text style={styles.title}>{t('profile.edit_profile')}</Text>
          <AvatarUpload uri={photo} onChange={setPhoto} />
          <Input
            label={t('profile.first_name')}
            placeholder={t('profile.enter_first_name')}
            value={firstName}
            onChangeText={setFirstName}
          />
          <Input
            label={t('profile.last_name')}
            placeholder={t('profile.enter_last_name')}
            value={lastName}
            onChangeText={setLastName}
          />
          
          <View style={styles.inputGroup}>
            <Text style={styles.sectionTitle}>{t('profile.personal_info')}</Text>
            <DateInput value={dob} onChange={setDob} />
            <Input
              label={t('profile.gender')}
              placeholder={t('profile.select_gender')}
              value={gender || ''}
              onChangeText={setGender}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.sectionTitle}>{t('profile.contact_info')}</Text>
            <Input
              label={t('profile.phone')}
              placeholder={t('profile.enter_phone')}
              value={phone || ''}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Input
              label={t('profile.website')}
              placeholder={t('profile.enter_website')}
              value={website || ''}
              onChangeText={setWebsite}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.sectionTitle}>{t('profile.location')}</Text>
            <CountrySelect value={country} onChange={setCountry} />
            <LanguageSelect value={language} onChange={setLanguage} label={t('common.language')} />
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
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.sectionTitle}>{t('profile.about')}</Text>
            <Input
              label={t('profile.bio')}
              placeholder={t('profile.enter_bio')}
              value={bio || ''}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity style={[buttonStyles.primary, styles.button]} onPress={onSave} disabled={saving || !canSave}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={buttonStyles.textWhite}>{t('common.save')}</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 12 },
  button: { marginTop: 16 },
  group: { marginBottom: 16 },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  textInput: {
    height: 44, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    backgroundColor: colors.card, paddingHorizontal: 12, color: colors.text,
  },
  inputGroup: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
});
