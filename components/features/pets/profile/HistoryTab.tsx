
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useMedications } from '@/hooks/useMedications';
import { useMedicalVisits } from '@/hooks/useMedicalVisits';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { format } from 'date-fns';

type EventType = 'all' | 'vaccination' | 'visit' | 'medication' | 'weight' | 'document' | 'update' | 'other';

interface TimelineEvent {
    id: string;
    type: EventType;
    title: string;
    description?: string;
    date: Date;
    icon: string; // Using IconSymbol names (SF Symbol / Material mapped)
    materialIcon: string;
    color: string;
    bgColor: string;
}

interface HistoryTabProps {
    petId: string;
}

export default function HistoryTab({ petId }: HistoryTabProps) {
    const { theme } = useAppTheme();

    // Data Fetching
    const { vaccinations } = useVaccinations(petId);
    const { medications } = useMedications(petId);
    const { visits, fetchVisits } = useMedicalVisits(petId);
    const { weightEntries } = useWeightEntries(petId);
    const { activities } = useActivityFeed(50, petId);

    const [filter, setFilter] = useState<EventType>('all');

    // Fetch visits on mount
    useEffect(() => {
        if (petId && fetchVisits) {
            fetchVisits();
        }
    }, [petId, fetchVisits]);

    // Combine and process events
    const allEvents = useMemo(() => {
        const events: TimelineEvent[] = [];

        // Vaccinations
        (vaccinations || []).forEach((v: any) => {
            events.push({
                id: `vacc-${v.id}`,
                type: 'vaccination',
                title: v.vaccine_name || 'Vaccination',
                description: v.notes || `Batch: ${v.batch_number || 'N/A'}`,
                date: new Date(v.date_given || v.created_at),
                icon: 'syringe',
                materialIcon: 'vaccines',
                color: '#EC4899', // Pink
                bgColor: '#FDF2F8',
            });
        });

        // Medications
        (medications || []).forEach((m: any) => {
            events.push({
                id: `med-${m.id}`,
                type: 'medication',
                title: m.medication_name || 'Medication',
                description: `${m.dosage_value || ''} ${m.dosage_unit || ''} - ${m.frequency || ''}`.trim(),
                date: new Date(m.start_date || m.created_at),
                icon: 'pills.fill',
                materialIcon: 'medication',
                color: '#8B5CF6', // Purple
                bgColor: '#F5F3FF',
            });
        });

        // Visits
        (visits || []).forEach((v: any) => {
            events.push({
                id: `visit-${v.id}`,
                type: 'visit',
                title: v.visit_type || 'Vet Visit',
                description: v.notes || `Visit to ${v.clinic_name || 'clinic'}`,
                date: new Date(v.visit_date || v.created_at),
                icon: 'stethoscope',
                materialIcon: 'medical-services',
                color: '#3B82F6', // Blue
                bgColor: '#EFF6FF',
            });
        });

        // Weight Logs
        (weightEntries || []).forEach((w: any) => {
            events.push({
                id: `weight-${w.id}`,
                type: 'weight',
                title: 'Weight Logged',
                description: `${w.weight} ${w.unit || 'kg'}`,
                date: new Date(w.recorded_at || w.created_at),
                icon: 'scalemass',
                materialIcon: 'monitor-weight',
                color: '#10B981', // Emerald
                bgColor: '#ECFDF5',
            });
        });

        // Activity Logs (Filtered to avoid duplicates for types already handled)
        // We include 'document', 'photo', 'update', 'treatment', 'other'
        // We skip 'vaccination', 'medication', 'visit', 'weight' as they are handled by specific hooks
        activities.forEach(a => {
            if (['vaccination', 'medication', 'visit', 'weight'].includes(a.type)) return;

            // Map activity type to EventType
            let type: EventType = 'other';
            if (a.type === 'document' || a.type === 'photo') type = 'document';
            if (a.type === 'update') type = 'update';

            events.push({
                id: `act-${a.id}`,
                type: type,
                title: a.title,
                description: a.description,
                date: new Date(a.timestamp),
                icon: a.icon || 'star', // fallback
                materialIcon: 'star',
                color: theme.colors.text.secondary,
                bgColor: theme.colors.background.secondary,
            });
        });

        return events.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [vaccinations, medications, visits, weightEntries, activities, theme]);

    const filteredEvents = filter === 'all'
        ? allEvents
        : allEvents.filter(e => e.type === filter);

    const filterOptions: { key: EventType; label: string; icon: string; materialIcon: string }[] = [
        { key: 'all', label: 'All', icon: 'list.bullet', materialIcon: 'list' },
        { key: 'vaccination', label: 'Vaccines', icon: 'syringe', materialIcon: 'vaccines' },
        { key: 'visit', label: 'Visits', icon: 'stethoscope', materialIcon: 'medical-services' },
        { key: 'medication', label: 'Meds', icon: 'pills.fill', materialIcon: 'medication' },
        { key: 'weight', label: 'Weight', icon: 'scalemass', materialIcon: 'monitor-weight' },
        { key: 'document', label: 'Docs', icon: 'doc.text', materialIcon: 'description' },
        { key: 'update', label: 'Updates', icon: 'pencil', materialIcon: 'edit' },
    ];

    return (
        <View style={styles.container}>
            {/* Filters */}
            <View style={[styles.filtersContainer, { borderBottomColor: theme.colors.border.secondary, backgroundColor: theme.colors.background.primary }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                    {filterOptions.map(opt => {
                        const isActive = filter === opt.key;
                        return (
                            <TouchableOpacity
                                key={opt.key}
                                style={[
                                    styles.filterChip,
                                    isActive ? { backgroundColor: theme.colors.primary[500] } : { backgroundColor: theme.colors.background.secondary }
                                ] as any}
                                onPress={() => setFilter(opt.key)}
                            >
                                <IconSymbol
                                    name={opt.icon as any}
                                    android_material_icon_name={opt.materialIcon as any}
                                    size={16}
                                    color={isActive ? '#fff' : theme.colors.text.secondary}
                                />
                                <Text style={[
                                    styles.filterChipText,
                                    isActive ? { color: '#fff' } : { color: theme.colors.text.secondary }
                                ]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Timeline */}
            <ScrollView style={[styles.timeline, { backgroundColor: theme.colors.background.secondary }]} showsVerticalScrollIndicator={false}>
                <View style={styles.timelineContent}>
                    {filteredEvents.length === 0 ? (
                        <View style={styles.emptyState}>
                            <IconSymbol name="clock" android_material_icon_name="history" size={48} color={theme.colors.gray[300]} />
                            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>No History Yet</Text>
                            <Text style={[styles.emptyDesc, { color: theme.colors.text.tertiary }]}>
                                Events like vaccinations, visits, and weight logs will appear here
                            </Text>
                        </View>
                    ) : (
                        filteredEvents.map((event, index) => (
                            <View key={event.id} style={styles.timelineItem}>
                                {/* Timeline line */}
                                {index < filteredEvents.length - 1 && (
                                    <View style={[styles.timelineLine, { backgroundColor: theme.colors.border.secondary }]} />
                                )}

                                {/* Event dot */}
                                <View style={[styles.eventDot, { backgroundColor: event.color }]}>
                                    <IconSymbol name={event.icon as any} android_material_icon_name={event.materialIcon as any} size={14} color="#fff" />
                                </View>

                                {/* Event card */}
                                <View style={[styles.eventCard, { backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.secondary }]}>
                                    <View style={styles.eventHeader}>
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.eventTitleRow}>
                                                <Text style={[styles.eventTitle, { color: theme.colors.text.primary }]}>{event.title}</Text>
                                                <View style={[styles.eventTypeBadge, { backgroundColor: event.bgColor }]}>
                                                    <Text style={[styles.eventTypeText, { color: event.color }]}>
                                                        {event.type.toUpperCase()}
                                                    </Text>
                                                </View>
                                            </View>
                                            {event.description && (
                                                <Text style={[styles.eventDesc, { color: theme.colors.text.secondary }]}>{event.description}</Text>
                                            )}
                                        </View>
                                        <Text style={[styles.eventDate, { color: theme.colors.text.tertiary }]}>
                                            {format(event.date, 'MMM dd')}
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
    },
    filtersContainer: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    filters: {
        paddingHorizontal: 24,
        gap: 12,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    timeline: {
        flex: 1,
    },
    timelineContent: {
        padding: 24,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptyDesc: {
        fontSize: 14,
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
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
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
        marginTop: 2,
    },
    eventDate: {
        fontSize: 13,
        fontWeight: '500',
    },
});
