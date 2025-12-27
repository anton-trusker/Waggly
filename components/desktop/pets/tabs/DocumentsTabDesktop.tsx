import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DragDropZone from '@/components/desktop/DragDropZone';
import DocumentUploadModal from '@/components/desktop/modals/DocumentUploadModal';
import { useDocuments } from '@/hooks/useDocuments';
import { Document } from '@/types';

interface DocumentsTabProps {
    petId: string;
}

export default function DocumentsTabDesktop({ petId }: DocumentsTabProps) {
    const { documents, loading, deleteDocument, fetchDocuments } = useDocuments(petId);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [droppedFile, setDroppedFile] = useState<File | null>(null);

    // Refresh documents when tab mounts or petId changes
    useEffect(() => {
        fetchDocuments();
    }, [petId, fetchDocuments]);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setDroppedFile(files[0]);
            setUploadModalVisible(true);
        }
    };

    const handleUpload = () => {
        setDroppedFile(null);
        setUploadModalVisible(true);
    };

    const handleDelete = (doc: Document) => {
        Alert.alert(
            "Delete Document",
            `Are you sure you want to delete "${doc.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        const { error } = await deleteDocument(doc.id, doc.file_url || '');
                        if (error) {
                            Alert.alert("Error", "Failed to delete document");
                        }
                    }
                }
            ]
        );
    };

    const getDocumentIcon = (type: string) => {
        switch (type) {
            case 'vaccination': return { icon: 'medical', color: '#10B981' };
            case 'medical': return { icon: 'fitness', color: '#6366F1' };
            case 'legal': return { icon: 'shield-checkmark', color: '#F59E0B' };
            case 'insurance': return { icon: 'umbrella', color: '#8B5CF6' };
            case 'prescription': return { icon: 'bandage', color: '#EC4899' };
            case 'lab_result': return { icon: 'flask', color: '#06B6D4' };
            case 'invoice': return { icon: 'receipt', color: '#64748B' };
            default: return { icon: 'document', color: '#6B7280' };
        }
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

                {loading ? (
                    <View style={styles.centerState}>
                        <ActivityIndicator size="small" color="#6366F1" />
                    </View>
                ) : documents.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="folder-open-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyStateText}>No documents yet</Text>
                        <Text style={styles.emptyStateSubtext}>Upload records, prescriptions, or certificates</Text>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {documents.map((doc) => {
                            const { icon, color } = getDocumentIcon(doc.type);
                            return (
                                <View key={doc.id} style={styles.card}>
                                    <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                                        <Ionicons name={icon as any} size={24} color={color} />
                                    </View>
                                    <View style={styles.fileInfo}>
                                        <Text style={styles.fileName} numberOfLines={1}>{doc.name}</Text>
                                        <Text style={styles.fileMeta}>
                                            {formatSize(doc.size_bytes)} • {new Date(doc.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.actionButton}
                                        onPress={() => handleDelete(doc)}
                                    >
                                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>
            <DocumentUploadModal
                visible={uploadModalVisible}
                onClose={() => {
                    setUploadModalVisible(false);
                    setDroppedFile(null);
                    fetchDocuments();
                }}
                petId={petId}
                initialFile={droppedFile}
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
    centerState: {
        alignItems: 'center',
        paddingVertical: 32,
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
