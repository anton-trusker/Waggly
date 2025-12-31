import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { usePets } from '@/hooks/usePets';
import { Pet, Vaccination, Treatment, MedicalVisit, Event as DbEvent } from '@/types';
import { getColor } from "@/utils/designSystem";
import { designSystem } from '@/constants/designSystem';

const { colors } = designSystem;

export type EventType = 'vaccination' | 'treatment' | 'vet' | 'grooming' | 'walking' | 'other';

export type CalendarEvent = {
  id: string;
  petId?: string;
  petName?: string;
  type: EventType;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  color: string;
  relatedId?: string;
  location?: string;
};

export type EventFilters = {
  petIds?: string[];
  types?: EventType[];
  startDate?: string;
  endDate?: string;
};

function assignColor(index: number): string {
  const palette = [
    getColor('primary.500'),
    getColor('status.success.500'),
    getColor('status.warning.500'),
    getColor('status.error.500'),
    getColor('secondary.500'),
    getColor('info.500'),
    getColor('success.500'),
  ];
  return palette[index % palette.length];
}

function computePriority(dueDate?: string): 'low' | 'medium' | 'high' {
  if (!dueDate) return 'low';
  const today = new Date();
  const d = new Date(dueDate);
  const days = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'high';
  if (days <= 7) return 'medium';
  return 'low';
}

