
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/db';

type Veterinarian = Database['public']['Tables']['veterinarians']['Row'];
type VeterinarianInsert = Database['public']['Tables']['veterinarians']['Insert'];
type VeterinarianUpdate = Database['public']['Tables']['veterinarians']['Update'];

export function useVeterinarians(petId: string | null) {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVeterinarians = useCallback(async () => {
    if (!petId) {
      setVeterinarians([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('veterinarians')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching veterinarians:', error);
      } else {
        setVeterinarians(data || []);
      }
    } catch (error) {
      console.error('Error fetching veterinarians:', error);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchVeterinarians();
  }, [fetchVeterinarians]);

  const addVeterinarian = async (vetData: Omit<VeterinarianInsert, 'id' | 'pet_id' | 'created_at' | 'updated_at'>) => {
    if (!petId) return { error: 'No pet selected' };

    try {
      const payload: VeterinarianInsert = {
        clinic_name: vetData.clinic_name,
        pet_id: petId,
        vet_name: vetData.vet_name,
        address: vetData.address,
        phone: vetData.phone,
        email: vetData.email,
        website: vetData.website,
        is_primary: vetData.is_primary,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from('veterinarians')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Error adding veterinarian:', error);
        return { error };
      }

      await fetchVeterinarians();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding veterinarian:', error);
      return { error: error as Error };
    }
  };

  const updateVeterinarian = async (vetId: string, vetData: Partial<VeterinarianUpdate>) => {
    try {
      const payload: VeterinarianUpdate = {
        ...vetData,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from('veterinarians')
        .update(payload)
        .eq('id', vetId)
        .select()
        .single();

      if (error) {
        console.error('Error updating veterinarian:', error);
        return { error };
      }

      await fetchVeterinarians();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating veterinarian:', error);
      return { error: error as Error };
    }
  };

  const deleteVeterinarian = async (vetId: string) => {
    try {
      const { error } = await supabase
        .from('veterinarians')
        .delete()
        .eq('id', vetId);

      if (error) {
        console.error('Error deleting veterinarian:', error);
        return { error };
      }

      await fetchVeterinarians();
      return { error: null };
    } catch (error) {
      console.error('Error deleting veterinarian:', error);
      return { error };
    }
  };

  return {
    veterinarians,
    loading,
    addVeterinarian,
    updateVeterinarian,
    deleteVeterinarian,
    refreshVeterinarians: fetchVeterinarians,
  };
}
