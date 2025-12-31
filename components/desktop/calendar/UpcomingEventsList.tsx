import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';

interface Event {
    id: string;
    title: string;
    type: 'vaccination' | 'treatment' | 'vet' | 'grooming' | 'walking' | 'other';
    dueDate: string;
    time?: string;
    petId?: string;
    petName?: string;
    notes?: string;
    description?: string;
}

interface UpcomingEventsListProps {
    events: Event[];
    onEventClick?: (event: Event) => void;
}

const EVENT_TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
    vaccination: { icon: 'syringe', color: designSystem.colors.success[500], label: 'Vaccination' },
    treatment: { icon: 'pill', color: designSystem.colors.warning[500], label: 'Treatment' },
    vet: { icon: 'medical-bag', color: designSystem.colors.primary[500], label: 'Vet Visit' },
    grooming: { icon: 'cut', color: designSystem.colors.secondary.leaf, label: 'Grooming' },
    walking: { icon: 'walk', color: designSystem.colors.primary[400], label: 'Walking' },
    other: { icon: 'calendar', color: designSystem.colors.neutral[500], label: 'Event' },
};

export default function UpcomingEventsList({ events, onEventClick }: UpcomingEventsListProps) {
    // Normalize events - convert dueDate string to Date object for sorting/filtering
    const normalizedEvents = events.map(e => ({
        ...e,
        date: new Date(e.dueDate)
    })).filter(e => !isNaN(e.date.getTime()));

    const sortedEvents = [...normalizedEvents].sort((a, b) => a.date.getTime() - b.date.getTime());

    const upcomingEvents = sortedEvents.filter(event => !isPast(event.date) || isToday(event.date));
    const pastEvents = sortedEvents.filter(event => isPast(event.date) && !isToday(event.date));

    const getDateLabel = (date: Date) => {
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        if (isThisWeek(date)) return format(date, 'EEEE');
        return format(date, 'MMM dd, yyyy');
    };

    const renderEvent = (event: Event & { date: Date }) => {
        const config = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.other;
        const isPastEvent = isPast(event.date) && !isToday(event.date);

        return (
            <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, isPastEvent && styles.eventCardPast]}
                onPress={() => onEventClick?.(event)}
                activeOpacity={0.7}
            >
                <View style={[styles.eventIndicator, { backgroundColor: config.color }]} />

                <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                        <View style={styles.eventTitleRow}>
                            <IconSymbol
                                ios_icon_name="calendar"
                                android_material_icon_name="event"
                                size={16}
                                color={config.color}
                            />
                            <Text style={[styles.eventTitle, isPastEvent && styles.textMuted]}>
                                {event.title}
                            </Text>
                        </View>
                        <View style={[styles.typeBadge, { backgroundColor: `${config.color}15` }]}>
                            <Text style={[styles.typeBadgeText, { color: config.color }]}>
                                {config.label}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.eventDetails}>
                        <View style={styles.eventDetailRow}>
                            <IconSymbol
                                ios_icon_name="clock"
                                android_material_icon_name="schedule"
                                size={14}
                                color={designSystem.colors.text.tertiary}
                            />
                            <Text style={[styles.eventDetailText, isPastEvent && styles.textMuted]}>
                                {getDateLabel(event.date)}
                                {event.time && ` • ${event.time}`}
                            </Text>
                        </View>

                        {event.petName && (
                            <View style={styles.eventDetailRow}>
                                <IconSymbol
                                    ios_icon_name="pawprint"
                                    android_material_icon_name="pets"
                                    size={14}
                                    color={designSystem.colors.text.tertiary}
                                />
                                <Text style={[styles.eventDetailText, isPastEvent && styles.textMuted]}>
                                    {event.petName}
                                </Text>
                            </View>
                        )}
                    </View>

                    {(event.notes || event.description) && (
                        <Text style={[styles.eventDescription, isPastEvent && styles.textMuted]} numberOfLines={2}>
                            {event.notes || event.description}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Upcoming Events</Text>
                <Text style={styles.headerSubtitle}>
                    {upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''} scheduled
                </Text>
            </View>

            {upcomingEvents.length === 0 && pastEvents.length === 0 ? (
                <View style={styles.emptyState}>
                    <IconSymbol
                        ios_icon_name="calendar"
                        android_material_icon_name="event"
                        size={48}
                        color={designSystem.colors.text.tertiary}
                    />
                    <Text style={styles.emptyTitle}>No events scheduled</Text>
                    <Text style={styles.emptySubtitle}>Add your first event to get started</Text>
                </View>
            ) : (
                <>
                    {upcomingEvents.length > 0 && (
                        <View style={styles.section}>
                            {upcomingEvents.map(renderEvent)}
                        </View>
                    )}

                    {pastEvents.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Past Events</Text>
                            {pastEvents.slice(0, 5).map(renderEvent)}
                        </View>
                    )}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: designSystem.colors.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    eventCard: {
        flexDirection: 'row',
        backgroundColor: designSystem.colors.neutral[0],
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        ...designSystem.shadows.sm,
    },
    eventCardPast: {
        opacity: 0.6,
    },
    eventIndicator: {
        width: 4,
    },
    eventContent: {
        flex: 1,
        padding: 16,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    eventTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
        flex: 1,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    eventDetails: {
        gap: 6,
        marginBottom: 8,
    },
    eventDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    eventDetailText: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
    },
    eventDescription: {
        fontSize: 14,
        color: designSystem.colors.text.tertiary,
        lineHeight: 20,
    },
    textMuted: {
        opacity: 0.7,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
        marginTop: 16,
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
    },
});
