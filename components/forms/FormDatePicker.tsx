import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Control, FieldValues, Path } from 'react-hook-form';
import { designSystem } from '@/constants/designSystem';
import { DateField } from '@/components/design-system/forms/DateField';

interface FormDatePickerProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

export default function FormDatePicker<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    required,
    minDate,
    maxDate,
}: FormDatePickerProps<T>) {
    return (
        <View style={styles.container}>
            <DateField
                control={control}
                name={name}
                label={label}
                required={required}
                minimumDate={minDate}
                maximumDate={maxDate}
                placeholder={placeholder}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: designSystem.spacing[4],
    },
});
