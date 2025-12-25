import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Pet, CoOwner, CoOwnerPermissions } from '@/types';
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

      // 2. Fetch co-owner records (invitations accepted by me)
      const { data: coOwnerRecords, error: coOwnedError } = await supabase
        .from('co_owners')
        .select('*')
        .eq('co_owner_id', user.id)
        .eq('status', 'accepted');

      if (coOwnedError) throw coOwnedError;

      let sharedPets: Pet[] = [];

      if (coOwnerRecords && coOwnerRecords.length > 0) {
        const records = coOwnerRecords as CoOwner[];
        // Get all unique main_owner_ids
        const mainOwnerIds = [...new Set(records.map(r => r.main_owner_id))];

        if (mainOwnerIds.length > 0) {
          // Fetch all pets belonging to these main owners
          const { data: potentialSharedPets, error: sharedError } = await supabase
            .from('pets')
            .select('*')
            .in('user_id', mainOwnerIds);

          if (sharedError) throw sharedError;

          // Filter based on permissions
          sharedPets = (potentialSharedPets || []).filter((pet: any) => {
            // Find the co-owner record linking me to this pet's owner
            const relationship = records.find(r => r.main_owner_id === pet.user_id);
            if (!relationship) return false;

            const permissions = relationship.permissions as unknown as CoOwnerPermissions;
            if (!permissions) return false;

            if (permissions.scope === 'all') return true;
            if (permissions.scope === 'selected' && Array.isArray(permissions.pet_ids)) {
              return permissions.pet_ids.includes(pet.id);
            }
            return false;
          }).map((pet: any) => {
            const relationship = records.find(r => r.main_owner_id === pet.user_id);
            return {
              ...pet,
              role: relationship?.role || 'viewer',
              permissions: relationship?.permissions,
            };
          });
        }
      }

      // 3. Merge and format
      const myPets = (ownedPets || []).map(p => ({ ...p, role: 'owner' })) as Pet[];

      // Combine and deduplicate
      const allPetsMap = new Map();
      myPets.forEach(p => allPetsMap.set(p.id, p));
      sharedPets.forEach(p => allPetsMap.set(p.id, p));

      setPets(Array.from(allPetsMap.values()));
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
