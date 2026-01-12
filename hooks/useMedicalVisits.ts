import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MedicalVisit } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePostHog } from 'posthog-react-native';

export function useMedicalVisits(petId: string | null = null) {
  const [visits, setVisits] = useState<MedicalVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const posthog = usePostHog();

  const fetchVisits = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase.from('medical_visits').select('*');

      if (petId) {
        query = query.eq('pet_id', petId);
      } else {
        const { data: userPets } = await supabase
          .from('pets')
          .select('id')
          .eq('user_id', user.id);

        if (userPets && userPets.length > 0) {
          query = query.in('pet_id', userPets.map(p => p.id));
        } else {
          setVisits([]);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error fetching medical visits:', error);
    } finally {
      setLoading(false);
    }
  }, [user, petId]);

  const addVisit = async (visit: Partial<MedicalVisit>) => {
    if (!user) return { error: { message: 'No user logged in' } };
    try {
      const { data, error } = await (supabase
        .from('medical_visits') as any)
        .insert({ ...visit, pet_id: petId })
        .select()
        .single();

      if (error) throw error;

      posthog.capture('medical_visit_created', {
        pet_id: petId,
        visit_type: data.visit_type,
        clinic_name: data.clinic_name,
      });

      await fetchVisits();
      return { error: null };
    } catch (error) {
      console.error('Error adding medical visit:', error);
      return { error };
    }
  };

  const deleteVisit = async (visitId: string) => {
    try {
      const { error } = await supabase
        .from('medical_visits')
        .delete()
        .eq('id', visitId);

      if (error) throw error;

      posthog.capture('medical_visit_deleted', {
        pet_id: petId,
        visit_id: visitId,
      });

      await fetchVisits();
      return { error: null };
    } catch (error) {
      console.error('Error deleting medical visit:', error);
      return { error };
    }
  };

  return {
    visits,
    loading,
    fetchVisits,
    addVisit,
    deleteVisit,
  };
}
