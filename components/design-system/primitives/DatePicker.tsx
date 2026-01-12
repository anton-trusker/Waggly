import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface DatePickerProps {
    label?: string;
    value?: Date;
    onChange?: (date: Date) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    mode?: 'date' | 'time' | 'datetime';
    maximumDate?: Date;
    minimumDate?: Date;
}

export const DatePicker = ({
    label,
    value,
    onChange,
    error,
    disabled,
    required,
    mode = 'date',
    maximumDate,
    minimumDate,
}: DatePickerProps) => {
    const [show, setShow] = useState(false);

    const handleChange = (event: any, selectedDate?: Date) => {
        // On Android, the picker closes itself
        // On iOS, we might keep it open in a modal or inline
        if (Platform.OS === 'android') {
            setShow(false);
        }

        if (selectedDate) {
            onChange?.(selectedDate);
        }
    };

    const formattedValue = value ? value.toLocaleDateString() : ''; // Basic formatting

    return (
        <View style={styles.container}>
            {label && (
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                        {label}
                        {required && <Text style={styles.requiredMark}> *</Text>}
                    </Text>
                </View>
            )}

            <TouchableOpacity
                onPress={() => !disabled && setShow(true)}
                disabled={disabled}
                activeOpacity={0.7}
                style={[
                    styles.trigger,
                    disabled && styles.triggerDisabled,
                    !!error && styles.triggerError,
                ]}
            >
                <Text style={[
                    styles.valueText,
                    !value && styles.placeholderText,
                    disabled && styles.textDisabled
                ]}>
                    {value ? formattedValue : 'Select date'}
                </Text>
                <IconSymbol
                    android_material_icon_name="calendar-today"
                    ios_icon_name="calendar"
                    size={20}
                    color={disabled ? designSystem.colors.text.tertiary : designSystem.colors.text.secondary}
                />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Picker Logic */}
            {Platform.OS === 'ios' ? (
                <Modal
                    visible={show}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShow(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShow(false)}
                    >
                        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setShow(false)}>
                                    <Text style={styles.doneText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={value || new Date()}
                                mode={mode}
                                display="spinner"
                                onChange={handleChange}
                                maximumDate={maximumDate}
                                minimumDate={minimumDate}
                                textColor={designSystem.colors.text.primary} // iOS 14+ specific?
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            ) : show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value || new Date()}
                    mode={mode}
                    is24Hour={true}
                    onChange={handleChange}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                />
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
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        letterSpacing: 0.1,
    },
    requiredMark: {
        color: designSystem.colors.status.error[500],
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: designSystem.colors.background.primary,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    triggerDisabled: {
        backgroundColor: designSystem.colors.neutral[50],
        borderColor: designSystem.colors.neutral[100],
    },
    triggerError: {
        borderColor: designSystem.colors.status.error[500],
    },
    valueText: {
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    placeholderText: {
        color: designSystem.colors.text.tertiary,
    },
    textDisabled: {
        color: designSystem.colors.text.tertiary,
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: designSystem.colors.status.error[500],
    },

    // iOS Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: designSystem.colors.background.primary,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
        paddingBottom: 8,
    },
    doneText: {
        fontSize: 16,
        color: designSystem.colors.primary[500],
        fontWeight: '600',
    }
});
