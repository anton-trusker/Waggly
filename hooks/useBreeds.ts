import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/db';

type Breed = Database['public']['Tables']['reference_breeds']['Row'];

export function useBreeds(species?: 'dog' | 'cat' | 'other', queryTerm?: string) {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBreeds() {
      try {
        setLoading(true);
        let query = supabase
          .from('reference_breeds')
          .select('*')
          .order('name');

        if (species && species !== 'other') {
          query = query.eq('species', species);
        }
        
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
    loadMore: () => {} 
  };
}
