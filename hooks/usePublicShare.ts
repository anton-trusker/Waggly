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
    avatar_url: string;
    photo_url?: string;
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

  /* 
   * generateLink, revokeLink, getActiveLinks are managed by usePetSharing hook 
   * which uses the correct pet_share_tokens table.
   * This hook is primarily for the public viewer side (fetching pet details).
   */

  const getPublicPet = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_public_pet_details', { share_token: token });

      if (error) throw error;
      if (data && (data as any).error) throw new Error((data as any).error);

      return data as unknown as PublicPetProfile;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getPublicPet,
    loading,
    error
  };
}
