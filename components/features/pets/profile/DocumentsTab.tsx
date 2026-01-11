
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, useWindowDimensions, Modal, Image, Alert } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Document } from '@/types';
import * as WebBrowser from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';

interface DocumentsTabProps {
    documents: Document[];
    isLoading?: boolean;
    onUpload: () => void;
    onScan: () => void;
    onDelete: (id: string, url: string) => void;
}

export default function DocumentsTab({ documents = [], isLoading = false, onUpload, onScan, onDelete }: DocumentsTabProps) {
    const { theme } = useAppTheme();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;

    // Local State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Document Types Configuration
    const documentTypes = {
        all: { label: 'All', icon: 'folder', color: theme.colors.text.primary, bg: theme.colors.background.secondary },
        vaccination: { label: 'Vaccines', icon: 'vaccines', color: '#DB2777', bg: '#FCE7F3' },
        lab_result: { label: 'Labs', icon: 'biotech', color: '#2563EB', bg: '#EFF6FF' },
        prescription: { label: 'Meds', icon: 'healing', color: '#9333EA', bg: '#F3E8FF' },
        insurance: { label: 'Insurance', icon: 'health-and-safety', color: '#EA580C', bg: '#FFEDD5' },
        medical: { label: 'Medical', icon: 'assignment', color: '#059669', bg: '#ECFDF5' },
        other: { label: 'Other', icon: 'folder-open', color: '#6B7280', bg: '#F3F4F6' },
    };

    const getDocTypeConfig = (type: string) => {
        return documentTypes[type as keyof typeof documentTypes] || documentTypes.other;
    };

    // Filter Logic
    const filteredDocs = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = ((doc as any).name || doc.file_name || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'All' || doc.type === selectedType; // Case sensitive match might need adjustment if BE types differ

            // Adjust type matching to be looser if needed (e.g. backend lowercase vs frontend capitalized)
            // Ideally backend returns 'vaccination', 'lab_result' etc matching keys.
            // If selectedType is 'All', return true.
            // If selectedType is a specific key (e.g. 'vaccination'), check if doc.type matches.

            if (selectedType === 'All') return matchesSearch;
            return matchesSearch && (doc.type === selectedType || doc.type === selectedType.toLowerCase());
        });
    }, [documents, searchQuery, selectedType]);

    const handlePreview = async (doc: Document) => {
        const url = (doc as any).url || doc.file_url;
        if (!url) return;

        if ((doc as any).mime_type?.startsWith('image/')) {
            setPreviewImage(url);
        } else {
            await WebBrowser.openBrowserAsync(url);
        }
    };

    const handleDelete = (doc: Document) => {
        Alert.alert('Delete Document', 'Are you sure you want to delete this document?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => onDelete(doc.id, (doc as any).url || doc.file_url)
            }
        ]);
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return '';
        if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
        return `${(bytes / 1024).toFixed(0)} KB`;
    };

    return (
        <View style={[styles.container, isDesktop && styles.containerDesktop]}>
            <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>

                {/* Left Column (or full width on mobile) */}
                <View style={[styles.column, { flex: 2 }]}>

                    {/* Quick Actions */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickActions}
                        style={styles.quickActionsScroll}
                    >
                        <QuickAction
                            icon="document-scanner"
                            materialIcon="document-scanner"
                            color="#2563EB"
                            bg="#EFF6FF"
                            label="Scan Doc"
                            onPress={onScan}
                            theme={theme}
                        />
                        <QuickAction
                            icon="upload-file"
                            materialIcon="upload-file"
                            color="#059669"
                            bg="#ECFDF5"
                            label="Upload"
                            onPress={onUpload}
                            theme={theme}
                        />
                    </ScrollView>

                    {/* Filters & Search */}
                    <View style={[styles.filterContainer, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                        <View style={[styles.searchBox, { backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.secondary }]}>
                            <IconSymbol android_material_icon_name="search" size={20} color={theme.colors.text.tertiary} />
                            <TextInput
                                style={[styles.searchInput, { color: theme.colors.text.primary }] as any}
                                placeholder="Search documents..."
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
                            {Object.entries(documentTypes).map(([key, config]) => {
                                if (key === 'all' && documents.length === 0) return null; // Logic check: hide 'all' if empty? Probably keep it.

                                const isActive = (key === 'all' && selectedType === 'All') || selectedType === key;
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        style={[
                                            styles.filterChip,
                                            isActive ? { backgroundColor: theme.colors.text.primary } : { backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.secondary, borderWidth: 1 }
                                        ] as any}
                                        onPress={() => setSelectedType(key === 'all' ? 'All' : key)}
                                    >
                                        <Text style={[styles.filterChipText, { color: isActive ? theme.colors.background.primary : theme.colors.text.secondary }]}>
                                            {config.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Document List */}
                    <View style={styles.listContainer}>
                        {isLoading ? (
                            <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>Loading documents...</Text>
                        ) : filteredDocs.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={[styles.emptyIcon, { backgroundColor: theme.colors.background.secondary }]}>
                                    <IconSymbol android_material_icon_name="folder-open" size={48} color={theme.colors.text.tertiary} />
                                </View>
                                <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                                    {searchQuery ? 'No documents match your search.' : 'No documents found.'}
                                </Text>
                            </View>
                        ) : (
                            filteredDocs.map((doc) => {
                                const typeConfig = getDocTypeConfig(doc.type);
                                return (
                                    <TouchableOpacity
                                        key={doc.id}
                                        style={[styles.docCard, { backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.secondary }] as any}
                                        onPress={() => handlePreview(doc)}
                                    >
                                        <View style={[styles.docIcon, { backgroundColor: typeConfig.bg }]}>
                                            <IconSymbol android_material_icon_name={typeConfig.icon as any} size={24} color={typeConfig.color} />
                                        </View>

                                        <View style={styles.docContent}>
                                            <Text style={[styles.docName, { color: theme.colors.text.primary }]} numberOfLines={1}>
                                                {(doc as any).name || doc.file_name}
                                            </Text>
                                            <View style={styles.docMeta}>
                                                <Text style={[styles.docMetaText, { color: theme.colors.text.tertiary }]}>
                                                    {new Date(doc.created_at).toLocaleDateString()} • {formatSize((doc as any).size_bytes)}
                                                </Text>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={[styles.actionBtn, { backgroundColor: theme.colors.background.secondary }] as any}
                                            onPress={() => handleDelete(doc)}
                                        >
                                            <IconSymbol android_material_icon_name="delete-outline" size={20} color={theme.colors.status.error as string} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>
                </View>

                {/* Right Column (Desktop Only - Stats/Info) */}
                {isDesktop && (
                    <View style={[styles.column, { flex: 1 }]}>
                        <View style={[styles.infoCard, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                            <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>Storage Usage</Text>
                            <View style={styles.storageStats}>
                                <View style={styles.storageRow}>
                                    <Text style={[styles.storageLabel, { color: theme.colors.text.secondary }]}>Total Files</Text>
                                    <Text style={[styles.storageValue, { color: theme.colors.text.primary }]}>{documents.length}</Text>
                                </View>
                                <View style={styles.storageBarBg}>
                                    <View style={[styles.storageBarFill, { width: '20%', backgroundColor: theme.colors.primary[500] }]} />
                                </View>
                                <Text style={[styles.storageSub, { color: theme.colors.text.tertiary }]}>Space used: 45MB / 1GB (Est)</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            {/* Image Preview Modal */}
            <Modal visible={!!previewImage} transparent onRequestClose={() => setPreviewImage(null)}>
                <View style={styles.previewBackdrop}>
                    <TouchableOpacity style={styles.previewClose} onPress={() => setPreviewImage(null)}>
                        <IconSymbol android_material_icon_name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                    {previewImage ? (
                        <Image source={{ uri: previewImage }} style={styles.previewImage} resizeMode="contain" />
                    ) : null}
                </View>
            </Modal>
        </View>
    );
}

function QuickAction({ icon, materialIcon, color, bg, label, onPress, theme }: any) {
    return (
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
            <View style={[styles.actionIcon, { backgroundColor: bg }]}>
                <IconSymbol ios_icon_name={icon} android_material_icon_name={materialIcon} size={24} color={color} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.colors.text.secondary }]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 24,
    },
    containerDesktop: {
        padding: 32,
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },
    mainLayout: {
        flexDirection: 'column',
        gap: 24,
    },
    mainLayoutDesktop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    column: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    quickActions: {
        gap: 16,
        paddingBottom: 4,
    },
    quickActionsScroll: {
        flexGrow: 0,
        marginBottom: 8,
    },
    actionItem: {
        alignItems: 'center',
        gap: 8,
        minWidth: 72,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    filterContainer: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
    },
    filterChips: {
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    listContainer: {
        gap: 12,
    },
    loadingText: {
        textAlign: 'center',
        padding: 20,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        gap: 12,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
    },
    docCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 16,
    },
    docIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    docContent: {
        flex: 1,
        gap: 4,
    },
    docName: {
        fontSize: 15,
        fontWeight: '600',
    },
    docMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    docMetaText: {
        fontSize: 12,
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Desktop right panel
    infoCard: {
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    storageStats: {
        gap: 12,
    },
    storageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storageLabel: {
        fontSize: 14,
    },
    storageValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    storageBarBg: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    storageBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    storageSub: {
        fontSize: 12,
    },
    // Modal
    previewBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewClose: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        zIndex: 10,
    },
    previewImage: {
        width: '90%',
        height: '80%',
    },
});
