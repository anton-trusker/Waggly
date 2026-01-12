import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Platform, StyleProp } from 'react-native';
import { designSystem } from '@/constants/designSystem';

interface EntityCardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    variant?: 'elevated' | 'outlined' | 'flat';
}

export const EntityCard = ({
    children,
    onPress,
    style,
    variant = 'elevated'
}: EntityCardProps) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            activeOpacity={onPress ? 0.7 : 1}
            style={[
                styles.card,
                variant === 'elevated' && styles.elevated,
                variant === 'outlined' && styles.outlined,
                variant === 'flat' && styles.flat,
                style
            ]}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 16,
        padding: 16,
        overflow: 'hidden',
    },
    elevated: {
        ...designSystem.shadows.md,
    },
    outlined: {
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
    },
    flat: {
        backgroundColor: designSystem.colors.neutral[50], // Slightly grey for flat
    },
});
