import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePets } from '@/hooks/usePets';
import { useDocuments } from '@/hooks/useDocuments';

export default function DocumentsTab() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const { pets } = usePets();
  const { documents, fetchDocuments } = useDocuments(id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedTime, setSelectedTime] = useState('Last 6 Months');

  const pet = pets?.find(p => p.id === id);
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  const documentTypes = {
    vaccination: { icon: 'vaccines', color: '#DB2777', bgColor: '#FCE7F3' },
    lab_result: { icon: 'biotech', color: '#2563EB', bgColor: '#DBEAFE' },
    invoice: { icon: 'receipt-long', color: '#059669', bgColor: '#D1FAE5' },
    prescription: { icon: 'medication', color: '#9333EA', bgColor: '#F3E8FF' },
    insurance: { icon: 'health-and-safety', color: '#EA580C', bgColor: '#FFEDD5' },
    medical: { icon: 'assignment', color: '#2563EB', bgColor: '#DBEAFE' },
    other: { icon: 'folder', color: '#6B7280', bgColor: '#F3F4F6' },
  } as const;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDocumentIcon = (type: string) => {
    return documentTypes[type as keyof typeof documentTypes] || documentTypes.other;
  };

  const allDocs = documents || [];
  
  // Filter logic
  const filteredDocs = allDocs.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.file_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All Types' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const renderActionTile = (label: string, icon: string, color: string, bgColor: string, onPress: () => void) => (
    <TouchableOpacity 
      style={[styles.actionTile, isMobile && styles.actionTileMobile]} 
      onPress={onPress}
    >
      <View style={[styles.actionIconBox, { backgroundColor: bgColor }, isMobile && styles.actionIconBoxMobile]}>
        <IconSymbol android_material_icon_name={icon as any} size={isMobile ? 24 : 28} color={color} />
      </View>
      <Text style={[styles.actionLabel, isMobile && styles.actionLabelMobile]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Desktop Header & Actions */}
      {!isMobile && (
        <View style={styles.desktopHeader}>
          <Text style={styles.sectionTitle}>All Documents ({filteredDocs.length})</Text>
          <View style={styles.desktopActions}>
            <TouchableOpacity 
              style={styles.desktopBtnSecondary}
              onPress={() => router.push(`/(tabs)/pets/documents/add?petId=${id}&mode=scan` as any)}
            >
              <IconSymbol android_material_icon_name="document-scanner" size={20} color="#6366F1" />
              <Text style={styles.desktopBtnTextSecondary}>Scan Doc</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.desktopBtnPrimary}
              onPress={() => router.push(`/(tabs)/pets/documents/add?petId=${id}&mode=upload` as any)}
            >
              <IconSymbol android_material_icon_name="upload-file" size={20} color="#fff" />
              <Text style={styles.desktopBtnTextPrimary}>Upload File</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Mobile Actions */}
      {isMobile && (
        <View style={styles.mobileActionsContainer}>
          {renderActionTile('Scan Doc', 'document-scanner', '#6366F1', '#E0E7FF', () => router.push(`/(tabs)/pets/documents/add?petId=${id}&mode=scan` as any))}
          {renderActionTile('Upload', 'upload-file', '#059669', '#D1FAE5', () => router.push(`/(tabs)/pets/documents/add?petId=${id}&mode=upload` as any))}
          {renderActionTile('Auto-Fill', 'auto-fix-high', '#EA580C', '#FFEDD5', () => {})}
        </View>
      )}

      {/* Filters */}
      <View style={[styles.filterContainer, isMobile && styles.filterContainerMobile]}>
        <View style={styles.searchBox}>
          <IconSymbol android_material_icon_name="search" size={20} color="#9CA3AF" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by title..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        {!isMobile && (
          <View style={styles.filterRow}>
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{selectedType}</Text>
              <IconSymbol android_material_icon_name="expand-more" size={16} color="#6B7280" />
            </View>
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{selectedTime}</Text>
              <IconSymbol android_material_icon_name="expand-more" size={16} color="#6B7280" />
            </View>
          </View>
        )}
      </View>

      {/* Documents List */}
      <View style={[styles.listContainer, isMobile && styles.listContainerMobile]}>
        {filteredDocs.map((doc) => {
          const iconConfig = getDocumentIcon(doc.type);
          return (
            <TouchableOpacity key={doc.id} style={styles.docCard}>
              <View style={[styles.docIconBox, { backgroundColor: iconConfig.bgColor }]}>
                <IconSymbol android_material_icon_name={iconConfig.icon as any} size={24} color={iconConfig.color} />
              </View>
              
              <View style={styles.docContent}>
                <View style={styles.docHeader}>
                  <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                </View>
                
                <View style={styles.docMetaRow}>
                  <Text style={styles.docType}>{doc.type}</Text>
                  <Text style={styles.docDot}>•</Text>
                  <Text style={styles.docDate}>{formatDate(doc.created_at)}</Text>
                </View>
                
                <View style={styles.docFooter}>
                  <View style={styles.docClinic}>
                    <IconSymbol android_material_icon_name="attach-file" size={12} color="#9CA3AF" />
                    <Text style={styles.docClinicText} numberOfLines={1}>{doc.mime_type || 'Unknown type'}</Text>
                  </View>
                  {typeof doc.size_bytes === 'number' && (
                    <Text style={styles.docSize}>
                      {doc.size_bytes >= 1024 * 1024
                        ? `${(doc.size_bytes / 1024 / 1024).toFixed(2)} MB`
                        : `${(doc.size_bytes / 1024).toFixed(0)} KB`}
                    </Text>
                  )}
                </View>
              </View>
              
              {!isMobile && (
                <View style={styles.docActions}>
                  <TouchableOpacity style={styles.iconBtn}>
                    <IconSymbol android_material_icon_name="visibility" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn}>
                    <IconSymbol android_material_icon_name="download" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn}>
                    <IconSymbol android_material_icon_name="more-vert" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        
        {filteredDocs.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol android_material_icon_name="folder-open" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No documents found</Text>
            <TouchableOpacity 
              style={styles.desktopBtnPrimary}
              onPress={() => router.push(`/(tabs)/pets/documents/add?petId=${id}&mode=upload` as any)}
            >
              <IconSymbol android_material_icon_name="upload-file" size={20} color="#fff" />
              <Text style={styles.desktopBtnTextPrimary}>Upload a Document</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Mobile FAB (if needed, though designs say Action Tiles at top) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F6F6F8', // Match OverviewTab bg
  },
  // Desktop Header
  desktopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  desktopActions: {
    flexDirection: 'row',
    gap: 12,
  },
  desktopBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  desktopBtnTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  desktopBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    shadowColor: '#6366F1',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  desktopBtnTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  // Mobile Actions
  mobileActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionTile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionTileMobile: {
    padding: 12,
    gap: 8,
  },
  actionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBoxMobile: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  actionLabelMobile: {
    fontSize: 12,
  },

  // Filters
  filterContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterContainerMobile: {
    padding: 12,
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // List
  listContainer: {
    gap: 12,
  },
  listContainerMobile: {
    paddingBottom: 24,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  docIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docContent: {
    flex: 1,
    gap: 4,
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  docAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  docType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'uppercase',
  },
  docDot: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  docDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  docFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  docClinic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  docClinicText: {
    fontSize: 12,
    color: '#6B7280',
  },
  docSize: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  docActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#F3F4F6',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
