import React from 'react';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import { Text } from './Text';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    onChange,
    error,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.touchable}
                onPress={() => onChange(!checked)}
                activeOpacity={0.7}
            >
                <View style={[
                    styles.box,
                    checked && styles.checkedBox,
                    error ? styles.errorBox : null
                ]}>
                    {checked && (
                        <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FFFFFF"
                        />
                    )}
                </View>
                <Text variant="medium" style={styles.label}>{label}</Text>
            </TouchableOpacity>
            {error && <Text variant="small" style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    touchable: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    box: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: designSystem.colors.border.primary,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        transitionProperty: 'all',
        transitionDuration: '0.2s',
    } as any,
    checkedBox: {
        backgroundColor: designSystem.colors.primary[500],
        borderColor: designSystem.colors.primary[500],
    },
    errorBox: {
        borderColor: designSystem.colors.error[500],
    },
    label: {
        marginLeft: 10,
        color: designSystem.colors.text.primary,
    },
    errorText: {
        color: designSystem.colors.error[500],
        marginTop: 4,
        marginLeft: 32,
    },
});
