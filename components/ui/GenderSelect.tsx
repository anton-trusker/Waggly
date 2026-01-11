import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';

const GENDERS = [
    { value: 'male', label: 'Male', icon: '♂️' },
    { value: 'female', label: 'Female', icon: '♀️' },
    { value: 'other', label: 'Other', icon: '⚧️' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say', icon: '🔒' },
];

interface GenderSelectProps {
    value?: string;
    onChange: (value: string) => void;
    label?: string;
}

export default function GenderSelect({ value, onChange, label = 'Gender' }: GenderSelectProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    const selectedGender = GENDERS.find(g => g.value === value);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowDropdown(true)}
            >
                <Text style={[styles.selectorText, !selectedGender && styles.placeholder]}>
                    {selectedGender ? `${selectedGender.icon} ${selectedGender.label}` : 'Select gender'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>

            <Modal
                visible={showDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowDropdown(false)}
                >
                    <View style={styles.dropdown}>
                        <Text style={styles.dropdownTitle}>Select Gender</Text>
                        {GENDERS.map((gender) => (
                            <TouchableOpacity
                                key={gender.value}
                                style={[styles.option, value === gender.value && styles.optionSelected] as any}
                                onPress={() => {
                                    onChange(gender.value);
                                    setShowDropdown(false);
                                }}
                            >
                                <Text style={styles.optionIcon}>{gender.icon}</Text>
                                <Text style={[styles.optionText, value === gender.value && styles.optionTextSelected]}>
                                    {gender.label}
                                </Text>
                                {value === gender.value && (
                                    <Ionicons name="checkmark" size={20} color="#0A84FF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: getSpacing(4),
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: designSystem.colors.text.secondary,
        marginBottom: 8,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        borderWidth: 1,
        borderColor: getColor('border.primary'),
        borderRadius: 12,
        backgroundColor: getColor('background.primary'),
        paddingHorizontal: 16,
    },
    selectorText: {
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    placeholder: {
        color: designSystem.colors.text.tertiary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    dropdown: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 8,
    },
    dropdownTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
        marginBottom: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 12,
    },
    optionSelected: {
        backgroundColor: '#0A84FF20',
    },
    optionIcon: {
        fontSize: 20,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
    },
    optionTextSelected: {
        color: '#0A84FF',
        fontWeight: '600',
    },
});
