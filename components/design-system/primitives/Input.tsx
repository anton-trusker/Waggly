import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet, ViewStyle, TouchableOpacity, Platform, Pressable } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppTheme } from '@/hooks/useAppTheme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: string;
    rightIcon?: string;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
    required?: boolean;
    minHeight?: number;
}

export const Input = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    required,
    minHeight,
    style,
    onFocus,
    onBlur,
    secureTextEntry,
    multiline,
    ...props
}: InputProps) => {
    const { isDark } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
    const inputRef = React.useRef<TextInput>(null);

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

    const handleContainerPress = () => {
        inputRef.current?.focus();
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Label */}
            {label && (
                <View style={styles.labelContainer}>
                    <Text style={[styles.labelText, isDark && styles.labelTextDark]}>
                        {label}
                        {required && <Text style={styles.requiredMark}> *</Text>}
                    </Text>
                </View>
            )}

            {/* Input Field */}
            <Pressable
                onPress={handleContainerPress}
                style={[
                    styles.inputContainer,
                    isDark && styles.inputContainerDark,
                    isFocused && styles.inputContainerFocused,
                    isFocused && isDark && styles.inputContainerFocusedDark,
                    !!error && styles.inputContainerError,
                    minHeight ? { minHeight } : null,
                    multiline ? { minHeight: minHeight || 100 } : null,
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
                    ref={inputRef}
                    style={[
                        styles.input,
                        isDark && styles.inputDark,
                        multiline && styles.inputMultiline,
                        style
                    ]}
                    placeholderTextColor={isDark ? designSystem.colors.text.tertiary : designSystem.colors.text.tertiary}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={effectiveSecureTextEntry}
                    multiline={multiline}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    {...props}
                />

                {/* Password Toggle or Right Icon */}
                {isPassword ? (
                    <TouchableOpacity onPress={togglePassword} style={styles.rightIcon} activeOpacity={0.7}>
                        <IconSymbol
                            android_material_icon_name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                            ios_icon_name={isPasswordVisible ? 'eye.slash' : 'eye'}
                            size={20}
                            color={designSystem.colors.text.tertiary}
                        />
                    </TouchableOpacity>
                ) : rightIcon ? (
                    <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress} style={styles.rightIcon} activeOpacity={0.7}>
                        <IconSymbol
                            android_material_icon_name={rightIcon as any}
                            ios_icon_name="star" // Fallback
                            size={20}
                            color={designSystem.colors.text.tertiary}
                        />
                    </TouchableOpacity>
                ) : null}
            </Pressable>

            {/* Error Message */}
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : helperText ? (
                <Text style={styles.helperText}>{helperText}</Text>
            ) : null}
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
    labelTextDark: {
        color: designSystem.colors.neutral[300],
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
        backgroundColor: designSystem.colors.neutral[0],
        minHeight: 48,
    },
    inputContainerDark: {
        backgroundColor: designSystem.colors.neutral[900],
        borderColor: designSystem.colors.neutral[700],
    },
    inputContainerFocused: {
        borderColor: designSystem.colors.primary[500],
        ...Platform.select({
            web: { boxShadow: `0 0 0 2px ${designSystem.colors.primary[100]}` } as any,
        }),
    },
    inputContainerFocusedDark: {
        borderColor: designSystem.colors.primary[400],
        ...Platform.select({
            web: { boxShadow: `0 0 0 2px ${designSystem.colors.primary[900]}40` } as any,
        }),
    },
    inputContainerError: {
        borderColor: designSystem.colors.status.error[500],
    },
    input: {
        flex: 1,
        height: '100%',
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontSize: 16,
        color: designSystem.colors.text.primary,
        ...Platform.select({
            web: { outlineStyle: 'none' } as any
        })
    },
    inputMultiline: {
        paddingTop: 12,
        textAlignVertical: 'top',
    },
    inputDark: {
        color: designSystem.colors.neutral[0],
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
    helperText: {
        marginTop: 4,
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
    },
});
