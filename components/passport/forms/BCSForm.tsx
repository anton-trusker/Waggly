import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Text,
    TouchableOpacity,
    Platform,
    useWindowDimensions,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import FormField from '@/components/forms/FormField';
import { Button } from '@/components/design-system/primitives/Button';
import { useForm } from 'react-hook-form';
import { useAppTheme } from '@/hooks/useAppTheme';
import { z } from 'zod';

// Simple local schema since it's just 3 fields, or we can use react-hook-form
// I'll use simple state for the slider and react-hook-form for notes/date? 
// Actually, let's keep it consistent with other forms.

interface BCSFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (score: number, notes?: string, date?: Date) => Promise<void>;
}

export default function BCSForm({ visible, onClose, onSubmit }: BCSFormProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const { control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            score: 5,
            notes: '',
            date: new Date()
        }
    });

    const score = watch('score');
    const date = watch('date');
    const [submitting, setSubmitting] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onFormSubmit = async (data: any) => {
        try {
            setSubmitting(true);
            await onSubmit(data.score, data.notes, data.date);
            onClose();
            reset();
        } catch (error) {
            console.error('Error submitting BCS:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getInterpretation = (val: number) => {
        if (val <= 3) return 'Underweight';
        if (val <= 5) return 'Ideal';
        if (val <= 7) return 'Overweight';
        return 'Obese';
    };

    const getColor = (val: number) => {
        if (val <= 3) return designSystem.colors.status.warning[500];
        if (val <= 5) return designSystem.colors.status.success[500];
        if (val <= 7) return designSystem.colors.status.warning[500];
        return designSystem.colors.status.error[500];
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoid}
            >
                <View style={styles.overlay}>
                    <View style={[styles.container, { width: isMobile ? '90%' : 500 }]}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Update Body Condition</Text>
                            <TouchableOpacity onPress={onClose}>
                                <IconSymbol
                                    ios_icon_name="xmark"
                                    android_material_icon_name="close"
                                    size={24}
                                    color={designSystem.colors.text.primary}
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.content}>
                                {/* Score Selector */}
                                <View style={styles.scoreSection}>
                                    <View style={styles.scoreHeader}>
                                        <Text style={styles.label}>Score: {score}/9</Text>
                                        <View style={[styles.badge, { backgroundColor: getColor(score) }]}>
                                            <Text style={styles.badgeText}>{getInterpretation(score)}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.scoreButtonsContainer}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
                                            <TouchableOpacity
                                                key={val}
                                                style={[
                                                    styles.scoreButton,
                                                    score === val && { backgroundColor: getColor(val) }
                                                ] as any}
                                                onPress={() => setValue('score', val)}
                                            >
                                                <Text style={[
                                                    styles.scoreButtonText,
                                                    score === val && styles.scoreButtonTextActive
                                                ]}>{val}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <View style={styles.scaleLabels}>
                                        <Text style={styles.scaleText}>1 (Thin)</Text>
                                        <Text style={styles.scaleText}>5 (Ideal)</Text>
                                        <Text style={styles.scaleText}>9 (Obese)</Text>
                                    </View>
                                </View>

                                {/* Date Picker */}
                                <View style={styles.dateSection}>
                                    <Text style={[styles.label, { color: isDark ? designSystem.colors.text.primary : designSystem.colors.text.primary }]}>Date Assessed</Text>
                                    {Platform.OS === 'ios' ? (
                                        <DateTimePicker
                                            value={date}
                                            mode="date"
                                            display="compact"
                                            onChange={(e, d) => d && setValue('date', d)}
                                        />
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.dateButton}
                                            onPress={() => setShowDatePicker(true)}
                                        >
                                            <Text style={{ color: isDark ? designSystem.colors.text.primary : designSystem.colors.text.primary }}>{date.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                    )}
                                    {showDatePicker && Platform.OS !== 'ios' && (
                                        <DateTimePicker
                                            value={date}
                                            mode="date"
                                            onChange={(e, d) => {
                                                setShowDatePicker(false);
                                                if (d) setValue('date', d);
                                            }}
                                        />
                                    )}
                                </View>

                                <FormField
                                    control={control}
                                    name="notes"
                                    label="Notes"
                                    placeholder="Add body condition notes..."
                                    multiline
                                    rows={3}
                                />
                            </View>

                            {/* Spacer for bottom CTA */}
                            <View style={{ height: 100 }} />
                        </ScrollView>

                        <View style={{ padding: 20 }}>
                            <Button
                                title="Save Score"
                                onPress={handleSubmit(onFormSubmit)}
                                loading={submitting}
                                fullWidth
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 16,
        padding: 0, // Set to 0 because header/scrollView have padding
        maxHeight: '90%', // Increased from 80% to 90%
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[200],
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    content: {
        gap: 24,
    },
    scoreSection: {
        gap: 12,
    },
    scoreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    scaleLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    scaleText: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
    },
    scoreButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 4,
    },
    scoreButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: designSystem.colors.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
    },
    scoreButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    scoreButtonTextActive: {
        color: '#ffffff',
    },
    dateSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateButton: {
        padding: 8,
        backgroundColor: designSystem.colors.neutral[100],
        borderRadius: 8,
    },
});
