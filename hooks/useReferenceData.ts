import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface RefVaccine {
  id: string;
  species: string;
  vaccine_name: string;
  abbreviation: string | null;
  vaccine_type: string | null; // 'core' or 'non-core'
  typical_schedule: string | null;
  booster_interval: string | null; // e.g., '1-3 years', '1 year'
  description: string | null;
}

export interface RefMedication {
  id: string;
  medication_name: string;
  brand_names: string[] | null;
  active_ingredient: string | null;
  category: string | null;
  typical_dosage_range: string | null;
  common_uses: string | null;
  side_effects: string[] | null;
  contraindications: string | null;
}

export interface RefSymptom {
  id: string;
  symptom_name: string;
  category: string | null;
  severity_indicator: boolean;
}

export interface RefAllergen {
  id: string;
  allergen_name: string;
  allergen_type: string | null;
  common_reactions: string[] | null;
}

export function useVaccines(species?: string) {
  const [vaccines, setVaccines] = useState<RefVaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVaccines();
  }, [species]);

  const fetchVaccines = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('ref_vaccines')
        .select('*')
        .order('vaccine_name');

      if (species) {
        // Normalize species - capitalize first letter
        const normalizedSpecies = species.charAt(0).toUpperCase() + species.slice(1).toLowerCase();
        query = query.eq('species', normalizedSpecies);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setVaccines((data as RefVaccine[]) || []);
    } catch (err: any) {
      console.error('Error fetching vaccines:', err);
      setError(err.message);
      setVaccines([]);
    } finally {
      setLoading(false);
    }
  };

  return { vaccines, loading, error, refetch: fetchVaccines };
}

export function useMedications() {
  const [medications, setMedications] = useState<RefMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ref_medications')
        .select('*')
        .order('medication_name');

      if (fetchError) throw fetchError;
      setMedications((data as RefMedication[]) || []);
    } catch (err: any) {
      console.error('Error fetching medications:', err);
      setError(err.message);
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  return { medications, loading, error, refetch: fetchMedications };
}

export function useSymptoms() {
  const [symptoms, setSymptoms] = useState<RefSymptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ref_symptoms')
        .select('*')
        .order('symptom_name');

      if (fetchError) throw fetchError;
      setSymptoms((data as RefSymptom[]) || []);
    } catch (err: any) {
      console.error('Error fetching symptoms:', err);
      setError(err.message);
      setSymptoms([]);
    } finally {
      setLoading(false);
    }
  };

  return { symptoms, loading, error, refetch: fetchSymptoms };
}

export function useAllergens() {
  const [allergens, setAllergens] = useState<RefAllergen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllergens();
  }, []);

  const fetchAllergens = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ref_allergens')
        .select('*')
        .order('allergen_name');

      if (fetchError) throw fetchError;
      setAllergens((data as RefAllergen[]) || []);
    } catch (err: any) {
      console.error('Error fetching allergens:', err);
      setError(err.message);
      setAllergens([]);
    } finally {
      setLoading(false);
    }
  };

  return { allergens, loading, error, refetch: fetchAllergens };
}

// Utility to parse booster interval and calculate next due date
export function calculateNextDueDate(administeredDate: string, boosterInterval: string | null): string | null {
  if (!boosterInterval || !administeredDate) return null;

  try {
    const date = new Date(administeredDate);

    // Parse interval like "1 year", "1-3 years", "6-12 months"
    const match = boosterInterval.match(/(\d+)(?:-(\d+))?\s*(year|month|week|day)/i);
    if (!match) return null;

    const minValue = parseInt(match[1]);
    const unit = match[3].toLowerCase();

    switch (unit) {
      case 'year':
      case 'years':
        date.setFullYear(date.getFullYear() + minValue);
        break;
      case 'month':
      case 'months':
        date.setMonth(date.getMonth() + minValue);
        break;
      case 'week':
      case 'weeks':
        date.setDate(date.getDate() + (minValue * 7));
        break;
      case 'day':
      case 'days':
        date.setDate(date.getDate() + minValue);
        break;
    }

    return date.toISOString().split('T')[0];
  } catch (err) {
    console.error('Error calculating next due date:', err);
    return null;
  }
}
