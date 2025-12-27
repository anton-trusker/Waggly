import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MiniCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onDateSelect }) => {
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
        const daysInMonth = getDaysInMonth(selectedDate);
        const firstDay = getFirstDayOfMonth(selectedDate);
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
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        return (
            day === selectedDate.getDate() &&
            selectedDate.getMonth() === selectedDate.getMonth() &&
            selectedDate.getFullYear() === selectedDate.getFullYear()
        );
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <View style={styles.container}>
            <Text style={styles.monthText}>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Text>

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
                                const year = selectedDate.getFullYear();
                                const month = selectedDate.getMonth();
                                onDateSelect(new Date(year, month, day));
                            }
                        }}
                        disabled={!day}
                    >
                        {day && (
                            <Text style={[
                                styles.dayText,
                                isToday(day) ? styles.dayTextToday : undefined,
                                isSelected(day) ? styles.dayTextSelected : undefined,
                            ]}>
                                {day}
                            </Text>
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
    monthText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
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
});

export default MiniCalendar;
