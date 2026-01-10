// Enhanced vaccination management hook with compliance tracking
// Extends existing vaccination functionality with passport features

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
    Vaccination,
    VaccinationCompliance,
    UseVaccinationsReturn,
    VaccinationFormData,
} from '@/types/passport';
import { VACCINE_DUE_SOON_DAYS } from '@/types/passport';

export function useVaccinations(petId: string): UseVaccinationsReturn {
    // Helper for status calculation
    const calculateStatus = (nextDue: Date | undefined | null) => {
        const now = new Date();
        const nextDueDate = nextDue instanceof Date ? nextDue : (nextDue ? new Date(nextDue) : null);
        const isCurrent = nextDueDate ? nextDueDate > now : false;
        const isOverdue = nextDueDate ? nextDueDate < now : false;
        let daysUntilDue: number | undefined;
        let daysOverdue: number | undefined;

        if (nextDueDate) {
            const diffTime = nextDueDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) daysUntilDue = diffDays;
            else daysOverdue = Math.abs(diffDays);
        }
        return { isCurrent, isOverdue, daysUntilDue, daysOverdue };
    };

    const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
    const [compliance, setCompliance] = useState<VaccinationCompliance>({
        compliancePercentage: 0,
        totalVaccinations: 0,
        currentVaccinations: 0,
        overdueCount: 0,
        dueSoonCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchVaccinations = useCallback(async () => {
        if (!petId) {
            setError(new Error('Pet ID is required'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('vaccinations')
                .select('*')
                .eq('pet_id', petId)
                .order('date_given', { ascending: false });

            if (fetchError) throw fetchError;

            const now = new Date();
            const vaccinesWithStatus: Vaccination[] = (data || []).map(vac => {
                const nextDue = vac.next_due_date ? new Date(vac.next_due_date) : null;
                const isCurrent = nextDue ? nextDue > now : false;
                const isOverdue = nextDue ? nextDue < now : false;

                let daysUntilDue: number | undefined;
                let daysOverdue: number | undefined;

                if (nextDue) {
                    const diffTime = nextDue.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays > 0) {
                        daysUntilDue = diffDays;
                    } else {
                        daysOverdue = Math.abs(diffDays);
                    }
                }

                return {
                    id: vac.id,
                    vaccineName: vac.vaccine_name,
                    category: vac.vaccination_type || 'core',
                    dateGiven: new Date(vac.date_given),
                    nextDueDate: nextDue || undefined,
                    doseNumber: vac.dose_number,
                    administeringVet: vac.administering_vet,
                    clinic: vac.clinic,
                    manufacturer: vac.manufacturer,
                    lotNumber: vac.lot_number,
                    route: vac.route_of_administration,
                    injectionSite: vac.injection_site,
                    certificateNumber: vac.certificate_number,
                    requiredForTravel: vac.required_for_travel || false,
                    notes: vac.notes,
                    status: {
                        isCurrent,
                        isOverdue,
                        daysUntilDue,
                        daysOverdue,
                    },
                };
            });

            // Calculate compliance metrics
            const total = vaccinesWithStatus.length;
            const current = vaccinesWithStatus.filter(v => v.status.isCurrent).length;
            const overdue = vaccinesWithStatus.filter(v => v.status.isOverdue).length;
            const dueSoon = vaccinesWithStatus.filter(v =>
                v.status.daysUntilDue && v.status.daysUntilDue <= VACCINE_DUE_SOON_DAYS
            ).length;

            const compliancePercentage = total > 0 ? Math.round((current / total) * 100) : 0;

            setVaccinations(vaccinesWithStatus);
            setCompliance({
                compliancePercentage,
                totalVaccinations: total,
                currentVaccinations: current,
                overdueCount: overdue,
                dueSoonCount: dueSoon,
            });
        } catch (err) {
            console.error('Error fetching vaccinations:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch vaccinations'));
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchVaccinations();
    }, [fetchVaccinations]);

    const addVaccination = useCallback(async (data: VaccinationFormData) => {
        const tempId = 'temp-' + Date.now();
        const status = calculateStatus(data.nextDueDate);

        const optimisticVac: Vaccination = {
            id: tempId,
            vaccineName: data.vaccineName,
            category: data.category,
            dateGiven: data.dateGiven,
            nextDueDate: data.nextDueDate,
            doseNumber: data.doseNumber,
            administeringVet: data.administeringVet,
            clinic: data.clinic,
            manufacturer: data.manufacturer,
            lotNumber: data.lotNumber,
            route: data.route,
            injectionSite: undefined,
            certificateNumber: data.certificateNumber,
            requiredForTravel: data.requiredForTravel,
            notes: data.notes,
            status: status
        };

        // Optimistic update
        setVaccinations(prev => {
            const updated = [optimisticVac, ...prev];
            return updated.sort((a, b) => b.dateGiven.getTime() - a.dateGiven.getTime());
        });

        try {
            const { error: insertError } = await supabase
                .from('vaccinations')
                .insert({
                    pet_id: petId,
                    vaccine_name: data.vaccineName,
                    vaccination_type: data.category,
                    date_given: data.dateGiven.toISOString(),
                    next_due_date: data.nextDueDate?.toISOString(),
                    dose_number: data.doseNumber,
                    administering_vet: data.administeringVet,
                    clinic: data.clinic,
                    manufacturer: data.manufacturer,
                    lot_number: data.lotNumber,
                    route_of_administration: data.route,
                    certificate_number: data.certificateNumber,
                    required_for_travel: data.requiredForTravel,
                    notes: data.notes,
                });

            if (insertError) throw insertError;

            // Refresh vaccinations list
            await fetchVaccinations();
        } catch (err) {
            console.error('Error adding vaccination:', err);
            setVaccinations(prev => prev.filter(v => v.id !== tempId)); // Revert
            throw err;
        }
    }, [petId, fetchVaccinations]);

    const updateVaccination = useCallback(async (
        id: string,
        data: Partial<VaccinationFormData>
    ) => {
        const previousVaccinations = [...vaccinations];

        // Optimistic update
        setVaccinations(prev => prev.map(v => {
            if (v.id === id) {
                const mergedDates = {
                    dateGiven: data.dateGiven || v.dateGiven,
                    nextDueDate: data.nextDueDate !== undefined ? data.nextDueDate : v.nextDueDate
                };
                const newStatus = calculateStatus(mergedDates.nextDueDate);

                return {
                    ...v,
                    ...mergedDates,
                    ...(data.vaccineName && { vaccineName: data.vaccineName }),
                    ...(data.category && { category: data.category }),
                    ...(data.doseNumber !== undefined && { doseNumber: data.doseNumber }),
                    ...(data.administeringVet !== undefined && { administeringVet: data.administeringVet }),
                    ...(data.clinic !== undefined && { clinic: data.clinic }),
                    ...(data.manufacturer !== undefined && { manufacturer: data.manufacturer }),
                    ...(data.lotNumber !== undefined && { lotNumber: data.lotNumber }),
                    ...(data.route !== undefined && { route: data.route }),
                    ...(data.certificateNumber !== undefined && { certificateNumber: data.certificateNumber }),
                    ...(data.requiredForTravel !== undefined && { requiredForTravel: data.requiredForTravel }),
                    ...(data.notes !== undefined && { notes: data.notes }),
                    status: newStatus
                };
            }
            return v;
        }));

        try {
            const updateData: any = {};

            if (data.vaccineName) updateData.vaccine_name = data.vaccineName;
            if (data.category) updateData.vaccination_type = data.category;
            if (data.dateGiven) updateData.date_given = data.dateGiven.toISOString();
            if (data.nextDueDate) updateData.next_due_date = data.nextDueDate.toISOString();
            if (data.doseNumber !== undefined) updateData.dose_number = data.doseNumber;
            if (data.administeringVet) updateData.administering_vet = data.administeringVet;
            if (data.clinic) updateData.clinic = data.clinic;
            if (data.manufacturer) updateData.manufacturer = data.manufacturer;
            if (data.lotNumber) updateData.lot_number = data.lotNumber;
            if (data.route) updateData.route_of_administration = data.route;
            if (data.certificateNumber) updateData.certificate_number = data.certificateNumber;
            if (data.requiredForTravel !== undefined) updateData.required_for_travel = data.requiredForTravel;
            if (data.notes !== undefined) updateData.notes = data.notes;

            const { error: updateError } = await supabase
                .from('vaccinations')
                .update(updateData)
                .eq('id', id);

            if (updateError) throw updateError;

            await fetchVaccinations();
        } catch (err) {
            console.error('Error updating vaccination:', err);
            setVaccinations(previousVaccinations); // Revert
            throw err;
        }
    }, [vaccinations, fetchVaccinations]);

    const deleteVaccination = useCallback(async (id: string) => {
        const previousVaccinations = [...vaccinations];

        // Optimistic update
        setVaccinations(prev => prev.filter(v => v.id !== id));

        try {
            const { error: deleteError } = await supabase
                .from('vaccinations')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            await fetchVaccinations();
        } catch (err) {
            console.error('Error deleting vaccination:', err);
            setVaccinations(previousVaccinations); // Revert
            throw err;
        }
    }, [vaccinations, fetchVaccinations]);

    return {
        vaccinations,
        compliance,
        loading,
        error,
        addVaccination,
        updateVaccination,
        deleteVaccination,
    };
}
