import { YStack, Label, Text } from 'tamagui';
import { Input } from '../design-system/primitives/Input';
import { ComponentProps } from 'react';

export interface TextInputProps extends ComponentProps<typeof Input> {
    label?: string;
    helperText?: string;
    errorText?: string;
    required?: boolean;
}

export function TextInput({
    label,
    helperText,
    errorText,
    required,
    error,
    ...inputProps
}: TextInputProps) {
    const hasError = error || !!errorText;

    return (
        <YStack gap="$2">
            {label && (
                <Label htmlFor={inputProps.id} color="$textPrimary" fontWeight="600">
                    {label}
                    {required && <Text color="$error500"> *</Text>}
                </Label>
            )}

            <Input error={hasError} {...inputProps} />

            {hasError && errorText && (
                <Text fontSize="$sm" color="$error500">
                    {errorText}
                </Text>
            )}

            {!hasError && helperText && (
                <Text fontSize="$sm" color="$textTertiary">
                    {helperText}
                </Text>
            )}
        </YStack>
    );
}
