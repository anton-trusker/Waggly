import { Text as RNText, TextProps, StyleSheet, TextStyle } from 'react-native';
import { designSystem } from '@/constants/designSystem';

type Variant =
    | keyof typeof designSystem.typography.display
    | keyof typeof designSystem.typography.headline
    | keyof typeof designSystem.typography.title
    | keyof typeof designSystem.typography.body
    | keyof typeof designSystem.typography.label;

interface Props extends TextProps {
    variant?: Variant;
    color?: string;
    weight?: TextStyle['fontWeight'];
    align?: 'left' | 'center' | 'right';
    size?: number;
}

const getTypographyStyle = (variant: Variant): TextStyle => {
    // Flatten the nested typography object to find the style
    const allStyles: Record<string, any> = {
        ...designSystem.typography.display,
        ...designSystem.typography.headline,
        ...designSystem.typography.title,
        ...designSystem.typography.body,
        ...designSystem.typography.label,
    };
    return allStyles[variant] || designSystem.typography.body.medium;
};

export const Text = ({
    variant,
    color = designSystem.colors.text.primary,
    weight,
    align,
    style,
    size,
    ...props
}: Props) => {
    const typographyStyle = variant ? getTypographyStyle(variant) : {};

    return (
        <RNText
            style={[
                typographyStyle,
                { color },
                align ? { textAlign: align } : null,
                weight ? { fontWeight: weight } : null,
                size ? { fontSize: size } : null,
                style
            ]}
            {...props}
        />
    );
};
