import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Pet, Vaccination, Treatment, MedicalVisit, WeightEntry, Allergy } from '@/types';
import dayjs from 'dayjs';

interface PetHealthSummaryData {
  lastVetVisit?: { date: string; reason: string };
  nextVaccineDue?: { name: string; date: string };
  currentWeight?: { value: string; date: string };
  activeTreatments: number;
  allergies: string[];
}

export function usePetHealthData(petId?: string) {
  const [healthData, setHealthData] = useState<PetHealthSummaryData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = useCallback(async () => {
    if (!petId) {
      setHealthData(undefined);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch Last Vet Visit
      const { data: visits, error: visitsError } = await (supabase
        .from('medical_visits') as any)
        .select('*')
        .eq('pet_id', petId)
        .order('visit_date', { ascending: false }) // Changed date -> visit_date
        .limit(1);

      if (visitsError) throw visitsError;

      const lastVetVisit = visits && visits.length > 0
        ? { date: visits[0].visit_date, reason: visits[0].reason || 'Check-up' } // Changed date -> visit_date
        : undefined;

      // Fetch Next Vaccine Due
      const { data: vaccinations, error: vaxError } = await (supabase
        .from('vaccinations') as any)
        .select('*')
        .eq('pet_id', petId)
        .order('next_due_date', { ascending: true });

      if (vaxError) throw vaxError;

      const nextVaccineDue = vaccinations && vaccinations.length > 0
        ? { name: vaccinations[0].vaccine_name, date: vaccinations[0].next_due_date }
        : undefined;

      // Fetch Current Weight
      const { data: weightEntries, error: weightsError } = await (supabase
        .from('weight_logs') as any) // Changed weight_entries -> weight_logs
        .select('*')
        .eq('pet_id', petId)
        .order('date', { ascending: false })
        .limit(1);

      if (weightsError) throw weightsError;

      const currentWeight = weightEntries && weightEntries.length > 0
        ? { value: `${weightEntries[0].weight} ${weightEntries[0].weight_unit || 'kg'}`, date: weightEntries[0].date }
        : undefined;

      // Fetch Active Treatments
      const { data: treatments, error: treatmentsError } = await (supabase
        .from('medications') as any) // Changed treatments -> medications
        .select('*')
        .eq('pet_id', petId)
        .eq('is_ongoing', true); // Changed is_active -> is_ongoing

      if (treatmentsError) throw treatmentsError;

      const activeTreatments = treatments ? treatments.length : 0;

      // Fetch Allergies
      const { data: allergies, error: allergiesError } = await (supabase
        .from('allergies') as any)
        .select('*')
        .eq('pet_id', petId);

      if (allergiesError) throw allergiesError;

      const allergyNames = allergies ? allergies.map((a: Allergy) => a.allergy_name || a.name || 'Unknown') : []; // Handle schema variations

      setHealthData({
        lastVetVisit,
        nextVaccineDue,
        currentWeight,
        activeTreatments,
        allergies: allergyNames,
      });
    } catch (err: any) {
      console.error('Error fetching pet health data:', err.message);
      setError(err.message);
      setHealthData(undefined);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  return { healthData, loading, error };
}