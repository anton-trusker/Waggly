import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Allergy } from '@/types';
import { usePostHog } from 'posthog-react-native';

// Helper to normalize allergy data from potential schema variations
const normalizeAllergy = (data: any): Allergy => {
  return {
    ...data,
    // Ensure consistent access to fields regardless of what DB returns
    allergen: data.allergen_name || data.allergen || '',
    type: data.allergy_type || data.type || 'environment',
    severity: data.severity_level || data.severity || 'moderate',
    severity_level: data.severity_level || data.severity || 'moderate', // Ensure this exists
    reaction_description: data.reaction_description || '',
    notes: data.notes || '',
    allergy_type: data.allergy_type || data.type || 'environment', // Ensure this exists
    allergen_name: data.allergen_name || data.allergen || '', // Ensure this exists
  };
};

export function useAllergies(petId: string | null) {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(true);
  const posthog = usePostHog();

  const fetchAllergies = useCallback(async () => {
    if (!petId) {
      setAllergies([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('allergies')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching allergies:', error);
      } else {
        // Normalize the data before setting state
        const normalizedData = (data || []).map(normalizeAllergy);
        setAllergies(normalizedData);
      }
    } catch (error) {
      console.error('Error fetching allergies:', error);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);

  const addAllergy = async (allergyData: Partial<Allergy>) => {
    if (!petId) return { error: { message: 'No pet selected' } };

    try {
      // STRICT Payload: Only use columns we know exist.
      // Based on widget success: 'allergen' and 'type' exist.
      // Based on user feedback: 'severity_level' is correct.
      // 'allergen_name' and 'allergy_type' likely do not exist and cause INSERT errors.
      const payload = {
        pet_id: petId,
        allergen: allergyData.allergen || allergyData.allergen_name || allergyData.name,
        type: allergyData.type || allergyData.allergy_type,
        severity_level: allergyData.severity_level || allergyData.severity,
        reaction_description: allergyData.reaction_description || allergyData.reaction,
        notes: allergyData.notes,
      };

      // Remove undefined keys
      Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);

      console.log('Adding allergy payload:', payload);

      const { data, error } = await (supabase
        .from('allergies') as any)
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Error adding allergy:', error);
        return { error };
      }

      posthog.capture('allergy_created', {
        pet_id: petId,
        allergen: data.allergen,
        type: data.type,
      });

      await fetchAllergies();
      return { data: normalizeAllergy(data), error: null };
    } catch (error: any) {
      console.error('Error adding allergy:', error);
      return { error: { message: error.message || 'Unknown error' } };
    }
  };

  const updateAllergy = async (allergyId: string, allergyData: Partial<Allergy>) => {
    try {
      // STRICT Payload: Do not send pet_id. Do not send ghost columns.
      const payload = {
        allergen: allergyData.allergen || allergyData.allergen_name || allergyData.name,
        type: allergyData.type || allergyData.allergy_type,
        severity_level: allergyData.severity_level || allergyData.severity,
        reaction_description: allergyData.reaction_description || allergyData.reaction,
        notes: allergyData.notes,
      };

      // Remove undefined keys
      Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);

      console.log('Updating allergy payload:', payload);

      const { data, error } = await (supabase
        .from('allergies') as any)
        .update(payload)
        .eq('id', allergyId)
        .select()
        .single();

      if (error) {
        console.error('Error updating allergy:', error);
        return { error };
      }

      await fetchAllergies();
      return { data: normalizeAllergy(data), error: null };
    } catch (error: any) {
      console.error('Error updating allergy:', error);
      return { error: { message: error.message || 'Unknown error' } };
    }
  };

  const deleteAllergy = async (allergyId: string) => {
    try {
      const { error } = await supabase
        .from('allergies')
        .delete()
        .eq('id', allergyId);

      if (error) {
        console.error('Error deleting allergy:', error);
        return { error };
      }

      await fetchAllergies();
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting allergy:', error);
      return { error: { message: error.message || 'Unknown error' } };
    }
  };

  return {
    allergies,
    loading,
    addAllergy,
    updateAllergy,
    deleteAllergy,
    refreshAllergies: fetchAllergies,
  };
}
