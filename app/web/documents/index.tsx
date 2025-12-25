import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDocuments } from '@/hooks/useDocuments';
import { usePets } from '@/hooks/usePets';
import DocumentUploadModal from '@/components/desktop/modals/DocumentUploadModal';
import * as Linking from 'expo-linking';

// MOCK_DOCUMENTS removed

const DOCUMENT_TYPES = [
    { id: 'all', label: 'All Documents', icon: 'document-text' },
    { id: 'vaccination', label: 'Vaccinations', icon: 'medical' },
    { id: 'medical', label: 'Medical Reports', icon: 'fitness' },
    { id: 'legal', label: 'Legal', icon: 'shield-checkmark' },
    { id: 'insurance', label: 'Insurance', icon: 'umbrella' },
];

import DragDropZone from '@/components/desktop/DragDropZone';

import { Pressable } from 'react-native';

export default function DocumentsPage() {
    const [selectedType, setSelectedType] = useState('all');
    const [selectedPetId, setSelectedPetId] = useState('all');
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

    // Fetch all documents for all pets (pass undefined to hook)
    const { documents, deleteDocument, fetchDocuments } = useDocuments();
    const { pets } = usePets();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const handleDrop = (files: File[]) => {
        // TODO: Handle drag & drop upload via modal or direct
        const fileNames = files.map(f => f.name).join(', ');
        Alert.alert('Files Dropped', `Please use the "Upload Document" button to upload: ${fileNames}`);
    };

    const filteredDocuments = documents.filter(doc => {
        const typeMatch = selectedType === 'all' || doc.type === selectedType;
        const petMatch = selectedPetId === 'all' || doc.pet_id === selectedPetId;
        return typeMatch && petMatch;
    });

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
        if (newSelected.size === 0) setIsSelectionMode(false);
        else setIsSelectionMode(true);
    };

    const selectAll = () => {
        if (selectedIds.size === filteredDocuments.length) {
            setSelectedIds(new Set());
            setIsSelectionMode(false);
        } else {
            setSelectedIds(new Set(filteredDocuments.map(d => d.id)));
            setIsSelectionMode(true);
        }
    };

    const deleteSelected = async () => {
        Alert.alert(
            'Delete Documents',
            `Delete ${selectedIds.size} documents?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        // Delete sequentially or parallel
                        const ids = Array.from(selectedIds);
                        for (const id of ids) {
                            const doc = documents.find(d => d.id === id);
                            if (doc) await deleteDocument(doc.id, doc.url);
                        }
                        setSelectedIds(new Set());
                        setIsSelectionMode(false);
                        fetchDocuments();
                    }
                },
            ]
        );
    };

    const getDocumentIcon = (type: string) => {
        switch (type) {
            case 'vaccination':
                return { icon: 'medical', color: '#10B981' };
            case 'medical':
                return { icon: 'fitness', color: '#6366F1' };
            case 'legal':
                return { icon: 'shield-checkmark', color: '#F59E0B' };
            case 'insurance':
                return { icon: 'umbrella', color: '#8B5CF6' };
            default:
                return { icon: 'document', color: '#6B7280' };
        }
    };

    const handleUpload = () => {
        setIsUploadModalVisible(true);
    };

    const handleDownload = (doc: any) => {
        if (doc.url) {
            Linking.openURL(doc.url);
        }
    };

    const handleDelete = (doc: any) => {
        Alert.alert(
            'Delete Document',
            `Are you sure you want to delete ${doc.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteDocument(doc.id, doc.url);
                        fetchDocuments();
                    }
                },
            ]
        );
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <DragDropZone onDrop={handleDrop}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Documents</Text>
                        <Text style={styles.subtitle}>
                            {documents.length} documents stored
                        </Text>
                    </View>
                    <View style={styles.headerActions}>
                        {isSelectionMode ? (
                            <View style={styles.bulkActions}>
                                <Text style={styles.selectedCount}>{selectedIds.size} selected</Text>
                                <TouchableOpacity style={styles.bulkActionButton} onPress={deleteSelected}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    <Text style={[styles.bulkActionText, { color: '#EF4444' }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                                <Text style={styles.uploadButtonText}>Upload Document</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Sidebar Filters */}

                    // ... (MOCK_DOCUMENTS removed, DOCUMENT_TYPES kept)

                    // ... (Inside Sidebar View)
                    <View style={styles.sidebar}>
                        <Text style={styles.sidebarTitle}>Pets</Text>
                        <TouchableOpacity
                            style={[
                                styles.filterItem,
                                selectedPetId === 'all' && styles.filterItemActive,
                            ]}
                            onPress={() => setSelectedPetId('all')}
                        >
                            <Ionicons
                                name="paw"
                                size={20}
                                color={selectedPetId === 'all' ? '#6366F1' : '#6B7280'}
                            />
                            <Text style={[
                                styles.filterText,
                                selectedPetId === 'all' && styles.filterTextActive,
                            ]}>
                                All Pets
                            </Text>
                        </TouchableOpacity>

                        {pets.map((pet) => (
                            <TouchableOpacity
                                key={pet.id}
                                style={[
                                    styles.filterItem,
                                    selectedPetId === pet.id && styles.filterItemActive,
                                ]}
                                onPress={() => setSelectedPetId(pet.id)}
                            >
                                <Ionicons
                                    name="paw-outline"
                                    size={20}
                                    color={selectedPetId === pet.id ? '#6366F1' : '#6B7280'}
                                />
                                <Text style={[
                                    styles.filterText,
                                    selectedPetId === pet.id && styles.filterTextActive,
                                ]} numberOfLines={1}>
                                    {pet.name}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <View style={{ height: 24 }} />

                        <Text style={styles.sidebarTitle}>Document Types</Text>
                        {DOCUMENT_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.filterItem,
                                    selectedType === type.id && styles.filterItemActive,
                                ]}
                                onPress={() => setSelectedType(type.id)}
                            >
                                <Ionicons
                                    name={type.icon as any}
                                    size={20}
                                    color={selectedType === type.id ? '#6366F1' : '#6B7280'}
                                />
                                <Text
                                    style={[
                                        styles.filterText,
                                        selectedType === type.id && styles.filterTextActive,
                                    ]}
                                >
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Documents List */}
                    <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
                        {filteredDocuments.length > 0 && (
                            <View style={styles.listHeader}>
                                <TouchableOpacity
                                    style={styles.selectAllButton}
                                    onPress={selectAll}
                                >
                                    <View style={[styles.checkbox, selectedIds.size === filteredDocuments.length && styles.checkboxChecked]}>
                                        {selectedIds.size === filteredDocuments.length && (
                                            <Ionicons name="checkmark" size={14} color="#fff" />
                                        )}
                                    </View>
                                    <Text style={styles.selectAllText}>Select All</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {filteredDocuments.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
                                <Text style={styles.emptyStateText}>No documents found</Text>
                                <Text style={styles.emptyStateSubtext}>
                                    Upload your first document to get started
                                </Text>
                                <TouchableOpacity style={styles.emptyButton} onPress={handleUpload}>
                                    <Ionicons name="add-circle-outline" size={20} color="#6366F1" />
                                    <Text style={styles.emptyButtonText}>Upload Document</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.documentGrid}>
                                {filteredDocuments.map((doc: any) => {
                                    const { icon, color } = getDocumentIcon(doc.type);
                                    const isSelected = selectedIds.has(doc.id);
                                    // Use formatSize
                                    const sizeString = formatSize(doc.size_bytes);

                                    return (
                                        <Pressable
                                            key={doc.id}
                                            style={[
                                                styles.documentCard,
                                                isSelected && styles.documentCardSelected
                                            ]}
                                            onPress={() => toggleSelection(doc.id)}
                                        >
                                            <TouchableOpacity
                                                style={styles.cardCheckbox}
                                                onPress={() => toggleSelection(doc.id)}
                                            >
                                                <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                                                    {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                                                </View>
                                            </TouchableOpacity>

                                            <View style={[styles.documentIcon, { backgroundColor: color + '20' }]}>
                                                <Ionicons name={icon as any} size={32} color={color} />
                                            </View>
                                            <View style={styles.documentInfo}>
                                                <Text style={styles.documentName} numberOfLines={1}>
                                                    {doc.name}
                                                </Text>
                                                <View style={styles.documentMeta}>
                                                    <Ionicons name="paw" size={12} color="#9CA3AF" />
                                                    <Text style={styles.documentMetaText}>{doc.petName}</Text>
                                                    <Text style={styles.documentMetaText}>•</Text>
                                                    <Text style={styles.documentMetaText}>{sizeString}</Text>
                                                </View>
                                                <Text style={styles.documentDate}>{doc.uploadedAt}</Text>
                                            </View>
                                            <View style={styles.documentActions}>
                                                <TouchableOpacity
                                                    style={styles.actionButton}
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(doc);
                                                    }}
                                                >
                                                    <Ionicons name="download-outline" size={20} color="#6366F1" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.actionButton}
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(doc);
                                                    }}
                                                >
                                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                                </TouchableOpacity>
                                            </View>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
            <DocumentUploadModal
                visible={isUploadModalVisible}
                onClose={() => {
                    setIsUploadModalVisible(false);
                    fetchDocuments();
                }}
                petId={selectedPetId === 'all' ? undefined : selectedPetId}
            />
        </DragDropZone>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#6366F1',
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: 240,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        padding: 16,
    },
    sidebarTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 4,
    },
    filterItemActive: {
        backgroundColor: '#F0F6FF',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#6366F1',
    },
    main: {
        flex: 1,
        padding: 32,
    },
    documentGrid: {
        gap: 16,
    },
    documentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    documentIcon: {
        width: 64,
        height: 64,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    documentInfo: {
        flex: 1,
    },
    documentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    documentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    documentMetaText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    documentDate: {
        fontSize: 12,
        color: '#D1D5DB',
    },
    documentActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#D1D5DB',
        marginTop: 4,
        marginBottom: 24,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#6366F1',
    },
    emptyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    bulkActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    selectedCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    bulkActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
    },
    bulkActionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    listHeader: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    selectAllText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
    },
    cardCheckbox: {
        marginRight: 8,
    },
    documentCardSelected: {
        borderColor: '#6366F1',
        backgroundColor: '#EEF2FF',
    },
});
