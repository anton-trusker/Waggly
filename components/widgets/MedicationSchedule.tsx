import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Medication {
    id: string;
    name: string;
    schedule: {
        date: string;
        given: boolean;
    }[];
}

interface MedicationScheduleProps {
    medications: Medication[];
    currentMonth?: string; // Format: 'YYYY-MM'
    onDayPress?: (date: string, medications: Medication[]) => void;
}

export default function MedicationSchedule({
    medications,
    currentMonth,
    onDayPress
}: MedicationScheduleProps) {
    const { theme, isDark } = useAppTheme();

    // Convert medications to marked dates
    const markedDates: MarkedDates = useMemo(() => {
        const marked: MarkedDates = {};

        medications.forEach(medication => {
            medication.schedule.forEach(dose => {
                const dateStr = dose.date;

                if (!marked[dateStr]) {
                    marked[dateStr] = {
                        marked: true,
                        dots: [],
                    };
                }

                // Add dot: green if given, red if missed
                const color = dose.given
                    ? designSystem.colors.status.success[500]
                    : designSystem.colors.status.error[500];

                if (marked[dateStr].dots) {
                    marked[dateStr].dots!.push({ color });
                }
            });
        });

        return marked;
    }, [medications]);

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

    const handleDayPress = (day: any) => {
        const dayMeds = medications.filter(med =>
            med.schedule.some(dose => dose.date === day.dateString)
        );
        onDayPress?.(day.dateString, dayMeds);
    };

    return (
        <View style={styles.container as any}>
            <View style={styles.header as any}>
                <Text style={styles.title as any}>Medication Schedule</Text>
                <Text style={styles.subtitle as any}>Track daily medication doses</Text>
            </View>

            <Calendar
                theme={calendarTheme}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                markingType="multi-dot"
                current={currentMonth}
                firstDay={1}
                enableSwipeMonths={true}
                hideExtraDays={true}
            />

            {/* Legend */}
            <View style={styles.legend as any}>
                <View style={styles.legendItem as any}>
                    <View style={[styles.legendDot, { backgroundColor: designSystem.colors.status.success[500] }] as any} />
                    <Text style={styles.legendText as any}>Given</Text>
                </View>
                <View style={styles.legendItem as any}>
                    <View style={[styles.legendDot, { backgroundColor: designSystem.colors.status.error[500] }] as any} />
                    <Text style={styles.legendText as any}>Missed</Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.stats as any}>
                <View style={styles.stat as any}>
                    <Text style={styles.statValue as any}>
                        {medications.reduce((acc, med) => acc + med.schedule.filter(d => d.given).length, 0)}
                    </Text>
                    <Text style={styles.statLabel as any}>Doses Given</Text>
                </View>
                <View style={[styles.stat, styles.statBorder] as any}>
                    <Text style={[styles.statValue, { color: designSystem.colors.status.error[500] }] as any}>
                        {medications.reduce((acc, med) => acc + med.schedule.filter(d => !d.given).length, 0)}
                    </Text>
                    <Text style={styles.statLabel as any}>Doses Missed</Text>
                </View>
                <View style={styles.stat as any}>
                    <Text style={styles.statValue as any}>
                        {medications.reduce((acc, med) => {
                            const given = med.schedule.filter(d => d.given).length;
                            const total = med.schedule.length;
                            return total > 0 ? acc + Math.round((given / total) * 100) : acc;
                        }, 0) / (medications.length || 1)}%
                    </Text>
                    <Text style={styles.statLabel as any}>Adherence</Text>
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
    header: {
        marginBottom: designSystem.spacing[4],
    },
    title: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.text.primary,
        marginBottom: designSystem.spacing[1],
    },
    subtitle: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.text.secondary,
    },
    legend: {
        flexDirection: 'row',
        gap: designSystem.spacing[6],
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
    stats: {
        flexDirection: 'row',
        marginTop: designSystem.spacing[4],
        paddingTop: designSystem.spacing[4],
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.neutral[200],
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: designSystem.colors.neutral[200],
    },
    statValue: {
        ...designSystem.typography.title.large,
        color: designSystem.colors.status.success[500],
        marginBottom: designSystem.spacing[1],
    },
    statLabel: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.tertiary,
    },
});
