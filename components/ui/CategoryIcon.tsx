import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';

interface CategoryIconProps {
    icon: any;
    size?: number;
    gradientStart?: string;
    gradientEnd?: string;
    iconColor?: string;
    style?: ViewStyle;
}

/**
 * Renders a branded category icon: White vector icon on Ocean Gradient background.
 * Matches the "Waggli" visual identity.
 */
export default function CategoryIcon({
    icon,
    materialIconName,
    size = 48,
    gradientStart = designSystem.colors.primary[500],
    gradientEnd = designSystem.colors.secondary[500],
    iconColor = '#FFFFFF',
    style,
}: CategoryIconProps & { materialIconName?: string }) {
    const iconSize = size * 0.5;

    return (
        <LinearGradient
            colors={[gradientStart, gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                styles.container,
                { width: size, height: size, borderRadius: size * 0.25 },
                style,
            ]}
        >
            <IconSymbol
                ios_icon_name={icon}
                android_material_icon_name={materialIconName || icon}
                size={iconSize}
                color={iconColor}
                weight="medium"
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});
