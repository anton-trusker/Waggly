import { XStack, Label } from 'tamagui';
import { Switch as TamaguiSwitch, SwitchProps as TamaguiSwitchProps } from 'tamagui';

export interface SwitchProps extends TamaguiSwitchProps {
    label?: string;
}

export function Switch({ label, ...switchProps }: SwitchProps) {
    return (
        <XStack gap="$3" alignItems="center">
            <TamaguiSwitch
                size="$4"
                backgroundColor="$gray300"
                borderColor="transparent"
                {...switchProps}
            >
                <TamaguiSwitch.Thumb
                    animation="quick"
                    backgroundColor="$white"
                />
            </TamaguiSwitch>

            {label && (
                <Label htmlFor={switchProps.id} color="$textPrimary" pressStyle={{ opacity: 0.7 }}>
                    {label}
                </Label>
            )}
        </XStack>
    );
}
