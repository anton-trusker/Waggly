
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Treatment } from '@/types';
import { usePostHog } from 'posthog-react-native';

export function useTreatments(petId: string | null) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const posthog = usePostHog();

  const fetchTreatments = useCallback(async () => {
    if (!petId) {
      setTreatments([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('pet_id', petId)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching treatments:', error);
      } else {
        setTreatments(data || []);
      }
    } catch (error) {
      console.error('Error fetching treatments:', error);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  const addTreatment = async (treatmentData: Partial<Treatment>) => {
    if (!petId) return { error: 'No pet selected' };

    try {
      const { data, error } = await (supabase
        .from('treatments') as any)
        .insert([{ ...treatmentData, pet_id: petId, is_active: true }])
        .select()
        .single();

      if (error) {
        console.error('Error adding treatment:', error);
        return { error };
      }

      posthog.capture('treatment_created', {
        pet_id: petId,
        treatment_name: data.treatment_name,
      });

      // OPTIMISTIC UPDATE: Immediately add to local state
      setTreatments(prev => [data, ...prev]);

      return { data, error: null };
    } catch (error) {
      console.error('Error adding treatment:', error);
      return { error };
    }
  };

  const updateTreatment = async (treatmentId: string, treatmentData: Partial<Treatment>) => {
    try {
      // OPTIMISTIC UPDATE: Update local state immediately
      setTreatments(prev =>
        prev.map(t => t.id === treatmentId ? { ...t, ...treatmentData } : t)
      );

      const { data, error } = await (supabase
        .from('treatments') as any)
        .update(treatmentData)
        .eq('id', treatmentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating treatment:', error);
        // Revert on error
        await fetchTreatments();
        return { error };
      }

      posthog.capture('treatment_updated', {
        pet_id: petId,
        treatment_id: treatmentId,
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating treatment:', error);
      await fetchTreatments();
      return { error };
    }
  };

  const deleteTreatment = async (treatmentId: string) => {
    try {
      // OPTIMISTIC UPDATE: Remove from local state immediately
      setTreatments(prev => prev.filter(t => t.id !== treatmentId));

      const { error } = await supabase
        .from('treatments')
        .delete()
        .eq('id', treatmentId);

      if (error) {
        console.error('Error deleting treatment:', error);
        // Revert on error
        await fetchTreatments();
        return { error };
      }

      posthog.capture('treatment_deleted', {
        pet_id: petId,
        treatment_id: treatmentId,
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting treatment:', error);
      await fetchTreatments();
      return { error };
    }
  };

  return {
    treatments,
    loading,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    refreshTreatments: fetchTreatments,
  };
}
