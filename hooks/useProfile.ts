import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (error) {
      setProfile(null);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const upsertProfile = async (values: Partial<Profile>) => {
    if (!user) return { error: { message: 'No user' } };

    // Check if profile exists
    const existing = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing.error && existing.error.code !== 'PGRST116') {
      return { error: existing.error };
    }

    if (existing.data) {
      const { error } = await (supabase
        .from('profiles') as any)
        .update(values)
        .eq('user_id', user.id);

      if (!error) {
        await fetchProfile();
      }
      return { error };
    } else {
      const { error } = await (supabase
        .from('profiles') as any)
        .insert([{
          id: user.id, // Explicitly set ID to match user.id, though schema has it as separate field that defaults? 
          // Schema: id UUID PRIMARY KEY REFERENCES auth.users(id)
          // Actually, usually profile.id IS user.id. 
          // Let's check schema: id UUID PRIMARY KEY REFERENCES auth.users(id)
          // It doesn't have DEFAULT gen_random_uuid(). So we MUST provide it.
          user_id: user.id,
          ...values
        }]);

      if (!error) {
        await fetchProfile();
      }
      return { error };
    }
  };

  return { profile, loading, refreshProfile: fetchProfile, upsertProfile };
}
