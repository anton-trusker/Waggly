import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDocuments } from '@/hooks/useDocuments';
import { usePets } from '@/hooks/usePets';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import MobileHeader from '@/components/layout/MobileHeader';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import DragDropZone from '@/components/desktop/DragDropZone';
import DocumentUploadModal from '@/components/desktop/modals/DocumentUploadModal';
import * as Linking from 'expo-linking';

// Constants
const DOCUMENT_TYPES = [
    { id: 'all', label: 'All', icon: 'documents-outline' },
    { id: 'vaccination', label: 'Vaccines', icon: 'medkit-outline', color: '#EF4444', bg: '#FEF2F2' },
    { id: 'medical', label: 'Medical', icon: 'fitness-outline', color: '#3B82F6', bg: '#EFF6FF' },
    { id: 'lab_result', label: 'Labs', icon: 'flask-outline', color: '#8B5CF6', bg: '#F5F3FF' },
    { id: 'prescription', label: 'Prescriptions', icon: 'newspaper-outline', color: '#F59E0B', bg: '#FFFBEB' },
    { id: 'insurance', label: 'Insurance', icon: 'shield-checkmark-outline', color: '#10B981', bg: '#ECFDF5' },
    { id: 'other', label: 'Other', icon: 'folder-outline', color: '#6B7280', bg: '#F3F4F6' },
];

export default function DocumentsScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const isDesktop = width >= 1024;

    const { documents, loading, deleteDocument, fetchDocuments } = useDocuments();
    const { pets } = usePets();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedPetId, setSelectedPetId] = useState('all');
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [initialFile, setInitialFile] = useState<File | null>(null);

    // Filtering
    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = (doc.file_name || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'all' || doc.type === selectedType;
            const matchesPet = selectedPetId === 'all' || doc.pet_id === selectedPetId;
            return matchesSearch && matchesType && matchesPet;
        });
    }, [documents, searchQuery, selectedType, selectedPetId]);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setInitialFile(files[0]);
            setIsUploadModalVisible(true);
        }
    };

    const handleDownload = (url: string) => {
        if (url) Linking.openURL(url);
    };

    const handleDelete = async (doc: any) => {
        // In a real app, adding confirmation dialog here
        if (confirm('Are you sure you want to delete this document?')) {
            await deleteDocument(doc.id, doc.file_url);
            fetchDocuments();
        }
    };

    const getFileIcon = (type: string) => {
        const config = DOCUMENT_TYPES.find(t => t.id === type) || DOCUMENT_TYPES.find(t => t.id === 'other');
        return config || DOCUMENT_TYPES[6];
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <DesktopShell>
            {!isDesktop && <MobileHeader showLogo={true} showNotifications={true} />}
            <DragDropZone onDrop={handleDrop} style={{ flex: 1 }}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={[styles.header, isDesktop && styles.headerDesktop]}>
                        <View>
                            <Text style={styles.title}>All Documents ({documents.length})</Text>
                            <Text style={styles.subtitle}>Manage all your pet's health records and files</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <EnhancedButton
                                title="Scan"
                                icon="scan-outline"
                                variant="outline"
                                onPress={() => setIsUploadModalVisible(true)} // Mocking scan as upload for now
                                style={{ backgroundColor: '#fff' }}
                            />
                            <EnhancedButton
                                title="Upload File"
                                icon="cloud-upload-outline"
                                variant="primary"
                                onPress={() => setIsUploadModalVisible(true)}
                            />
                        </View>
                    </View>

                    {/* Filters & Search */}
                    <View style={[styles.filtersContainer, isMobile && styles.filtersContainerMobile]}>
                        <View style={styles.searchWrapper}>
                            <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilters}>
                            {DOCUMENT_TYPES.map(type => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[
                                        styles.filterChip,
                                        selectedType === type.id && styles.filterChipActive
                                    ]}
                                    onPress={() => setSelectedType(type.id)}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        selectedType === type.id && styles.filterChipTextActive
                                    ]}>{type.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Documents List */}
                    <View style={styles.documentsList}>
                        {filteredDocuments.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="document-text-outline" size={64} color="#E5E7EB" />
                                <Text style={styles.emptyTitle}>No documents found</Text>
                                <Text style={styles.emptyText}>Upload your first document to get started</Text>
                            </View>
                        ) : (
                            filteredDocuments.map(doc => {
                                const typeConfig = getFileIcon(doc.type);
                                return (
                                    <View key={doc.id} style={styles.documentCard}>
                                        <View style={[styles.fileIcon, { backgroundColor: typeConfig.bg }]}>
                                            <Ionicons name={typeConfig.icon as any} size={24} color={typeConfig.color} />
                                        </View>

                                        <View style={styles.docInfo}>
                                            <Text style={styles.docName} numberOfLines={1}>{doc.file_name}</Text>
                                            <View style={styles.docMeta}>
                                                <View style={styles.badge}>
                                                    <Text style={styles.badgeText}>{typeConfig.label}</Text>
                                                </View>
                                                <Text style={styles.metaText}>• {new Date(doc.created_at).toLocaleDateString()}</Text>
                                                <Text style={styles.metaText}>• {formatSize(doc.size_bytes)}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.docActions}>
                                            <TouchableOpacity
                                                style={styles.actionBtn}
                                                onPress={() => handleDownload(doc.file_url)}
                                            >
                                                <Ionicons name="download-outline" size={20} color="#6B7280" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionBtn, styles.deleteBtn]}
                                                onPress={() => handleDelete(doc)}
                                            >
                                                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </ScrollView>

                <DocumentUploadModal
                    visible={isUploadModalVisible}
                    onClose={() => {
                        setIsUploadModalVisible(false);
                        setInitialFile(null);
                        fetchDocuments();
                    }}
                    initialFile={initialFile}
                />
            </DragDropZone>
        </DesktopShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        padding: 16,
        paddingBottom: 80,
    },
    contentDesktop: {
        padding: 40,
        maxWidth: 1400,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        marginBottom: 32,
    },
    headerDesktop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    // Filters
    filtersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    filtersContainerMobile: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        flex: 1,
        maxWidth: 400,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
        height: '100%',
        outlineStyle: 'none',
    } as any, // 'outlineStyle' is web only
    typeFilters: {
        flexDirection: 'row',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#EEF2FF',
        borderColor: '#6366F1',
    },
    filterChipText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#6366F1',
        fontWeight: '600',
    },
    // List
    documentsList: {
        gap: 12,
    },
    documentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        // Hover effects would go here with Pressable
    },
    fileIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    docInfo: {
        flex: 1,
    },
    docName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    docMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    badge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
    },
    metaText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    docActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        padding: 8,
        borderRadius: 8,
        hover: { backgroundColor: '#F3F4F6' },
    } as any,
    deleteBtn: {
        marginLeft: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
    },
});
