import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocale } from '@/hooks/useLocale';
import { Ionicons } from '@expo/vector-icons';

interface MiniCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    events?: Array<{ date: Date; type: string }>;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onDateSelect, events = [] }) => {
    const { locale } = useLocale();
    const [currentMonth, setCurrentMonth] = useState(selectedDate);

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

    const generateDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days: (number | null)[] = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        return (
            day === selectedDate.getDate() &&
            selectedDate.getMonth() === selectedDate.getMonth() &&
            selectedDate.getFullYear() === selectedDate.getFullYear()
        );
    };

    const hasEvent = (day: number) => {
        return events.some(event => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === currentMonth.getMonth() &&
                eventDate.getFullYear() === currentMonth.getFullYear()
            );
        });
    };

    const handlePreviousMonth = () => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(newDate);
    };

    // Generate localized day names (S, M, T...)
    const dayNames = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            // Jan 2, 2000 was a Sunday
            const date = new Date(2000, 0, i + 2);
            days.push(date.toLocaleDateString(locale, { weekday: 'narrow' }));
        }
        return days;
    }, [locale]);

    const monthYear = useMemo(() => {
        return currentMonth.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
    }, [currentMonth, locale]);

    return (
        <View style={styles.container}>
            <View style={styles.monthHeader}>
                <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={20} color="#6366F1" />
                </TouchableOpacity>
                <Text style={styles.monthText}>
                    {monthYear}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                    <Ionicons name="chevron-forward" size={20} color="#6366F1" />
                </TouchableOpacity>
            </View>

            <View style={styles.dayNames}>
                {dayNames.map((name, idx) => (
                    <View key={idx} style={styles.dayNameCell}>
                        <Text style={styles.dayNameText}>{name}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.grid}>
                {generateDays().map((day, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dayCell,
                            !day ? styles.dayCellEmpty : undefined,
                            (day && isToday(day)) ? styles.dayCellToday : undefined,
                            (day && isSelected(day)) ? styles.dayCellSelected : undefined,
                        ]}
                        onPress={() => {
                            if (day) {
                                const year = currentMonth.getFullYear();
                                const month = currentMonth.getMonth();
                                onDateSelect(new Date(year, month, day));
                            }
                        }}
                        disabled={!day}
                    >
                        {day && (
                            <>
                                <Text style={[
                                    styles.dayText,
                                    isToday(day) ? styles.dayTextToday : undefined,
                                    isSelected(day) ? styles.dayTextSelected : undefined,
                                ]}>
                                    {day}
                                </Text>
                                {hasEvent(day) && (
                                    <View style={[
                                        styles.eventDot,
                                        isSelected(day) && styles.eventDotSelected
                                    ]} />
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    monthHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    navButton: {
        padding: 4,
    },
    monthText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    dayNames: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayNameCell: {
        flex: 1,
        alignItems: 'center',
    },
    dayNameText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: 'calc(14.285%)' as any,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    dayCellEmpty: {
        opacity: 0,
    },
    dayCellToday: {
        backgroundColor: '#F3F4F6',
    },
    dayCellSelected: {
        backgroundColor: '#6366F1',
    },
    dayText: {
        fontSize: 13,
        color: '#374151',
    },
    dayTextToday: {
        fontWeight: '700',
        color: '#6366F1',
    },
    dayTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    eventDot: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#6366F1',
    },
    eventDotSelected: {
        backgroundColor: '#fff',
    },
});

export default MiniCalendar;
