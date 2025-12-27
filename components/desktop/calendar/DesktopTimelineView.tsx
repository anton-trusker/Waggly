import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { CalendarEvent } from '@/types'; // Assuming this exists or using Event type

interface DesktopTimelineViewProps {
    events: CalendarEvent[];
    currentMonth: Date;
    onEventClick: (event: CalendarEvent) => void;
}

export default function DesktopTimelineView({ events, currentMonth, onEventClick }: DesktopTimelineViewProps) {
    // Filter events for the current month
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.dueDate || a.date).getTime() - new Date(b.dueDate || b.date).getTime());

    // Group by date
    const groupedEvents = sortedEvents.reduce((acc, event) => {
        const date = new Date(event.dueDate || event.date);
        // Only include events in current month
        if (date >= monthStart && date <= monthEnd) {
            const dateStr = format(date, 'yyyy-MM-dd');
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(event);
        }
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    const dates = Object.keys(groupedEvents).sort();

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'food': return 'nutrition';
            case 'medical':
            case 'treatment': return 'medkit';
            case 'checkup':
            case 'vet': return 'medical';
            case 'grooming': return 'cut';
            case 'vaccination': return 'bandage';
            case 'walking': return 'walk';
            default: return 'paw';
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'food': return '#4ADE80';
            case 'medical':
            case 'treatment': return '#EF4444';
            case 'checkup':
            case 'vet': return '#3B82F6';
            case 'grooming': return '#A855F7';
            case 'vaccination': return '#F97316';
            case 'walking': return '#10B981';
            default: return '#94A3B8';
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {dates.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="calendar-outline" size={64} color="#CBD5E1" />
                    <Text style={styles.emptyStateText}>No upcoming events for {format(currentMonth, 'MMMM')}</Text>
                </View>
            ) : (
                dates.map((dateStr) => {
                    const date = parseISO(dateStr);
                    const dayEvents = groupedEvents[dateStr];
                    const isToday = isSameDay(date, new Date());

                    return (
                        <View key={dateStr} style={styles.daySection}>
                            {/* Date Header */}
                            <View style={styles.dateHeader}>
                                <Text style={[styles.dayName, isToday && styles.todayText]}>
                                    {format(date, 'EEEE, d MMMM')}
                                </Text>
                                {isToday && (
                                    <View style={styles.todayBadge}>
                                        <Text style={styles.todayTextWhite}>Today</Text>
                                    </View>
                                )}
                            </View>

                            {/* Events List */}
                            <View style={styles.eventsList}>
                                {dayEvents.map((event, index) => (
                                    <TouchableOpacity
                                        key={event.id || index}
                                        style={styles.eventCard}
                                        onPress={() => onEventClick(event)}
                                    >
                                        <View style={[styles.colorStrip, { backgroundColor: getEventColor(event.type) }]} />

                                        <View style={styles.cardContent}>
                                            <View style={styles.headerRow}>
                                                <Text style={styles.eventTitle}>{event.title}</Text>
                                                <Text style={styles.eventTime}>{format(new Date(event.dueDate || event.date), 'h:mm a')}</Text>
                                            </View>

                                            <View style={styles.detailsRow}>
                                                <View style={styles.badge}>
                                                    <Ionicons name={getEventIcon(event.type) as any} size={12} color={getEventColor(event.type)} />
                                                    <Text style={[styles.badgeText, { color: getEventColor(event.type) }]}>
                                                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                                    </Text>
                                                </View>
                                                {event.petName && (
                                                    <View style={styles.petBadge}>
                                                        <Ionicons name="paw" size={12} color="#64748B" />
                                                        <Text style={styles.petName}>{event.petName}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.actionIcon}>
                                            <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    );
                })
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: 24,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 18,
        color: '#64748B',
    },
    daySection: {
        marginBottom: 24,
    },
    dateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    dayName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#64748B',
    },
    todayBadge: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    todayText: {
        color: '#3B82F6',
    },
    todayTextWhite: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    eventsList: {
        gap: 12,
    },
    eventCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    colorStrip: {
        width: 6,
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    eventTime: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    petBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    petName: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    actionIcon: {
        justifyContent: 'center',
        paddingRight: 16,
    },
});
