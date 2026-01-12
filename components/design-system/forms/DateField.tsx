import React from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { DatePicker } from '../primitives/DatePicker';

interface DateFieldProps<T extends FieldValues> extends Omit<React.ComponentProps<typeof DatePicker>, 'value' | 'onChange' | 'error'> {
    control: Control<T>;
    name: Path<T>;
    rules?: RegisterOptions<T>;
}

export const DateField = <T extends FieldValues>({
    control,
    name,
    rules,
    label,
    required,
    ...props
}: DateFieldProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required: required ? 'This field is required' : false,
                ...rules
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DatePicker
                    label={label}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    required={required}
                    {...props}
                />
            )}
        />
    );
};
