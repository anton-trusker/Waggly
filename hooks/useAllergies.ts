
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Allergy } from '@/types';

export function useAllergies(petId: string | null) {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllergies = useCallback(async () => {
    if (!petId) {
      setAllergies([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('allergies')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching allergies:', error);
      } else {
        setAllergies(data || []);
      }
    } catch (error) {
      console.error('Error fetching allergies:', error);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);

  const addAllergy = async (allergyData: Partial<Allergy>) => {
    if (!petId) return { error: 'No pet selected' };

    try {
      const { data, error } = await supabase
        .from('allergies')
        .insert([{ ...allergyData, pet_id: petId }])
        .select()
        .single();

      if (error) {
        console.error('Error adding allergy:', error);
        return { error };
      }

      await fetchAllergies();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding allergy:', error);
      return { error };
    }
  };

  const updateAllergy = async (allergyId: string, allergyData: Partial<Allergy>) => {
    try {
      const { data, error } = await supabase
        .from('allergies')
        .update(allergyData)
        .eq('id', allergyId)
        .select()
        .single();

      if (error) {
        console.error('Error updating allergy:', error);
        return { error };
      }

      await fetchAllergies();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating allergy:', error);
      return { error };
    }
  };

  const deleteAllergy = async (allergyId: string) => {
    try {
      const { error } = await supabase
        .from('allergies')
        .delete()
        .eq('id', allergyId);

      if (error) {
        console.error('Error deleting allergy:', error);
        return { error };
      }

      await fetchAllergies();
      return { error: null };
    } catch (error) {
      console.error('Error deleting allergy:', error);
      return { error };
    }
  };

  return {
    allergies,
    loading,
    addAllergy,
    updateAllergy,
    deleteAllergy,
    refreshAllergies: fetchAllergies,
  };
}
