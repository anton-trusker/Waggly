import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AuthHeroPanel from '@/components/desktop/auth/AuthHeroPanel';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
    const router = useRouter();
    const { profile, updateProfile } = useProfile();
    const [loading, setLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const [formData, setFormData] = useState({
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        country: profile?.country_code || '',
        dateOfBirth: profile?.date_of_birth || '',
        photoUrl: profile?.photo_url || '',
    });

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

                const { error: uploadError, data } = await supabase.storage
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

                setFormData(prev => ({ ...prev, photoUrl: publicUrl }));
            }
        } catch (error: any) {
            Alert.alert('Upload Error', error.message);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleComplete = async () => {
        if (!formData.firstName || !formData.lastName) {
            Alert.alert('Error', 'Please fill in your name');
            return;
        }

        setLoading(true);
        try {
            await updateProfile({
                first_name: formData.firstName,
                last_name: formData.lastName,
                country_code: formData.country,
                date_of_birth: formData.dateOfBirth || null,
                photo_url: formData.photoUrl || null,
            });

            // Navigate to dashboard
            router.replace('/web/dashboard' as any);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Left: Hero Panel */}
            <View style={styles.heroSection}>
                <AuthHeroPanel
                    title="Complete Your Profile"
                    subtitle="Tell us a bit about yourself to personalize your experience"
                />
            </View>

            {/* Right: Form */}
            <View style={styles.formSection}>
                <View style={styles.formContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.heading}>Your Profile</Text>
                        <Text style={styles.subheading}>Step 2 of 2</Text>
                    </View>

                    {/* Avatar Upload */}
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={handlePhotoUpload}
                        disabled={uploadingPhoto}
                    >
                        {formData.photoUrl ? (
                            <Image source={{ uri: formData.photoUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                {uploadingPhoto ? (
                                    <ActivityIndicator color="#6366F1" />
                                ) : (
                                    <Ionicons name="camera-outline" size={32} color="#6B7280" />
                                )}
                            </View>
                        )}
                        <View style={styles.avatarBadge}>
                            <Ionicons name="camera" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarLabel}>Upload Profile Photo</Text>

                    {/* Name Inputs */}
                    <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.halfWidth]}>
                            <Text style={styles.label}>First Name *</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="John"
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.firstName}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                                />
                            </View>
                        </View>
                        <View style={[styles.inputGroup, styles.halfWidth]}>
                            <Text style={styles.label}>Last Name *</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Doe"
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.lastName}
                                    onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Country Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Country</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="flag-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Select your country"
                                placeholderTextColor="#9CA3AF"
                                value={formData.country}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
                            />
                        </View>
                    </View>

                    {/* Date of Birth */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date of Birth (Optional)</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="calendar-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#9CA3AF"
                                value={formData.dateOfBirth}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, dateOfBirth: text }))}
                            />
                        </View>
                    </View>

                    {/* Complete Button */}
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleComplete}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>Complete Setup</Text>
                                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    heroSection: {
        flex: 1,
    },
    formSection: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
    },
    formContainer: {
        width: '100%',
        maxWidth: 500,
    },
    header: {
        marginBottom: 32,
    },
    heading: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    subheading: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 8,
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    avatarLabel: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfWidth: {
        flex: 1,
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
        backgroundColor: '#F9FAFB',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    button: {
        backgroundColor: '#6366F1',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
