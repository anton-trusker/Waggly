import { useState, useEffect, useMemo } from 'react';
import { useTreatments } from './useTreatments';
import { useMedicalVisits } from './useMedicalVisits';
import { usePriorityAlerts } from './usePriorityAlerts';
import { usePets } from './usePets';

export interface Priority {
    id: string;
    type: 'medication' | 'appointment' | 'overdue' | 'reminder';
    petId: string;
    petName: string;
    title: string;
    description: string;
    dueTime?: string;
    urgency: 'critical' | 'high' | 'medium';
    completed: boolean;
    icon: string;
    color: string;
}

export function usePriorities() {
    const { treatments, loading: treatmentsLoading } = useTreatments();
    const { visits, loading: visitsLoading } = useMedicalVisits();
    const { alerts, loading: alertsLoading } = usePriorityAlerts(1); // Today only
    const { pets } = usePets();

    const getPetName = (petId: string) => {
        const pet = pets.find(p => p.id === petId);
        return pet?.name || 'Unknown Pet';
    };

    const isToday = (dateString?: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isPast = (dateString?: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const now = new Date();
        return date < now;
    };

    const getTimeUrgency = (dateString?: string): 'critical' | 'high' | 'medium' => {
        if (!dateString) return 'medium';
        const date = new Date(dateString);
        const now = new Date();
        const hoursUntil = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntil < 0) return 'critical'; // Overdue
        if (hoursUntil < 2) return 'critical'; // Due within 2 hours
        if (hoursUntil < 4) return 'high'; // Due within 4 hours
        return 'medium';
    };

    const formatTimeUntil = (dateString?: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const hoursUntil = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
        const minutesUntil = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));

        if (hoursUntil < 0) return 'Overdue';
        if (hoursUntil === 0) return `in ${minutesUntil} min`;
        if (hoursUntil < 24) return `in ${hoursUntil}h`;
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const priorities = useMemo(() => {
        const result: Priority[] = [];

        // Add today's medications
        if (treatments && Array.isArray(treatments)) {
            treatments
                .filter(m => m.is_active && isToday(m.next_dose_date))
                .forEach(m => {
                    result.push({
                        id: `med-${m.id}`,
                        type: 'medication',
                        petId: m.pet_id,
                        petName: getPetName(m.pet_id),
                        title: `${getPetName(m.pet_id)}'s medication ${formatTimeUntil(m.next_dose_date)}`,
                        description: m.treatment_name,
                        dueTime: m.next_dose_date,
                        urgency: getTimeUrgency(m.next_dose_date),
                        completed: false,
                        icon: 'medication',
                        color: '#0D9488'
                    });
                });
        }

        // Add today's appointments
        if (visits && Array.isArray(visits)) {
            visits
                .filter(v => isToday(v.visit_date))
                .forEach(v => {
                    result.push({
                        id: `visit-${v.id}`,
                        type: 'appointment',
                        petId: v.pet_id,
                        petName: getPetName(v.pet_id),
                        title: `${getPetName(v.pet_id)}'s appointment ${formatTimeUntil(v.visit_date)}`,
                        description: v.reason || 'Vet visit',
                        dueTime: v.visit_date,
                        urgency: 'high',
                        completed: false,
                        icon: 'medical-services',
                        color: '#2563EB'
                    });
                });
        }

        // Add overdue items from alerts
        if (alerts && Array.isArray(alerts)) {
            alerts
                .filter(a => a.severity === 'high')
                .forEach(a => {
                    result.push({
                        id: `alert-${a.id}`,
                        type: 'overdue',
                        petId: a.petId,
                        petName: a.petName || getPetName(a.petId),
                        title: a.title,
                        description: a.description || '',
                        urgency: 'critical',
                        completed: false,
                        icon: 'warning',
                        color: '#EF4444'
                    });
                });
        }

        // Sort by urgency and time
        return result.sort((a, b) => {
            const urgencyOrder = { critical: 0, high: 1, medium: 2 };
            if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
                return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
            }
            if (a.dueTime && b.dueTime) {
                return new Date(a.dueTime).getTime() - new Date(b.dueTime).getTime();
            }
            return 0;
        });
    }, [treatments, visits, alerts, pets]);

    return {
        priorities,
        loading: treatmentsLoading || visitsLoading || alertsLoading,
        count: priorities.length,
        criticalCount: priorities.filter(p => p.urgency === 'critical').length,
    };
}
