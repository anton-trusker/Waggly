import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useMedications } from '@/hooks/useMedications';
import { useMedicalVisits } from '@/hooks/useMedicalVisits';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { format } from 'date-fns';
import { useLocale } from '@/hooks/useLocale';

import { useDocuments } from '@/hooks/useDocuments';
import { useConditions } from '@/hooks/useConditions';

type EventType = 'all' | 'vaccination' | 'visit' | 'medication' | 'weight' | 'document' | 'condition' | 'profile';

interface TimelineEvent {
    id: string;
    type: EventType;
    title: string;
    description?: string;
    date: Date;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
}

export default function HistoryTab() {
    const { t, locale } = useLocale();
    const params = useLocalSearchParams();
    const petId = params.id as string;
    const { pets } = usePets();
    const { vaccinations, refreshVaccinations } = useVaccinations(petId);
    const { medications, fetchMedications } = useMedications(petId);
    const { visits, fetchVisits } = useMedicalVisits(petId);
    const { weightEntries, refreshWeightEntries } = useWeightEntries(petId);
    const { documents, fetchDocuments } = useDocuments(petId);
    const { conditions, refreshConditions } = useConditions(petId);

    const [filter, setFilter] = useState<EventType>('all');
    const pet = pets.find(p => p.id === petId);

    // Fetch medical visits on mount and focus
    useFocusEffect(
        useCallback(() => {
            if (petId) {
                fetchVisits();
                refreshVaccinations?.();
                fetchMedications?.();
                refreshWeightEntries?.();
                fetchDocuments?.();
                refreshConditions?.();
            }
        }, [petId, fetchVisits, refreshVaccinations, fetchMedications, refreshWeightEntries, fetchDocuments, refreshConditions])
    );

    // Combine all events into timeline
    const allEvents = useMemo(() => {
        const events: TimelineEvent[] = [];

        // Add vaccinations
        (vaccinations || []).forEach((v: any) => {
            events.push({
                id: `vacc-${v.id}`,
                type: 'vaccination',
                id: `vacc-${v.id}`,
                type: 'vaccination',
                title: v.vaccine_name || t('pet_profile.history.filters.vaccinations'),
                description: v.notes || `Batch: ${v.batch_number || t('common.na')}`,
                date: new Date(v.date_given || v.created_at),
                icon: 'medical',
                color: '#EC4899',
                bgColor: '#FDF2F8',
            });
        });

        // Add medications
        (medications || []).forEach((m: any) => {
            events.push({
                id: `med-${m.id}`,
                type: 'medication',
                id: `med-${m.id}`,
                type: 'medication',
                title: m.medication_name || t('pet_profile.history.filters.medications'),
                description: `${m.dosage_value || ''} ${m.dosage_unit || ''} - ${m.frequency || ''}`.trim(),
                date: new Date(m.start_date || m.created_at),
                icon: 'medkit',
                color: '#8B5CF6',
                bgColor: '#F5F3FF',
            });
        });

        // Add visits
        (visits || []).forEach((v: any) => {
            events.push({
                id: `visit-${v.id}`,
                type: 'visit',
                id: `visit-${v.id}`,
                type: 'visit',
                title: v.visit_type || t('pet_profile.history.filters.visits'),
                description: v.notes || `Visit to ${v.clinic_name || 'clinic'}`,
                date: new Date(v.visit_date || v.created_at),
                icon: 'calendar',
                color: '#3B82F6',
                bgColor: '#EFF6FF',
            });
        });

        // Add weight logs
        (weightEntries || []).forEach((w: any) => {
            events.push({
                id: `weight-${w.id}`,
                type: 'weight',
                id: `weight-${w.id}`,
                type: 'weight',
                title: t('pet_profile.history.filters.weight'),
                description: `${w.weight} ${w.unit || 'kg'}`,
                date: new Date(w.recorded_at || w.created_at),
                icon: 'fitness',
                color: '#10B981',
                bgColor: '#ECFDF5',
            });
        });

        // Add documents
        (documents || []).forEach((d: any) => {
            events.push({
                id: `doc-${d.id}`,
                type: 'document',
                title: d.name || t('common.document'),
                description: d.type ? t(`documents.types.${d.type}` as any) : undefined,
                date: new Date(d.created_at),
                icon: 'document-text',
                color: '#F59E0B',
                bgColor: '#FFFBEB',
            });
        });

        // Add conditions
        (conditions || []).forEach((c: any) => {
            events.push({
                id: `cond-${c.id}`,
                type: 'condition',
                title: c.name,
                description: `${t('pet_profile.health.status')}: ${c.status || t('common.active')}`,
                date: new Date(c.diagnosed_date || c.created_at),
                icon: 'pulse',
                color: '#DC2626',
                bgColor: '#FEF2F2',
            });
        });

        // Add profile creation
        if (pet?.created_at) {
            events.push({
                id: `profile-${pet.id}`,
                type: 'profile',
                title: t('pet_profile.profile_created'),
                description: t('pet_profile.welcome_message', { name: pet.name }),
                date: new Date(pet.created_at),
                icon: 'heart',
                color: '#EC4899',
                bgColor: '#FDF2F8',
            });
        }


        // Sort by date descending
        return events.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [vaccinations, medications, visits, weightEntries, documents, conditions, pet]);

    const filteredEvents = filter === 'all'
        ? allEvents
        : allEvents.filter(e => e.type === filter);

    const filterOptions: { key: EventType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
        { key: 'all', label: t('pet_profile.history.filters.all'), icon: 'list' },
        { key: 'vaccination', label: t('pet_profile.history.filters.vaccinations'), icon: 'medical' },
        { key: 'visit', label: t('pet_profile.history.filters.visits'), icon: 'calendar' },
        { key: 'medication', label: t('pet_profile.history.filters.medications'), icon: 'medkit' },
        { key: 'condition', label: t('pet_profile.history.filters.conditions'), icon: 'pulse' },
        { key: 'document', label: t('common.documents'), icon: 'document-text' },
        { key: 'weight', label: t('pet_profile.history.filters.weight'), icon: 'fitness' },
    ];

    if (!pet) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>{t('pet_profile.history.empty.pet_not_found')}</Text>
                    <Text style={styles.emptyDesc}>{t('pet_profile.history.empty.load_error')}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Filters */}
            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                    {filterOptions.map(opt => (
                        <TouchableOpacity
                            key={opt.key}
                            style={[
                                styles.filterChip,
                                filter === opt.key && styles.filterChipActive
                            ] as any}
                            onPress={() => setFilter(opt.key)}
                        >
                            <Ionicons
                                name={opt.icon}
                                size={16}
                                color={filter === opt.key ? '#fff' : '#6B7280'}
                            />
                            <Text style={[
                                styles.filterChipText,
                                filter === opt.key && styles.filterChipTextActive
                            ]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Timeline */}
            <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
                <View style={styles.timelineContent}>
                    {filteredEvents.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="time-outline" size={48} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>{t('pet_profile.history.empty.title')}</Text>
                            <Text style={styles.emptyDesc}>
                                {t('pet_profile.history.empty.desc')}
                            </Text>
                        </View>
                    ) : (
                        filteredEvents.map((event, index) => (
                            <View key={event.id} style={styles.timelineItem}>
                                {/* Timeline line */}
                                {index < filteredEvents.length - 1 && (
                                    <View style={styles.timelineLine} />
                                )}

                                {/* Event dot */}
                                <View style={[styles.eventDot, { backgroundColor: event.color }]}>
                                    <Ionicons name={event.icon} size={14} color="#fff" />
                                </View>

                                {/* Event card */}
                                <View style={styles.eventCard}>
                                    <View style={styles.eventHeader}>
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.eventTitleRow}>
                                                <Text style={styles.eventTitle}>{event.title}</Text>
                                                <View style={[styles.eventTypeBadge, { backgroundColor: event.bgColor }]}>
                                                    <Text style={[styles.eventTypeText, { color: event.color }]}>
                                                        {t(`pet_profile.history.filters.${event.type}` as any).toUpperCase()}
                                                    </Text>
                                                </View>
                                            </View>
                                            {event.description && (
                                                <Text style={styles.eventDesc}>{event.description}</Text>
                                            )}
                                        </View>
                                        <Text style={styles.eventDate}>
                                            {event.date.toLocaleDateString(locale, { month: 'short', day: '2-digit' })}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    filtersContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 16,
    },
    filters: {
        paddingHorizontal: 32,
        gap: 12,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#4F46E5',
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    timeline: {
        flex: 1,
    },
    timelineContent: {
        padding: 32,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
    },
    emptyDesc: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 24,
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        left: 15,
        top: 36,
        bottom: -24,
        width: 2,
        backgroundColor: '#E5E7EB',
    },
    eventDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        zIndex: 1,
    },
    eventCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    eventTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    eventTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    eventTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    eventTypeText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    eventDesc: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    eventDate: {
        fontSize: 13,
        fontWeight: '500',
        color: '#9CA3AF',
    },
});
