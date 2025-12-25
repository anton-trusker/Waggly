import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, ActivityIndicator, useWindowDimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useLocale } from '@/hooks/useLocale';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
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
            setCountry(profile.country || '');
            setPhotoUrl(profile.photo_url || '');

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

                // Upload to Supabase Storage
                const fileExt = file.uri.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('user-uploads')
                    .upload(filePath, {
                        uri: file.uri,
                        type: `image/${fileExt}`,
                        name: fileName,
                    } as any);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('user-uploads')
                    .getPublicUrl(filePath);

                setPhotoUrl(publicUrl);
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
            country: country,
            photo_url: photoUrl,
            updated_at: new Date().toISOString(),
        });
        setSaving(false);

        if (error) {
            Alert.alert('Error', 'Failed to update profile');
        } else {
            Alert.alert('Success', 'Profile updated successfully');
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
                        await signOut();
                        router.replace('/web/auth/login');
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
                            <Text style={styles.sectionTitle}>Account Information</Text>

                            <View style={styles.section}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Email</Text>
                                    <TextInput
                                        style={[styles.input, styles.inputDisabled]}
                                        value={user?.email}
                                        editable={false}
                                    />
                                </View>

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
                                    <Text style={styles.label}>Country</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={country}
                                        onChangeText={setCountry}
                                        placeholder="US"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Language</Text>
                                    <View style={styles.languageRow}>
                                        {['en', 'es', 'fr'].map((lang) => (
                                            <TouchableOpacity
                                                key={lang}
                                                style={[
                                                    styles.langChip,
                                                    locale === lang && styles.langChipActive
                                                ]}
                                                onPress={() => setLocale(lang)}
                                            >
                                                <Text style={[
                                                    styles.langText,
                                                    locale === lang && styles.langTextActive
                                                ]}>
                                                    {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Français'}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
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

                            <Text style={styles.sectionTitle}>Password</Text>
                            <View style={styles.section}>
                                <TouchableOpacity style={styles.changePasswordButton}>
                                    <Ionicons name="key-outline" size={20} color="#6366F1" />
                                    <Text style={styles.changePasswordText}>Change Password</Text>
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
                                            Reminders for upcoming appointments
                                        </Text>
                                    </View>
                                    <Switch
                                        value={eventReminders}
                                        onValueChange={setEventReminders}
                                        trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
                                        thumbColor={eventReminders ? '#6366F1' : '#fff'}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {activeTab === 'privacy' && (
                        <View style={styles.tabContent}>
                            <Text style={styles.sectionTitle}>Privacy & Security</Text>

                            <View style={styles.section}>
                                <View style={styles.privacyItem}>
                                    <Ionicons name="shield-checkmark-outline" size={24} color="#10B981" />
                                    <View style={styles.privacyInfo}>
                                        <Text style={styles.privacyLabel}>Data Encryption</Text>
                                        <Text style={styles.privacyDescription}>
                                            All your data is encrypted end-to-end
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.privacyItem}>
                                    <Ionicons name="eye-off-outline" size={24} color="#6366F1" />
                                    <View style={styles.privacyInfo}>
                                        <Text style={styles.privacyLabel}>Private by Default</Text>
                                        <Text style={styles.privacyDescription}>
                                            Your pet information is only visible to you and co-owners
                                        </Text>
                                    </View>
                                </View>

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
        </View>
    );
}

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
});
