import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
// import { Database } from '@/types/db'; // Types might need update, defining local interface for now

interface Breed {
  id: string;
  name: string;
  // Common fields
}

export function useBreeds(species?: 'dog' | 'cat' | 'other', queryTerm?: string) {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBreeds() {
      // If species is 'other' or undefined, we might not have a specific table or strategy yet.
      // Current requirement: populate cat_breeds and dog_breeds.
      if (!species || species === 'other') {
        setBreeds([]);
        setLoading(false);
        return;
      }

      const tableName = species === 'dog' ? 'dog_breeds' : 'cat_breeds';

      try {
        setLoading(true);
        let query = supabase
          .from(tableName)
          .select('id, name') // standardized fields
          .order('name');

        if (queryTerm) {
          query = query.ilike('name', `%${queryTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setBreeds(data || []);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching breeds:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBreeds();
  }, [species, queryTerm]);

  return {
    breeds,
    loading,
    error,
    hasMore: false,
    loadMore: () => { }
  };
}
