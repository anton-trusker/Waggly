import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, ActivityIndicator, useWindowDimensions, Image, Modal, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useLocale } from '@/hooks/useLocale';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { COUNTRIES } from '@/constants/countries';
import { useCityAutocomplete } from '@/hooks/useCityAutocomplete';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

export default function ProfilePage() {
  const { user, signOut, profile: authProfile, refreshProfile } = useAuth(); // Use profile from AuthContext
  const { profile: hookProfile, upsertProfile, loading: profileLoading } = useProfile(); // Keep for update logic
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy'>('account');

  // Use authProfile (globally cached) preferably, fall back to hookProfile
  const profile = authProfile || hookProfile;

  // Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [website, setWebsite] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [languageCode, setLanguageCode] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('US');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // City autocomplete using Google Places JS SDK
  const cityAutocomplete = useCityAutocomplete(countryCode);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [healthReminders, setHealthReminders] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);

  // Initialize profile data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhotoUrl(profile.photo_url || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
      setGender(profile.gender || '');
      setWebsite(profile.website || '');
      setDateOfBirth(profile.date_of_birth || '');
      setAddress(profile.address || '');
      setCountryCode(profile.country_code || '');
      setLanguageCode(profile.language_code || '');

      // Parse phone number
      if (profile.phone) {
        // Sort countries by dial code length descending to match longest prefix first
        const sortedCountries = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
        const match = sortedCountries.find(c => profile.phone?.startsWith(c.dialCode));
        if (match) {
          setPhoneCountryCode(match.code);
          setPhone(profile.phone.slice(match.dialCode.length));
        } else {
          setPhone(profile.phone);
        }
      }

      // If we had notification prefs in profile, we'd load them here
      // const prefs = profile.notification_prefs as any;
      // if (prefs) { ... }
    }
  }, [profile]);

  const handlePhotoUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingPhoto(true);
        const file = result.assets[0];

        // Upload to Supabase Storage using the user-photos bucket
        const fileExt = file.uri.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user?.id}/profile/${fileName}`;

        // Convert URI to blob for web upload
        const response = await fetch(file.uri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('user-photos')
          .upload(filePath, blob, {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('user-photos')
          .getPublicUrl(filePath);

        setPhotoUrl(publicUrl);

        // Delete old photo if exists
        if (profile?.photo_url && profile.photo_url !== publicUrl) {
          const oldPath = profile.photo_url.split('/').pop();
          if (oldPath) {
            await supabase.storage
              .from('user-photos')
              .remove([`${user?.id}/profile/${oldPath}`])
              .catch(console.warn);
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Upload Error', error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    // Use phone state directly if simple field, or combine logic if complex
    // Assuming simple field from modal changes, but here we might want to keep robust parsing if editing again
    // For now, let's just save the phone string as is if user edited it, or use the combined logic if we kept the picker
    // If we want to align with onboarding modal, we should probably simplify this page too.
    // But keeping existing logic for now as it's more advanced.
    
    const { error } = await upsertProfile({
      first_name: firstName,
      last_name: lastName,
      photo_url: photoUrl,
      phone: phone ? `${COUNTRIES.find(c => c.code === phoneCountryCode)?.dialCode || '+1'}${phone}` : null,
      bio: bio || null,
      gender: gender || null,
      website: website || null,
      date_of_birth: dateOfBirth || null,
      address: address || null,
      country_code: countryCode || null,
      language_code: languageCode || null,
    } as any);
    
    if (!error) {
        await refreshProfile(); // Refresh global context
    }
    
    setSaving(false);

    if (error) {
      Alert.alert(t('common.error'), t('profile.error_update'));
    } else {
      Alert.alert('Success', t('profile.success_update'));
      setIsEditing(false);
    }
  };

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Request Sent', 'Your account deletion request has been received.')
        }
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download Data',
      'This will download all your account data including profile information, pets, and settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          style: 'default',
          onPress: () => {
            // In a real implementation, this would trigger a data export
            Alert.alert('Download Started', 'Your data export is being prepared and will be downloaded shortly.');
          }
        }
      ]
    );
  };

  const handleSignOutAllDevices = () => {
    Alert.alert(
      'Sign Out All Devices',
      'This will sign you out of all devices except this one. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // In a real implementation, this would invalidate all sessions
            Alert.alert('Success', 'You have been signed out of all other devices.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ConfirmationModal
        visible={showSignOutConfirm}
        title={t('profile.sign_out_confirm_title')}
        message={t('profile.sign_out_confirm_message')}
        confirmText={t('profile.sign_out')}
        cancelText={t('common.cancel')}
        onConfirm={async () => {
          setShowSignOutConfirm(false);
          try {
            await signOut();
          } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert(t('common.error'), 'Failed to sign out. Please try again.');
          }
        }}
        onCancel={() => setShowSignOutConfirm(false)}
        variant="danger"
        icon="log-out-outline"
      />
      {/* Header */}
      {/* Header - Desktop Only (Mobile uses Global AppHeader) */}
      {!isMobile && (
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <Text style={styles.subtitle}>{t('profile.subtitle')}</Text>
        </View>
      )}

      <View style={[styles.content, isMobile && styles.contentMobile]}>
        {/* Sidebar Tabs */}
        <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
          <ScrollView
            horizontal={isMobile}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={isMobile ? styles.sidebarScrollMobile : undefined}
          >
            <TouchableOpacity
              style={[styles.sidebarItem, activeTab === 'account' && styles.sidebarItemActive, isMobile && styles.sidebarItemMobile] as any}
              onPress={() => setActiveTab('account')}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={activeTab === 'account' ? '#6366F1' : '#6B7280'}
              />
              <Text style={[styles.sidebarText, activeTab === 'account' && styles.sidebarTextActive]}>
                {t('profile.tab_account')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sidebarItem, activeTab === 'notifications' && styles.sidebarItemActive, isMobile && styles.sidebarItemMobile] as any}
              onPress={() => setActiveTab('notifications')}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={activeTab === 'notifications' ? '#6366F1' : '#6B7280'}
              />
              <Text style={[styles.sidebarText, activeTab === 'notifications' && styles.sidebarTextActive]}>
                {t('profile.tab_notifications')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sidebarItem, activeTab === 'privacy' && styles.sidebarItemActive, isMobile && styles.sidebarItemMobile] as any}
              onPress={() => setActiveTab('privacy')}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={activeTab === 'privacy' ? '#6366F1' : '#6B7280'}
              />
              <Text style={[styles.sidebarText, activeTab === 'privacy' && styles.sidebarTextActive]}>
                {t('profile.tab_privacy')}
              </Text>
            </TouchableOpacity>

            {!isMobile && (
              <>
                <View style={styles.sidebarDivider} />
                <TouchableOpacity
                  style={styles.sidebarItem}
                  onPress={handleSignOut}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  <Text style={[styles.sidebarText, { color: '#EF4444' }]}>{t('profile.sign_out')}</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>

        {/* Main Content */}
        <ScrollView style={[styles.main, isMobile && styles.mainMobile]} showsVerticalScrollIndicator={false}>
          {activeTab === 'account' && (
            <View style={styles.tabContent}>
              <ProfileHeader
                firstName={firstName}
                lastName={lastName}
                email={user?.email}
                photoUrl={photoUrl}
                address={address} // Keep address separate from country/city concat for now
                isEditing={isEditing}
                onEdit={() => setIsEditing(!isEditing)}
                onPhotoUpload={handlePhotoUpload}
              />

              {isEditing ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{t('profile.section_personal')}</Text>

                  <View style={[styles.row, isMobile && styles.rowMobile]}>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>{t('profile.label_first_name')}</Text>
                      <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="John"
                      />
                    </View>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>{t('profile.label_last_name')}</Text>
                      <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Doe"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profile.label_email')}</Text>
                    <View style={styles.emailContainer}>
                      <Ionicons name="mail-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
                      <Text style={styles.emailText}>{user?.email || 'No email set'}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>{t('profile.label_dob')}</Text>
                      {Platform.OS === 'web' ? (
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          style={{
                            height: 48,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            backgroundColor: '#fff',
                            paddingLeft: 16,
                            paddingRight: 16,
                            fontSize: 16,
                            color: '#111827',
                            outline: 'none',
                            border: '1px solid #E5E7EB',
                          }}
                        />
                      ) : (
                        <TextInput
                          style={styles.input}
                          value={dateOfBirth}
                          onChangeText={setDateOfBirth}
                          placeholder="dd/mm/yyyy"
                        />
                      )}
                    </View>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>{t('profile.label_gender')}</Text>
                      <View style={styles.genderRow}>
                        {['male', 'female', 'other'].map((g) => (
                          <TouchableOpacity
                            key={g}
                            style={[
                              styles.genderChip,
                              gender === g && styles.genderChipActive
                            ] as any}
                            onPress={() => setGender(g)}
                          >
                            <Text style={[
                              styles.genderText,
                              gender === g && styles.genderTextActive
                            ]}>
                              {g.charAt(0).toUpperCase() + g.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profile.label_phone')}</Text>
                    <View style={styles.phoneRow}>
                      <TouchableOpacity
                        style={styles.phoneCountryButton}
                        onPress={() => setShowPhoneCountryPicker(true)}
                      >
                        <Text style={styles.phoneFlag}>
                          {COUNTRIES.find(c => c.code === phoneCountryCode)?.flag || '🇺🇸'}
                        </Text>
                        <Text style={styles.phoneDialCode}>
                          {COUNTRIES.find(c => c.code === phoneCountryCode)?.dialCode || '+1'}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color="#6B7280" />
                      </TouchableOpacity>
                      <TextInput
                        style={[styles.input, styles.phoneInput] as any}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="(555) 123-4567"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profile.label_website')}</Text>
                    <TextInput
                      style={styles.input}
                      value={website}
                      onChangeText={setWebsite}
                      placeholder="https://example.com"
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profile.label_address')}</Text>
                    <TextInput
                      style={styles.input}
                      value={address}
                      onChangeText={setAddress}
                      placeholder="123 Main St, City, State"
                    />
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>{t('profile.label_country')}</Text>
                      <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowCountryPicker(true)}
                      >
                        <Text style={countryCode ? styles.dropdownText : styles.dropdownPlaceholder}>
                          {countryCode ? `${COUNTRIES.find(c => c.code === countryCode)?.flag} ${COUNTRIES.find(c => c.code === countryCode)?.name}` : t('profile.select_country')}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>{t('profile.label_city')}</Text>
                      <View style={styles.cityAutocomplete}>
                        <View style={styles.cityInputContainer}>
                          <Ionicons name="location-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
                          <TextInput
                            style={styles.cityInput}
                            value={cityAutocomplete.query || cityAutocomplete.selectedCity}
                            onChangeText={cityAutocomplete.setQuery}
                            placeholder={t('profile.search_city')}
                            placeholderTextColor="#9CA3AF"
                            onFocus={() => setShowCityDropdown(true)}
                            onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                          />
                          {cityAutocomplete.loading && (
                            <ActivityIndicator size="small" color="#6366F1" />
                          )}
                          {cityAutocomplete.selectedCity && !cityAutocomplete.loading && (
                            <TouchableOpacity onPress={cityAutocomplete.clearCity}>
                              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                          )}
                        </View>
                        {showCityDropdown && cityAutocomplete.predictions.length > 0 && (
                          <View style={styles.cityDropdown}>
                            {cityAutocomplete.predictions.map((prediction) => (
                              <TouchableOpacity
                                key={prediction.place_id}
                                style={styles.cityDropdownItem}
                                onPress={() => {
                                  cityAutocomplete.selectCity(prediction);
                                  setShowCityDropdown(false);
                                }}
                              >
                                <Ionicons name="location" size={16} color="#6366F1" />
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                  <Text style={styles.cityMainText}>{prediction.main_text}</Text>
                                  <Text style={styles.citySecondaryText}>{prediction.secondary_text}</Text>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>{t('profile.label_language')}</Text>
                      <View style={styles.languageRow}>
                        {['en', 'de', 'fr', 'ru'].map((lang) => (
                          <TouchableOpacity
                            key={lang}
                            style={[
                              styles.langChip,
                              languageCode === lang && styles.langChipActive
                            ] as any}
                            onPress={() => {
                              setLanguageCode(lang);
                              setLocale(lang); // Immediate update
                            }}
                          >
                            <Text style={[
                              styles.langText,
                              languageCode === lang && styles.langTextActive
                            ]}>
                              {lang === 'en' ? 'English' :
                                lang === 'de' ? 'Deutsch' :
                                  lang === 'fr' ? 'Français' :
                                    lang === 'ru' ? 'Русский' : lang}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profile.label_bio')}</Text>
                    <TextInput
                      style={[styles.input, styles.textArea] as any}
                      value={bio}
                      onChangeText={setBio}
                      placeholder={t('profile.placeholder_bio')}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled] as any}
                    onPress={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>{t('profile.save_changes')}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.profileView, styles.profileGrid]}>
                  <View style={[styles.infoSection, styles.infoSectionGrid]}>
                    <Text style={styles.infoLabel}>{t('profile.label_first_name')} / {t('profile.label_last_name')}</Text>
                    <Text style={styles.infoValue}>{(firstName || lastName) ? `${firstName} ${lastName}`.trim() : '-'}</Text>
                  </View>

                  <View style={[styles.infoSection, styles.infoSectionGrid]}>
                    <Text style={styles.infoLabel}>{t('profile.label_dob')}</Text>
                    <Text style={styles.infoValue}>{dateOfBirth || '-'}</Text>
                  </View>

                  <View style={[styles.infoSection, styles.infoSectionGrid]}>
                    <Text style={styles.infoLabel}>{t('profile.label_gender')}</Text>
                    <Text style={styles.infoValue}>{gender || '-'}</Text>
                  </View>

                  <View style={[styles.infoSection, styles.infoSectionGrid]}>
                    <Text style={styles.infoLabel}>{t('profile.label_phone')}</Text>
                    <Text style={styles.infoValue}>{phone || '-'}</Text>
                  </View>

                  <View style={[styles.infoSection, styles.infoSectionGrid]}>
                    <Text style={styles.infoLabel}>{t('profile.label_website')}</Text>
                    <Text style={[styles.infoValue, website ? styles.link : {}]}>{website || '-'}</Text>
                  </View>

                  <View style={[styles.infoSection, styles.infoSectionGrid]}>
                    <Text style={styles.infoLabel}>{t('profile.label_address')}</Text>
                    <Text style={styles.infoValue}>{address || '-'}</Text>
                  </View>

                  <View style={[styles.infoSection, styles.infoSectionGrid]}>
                    <Text style={styles.infoLabel}>{t('profile.label_country')}</Text>
                    {countryCode ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 20 }}>
                          {COUNTRIES.find(c => c.code === countryCode)?.flag}
                        </Text>
                        <Text style={styles.infoValue}>
                          {COUNTRIES.find(c => c.code === countryCode)?.name || countryCode}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.infoValue}>-</Text>
                    )}
                  </View>

                  <View style={[styles.infoSection, styles.infoSectionGrid]}>
                    <Text style={styles.infoLabel}>{t('profile.label_language')}</Text>
                    <Text style={styles.infoValue}>
                      {languageCode ? (languageCode === 'en' ? 'English' :
                        languageCode === 'de' ? 'Deutsch' :
                          languageCode === 'fr' ? 'Français' :
                            languageCode === 'ru' ? 'Русский' : languageCode) : '-'}
                    </Text>
                  </View>

                  <View style={[styles.infoSection, styles.infoSectionFull]}>
                    <Text style={styles.infoLabel}>{t('profile.label_bio')}</Text>
                    <Text style={styles.infoValue}>{bio || '-'}</Text>
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitle}>{t('profile.section_security')}</Text>
              <View style={styles.section}>
                <TouchableOpacity style={styles.changePasswordButton}>
                  <Ionicons name="key-outline" size={20} color="#6366F1" />
                  <Text style={styles.changePasswordText}>{t('profile.change_password')}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>{t('profile.section_quick_links')}</Text>
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.changePasswordButton}
                  onPress={() => router.push('/(tabs)/profile/co-owners' as any)}
                >
                  <Ionicons name="people-outline" size={20} color="#6366F1" />
                  <Text style={styles.changePasswordText}>{t('profile.manage_co_owners')}</Text>
                </TouchableOpacity>
              </View>

              {isMobile && (
                <View style={{ marginTop: 24 }}>
                  <TouchableOpacity style={[styles.dangerButton, { justifyContent: 'center', backgroundColor: '#FEF2F2', borderRadius: 12 }]} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.dangerButtonText}>{t('profile.sign_out')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {activeTab === 'notifications' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>{t('profile.section_notifications')}</Text>

              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>{t('profile.subsection_general')}</Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('profile.notif_email')}</Text>
                    <Text style={styles.settingDescription}>
                      {t('profile.notif_email_desc')}
                    </Text>
                  </View>
                  <Switch
                    value={emailNotifications}
                    onValueChange={setEmailNotifications}
                    trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                    thumbColor={emailNotifications ? '#6366F1' : '#fff'}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('profile.notif_push')}</Text>
                    <Text style={styles.settingDescription}>
                      {t('profile.notif_push_desc')}
                    </Text>
                  </View>
                  <Switch
                    value={pushNotifications}
                    onValueChange={setPushNotifications}
                    trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                    thumbColor={pushNotifications ? '#6366F1' : '#fff'}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>{t('profile.subsection_pet_care')}</Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('profile.notif_health')}</Text>
                    <Text style={styles.settingDescription}>
                      {t('profile.notif_health_desc')}
                    </Text>
                  </View>
                  <Switch
                    value={healthReminders}
                    onValueChange={setHealthReminders}
                    trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                    thumbColor={healthReminders ? '#6366F1' : '#fff'}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('profile.notif_event')}</Text>
                    <Text style={styles.settingDescription}>
                      {t('profile.notif_event_desc')}
                    </Text>
                  </View>
                  <Switch
                    value={eventReminders}
                    onValueChange={setEventReminders}
                    trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                    thumbColor={eventReminders ? '#6366F1' : '#fff'}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('profile.notif_weight')}</Text>
                    <Text style={styles.settingDescription}>
                      {t('profile.notif_weight_desc')}
                    </Text>
                  </View>
                  <Switch
                    value={true}
                    onValueChange={(value) => console.log('Weight tracking:', value)}
                    trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                    thumbColor={'#6366F1'}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>{t('profile.subsection_communication')}</Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('profile.notif_newsletter')}</Text>
                    <Text style={styles.settingDescription}>
                      {t('profile.notif_newsletter_desc')}
                    </Text>
                  </View>
                  <Switch
                    value={true}
                    onValueChange={(value) => console.log('Newsletter:', value)}
                    trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                    thumbColor={'#6366F1'}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('profile.notif_updates')}</Text>
                    <Text style={styles.settingDescription}>
                      {t('profile.notif_updates_desc')}
                    </Text>
                  </View>
                  <Switch
                    value={true}
                    onValueChange={(value) => console.log('Product updates:', value)}
                    trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                    thumbColor={'#6366F1'}
                  />
                </View>
              </View>
            </View>
          )}

          {activeTab === 'privacy' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Privacy & Security</Text>

              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Data Protection</Text>

                <View style={styles.privacyItem}>
                  <Ionicons name="shield-checkmark-outline" size={24} color="#10B981" />
                  <View style={styles.privacyInfo}>
                    <Text style={styles.privacyLabel}>Data Encryption</Text>
                    <Text style={styles.privacyDescription}>
                      All your data is encrypted end-to-end using industry-standard encryption
                    </Text>
                  </View>
                </View>

                <View style={styles.privacyItem}>
                  <Ionicons name="eye-off-outline" size={24} color="#6366F1" />
                  <View style={styles.privacyInfo}>
                    <Text style={styles.privacyLabel}>Private by Default</Text>
                    <Text style={styles.privacyDescription}>
                      Your pet information is only visible to you and authorized co-owners
                    </Text>
                  </View>
                </View>

                <View style={styles.privacyItem}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#F59E0B" />
                  <View style={styles.privacyInfo}>
                    <Text style={styles.privacyLabel}>Secure Backups</Text>
                    <Text style={styles.privacyDescription}>
                      Your data is securely backed up and can be restored if needed
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Account Activity</Text>

                <View style={styles.activityItem}>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityLabel}>Last Login</Text>
                    <Text style={styles.activityValue}>Today at 2:34 PM</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                </View>

                <View style={styles.activityItem}>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityLabel}>Account Created</Text>
                    <Text style={styles.activityValue}>
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    </Text>
                  </View>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                </View>

                <View style={styles.activityItem}>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityLabel}>Data Download</Text>
                    <Text style={styles.activityDescription}>
                      Download all your account data
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.actionButton} onPress={handleDownloadData}>
                    <Text style={styles.actionButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Danger Zone</Text>

                <TouchableOpacity style={styles.warningButton} onPress={handleSignOutAllDevices}>
                  <Ionicons name="log-out-outline" size={20} color="#F59E0B" />
                  <Text style={styles.warningButtonText}>Sign Out of All Devices</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  <Text style={styles.dangerButtonText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      {isMobile && <View style={{ height: 80 }} />}

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.content}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Select Country</Text>
              <TouchableOpacity onPress={() => { setShowCountryPicker(false); setCountrySearch(''); }}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <View style={modalStyles.searchContainer}>
              <Ionicons name="search" size={18} color="#6B7280" />
              <TextInput
                style={modalStyles.searchInput}
                placeholder="Search country..."
                value={countrySearch}
                onChangeText={setCountrySearch}
              />
            </View>
            <FlatList
              data={COUNTRIES.filter(c =>
                c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                c.code.toLowerCase().includes(countrySearch.toLowerCase())
              )}
              keyExtractor={(item) => item.code}
              style={{ maxHeight: 400 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[modalStyles.item, countryCode === item.code && modalStyles.itemSelected] as any}
                  onPress={() => {
                    setCountryCode(item.code);
                    setShowCountryPicker(false);
                    setCountrySearch('');
                  }}
                >
                  <Text style={modalStyles.flag}>{item.flag}</Text>
                  <Text style={modalStyles.countryName}>{item.name}</Text>
                  {countryCode === item.code && (
                    <Ionicons name="checkmark" size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Phone Country Picker Modal */}
      <Modal
        visible={showPhoneCountryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhoneCountryPicker(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.content}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Select Country Code</Text>
              <TouchableOpacity onPress={() => { setShowPhoneCountryPicker(false); setCountrySearch(''); }}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <View style={modalStyles.searchContainer}>
              <Ionicons name="search" size={18} color="#6B7280" />
              <TextInput
                style={modalStyles.searchInput}
                placeholder="Search country..."
                value={countrySearch}
                onChangeText={setCountrySearch}
              />
            </View>
            <FlatList
              data={COUNTRIES.filter(c =>
                c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                c.dialCode.includes(countrySearch)
              )}
              keyExtractor={(item) => item.code}
              style={{ maxHeight: 400 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[modalStyles.item, phoneCountryCode === item.code && modalStyles.itemSelected] as any}
                  onPress={() => {
                    setPhoneCountryCode(item.code);
                    setShowPhoneCountryPicker(false);
                    setCountrySearch('');
                  }}
                >
                  <Text style={modalStyles.flag}>{item.flag}</Text>
                  <Text style={modalStyles.countryName}>{item.name}</Text>
                  <Text style={modalStyles.dialCode}>{item.dialCode}</Text>
                  {phoneCountryCode === item.code && (
                    <Ionicons name="checkmark" size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    margin: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#111827',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  itemSelected: {
    backgroundColor: '#EEF2FF',
  },
  flag: {
    fontSize: 24,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  dialCode: {
    fontSize: 14,
    color: '#6B7280',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerMobile: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  contentMobile: {
    flexDirection: 'column',
  },
  sidebar: {
    width: 240,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    padding: 16,
  },
  sidebarMobile: {
    width: '100%',
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 0,
    backgroundColor: '#fff',
  },
  sidebarScrollMobile: {
    padding: 8,
    gap: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  sidebarItemMobile: {
    marginBottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sidebarItemActive: {
    backgroundColor: '#F0F6FF',
  },
  sidebarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  sidebarTextActive: {
    color: '#6366F1',
  },
  main: {
    flex: 1,
    padding: 32,
  },
  mainMobile: {
    padding: 16,
  },
  tabContent: {
    gap: 32,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Plus Jakarta Sans',
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputGroup: {
    gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  rowMobile: {
    flexDirection: 'column',
  },
  flex1: {
    flex: 1,
  },
  saveButton: {
    height: 48,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    gap: 12,
  },
  changePasswordText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  langChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  langText: {
    fontSize: 14,
    color: '#6B7280',
  },
  langTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genderChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  genderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  genderTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  emailText: {
    color: '#6B7280',
    fontSize: 16,
  },
  cityAutocomplete: {
    zIndex: 10,
  },
  cityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  cityInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#111827',
  },
  cityDropdown: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: 200,
    zIndex: 1000,
  },
  cityDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cityMainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  citySecondaryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
  },
  phoneCountryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    gap: 6,
  },
  phoneFlag: {
    fontSize: 18,
  },
  phoneDialCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  phoneInput: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F6FF',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  profileView: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoSectionGrid: {
    width: '48%',
    marginBottom: 24,
  },
  infoSectionFull: {
    width: '100%',
    marginBottom: 24,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  link: {
    color: '#6366F1',
    textDecorationLine: 'underline',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  warningButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  warningButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: '#F0F6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
});
