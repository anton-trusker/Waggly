import { XStack, Label, Text } from 'tamagui';
import { Checkbox as TamaguiCheckbox, CheckboxProps as TamaguiCheckboxProps } from 'tamagui';
import { ComponentProps } from 'react';

export interface CheckboxProps extends Omit<TamaguiCheckboxProps, 'size'> {
    label?: string;
    size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
    small: 16,
    medium: 20,
    large: 24,
};

export function Checkbox({ label, size = 'medium', ...checkboxProps }: CheckboxProps) {
    const checkboxSize = sizeMap[size];

    return (
        <XStack gap="$2" alignItems="center">
            <TamaguiCheckbox
                size={checkboxSize}
                borderWidth={2}
                borderColor="$borderMedium"
                backgroundColor="$backgroundCard"
                {...checkboxProps}
            >
                <TamaguiCheckbox.Indicator>
                    <Text color="$primary500" fontWeight="bold">✓</Text>
                </TamaguiCheckbox.Indicator>
            </TamaguiCheckbox>

            {label && (
                <Label htmlFor={checkboxProps.id} color="$textPrimary" pressStyle={{ opacity: 0.7 }}>
                    {label}
                </Label>
            )}
        </XStack>
    );
}
