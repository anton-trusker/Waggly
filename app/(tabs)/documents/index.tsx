import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, useWindowDimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDocuments } from '@/hooks/useDocuments';
import { usePets } from '@/hooks/usePets';
import DocumentUploadModal from '@/components/desktop/modals/DocumentUploadModal';
import * as Linking from 'expo-linking';
import DragDropZone from '@/components/desktop/DragDropZone';
import { useLocale } from '@/hooks/useLocale';

export default function DocumentsPage() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const { t } = useLocale();

    // Note: Moving DOCUMENT_TYPES inside component or using a hook to get translated labels
    const docTypes = [
        { id: 'all', label: t('documents.type_all'), icon: 'document-text' },
        { id: 'vaccination', label: t('documents.type_vaccination'), icon: 'medical' },
        { id: 'medical', label: t('documents.type_medical'), icon: 'fitness' },
        { id: 'legal', label: t('documents.type_legal'), icon: 'shield-checkmark' },
        { id: 'insurance', label: t('documents.type_insurance'), icon: 'umbrella' },
    ];

    const [selectedType, setSelectedType] = useState('all');
    const [selectedPetId, setSelectedPetId] = useState('all');
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [initialFile, setInitialFile] = useState<File | null>(null);

    // Fetch all documents for all pets (pass undefined to hook)
    const { documents, deleteDocument, fetchDocuments } = useDocuments();
    const { pets } = usePets();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setInitialFile(files[0]);
            setIsUploadModalVisible(true);
        }
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
            t('documents.delete_bulk_confirm_title'),
            t('documents.delete_bulk_confirm_message', { count: selectedIds.size }),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        // Delete sequentially or parallel
                        const ids = Array.from(selectedIds);
                        for (const id of ids) {
                            const doc = documents.find(d => d.id === id);
                            if (doc) await deleteDocument(doc.id, doc.file_url);
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
        setInitialFile(null); // Clear any dropped file
        setIsUploadModalVisible(true);
    };

    const handleDownload = (doc: any) => {
        if (doc.file_url) {
            Linking.openURL(doc.file_url);
        }
    };

    const handleDelete = (doc: any) => {
        Alert.alert(
            t('documents.delete_confirm_title'),
            t('documents.delete_confirm_message', { name: doc.file_name }),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        await deleteDocument(doc.id, doc.file_url);
                        fetchDocuments();
                    }
                },
            ]
        );
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return t('documents.size_unknown');
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const renderFilters = () => (
        <ScrollView
            horizontal={isMobile}
            showsHorizontalScrollIndicator={false}
            style={isMobile ? styles.filtersMobile : styles.sidebar}
            contentContainerStyle={isMobile ? styles.filtersContentMobile : undefined}
        >
            <View style={!isMobile && { gap: 4 }}>
                <Text style={styles.sidebarTitle}>{t('documents.filter_pets')}</Text>
                <TouchableOpacity
                    style={[
                        styles.filterItem,
                        selectedPetId === 'all' && styles.filterItemActive,
                        isMobile && styles.filterItemMobile
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
                        {t('documents.filter_all_pets')}
                    </Text>
                </TouchableOpacity>

                {pets.map((pet) => (
                    <TouchableOpacity
                        key={pet.id}
                        style={[
                            styles.filterItem,
                            selectedPetId === pet.id && styles.filterItemActive,
                            isMobile && styles.filterItemMobile
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

                <View style={{ height: 24, width: isMobile ? 24 : 0 }} />

                <Text style={styles.sidebarTitle}>{t('documents.filter_types')}</Text>
                {docTypes.map((type) => (
                    <TouchableOpacity
                        key={type.id}
                        style={[
                            styles.filterItem,
                            selectedType === type.id && styles.filterItemActive,
                            isMobile && styles.filterItemMobile
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
        </ScrollView>
    );

    return (
        <DragDropZone onDrop={handleDrop}>
            <View style={styles.container}>
                {/* Header */}
                <View style={[styles.header, isMobile && styles.headerMobile]}>
                    <View>
                        <Text style={styles.title}>{t('documents.title')}</Text>
                        <Text style={styles.subtitle}>
                            {t('documents.subtitle_count', { count: documents.length })}
                        </Text>
                    </View>
                    <View style={styles.headerActions}>
                        {isSelectionMode ? (
                            <View style={styles.bulkActions}>
                                <Text style={styles.selectedCount}>{t('documents.selected_count', { count: selectedIds.size })}</Text>
                                <TouchableOpacity style={styles.bulkActionButton} onPress={deleteSelected}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    <Text style={[styles.bulkActionText, { color: '#EF4444' }]}>{t('documents.delete_bulk')}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                                <Text style={styles.uploadButtonText}>{t('documents.upload_button')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={[styles.content, isMobile && styles.contentMobile]}>
                    {/* Filters */}
                    {renderFilters()}

                    {/* Documents List */}
                    <ScrollView style={[styles.main, isMobile && styles.mainMobile]} showsVerticalScrollIndicator={false}>
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
                                    <Text style={styles.selectAllText}>{t('documents.select_all')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {filteredDocuments.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
                                <Text style={styles.emptyStateText}>{t('documents.empty_title')}</Text>
                                <Text style={styles.emptyStateSubtext}>
                                    {t('documents.empty_subtitle')}
                                </Text>
                                <TouchableOpacity style={styles.emptyButton} onPress={handleUpload}>
                                    <Ionicons name="add-circle-outline" size={20} color="#6366F1" />
                                    <Text style={styles.emptyButtonText}>{t('documents.empty_button')}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.documentGrid}>
                                {filteredDocuments.map((doc: any) => {
                                    const { icon, color } = getDocumentIcon(doc.type);
                                    const isSelected = selectedIds.has(doc.id);
                                    const sizeString = formatSize(doc.size_bytes);
                                    const pet = pets.find(p => p.id === doc.pet_id);
                                    const petName = pet?.name || 'Unknown Pet';

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
                                                    {doc.file_name}
                                                </Text>
                                                <View style={styles.documentMeta}>
                                                    <Ionicons name="paw" size={12} color="#9CA3AF" />
                                                    <Text style={styles.documentMetaText}>{petName}</Text>
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
                        {isMobile && <View style={{ height: 80 }} />}
                    </ScrollView>
                </View>
            </View>
            <DocumentUploadModal
                visible={isUploadModalVisible}
                onClose={() => {
                    setIsUploadModalVisible(false);
                    setInitialFile(null);
                    fetchDocuments();
                }}
                petId={selectedPetId === 'all' ? undefined : selectedPetId}
                initialFile={initialFile}
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
    headerMobile: {
        padding: 16,
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
    contentMobile: {
        flexDirection: 'column',
    },
    sidebar: {
        width: 240,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        padding: 16,
    },
    filtersMobile: {
        maxHeight: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    filtersContentMobile: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sidebarTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 12,
        paddingHorizontal: 16,
        marginTop: 8,
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
    filterItemMobile: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: '#E5E7EB',
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
    mainMobile: {
        padding: 16,
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
    documentCardSelected: {
        borderColor: '#6366F1',
        backgroundColor: '#EEF2FF',
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
});
