import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ActivityItem {
    id: string;
    type: 'weight' | 'visit' | 'vaccination' | 'treatment' | 'document' | 'photo';
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
 * Hook to fetch and aggregate activity feed across all pets
 * Combines events from multiple tables into a unified timeline
 */
export const useActivityFeed = (limit: number = 10) => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchActivities = async () => {
            setLoading(true);
            try {
                const allActivities: ActivityItem[] = [];

                // Fetch user's pets
                const { data: pets } = await supabase
                    .from('pets')
                    .select('id, name, photo_url')
                    .eq('user_id', user.id);

                if (!pets) return;

                const petIds = pets.map(p => p.id);

                // Fetch weight entries
                const { data: weights } = await supabase
                    .from('weight_entries')
                    .select('id, pet_id, weight, weight_unit, date_recorded, created_at')
                    .in('pet_id', petIds)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (weights) {
                    weights.forEach(w => {
                        const pet = pets.find(p => p.id === w.pet_id);
                        if (!pet) return;

                        allActivities.push({
                            id: `weight-${w.id}`,
                            type: 'weight',
                            petId: pet.id,
                            petName: pet.name,
                            petPhotoUrl: pet.photo_url || undefined,
                            title: 'Weight Logged',
                            description: `${pet.name} weighed ${w.weight} ${w.weight_unit}`,
                            timestamp: w.created_at || w.date_recorded,
                            data: { weight: w.weight, unit: w.weight_unit },
                            icon: 'scale-outline',
                        });
                    });
                }

                // Fetch medical visits
                const { data: visits } = await supabase
                    .from('medical_visits')
                    .select('id, pet_id, visit_type, visit_date, created_at')
                    .in('pet_id', petIds)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (visits) {
                    visits.forEach(v => {
                        const pet = pets.find(p => p.id === v.pet_id);
                        if (!pet) return;

                        allActivities.push({
                            id: `visit-${v.id}`,
                            type: 'visit',
                            petId: pet.id,
                            petName: pet.name,
                            petPhotoUrl: pet.photo_url || undefined,
                            title: 'Vet Visit',
                            description: `${pet.name} had a ${v.visit_type || 'checkup'}`,
                            timestamp: v.created_at || v.visit_date,
                            icon: 'medical-outline',
                        });
                    });
                }

                // Fetch vaccinations
                const { data: vaccinations } = await supabase
                    .from('vaccinations')
                    .select('id, pet_id, vaccine_name, date_given, created_at')
                    .in('pet_id', petIds)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (vaccinations) {
                    vaccinations.forEach(v => {
                        const pet = pets.find(p => p.id === v.pet_id);
                        if (!pet) return;

                        allActivities.push({
                            id: `vaccination-${v.id}`,
                            type: 'vaccination',
                            petId: pet.id,
                            petName: pet.name,
                            petPhotoUrl: pet.photo_url || undefined,
                            title: 'Vaccination',
                            description: `${pet.name} received ${v.vaccine_name}`,
                            timestamp: v.created_at || v.date_given,
                            icon: 'fitness-outline',
                        });
                    });
                }

                // Fetch documents (recently added)
                const { data: documents } = await supabase
                    .from('documents')
                    .select('id, pet_id, file_name, created_at')
                    .in('pet_id', petIds)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (documents) {
                    documents.forEach(d => {
                        const pet = pets.find(p => p.id === d.pet_id);
                        if (!pet) return;

                        allActivities.push({
                            id: `document-${d.id}`,
                            type: 'document',
                            petId: pet.id,
                            petName: pet.name,
                            petPhotoUrl: pet.photo_url || undefined,
                            title: 'Document Added',
                            description: `${d.file_name} uploaded for ${pet.name}`,
                            timestamp: d.created_at,
                            icon: 'document-outline',
                        });
                    });
                }

                // Sort by timestamp (most recent first)
                allActivities.sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                setActivities(allActivities.slice(0, limit));
            } catch (error) {
                console.error('Error fetching activity feed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [user, limit]);

    return { activities, loading };
};
