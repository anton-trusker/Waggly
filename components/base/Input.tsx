import { styled, Input as TamaguiInput } from 'tamagui';

// Create styled input component
export const Input = styled(TamaguiInput, {
    name: 'Input',
    backgroundColor: '$backgroundCard',
    borderWidth: 1,
    borderColor: '$borderLight',
    borderRadius: '$md',
    color: '$textPrimary',
    fontSize: '$base',
    paddingHorizontal: '$4',
    height: 40,
    placeholderTextColor: '$textTertiary',

    focusStyle: {
        borderColor: '$primary500',
        borderWidth: 2,
        outlineWidth: 0,
    },

    hoverStyle: {
        borderColor: '$borderMedium',
    },

    variants: {
        size: {
            small: {
                height: 32,
                paddingHorizontal: '$3',
                fontSize: '$sm',
            },
            medium: {
                height: 40,
                paddingHorizontal: '$4',
                fontSize: '$base',
            },
            large: {
                height: 48,
                paddingHorizontal: '$5',
                fontSize: '$lg',
            },
        },
        error: {
            true: {
                borderColor: '$error500',
                focusStyle: {
                    borderColor: '$error600',
                },
            },
        },
        disabled: {
            true: {
                opacity: 0.5,
                backgroundColor: '$gray100',
                pointerEvents: 'none',
            },
        },
    } as const,

    defaultVariants: {
        size: 'medium',
    },
});

export type InputProps = React.ComponentProps<typeof Input>;
