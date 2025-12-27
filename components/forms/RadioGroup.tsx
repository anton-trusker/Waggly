import { YStack, XStack } from 'tamagui';
import { Checkbox } from './Checkbox';
import { ComponentProps, useState } from 'react';

export interface RadioOption {
    label: string;
    value: string;
}

export interface RadioGroupProps {
    options: RadioOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    size?: ComponentProps<typeof Checkbox>['size'];
}

export function RadioGroup({ options, value, onValueChange, size = 'medium' }: RadioGroupProps) {
    return (
        <YStack gap="$3">
            {options.map((option) => (
                <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={value === option.value}
                    onCheckedChange={(checked) => {
                        if (checked && onValueChange) {
                            onValueChange(option.value);
                        }
                    }}
                    size={size}
                />
            ))}
        </YStack>
    );
}
