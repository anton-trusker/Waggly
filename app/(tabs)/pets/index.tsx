import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { PetPassportCard } from '@/components/pet/PetPassportCard';
import { PetCardSkeleton } from '@/components/skeletons/PetCardSkeleton';
import VisitFormModal from '@/components/desktop/modals/VisitFormModal';
import { useLocale } from '@/hooks/useLocale';

export default function PetsListPage() {
  const router = useRouter();
  const { pets, loading } = usePets();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { t } = useLocale();
  const [visitPetId, setVisitPetId] = useState<string | null>(null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>


      {loading ? (
        <View style={[styles.grid, isMobile && styles.gridMobile]}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.cardWrapper, isMobile && styles.cardWrapperMobile]}>
              <PetCardSkeleton />
            </View>
          ))}
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🐾</Text>
          <Text style={styles.emptyTitle}>{t('my_pets_page.empty_title')}</Text>
          <Text style={styles.emptyText}>{t('my_pets_page.empty_text')}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(tabs)/pets/new' as any)}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>{t('my_pets_page.add_first_pet')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.grid, isMobile && styles.gridMobile]}>
          {pets.map((pet) => (
            <View key={pet.id} style={[styles.cardWrapper, isMobile && styles.cardWrapperMobile]}>
              <PetPassportCard
                pet={pet}
                onPress={() => router.push(`/(tabs)/pets/${pet.id}` as any)}
              />
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => setVisitPetId(pet.id)}>
                  <Ionicons name="calendar-outline" size={18} color="#374151" />
                  <Text style={styles.secondaryButtonText}>{t('my_pets_page.book_visit')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {isMobile && <View style={{ height: 80 }} />}
      <VisitFormModal visible={!!visitPetId} petId={visitPetId || ''} onClose={() => setVisitPetId(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { height: 80, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerMobile: { height: 'auto', paddingVertical: 16, paddingHorizontal: 16, flexDirection: 'column', alignItems: 'flex-start', gap: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#6366F1', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  loadingText: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingVertical: 40 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center', maxWidth: 400, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, padding: 32 },
  gridMobile: { flexDirection: 'column', padding: 16 },
  cardWrapper: { width: 'calc(33.333% - 14px)' as any, minWidth: 320 },
  cardWrapperMobile: { width: '100%', minWidth: '100%' },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  secondaryButtonText: { fontSize: 13, fontWeight: '600', color: '#374151' },
});
