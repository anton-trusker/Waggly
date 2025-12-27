import { styled, Separator } from 'tamagui';

// Create styled divider component
export const Divider = styled(Separator, {
    name: 'Divider',
    backgroundColor: '$borderLight',

    variants: {
        orientation: {
            horizontal: {
                height: 1,
                width: '100%',
            },
            vertical: {
                width: 1,
                height: '100%',
            },
        },
        thickness: {
            thin: {
                // For horizontal
                height: 1,
                // For vertical (handled via nested variant)
            },
            medium: {
                height: 2,
            },
            thick: {
                height: 4,
            },
        },
    } as const,

    defaultVariants: {
        orientation: 'horizontal',
        thickness: 'thin',
    },
});

export type DividerProps = React.ComponentProps<typeof Divider>;
