import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DragDropZone from '@/components/desktop/DragDropZone';

import DocumentUploadModal from '@/components/desktop/modals/DocumentUploadModal';

// Mock data (shared structure with DocumentsPage)
const MOCK_DOCUMENTS = [
    {
        id: '1',
        name: 'Vaccination_Certificate_2024.pdf',
        type: 'vaccination',
        size: '245 KB',
        uploadedAt: '2024-01-15',
        petName: 'Max',
        petId: '1' // Mock ID
    },
    {
        id: '4',
        name: 'Insurance_Policy.pdf',
        type: 'insurance',
        size: '890 KB',
        uploadedAt: '2023-11-05',
        petName: 'Bella',
        petId: '2'
    },
];

interface DocumentsTabProps {
    petId: string;
}

export default function DocumentsTabDesktop({ petId }: DocumentsTabProps) {
    // Filter documents for this pet (mock logic)
    // In real app, fetch from DB where pet_id = petId
    const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);

    // For demo purposes, we show all if petId matches, or empty if not
    // Since mock IDs might not match real UUIDs, we'll just show sample docs
    const filteredDocuments = documents;

    const handleDrop = (files: File[]) => {
        const fileNames = files.map(f => f.name).join(', ');
        Alert.alert('Files Dropped', `Ready to upload for this pet: ${fileNames}`);
        // In real app, this would open modal or start upload
        setUploadModalVisible(true);
    };

    const handleUpload = () => {
        setUploadModalVisible(true);
    };

    const getDocumentIcon = (type: string) => {
        switch (type) {
            case 'vaccination': return { icon: 'medical', color: '#10B981' };
            case 'medical': return { icon: 'fitness', color: '#6366F1' };
            case 'legal': return { icon: 'shield-checkmark', color: '#F59E0B' };
            case 'insurance': return { icon: 'umbrella', color: '#8B5CF6' };
            default: return { icon: 'document', color: '#6B7280' };
        }
    };

    return (
        <DragDropZone onDrop={handleDrop}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>Documents</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                        <Ionicons name="cloud-upload-outline" size={16} color="#6366F1" />
                        <Text style={styles.uploadButtonText}>Upload</Text>
                    </TouchableOpacity>
                </View>

                {filteredDocuments.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="folder-open-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyStateText}>No documents yet</Text>
                        <Text style={styles.emptyStateSubtext}>Upload records, prescriptions, or certificates</Text>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {filteredDocuments.map((doc) => {
                            const { icon, color } = getDocumentIcon(doc.type);
                            return (
                                <View key={doc.id} style={styles.card}>
                                    <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                                        <Ionicons name={icon as any} size={24} color={color} />
                                    </View>
                                    <View style={styles.fileInfo}>
                                        <Text style={styles.fileName} numberOfLines={1}>{doc.name}</Text>
                                        <Text style={styles.fileMeta}>{doc.size} • {doc.uploadedAt}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Ionicons name="ellipsis-vertical" size={16} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>
            <DocumentUploadModal
                visible={uploadModalVisible}
                onClose={() => setUploadModalVisible(false)}
                petId={petId}
            />
        </DragDropZone>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 12,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#D1D5DB',
        marginTop: 4,
    },
    grid: {
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    fileMeta: {
        fontSize: 12,
        color: '#6B7280',
    },
    actionButton: {
        padding: 8,
    },
});
