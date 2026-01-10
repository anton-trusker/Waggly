import { useMemo } from 'react';
import { usePets } from './usePets';
import { useVaccinations } from './useVaccinations';
import { useTreatments } from './useTreatments';
import { useMedicalVisits } from './useMedicalVisits';
import { useWeightEntries } from './useWeightEntries';

export interface VaccinationMetric {
    current: number;
    total: number;
    percentage: number;
    overdue: number;
    dueSoon: number;
}

export interface MedicationMetric {
    active: number;
    total: number;
    byPet: Record<string, number>;
}

export interface WeightMetric {
    trend: 'stable' | 'gaining' | 'losing' | 'unknown';
    change: number;
    changePercentage: number;
    lastWeight?: number;
    unit: string;
}

export interface CheckupMetric {
    daysSinceLastVisit: number;
    nextDueDate?: string;
    daysUntilNext: number;
    isOverdue: boolean;
}

export interface HealthMetrics {
    vaccinations: VaccinationMetric;
    medications: MedicationMetric;
    weight: WeightMetric;
    checkups: CheckupMetric;
}

export function useHealthMetrics() {
    const { pets } = usePets();
    const { vaccinations, loading: vaccinationsLoading } = useVaccinations();
    const { treatments, loading: treatmentsLoading } = useTreatments();
    const { visits, loading: visitsLoading } = useMedicalVisits();
    const { entries: weightEntries, loading: weightLoading } = useWeightEntries();

    const vaccinationMetric = useMemo((): VaccinationMetric => {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        let currentCount = 0;
        let overdueCount = 0;
        let dueSoonCount = 0;

        pets.forEach(pet => {
            const petVaccinations = vaccinations.filter(v => v.pet_id === pet.id);
            const hasOverdue = petVaccinations.some(v =>
                v.next_due_date && new Date(v.next_due_date) < today
            );

            if (!hasOverdue && petVaccinations.length > 0) {
                currentCount++;
            }

            petVaccinations.forEach(v => {
                if (v.next_due_date) {
                    const dueDate = new Date(v.next_due_date);
                    if (dueDate < today) {
                        overdueCount++;
                    } else if (dueDate < thirtyDaysFromNow) {
                        dueSoonCount++;
                    }
                }
            });
        });

        return {
            current: currentCount,
            total: pets.length,
            percentage: pets.length > 0 ? Math.round((currentCount / pets.length) * 100) : 0,
            overdue: overdueCount,
            dueSoon: dueSoonCount,
        };
    }, [pets, vaccinations]);

    const medicationMetric = useMemo((): MedicationMetric => {
        const activeMeds = treatments.filter(t => t.is_active && t.category === 'Medication');
        const byPet: Record<string, number> = {};

        activeMeds.forEach(med => {
            byPet[med.pet_id] = (byPet[med.pet_id] || 0) + 1;
        });

        return {
            active: activeMeds.length,
            total: treatments.filter(t => t.category === 'Medication').length,
            byPet,
        };
    }, [treatments]);

    const weightMetric = useMemo((): WeightMetric => {
        if (!weightEntries || weightEntries.length < 2) {
            return {
                trend: 'unknown',
                change: 0,
                changePercentage: 0,
                unit: 'kg',
            };
        }

        // Sort by date descending
        const sorted = [...weightEntries].sort((a, b) =>
            new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
        );

        const latest = sorted[0];
        const previous = sorted[1];

        const change = latest.weight_value - previous.weight_value;
        const changePercentage = (change / previous.weight_value) * 100;

        let trend: 'stable' | 'gaining' | 'losing' = 'stable';
        if (Math.abs(changePercentage) > 5) {
            trend = change > 0 ? 'gaining' : 'losing';
        }

        return {
            trend,
            change: Math.abs(change),
            changePercentage: Math.abs(changePercentage),
            lastWeight: latest.weight_value,
            unit: latest.weight_unit || 'kg',
        };
    }, [weightEntries]);

    const checkupMetric = useMemo((): CheckupMetric => {
        if (!visits || visits.length === 0) {
            return {
                daysSinceLastVisit: 0,
                daysUntilNext: 0,
                isOverdue: false,
            };
        }

        // Sort by date descending
        const sorted = [...visits].sort((a, b) =>
            new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
        );

        const lastVisit = sorted[0];
        const today = new Date();
        const lastVisitDate = new Date(lastVisit.visit_date);
        const daysSince = Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));

        // Assume annual checkup (365 days)
        const nextDueDate = new Date(lastVisitDate.getTime() + 365 * 24 * 60 * 60 * 1000);
        const daysUntil = Math.floor((nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return {
            daysSinceLastVisit: daysSince,
            nextDueDate: nextDueDate.toISOString(),
            daysUntilNext: daysUntil,
            isOverdue: daysUntil < 0,
        };
    }, [visits]);

    const metrics: HealthMetrics = {
        vaccinations: vaccinationMetric,
        medications: medicationMetric,
        weight: weightMetric,
        checkups: checkupMetric,
    };

    return {
        metrics,
        loading: vaccinationsLoading || treatmentsLoading || visitsLoading || weightLoading,
    };
}
