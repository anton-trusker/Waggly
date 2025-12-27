import React, { useMemo } from 'react';
import { Calendar as RNCalendar, CalendarProps as RNCalendarProps, DateData } from 'react-native-calendars';
import { useAppTheme } from '@/hooks/useAppTheme';
import { designSystem } from '@/constants/designSystem';

export interface CalendarProps extends Partial<RNCalendarProps> {
    selectedDate?: string;
    selectedDates?: string[];
    onDayPress?: (date: DateData) => void;
    minDate?: string;
    maxDate?: string;
    markedDates?: RNCalendarProps['markedDates'];
    enableSwipeMonths?: boolean;
}

export default function Calendar({
    selectedDate,
    selectedDates,
    onDayPress,
    minDate,
    maxDate,
    markedDates,
    enableSwipeMonths = true,
    ...props
}: CalendarProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    // Merge selected dates with marked dates
    const finalMarkedDates = useMemo(() => {
        const marked = { ...markedDates };

        // Mark single selected date
        if (selectedDate) {
            marked[selectedDate] = {
                ...marked[selectedDate],
                selected: true,
                selectedColor: designSystem.colors.primary[500],
            };
        }

        // Mark multiple selected dates
        if (selectedDates && selectedDates.length > 0) {
            selectedDates.forEach(date => {
                marked[date] = {
                    ...marked[date],
                    selected: true,
                    selectedColor: designSystem.colors.primary[500],
                };
            });
        }

        return marked;
    }, [selectedDate, selectedDates, markedDates]);

    // Design system theme
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
        indicatorColor: designSystem.colors.primary[500],
        textDayFontFamily: 'System',
        textMonthFontFamily: 'System',
        textDayHeaderFontFamily: 'System',
        textDayFontWeight: '400',
        textMonthFontWeight: '600',
        textDayHeaderFontWeight: '600',
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 13,
        // Weekend colors
        'stylesheet.calendar.header': {
            dayTextAtIndex0: {
                color: designSystem.colors.status.error[500], // Sunday
            },
            dayTextAtIndex6: {
                color: designSystem.colors.status.error[500], // Saturday
            },
        },
    }), [isDark]);

    return (
        <RNCalendar
            {...props}
            theme={calendarTheme}
            markedDates={finalMarkedDates}
            onDayPress={onDayPress}
            minDate={minDate}
            maxDate={maxDate}
            enableSwipeMonths={enableSwipeMonths}
            firstDay={1} // Monday
            hideExtraDays={true}
            disableMonthChange={false}
            monthFormat={'MMMM yyyy'}
            renderArrow={(direction) => (
                direction === 'left' ? '←' : '→'
            )}
        />
    );
}
