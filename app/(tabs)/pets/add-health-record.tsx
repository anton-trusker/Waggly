import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { usePets } from '@/hooks/usePets';
import { supabase } from '@/lib/supabase';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { IconSymbol } from '@/components/ui/IconSymbol';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';
import AppHeader from '@/components/layout/AppHeader';
import BottomCTA from '@/components/ui/BottomCTA';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';

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

export default function AddHealthRecordScreen() {
    const { petId: initialPetId } = useLocalSearchParams<{ petId: string }>();
    const { user } = useAuth();
    const { pets } = usePets();

    const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId || (pets.length > 0 ? pets[0].id : null));
    const [date, setDate] = useState(new Date().toLocaleDateString('en-GB').replace(/\//g, '-')); // DD-MM-YYYY
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
    const [temperature, setTemperature] = useState('');
    const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
    const [heartRate, setHeartRate] = useState('');
    const [respiratoryRate, setRespiratoryRate] = useState('');
    const [bodyConditionScore, setBodyConditionScore] = useState<number | null>(null);
    const [activityLevel, setActivityLevel] = useState<string | null>(null);
    const [appetiteLevel, setAppetiteLevel] = useState<string | null>(null);
    const [energyLevel, setEnergyLevel] = useState<string | null>(null);
    const [coatCondition, setCoatCondition] = useState<string | null>(null);
    const [stoolQuality, setStoolQuality] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Keyboard handling
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    // Update selected pet if initialPetId changes
    useEffect(() => {
        if (initialPetId) setSelectedPetId(initialPetId);
    }, [initialPetId]);

    const handleSave = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to add a record');
            return;
        }
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        setLoading(true);

        try {
            // Parse date DD-MM-YYYY to YYYY-MM-DD
            const dateParts = date.split('-');
            const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const insertData: any = {
                pet_id: selectedPetId,
                measured_at: isoDate,
                weight: weight ? parseFloat(weight) : null,
                activity_level: activityLevel,
                appetite_level: appetiteLevel,
                coat_condition: coatCondition,
                notes: notes || null,
                // The following were not in the migration but were in HealthMetricsModal.tsx
                temperature: temperature ? parseFloat(temperature) : null,
                heart_rate: heartRate ? parseInt(heartRate) : null,
                respiratory_rate: respiratoryRate ? parseInt(respiratoryRate) : null,
                body_condition_score: bodyConditionScore,
                energy_level: energyLevel,
                stool_quality: stoolQuality,
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
                    weight: weight ? `${weight} ${weightUnit}` : undefined,
                    bcs: bodyConditionScore,
                },
            });

            Alert.alert('Success', 'Health record added successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Error adding health record:', error);
            Alert.alert('Error', error.message || 'Failed to add health record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderPillSelector = (
        label: string,
        options: string[],
        selectedValue: string | null,
        onSelect: (val: string) => void
    ) => (
        <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>{label}</Text>
            <View style={styles.pillGroup}>
                {options.map((opt) => (
                    <TouchableOpacity
                        key={opt}
                        style={[styles.pill, selectedValue === opt && styles.pillSelected]}
                        onPress={() => onSelect(opt)}
                    >
                        <Text style={[styles.pillText, selectedValue === opt && styles.pillTextSelected]}>
                            {opt}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >


            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Pet Selector */}
                    <View style={styles.section}>
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

                    {/* Vitals Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="pulse" size={20} color={colors.primary} />
                            <Text style={styles.sectionTitle}>Vitals</Text>
                        </View>

                        <EnhancedDatePicker
                            label="Date"
                            value={date}
                            onChange={setDate}
                            required={true}
                        />

                        <View style={styles.inputRow}>
                            <View style={styles.inputColumn}>
                                <Text style={styles.inputLabel}>Weight</Text>
                                <View style={styles.inputGroup}>
                                    <TextInput
                                        style={[styles.input, styles.inputLeft]}
                                        placeholder="0.0"
                                        keyboardType="decimal-pad"
                                        value={weight}
                                        onChangeText={setWeight}
                                    />
                                    <TouchableOpacity
                                        style={styles.unitToggle}
                                        onPress={() => setWeightUnit(weightUnit === 'kg' ? 'lb' : 'kg')}
                                    >
                                        <Text style={styles.unitText}>{weightUnit}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.inputColumn}>
                                <Text style={styles.inputLabel}>Temp</Text>
                                <View style={styles.inputGroup}>
                                    <TextInput
                                        style={[styles.input, styles.inputLeft]}
                                        placeholder="--"
                                        keyboardType="decimal-pad"
                                        value={temperature}
                                        onChangeText={setTemperature}
                                    />
                                    <TouchableOpacity
                                        style={styles.unitToggle}
                                        onPress={() => setTemperatureUnit(temperatureUnit === 'C' ? 'F' : 'C')}
                                    >
                                        <Text style={styles.unitText}>°{temperatureUnit}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputRow}>
                            <View style={styles.inputColumn}>
                                <Text style={styles.inputLabel}>Heart Rate (bpm)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="--"
                                    keyboardType="numeric"
                                    value={heartRate}
                                    onChangeText={setHeartRate}
                                />
                            </View>
                            <View style={styles.inputColumn}>
                                <Text style={styles.inputLabel}>Resp Rate (br/m)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="--"
                                    keyboardType="numeric"
                                    value={respiratoryRate}
                                    onChangeText={setRespiratoryRate}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Body Condition Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="body" size={20} color={colors.primary} />
                            <Text style={styles.sectionTitle}>Body Condition</Text>
                        </View>
                        <View style={styles.bcsRow}>
                            {BODY_CONDITION_SCORES.map((bcs) => (
                                <TouchableOpacity
                                    key={bcs.score}
                                    style={[
                                        styles.bcsItem,
                                        bodyConditionScore === bcs.score && {
                                            backgroundColor: bcs.color + '10',
                                            borderColor: bcs.color,
                                        }
                                    ]}
                                    onPress={() => setBodyConditionScore(bcs.score)}
                                >
                                    <View style={styles.bcsVisualContainer}>
                                        <View
                                            style={{
                                                width: bcs.width,
                                                height: 24,
                                                backgroundColor: bodyConditionScore === bcs.score ? bcs.color : colors.border,
                                                borderRadius: 4
                                            }}
                                        />
                                    </View>
                                    <Text style={[styles.bcsScore, bodyConditionScore === bcs.score && { color: bcs.color }]}>
                                        {bcs.score}
                                    </Text>
                                    <Text style={styles.bcsLabelText}>{bcs.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Wellness Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="sparkles" size={20} color={colors.primary} />
                            <Text style={styles.sectionTitle}>Wellness Indicators</Text>
                        </View>

                        {renderPillSelector('Activity', ACTIVITY_LEVELS, activityLevel, setActivityLevel)}
                        {renderPillSelector('Energy', ENERGY_LEVELS, energyLevel, setEnergyLevel)}
                        {renderPillSelector('Appetite', APPETITE_LEVELS, appetiteLevel, setAppetiteLevel)}
                        {renderPillSelector('Coat', COAT_CONDITIONS, coatCondition, setCoatCondition)}
                        {renderPillSelector('Stool', STOOL_QUALITIES, stoolQuality, setStoolQuality)}
                    </View>

                    {/* Notes Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Notes</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Any other observations..."
                            multiline
                            numberOfLines={4}
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </TouchableWithoutFeedback>

            <BottomCTA
                onBack={() => router.back()}
                onPrimary={handleSave}
                primaryLabel="Save Record"
                disabled={loading}
            />

            <LoadingOverlay visible={loading} message="Saving record..." />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 10,
    },
    petRow: {
        gap: 10,
    },
    petChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    petChipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    petChipText: {
        color: colors.text,
        fontWeight: '500',
    },
    petChipTextSelected: {
        color: '#fff',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    inputColumn: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.textSecondary,
        marginBottom: 6,
    },
    inputGroup: {
        flexDirection: 'row',
    },
    input: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: colors.text,
        fontSize: 16,
    },
    inputLeft: {
        flex: 1,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    unitToggle: {
        backgroundColor: colors.iconBackgroundBlue,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: colors.border,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    unitText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    bcsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 6,
    },
    bcsItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
    },
    bcsVisualContainer: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    bcsScore: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    bcsLabelText: {
        fontSize: 10,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    selectorContainer: {
        marginBottom: 16,
    },
    selectorLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textSecondary,
        marginBottom: 8,
    },
    pillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    pillSelected: {
        backgroundColor: colors.iconBackgroundBlue,
        borderColor: colors.primary,
    },
    pillText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    pillTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
});
