import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';

// Design System Components
import { TextField } from '@/components/design-system/forms/TextField';
import { SelectField } from '@/components/design-system/forms/SelectField';
import { DateField } from '@/components/design-system/forms/DateField';
import { MediaWidget } from '@/components/design-system/widgets/MediaWidget';

export default function EditPetBasicInfo() {
    const { control, watch, setValue } = useFormContext();
    const gender = watch('gender');

    const SPECIES_OPTIONS = [
        { label: 'Dog', value: 'Dog' },
        { label: 'Cat', value: 'Cat' },
        { label: 'Bird', value: 'Bird' },
        { label: 'Rabbit', value: 'Rabbit' },
        { label: 'Other', value: 'Other' },
    ];

    const EYE_COLOR_OPTIONS = [
        { label: 'Brown', value: 'Brown' },
        { label: 'Blue', value: 'Blue' },
        { label: 'Green', value: 'Green' },
        { label: 'Hazel', value: 'Hazel' },
        { label: 'Amber', value: 'Amber' },
        { label: 'Heterochromia', value: 'Heterochromia' },
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

    return (
        <View style={styles.container}>
            {/* Photo Upload */}
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
                <MediaWidget
                    value={watch('photo_url')}
                    onChange={(uri) => setValue('photo_url', uri)}
                    variant="avatar"
                />
            </View>

            {/* Basic Info */}
            <TextField
                control={control}
                name="name"
                label="Pet's Name *"
                placeholder="Enter name"
                required
            />

            <View style={styles.row}>
                <View style={styles.col}>
                    <SelectField
                        control={control}
                        name="species"
                        label="Species *"
                        options={SPECIES_OPTIONS}
                        placeholder="Select"
                    />
                </View>
                <View style={styles.col}>
                    <TextField
                        control={control}
                        name="breed"
                        label="Breed"
                        placeholder="Breed"
                    />
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                    {['male', 'female'].map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[
                                styles.genderButton,
                                gender === g && styles.genderButtonActive
                            ]}
                            onPress={() => setValue('gender', g)}
                        >
                            <IconSymbol
                                ios_icon_name={g === 'male' ? 'circle' : 'circle'}
                                android_material_icon_name={g === 'male' ? 'male' : 'female'}
                                size={18}
                                color={gender === g ? designSystem.colors.primary[500] : designSystem.colors.text.tertiary}
                            />
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

            <DateField
                control={control}
                name="date_of_birth"
                label="Date of Birth"
            />

            {/* Physical Attributes */}
            <View style={styles.divider} />
            <Text style={styles.sectionHeader}>Physical Characteristics</Text>

            <View style={styles.row}>
                <View style={styles.col}>
                    <TextField
                        control={control}
                        name="color"
                        label="Color"
                        placeholder="e.g. Brown"
                    />
                </View>
                <View style={styles.col}>
                    <SelectField
                        control={control}
                        name="eye_color"
                        label="Eye Color"
                        options={EYE_COLOR_OPTIONS}
                        placeholder="Select"
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <SelectField
                        control={control}
                        name="coat_type"
                        label="Coat Type"
                        options={COAT_TYPE_OPTIONS}
                        placeholder="Select"
                    />
                </View>
                <View style={styles.col}>
                    <TextField
                        control={control}
                        name="tail_length"
                        label="Tail Length"
                        placeholder="e.g. Long"
                    />
                </View>
            </View>

            <TextField
                control={control}
                name="fur_description"
                label="Fur Description"
                placeholder="e.g. Soft, Curly"
            />

            <TextField
                control={control}
                name="distinguishing_marks"
                label="Distinguishing Marks"
                placeholder="e.g. White spot on nose"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 16 },
    row: { flexDirection: 'row', gap: 12 },
    col: { flex: 1 },
    formGroup: { gap: 6 },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
    },
    genderRow: { flexDirection: 'row', gap: 12 },
    genderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        backgroundColor: '#fff',
    },
    genderButtonActive: {
        borderColor: designSystem.colors.primary[500],
        backgroundColor: designSystem.colors.primary[50],
    },
    genderText: { fontSize: 14, color: designSystem.colors.text.secondary },
    genderTextActive: { color: designSystem.colors.primary[700], fontWeight: '600' },
    divider: { height: 1, backgroundColor: designSystem.colors.neutral[100], marginVertical: 8 },
    sectionHeader: { fontSize: 13, fontWeight: '700', color: designSystem.colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 },
});


