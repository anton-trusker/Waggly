import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useEvents, Event } from '@/hooks/useEvents';
import { usePets } from '@/hooks/usePets';

interface AppointmentCalendarProps {
    petId?: string;
    onDayPress?: (date: string, events: Event[]) => void;
}

export default function AppointmentCalendar({ petId, onDayPress }: AppointmentCalendarProps) {
    const { theme } = useAppTheme();
    const { events } = useEvents();
    const { selectedPet } = usePets();
    const isDark = theme === 'dark';

    // Filter events by pet if petId provided
    const filteredEvents = useMemo(() => {
        if (petId) {
            return events.filter(e => e.petId === petId);
        }
        if (selectedPet) {
            return events.filter(e => e.petId === selectedPet.id);
        }
        return events;
    }, [events, petId, selectedPet]);

    // Convert events to marked dates
    const markedDates: MarkedDates = useMemo(() => {
        const marked: MarkedDates = {};

        filteredEvents.forEach(event => {
            if (!event.date) return;

            const dateStr = event.date;

            // Determine color based on event type
            let color = designSystem.colors.primary[500];
            if (event.type === 'vet_appointment') {
                color = designSystem.colors.primary[500];
            } else if (event.type === 'grooming') {
                color = '#10B981'; // Success green
            } else if (event.type === 'training') {
                color = '#F59E0B'; // Warning orange
            } else if (event.type === 'medication') {
                color = '#EF4444'; // Error red
            }

            if (!marked[dateStr]) {
                marked[dateStr] = {
                    marked: true,
                    dots: [],
                };
            }

            // Add dot for this event
            if (marked[dateStr].dots) {
                marked[dateStr].dots!.push({ color });
            }
        });

        return marked;
    }, [filteredEvents]);

    // Calendar theme
    const calendarTheme = useMemo(() => ({
        backgroundColor: isDark ? designSystem.colors.background.primary : designSystem.colors.neutral[0],
        calendarBackground: isDark ? designSystem.colors.background.primary : designSystem.colors.neutral[0],
        textSectionTitleColor: designSystem.colors.text.secondary,
        selectedDayBackgroundColor: designSystem.colors.primary[500],
        selectedDayTextColor: designSystem.colors.neutral[0],
        todayTextColor: designSystem.colors.primary[500],
        dayTextColor: designSystem.colors.text.primary,
        textDisabledColor: designSystem.colors.text.quaternary,
        dotColor: designSystem.colors.primary[500],
        selectedDotColor: designSystem.colors.neutral[0],
        arrowColor: designSystem.colors.primary[500],
        monthTextColor: designSystem.colors.text.primary,
        textMonthFontWeight: '600',
        textDayFontSize: 16,
        textMonthFontSize: 18,
    }), [isDark]);

    const handleDayPress = (day: DateData) => {
        const dayEvents = filteredEvents.filter(e => e.date === day.dateString);
        onDayPress?.(day.dateString, dayEvents);
    };

    return (
        <View style={styles.container}>
            <Calendar
                theme={calendarTheme}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                markingType="multi-dot"
                firstDay={1}
                enableSwipeMonths={true}
                hideExtraDays={true}
            />

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: designSystem.colors.primary[500] }]} />
                    <Text style={styles.legendText}>Vet</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.legendText}>Grooming</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.legendText}>Training</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendText}>Medication</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: designSystem.borderRadius.lg,
        padding: designSystem.spacing[4],
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: designSystem.spacing[4],
        marginTop: designSystem.spacing[4],
        paddingTop: designSystem.spacing[4],
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.neutral[200],
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[2],
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.text.secondary,
    },
});
