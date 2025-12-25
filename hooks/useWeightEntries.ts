
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/db';

type WeightEntry = Database['public']['Tables']['weight_entries']['Row'];
type WeightEntryInsert = Database['public']['Tables']['weight_entries']['Insert'];
type WeightEntryUpdate = Database['public']['Tables']['weight_entries']['Update'];

type WeightEntryInsertPayload = {
  weight: number;
  date: string;
  notes?: string | null;
  pet_id: string;
  created_at?: string;
};

type WeightEntryUpdatePayload = {
  weight?: number;
  date?: string;
  notes?: string | null;
};

export function useWeightEntries(petId: string | null) {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWeightEntries = useCallback(async () => {
    if (!petId) {
      setWeightEntries([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('pet_id', petId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching weight entries:', error);
      } else {
        setWeightEntries(data || []);
      }
    } catch (error) {
      console.error('Error fetching weight entries:', error);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchWeightEntries();
  }, [fetchWeightEntries]);

  const addWeightEntry = async (weightData: Omit<WeightEntryInsert, 'id' | 'pet_id' | 'created_at'>) => {
    if (!petId) return { error: 'No pet selected' };

    try {
      const payload: WeightEntryInsert = {
        weight: weightData.weight,
        date: weightData.date,
        notes: weightData.notes,
        pet_id: petId,
        created_at: new Date().toISOString(),
      };
      const { data, error } = await (supabase
        .from('weight_entries') as any)
        .insert([payload as WeightEntryInsert])
        .select()
        .single();

      if (error) {
        console.error('Error adding weight entry:', error);
        return { error };
      }

      await fetchWeightEntries();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding weight entry:', error);
      return { error: error as Error };
    }
  };

  const updateWeightEntry = async (entryId: string, weightData: Partial<WeightEntryUpdate>) => {
    try {
      const payload: WeightEntryUpdate = weightData;
      const { data, error } = await (supabase
        .from('weight_entries') as any)
        .update(payload as WeightEntryUpdate)
        .eq('id', entryId)
        .select()
        .single();

      if (error) {
        console.error('Error updating weight entry:', error);
        return { error };
      }

      await fetchWeightEntries();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating weight entry:', error);
      return { error: error as Error };
    }
  };

  const deleteWeightEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', entryId);

      if (error) {
        console.error('Error deleting weight entry:', error);
        return { error };
      }

      await fetchWeightEntries();
      return { error: null };
    } catch (error) {
      console.error('Error deleting weight entry:', error);
      return { error };
    }
  };

  return {
    weightEntries,
    loading,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    refreshWeightEntries: fetchWeightEntries,
  };
}
