import { YStack, XStack, View, Text } from 'tamagui';

export interface ProgressBarProps {
    value: number; // 0-100
    max?: number;
    height?: number;
    color?: string;
    backgroundColor?: string;
    showLabel?: boolean;
    label?: string;
}

export function ProgressBar({
    value,
    max = 100,
    height = 8,
    color = '$primary500',
    backgroundColor = '$gray200',
    showLabel = false,
    label,
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <YStack gap="$2" width="100%">
            {(showLabel || label) && (
                <XStack justifyContent="space-between" alignItems="center">
                    {label && <Text fontSize="$sm" color="$textSecondary">{label}</Text>}
                    {showLabel && (
                        <Text fontSize="$sm" fontWeight="600" color="$textPrimary">
                            {Math.round(percentage)}%
                        </Text>
                    )}
                </XStack>
            )}

            <View
                width="100%"
                height={height}
                backgroundColor={backgroundColor}
                borderRadius="$full"
                overflow="hidden"
            >
                <View
                    width={`${percentage}%`}
                    height="100%"
                    backgroundColor={color}
                    animation="quick"
                />
            </View>
        </YStack>
    );
}
