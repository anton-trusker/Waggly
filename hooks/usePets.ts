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
      // 1. Fetch owned pets
      const { data: ownedPets, error: ownedError } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ownedError) throw ownedError;

      // 2. Fetch co-owned pets
      const { data: coOwnedData, error: coOwnedError } = await supabase
        .from('co_owners')
        .select(`
          role,
          permissions,
          pets:pets(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted'); // Only accepted invites

      if (coOwnedError) throw coOwnedError;

      // 3. Merge and format
      const myPets = (ownedPets || []).map(p => ({ ...p, role: 'owner' })) as Pet[];

      const sharedPets = (coOwnedData || [])
        .filter((item: any) => item.pets) // Ensure pet data exists
        .map((item: any) => {
          const petData = item.pets; // item.pets is the Row object
          return {
            ...petData,
            role: item.role || 'viewer', // 'co-owner' or 'viewer'
            permissions: item.permissions
          };
        }) as Pet[];

      // Combine and remove duplicates (safety check)
      const allPets = [...myPets, ...sharedPets];
      // Optional: Logic to dedup if you invite yourself (edge case)

      setPets(allPets);
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
