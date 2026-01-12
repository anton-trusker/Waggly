import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet, ViewStyle, TouchableOpacity, Platform } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: string;
    rightIcon?: string;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
    required?: boolean;
}

export const Input = ({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    required,
    style,
    onFocus,
    onBlur,
    secureTextEntry,
    ...props
}: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

    // Handle password toggle logic internally if secureTextEntry is true
    const isPassword = secureTextEntry !== undefined;
    const effectiveSecureTextEntry = isPassword ? !isPasswordVisible : false;

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const togglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Label */}
            {label && (
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>
                        {label}
                        {required && <Text style={styles.requiredMark}> *</Text>}
                    </Text>
                </View>
            )}

            {/* Input Field */}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    !!error && styles.inputContainerError,
                ]}
            >
                {leftIcon && (
                    <View style={styles.leftIcon}>
                        <IconSymbol
                            android_material_icon_name={leftIcon as any}
                            ios_icon_name="star" // Fallback
                            size={20}
                            color={designSystem.colors.text.tertiary}
                        />
                    </View>
                )}

                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={designSystem.colors.text.tertiary}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={effectiveSecureTextEntry}
                    {...props}
                />

                {/* Password Toggle or Right Icon */}
                {isPassword ? (
                    <TouchableOpacity onPress={togglePassword} style={styles.rightIcon}>
                        <IconSymbol
                            android_material_icon_name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                            ios_icon_name={isPasswordVisible ? 'eye.slash' : 'eye'}
                            size={20}
                            color={designSystem.colors.text.tertiary}
                        />
                    </TouchableOpacity>
                ) : rightIcon ? (
                    <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress} style={styles.rightIcon}>
                        <IconSymbol
                            android_material_icon_name={rightIcon as any}
                            ios_icon_name="star" // Fallback
                            size={20}
                            color={designSystem.colors.text.tertiary}
                        />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Error Message */}
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    labelContainer: {
        marginBottom: 6,
        flexDirection: 'row',
    },
    labelText: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        letterSpacing: 0.1,
    },
    requiredMark: {
        color: designSystem.colors.status.error[500],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 8,
        backgroundColor: designSystem.colors.background.primary,
        minHeight: 44, // Touch target size
    },
    inputContainerFocused: {
        borderColor: designSystem.colors.primary[500],
        // Add shadow or ring?
        ...Platform.select({
            web: { boxShadow: `0 0 0 2px ${designSystem.colors.primary[100]}` } as any,
        }),
    },
    inputContainerError: {
        borderColor: designSystem.colors.status.error[500],
    },
    input: {
        flex: 1,
        height: '100%',
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        color: designSystem.colors.text.primary,
        // Remove outline on web
        ...Platform.select({
            web: { outlineStyle: 'none' } as any
        })
    },
    leftIcon: {
        paddingLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightIcon: {
        paddingRight: 12,
        paddingLeft: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: designSystem.colors.status.error[500],
    },
});
