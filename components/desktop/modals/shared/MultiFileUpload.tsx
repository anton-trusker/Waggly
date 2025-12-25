import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface UploadFile {
    file: File | any;
    name: string;
    size: number;
    mimeType: string;
    uploadProgress: number;
    uploadStatus: 'pending' | 'uploading' | 'complete' | 'error';
    previewUrl?: string;
    uri?: string;
}

interface MultiFileUploadProps {
    acceptedFormats?: string[];
    maxFileSize?: number; // MB
    maxFiles?: number;
    onFilesChange: (files: UploadFile[]) => void;
    enableOCR?: boolean;
    onOCRComplete?: (data: any) => void;
    label?: string;
    helperText?: string;
    error?: string;
}

export default function MultiFileUpload({
    acceptedFormats = ['image/*', 'application/pdf'],
    maxFileSize = 10, // 10MB default
    maxFiles = 5,
    onFilesChange,
    enableOCR = false,
    onOCRComplete,
    label = 'Upload Documents',
    helperText = 'Drag and drop files here or click to browse',
    error,
}: MultiFileUploadProps) {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: acceptedFormats,
                multiple: true,
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const newFiles: UploadFile[] = result.assets.map(asset => ({
                file: asset,
                name: asset.name,
                size: asset.size || 0,
                mimeType: asset.mimeType || 'application/octet-stream',
                uploadProgress: 0,
                uploadStatus: 'pending',
                uri: asset.uri,
            }));

            addFiles(newFiles);
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
            });

            if (result.canceled) return;

            const newFiles: UploadFile[] = result.assets.map(asset => ({
                file: asset,
                name: `image_${Date.now()}.jpg`,
                size: 0,
                mimeType: 'image/jpeg',
                uploadProgress: 0,
                uploadStatus: 'pending',
                uri: asset.uri,
                previewUrl: asset.uri,
            }));

            addFiles(newFiles);
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const addFiles = (newFiles: UploadFile[]) => {
        // Validate file size
        const validFiles = newFiles.filter(file => {
            const sizeInMB = file.size / (1024 * 1024);
            return sizeInMB <= maxFileSize;
        });

        // Check max files limit
        const totalFiles = files.length + validFiles.length;
        const filesToAdd = totalFiles > maxFiles
            ? validFiles.slice(0, maxFiles - files.length)
            : validFiles;

        const updatedFiles = [...files, ...filesToAdd];
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);

        // Trigger OCR if enabled
        if (enableOCR && onOCRComplete) {
            filesToAdd.forEach(file => {
                if (file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf') {
                    // Mock OCR processing - replace with actual OCR service
                    setTimeout(() => {
                        onOCRComplete({
                            fileName: file.name,
                            extractedData: {
                                // Mock extracted data
                                type: 'invoice',
                                amount: 150.00,
                                date: new Date().toISOString(),
                            },
                        });
                    }, 1000);
                }
            });
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const getTotalSize = () => {
        const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
        return (totalBytes / (1024 * 1024)).toFixed(2);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            {/* Drop Zone */}
            <View
                style={[
                    styles.dropZone,
                    isDragging && styles.dropZoneDragging,
                    error && styles.dropZoneError,
                ]}
            >
                <IconSymbol android_material_icon_name="cloud-upload" size={48} color="#9CA3AF" />
                <Text style={styles.dropZoneText}>{helperText}</Text>
                <Text style={styles.dropZoneSubtext}>
                    {acceptedFormats.join(', ')} • Max {maxFileSize}MB per file
                </Text>

                <View style={styles.uploadButtons}>
                    <TouchableOpacity style={styles.uploadButton} onPress={handlePickDocument}>
                        <IconSymbol android_material_icon_name="attach-file" size={20} color="#6366F1" />
                        <Text style={styles.uploadButtonText}>Browse Files</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
                        <IconSymbol android_material_icon_name="add-a-photo" size={20} color="#6366F1" />
                        <Text style={styles.uploadButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* File List */}
            {files.length > 0 && (
                <View style={styles.filesContainer}>
                    <View style={styles.filesHeader}>
                        <Text style={styles.filesTitle}>
                            {files.length} {files.length === 1 ? 'file' : 'files'} ({getTotalSize()} MB)
                        </Text>
                        {files.length < maxFiles && (
                            <Text style={styles.filesLimit}>Max {maxFiles} files</Text>
                        )}
                    </View>

                    <ScrollView style={styles.filesList}>
                        {files.map((file, index) => (
                            <FilePreview
                                key={index}
                                file={file}
                                onRemove={() => removeFile(index)}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

interface FilePreviewProps {
    file: UploadFile;
    onRemove: () => void;
}

function FilePreview({ file, onRemove }: FilePreviewProps) {
    const isImage = file.mimeType.startsWith('image/');
    const isPDF = file.mimeType === 'application/pdf';

    return (
        <View style={styles.filePreview}>
            {/* File Icon/Preview */}
            <View style={styles.filePreviewIcon}>
                {isImage && file.previewUrl ? (
                    <Image source={{ uri: file.previewUrl }} style={styles.previewImage} />
                ) : (
                    <IconSymbol
                        android_material_icon_name={isPDF ? 'picture-as-pdf' : 'insert-drive-file'}
                        size={24}
                        color={isPDF ? '#EF4444' : '#6B7280'}
                    />
                )}
            </View>

            {/* File Info */}
            <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                </Text>
                <Text style={styles.fileSize}>
                    {(file.size / 1024).toFixed(1)} KB
                </Text>
            </View>

            {/* Progress/Status */}
            <View style={styles.fileStatus}>
                {file.uploadStatus === 'uploading' && (
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${file.uploadProgress}%` }]} />
                    </View>
                )}
                {file.uploadStatus === 'complete' && (
                    <IconSymbol android_material_icon_name="check-circle" size={20} color="#10B981" />
                )}
                {file.uploadStatus === 'error' && (
                    <IconSymbol android_material_icon_name="error" size={20} color="#EF4444" />
                )}
            </View>

            {/* Remove Button */}
            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                <IconSymbol android_material_icon_name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    dropZone: {
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        gap: 12,
    },
    dropZoneDragging: {
        borderColor: '#6366F1',
        backgroundColor: '#EEF2FF',
    },
    dropZoneError: {
        borderColor: '#EF4444',
    },
    dropZoneText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        textAlign: 'center',
    },
    dropZoneSubtext: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
    },
    uploadButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6366F1',
    },
    filesContainer: {
        marginTop: 16,
    },
    filesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    filesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    filesLimit: {
        fontSize: 12,
        color: '#6B7280',
    },
    filesList: {
        maxHeight: 300,
    },
    filePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        gap: 12,
    },
    filePreviewIcon: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: 48,
        height: 48,
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 2,
    },
    fileSize: {
        fontSize: 12,
        color: '#6B7280',
    },
    fileStatus: {
        width: 60,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#6366F1',
    },
    removeButton: {
        padding: 4,
    },
    errorText: {
        fontSize: 13,
        color: '#EF4444',
        marginTop: 4,
    },
});
