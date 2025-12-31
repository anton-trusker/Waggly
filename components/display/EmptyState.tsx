import { YStack, Text } from 'tamagui';
import { ReactNode } from 'react';

export interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <YStack
            padding="$8"
            alignItems="center"
            justifyContent="center"
            gap="$4"
            minHeight={200}
        >
            {icon && (
                <YStack
                    width={64}
                    height={64}
                    borderRadius="$full"
                    backgroundColor="$gray100"
                    alignItems="center"
                    justifyContent="center"
                >
                    {icon}
                </YStack>
            )}

            <YStack gap="$2" alignItems="center" maxWidth={300}>
                <Text fontSize="$lg" fontWeight="600" color="$textPrimary" textAlign="center">
                    {title}
                </Text>
                {description && (
                    <Text fontSize="$sm" color="$textSecondary" textAlign="center">
                        {description}
                    </Text>
                )}
            </YStack>

            {action}
        </YStack>
    );
}

export default EmptyState;
