import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface PriorityAlert {
    id: string;
    type: 'vaccination' | 'treatment' | 'subscription' | 'appointment';
    title: string;
    description: string;
    petId: string;
    petName: string;
    dueDate: string;
    daysRemaining: number;
    severity: 'high' | 'medium' | 'low';
    actionLabel: string;
    actionUrl: string;
}

/**
 * Hook to fetch priority alerts for the user
 * Returns upcoming vaccinations, treatments, and other time-sensitive items
 */
export const usePriorityAlerts = (daysThreshold: number = 30) => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState<PriorityAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const allAlerts: PriorityAlert[] = [];
                const today = new Date();
                const thresholdDate = new Date();
                thresholdDate.setDate(today.getDate() + daysThreshold);

                // Fetch user's pets
                const { data: pets } = await supabase
                    .from('pets')
                    .select('id, name')
                    .eq('profile_id', user.id);

                if (!pets) return;

                const petIds = pets.map(p => p.id);

                // Check for upcoming vaccinations
                const { data: vaccinations } = await supabase
                    .from('vaccinations')
                    .select('id, pet_id, vaccine_name, next_due_date')
                    .in('pet_id', petIds)
                    .not('next_due_date', 'is', null)
                    .lte('next_due_date', thresholdDate.toISOString().split('T')[0])
                    .gte('next_due_date', today.toISOString().split('T')[0]);

                if (vaccinations) {
                    vaccinations.forEach(vacc => {
                        const pet = pets.find(p => p.id === vacc.pet_id);
                        if (!pet || !vacc.next_due_date) return;

                        const dueDate = new Date(vacc.next_due_date);
                        const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                        allAlerts.push({
                            id: vacc.id,
                            type: 'vaccination',
                            title: `${vacc.vaccine_name} Due`,
                            description: `${pet.name}'s vaccination is due soon`,
                            petId: pet.id,
                            petName: pet.name,
                            dueDate: vacc.next_due_date,
                            daysRemaining,
                            severity: daysRemaining <= 7 ? 'high' : daysRemaining <= 14 ? 'medium' : 'low',
                            actionLabel: 'Book',
                            actionUrl: `/(tabs)/pets/${pet.id}/health/vaccination`,
                        });
                    });
                }

                // Check for upcoming treatments
                const { data: treatments } = await supabase
                    .from('treatments')
                    .select('id, pet_id, treatment_type, next_appointment_date')
                    .in('pet_id', petIds)
                    .not('next_appointment_date', 'is', null)
                    .lte('next_appointment_date', thresholdDate.toISOString().split('T')[0])
                    .gte('next_appointment_date', today.toISOString().split('T')[0]);

                if (treatments) {
                    treatments.forEach(treatment => {
                        const pet = pets.find(p => p.id === treatment.pet_id);
                        if (!pet || !treatment.next_appointment_date) return;

                        const dueDate = new Date(treatment.next_appointment_date);
                        const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                        allAlerts.push({
                            id: treatment.id,
                            type: 'treatment',
                            title: `${treatment.treatment_type} Scheduled`,
                            description: `${pet.name}'s treatment appointment`,
                            petId: pet.id,
                            petName: pet.name,
                            dueDate: treatment.next_appointment_date,
                            daysRemaining,
                            severity: daysRemaining <= 7 ? 'high' : 'medium',
                            actionLabel: 'View',
                            actionUrl: `/web/pets/${pet.id}`,
                        });
                    });
                }

                // Sort by days remaining (most urgent first)
                allAlerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
                setAlerts(allAlerts);
            } catch (error) {
                console.error('Error fetching priority alerts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [user, daysThreshold]);

    return { alerts, loading };
};
