import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { usePets } from '@/hooks/usePets';
import { supabase } from '@/lib/supabase';

// Design System
import { designSystem } from '@/constants/designSystem';
import { TextField } from '@/components/design-system/forms/TextField';
import { DateField } from '@/components/design-system/forms/DateField';
import { MeasurementWidget } from '@/components/design-system/widgets/MeasurementWidget';
import { Button } from '@/components/design-system/primitives/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AppHeader from '@/components/layout/AppHeader';

const BODY_CONDITION_SCORES = [
    { score: 1, label: 'Emaciated', color: '#EF4444', width: 4 },
    { score: 3, label: 'Thin', color: '#F59E0B', width: 8 },
    { score: 5, label: 'Ideal', color: '#22C55E', width: 12 },
    { score: 7, label: 'Heavy', color: '#F59E0B', width: 18 },
    { score: 9, label: 'Obese', color: '#EF4444', width: 24 },
];

const ACTIVITY_LEVELS = ['Low', 'Normal', 'High'];
const APPETITE_LEVELS = ['Reduced', 'Normal', 'Increased'];
const ENERGY_LEVELS = ['Lethargic', 'Normal', 'Hyper'];
const STOOL_QUALITIES = ['Loose', 'Normal', 'Hard'];
const COAT_CONDITIONS = ['Dull', 'Normal', 'Shiny', 'Matting'];

interface HealthRecordFormData {
    date: Date;
    weight: { value: number; unit: string };
    temperature: string; // string input to parse
    heartRate: string;
    respiratoryRate: string;
    bodyConditionScore: number | null;
    activityLevel: string;
    appetiteLevel: string;
    energyLevel: string;
    coatCondition: string;
    stoolQuality: string;
    notes: string;
}

