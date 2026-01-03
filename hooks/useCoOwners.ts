import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/db';
import { usePostHog } from 'posthog-react-native';

type CoOwnerRow = Database['public']['Tables']['co_owners']['Row'];
type CoOwnerInsert = Database['public']['Tables']['co_owners']['Insert'];
type CoOwnerUpdate = Database['public']['Tables']['co_owners']['Update'];

export function useCoOwners() {
    const [coOwners, setCoOwners] = useState<CoOwnerRow[]>([]);
    const [loading, setLoading] = useState(false);
    const posthog = usePostHog();

    const fetchCoOwners = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('co_owners')
                .select('*')
                .eq('main_owner_id', user.id);

            if (error) throw error;
            setCoOwners(data || []);
        } catch (error) {
            console.error('Error fetching co-owners:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const inviteCoOwner = async (email: string, role: string = 'viewer', permissions: any = {}, petName?: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { error: { message: 'Not authenticated' } };

            // 1. Insert into co_owners table
            const { data, error } = await (supabase
                .from('co_owners') as any)
                .insert({
                    main_owner_id: user.id,
                    co_owner_email: email,
                    status: 'pending',
                    role,
                    permissions,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            posthog.capture('co_owner_invite_sent', {
                co_owner_email: email,
                role,
                pet_name: petName,
            });

            // 2. Call Edge Function to send email
            if (petName) {
                const { error: fnError } = await supabase.functions.invoke('send-invite', {
                    body: {
                        email,
                        role,
                        petName,
                        inviteLink: `${window.location.origin}/auth/join?invite=${data.id}` // Placeholder link
                    }
                });
                if (fnError) console.error('Failed to send invite email:', fnError);
            }

            await fetchCoOwners();
            return { data, error: null };
        } catch (error) {
            console.error('Error inviting co-owner:', error);
            return { error };
        }
    };

    const updateCoOwner = async (id: string, updates: Partial<CoOwnerUpdate>) => {
        try {
            const { data, error } = await (supabase
                .from('co_owners') as any)
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            posthog.capture('co_owner_updated', {
                co_owner_id: id,
                updated_fields: Object.keys(updates),
            });

            await fetchCoOwners();
            return { data, error: null };
        } catch (error) {
            console.error('Error updating co-owner:', error);
            return { error };
        }
    };

    const removeCoOwner = async (id: string) => {
        try {
            const { error } = await supabase
                .from('co_owners')
                .delete()
                .eq('id', id);

            if (error) throw error;

            posthog.capture('co_owner_removed', {
                co_owner_id: id,
            });

            await fetchCoOwners();
            return { error: null };
        } catch (error) {
            console.error('Error removing co-owner:', error);
            return { error };
        }
    };

    return {
        coOwners,
        loading,
        fetchCoOwners,
        inviteCoOwner,
        updateCoOwner,
        removeCoOwner
    };
}
