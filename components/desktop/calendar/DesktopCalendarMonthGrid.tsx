import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { format, isSameDay, isSameMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isWeekend } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CalendarEvent } from '@/types';
import { getColor } from '@/utils/designSystem';

interface DesktopCalendarMonthGridProps {
    currentMonth: Date;
    events: CalendarEvent[];
    onDateSelect: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
}

export default function DesktopCalendarMonthGrid({ currentMonth, events, onDateSelect, onEventClick }: DesktopCalendarMonthGridProps) {
    const today = new Date();

    // Generate grid days
    const days = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentMonth]);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Group events by date string (YYYY-MM-DD)
    const eventsByDate = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {};
        events.forEach(event => {
            const dateStr = event.dueDate.slice(0, 10); // Assuming ISO string
            if (!map[dateStr]) map[dateStr] = [];
            map[dateStr].push(event);
        });
        return map;
    }, [events]);

    const getEventColor = (type: string) => {
        switch (type) {
            case 'vaccination': return '#EC4899'; // Pink
            case 'checkup': return '#3B82F6'; // Blue
            case 'grooming': return '#8B5CF6'; // Purple
            case 'medication': return '#F97316'; // Orange
            case 'surgery': return '#EF4444'; // Red
            case 'food': return '#10B981'; // Green
            default: return '#6B7280'; // Gray
        }
    };

    return (
        <View style={styles.container}>
            {/* Week Headers */}
            <View style={styles.headerRow}>
                {weekDays.map(day => (
                    <Text key={day} style={styles.headerText}>{day}</Text>
                ))}
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {days.map((day, index) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayEvents = eventsByDate[dateStr] || [];
                    const isToday = isSameDay(day, today);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isWeekendDay = isWeekend(day);

                    return (
                        <TouchableOpacity
                            key={dateStr}
                            style={[
                                styles.cell,
                                !isCurrentMonth && styles.outsideCell,
                                isWeekendDay && isCurrentMonth && styles.weekendCell
                            ]}
                            onPress={() => onDateSelect(day)}
                        >
                            <View style={styles.cellHeader}>
                                {isToday ? (
                                    <LinearGradient
                                        colors={['#4F46E5', '#7C3AED']}
                                        style={styles.todayIndicator}
                                    >
                                        <Text style={styles.todayText}>{format(day, 'd')}</Text>
                                    </LinearGradient>
                                ) : (
                                    <Text style={[
                                        styles.dateText,
                                        !isCurrentMonth && styles.outsideDateText
                                    ]}>
                                        {format(day, 'd')}
                                    </Text>
                                )}
                            </View>

                            {/* Events Container */}
                            <View style={styles.eventsContainer}>
                                {dayEvents.slice(0, 3).map((event, i) => (
                                    <TouchableOpacity
                                        key={event.id || i}
                                        style={styles.eventPill}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            onEventClick(event);
                                        }}
                                    >
                                        <View style={[styles.dot, { backgroundColor: getEventColor(event.type) }]} />
                                        <Text style={styles.eventText} numberOfLines={1}>{event.title}</Text>
                                    </TouchableOpacity>
                                ))}
                                {dayEvents.length > 3 && (
                                    <Text style={styles.moreEventsText}>+{dayEvents.length - 3} more</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingVertical: 12,
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        width: '14.28%', // 100% / 7
        height: 120, // Fixed height per audit
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        padding: 8,
        backgroundColor: '#fff',
    },
    outsideCell: {
        backgroundColor: '#F9FAFB',
    },
    weekendCell: {
        backgroundColor: '#FAFAFA',
    },
    cellHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    outsideDateText: {
        color: '#D1D5DB',
    },
    todayIndicator: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todayText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    eventsContainer: {
        gap: 4,
    },
    eventPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    eventText: {
        fontSize: 11,
        color: '#374151',
        flex: 1,
    },
    moreEventsText: {
        fontSize: 10,
        color: '#6B7280',
        paddingLeft: 4,
    },
});
