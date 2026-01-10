import { usePets } from './usePets';
import { usePriorityAlerts } from './usePriorityAlerts';
import { useActivityFeed } from './useActivityFeed';
import { useEvents } from './useEvents';
import { useTreatments } from './useTreatments';
import { usePriorities } from './usePriorities';
import { useHealthMetrics } from './useHealthMetrics';
import { useInsights } from './useInsights';

/**
 * Unified hook for dashboard data
 * Aggregates all data sources needed for the dashboard
 */
export function useDashboardData() {
    const { pets, loading: petsLoading } = usePets();
    const { alerts, loading: alertsLoading } = usePriorityAlerts(7);
    const { activities, loading: activitiesLoading } = useActivityFeed(20);
    const { events, loading: eventsLoading } = useEvents();
    const { treatments, loading: treatmentsLoading } = useTreatments();
    const { priorities, loading: prioritiesLoading } = usePriorities();
    const { metrics, loading: metricsLoading } = useHealthMetrics();
    const { insights } = useInsights();

    const loading =
        petsLoading ||
        alertsLoading ||
        activitiesLoading ||
        eventsLoading ||
        treatmentsLoading ||
        prioritiesLoading ||
        metricsLoading;

    return {
        // Core data
        pets,
        alerts,
        activities,
        events,
        treatments,

        // Computed data
        priorities,
        metrics,
        insights,

        // Loading states
        loading,

        // Individual loading states (for granular control)
        loadingStates: {
            pets: petsLoading,
            alerts: alertsLoading,
            activities: activitiesLoading,
            events: eventsLoading,
            treatments: treatmentsLoading,
            priorities: prioritiesLoading,
            metrics: metricsLoading,
        },
    };
}
