import { YStack, Text } from 'tamagui';

export interface StatProps {
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
}

export function Stat({ label, value, change, changeType = 'neutral' }: StatProps) {
    const changeColor = {
        positive: '$success500',
        negative: '$error500',
        neutral: '$textSecondary',
    }[changeType];

    return (
        <YStack gap="$1" alignItems="center">
            <Text fontSize="$3xl" fontWeight="bold" color="$textPrimary">
                {value}
            </Text>
            <Text fontSize="$sm" color="$textSecondary">
                {label}
            </Text>
            {change && (
                <Text fontSize="$xs" color={changeColor} fontWeight="600">
                    {change}
                </Text>
            )}
        </YStack>
    );
}
