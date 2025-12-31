import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import DatePickerWeb from '@/components/ui/DatePickerWeb';
import { Pet } from '@/types/index';

interface EditPetBasicInfoProps {
    data: Partial<Pet>;
    onChange: (field: string, value: any) => void;
    errors?: Record<string, string>;
}

export default function EditPetBasicInfo({ data, onChange, errors = {} }: EditPetBasicInfoProps) {
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const handlePhotoPick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            onChange('photo_url', result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            {/* Photo Upload */}
            <View style={styles.photoSection}>
                <TouchableOpacity onPress={handlePhotoPick} style={styles.photoContainer}>
                    {data.photo_url ? (
                        <Image source={{ uri: data.photo_url }} style={styles.photo} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <IconSymbol ios_icon_name="camera" android_material_icon_name="photo-camera" size={32} color={designSystem.colors.text.tertiary} />
                        </View>
                    )}
                    <View style={styles.editBadge}>
                        <IconSymbol ios_icon_name="pencil" android_material_icon_name="edit" size={12} color="#fff" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePhotoPick}>
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
            </View>

            {/* Fields */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Pet's Name *</Text>
                <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    value={data.name}
                    onChangeText={(v) => onChange('name', v)}
                    placeholder="Enter name"
                    accessibilityLabel="Pet Name"
                    accessibilityHint="Enter the name of your pet"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Species *</Text>
                    <TextInput // Could be a dropdown in future
                        style={[styles.input, errors.species && styles.inputError]}
                        value={data.species}
                        onChangeText={(v) => onChange('species', v)}
                        placeholder="Dog, Cat..."
                        accessibilityLabel="Species"
                    />
                    {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Breed</Text>
                    <TextInput
                        style={styles.input}
                        value={data.breed || ''}
                        onChangeText={(v) => onChange('breed', v)}
                        placeholder="Breed"
                    />
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Sex / Gender</Text>
                <View style={styles.genderRow}>
                    {['male', 'female'].map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[
                                styles.genderButton,
                                data.gender === g && styles.genderButtonActive
                            ]}
                            onPress={() => onChange('gender', g)}
                        >
                            <IconSymbol
                                ios_icon_name={g === 'male' ? 'circle' : 'circle'} // SF symbol fallback
                                android_material_icon_name={g}
                                size={16}
                                color={data.gender === g ? designSystem.colors.primary[500] : designSystem.colors.text.tertiary}
                            />
                            <Text style={[
                                styles.genderText,
                                data.gender === g && styles.genderTextActive
                            ]}>
                                {g.charAt(0).toUpperCase() + g.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Date of Birth - Platform specific */}
            {Platform.OS === 'web' ? (
                <DatePickerWeb
                    label="Date of Birth"
                    value={data.date_of_birth || ''}
                    onChange={(v) => onChange('date_of_birth', v)}
                    placeholder="Select date"
                />
            ) : (
                <>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={data.date_of_birth ? styles.inputText : styles.placeholderText}>
                                {data.date_of_birth ? new Date(data.date_of_birth).toLocaleDateString() : 'Select Date'}
                            </Text>
                            <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={designSystem.colors.text.tertiary} />
                        </TouchableOpacity>
                    </View>

                    <CustomDatePicker
                        visible={showDatePicker}
                        date={data.date_of_birth ? new Date(data.date_of_birth) : new Date()}
                        onClose={() => setShowDatePicker(false)}
                        onConfirm={(date) => {
                            onChange('date_of_birth', date.toISOString().split('T')[0]);
                            setShowDatePicker(false);
                        }}
                        title="Date of Birth"
                    />
                </>
            )}

            <View style={styles.formGroup}>
                <Text style={styles.label}>Color & Markings</Text>
                <TextInput
                    style={styles.input}
                    value={data.color || ''}
                    onChangeText={(v) => onChange('color', v)}
                    placeholder="e.g. Golden, Spotted"
                />
            </View>

            <CustomDatePicker
                visible={showDatePicker}
                date={data.date_of_birth ? new Date(data.date_of_birth) : new Date()}
                onClose={() => setShowDatePicker(false)}
                onConfirm={(date) => {
                    onChange('date_of_birth', date.toISOString().split('T')[0]);
                    setShowDatePicker(false);
                }}
                title="Date of Birth"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 20 },
    photoSection: { alignItems: 'center', marginBottom: 8 },
    photoContainer: {
        width: 100, height: 100, borderRadius: 50, marginBottom: 12, position: 'relative',
        ...designSystem.shadows.sm, backgroundColor: '#fff'
    },
    photo: { width: '100%', height: '100%', borderRadius: 50 },
    photoPlaceholder: {
        width: '100%', height: '100%', borderRadius: 50,
        backgroundColor: designSystem.colors.neutral[100],
        justifyContent: 'center', alignItems: 'center'
    },
    editBadge: {
        position: 'absolute', bottom: 0, right: 0,
        backgroundColor: designSystem.colors.primary[500],
        width: 28, height: 28, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: '#fff'
    },
    changePhotoText: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.primary[500],
        fontWeight: '600'
    },
    formGroup: { gap: 8 },
    label: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.secondary,
        fontWeight: '700'
    },
    input: {
        borderWidth: 1, borderColor: designSystem.colors.neutral[200], borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
        color: designSystem.colors.text.primary, backgroundColor: '#fff'
    },
    inputError: {
        borderColor: designSystem.colors.error[500],
    },
    errorText: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.error[500],
        marginTop: 4,
    },
    row: { flexDirection: 'row', gap: 16 },
    genderRow: { flexDirection: 'row', gap: 12 },
    genderButton: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: designSystem.colors.neutral[200],
        backgroundColor: '#fff'
    },
    genderButtonActive: {
        borderColor: designSystem.colors.primary[500],
        backgroundColor: designSystem.colors.primary[50]
    },
    genderText: { ...designSystem.typography.body.medium, color: designSystem.colors.text.secondary },
    genderTextActive: { color: designSystem.colors.primary[700], fontWeight: '600' },
    dateInput: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderColor: designSystem.colors.neutral[200], borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff'
    },
    inputText: { fontSize: 16, color: designSystem.colors.text.primary },
    placeholderText: { fontSize: 16, color: designSystem.colors.text.tertiary },
});