export function useEvents(initialFilters?: EventFilters) {
  const { user } = useAuth();
  const { pets, loading: petsLoading } = usePets();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilters>(initialFilters || {});
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const petMap = useMemo(() => {
    const map: Record<string, { name: string; color: string }> = {};
    pets.forEach((p: Pet, idx: number) => {
      map[p.id] = { name: p.name, color: assignColor(idx) };
    });
    return map;
  }, [pets]);

  const effectivePetIds = useMemo(() => {
    if (filters.petIds && filters.petIds.length > 0) return filters.petIds;
    return pets.map((p) => p.id);
  }, [filters.petIds, pets]);

  const withinRange = (dateStr?: string) => {
    if (!dateStr) return true;
    const d = new Date(dateStr);
    if (filters.startDate && new Date(filters.startDate) > d) return false;
    if (filters.endDate && new Date(filters.endDate) < d) return false;
    return true;
  };

  const fetchEvents = useCallback(async () => {
    console.log('🚀 Fetching events...', { user: !!user, petsLoading, filters, effectivePetIds });

    if (!user) {
      console.log('❌ No user, clearing events');
      if (isMountedRef.current) {
        setEvents([]);
        setLoading(false);
      }
      return;
    }
    if (petsLoading) {
      console.log('⏳ Pets still loading');
      return;
    }

    if (effectivePetIds.length === 0) {
      console.log('⚠️ No pets found, skipping event fetch');
      if (isMountedRef.current) {
        setEvents([]);
        setLoading(false);
      }
      return;
    }

    try {
      const types = filters.types;
      const petIds = effectivePetIds;

      const results: CalendarEvent[] = [];

      // 1. Fetch Vaccinations
      if (!types || types.includes('vaccination')) {
        console.log('🔍 Fetching vaccinations for petIds:', petIds);
        const { data: vax, error: vErr } = await (supabase
          .from('vaccinations') as any)
          .select('*')
          .in('pet_id', petIds);

        console.log('📊 Vaccinations result:', { data: vax?.length, error: vErr });

        if (!vErr && vax) {
          (vax as Vaccination[]).forEach((v) => {
            const petInfo = petMap[v.pet_id];
            // if (!petInfo) return; // Don't skip if pet missing
            const date = v.next_due_date || v.date_given;
            if (!withinRange(date)) return;

            results.push({
              id: `vaccination:${v.id}`,
              petId: v.pet_id,
              petName: petInfo?.name || 'Unknown Pet',
              type: 'vaccination',
              title: v.vaccine_name,
              dueDate: date,
              priority: computePriority(v.next_due_date || undefined),
              notes: v.notes || undefined,
              color: petInfo?.color || colors.text.secondary,
              relatedId: v.id,
            });
          });
        }
      }

      // 2. Fetch Treatments
      if (!types || types.includes('treatment')) {
        const { data: tr, error: tErr } = await (supabase
          .from('treatments') as any)
          .select('*')
          .in('pet_id', petIds)
          .eq('is_active', true);

        if (!tErr && tr) {
          (tr as Treatment[]).forEach((t) => {
            const petInfo = petMap[t.pet_id];
            // if (!petInfo) return;

            // Start Date
            if (t.start_date && withinRange(t.start_date)) {
              results.push({
                id: `treatment-start:${t.id}`,
                petId: t.pet_id,
                petName: petInfo?.name || 'Unknown Pet',
                type: 'treatment',
                title: `${t.treatment_name} (Start)`,
                dueDate: t.start_date,
                priority: computePriority(t.start_date),
                notes: t.notes || undefined,
                color: petInfo?.color || colors.text.secondary,
                relatedId: t.id,
              });
            }

            // End Date
            if (t.end_date && withinRange(t.end_date)) {
              results.push({
                id: `treatment-end:${t.id}`,
                petId: t.pet_id,
                petName: petInfo?.name || 'Unknown Pet',
                type: 'treatment',
                title: `${t.treatment_name} (End)`,
                dueDate: t.end_date,
                priority: computePriority(t.end_date),
                notes: t.notes || undefined,
                color: petInfo?.color || colors.text.secondary,
                relatedId: t.id,
              });
            }
          });
        }
      }

      // 3. Fetch Medical Visits
      if (!types || types.includes('vet')) {
        const { data: visits, error: vErr } = await (supabase
          .from('medical_visits') as any)
          .select('*')
          .in('pet_id', petIds);

        if (!vErr && visits) {
          (visits as MedicalVisit[]).forEach((v) => {
            const petInfo = petMap[v.pet_id];
            // if (!petInfo) return;
            if (!withinRange(v.date)) return;

            results.push({
              id: `visit:${v.id}`,
              petId: v.pet_id,
              petName: petInfo?.name || 'Unknown Pet',
              type: 'vet',
              title: v.reason || 'Vet Visit',
              dueDate: v.date || '',
              priority: computePriority(v.date),
              notes: v.notes || undefined,
              color: petInfo?.color || colors.text.secondary,
              relatedId: v.id,
              location: v.clinic_name || undefined,
            });
          });
        }
      }

      // 4. Fetch Calendar Events (Vet, Grooming, etc.)
      // We filter by pet_id in code if it's specific, but events might be general.
      // Ideally query filters by pet_id OR user_id (global).
      // For now, let's fetch all user events and filter in memory for simplicity/flexibility.
      const { data: dbEvents, error: eErr } = await (supabase
        .from('events') as any)
        .select('*')
        .eq('user_id', user.id);

      if (!eErr && dbEvents) {
        (dbEvents as DbEvent[]).forEach((e) => {
          // If event has a pet_id, check if it's in our filtered list
          // But now we want to be permissive. Wait, filters.petIds *should* filter if set.
          // logic: IF filters.petIds is set, and event.petId is NOT in it, skip.
          if (filters.petIds && filters.petIds.length > 0 && e.pet_id && !filters.petIds.includes(e.pet_id)) return;
          // But if filters not set (or all effective), we accept all properly fetched by user_id

          // Check type filter
          if (types && !types.includes(e.type as EventType)) return;

          const date = e.start_time; // ISO timestamp
          if (!withinRange(date)) return;

          const petInfo = e.pet_id ? petMap[e.pet_id] : null;

          results.push({
            id: `event:${e.id}`,
            petId: e.pet_id || undefined,
            petName: petInfo?.name,
            type: e.type as EventType,
            title: e.title,
            dueDate: date,
            priority: computePriority(date),
            notes: e.description || undefined,
            color: petInfo?.color || colors.text.secondary,
            relatedId: e.id,
            location: e.location || undefined,
          });
        });
      }

      // 4. Generate Birthday Events
      if (!types || types.includes('other')) {
        pets.forEach((pet) => {
          if (!pet.date_of_birth) return;
          if (petIds.length > 0 && !petIds.includes(pet.id)) return;

          const dob = new Date(pet.date_of_birth);
          const currentYear = new Date().getFullYear();
          // Generate for previous, current, and next year to cover most view ranges
          const yearsToCheck = [currentYear - 1, currentYear, currentYear + 1];

          yearsToCheck.forEach((year) => {
            // Handle leap years for Feb 29
            let month = dob.getMonth();
            let date = dob.getDate();

            // Simple check: if born Feb 29 and target year not leap, use Feb 28 or Mar 1
            // JS Date auto-corrects overflow (e.g. Feb 29 -> Mar 1 on non-leap years)
            const bdayDate = new Date(year, month, date);
            const bdayStr = bdayDate.toISOString().split('T')[0];

            if (withinRange(bdayStr)) {
              const age = year - dob.getFullYear();
              if (age < 0) return; // Not born yet

              results.push({
                id: `birthday:${pet.id}:${year}`,
                petId: pet.id,
                petName: pet.name,
                type: 'other',
                title: `${pet.name}'s Birthday`,
                dueDate: bdayStr,
                priority: 'high',
                notes: `Turns ${age} years old!`,
                color: petMap[pet.id]?.color || colors.primary[500],
              });
            }
          });
        });
      }

      results.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      console.log('✅ Events fetched successfully:', results.length);
      if (isMountedRef.current) setEvents(results);
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      if (isMountedRef.current) setEvents([]);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [user, petsLoading, petMap, effectivePetIds, filters.types, filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    filters,
    setFilters,
    refreshEvents: fetchEvents,
  };
}
