import { useMemo } from 'react';
import { usePets } from './usePets';
import { useVaccinations } from './useVaccinations';
import { useTreatments } from './useTreatments';
import { useHealthMetrics } from './useHealthMetrics';

export interface Insight {
    id: string;
    type: 'health' | 'preventive' | 'behavioral' | 'cost' | 'milestone' | 'seasonal';
    severity: 'critical' | 'warning' | 'info';
    icon: string;
    title: string;
    description: string;
    actionLabel: string;
    actionType: 'navigate' | 'modal' | 'external';
    actionData?: any;
    petId?: string;
    petName?: string;
    dismissible: boolean;
    createdAt: string;
    color: string;
    backgroundColor: string;
}

export function useInsights() {
    const { pets } = usePets();
    const { vaccinations } = useVaccinations();
    const { treatments } = useTreatments();
    const { metrics } = useHealthMetrics();

    const insights = useMemo((): Insight[] => {
        const result: Insight[] = [];
        const today = new Date();

        // 1. Vaccination Overdue Insights
        if (metrics.vaccinations.overdue > 0) {
            result.push({
                id: 'vaccination-overdue',
                type: 'preventive',
                severity: 'critical',
                icon: 'warning',
                title: 'Vaccinations Overdue',
                description: `${metrics.vaccinations.overdue} vaccination${metrics.vaccinations.overdue > 1 ? 's are' : ' is'} overdue. Schedule appointments soon.`,
                actionLabel: 'View Vaccinations',
                actionType: 'navigate',
                actionData: { route: '/(tabs)/health' },
                dismissible: false,
                createdAt: today.toISOString(),
                color: '#EF4444',
                backgroundColor: '#FEE2E2',
            });
        }

        // 2. Vaccination Due Soon
        if (metrics.vaccinations.dueSoon > 0 && metrics.vaccinations.overdue === 0) {
            result.push({
                id: 'vaccination-due-soon',
                type: 'preventive',
                severity: 'warning',
                icon: 'vaccines',
                title: 'Vaccinations Due Soon',
                description: `${metrics.vaccinations.dueSoon} vaccination${metrics.vaccinations.dueSoon > 1 ? 's are' : ' is'} due within 30 days.`,
                actionLabel: 'Schedule Now',
                actionType: 'navigate',
                actionData: { route: '/(tabs)/health' },
                dismissible: true,
                createdAt: today.toISOString(),
                color: '#F59E0B',
                backgroundColor: '#FEF3C7',
            });
        }

        // 3. Pet Birthdays Coming Up
        pets.forEach(pet => {
            if (!pet.date_of_birth) return;

            const birthday = new Date(pet.date_of_birth);
            const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
            if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }

            const daysUntil = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (daysUntil >= 0 && daysUntil <= 60) {
                const age = today.getFullYear() - birthday.getFullYear() + 1;
                result.push({
                    id: `birthday-${pet.id}`,
                    type: 'milestone',
                    severity: 'info',
                    icon: 'cake',
                    title: `${pet.name}'s Birthday`,
                    description: `${pet.name} turns ${age} in ${daysUntil} days. Plan something special!`,
                    actionLabel: 'View Profile',
                    actionType: 'navigate',
                    actionData: { route: `/(tabs)/pets/${pet.id}` },
                    petId: pet.id,
                    petName: pet.name,
                    dismissible: true,
                    createdAt: today.toISOString(),
                    color: '#8B5CF6',
                    backgroundColor: '#EDE9FE',
                });
            }
        });

        // 4. Weight Trend Alerts
        if (metrics.weight.trend === 'gaining' && metrics.weight.changePercentage > 10) {
            result.push({
                id: 'weight-gaining',
                type: 'health',
                severity: 'warning',
                icon: 'trending-up',
                title: 'Weight Gain Detected',
                description: `Significant weight gain detected (${metrics.weight.changePercentage.toFixed(1)}%). Consider consulting your vet.`,
                actionLabel: 'View Weight Tracker',
                actionType: 'navigate',
                actionData: { route: '/(tabs)/health' },
                dismissible: true,
                createdAt: today.toISOString(),
                color: '#F59E0B',
                backgroundColor: '#FEF3C7',
            });
        } else if (metrics.weight.trend === 'losing' && metrics.weight.changePercentage > 10) {
            result.push({
                id: 'weight-losing',
                type: 'health',
                severity: 'warning',
                icon: 'trending-down',
                title: 'Weight Loss Detected',
                description: `Significant weight loss detected (${metrics.weight.changePercentage.toFixed(1)}%). Consider consulting your vet.`,
                actionLabel: 'View Weight Tracker',
                actionType: 'navigate',
                actionData: { route: '/(tabs)/health' },
                dismissible: true,
                createdAt: today.toISOString(),
                color: '#F59E0B',
                backgroundColor: '#FEF3C7',
            });
        }

        // 5. Checkup Overdue
        if (metrics.checkups.isOverdue) {
            result.push({
                id: 'checkup-overdue',
                type: 'preventive',
                severity: 'warning',
                icon: 'health-and-safety',
                title: 'Annual Checkup Overdue',
                description: `It's been ${metrics.checkups.daysSinceLastVisit} days since the last checkup. Schedule an appointment.`,
                actionLabel: 'Schedule Visit',
                actionType: 'modal',
                actionData: { modal: 'VisitFormModal' },
                dismissible: false,
                createdAt: today.toISOString(),
                color: '#F59E0B',
                backgroundColor: '#FEF3C7',
            });
        }

        // 6. Active Medications Reminder
        if (metrics.medications.active > 0) {
            result.push({
                id: 'active-medications',
                type: 'health',
                severity: 'info',
                icon: 'medication',
                title: 'Active Medications',
                description: `${metrics.medications.active} active medication${metrics.medications.active > 1 ? 's' : ''} to track. Stay on schedule!`,
                actionLabel: 'View Medications',
                actionType: 'navigate',
                actionData: { route: '/(tabs)/health' },
                dismissible: true,
                createdAt: today.toISOString(),
                color: '#0D9488',
                backgroundColor: '#CCFBF1',
            });
        }

        // 7. Seasonal Care Tips (example: flea & tick season)
        const month = today.getMonth();
        if (month >= 3 && month <= 9) { // April to October
            result.push({
                id: 'seasonal-flea-tick',
                type: 'seasonal',
                severity: 'info',
                icon: 'wb-sunny',
                title: 'Flea & Tick Season',
                description: 'Ensure your pets are protected with preventive medication during peak season.',
                actionLabel: 'Learn More',
                actionType: 'external',
                actionData: { url: 'https://www.avma.org/resources/pet-owners/petcare/fleas-and-ticks' },
                dismissible: true,
                createdAt: today.toISOString(),
                color: '#059669',
                backgroundColor: '#D1FAE5',
            });
        }

        // Sort by severity and date
        return result.sort((a, b) => {
            const severityOrder = { critical: 0, warning: 1, info: 2 };
            if (severityOrder[a.severity] !== severityOrder[b.severity]) {
                return severityOrder[a.severity] - severityOrder[b.severity];
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [pets, vaccinations, treatments, metrics]);

    return {
        insights,
        count: insights.length,
        criticalCount: insights.filter(i => i.severity === 'critical').length,
        warningCount: insights.filter(i => i.severity === 'warning').length,
    };
}
