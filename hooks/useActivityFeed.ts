import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ActivityItem {
    id: string;
    type: 'weight' | 'visit' | 'vaccination' | 'treatment' | 'document' | 'photo' | 'medication' | 'update';
    petId: string;
    petName: string;
    petPhotoUrl?: string;
    title: string;
    description: string;
    timestamp: string;
    data?: any;
    icon: string;
}

/**
 * Hook to fetch activity feed from activity_logs table
 * All actions should be logged to this central table
 */
export const useActivityFeed = (limit: number = 10, petId?: string) => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchActivities = async () => {
            setLoading(true);
            try {
                // Fetch from activity_logs table with pet info
                let query = supabase
                    .from('activity_logs')
                    .select(`
                        id,
                        action_type,
                        details,
                        created_at,
                        pet_id,
                        pets:pet_id (
                            id,
                            name,
                            photo_url
                        )
                    `)
                    .eq('owner_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (petId) {
                    query = query.eq('pet_id', petId);
                }

                const { data: logs, error } = await query;

                if (error) throw error;

                if (!logs) {
                    setActivities([]);
                    return;
                }

                // Transform logs to ActivityItem format
                const allActivities: ActivityItem[] = logs.map(log => {
                    const pet = log.pets as any;
                    const details = log.details || {};

                    return {
                        id: log.id,
                        type: getActivityType(log.action_type),
                        petId: log.pet_id || '',
                        petName: pet?.name || 'Unknown Pet',
                        petPhotoUrl: pet?.photo_url || undefined,
                        title: getActivityTitle(log.action_type, details),
                        description: getActivityDescription(log.action_type, details, pet?.name),
                        timestamp: log.created_at,
                        data: details,
                        icon: getActivityIcon(log.action_type),
                    };
                });

                setActivities(allActivities);
            } catch (error) {
                console.error('Error fetching activity feed:', error);
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();

        // Subscribe to real-time updates
        const subscription = supabase
            .channel('activity_logs_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'activity_logs',
                    filter: `owner_id=eq.${user.id}`,
                },
                () => {
                    fetchActivities();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user, limit, petId]);

    return { activities, loading };
};

// Helper functions to map action types to UI elements
function getActivityType(actionType: string): ActivityItem['type'] {
    if (actionType.includes('weight')) return 'weight';
    if (actionType.includes('visit') || actionType.includes('appointment')) return 'visit';
    if (actionType.includes('vaccination') || actionType.includes('vaccine')) return 'vaccination';
    if (actionType.includes('treatment')) return 'treatment';
    if (actionType.includes('document')) return 'document';
    if (actionType.includes('photo')) return 'photo';
    if (actionType.includes('medication')) return 'medication';
    return 'update';
}

function getActivityIcon(actionType: string): string {
    if (actionType.includes('weight')) return 'scale-outline';
    if (actionType.includes('visit') || actionType.includes('appointment')) return 'medical-outline';
    if (actionType.includes('vaccination') || actionType.includes('vaccine')) return 'fitness-outline';
    if (actionType.includes('treatment')) return 'medkit-outline';
    if (actionType.includes('document')) return 'document-outline';
    if (actionType.includes('photo')) return 'camera-outline';
    if (actionType.includes('medication')) return 'bandage-outline';
    if (actionType.includes('update') || actionType.includes('edit')) return 'create-outline';
    return 'ellipse-outline';
}

function getActivityTitle(actionType: string, details: any): string {
    if (actionType.includes('vaccination')) return 'Vaccination';
    if (actionType.includes('weight')) return 'Weight Logged';
    if (actionType.includes('visit')) return 'Vet Visit';
    if (actionType.includes('document')) return 'Document Added';
    if (actionType.includes('medication')) return 'Medication';
    if (actionType.includes('treatment')) return 'Treatment';
    if (actionType.includes('update')) return 'Profile Updated';
    return actionType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getActivityDescription(actionType: string, details: any, petName?: string): string {
    const name = petName || 'Pet';

    if (actionType.includes('vaccination')) {
        return `${name} received ${details.vaccine_name || 'vaccination'}`;
    }
    if (actionType.includes('weight')) {
        return `${name} weighed ${details.weight} ${details.unit || 'kg'}`;
    }
    if (actionType.includes('visit')) {
        return `${name} had a ${details.visit_type || 'checkup'}`;
    }
    if (actionType.includes('document')) {
        return `${details.file_name || 'Document'} uploaded for ${name}`;
    }
    if (actionType.includes('medication')) {
        return `${details.medication_name || 'Medication'} added for ${name}`;
    }

    return details.description || `Action performed for ${name}`;
}
