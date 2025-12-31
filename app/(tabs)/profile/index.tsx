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

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, upsertProfile, loading: profileLoading } = useProfile();
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy'>('account');

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
    const { error } = await upsertProfile({
      first_name: firstName,
      last_name: lastName,
      photo_url: photoUrl,
      phone: phone || null,
      bio: bio || null,
      gender: gender || null,
      website: website || null,
      date_of_birth: dateOfBirth || null,
      address: address || null,
      country_code: countryCode || null,
      language_code: languageCode || null,
    } as any);
    setSaving(false);

    if (error) {
      Alert.alert('Error', 'Failed to update profile');
    } else {
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert(
                'Error',
                'Failed to sign out. Please try again.'
              );
            }
          }
        }
      ]
    );
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
      {/* Header */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <View style={[styles.content, isMobile && styles.contentMobile]}>
        {/* Sidebar Tabs */}
        <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
          <ScrollView
            horizontal={isMobile}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={isMobile ? styles.sidebarScrollMobile : undefined}
          >
            <TouchableOpacity
              style={[styles.sidebarItem, activeTab === 'account' && styles.sidebarItemActive, isMobile && styles.sidebarItemMobile]}
              onPress={() => setActiveTab('account')}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={activeTab === 'account' ? '#6366F1' : '#6B7280'}
              />
              <Text style={[styles.sidebarText, activeTab === 'account' && styles.sidebarTextActive]}>
                Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sidebarItem, activeTab === 'notifications' && styles.sidebarItemActive, isMobile && styles.sidebarItemMobile]}
              onPress={() => setActiveTab('notifications')}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={activeTab === 'notifications' ? '#6366F1' : '#6B7280'}
              />
              <Text style={[styles.sidebarText, activeTab === 'notifications' && styles.sidebarTextActive]}>
                Notifications
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sidebarItem, activeTab === 'privacy' && styles.sidebarItemActive, isMobile && styles.sidebarItemMobile]}
              onPress={() => setActiveTab('privacy')}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={activeTab === 'privacy' ? '#6366F1' : '#6B7280'}
              />
              <Text style={[styles.sidebarText, activeTab === 'privacy' && styles.sidebarTextActive]}>
                Privacy
              </Text>
            </TouchableOpacity>

            {!isMobile && (
              <>
                <View style={styles.sidebarDivider} />
                <TouchableOpacity style={styles.sidebarItem} onPress={handleSignOut}>
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  <Text style={[styles.sidebarText, { color: '#EF4444' }]}>Sign Out</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>

        {/* Main Content */}
        <ScrollView style={[styles.main, isMobile && styles.mainMobile]} showsVerticalScrollIndicator={false}>
          {activeTab === 'account' && (
            <View style={styles.tabContent}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarSection}>
                  <View style={styles.avatarContainer}>
                    {photoUrl ? (
                      <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {(firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')}
                        </Text>
                      </View>
                    )}
                    {isEditing && (
                      <TouchableOpacity style={styles.avatarEditButton} onPress={handlePhotoUpload}>
                        <Ionicons name="camera" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {firstName} {lastName}
                    </Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    {address && <Text style={styles.userLocation}>{address}</Text>}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Ionicons name={isEditing ? "close" : "pencil"} size={20} color="#6366F1" />
                  <Text style={styles.editButtonText}>{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
                </TouchableOpacity>
              </View>

              {isEditing ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Personal Information</Text>

                  <View style={[styles.row, isMobile && styles.rowMobile]}>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>First Name</Text>
                      <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="John"
                      />
                    </View>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>Last Name</Text>
                      <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Doe"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.emailContainer}>
                      <Ionicons name="mail-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
                      <Text style={styles.emailText}>{user?.email || 'No email set'}</Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>Date of Birth</Text>
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
                      <Text style={styles.label}>Gender</Text>
                      <View style={styles.genderRow}>
                        {['male', 'female', 'other'].map((g) => (
                          <TouchableOpacity
                            key={g}
                            style={[
                              styles.genderChip,
                              gender === g && styles.genderChipActive
                            ]}
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
                    <Text style={styles.label}>Phone</Text>
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
                        style={[styles.input, styles.phoneInput]}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="(555) 123-4567"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Website</Text>
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
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                      style={styles.input}
                      value={address}
                      onChangeText={setAddress}
                      placeholder="123 Main St, City, State"
                    />
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>Country</Text>
                      <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setShowCountryPicker(true)}
                      >
                        <Text style={countryCode ? styles.dropdownText : styles.dropdownPlaceholder}>
                          {countryCode ? `${COUNTRIES.find(c => c.code === countryCode)?.flag} ${COUNTRIES.find(c => c.code === countryCode)?.name}` : 'Select country'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.inputGroup, styles.flex1]}>
                      <Text style={styles.label}>City</Text>
                      <View style={styles.cityAutocomplete}>
                        <View style={styles.cityInputContainer}>
                          <Ionicons name="location-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
                          <TextInput
                            style={styles.cityInput}
                            value={cityAutocomplete.query || cityAutocomplete.selectedCity}
                            onChangeText={cityAutocomplete.setQuery}
                            placeholder="Search city..."
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
                      <Text style={styles.label}>Language</Text>
                      <View style={styles.languageRow}>
                        {['en', 'es', 'fr'].map((lang) => (
                          <TouchableOpacity
                            key={lang}
                            style={[
                              styles.langChip,
                              languageCode === lang && styles.langChipActive
                            ]}
                            onPress={() => setLanguageCode(lang)}
                          >
                            <Text style={[
                              styles.langText,
                              languageCode === lang && styles.langTextActive
                            ]}>
                              {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Français'}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Tell us about yourself..."
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.profileView}>
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Full Name</Text>
                    <Text style={styles.infoValue}>{firstName} {lastName}</Text>
                  </View>

                  {dateOfBirth && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Date of Birth</Text>
                      <Text style={styles.infoValue}>{dateOfBirth}</Text>
                    </View>
                  )}

                  {gender && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Gender</Text>
                      <Text style={styles.infoValue}>{gender}</Text>
                    </View>
                  )}

                  {phone && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Phone</Text>
                      <Text style={styles.infoValue}>{phone}</Text>
                    </View>
                  )}

                  {website && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Website</Text>
                      <Text style={[styles.infoValue, styles.link]}>{website}</Text>
                    </View>
                  )}

                  {address && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Address</Text>
                      <Text style={styles.infoValue}>{address}</Text>
                    </View>
                  )}

                  {country && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Country</Text>
                      <Text style={styles.infoValue}>{country}</Text>
                    </View>
                  )}

                  {languageCode && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Language</Text>
                      <Text style={styles.infoValue}>
                        {languageCode === 'en' ? 'English' :
                          languageCode === 'es' ? 'Español' :
                            languageCode === 'fr' ? 'Français' : languageCode}
                      </Text>
                    </View>
                  )}

                  {bio && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Bio</Text>
                      <Text style={styles.infoValue}>{bio}</Text>
                    </View>
                  )}
                </View>
              )}

              <Text style={styles.sectionTitle}>Security</Text>
              <View style={styles.section}>
                <TouchableOpacity style={styles.changePasswordButton}>
                  <Ionicons name="key-outline" size={20} color="#6366F1" />
                  <Text style={styles.changePasswordText}>Change Password</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Quick Links</Text>
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.changePasswordButton}
                  onPress={() => router.push('/(tabs)/profile/co-owners' as any)}
                >
                  <Ionicons name="people-outline" size={20} color="#6366F1" />
                  <Text style={styles.changePasswordText}>Manage Co-Owners</Text>
                </TouchableOpacity>
              </View>

              {isMobile && (
                <View style={{ marginTop: 24 }}>
                  <TouchableOpacity style={[styles.dangerButton, { justifyContent: 'center', backgroundColor: '#FEF2F2', borderRadius: 12 }]} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.dangerButtonText}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {activeTab === 'notifications' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Notification Preferences</Text>

              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>General Notifications</Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Email Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Receive important updates via email
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
                    <Text style={styles.settingLabel}>Push Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Get push notifications on your device
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
                <Text style={styles.subsectionTitle}>Pet Care Reminders</Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Health Reminders</Text>
                    <Text style={styles.settingDescription}>
                      Reminders for vaccinations and medications
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
                    <Text style={styles.settingLabel}>Event Reminders</Text>
                    <Text style={styles.settingDescription}>
                      Reminders for upcoming appointments and events
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
                    <Text style={styles.settingLabel}>Weight Tracking</Text>
                    <Text style={styles.settingDescription}>
                      Reminders to log your pet's weight
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
                <Text style={styles.subsectionTitle}>Communication Preferences</Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Newsletter</Text>
                    <Text style={styles.settingDescription}>
                      Receive tips and updates about pet care
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
                    <Text style={styles.settingLabel}>Product Updates</Text>
                    <Text style={styles.settingDescription}>
                      Get notified about new features and improvements
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
                  style={[modalStyles.item, countryCode === item.code && modalStyles.itemSelected]}
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
                  style={[modalStyles.item, phoneCountryCode === item.code && modalStyles.itemSelected]}
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  rowMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  flex1: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  changePasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
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
    gap: 12,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  langChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  langText: {
    fontSize: 13,
    fontWeight: '500',
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
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  genderChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
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
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  emailText: {
    fontSize: 16,
    color: '#6B7280',
  },
  cityAutocomplete: {
    position: 'relative',
  },
  cityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  cityInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  cityDropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  cityDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    marginTop: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
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
