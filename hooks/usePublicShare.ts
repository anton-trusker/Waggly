import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type SharePreset = 'BASIC' | 'FULL';

export interface PublicShare {
  id: string;
  token: string;
  pet_id: string;
  created_at: string;
  views: number;
  settings: {
    preset: SharePreset;
  };
}

export interface PublicPetProfile {
  pet: {
    name: string;
    species: string;
    breed: string;
    date_of_birth: string;
    gender: string;
    weight: number;
    photo_url: string;
    chip_id?: string;
  };
  owner: {
    name: string;
  };
  settings: {
    preset: SharePreset;
  };
  details: {
    vaccinations: any[];
    medications: any[];
    visits: any[];
  };
}

export function usePublicShare() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLink = useCallback(async (petId: string, preset: SharePreset) => {
    setLoading(true);
    setError(null);
    try {
      // Generate a unique token (simple implementation, could be better)
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('public_shares')
        .insert({
          pet_id: petId,
          token: token,
          settings: { preset },
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as PublicShare;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeLink = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('public_shares')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveLinks = useCallback(async (petId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('public_shares')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PublicShare[];
    } catch (e: any) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPublicPet = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_public_pet_details', { share_token: token });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);
      
      return data as PublicPetProfile;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateLink,
    revokeLink,
    getActiveLinks,
    getPublicPet,
    loading,
    error
  };
}
