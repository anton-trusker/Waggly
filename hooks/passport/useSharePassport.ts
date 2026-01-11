import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { Platform } from 'react-native';

export interface SharePermissions {
    identification: boolean;
    physical: boolean;
    medical: boolean;
    vaccinations: boolean;
    emergency: boolean;
    allergies: boolean;
    notes: boolean;
    timeline: boolean;
    documents: boolean;
}

export interface ShareLink {
    id: string;
    token: string;
    permissions: any;
    active: boolean;
    expires_at: string;
    created_at: string;
    accessed_count: number;
}

export function useSharePassport(petId: string) {
    const [loading, setLoading] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [activeLinks, setActiveLinks] = useState<ShareLink[]>([]);
    const { success, error } = useToast();

    const getShareUrl = useCallback((token: string) => {
        let baseUrl = 'https://mywaggli.com'; // Production default

        if (Platform.OS === 'web') {
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                baseUrl = `http://${hostname}:${window.location.port || '8081'}`;
            }
        }

        return `${baseUrl}/p/${token}`;
    }, []);

    const fetchActiveLinks = useCallback(async () => {
        if (!petId) return;
        setLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('share_links')
                .select('*')
                .eq('pet_id', petId)
                .eq('active', true)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setActiveLinks(data || []);
        } catch (err: any) {
            console.error('Error fetching active links:', err);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    const generateShareLink = useCallback(async (permissions: SharePermissions) => {
        if (!petId) return;

        setLoading(true);
        try {
            const newToken = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            const { data, error: insertError } = await supabase
                .from('share_links')
                .insert({
                    pet_id: petId,
                    token: newToken,
                    permissions: {
                        basic: permissions.identification,
                        physical: permissions.physical,
                        medical: permissions.medical,
                        vaccinations: permissions.vaccinations,
                        emergency: permissions.emergency,
                        allergies: permissions.allergies,
                        notes: permissions.notes,
                        timeline: permissions.timeline,
                        documents: permissions.documents
                    },
                    active: true,
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                })
                .select()
                .single();

            if (insertError) throw insertError;

            const url = getShareUrl(newToken);
            setShareUrl(url);
            setToken(newToken);
            await fetchActiveLinks();
            success('Share link generated');
            return url;
        } catch (err: any) {
            console.error('Error generating share link:', err);
            error(err.message || 'Failed to generate share link');
            return null;
        } finally {
            setLoading(false);
        }
    }, [petId, success, error, getShareUrl, fetchActiveLinks]);

    const revokeLink = useCallback(async (tokenToRevoke: string) => {
        try {
            const { error: revokeError } = await supabase
                .from('share_links')
                .update({ active: false })
                .eq('token', tokenToRevoke);

            if (revokeError) throw revokeError;
            await fetchActiveLinks();
            success('Link revoked');
        } catch (err: any) {
            error(err.message || 'Failed to revoke link');
        }
    }, [success, error, fetchActiveLinks]);

    const resetShareUrl = useCallback(() => {
        setShareUrl(null);
        setToken(null);
    }, []);

    useEffect(() => {
        fetchActiveLinks();
    }, [fetchActiveLinks]);

    return {
        loading,
        shareUrl,
        token,
        activeLinks,
        generateShareLink,
        revokeLink,
        resetShareUrl,
        getShareUrl,
        fetchActiveLinks
    };
}
