import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { usePets } from '@/hooks/usePets';
import { useDocuments } from '@/hooks/useDocuments';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

// Design System
import { designSystem } from '@/constants/designSystem';
import { TextField } from '@/components/design-system/forms/TextField';
import { Button } from '@/components/design-system/primitives/Button';
import AppHeader from '@/components/layout/AppHeader';

const DOCUMENT_TYPES = [
    { id: 'vaccination', label: 'Vaccination', icon: 'medical' },
    { id: 'medical', label: 'Medical Record', icon: 'fitness' },
    { id: 'prescription', label: 'Prescription', icon: 'bandage' },
    { id: 'lab_result', label: 'Lab Result', icon: 'flask' },
    { id: 'insurance', label: 'Insurance', icon: 'shield-checkmark' },
    { id: 'invoice', label: 'Invoice', icon: 'receipt' },
    { id: 'other', label: 'Other', icon: 'document-text' },
];

interface DocumentFormData {
    name: string;
    type: string;
    notes: string;
    file: DocumentPicker.DocumentPickerAsset | null;
}

export default function AddDocumentsScreen() {
    const { petId: initialPetId } = useLocalSearchParams();
    const { pets } = usePets();
    const { uploadDocument } = useDocuments(initialPetId as string);

    const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId as string || (pets.length > 0 ? pets[0].id : null));
    const [loading, setLoading] = useState(false);

    const methods = useForm<DocumentFormData>({
        defaultValues: {
            name: '',
            type: 'medical',
            notes: '',
            file: null,
        }
    });

    const { control, handleSubmit, setValue, watch } = methods;
    const currentFile = watch('file');
    const currentType = watch('type');

    useEffect(() => {
        if (initialPetId) setSelectedPetId(initialPetId as string);
    }, [initialPetId]);

    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            setValue('file', asset);
            if (!watch('name')) {
                setValue('name', asset.name);
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Error', 'Failed to pick file');
        }
    };

    const onSubmit = async (data: DocumentFormData) => {
        if (!data.file || !data.name) {
            Alert.alert('Error', 'Please select a file and enter a name');
            return;
        }
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        setLoading(true);

        try {
            const { error } = await uploadDocument(
                data.file.uri,
                data.type as any,
                data.name,
                { size_bytes: data.file.size, notes: data.notes },
                data.file.mimeType,
                selectedPetId
            );

            if (error) {
                throw error;
            }

            Alert.alert('Success', 'Document uploaded successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Upload failed:', error);
            Alert.alert('Error', error.message || 'Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <AppHeader title="Add Document" showBack />

            <ScrollView contentContainerStyle={styles.content}>
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

                <FormProvider {...methods}>
                    {/* File Upload Area */}
                    <View style={styles.section}>
                        <Text style={styles.label}>File</Text>
                        {currentFile ? (
                            <View style={styles.filePreview}>
                                <View style={styles.fileIcon}>
                                    <Ionicons name="document" size={24} color={designSystem.colors.primary[500]} />
                                </View>
                                <View style={styles.fileInfo}>
                                    <Text style={styles.fileName} numberOfLines={1}>{currentFile.name}</Text>
                                    <Text style={styles.fileSize}>
                                        {currentFile.size ? (currentFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => setValue('file', null)}>
                                    <Ionicons name="close-circle" size={20} color={designSystem.colors.text.secondary} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.uploadArea} onPress={handlePickFile}>
                                <Ionicons name="cloud-upload-outline" size={32} color={designSystem.colors.text.secondary} />
                                <Text style={styles.uploadText}>Click to select a file</Text>
                                <Text style={styles.uploadSubtext}>PDF, JPG, PNG up to 10MB</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formCard}>
                        <TextField
                            control={control}
                            name="name"
                            label="Document Name"
                            placeholder="e.g. Vaccination Certificate"
                            required
                        />

                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.inputLabel}>Category</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                                {DOCUMENT_TYPES.map((docType) => (
                                    <TouchableOpacity
                                        key={docType.id}
                                        style={[
                                            styles.typeOption,
                                            currentType === docType.id && styles.typeOptionActive
                                        ]}
                                        onPress={() => setValue('type', docType.id)}
                                    >
                                        <Ionicons
                                            name={docType.icon as any}
                                            size={16}
                                            color={currentType === docType.id ? designSystem.colors.primary[600] : designSystem.colors.text.secondary}
                                        />
                                        <Text style={[
                                            styles.typeText,
                                            currentType === docType.id && styles.typeTextActive
                                        ]}>
                                            {docType.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <TextField
                            control={control}
                            name="notes"
                            label="Notes (Optional)"
                            placeholder="Add any details..."
                            multiline
                            numberOfLines={3}
                        />

                        <View style={{ marginTop: 24 }}>
                            <Button
                                title={loading ? "Uploading..." : "Upload Document"}
                                onPress={handleSubmit(onSubmit)}
                                variant="primary"
                                size="lg"
                                loading={loading}
                                disabled={!currentFile}
                            />
                        </View>
                    </View>
                </FormProvider>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.secondary,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 10,
    },
    petRow: {
        gap: 10,
    },
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
    uploadArea: {
        height: 120,
        borderWidth: 2,
        borderColor: designSystem.colors.neutral[200],
        borderStyle: 'dashed',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: designSystem.colors.background.primary,
        gap: 8,
    },
    uploadText: {
        fontSize: 16,
        fontWeight: '500',
        color: designSystem.colors.text.primary,
    },
    uploadSubtext: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
    },
    filePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        gap: 12,
    },
    fileIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: designSystem.colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '500',
        color: designSystem.colors.text.primary,
    },
    fileSize: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
    },
    formCard: {
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 16,
        padding: 20,
        ...designSystem.shadows.sm,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 8,
    },
    typeScroll: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    typeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        marginRight: 8,
        backgroundColor: designSystem.colors.background.primary,
    },
    typeOptionActive: {
        backgroundColor: designSystem.colors.primary[50],
        borderColor: designSystem.colors.primary[500],
    },
    typeText: {
        fontSize: 13,
        color: designSystem.colors.text.secondary,
        fontWeight: '500',
    },
    typeTextActive: {
        color: designSystem.colors.primary[700],
        fontWeight: '600',
    },
});
