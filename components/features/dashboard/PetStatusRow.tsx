import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { BehaviorWidget } from '@/components/widgets/BehaviorWidget';
import { ActivityWidget } from '@/components/widgets/ActivityWidget';
import { AppointmentsWidget } from '@/components/widgets/AppointmentsWidget';
import { MedicalRecordsWidget } from '@/components/widgets/MedicalRecordsWidget';
import { WeightWidget } from '@/components/widgets/WeightWidget';
import { usePetBehavior } from '@/hooks/usePetBehavior';
import { useEvents } from '@/hooks/useEvents';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { useMedications } from '@/hooks/useMedications';
import { useVaccinations } from '@/hooks/useVaccinations';
import { Pet } from '@/types';

interface PetStatusRowProps {
    pet?: Pet;
}

export default function PetStatusRow({ pet }: PetStatusRowProps) {
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1024;

    const { behaviorTags, loading: behaviorLoading } = usePetBehavior(pet?.id);
    const { events } = useEvents();
    const { activities } = useActivityFeed(10, pet?.id || '');
    const { weightEntries } = useWeightEntries(pet?.id || null);
    const { medications } = useMedications(pet?.id || '');
    const { vaccinations } = useVaccinations(pet?.id || null);

    // Calculate metrics

    // Calculate metrics
    const upcomingAppointments = useMemo(() => {
        const upcoming = events.filter(e => new Date(e.dueDate) > new Date());
        const next = upcoming.length > 0 ? new Date(upcoming[0].dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : undefined;
        return { count: upcoming.length, nextDate: next };
    }, [events]);

    const recentActivityCount = useMemo(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return activities.filter(a => new Date(a.timestamp) > oneWeekAgo).length;
    }, [activities]);

    const latestActivity = activities.length > 0 ? activities[0].description : undefined;

    const activeMedications = medications.filter(m => !m.end_date || new Date(m.end_date) > new Date()).length;

    const vaccinationsUpToDate = useMemo(() => {
        const now = new Date();
        return vaccinations.every(v => !v.next_due_date || new Date(v.next_due_date) > now);
    }, [vaccinations]);

    const weightTrend = useMemo(() => {
        if (weightEntries.length < 2) return {
            current: weightEntries[0]?.weight ? `${weightEntries[0].weight} ${pet?.weight_unit || 'kg'}` : undefined,
            trend: 'stable' as const,
            changePercent: 0
        };

        const latest = weightEntries[0];
        const previous = weightEntries[1];
        const change = latest.weight - previous.weight;
        const changePercent = (change / previous.weight) * 100;

        return {
            current: `${latest.weight} ${pet?.weight_unit || 'kg'}`,
            trend: change > 0.5 ? 'up' as const : change < -0.5 ? 'down' as const : 'stable' as const,
            changePercent
        };
    }, [weightEntries]);

    if (!pet) return null;

    return (
        <View style={[styles.widgetGrid, isLargeScreen && styles.widgetGridDesktop]}>
            <BehaviorWidget
                tags={behaviorTags}
                loading={behaviorLoading}
            />
            <ActivityWidget
                activityCount={recentActivityCount}
                latestActivity={latestActivity}
            />
            <AppointmentsWidget
                upcomingCount={upcomingAppointments.count}
                nextDate={upcomingAppointments.nextDate}
            />
            <MedicalRecordsWidget
                vaccinationsUpToDate={vaccinationsUpToDate}
                activeMedications={activeMedications}
            />
            <WeightWidget
                currentWeight={weightTrend.current}
                trend={weightTrend.trend}
                changePercent={weightTrend.changePercent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    widgetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
        paddingHorizontal: 4,
        justifyContent: 'center',
    },
    widgetGridDesktop: {
        maxWidth: 900,
        alignSelf: 'center',
        width: '100%',
    },
});
