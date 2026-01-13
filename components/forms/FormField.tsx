import { View, Text, StyleSheet, Platform } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Input } from '@/components/design-system/primitives/Input';

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'number' | 'email' | 'password';
    multiline?: boolean;
    rows?: number;
    keyboardType?: any;
    autoCapitalize?: any;
    autoCorrect?: boolean;
}

export default function FormField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    required = false,
    type = 'text',
    multiline = false,
    rows = 4,
    ...textInputProps
}: FormFieldProps<T>) {
    const { isDark } = useAppTheme();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                    label={label}
                    required={required}
                    placeholder={placeholder}
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                        if (type === 'number') {
                            const num = parseFloat(text);
                            onChange(isNaN(num) ? undefined : num);
                        } else {
                            onChange(text);
                        }
                    }}
                    onBlur={onBlur}
                    error={error?.message}
                    secureTextEntry={type === 'password'}
                    multiline={multiline}
                    numberOfLines={multiline ? rows : 1}
                    keyboardType={
                        type === 'email' ? 'email-address' :
                            type === 'number' ? 'numeric' :
                                'default'
                    }
                    {...textInputProps}
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: designSystem.spacing[4],
    },
    labelContainer: {
        marginBottom: designSystem.spacing[2],
    },
    label: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.text.secondary,
        fontWeight: '600',
    },
    labelDark: {
        color: designSystem.colors.text.secondary,
    },
    required: {
        color: designSystem.colors.status.error[500],
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: designSystem.borderRadius.md,
        paddingHorizontal: designSystem.spacing[4],
        paddingVertical: designSystem.spacing[3],
        ...designSystem.typography.body.large,
        color: designSystem.colors.text.primary,
        minHeight: 48,
    },
    inputDark: {
        backgroundColor: designSystem.colors.background.primary,
        borderColor: designSystem.colors.neutral[700],
        color: designSystem.colors.text.primary,
    },
    inputMultiline: {
        paddingTop: designSystem.spacing[3],
    },
    inputError: {
        borderColor: designSystem.colors.status.error[500],
    },
    toggleButton: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    errorText: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.status.error[500],
        marginTop: designSystem.spacing[1],
    },
});
