import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';

interface FormDatePickerProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

// Convert Date to DD-MM-YYYY format
const dateToDmy = (date: Date | null | undefined): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

// Convert DD-MM-YYYY to Date
const dmyToDate = (dmyDate: string): Date | null => {
    if (!dmyDate) return null;
    const parts = dmyDate.split('-');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isNaN(date.getTime()) ? null : date;
};

export default function FormDatePicker<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = 'Select date',
    required = false,
    minDate,
    maxDate,
}: FormDatePickerProps<T>) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={styles.container}>
                    <EnhancedDatePicker
                        label={label}
                        value={dateToDmy(value)}
                        onChange={(dmyDate) => {
                            const date = dmyToDate(dmyDate);
                            onChange(date);
                        }}
                        placeholder={placeholder}
                        required={required}
                        error={error?.message}
                    />
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: designSystem.spacing[4],
    },
});