export default function AddHealthRecordScreen() {
    const { petId: initialPetId } = useLocalSearchParams<{ petId: string }>();
    const { user } = useAuth();
    const { pets } = usePets();

    const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId || (pets.length > 0 ? pets[0].id : null));
    const [loading, setLoading] = useState(false);

    const methods = useForm<HealthRecordFormData>({
        defaultValues: {
            date: new Date(),
            weight: { value: 0, unit: 'kg' },
            temperature: '',
            heartRate: '',
            respiratoryRate: '',
            bodyConditionScore: null,
            activityLevel: '',
            appetiteLevel: '',
            energyLevel: '',
            coatCondition: '',
            stoolQuality: '',
            notes: ''
        }
    });

    const { control, handleSubmit, setValue, watch } = methods;

    useEffect(() => {
        if (initialPetId) setSelectedPetId(initialPetId);
    }, [initialPetId]);

    const onSubmit = async (data: HealthRecordFormData) => {
        if (!user || !selectedPetId) return;
        setLoading(true);

        try {
            const insertData: any = {
                pet_id: selectedPetId,
                measured_at: data.date.toISOString().split('T')[0],
                weight: data.weight.value > 0 ? data.weight.value : null, // Assuming standard unit or conversion needed? 
                // Note: Schema stores weight as single column usually. Assuming kg for now as per previous logic which didn't strictly convert but just stored key. 
                // Actually ideally we should normalize to kg. 
                activity_level: data.activityLevel || null,
                appetite_level: data.appetiteLevel || null,
                coat_condition: data.coatCondition || null,
                notes: data.notes || null,
                temperature: data.temperature ? parseFloat(data.temperature) : null,
                heart_rate: data.heartRate ? parseInt(data.heartRate) : null,
                respiratory_rate: data.respiratoryRate ? parseInt(data.respiratoryRate) : null,
                body_condition_score: data.bodyConditionScore,
                energy_level: data.energyLevel || null,
                stool_quality: data.stoolQuality || null,
            };

            const { error } = await supabase
                .from('health_metrics')
                .insert([insertData]);

            if (error) throw error;

            // Log activity
            await supabase.from('activity_logs').insert({
                profile_id: user.id,
                pet_id: selectedPetId,
                activity_type: 'health_check_added',
                activity_data: {
                    weight: data.weight.value > 0 ? `${data.weight.value} ${data.weight.unit}` : undefined,
                    bcs: data.bodyConditionScore,
                },
            });

            Alert.alert('Success', 'Health record added successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (e: any) {
            console.error(e);
            Alert.alert('Error', 'Failed to add health record');
        } finally {
            setLoading(false);
        }
    };

    const renderPillSelector = (label: string, name: keyof HealthRecordFormData, options: string[]) => (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange } }) => (
                <View style={styles.selectorContainer}>
                    <Text style={styles.selectorLabel}>{label}</Text>
                    <View style={styles.pillGroup}>
                        {options.map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.pill, value === opt && styles.pillSelected]}
                                onPress={() => onChange(opt === value ? '' : opt)}
                            >
                                <Text style={[styles.pillText, value === opt && styles.pillTextSelected]}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        />
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <AppHeader title="Add Health Record" showBack />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

                    {/* Pet Selector */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={styles.label}>For Pet</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petRow}>
                            {pets.map(pet => (
                                <TouchableOpacity
                                    key={pet.id}
                                    style={[styles.petChip, selectedPetId === pet.id && styles.petChipSelected]}
                                    onPress={() => setSelectedPetId(pet.id)}
                                >
                                    <Text style={[styles.petChipText, selectedPetId === pet.id && styles.petChipTextSelected]}>{pet.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <FormProvider {...methods}>
                        <View style={styles.card}>
                            <View style={styles.sectionHeader}>
                                <IconSymbol ios_icon_name="heart.fill" android_material_icon_name="favorite" size={20} color={designSystem.colors.primary[500]} />
                                <Text style={styles.sectionTitle}>Vitals</Text>
                            </View>

                            <DateField control={control} name="date" label="Date" />

                            <MeasurementWidget
                                type="weight"
                                label="Weight"
                                value={watch('weight')}
                                onChange={(val) => setValue('weight', val)}
                            />

                            <View style={styles.row}>
                                <View style={styles.col}>
                                    <TextField control={control} name="temperature" label="Temp (°C)" placeholder="38.5" keyboardType="decimal-pad" />
                                </View>
                                <View style={styles.col}>
                                    <TextField control={control} name="heartRate" label="HR (bpm)" placeholder="80" keyboardType="numeric" />
                                </View>
                                <View style={styles.col}>
                                    <TextField control={control} name="respiratoryRate" label="RR (br/m)" placeholder="20" keyboardType="numeric" />
                                </View>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.sectionHeader}>
                                <IconSymbol ios_icon_name="scalemass" android_material_icon_name="accessibility" size={20} color={designSystem.colors.primary[500]} />
                                <Text style={styles.sectionTitle}>Body Condition</Text>
                            </View>

                            <Controller
                                control={control}
                                name="bodyConditionScore"
                                render={({ field: { value, onChange } }) => (
                                    <View style={styles.bcsRow}>
                                        {BODY_CONDITION_SCORES.map((bcs) => (
                                            <TouchableOpacity
                                                key={bcs.score}
                                                style={[
                                                    styles.bcsItem,
                                                    value === bcs.score && {
                                                        backgroundColor: bcs.color + '10',
                                                        borderColor: bcs.color,
                                                    }
                                                ]}
                                                onPress={() => onChange(bcs.score)}
                                            >
                                                <View style={styles.bcsVisualContainer}>
                                                    <View
                                                        style={{
                                                            width: bcs.width,
                                                            height: 24,
                                                            backgroundColor: value === bcs.score ? bcs.color : designSystem.colors.neutral[200],
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                </View>
                                                <Text style={[styles.bcsScore, value === bcs.score && { color: bcs.color }]}>
                                                    {bcs.score}
                                                </Text>
                                                <Text style={styles.bcsLabelText}>{bcs.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            />
                        </View>

                        <View style={styles.card}>
                            <View style={styles.sectionHeader}>
                                <IconSymbol ios_icon_name="sparkles" android_material_icon_name="auto_awesome" size={20} color={designSystem.colors.primary[500]} />
                                <Text style={styles.sectionTitle}>Wellness</Text>
                            </View>

                            {renderPillSelector('Activity', 'activityLevel', ACTIVITY_LEVELS)}
                            {renderPillSelector('Energy', 'energyLevel', ENERGY_LEVELS)}
                            {renderPillSelector('Appetite', 'appetiteLevel', APPETITE_LEVELS)}
                            {renderPillSelector('Coat', 'coatCondition', COAT_CONDITIONS)}
                            {renderPillSelector('Stool', 'stoolQuality', STOOL_QUALITIES)}

                            <TextField
                                control={control}
                                name="notes"
                                label="Notes"
                                placeholder="Observations..."
                                multiline
                                numberOfLines={3}
                            />

                            <View style={{ marginTop: 24 }}>
                                <Button
                                    title={loading ? "Saving..." : "Save Record"}
                                    onPress={handleSubmit(onSubmit)}
                                    variant="primary"
                                    size="lg"
                                    loading={loading}
                                />
                            </View>
                        </View>
                    </FormProvider>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.secondary,
    },
    scrollView: { flex: 1 },
    content: { padding: 20, paddingBottom: 100 },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 8,
    },
    petRow: { gap: 10 },
    petChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: designSystem.colors.background.primary,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
    },
    petChipSelected: {
        backgroundColor: designSystem.colors.primary[50],
        borderColor: designSystem.colors.primary[500],
    },
    petChipText: {
        color: designSystem.colors.text.primary,
        fontWeight: '500',
    },
    petChipTextSelected: {
        color: designSystem.colors.primary[700],
    },
    card: {
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...designSystem.shadows.sm,
        gap: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    row: { flexDirection: 'row', gap: 12 },
    col: { flex: 1 },

    // Custom Widgets
    selectorContainer: { marginBottom: 16 },
    selectorLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: designSystem.colors.text.secondary,
        marginBottom: 8,
    },
    pillGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: designSystem.colors.background.primary,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
    },
    pillSelected: {
        backgroundColor: designSystem.colors.primary[50],
        borderColor: designSystem.colors.primary[500],
    },
    pillText: { fontSize: 13, color: designSystem.colors.text.secondary },
    pillTextSelected: { color: designSystem.colors.primary[700], fontWeight: '600' },

    bcsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
    bcsItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        backgroundColor: designSystem.colors.background.primary,
    },
    bcsVisualContainer: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    bcsScore: { fontSize: 14, fontWeight: '700', color: designSystem.colors.text.secondary },
    bcsLabelText: { fontSize: 10, color: designSystem.colors.text.secondary, textAlign: 'center' },
});
