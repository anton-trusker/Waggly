import { styled, Button as TamaguiButton } from 'tamagui';

// Create styled button variants
export const Button = styled(TamaguiButton, {
    name: 'Button',
    backgroundColor: '$primary500',
    borderRadius: '$md',
    color: '$white',
    fontWeight: '600',
    pressStyle: {
        backgroundColor: '$primary600',
        scale: 0.97,
    },
    hoverStyle: {
        backgroundColor: '$primary600',
    },
    focusStyle: {
        borderColor: '$primary700',
        borderWidth: 2,
    },

    variants: {
        theme: {
            primary: {
                backgroundColor: '$primary500',
                color: '$white',
                pressStyle: {
                    backgroundColor: '$primary600',
                },
                hoverStyle: {
                    backgroundColor: '$primary600',
                },
            },
            secondary: {
                backgroundColor: '$gray200',
                color: '$textPrimary',
                pressStyle: {
                    backgroundColor: '$gray300',
                },
                hoverStyle: {
                    backgroundColor: '$gray300',
                },
            },
            success: {
                backgroundColor: '$success500',
                color: '$white',
                pressStyle: {
                    backgroundColor: '$success600',
                },
                hoverStyle: {
                    backgroundColor: '$success600',
                },
            },
            danger: {
                backgroundColor: '$error500',
                color: '$white',
                pressStyle: {
                    backgroundColor: '$error600',
                },
                hoverStyle: {
                    backgroundColor: '$error600',
                },
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '$primary500',
                color: '$primary500',
                pressStyle: {
                    backgroundColor: '$primary50',
                },
                hoverStyle: {
                    backgroundColor: '$primary50',
                },
            },
            ghost: {
                backgroundColor: 'transparent',
                color: '$primary500',
                pressStyle: {
                    backgroundColor: '$primary50',
                },
                hoverStyle: {
                    backgroundColor: '$primary50',
                },
            },
        },
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
                paddingHorizontal: '$6',
                fontSize: '$lg',
            },
        },
        disabled: {
            true: {
                opacity: 0.5,
                pointerEvents: 'none',
            },
        },
    } as const,

    defaultVariants: {
        theme: 'primary',
        size: 'medium',
    },
});

export type ButtonProps = React.ComponentProps<typeof Button>;
