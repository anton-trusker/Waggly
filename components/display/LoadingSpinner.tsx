import { Spinner, YStack, Text } from 'tamagui';

export interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    message?: string;
}

export function LoadingSpinner({ size = 'large', message }: LoadingSpinnerProps) {
    return (
        <YStack
            padding="$8"
            alignItems="center"
            justifyContent="center"
            gap="$3"
            minHeight={200}
        >
            <Spinner size={size} color="$primary500" />
            {message && (
                <Text fontSize="$sm" color="$textSecondary">
                    {message}
                </Text>
            )}
        </YStack>
    );
}
