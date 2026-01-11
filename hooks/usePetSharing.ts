import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { POSTHOG_API_KEY, POSTHOG_HOST } from '@/lib/posthog';

export interface PetShareToken {
    id: string;
    pet_id: string;
    token: string;
    permission_level: 'basic' | 'advanced';
    is_active: boolean;
    created_at: string;
    expires_at?: string;
    accessed_count: number;
    last_accessed_at?: string;
}

export type ShareToken = PetShareToken;

export interface SharedPetData {
    // Basic info (always included)
    id: string;
    name: string;
    species: string;
    breed?: string;
    gender?: string;
    date_of_birth?: string;
    avatar_url?: string;
    microchip_number?: string;

    // Advanced info (only with advanced permission)
    allergies?: any[];
    vaccinations?: any[];
    treatments?: any[];
    conditions?: any[];
    health_metrics?: any[];
}

export function usePetSharing(petId?: string) {
    const [tokens, setTokens] = useState<ShareToken[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch all share tokens for a pet
    const fetchTokens = useCallback(async () => {
        if (!petId) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('pet_share_tokens')
                .select('*')
                .eq('pet_id', petId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching share tokens:', error);
            } else {
                setTokens(data || []);
            }
        } catch (error) {
            console.error('Error fetching share tokens:', error);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchTokens();
    }, [fetchTokens]);

    // Generate a new share token
    const generateToken = async (permissionLevel: 'basic' | 'advanced') => {
        if (!petId) return { data: null, error: new Error('Pet ID is required') };

        try {
            // Generate secure random token
            let token = '';
            if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
                const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
                token = Array.from(tokenBytes)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
            } else {
                // Fallback for environments without crypto
                token = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            }

            const { data, error } = await supabase
                .from('pet_share_tokens')
                .insert({
                    pet_id: petId,
                    token,
                    permission_level: permissionLevel,
                })
                .select()
                .single();

            if (error) {
                console.error('Error generating token:', error);
                return { data: null, error };
            }

            // Track shared event
            try {
                if (typeof window === 'undefined') {
                    // Only try to import posthog-react-native on native
                    // @ts-ignore
                    const { default: PostHog } = await import('posthog-react-native');
                    const ph = await PostHog.init(POSTHOG_API_KEY, { host: POSTHOG_HOST });
                    if (ph) {
                        ph.capture('pet_shared', {
                            pet_id: petId,
                            permission_level: permissionLevel,
                            platform: 'native'
                        });
                    }
                }
            } catch (e) {
                console.warn('PostHog tracking failed', e);
            }

            await fetchTokens(); // Refresh list
            return { data, error: null };
        } catch (error: any) {
            console.error('Error generating token:', error);
            return { data: null, error };
        }
    };

    // Get existing token or generate new one
    const getOrCreateToken = async (permissionLevel: 'basic' | 'advanced') => {
        if (!petId) return { data: null, error: new Error('Pet ID is required') };

        try {
            // Check if token already exists
            const { data: existing, error: fetchError } = await supabase
                .from('pet_share_tokens')
                .select('*')
                .eq('pet_id', petId)
                .eq('permission_level', permissionLevel)
                .eq('is_active', true)
                .maybeSingle();

            if (fetchError) {
                console.error('Error fetching existing token:', fetchError);
                return { data: null, error: fetchError };
            }

            if (existing) {
                return { data: existing, error: null };
            }

            // Generate new token if none exists
            return await generateToken(permissionLevel);
        } catch (error: any) {
            console.error('Error getting or creating token:', error);
            return { data: null, error };
        }
    };

    // Revoke (deactivate) a token
    const revokeToken = async (tokenId: string) => {
        try {
            const { error } = await supabase
                .from('pet_share_tokens')
                .update({ is_active: false })
                .eq('id', tokenId);

            if (error) {
                console.error('Error revoking token:', error);
                return { error };
            }

            // Track revocation
            try {
                if (typeof window === 'undefined') {
                    // @ts-ignore
                    const { default: PostHog } = await import('posthog-react-native');
                    const ph = await PostHog.init(POSTHOG_API_KEY, { host: POSTHOG_HOST });
                    if (ph) {
                        ph.capture('pet_share_revoked', {
                            token_id: tokenId,
                            pet_id: petId
                        });
                    }
                }
            } catch (e) {
                console.warn('PostHog tracking failed', e);
            }

            await fetchTokens(); // Refresh list
            return { error: null };
        } catch (error: any) {
            console.error('Error revoking token:', error);
            return { error };
        }
    };

    // Delete (permanently remove) a token
    const deleteToken = async (tokenId: string) => {
        try {
            const { error } = await supabase
                .from('pet_share_tokens')
                .delete()
                .eq('id', tokenId);

            if (error) {
                console.error('Error deleting token:', error);
                return { error };
            }

            // Track deletion
            try {
                if (typeof window === 'undefined') {
                    // @ts-ignore
                    const { default: PostHog } = await import('posthog-react-native');
                    const ph = await PostHog.init(POSTHOG_API_KEY, { host: POSTHOG_HOST });
                    if (ph) {
                        ph.capture('pet_share_deleted', {
                            token_id: tokenId,
                            pet_id: petId
                        });
                    }
                }
            } catch (e) {
                console.warn('PostHog tracking failed', e);
            }

            await fetchTokens(); // Refresh list
            return { error: null };
        } catch (error: any) {
            console.error('Error deleting token:', error);
            return { error };
        }
    };

    // Validate a token and get pet data
    const validateToken = async (token: string): Promise<{ data: SharedPetData | null, error: any }> => {
        try {
            // First, validate the token
            const { data: tokenData, error: tokenError } = await supabase
                .from('pet_share_tokens')
                .select('*')
                .eq('token', token)
                .eq('is_active', true)
                .maybeSingle();

            if (tokenError || !tokenData) {
                return { data: null, error: tokenError || new Error('Invalid or expired token') };
            }

            // Update access count and timestamp
            await supabase
                .from('pet_share_tokens')
                .update({
                    accessed_count: tokenData.accessed_count + 1,
                    last_accessed_at: new Date().toISOString(),
                })
                .eq('id', tokenData.id);

            // Fetch basic pet info
            const { data: petData, error: petError } = await supabase
                .from('pets')
                .select('id, name, species, breed, gender, date_of_birth, avatar_url, microchip_number')
                .eq('id', tokenData.pet_id)
                .single();

            if (petError || !petData) {
                return { data: null, error: petError || new Error('Pet not found') };
            }

            const sharedData: SharedPetData = petData;

            // If advanced permission, fetch additional data
            if (tokenData.permission_level === 'advanced') {
                // Fetch allergies
                const { data: allergies } = await supabase
                    .from('allergies')
                    .select('*')
                    .eq('pet_id', tokenData.pet_id);

                // Fetch vaccinations
                const { data: vaccinations } = await supabase
                    .from('vaccinations')
                    .select('*')
                    .eq('pet_id', tokenData.pet_id)
                    .order('date_given', { ascending: false });

                // Fetch treatments
                const { data: treatments } = await supabase
                    .from('treatments')
                    .select('*')
                    .eq('pet_id', tokenData.pet_id)
                    .order('start_date', { ascending: false });

                // Fetch conditions
                const { data: conditions } = await supabase
                    .from('conditions')
                    .select('*')
                    .eq('pet_id', tokenData.pet_id);

                // Fetch recent health metrics
                const { data: health_metrics } = await supabase
                    .from('health_metrics')
                    .select('*')
                    .eq('pet_id', tokenData.pet_id)
                    .order('date', { ascending: false })
                    .limit(10);

                sharedData.allergies = allergies || [];
                sharedData.vaccinations = vaccinations || [];
                sharedData.treatments = treatments || [];
                sharedData.conditions = conditions || [];
                sharedData.health_metrics = health_metrics || [];
            }

            return { data: sharedData, error: null };
        } catch (error: any) {
            console.error('Error validating token:', error);
            return { data: null, error };
        }
    };

    // Generate share URL based on environment
    const getShareUrl = (token: string) => {
        let baseUrl = 'https://app.mywaggli.app'; // Production default

        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;

            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                baseUrl = `http://${hostname}:${window.location.port || '8081'}`;
            } else if (hostname.includes('waggli.eu')) {
                baseUrl = 'https://app.waggli.eu'; // Staging
            }
            // else use production default
        }

        return `${baseUrl}/pet/shared/${token}`;
    };

    return {
        tokens,
        loading,
        fetchTokens,
        generateToken,
        getOrCreateToken,
        revokeToken,
        deleteToken,
        validateToken,
        getShareUrl,
    };
}
