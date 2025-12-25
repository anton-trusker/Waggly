import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Pet } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPets = useCallback(async () => {
    if (!user) {
      setPets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pets:', error);
      } else {
        setPets(data || []);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const addPet = async (petData: Partial<Pet>) => {
    if (!user) return { error: { message: 'No user logged in' } };

    try {
      const { data, error } = await (supabase
        .from('pets') as any)
        .insert([{ ...petData, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error adding pet:', error);
        return { error, data: null };
      }

      await fetchPets();
      return { error: null, data: data as Pet };
    } catch (error) {
      console.error('Error adding pet:', error);
      return { error, data: null };
    }
  };

  const updatePet = async (petId: string, petData: Partial<Pet>) => {
    try {
      const { error } = await (supabase
        .from('pets') as any)
        .update(petData)
        .eq('id', petId);

      if (error) {
        console.error('Error updating pet:', error);
        return { error };
      }

      await fetchPets();
      return { error: null };
    } catch (error) {
      console.error('Error updating pet:', error);
      return { error };
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) {
        console.error('Error deleting pet:', error);
        return { error };
      }

      await fetchPets();
      return { error: null };
    } catch (error) {
      console.error('Error deleting pet:', error);
      return { error };
    }
  };

  return {
    pets,
    loading,
    addPet,
    updatePet,
    deletePet,
    refreshPets: fetchPets,
  };
}
