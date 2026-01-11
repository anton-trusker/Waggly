import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types';
import { usePostHog } from 'posthog-react-native';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const posthog = usePostHog();

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
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
      .eq('id', user.id)
      .maybeSingle();

    if (existing.error && existing.error.code !== 'PGRST116') {
      return { error: existing.error };
    }

    if (existing.data) {
      const { error } = await (supabase
        .from('profiles') as any)
        .update(values)
        .eq('id', user.id);

      if (!error) {
        posthog.capture('user_profile_updated', {
          updated_fields: Object.keys(values),
        });
        await fetchProfile();
      }
      return { error };
    } else {
      const { error } = await (supabase
        .from('profiles') as any)
        .insert([{
          id: user.id,
          user_id: user.id,
          ...values
        }]);

      if (!error) {
        posthog.capture('user_profile_created', {
          full_name: values.full_name,
        });
        await fetchProfile();
      }
      return { error };
    }
  };

  return { profile, loading, refreshProfile: fetchProfile, upsertProfile };
}
