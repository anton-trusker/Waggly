import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';

interface Event {
    id: string;
    title: string;
    date: string | Date; // ISO string or Date object
    type: 'vaccination' | 'checkup' | 'grooming' | 'medication' | 'surgery' | 'training' | 'food' | 'other';
    pet?: {
        name: string;
        photo_url?: string;
        species?: string;
    };
    completed?: boolean;
}

interface TimelineViewProps {
    events: Event[];
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

export default function TimelineView({ events, selectedDate, onDateSelect }: TimelineViewProps) {
    // Generate next 7 days for the horizontal strip
    const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

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

    // Group events by day (Today, Tomorrow, Later)
    // For this view, we might want to just show the selected date's events OR a continuous list.
    // The design image shows "Today, Oct 24" and "Tomorrow, Oct 25" in one scroll view.
    // So let's group all upcoming events.
    
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const groupedEvents = sortedEvents.reduce((acc, event) => {
        const date = new Date(event.date);
        const dateStr = format(date, 'yyyy-MM-dd');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(event);
        return acc;
    }, {} as Record<string, Event[]>);

    const dates = Object.keys(groupedEvents).sort();

    return (
        <View style={styles.container}>
            {/* Horizontal Date Strip */}
            <View style={styles.dateStripContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateStripContent}>
                    {days.map((date) => {
                        const isSelected = isSameDay(date, selectedDate);
                        return (
                            <TouchableOpacity 
                                key={date.toISOString()} 
                                style={[styles.dateItem, isSelected && styles.dateItemActive]}
                                onPress={() => onDateSelect(date)}
                            >
                                <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                                    {format(date, 'EEE').toUpperCase()}
                                </Text>
                                <Text style={[styles.dayNumber, isSelected && styles.dayNumberActive]}>
                                    {format(date, 'd')}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Events List */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {dates.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No upcoming events</Text>
                    </View>
                ) : (
                    dates.map((dateStr) => {
                        const date = parseISO(dateStr);
                        const dayEvents = groupedEvents[dateStr];
                        let title = format(date, 'EEEE, MMM d');
                        if (isSameDay(date, new Date())) title = `Today, ${format(date, 'MMM d')}`;
                        if (isSameDay(date, addDays(new Date(), 1))) title = `Tomorrow, ${format(date, 'MMM d')}`;

                        return (
                            <View key={dateStr} style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>{title}</Text>
                                    <View style={styles.eventCountBadge}>
                                        <Text style={styles.eventCountText}>{dayEvents.length} events</Text>
                                    </View>
                                </View>
                                
                                {dayEvents.map((event) => (
                                    <View key={event.id} style={styles.card}>
                                        <View style={[styles.indicatorLine, { backgroundColor: getEventColor(event.type) }]} />
                                        <View style={styles.cardContent}>
                                            <View style={styles.petAvatar}>
                                                {event.pet?.photo_url ? (
                                                    <Image source={{ uri: event.pet.photo_url }} style={styles.avatar} />
                                                ) : (
                                                    <View style={styles.avatarPlaceholder}>
                                                        <Text style={styles.avatarEmoji}>
                                                            {event.pet?.species === 'cat' ? '🐈' : '🐕'}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={styles.eventDetails}>
                                                <Text style={styles.eventTitle}>{event.title}</Text>
                                                <Text style={styles.eventTime}>
                                                    {format(new Date(event.date), 'hh:mm a')} • {event.pet?.name || 'Pet'}
                                                </Text>
                                                {event.completed && (
                                                    <View style={styles.completedBadge}>
                                                        <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                                                        <Text style={styles.completedText}>Done</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={[styles.typeIcon, { backgroundColor: `${getEventColor(event.type)}20` }]}>
                                                <Ionicons name={getEventIcon(event.type) as any} size={20} color={getEventColor(event.type)} />
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        );
                    })
                )}
                <View style={{ height: 100 }} /> 
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    dateStripContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
    },
    dateStripContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    dateItem: {
        width: 50,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dateItemActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    dayName: {
        fontSize: 10,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 2,
    },
    dayNameActive: {
        color: '#fff',
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    dayNumberActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        color: '#64748B',
        fontSize: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    eventCountBadge: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    eventCountText: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '600',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    indicatorLine: {
        width: 4,
        height: '100%',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    petAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF2FF',
    },
    avatarEmoji: {
        fontSize: 18,
    },
    eventDetails: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 2,
    },
    eventTime: {
        fontSize: 12,
        color: '#64748B',
    },
    typeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    completedText: {
        fontSize: 10,
        color: '#10B981',
        fontWeight: '500',
    },
});
