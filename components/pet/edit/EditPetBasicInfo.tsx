import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';
import { Pet } from '@/types/index';
import ModernSelect from '@/components/ui/ModernSelect';

interface EditPetBasicInfoProps {
    data: Partial<Pet>;
    onChange: (field: string, value: any) => void;
    errors?: Record<string, string>;
}

export default function EditPetBasicInfo({ data, onChange, errors = {} }: EditPetBasicInfoProps) {
    // Options
    const SPECIES_OPTIONS = [
        { label: 'Dog', value: 'Dog' },
        { label: 'Cat', value: 'Cat' },
        { label: 'Bird', value: 'Bird' },
        { label: 'Other', value: 'Other' },
    ];

    const EYE_COLOR_OPTIONS = [
        { label: 'Brown', value: 'Brown' },
        { label: 'Blue', value: 'Blue' },
        { label: 'Green', value: 'Green' },
        { label: 'Hazel', value: 'Hazel' },
        { label: 'Amber', value: 'Amber' },
        { label: 'Heterochromia', value: 'Heterochromia' },
        { label: 'Other', value: 'Other' },
    ];

    const COAT_TYPE_OPTIONS = [
        { label: 'Short', value: 'Short' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Long', value: 'Long' },
        { label: 'Wire', value: 'Wire' },
        { label: 'Curly', value: 'Curly' },
        { label: 'Hairless', value: 'Hairless' },
        { label: 'Double Coat', value: 'Double Coat' },
    ];

    const TAIL_LENGTH_OPTIONS = [
        { label: 'Long', value: 'Long' },
        { label: 'Short', value: 'Short' },
        { label: 'Docked', value: 'Docked' },
        { label: 'Bobtail', value: 'Bobtail' },
        { label: 'Curled', value: 'Curled' },
        { label: 'None', value: 'None' },
    ];

    const SIZE_OPTIONS = [
        { label: 'Small', value: 'Small' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Large', value: 'Large' },
        { label: 'Giant', value: 'Giant' },
    ];

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
                    style={[styles.input, errors.name && styles.inputError] as any}
                    value={data.name || ''}
                    onChangeText={(v) => onChange('name', v)}
                    placeholder="Enter name"
                    accessibilityLabel="Pet Name"
                    accessibilityHint="Enter the name of your pet"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <ModernSelect
                        label="Species *"
                        placeholder="Select species"
                        value={data.species || ''}
                        options={SPECIES_OPTIONS}
                        onChange={(v) => onChange('species', v)}
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
                    {['male', 'female', 'other'].map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[
                                styles.genderButton,
                                data.gender === g && styles.genderButtonActive
                            ] as any}
                            onPress={() => onChange('gender', g)}
                        >
                            <IconSymbol
                                ios_icon_name={g === 'male' ? 'circle' : g === 'female' ? 'circle' : 'circle'}
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

            {/* Date of Birth */}
            <EnhancedDatePicker
                label="Date of Birth"
                value={isoToDmy(data.date_of_birth || '')}
                onChange={(dmyDate) => onChange('date_of_birth', dmyToIso(dmyDate))}
                placeholder="Select date"
            />

            {/* Physical Attributes */}
            <View style={styles.formGroup}>
                <Text style={[styles.label, { fontSize: 14, marginTop: 8 }]}>Physical Characteristics</Text>
            </View>

            <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Color</Text>
                    <TextInput
                        style={styles.input}
                        value={data.color || ''}
                        onChangeText={(v) => onChange('color', v)}
                        placeholder="e.g. Golden"
                    />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <ModernSelect
                        label="Eye Color"
                        placeholder="Select color"
                        value={data.eye_color || ''}
                        options={EYE_COLOR_OPTIONS}
                        onChange={(v) => onChange('eye_color', v)}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <ModernSelect
                        label="Coat Type"
                        placeholder="Select type"
                        value={data.coat_type || ''}
                        options={COAT_TYPE_OPTIONS}
                        onChange={(v) => onChange('coat_type', v)}
                    />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                    <ModernSelect
                        label="Tail Length"
                        placeholder="Select length"
                        value={data.tail_length || ''}
                        options={TAIL_LENGTH_OPTIONS}
                        onChange={(v) => onChange('tail_length', v)}
                    />
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Fur Description</Text>
                <TextInput
                    style={styles.input}
                    value={data.fur_description || ''}
                    onChangeText={(v) => onChange('fur_description', v)}
                    placeholder="e.g. Curly, Soft"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Distinguishing Marks</Text>
                <TextInput
                    style={styles.input}
                    value={data.distinguishing_marks || ''}
                    onChangeText={(v) => onChange('distinguishing_marks', v)}
                    placeholder="e.g. White patch on chest"
                />
            </View>
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
