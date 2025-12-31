import { styled, Text } from 'tamagui';

// Create styled badge component
export const Badge = styled(Text, {
    name: 'Badge',
    backgroundColor: '$gray200',
    color: '$textPrimary',
    fontSize: '$xs',
    fontWeight: '600',
    paddingHorizontal: '$2.5',
    paddingVertical: '$1',
    borderRadius: '$base',
    textTransform: 'uppercase',
    letterSpacing: 0.5,

    variants: {
        variant: {
            default: {
                backgroundColor: '$gray200',
                color: '$textPrimary',
            },
            primary: {
                backgroundColor: '$primary500',
                color: '$white',
            },
            success: {
                backgroundColor: '$success500',
                color: '$white',
            },
            warning: {
                backgroundColor: '$warning500',
                color: '$white',
            },
            error: {
                backgroundColor: '$error500',
                color: '$white',
            },
            info: {
                backgroundColor: '$info500',
                color: '$white',
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '$borderMedium',
                color: '$textPrimary',
            },
        },
        size: {
            small: {
                fontSize: 10,
                paddingHorizontal: '$2',
                paddingVertical: '$0.5',
            },
            medium: {
                fontSize: '$xs',
                paddingHorizontal: '$2.5',
                paddingVertical: '$1',
            },
            large: {
                fontSize: '$sm',
                paddingHorizontal: '$3',
                paddingVertical: '$1.5',
            },
        },
    } as const,

    defaultVariants: {
        variant: 'default',
        size: 'medium',
    },
});

export type BadgeProps = React.ComponentProps<typeof Badge>;

export default Badge;
