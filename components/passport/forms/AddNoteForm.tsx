import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    useWindowDimensions
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormField from '@/components/forms/FormField';
import FormSelect from '@/components/forms/FormSelect';
import FormDatePicker from '@/components/forms/FormDatePicker';
import BottomCTA from '@/components/ui/BottomCTA';
import { IconSymbol } from '@/components/ui/IconSymbol';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

const NoteSchema = z.object({
    type: z.enum(['Behavioral', 'Special Care']),
    content: z.string().min(1, 'Note content is required'),
    date: z.date(),
});

type NoteFormData = z.infer<typeof NoteSchema>;

interface AddNoteFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: NoteFormData) => Promise<void>;
}

const TYPE_OPTIONS = [
    { label: 'Behavioral', value: 'Behavioral' },
    { label: 'Special Care', value: 'Special Care' },
];

export default function AddNoteForm({
    visible,
    onClose,
    onSubmit,
}: AddNoteFormProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, reset } = useForm<NoteFormData>({
        resolver: zodResolver(NoteSchema),
        defaultValues: {
            type: 'Behavioral',
            date: new Date(),
        }
    });

    useEffect(() => {
        if (visible) {
            reset({
                type: 'Behavioral',
                date: new Date(),
            });
        }
    }, [visible, reset]);

    const onFormSubmit = async (data: NoteFormData) => {
        try {
            setSubmitting(true);
            await onSubmit(data);
            onClose();
            reset();
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getModalWidth = () => {
        if (width < 640) return '95%';
        return 500;
    };

    const effectiveColors = isDark ? {
        background: designSystem.colors.background.secondary,
        text: designSystem.colors.text.primary,
        border: designSystem.colors.neutral[700],
    } : {
        background: designSystem.colors.background.primary,
        text: designSystem.colors.text.primary,
        border: designSystem.colors.neutral[200],
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoid}
            >
                <View style={styles.overlay}>
                    <View style={[
                        styles.modalContainer,
                        { width: getModalWidth(), backgroundColor: effectiveColors.background }
                    ]}>
                        <View style={[styles.header, { borderBottomColor: effectiveColors.border }]}>
                            <View style={styles.headerContent}>
                                <IconSymbol
                                    ios_icon_name="note.text"
                                    android_material_icon_name="note-add"
                                    size={24}
                                    color={designSystem.colors.primary[500] as any}
                                    style={styles.headerIcon}
                                />
                                <Text style={[styles.title, { color: effectiveColors.text }]}>Add Note</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <IconSymbol
                                    ios_icon_name="xmark"
                                    android_material_icon_name="close"
                                    size={24}
                                    color={effectiveColors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                            <FormSelect
                                control={control}
                                name="type"
                                label="Note Type"
                                options={TYPE_OPTIONS}
                                required
                            />

                            <FormDatePicker
                                control={control}
                                name="date"
                                label="Date"
                                required
                            />

                            <FormField
                                control={control}
                                name="content"
                                label="Note Content"
                                placeholder="Describe behavior or special care needs..."
                                multiline
                                rows={4}
                                required
                            />

                            <View style={{ height: 20 }} />
                        </ScrollView>

                        <BottomCTA
                            onPrimary={handleSubmit(onFormSubmit)}
                            primaryLabel="Add Note"
                            disabled={submitting}
                        />

                        <LoadingOverlay visible={submitting} message="Adding note..." />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: { flex: 1 },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        borderRadius: 16,
        maxHeight: '80%',
        overflow: 'hidden'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1
    },
    headerContent: { flexDirection: 'row', alignItems: 'center' },
    headerIcon: { marginRight: 10 },
    title: { fontSize: 18, fontWeight: '600' },
    closeButton: { padding: 4 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20 },
});
