import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { VaccinationStatusView, MedicationTrackerView } from '@/types';

export interface HealthEvent {
    id: string;
    type: 'vaccination' | 'visit' | 'treatment' | 'weight' | 'medication';
    title: string;
    pet_name: string;
    date: string;
    status: 'upcoming' | 'completed' | 'overdue';
}

export function useHealthDashboard(petId: string) {
    const [recentEvents, setRecentEvents] = useState<HealthEvent[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<HealthEvent[]>([]);
    const [activeTreatments, setActiveTreatments] = useState<MedicationTrackerView[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHealthData = useCallback(async () => {
        try {
            setLoading(true);

            // 1. Fetch Pets to map names
            const { data: pets } = await supabase.from('pets').select('id, name');
            const petNameMap = new Map(pets?.map(p => [p.id, p.name]) || []);
            const getPetName = (id: string) => petNameMap.get(id) || 'Unknown Pet';

            // 2. Build Queries (Handle 'all' filter)
            let vaxQuery = supabase
                .from('view_vaccination_status' as any)
                .select('*');

            let medsQuery = supabase
                .from('view_medication_tracker' as any)
                .select('*');

            if (petId && petId !== 'all') {
                vaxQuery = vaxQuery.eq('pet_id', petId);
                medsQuery = medsQuery.eq('pet_id', petId);
            }

            const [vaxRes, medsRes] = await Promise.all([vaxQuery, medsQuery]);

            if (vaxRes.error) throw vaxRes.error;
            if (medsRes.error) throw medsRes.error;

            const vaccinations = (vaxRes.data as unknown as VaccinationStatusView[]) || [];
            const medications = (medsRes.data as unknown as MedicationTrackerView[]) || [];

            // 3. Process Active Treatments
            // Assume active if end_date is null or in the future
            const now = new Date();
            const activeMeds = medications.filter(m => !m.end_date || new Date(m.end_date) > now);
            setActiveTreatments(activeMeds);

            // 4. Process Upcoming Events (Next Due Dates)
            const upcoming: HealthEvent[] = [];

            // Vaccines Due
            vaccinations.forEach(v => {
                if (v.next_due_date && new Date(v.next_due_date) > now) {
                    upcoming.push({
                        id: `vax-due-${v.id}`,
                        type: 'vaccination',
                        title: `${v.vaccine_name} Due`,
                        pet_name: getPetName(v.pet_id),
                        date: v.next_due_date,
                        status: 'upcoming'
                    });
                }
            });

            // Meds Due (Next Dose)
            activeMeds.forEach(m => {
                if (m.next_due_date && new Date(m.next_due_date) > now) {
                    upcoming.push({
                        id: `med-due-${m.id}`,
                        type: 'treatment',
                        title: `${m.medication_name} Due`,
                        pet_name: getPetName(m.pet_id),
                        date: m.next_due_date,
                        status: 'upcoming'
                    });
                }
            });

            // Sort Upcoming
            upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setUpcomingEvents(upcoming);

            // 5. Process Recent History (Past Dates)
            const recent: HealthEvent[] = [];

            // Vaccines Given
            vaccinations.forEach(v => {
                if (v.date_given) {
                    recent.push({
                        id: `vax-given-${v.id}`,
                        type: 'vaccination',
                        title: `${v.vaccine_name}`,
                        pet_name: getPetName(v.pet_id),
                        date: v.date_given,
                        status: 'completed'
                    });
                }
            });

            // Meds Started
            medications.forEach(m => {
                if (m.start_date) {
                    recent.push({
                        id: `med-start-${m.id}`,
                        type: 'treatment',
                        title: `Started ${m.medication_name}`,
                        pet_name: getPetName(m.pet_id),
                        date: m.start_date,
                        status: 'completed'
                    });
                }
            });

            // Sort Recent (Descending)
            recent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setRecentEvents(recent.slice(0, 20)); // Limit to 20

        } catch (err) {
            console.error('Error fetching health dashboard:', err);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchHealthData();
    }, [fetchHealthData]);

    return {
        recentEvents,
        upcomingEvents,
        activeTreatments,
        loading,
        refresh: fetchHealthData
    };
}
