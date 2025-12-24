import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MedicalVisit } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useMedicalVisits(petId: string) {
  const [visits, setVisits] = useState<MedicalVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchVisits = useCallback(async () => {
    if (!user || !petId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_visits')
        .select('*')
        .eq('pet_id', petId)
        .order('date', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error fetching medical visits:', error);
    } finally {
      setLoading(false);
    }
  }, [user, petId]);

  const addVisit = async (visit: Partial<MedicalVisit>) => {
    if (!user) return { error: { message: 'No user logged in' } };
    try {
      const { error } = await supabase
        .from('medical_visits')
        .insert({ ...visit, pet_id: petId });

      if (error) throw error;
      await fetchVisits();
      return { error: null };
    } catch (error) {
      console.error('Error adding medical visit:', error);
      return { error };
    }
  };

  const deleteVisit = async (visitId: string) => {
    try {
      const { error } = await supabase
        .from('medical_visits')
        .delete()
        .eq('id', visitId);

      if (error) throw error;
      await fetchVisits();
      return { error: null };
    } catch (error) {
      console.error('Error deleting medical visit:', error);
      return { error };
    }
  };

  return {
    visits,
    loading,
    fetchVisits,
    addVisit,
    deleteVisit,
  };
}
