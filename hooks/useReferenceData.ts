import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/db';

type ReferenceVaccination = Database['public']['Tables']['reference_vaccinations']['Row'];
type ReferenceTreatment = Database['public']['Tables']['reference_treatments']['Row'];

export function useReferenceData() {
  const [vaccinations, setVaccinations] = useState<ReferenceVaccination[]>([]);
  const [treatments, setTreatments] = useState<ReferenceTreatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [vResult, tResult] = await Promise.all([
          supabase.from('reference_vaccinations').select('*').order('name'),
          supabase.from('reference_treatments').select('*').order('name')
        ]);

        if (vResult.data) setVaccinations(vResult.data);
        if (tResult.data) setTreatments(tResult.data);
      } catch (e) {
        console.error('Error fetching reference data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { vaccinations, treatments, loading };
}
