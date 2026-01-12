import React from 'react';
import { Stack, Text, GetProps } from 'tamagui';

export interface BadgeProps extends GetProps<typeof Stack> {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
}

export function Badge({ children, variant = 'primary', ...props }: BadgeProps) {
    const getColors = () => {
        switch (variant) {
            case 'success':
                return { bg: '$green100' as any, color: '$green700' as any };
            case 'warning':
                return { bg: '$amber100' as any, color: '$amber700' as any };
            case 'error':
                return { bg: '$red100' as any, color: '$red700' as any };
            case 'info':
                return { bg: '$blue100' as any, color: '$blue700' as any };
            case 'secondary':
                return { bg: '$gray100' as any, color: '$gray700' as any };
            case 'primary':
            default:
                return { bg: '$primary100' as any, color: '$primary700' as any };
        }
    };

    const { bg, color } = getColors();

    return (
        <Stack
            backgroundColor={bg}
            paddingVertical="$1"
            paddingHorizontal="$2"
            borderRadius="$full"
            alignItems="center"
            justifyContent="center"
            {...props}
        >
            <Text
                fontSize="$xs"
                fontWeight="700"
                color={color}
                textTransform="uppercase"
            >
                {children}
            </Text>
        </Stack>
    );
}

export default Badge;
