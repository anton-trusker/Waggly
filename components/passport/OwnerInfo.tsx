
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/lib/supabase';
import { useAppTheme } from '@/hooks/useAppTheme';

interface OwnerInfoProps {
    ownerId?: string;
}

interface OwnerProfile {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
}

export function OwnerInfo({ ownerId }: OwnerInfoProps) {
    const { colors } = useAppTheme();
    const [profile, setProfile] = useState<OwnerProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ownerId) return;

        const fetchOwner = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, phone')
                    .eq('id', ownerId)
                    .single();

                if (error) throw error;
                if (data) {
                    setProfile(data as any);
                }
            } catch (err) {
                console.error('Error fetching owner profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOwner();
    }, [ownerId]);

    if (!ownerId) return null;
    if (loading) return <ActivityIndicator />;
    if (!profile) return null;

    const handleCall = () => {
        if (profile.phone) Linking.openURL(`tel:${profile.phone}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.header}>
                <IconSymbol name="person-circle" size={24} color={colors.primary} />
                <Text style={[styles.title, { color: colors.text }]}>Owner</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.name, { color: colors.text }]}>
                    {profile.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Unknown Name'}
                </Text>

                {profile.phone && (
                    <TouchableOpacity onPress={handleCall} style={styles.row}>
                        <IconSymbol name="call-outline" size={16} color={colors.textSecondary} />
                        <Text style={[styles.detail, { color: colors.textSecondary }]}>{profile.phone}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        gap: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detail: {
        fontSize: 14,
    },
});
