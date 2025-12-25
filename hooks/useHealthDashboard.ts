import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface HealthEvent {
    id: string;
    pet_id: string;
    pet_name?: string;
    pet_photo?: string;
    title: string;
    date: string;
    type: 'vaccination' | 'visit' | 'treatment' | 'weight';
    details?: any;
    status?: string;
    is_active?: boolean;
}

export function useHealthDashboard(petId?: string) {
    const { user } = useAuth();
    const [data, setData] = useState<{
        recentEvents: HealthEvent[];
        upcomingEvents: HealthEvent[];
        activeTreatments: HealthEvent[];
        loading: boolean;
    }>({
        recentEvents: [],
        upcomingEvents: [],
        activeTreatments: [],
        loading: true,
    });

    const fetchData = useCallback(async () => {
        if (!user) return;

        try {
            setData(prev => ({ ...prev, loading: true }));

            // filtering by petId if provided
            const filterByPet = (query: any) => {
                if (petId && petId !== 'all') {
                    return query.eq('pet_id', petId);
                }
                return query;
            };

            // 1. Fetch Vaccinations
            let vaxQuery = supabase
                .from('vaccinations')
                .select(`
          *,
          pets (name, photo_url)
        `)
                .order('next_due_date', { ascending: true }); // optimize for upcoming

            const { data: vaccinations } = await filterByPet(vaxQuery);

            // 2. Fetch Medical Visits
            let visitQuery = supabase
                .from('medical_visits')
                .select(`
          *,
          pets (name, photo_url)
        `)
                .order('date', { ascending: false });

            const { data: visits } = await filterByPet(visitQuery);

            // 3. Fetch Treatments
            let treatQuery = supabase
                .from('treatments')
                .select(`
          *,
          pets (name, photo_url)
        `)
                .eq('is_active', true);

            const { data: treatments } = await filterByPet(treatQuery);

            // 4. Fetch Weight Entries (Recent)
            let weightQuery = supabase
                .from('weight_entries')
                .select(`
          *,
          pets (name, photo_url)
        `)
                .order('date', { ascending: false })
                .limit(50); // Limit to recent

            const { data: weights } = await filterByPet(weightQuery);

            // Process and Sort
            const now = new Date();
            const upcoming: HealthEvent[] = [];
            const history: HealthEvent[] = [];
            const active: HealthEvent[] = [];

            // Process Vaccinations
            (vaccinations || []).forEach((v: any) => {
                const petInfo = v.pets;
                const nextDueDate = v.next_due_date ? new Date(v.next_due_date) : null;

                // Past Vaccination (History)
                history.push({
                    id: v.id,
                    pet_id: v.pet_id,
                    pet_name: petInfo?.name || 'Unknown',
                    pet_photo: petInfo?.photo_url,
                    title: `Vaccination: ${v.name}`,
                    date: v.date,
                    type: 'vaccination',
                    details: v,
                });

                // Upcoming Vaccination
                if (nextDueDate && nextDueDate >= now) {
                    upcoming.push({
                        id: `upcoming-vax-${v.id}`,
                        pet_id: v.pet_id,
                        pet_name: petInfo?.name || 'Unknown',
                        pet_photo: petInfo?.photo_url,
                        title: `Due: ${v.name}`,
                        date: v.next_due_date,
                        type: 'vaccination',
                        details: v,
                        status: 'upcoming'
                    });
                }
            });

            // Process Visits (History)
            (visits || []).forEach((v: any) => {
                const petInfo = v.pets;
                history.push({
                    id: v.id,
                    pet_id: v.pet_id,
                    pet_name: petInfo?.name || 'Unknown',
                    pet_photo: petInfo?.photo_url,
                    title: `Vet Visit: ${v.reason}`,
                    date: v.date,
                    type: 'visit',
                    details: v,
                });
            });

            // Process Treatments (Active)
            (treatments || []).forEach((t: any) => {
                const petInfo = t.pets;
                active.push({
                    id: t.id,
                    pet_id: t.pet_id,
                    pet_name: petInfo?.name || 'Unknown',
                    pet_photo: petInfo?.photo_url,
                    title: `Treatment: ${t.type}`,
                    date: t.date, // Start date?
                    type: 'treatment',
                    details: t,
                    is_active: true
                });
            });

            // Process Weights
            (weights || []).forEach((w: any) => {
                const petInfo = w.pets;
                history.push({
                    id: w.id,
                    pet_id: w.pet_id,
                    pet_name: petInfo?.name || 'Unknown',
                    pet_photo: petInfo?.photo_url,
                    title: `Weight: ${w.weight} ${w.unit}`,
                    date: w.date,
                    type: 'weight',
                    details: w
                });
            });

            // Sort History (Desc)
            history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Sort Upcoming (Asc)
            upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setData({
                recentEvents: history,
                upcomingEvents: upcoming,
                activeTreatments: active,
                loading: false
            });

        } catch (e) {
            console.error('Error fetching health dashboard data:', e);
            setData(prev => ({ ...prev, loading: false }));
        }
    }, [user, petId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Expose refresh function/data
    return { ...data, refresh: fetchData };
}
