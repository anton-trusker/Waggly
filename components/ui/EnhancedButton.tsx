import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { IconSymbol } from './IconSymbol';
import { useLocale } from '@/hooks/useLocale';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  textStyle?: any;
  iconColor?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  rounded = false,
  style,
  textStyle,
  iconColor,
  ...props
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { t } = useLocale();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled || loading
            ? designSystem.colors.primary[300]
            : designSystem.colors.primary[500],
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: disabled || loading
            ? designSystem.colors.neutral[100]
            : designSystem.colors.neutral[0],
          borderColor: designSystem.colors.neutral[300],
          borderWidth: 1,
        };
      case 'tertiary':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: disabled || loading
            ? designSystem.colors.error[100]
            : designSystem.colors.error[500],
          borderColor: 'transparent',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          minHeight: designSystem.components.button.minHeight.sm,
          paddingHorizontal: getSpacing(3),
        };
      case 'md':
        return {
          minHeight: designSystem.components.button.minHeight.md,
          paddingHorizontal: getSpacing(4),
        };
      case 'lg':
        return {
          minHeight: designSystem.components.button.minHeight.lg,
          paddingHorizontal: getSpacing(6),
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    if (disabled || loading) {
      switch (variant) {
        case 'primary':
        case 'danger':
          return designSystem.colors.text.inverse;
        case 'secondary':
          return designSystem.colors.neutral[400];
        case 'tertiary':
        case 'ghost':
          return designSystem.colors.neutral[400];
        default:
          return designSystem.colors.text.primary;
      }
    }

    switch (variant) {
      case 'primary':
      case 'danger':
        return designSystem.colors.text.inverse;
      case 'secondary':
        return designSystem.colors.text.primary;
      case 'tertiary':
      case 'ghost':
        return designSystem.colors.primary[500];
      default:
        return designSystem.colors.text.primary;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return designSystem.typography.label.small;
      case 'md':
        return designSystem.typography.label.medium;
      case 'lg':
        return designSystem.typography.label.large;
      default:
        return designSystem.typography.label.medium;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        rounded && { borderRadius: designSystem.borderRadius.full },
        fullWidth && { width: '100%' },
        isPressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger'
              ? designSystem.colors.text.inverse
              : designSystem.colors.primary[500]
            }
            style={styles.loadingIndicator}
          />
        )}

        {icon && iconPosition === 'left' && !loading && (
          <IconSymbol
            android_material_icon_name={icon}
            ios_icon_name={icon}
            size={size === 'sm' ? designSystem.iconSizes.sm : size === 'lg' ? designSystem.iconSizes.lg : designSystem.iconSizes.md}
            color={getTextColor()}
            style={styles.leftIcon}
          />
        )}

        <Text style={[
          styles.text,
          getTextSize(),
          { color: getTextColor() },
        ]}>
          {t(title, { defaultValue: title })}
        </Text>

        {icon && iconPosition === 'right' && !loading && (
          <IconSymbol
            android_material_icon_name={icon}
            ios_icon_name={icon}
            size={size === 'sm' ? designSystem.iconSizes.sm : size === 'lg' ? designSystem.iconSizes.lg : designSystem.iconSizes.md}
            color={getTextColor()}
            style={styles.rightIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: designSystem.borderRadius.md,
    ...designSystem.shadows.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: designSystem.spacing[2],
  },
  rightIcon: {
    marginLeft: designSystem.spacing[2],
  },
  loadingIndicator: {
    marginRight: designSystem.spacing[2],
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

export { Button as EnhancedButton };
export default Button;
