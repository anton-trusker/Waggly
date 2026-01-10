import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/db';
import { usePostHog } from 'posthog-react-native';

type Vaccination = Database['public']['Tables']['vaccinations']['Row'];
type VaccinationInsert = Database['public']['Tables']['vaccinations']['Insert'];
type VaccinationUpdate = Database['public']['Tables']['vaccinations']['Update'];

export type VaccinationStatus = 'up-to-date' | 'due-soon' | 'overdue';

export function useVaccinations(petId: string | null) {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const posthog = usePostHog();

  const fetchVaccinations = useCallback(async () => {
    if (!petId) {
      setVaccinations([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('pet_id', petId)
        .order('date_given', { ascending: false });

      if (error) {
        console.error('Error fetching vaccinations:', error);
      } else {
        setVaccinations(data || []);
      }
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchVaccinations();
  }, [fetchVaccinations]);

  const addVaccination = async (vaccinationData: Omit<VaccinationInsert, 'id' | 'pet_id' | 'created_at' | 'updated_at'>) => {
    if (!petId) return { error: 'No pet selected' };

    try {
      const { data, error } = await (supabase
        .from('vaccinations') as any)
        .insert({
          ...vaccinationData,
          pet_id: petId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding vaccination:', error);
        return { error };
      }

      posthog.capture('vaccination_created', {
        pet_id: petId,
        vaccine_name: data.vaccine_name,
      });

      // OPTIMISTIC UPDATE: Immediately add to local state
      setVaccinations(prev => [data, ...prev]);

      return { data, error: null };
    } catch (error) {
      console.error('Error adding vaccination:', error);
      return { error: error as Error };
    }
  };

  const updateVaccination = async (vaccinationId: string, vaccinationData: Partial<VaccinationUpdate>) => {
    try {
      // OPTIMISTIC UPDATE: Update local state immediately
      setVaccinations(prev =>
        prev.map(v => v.id === vaccinationId ? { ...v, ...vaccinationData } : v)
      );

      const { data, error } = await (supabase
        .from('vaccinations') as any)
        .update({
          ...vaccinationData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vaccinationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating vaccination:', error);
        // Revert on error
        await fetchVaccinations();
        return { error };
      }

      posthog.capture('vaccination_updated', {
        pet_id: petId,
        vaccination_id: vaccinationId,
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating vaccination:', error);
      await fetchVaccinations();
      return { error: error as Error };
    }
  };

  const deleteVaccination = async (vaccinationId: string) => {
    try {
      // OPTIMISTIC UPDATE: Remove from local state immediately
      setVaccinations(prev => prev.filter(v => v.id !== vaccinationId));

      const { error } = await supabase
        .from('vaccinations')
        .delete()
        .eq('id', vaccinationId);

      if (error) {
        console.error('Error deleting vaccination:', error);
        // Revert on error
        await fetchVaccinations();
        return { error };
      }

      posthog.capture('vaccination_deleted', {
        pet_id: petId,
        vaccination_id: vaccinationId,
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting vaccination:', error);
      await fetchVaccinations();
      return { error };
    }
  };

  const getVaccinationStatus = (vaccination: Vaccination): VaccinationStatus => {
    if (!vaccination.next_due_date) return 'up-to-date';

    const today = new Date();
    const dueDate = new Date(vaccination.next_due_date);
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 30) return 'due-soon';
    return 'up-to-date';
  };

  return {
    vaccinations,
    loading,
    addVaccination,
    updateVaccination,
    deleteVaccination,
    getVaccinationStatus,
    refreshVaccinations: fetchVaccinations,
  };
}
