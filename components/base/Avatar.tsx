import { styled, Stack, Image, Text } from 'tamagui';
import { ComponentProps } from 'react';

// Avatar container
export const AvatarContainer = styled(Stack, {
    name: 'Avatar',
    backgroundColor: '$primary100',
    borderRadius: '$full',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    variants: {
        size: {
            small: {
                width: 32,
                height: 32,
            },
            medium: {
                width: 40,
                height: 40,
            },
            large: {
                width: 48,
                height: 48,
            },
            xlarge: {
                width: 64,
                height: 64,
            },
            xxlarge: {
                width: 96,
                height: 96,
            },
        },
    } as const,

    defaultVariants: {
        size: 'medium',
    },
});

// Avatar image
const AvatarImage = styled(Image, {
    width: '100%',
    height: '100%',
});

// Avatar fallback text
const AvatarFallback = styled(Text, {
    color: '$primary700',
    fontWeight: '600',
    fontSize: '$base',
});

// Avatar component
export interface AvatarProps extends ComponentProps<typeof AvatarContainer> {
    src?: string;
    alt?: string;
    fallback?: string;
}

export function Avatar({ src, alt, fallback, size = 'medium', ...props }: AvatarProps) {
    const getFallbackText = () => {
        if (fallback) return fallback;
        if (alt) return alt.charAt(0).toUpperCase();
        return '?';
    };

    const getFallbackSize = () => {
        switch (size) {
            case 'small':
                return '$sm';
            case 'medium':
                return '$base';
            case 'large':
                return '$lg';
            case 'xlarge':
                return '$xl';
            case 'xxlarge':
                return '$3xl';
            default:
                return '$base';
        }
    };

    return (
        <AvatarContainer size={size} {...props}>
            {src ? (
                <AvatarImage source={{ uri: src }} alt={alt} resizeMode="cover" />
            ) : (
                <AvatarFallback fontSize={getFallbackSize()}>{getFallbackText()}</AvatarFallback>
            )}
        </AvatarContainer>
    );
}

export type { AvatarProps };

export default Avatar;
