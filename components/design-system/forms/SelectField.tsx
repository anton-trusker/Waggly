import React from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Select, SelectOption } from '../primitives/Select';

interface SelectFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    rules?: RegisterOptions<T>;
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    required?: boolean;
    searchable?: boolean;
}

export const SelectField = <T extends FieldValues>({
    control,
    name,
    rules,
    label,
    placeholder,
    options,
    required,
    searchable,
    ...props
}: SelectFieldProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required: required ? 'This field is required' : false,
                ...rules
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                    label={label}
                    placeholder={placeholder}
                    options={options}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    required={required}
                    searchable={searchable}
                    {...props}
                />
            )}
        />
    );
};
