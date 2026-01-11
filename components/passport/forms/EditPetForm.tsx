import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    useWindowDimensions,
    Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { IconSymbol } from '@/components/ui/IconSymbol';
import FormField from '@/components/forms/FormField';
import FormToggle from '@/components/forms/FormToggle';
import FormRadioGroup from '@/components/forms/FormRadioGroup';
import FormSegmentedControl from '@/components/forms/FormSegmentedControl';
import FormRangeSlider from '@/components/forms/FormRangeSlider';
import FormImagePicker from '@/components/forms/FormImagePicker';
import FormDatePicker from '@/components/forms/FormDatePicker';
import BottomCTA from '@/components/ui/BottomCTA';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

// Enhanced Pet Schema with all missing fields
const CompletePetSchema = z.object({
    // Basic Info
    name: z.string().min(1, 'Name is required'),
    species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'reptile', 'other']),
    breed: z.string().optional(),
    gender: z.enum(['male', 'female']),
    date_of_birth: z.date().optional(),
    avatar_url: z.string().optional(),

    // Physical Characteristics
    size: z.enum(['small', 'medium', 'large']).optional(),
    weight: z.number().optional(),
    weight_unit: z.enum(['kg', 'lbs']).default('kg'),
    height: z.number().optional(),
    color: z.string().optional(),
    coat_type: z.string().optional(),
    eye_color: z.string().optional(),
    distinguishing_marks: z.string().optional(),
    ideal_weight_min: z.number().optional(),
    ideal_weight_max: z.number().optional(),

    // Identification & Medical
    microchip_number: z.string().optional(),
    microchip_date: z.date().optional(),
    tattoo_id: z.string().optional(),
    registration_id: z.string().optional(),
    blood_type: z.string().optional(),
    is_spayed_neutered: z.boolean().default(false),
    spayed_neutered_date: z.date().optional(),
});

type CompletePetFormData = z.infer<typeof CompletePetSchema>;

interface EditPetFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: CompletePetFormData) => Promise<void>;
    initialData?: Partial<CompletePetFormData>;
}

const TABS = ['Basic Info', 'Physical', 'Identification'];

