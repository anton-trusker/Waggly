import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    HealthDashboardSummary,
    VaccinationStatusView,
    MedicationTrackerView,
    PreventiveCareStatusView
} from '@/types';

interface HealthDashboardData {
    summary: HealthDashboardSummary | null;
    vaccinations: VaccinationStatusView[];
    medications: MedicationTrackerView[];
    preventiveCare: PreventiveCareStatusView[];
}

export function useHealthDashboard(petId: string) {
    const [data, setData] = useState<HealthDashboardData>({
        summary: null,
        vaccinations: [],
        medications: [],
        preventiveCare: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchHealthData = useCallback(async () => {
        if (!petId) return;

        try {
            setLoading(true);
            setError(null);

            // Parallel fetch from all views
            const [summaryRes, vaxRes, medsRes, prevRes] = await Promise.all([
                supabase
                    .from('view_health_dashboard_summary')
                    .select('*')
                    .eq('pet_id', petId)
                    .single(),

                supabase
                    .from('view_vaccination_status')
                    .select('*')
                    .eq('pet_id', petId)
                    .order('next_due_date', { ascending: true }),

                supabase
                    .from('view_medication_tracker')
                    .select('*')
                    .eq('pet_id', petId)
                    .order('next_due_date', { ascending: true }),

                supabase
                    .from('view_preventive_care_status')
                    .select('*')
                    .eq('pet_id', petId)
                    .order('treatment_name', { ascending: true })
            ]);

            if (summaryRes.error) throw summaryRes.error;
            if (vaxRes.error) throw vaxRes.error;
            if (medsRes.error) throw medsRes.error;
            if (prevRes.error) throw prevRes.error;

            setData({
                summary: summaryRes.data as HealthDashboardSummary,
                vaccinations: vaxRes.data as VaccinationStatusView[],
                medications: medsRes.data as MedicationTrackerView[],
                preventiveCare: prevRes.data as PreventiveCareStatusView[],
            });

        } catch (err) {
            console.error('Error fetching health dashboard:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchHealthData();
    }, [fetchHealthData]);

    return {
        ...data,
        loading,
        error,
        refresh: fetchHealthData
    };
}
