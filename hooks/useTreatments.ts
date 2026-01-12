
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Treatment } from '@/types';
import { usePostHog } from 'posthog-react-native';
import { useAuth } from '@/contexts/AuthContext';

export function useTreatments(petId: string | null = null) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const posthog = usePostHog();

  const fetchTreatments = useCallback(async () => {
    if (!user) {
      setTreatments([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from('medications').select('*');

      if (petId) {
        query = query.eq('pet_id', petId);
      } else {
        // If no petId, fetch for all of user's pets
        const { data: userPets } = await supabase
          .from('pets')
          .select('id')
          .eq('user_id', user.id);

        if (userPets && userPets.length > 0) {
          query = query.in('pet_id', userPets.map(p => p.id));
        } else {
          setTreatments([]);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query.order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching treatments:', error);
      } else {
        const mappedData = (data || []).map((m: any) => ({
          ...m,
          treatment_name: m.name, // Map name -> treatment_name
          is_active: m.is_ongoing, // Map is_ongoing -> is_active
          category: 'acute' // Default category as it's missing in V2
        }));
        setTreatments(mappedData);
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

    const payload = {
      pet_id: petId,
      name: treatmentData.treatment_name,
      dosage: treatmentData.dosage,
      frequency: treatmentData.frequency,
      start_date: treatmentData.start_date,
      end_date: treatmentData.end_date,
      instructions: treatmentData.notes, // Map notes -> instructions
      is_ongoing: true, // Default active
    };

    try {
      const { data, error } = await (supabase
        .from('medications') as any)
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Error adding treatment:', error);
        return { error };
      }

      const mapped = {
        ...data,
        treatment_name: data.name,
        is_active: data.is_ongoing,
        category: 'acute'
      };

      posthog.capture('treatment_created', {
        pet_id: petId,
        treatment_name: data.name,
      });

      // OPTIMISTIC UPDATE: Immediately add to local state
      setTreatments(prev => [mapped, ...prev]);

      return { data: mapped, error: null };
    } catch (error) {
      console.error('Error adding treatment:', error);
      return { error };
    }
  };

  const updateTreatment = async (treatmentId: string, treatmentData: Partial<Treatment>) => {
    try {
      // Map update fields
      const updates: any = {};
      if (treatmentData.treatment_name) updates.name = treatmentData.treatment_name;
      if (treatmentData.dosage) updates.dosage = treatmentData.dosage;
      if (treatmentData.frequency) updates.frequency = treatmentData.frequency;
      if (treatmentData.start_date) updates.start_date = treatmentData.start_date;
      if (treatmentData.end_date) updates.end_date = treatmentData.end_date;
      if (treatmentData.notes) updates.instructions = treatmentData.notes;
      if (treatmentData.is_active !== undefined) updates.is_ongoing = treatmentData.is_active;

      // OPTIMISTIC UPDATE: Update local state immediately
      setTreatments(prev =>
        prev.map(t => t.id === treatmentId ? { ...t, ...treatmentData } : t)
      );

      const { data, error } = await (supabase
        .from('medications') as any)
        .update(updates)
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

      const mapped = {
        ...data,
        treatment_name: data.name,
        is_active: data.is_ongoing,
        category: 'acute'
      };

      return { data: mapped, error: null };
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
        .from('medications')
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
