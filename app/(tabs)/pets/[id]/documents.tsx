import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDocuments } from '@/hooks/useDocuments';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
import DocumentsTab from '@/components/features/pets/profile/DocumentsTab';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import MobileHeader from '@/components/layout/MobileHeader';
import PetProfileHeader from '@/components/desktop/pets/PetProfileHeader';

export default function DocumentsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets } = usePets();
  const { documents, fetchDocuments, deleteDocument, loading } = useDocuments(id);
  const { theme } = useAppTheme();

  const pet = pets?.find(p => p.id === id);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  if (!pet) return null;

  const handleAdd = (mode: 'scan' | 'upload') => {
    router.push(`/web/pets/documents/add?petId=${id}&mode=${mode}` as any);
  };

  const content = (
    <DocumentsTab
      documents={documents}
      isLoading={loading}
      onUpload={() => handleAdd('upload')}
      onScan={() => handleAdd('scan')}
      onDelete={deleteDocument}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <DesktopShell>
        <PetProfileHeader pet={pet} />
        {content}
      </DesktopShell>
    </View>
  );
}
