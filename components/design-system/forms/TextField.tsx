import React from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Input } from '../primitives/Input';

// Define the props for our controlled input
interface TextFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    rules?: RegisterOptions<T>;
    label?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    required?: boolean;
    // ... other Input props we want to expose
}

export const TextField = <T extends FieldValues>({
    control,
    name,
    rules,
    label,
    placeholder,
    secureTextEntry,
    required,
    ...props
}: TextFieldProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                required: required ? 'This field is required' : false,
                ...rules
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                    label={label}
                    placeholder={placeholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={error?.message}
                    secureTextEntry={secureTextEntry}
                    required={required}
                    {...props}
                />
            )}
        />
    );
};
