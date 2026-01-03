import { TextInput, TextInputProps, StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import FormField from './FormField';
import { useLocale } from '@/hooks/useLocale';
import { IconSymbol } from './IconSymbol';
import { useState } from 'react';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  required?: boolean;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
};

export default function Input({ label, error, required, style, containerStyle, placeholder, isPassword, ...props }: Props) {
  const { t } = useLocale();
  const { colors } = useAppTheme();
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <FormField label={label} error={error} required={required}>
      <View style={[styles.container, {
        backgroundColor: colors.background.tertiary, // Use tertiary (white/dark gray)
        borderColor: error ? colors.status.error[500] : colors.border.primary,
      }, containerStyle]}>
        <TextInput
          style={[styles.input, { color: colors.text.primary }, style]}
          placeholderTextColor={colors.text.tertiary}
          placeholder={placeholder ? t(placeholder, { defaultValue: placeholder }) : undefined}
          secureTextEntry={isPassword ? isSecure : props.secureTextEntry}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.toggle} activeOpacity={0.7}>
            <IconSymbol
              android_material_icon_name={isSecure ? 'visibility' : 'visibility-off'}
              ios_icon_name={isSecure ? 'eye' : 'eye.slash'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  toggle: {
    padding: 4,
  }
});
