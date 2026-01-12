import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    leftIcon?: string; // Material icon name
    rightIcon?: string;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    style,
}: ButtonProps) => {

    const getBackgroundColor = () => {
        if (disabled) return designSystem.colors.neutral[200];
        switch (variant) {
            case 'primary': return designSystem.colors.primary[500];
            case 'secondary': return designSystem.colors.secondary[500];
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            case 'danger': return designSystem.colors.status.error[500];
            default: return designSystem.colors.primary[500];
        }
    };

    const getTextColor = () => {
        if (disabled) return designSystem.colors.text.tertiary;
        switch (variant) {
            case 'primary': return '#FFFFFF';
            case 'secondary': return '#FFFFFF';
            case 'outline': return designSystem.colors.primary[500];
            case 'ghost': return designSystem.colors.primary[500];
            case 'danger': return '#FFFFFF';
            default: return '#FFFFFF';
        }
    };

    const getHeight = () => {
        switch (size) {
            case 'sm': return 32;
            case 'md': return 44; // Standard touch target
            case 'lg': return 56;
            default: return 44;
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'sm': return 13;
            case 'md': return 15;
            case 'lg': return 17;
        }
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.base,
                {
                    backgroundColor: getBackgroundColor(),
                    height: getHeight(),
                    borderColor: variant === 'outline' ? designSystem.colors.primary[500] : 'transparent',
                    borderWidth: variant === 'outline' ? 1 : 0,
                    width: fullWidth ? '100%' : 'auto',
                    alignSelf: fullWidth ? 'stretch' : 'flex-start',
                },
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <View style={styles.contentContainer}>
                    {leftIcon && (
                        <IconSymbol
                            android_material_icon_name={leftIcon as any}
                            ios_icon_name="star" // Fallback 
                            size={size === 'sm' ? 16 : 20}
                            color={getTextColor()}
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <Text style={[styles.text, { color: getTextColor(), fontSize: getFontSize() }]}>
                        {title}
                    </Text>
                    {rightIcon && (
                        <IconSymbol
                            android_material_icon_name={rightIcon as any}
                            ios_icon_name="star" // Fallback 
                            size={size === 'sm' ? 16 : 20}
                            color={getTextColor()}
                            style={{ marginLeft: 8 }}
                        />
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: 8, // Per design system
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        ...designSystem.shadows.sm,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
