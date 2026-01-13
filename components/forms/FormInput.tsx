import { ViewStyle } from 'react-native';
import { Input } from '@/components/design-system/primitives/Input';

interface FormInputProps extends TextInputProps {
    label?: string;
    required?: boolean;
    error?: string;
    helpText?: string;
    containerStyle?: ViewStyle;
}

export default function FormInput({
    label,
    required,
    error,
    helpText,
    containerStyle,
    ...props
}: FormInputProps) {
    return (
        <Input
            label={label}
            required={required}
            error={error}
            helperText={helpText}
            containerStyle={containerStyle}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: formColors.labelText,
        marginBottom: 6,
    },
    required: {
        color: formColors.errorText,
    },
    input: {
        backgroundColor: formColors.inputBackground,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: formColors.inputText,
        borderWidth: 1,
        borderColor: formColors.inputBorder,
    },
    inputFocused: {
        borderColor: formColors.inputBorderFocus,
        shadowColor: formColors.inputBorderFocus,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    inputError: {
        borderColor: formColors.errorBorder,
        backgroundColor: formColors.errorBackground,
    },
    errorText: {
        fontSize: 12,
        color: formColors.errorText,
        marginTop: 4,
    },
    helpText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
});
