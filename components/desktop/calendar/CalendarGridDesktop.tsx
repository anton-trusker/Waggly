import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CalendarGridDesktopProps {
    events: any[];
    onDateClick?: (date: Date) => void;
    onEventClick?: (event: any) => void;
}

const CalendarGridDesktop: React.FC<CalendarGridDesktopProps> = ({
    events,
    onDateClick,
    onEventClick
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days: (number | null)[] = [];

        // Add empty cells for days before the month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const getEventsForDate = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const targetDate = new Date(year, month, day);

        return events.filter(event => {
            const raw = event.dueDate ?? event.start_time;
            if (!raw) return false;
            const d = new Date(raw);
            if (isNaN(d.getTime())) return false;
            return (
                d.getFullYear() === targetDate.getFullYear() &&
                d.getMonth() === targetDate.getMonth() &&
                d.getDate() === targetDate.getDate()
            );
        });
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <View style={styles.container}>
            {/* Header with navigation */}
            <View style={styles.header}>
                <Text style={styles.monthYear}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Text>
                <View style={styles.navigation}>
                    <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
                        <Text style={styles.todayButtonText}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton} onPress={goToPreviousMonth}>
                        <Ionicons name="chevron-back" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton} onPress={goToNextMonth}>
                        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Day names */}
            <View style={styles.dayNamesRow}>
                {dayNames.map((name) => (
                    <View key={name} style={styles.dayNameCell}>
                        <Text style={styles.dayNameText}>{name}</Text>
                    </View>
                ))}
            </View>

            {/* Calendar grid */}
            <ScrollView style={styles.gridScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {generateCalendarDays().map((day, index) => {
                        const dayEvents = day ? getEventsForDate(day) : [];

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayCell,
                                    !day ? styles.dayCellEmpty : null,
                                    (day && isToday(day)) ? styles.dayCellToday : null,
                                ]}
                                onPress={() => {
                                    if (day && onDateClick) {
                                        const year = currentDate.getFullYear();
                                        const month = currentDate.getMonth();
                                        onDateClick(new Date(year, month, day));
                                    }
                                }}
                                disabled={!day}
                            >
                                {day && (
                                    <>
                                        <Text style={[styles.dayNumber, isToday(day) && styles.dayNumberToday]}>
                                            {day}
                                        </Text>
                                        <View style={styles.eventsList}>
                                            {dayEvents.slice(0, 3).map((event, idx) => (
                                                <TouchableOpacity
                                                    key={event.id}
                                                    style={[styles.eventPill, { backgroundColor: event.color || '#6366F1' }]}
                                                    onPress={() => onEventClick?.(event)}
                                                >
                                                    <Text style={styles.eventText} numberOfLines={1}>
                                                        {event.title}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <Text style={styles.moreEvents}>+{dayEvents.length - 3} more</Text>
                                            )}
                                        </View>
                                    </>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    monthYear: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    navigation: {
        flexDirection: 'row',
        gap: 8,
    },
    todayButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
    },
    todayButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    navButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayNamesRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 12,
        marginBottom: 12,
    },
    dayNameCell: {
        flex: 1,
        alignItems: 'center',
    },
    dayNameText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    gridScroll: {
        flex: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: 'calc(14.285%)' as any,
        aspectRatio: 1.2,
        padding: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        backgroundColor: '#fff',
    },
    dayCellEmpty: {
        backgroundColor: '#FAFAFA',
    },
    dayCellToday: {
        backgroundColor: '#EEF2FF',
        borderColor: '#6366F1',
    },
    dayNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    dayNumberToday: {
        color: '#6366F1',
    },
    eventsList: {
        gap: 2,
    },
    eventPill: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        opacity: 0.9,
    },
    eventText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '500',
    },
    moreEvents: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 2,
    },
});

export default CalendarGridDesktop;
