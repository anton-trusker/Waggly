import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { designSystem } from '@/constants/designSystem';

type Variant = keyof typeof designSystem.typography.display | keyof typeof designSystem.typography.title | keyof typeof designSystem.typography.body | keyof typeof designSystem.typography.label;

interface Props extends TextProps {
    variant?: Variant;
    color?: string;
    weight?: '400' | '500' | '600' | '700';
    align?: 'left' | 'center' | 'right';
    size?: number;
}

const getTypographyStyle = (variant: Variant) => {
    // Flatten the nested typography object to find the style
    const allStyles = {
        ...designSystem.typography.display,
        ...designSystem.typography.title,
        ...designSystem.typography.body,
        ...designSystem.typography.label,
    };
    return (allStyles as any)[variant] || designSystem.typography.body.medium;
};

export const Text = ({
    variant = 'medium', // Default to body.medium equivalent if possible, or just a safe default
    color = designSystem.colors.text.primary,
    weight,
    align,
    style,
    size,
    ...props
}: Props) => {
    // Map simple variant names if needed, or directly use designSystem keys
    // For now, let's assume usage like variant="large" implies body.large

    // A better approach might be specific props like `typography="title.large"` but let's keep it simple for now
    // Using direct style injection from designSystem if the user passes the full object? 
    // No, let's restrict to keys.

    // Simplified lookup for this iteration:
    // We'll trust the user to pass a valid style object or we default.
    // Actually, let's just wrap RNText and allow overriding styles easily, 
    // but provide shortcuts for colors and weights.

    return (
        <RNText
            style={[
                { color, textAlign: align, fontWeight: weight as any, fontSize: size },
                style
            ]}
            {...props}
        />
    );
};
