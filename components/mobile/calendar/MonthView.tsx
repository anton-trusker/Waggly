import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval, 
    isSameMonth, 
    isSameDay, 
    isToday, 
    addMonths, 
    subMonths 
} from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import TimelineView from './TimelineView'; // Reuse the event list part? Or just the styling?
// Actually, I can just render the list of events for the selected day using the same style logic or component.
// But to be cleaner, I'll inline the list rendering or extract a reusable `EventList` later.
// For now, I'll just map over the filtered events.

interface Event {
    id: string;
    title: string;
    date: string | Date;
    type: 'vaccination' | 'checkup' | 'grooming' | 'medication' | 'surgery' | 'training' | 'food' | 'other';
    pet?: {
        name: string;
        photo_url?: string;
        species?: string;
    };
    completed?: boolean;
}

interface MonthViewProps {
    events: Event[];
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

export default function MonthView({ events, currentMonth, onMonthChange, selectedDate, onDateSelect }: MonthViewProps) {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const handlePrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
    const handleNextMonth = () => onMonthChange(addMonths(currentMonth, 1));

    // Filter events for the selected date
    const selectedDateEvents = events.filter(event => isSameDay(new Date(event.date), selectedDate));

    // Get events map for dots
    const eventsMap = events.reduce((acc, event) => {
        const dateStr = format(new Date(event.date), 'yyyy-MM-dd');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(event);
        return acc;
    }, {} as Record<string, Event[]>);

    return (
        <View style={styles.container}>
            {/* Month Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{format(currentMonth, 'MMMM yyyy')}</Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                    <Ionicons name="chevron-forward" size={24} color="#1E293B" />
                </TouchableOpacity>
            </View>

            {/* Week Days Header */}
            <View style={styles.weekDays}>
                {weekDays.map((day, index) => (
                    <Text key={index} style={styles.weekDayText}>{day}</Text>
                ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.grid}>
                {calendarDays.map((day, index) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isTodayDate = isToday(day);
                    const dayEvents = eventsMap[format(day, 'yyyy-MM-dd')] || [];
                    const hasEvents = dayEvents.length > 0;

                    // Get dot color based on first event type
                    const getDotColor = (type: string) => {
                         switch (type) {
                            case 'vaccination': return '#F97316';
                            case 'grooming': return '#A855F7';
                            case 'vet': 
                            case 'checkup': return '#3B82F6';
                            case 'treatment': return '#EF4444';
                            case 'walking': return '#10B981';
                            default: return '#3B82F6';
                         }
                    };

                    const dotColor = hasEvents ? getDotColor(dayEvents[0].type) : 'transparent';

                    return (
                        <TouchableOpacity
                            key={day.toISOString()}
                            style={[
                                styles.dayCell,
                                isSelected && styles.dayCellSelected,
                                isTodayDate && !isSelected && styles.dayCellToday
                            ]}
                            onPress={() => onDateSelect(day)}
                        >
                            <Text style={[
                                styles.dayText,
                                !isCurrentMonth && styles.dayTextOutside,
                                isSelected && styles.dayTextSelected,
                                isTodayDate && !isSelected && styles.dayTextToday
                            ]}>
                                {format(day, 'd')}
                            </Text>
                            {hasEvents && (
                                <View style={styles.dotsContainer}>
                                    <View style={[styles.dot, { backgroundColor: isSelected ? '#fff' : dotColor }]} />
                                    {dayEvents.length > 1 && (
                                        <View style={[styles.dot, { backgroundColor: isSelected ? '#fff' : '#94A3B8' }]} />
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Selected Day Events */}
            <View style={styles.eventsSection}>
                <Text style={styles.dateHeader}>
                    {format(selectedDate, 'MMMM d')}
                    <Text style={styles.dayOfWeek}>  {format(selectedDate, 'EEEE')}</Text>
                </Text>
                
                {/* Reuse TimelineView logic but just for this list? 
                    Since I didn't export the Card component, I'll copy the render logic for now to be safe and quick.
                */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.eventsList}>
                    {selectedDateEvents.length === 0 ? (
                        <Text style={styles.noEventsText}>No events scheduled</Text>
                    ) : (
                        selectedDateEvents.map((event) => (
                             <View key={event.id} style={styles.card}>
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
                                    {/* Icon Badge on Avatar */}
                                    <View style={styles.iconBadge}>
                                         <Ionicons name={
                                             event.type === 'food' ? 'nutrition' : 
                                             event.type === 'grooming' ? 'cut' : 
                                             event.type === 'vaccination' ? 'bandage' : 'paw'
                                         } size={12} color="#fff" />
                                    </View>
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.eventTitle}>{event.title}</Text>
                                    <Text style={styles.eventSubtitle}>
                                        {format(new Date(event.date), 'hh:mm a')} • {event.pet?.name || 'Pet'}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.chevron}>
                                    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    navButton: {
        padding: 8,
    },
    weekDays: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        borderRadius: 24,
    },
    dayCellSelected: {
        backgroundColor: '#3B82F6',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    dayCellToday: {
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    dayText: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '500',
    },
    dayTextOutside: {
        color: '#CBD5E1',
    },
    dayTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    dayTextToday: {
        color: '#3B82F6',
        fontWeight: '700',
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 2,
        marginTop: 4,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    eventsSection: {
        flex: 1,
        marginTop: 20,
    },
    dateHeader: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
    },
    dayOfWeek: {
        fontWeight: '400',
        color: '#94A3B8',
        fontSize: 16,
    },
    eventsList: {
        gap: 12,
    },
    noEventsText: {
        color: '#94A3B8',
        fontStyle: 'italic',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    petAvatar: {
        position: 'relative',
        width: 48,
        height: 48,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEmoji: {
        fontSize: 24,
    },
    iconBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    cardContent: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    eventSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    chevron: {
        padding: 4,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 0, // Parent has paddingHorizontal: 20, so this aligns relative to that if we use absolute.
                  // Wait, parent is View with padding. FAB should be fixed or absolute to screen.
                  // Better to put FAB in parent container or use absolute here with right: 20.
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 100,
    },
});
