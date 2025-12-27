import { XStack, YStack, Text } from 'tamagui';
import { Divider } from '../base/Divider';
import { ReactNode } from 'react';

export interface ListItemProps {
    title: string;
    subtitle?: string;
    leftIcon?: ReactNode;
    rightContent?: ReactNode;
    showChevron?: boolean;
    onPress?: () => void;
    showDivider?: boolean;
}

export function ListItem({
    title,
    subtitle,
    leftIcon,
    rightContent,
    showChevron = false,
    onPress,
    showDivider = true,
}: ListItemProps) {
    return (
        <>
            <XStack
                padding="$4"
                gap="$3"
                alignItems="center"
                pressStyle={onPress ? { backgroundColor: '$gray100', scale: 0.98 } : undefined}
                onPress={onPress}
                animation="quick"
            >
                {leftIcon && (
                    <XStack
                        width={40}
                        height={40}
                        borderRadius="$md"
                        backgroundColor="$gray100"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {leftIcon}
                    </XStack>
                )}

                <YStack flex={1} gap="$1">
                    <Text fontWeight="600" fontSize="$base" color="$textPrimary">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text color="$textSecondary" fontSize="$sm">
                            {subtitle}
                        </Text>
                    )}
                </YStack>

                {rightContent}

                {showChevron && (
                    <Text color="$textTertiary" fontSize="$xl">›</Text>
                )}
            </XStack>

            {showDivider && <Divider marginLeft="$14" />}
        </>
    );
}
