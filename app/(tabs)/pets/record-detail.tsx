import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/lib/supabase';
import { Vaccination, Treatment, MedicalVisit, Event as DbEvent } from '@/types';

type RecordType = 'vaccination' | 'treatment' | 'visit' | 'event' | 'birthday';

export default function RecordDetailScreen() {
  const { type, id } = useLocalSearchParams<{ type: RecordType; id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vax, setVax] = useState<Vaccination | null>(null);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [visit, setVisit] = useState<MedicalVisit | null>(null);
  const [event, setEvent] = useState<DbEvent | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        if (type === 'vaccination') {
          const { data, error } = await supabase.from('vaccinations').select('*').eq('id', id).single();
          if (error) throw error;
          setVax(data as Vaccination);
        } else if (type === 'treatment') {
          const { data, error } = await supabase.from('treatments').select('*').eq('id', id).single();
          if (error) throw error;
          setTreatment(data as Treatment);
        } else if (type === 'visit') {
          const { data, error } = await supabase.from('medical_visits').select('*').eq('id', id).single();
          if (error) throw error;
          setVisit(data as MedicalVisit);
        } else if (type === 'event') {
          const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
          if (error) throw error;
          setEvent(data as DbEvent);
        } else if (type === 'birthday') {
          setEvent({
            id: id,
            user_id: '',
            pet_id: id,
            title: 'Birthday',
            description: 'Annual birthday reminder',
            start_time: new Date().toISOString(),
            end_time: null,
            type: 'other',
            location: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as any);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load record');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [type, id]);

  const title = (() => {
    if (type === 'vaccination' && vax) return vax.vaccine_name;
    if (type === 'treatment' && treatment) return treatment.treatment_name;
    if (type === 'visit' && visit) return visit.reason || 'Medical Visit';
    if (type === 'event' && event) return event.title;
    if (type === 'birthday') return 'Birthday';
    return 'Record';
  })();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="chevron-left"
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Record Details</Text>
          <Text style={styles.headerSubtitle}>{title}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {type === 'vaccination' && vax && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Vaccination</Text>
              <Text style={styles.item}>Name: {vax.vaccine_name}</Text>
              <Text style={styles.item}>Category: {vax.category}</Text>
              <Text style={styles.item}>Date Given: {new Date(vax.date_given).toLocaleDateString()}</Text>
              <Text style={styles.item}>Next Due: {vax.next_due_date ? new Date(vax.next_due_date).toLocaleDateString() : '—'}</Text>
              <Text style={styles.item}>Dose #: {vax.dose_number ?? '—'}</Text>
              <Text style={styles.item}>Admin Vet: {vax.administering_vet ?? '—'}</Text>
              <Text style={styles.item}>Notes: {vax.notes ?? '—'}</Text>
            </View>
          )}

          {type === 'treatment' && treatment && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Treatment</Text>
              <Text style={styles.item}>Name: {treatment.treatment_name}</Text>
              <Text style={styles.item}>Category: {treatment.category}</Text>
              <Text style={styles.item}>Dosage: {treatment.dosage_value ? `${treatment.dosage_value} ${treatment.dosage_unit ?? ''}` : (treatment.dosage ?? '—')}</Text>
              <Text style={styles.item}>Frequency: {treatment.frequency ?? '—'}</Text>
              <Text style={styles.item}>Start: {treatment.start_date ? new Date(treatment.start_date).toLocaleDateString() : '—'}</Text>
              <Text style={styles.item}>End: {treatment.end_date ? new Date(treatment.end_date).toLocaleDateString() : '—'}</Text>
              <Text style={styles.item}>Vet: {treatment.vet ?? '—'}</Text>
              <Text style={styles.item}>Notes: {treatment.notes ?? '—'}</Text>
              <Text style={styles.item}>Status: {treatment.is_active ? 'Active' : 'Completed'}</Text>
            </View>
          )}

          {type === 'visit' && visit && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Medical Visit</Text>
              <Text style={styles.item}>Date: {new Date(visit.date).toLocaleDateString()}</Text>
              <Text style={styles.item}>Clinic: {visit.clinic_name ?? '—'}</Text>
              <Text style={styles.item}>Vet: {visit.vet_name ?? '—'}</Text>
              <Text style={styles.item}>Reason: {visit.reason}</Text>
              <Text style={styles.item}>Diagnosis: {visit.diagnosis ?? '—'}</Text>
              <Text style={styles.item}>Notes: {visit.notes ?? '—'}</Text>
            </View>
          )}

          {type === 'event' && event && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Event</Text>
              <Text style={styles.item}>Title: {event.title}</Text>
              <Text style={styles.item}>Date: {new Date(event.start_time).toLocaleDateString()}</Text>
              <Text style={styles.item}>Type: {event.type}</Text>
              <Text style={styles.item}>Location: {event.location ?? '—'}</Text>
              <Text style={styles.item}>Notes: {event.description ?? '—'}</Text>
            </View>
          )}

          {type === 'birthday' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Birthday</Text>
              <Text style={styles.item}>Annual reminder for pet’s birthday.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  headerSubtitle: { fontSize: 13, color: colors.textSecondary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.error },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 8 },
  item: { fontSize: 15, color: colors.text, marginBottom: 4 },
});