export default function EditPetForm({
    visible,
    onClose,
    onSubmit,
    initialData,
}: EditPetFormProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const [activeTab, setActiveTab] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CompletePetFormData>({
        resolver: zodResolver(CompletePetSchema),
        defaultValues: {
            weight_unit: 'kg',
            is_spayed_neutered: false,
            ...initialData,
        },
    });

    const isSpayedNeutered = watch('is_spayed_neutered');

    const effectiveColors = isDark
        ? {
            background: designSystem.colors.background.secondary,
            card: designSystem.colors.background.tertiary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[700],
            tabActive: designSystem.colors.primary[500],
            tabInactive: designSystem.colors.neutral[600],
        }
        : {
            background: '#FFFFFF',
            card: designSystem.colors.background.secondary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[200],
            tabActive: designSystem.colors.primary[500],
            tabInactive: designSystem.colors.neutral[400],
        };

    const onFormSubmit = async (data: CompletePetFormData) => {
        try {
            setSubmitting(true);
            await onSubmit(data);
            onClose();
        } catch (error) {
            console.error('Error saving pet:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 0: // Basic Info
                return (
                    <View style={styles.tabContent}>
                        <Controller
                            control={control}
                            name="avatar_url"
                            render={({ field: { value, onChange } }) => (
                                <FormImagePicker
                                    label="Pet Photo"
                                    value={value || null}
                                    onChange={onChange}
                                    placeholder="Tap to add photo"
                                />
                            )}
                        />

                        <FormField
                            control={control}
                            name="name"
                            label="Name"
                            placeholder="Enter pet's name"
                            required
                        />

                        <Controller
                            control={control}
                            name="species"
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <FormRadioGroup
                                    label="Species"
                                    options={[
                                        { label: 'Dog', value: 'dog' },
                                        { label: 'Cat', value: 'cat' },
                                        { label: 'Bird', value: 'bird' },
                                        { label: 'Rabbit', value: 'rabbit' },
                                        { label: 'Reptile', value: 'reptile' },
                                        { label: 'Other', value: 'other' },
                                    ] as any}
                                    value={value}
                                    onChange={onChange}
                                    error={error?.message}
                                    direction="horizontal"
                                />
                            )}
                        />

                        <FormField
                            control={control}
                            name="breed"
                            label="Breed"
                            placeholder="e.g., Golden Retriever"
                        />

                        <Controller
                            control={control}
                            name="gender"
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <FormRadioGroup
                                    label="Gender"
                                    options={[
                                        { label: 'Male', value: 'male' },
                                        { label: 'Female', value: 'female' },
                                    ] as any}
                                    value={value}
                                    onChange={onChange}
                                    error={error?.message}
                                    direction="horizontal"
                                />
                            )}
                        />

                        <FormDatePicker
                            control={control}
                            name="date_of_birth"
                            label="Date of Birth"
                            placeholder="Select date"
                        />

                        <FormField
                            control={control}
                            name="color"
                            label="Color/Coat"
                            placeholder="e.g., Golden, Brown & White"
                        />

                        <View style={{ height: 100 }} />
                    </View>
                );

            case 1: // Physical Characteristics
                return (
                    <View style={styles.tabContent}>
                        <Controller
                            control={control}
                            name="size"
                            render={({ field: { value, onChange } }) => (
                                <FormSegmentedControl
                                    label="Size"
                                    options={['Small', 'Medium', 'Large'] as any}
                                    value={value?.charAt(0).toUpperCase() + value?.slice(1) || 'Medium'}
                                    onChange={(v) => onChange(v.toLowerCase())}
                                />
                            )}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <FormField
                                    control={control}
                                    name="weight"
                                    label="Current Weight"
                                    placeholder="0"
                                    keyboardType="decimal-pad"
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <Controller
                                    control={control}
                                    name="weight_unit"
                                    render={({ field: { value, onChange } }) => (
                                        <FormSegmentedControl
                                            label="Unit"
                                            options={['kg', 'lbs'] as any}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </View>
                        </View>

                        <Controller
                            control={control}
                            name="ideal_weight_min"
                            render={({ field: { value: minValue, onChange: onMinChange } }) => (
                                <Controller
                                    control={control}
                                    name="ideal_weight_max"
                                    render={({ field: { value: maxValue, onChange: onMaxChange } }) => (
                                        <FormRangeSlider
                                            label="Ideal Weight Range"
                                            min={0}
                                            max={100}
                                            values={[minValue || 0, maxValue || 50] as any}
                                            onChange={([min, max]) => {
                                                onMinChange(min);
                                                onMaxChange(max);
                                            }}
                                            unit={watch('weight_unit')}
                                            helperText="Set your pet's healthy weight range"
                                        />
                                    )}
                                />
                            )}
                        />

                        <FormField
                            control={control}
                            name="height"
                            label="Height (cm)"
                            placeholder="0"
                            keyboardType="decimal-pad"
                            helperText="Optional: Height at shoulder"
                        />

                        <FormField
                            control={control}
                            name="coat_type"
                            label="Coat Type"
                            placeholder="e.g., Short, Long, Curly, Wire"
                        />

                        <FormField
                            control={control}
                            name="eye_color"
                            label="Eye Color"
                            placeholder="e.g., Brown, Blue, Green, Heterochromia"
                        />

                        <FormField
                            control={control}
                            name="distinguishing_marks"
                            label="Distinguishing Marks"
                            placeholder="e.g., White spot on left paw, scar on right ear"
                            multiline
                            rows={3}
                            helperText="Unique features for identification"
                        />

                        <View style={{ height: 100 }} />
                    </View>
                );

            case 2: // Identification & Medical
                return (
                    <View style={styles.tabContent}>
                        <Text style={[styles.sectionTitle, { color: effectiveColors.text }]}>
                            Microchip
                        </Text>

                        <FormField
                            control={control}
                            name="microchip_number"
                            label="Microchip Number"
                            placeholder="15-digit number"
                            keyboardType="number-pad"
                        />

                        <FormDatePicker
                            control={control}
                            name="microchip_date"
                            label="Microchip Date"
                            placeholder="Select date"
                        />

                        <Text style={[styles.sectionTitle, { color: effectiveColors.text, marginTop: 24 }]}>
                            Tattoo
                        </Text>

                        <FormField
                            control={control}
                            name="tattoo_id"
                            label="Tattoo ID"
                            placeholder="Enter tattoo identification"
                            helperText="Usually in ear or inner thigh"
                        />

                        <Text style={[styles.sectionTitle, { color: effectiveColors.text, marginTop: 24 }]}>
                            Registration
                        </Text>

                        <FormField
                            control={control}
                            name="registration_id"
                            label="Registration ID"
                            placeholder="Official registration number"
                        />

                        <Text style={[styles.sectionTitle, { color: effectiveColors.text, marginTop: 24 }]}>
                            Medical
                        </Text>

                        <FormField
                            control={control}
                            name="blood_type"
                            label="Blood Type"
                            placeholder="e.g., DEA 1.1+, Type A"
                            helperText="Important for emergencies"
                        />

                        <Controller
                            control={control}
                            name="is_spayed_neutered"
                            render={({ field: { value, onChange } }) => (
                                <FormToggle
                                    label="Spayed/Neutered"
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />

                        {isSpayedNeutered && (
                            <FormDatePicker
                                control={control}
                                name="spayed_neutered_date"
                                label="Spay/Neuter Date"
                                placeholder="Select date"
                            />
                        )}

                        <View style={{ height: 100 }} />
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: effectiveColors.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: effectiveColors.border }]}>
                    <Text style={[styles.headerTitle, { color: effectiveColors.text }]}>
                        {initialData ? 'Edit Pet' : 'Add Pet'}
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <IconSymbol
                            ios_icon_name="xmark.circle.fill"
                            android_material_icon_name="cancel"
                            size={28}
                            color={effectiveColors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={[styles.tabs, { borderBottomColor: effectiveColors.border }]}>
                    {TABS.map((tab, index) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(index)}
                            style={[
                                styles.tab,
                                activeTab === index && styles.tabActive,
                            ] as any}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    {
                                        color: activeTab === index
                                            ? effectiveColors.tabActive
                                            : effectiveColors.tabInactive,
                                    },
                                    activeTab === index && styles.tabTextActive,
                                ] as any}
                            >
                                {tab}
                            </Text>
                            {activeTab === index && (
                                <View
                                    style={[
                                        styles.tabIndicator,
                                        { backgroundColor: effectiveColors.tabActive },
                                    ] as any}
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {renderTabContent()}
                </ScrollView>

                {/* Footer */}
                <BottomCTA
                    onPrimary={handleSubmit(onFormSubmit)}
                    primaryLabel={initialData ? 'Save Changes' : 'Add Pet'}
                    disabled={submitting}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    closeButton: {
        padding: 4,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        position: 'relative',
    },
    tabActive: {},
    tabText: {
        fontSize: 15,
        fontWeight: '500',
    },
    tabTextActive: {
        fontWeight: '600',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    tabContent: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
});
