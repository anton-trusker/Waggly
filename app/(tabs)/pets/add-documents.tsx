import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import AppHeader from '@/components/layout/AppHeader';
import { usePets } from '@/hooks/usePets';
import { useDocuments } from '@/hooks/useDocuments';
import { IconSymbol } from '@/components/ui/IconSymbol';
import BottomCTA from '@/components/ui/BottomCTA';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

const DOCUMENT_TYPES = [
    { id: 'vaccination', label: 'Vaccination', icon: 'medical' },
    { id: 'medical', label: 'Medical Record', icon: 'fitness' },
    { id: 'prescription', label: 'Prescription', icon: 'bandage' },
    { id: 'lab_result', label: 'Lab Result', icon: 'flask' },
    { id: 'insurance', label: 'Insurance', icon: 'shield-checkmark' },
    { id: 'invoice', label: 'Invoice', icon: 'receipt' },
    { id: 'other', label: 'Other', icon: 'document-text' },
];

export default function AddDocumentsScreen() {
    const { petId: initialPetId } = useLocalSearchParams();
    const { pets } = usePets();
    const { uploadDocument } = useDocuments(initialPetId as string);

    const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId as string || (pets.length > 0 ? pets[0].id : null));
    const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('medical');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Update selected pet if initialPetId changes
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
            setFile(asset);
            if (!name) {
                setName(asset.name);
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Error', 'Failed to pick file');
        }
    };

    const handleSave = async () => {
        if (!file || !name) {
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
                file.uri,
                type as any,
                name,
                { size_bytes: file.size, notes },
                file.mimeType,
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
        <View style={styles.container}>


            <ScrollView contentContainerStyle={styles.content}>
                {/* Pet Selector */}
                <View style={styles.section}>
                    <Text style={styles.label}>For Pet</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petRow}>
                        {pets.map(pet => (
                            <TouchableOpacity
                                key={pet.id}
                                style={[styles.petChip, selectedPetId === pet.id && styles.petChipSelected] as any}
                                onPress={() => setSelectedPetId(pet.id)}
                            >
                                <Text style={[styles.petChipText, selectedPetId === pet.id && styles.petChipTextSelected]}>{pet.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* File Upload Area */}
                <View style={styles.section}>
                    <Text style={styles.label}>File</Text>
                    {file ? (
                        <View style={styles.filePreview}>
                            <View style={styles.fileIcon}>
                                <Ionicons name="document" size={24} color={colors.primary} />
                            </View>
                            <View style={styles.fileInfo}>
                                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                                <Text style={styles.fileSize}>
                                    {file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setFile(null)}>
                                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.uploadArea} onPress={handlePickFile}>
                            <Ionicons name="cloud-upload-outline" size={32} color={colors.textSecondary} />
                            <Text style={styles.uploadText}>Click to select a file</Text>
                            <Text style={styles.uploadSubtext}>PDF, JPG, PNG up to 10MB</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Form Fields */}
                <View style={styles.formCard}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Document Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Vaccination Certificate"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                            {DOCUMENT_TYPES.map((docType) => (
                                <TouchableOpacity
                                    key={docType.id}
                                    style={[
                                        styles.typeOption,
                                        type === docType.id && styles.typeOptionActive
                                    ] as any}
                                    onPress={() => setType(docType.id)}
                                >
                                    <Ionicons
                                        name={docType.icon as any}
                                        size={16}
                                        color={type === docType.id ? colors.primary : colors.textSecondary}
                                    />
                                    <Text style={[
                                        styles.typeText,
                                        type === docType.id && styles.typeTextActive
                                    ]}>
                                        {docType.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Notes (Optional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea] as any}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add any details..."
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </View>

                {/* Spacer for bottom button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            <BottomCTA
                onBack={() => router.back()}
                onPrimary={handleSave}
                primaryLabel="Upload Document"
                disabled={loading}
            />

            <LoadingOverlay visible={loading} message="Uploading..." />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    uploadArea: {
        height: 120,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card,
        gap: 8,
    },
    uploadText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    uploadSubtext: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    filePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12,
    },
    fileIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: colors.iconBackgroundBlue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    fileSize: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    formCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: colors.text,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
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
        borderColor: colors.border,
        marginRight: 8,
        backgroundColor: colors.background,
    },
    typeOptionActive: {
        backgroundColor: colors.iconBackgroundBlue,
        borderColor: colors.primary,
    },
    typeText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    typeTextActive: {
        color: colors.primary,
        fontWeight: '600',
    },
});
