import { styled, Card as TamaguiCard } from 'tamagui';

// Create styled card component
export const Card = styled(TamaguiCard, {
    name: 'Card',
    backgroundColor: '$backgroundCard',
    borderRadius: '$lg',
    padding: '$6',
    shadowColor: '$shadowColor',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,

    variants: {
        variant: {
            default: {
                backgroundColor: '$backgroundCard',
            },
            elevated: {
                backgroundColor: '$backgroundCard',
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4,
            },
            outlined: {
                backgroundColor: '$backgroundCard',
                borderWidth: 1,
                borderColor: '$borderLight',
                shadowOpacity: 0,
                elevation: 0,
            },
        },
        pressable: {
            true: {
                pressStyle: {
                    scale: 0.98,
                    opacity: 0.9,
                },
                hoverStyle: {
                    borderColor: '$borderMedium',
                },
            },
        },
    } as const,

    defaultVariants: {
        variant: 'default',
    },
});

export type CardProps = React.ComponentProps<typeof Card>;
