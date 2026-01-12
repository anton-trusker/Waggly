import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, Platform, SafeAreaView } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Input } from './Input';

export interface SelectOption {
    label: string;
    value: string | number;
    icon?: string;
    description?: string;
}

interface SelectProps {
    label?: string;
    placeholder?: string;
    value?: string | number;
    options: SelectOption[];
    onChange?: (value: string | number) => void;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
    required?: boolean;
}

export const Select = ({
    label,
    placeholder = 'Select an option',
    value,
    options,
    onChange,
    error,
    disabled,
    searchable = false,
    required
}: SelectProps) => {
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        return options.filter(opt =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    const handleSelect = (val: string | number) => {
        onChange?.(val);
        setVisible(false);
        setSearchQuery('');
    };

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
                onPress={() => !disabled && setVisible(true)}
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
                    !selectedOption && styles.placeholderText,
                    disabled && styles.textDisabled
                ]}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <IconSymbol
                    android_material_icon_name="arrow-drop-down"
                    ios_icon_name="chevron.down"
                    size={20}
                    color={disabled ? designSystem.colors.text.tertiary : designSystem.colors.text.secondary}
                />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Modal Selection */}
            <Modal
                visible={visible}
                animationType="fade"
                transparent
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label || 'Select Option'}</Text>
                            <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
                                <IconSymbol android_material_icon_name="close" ios_icon_name="xmark" size={20} color={designSystem.colors.text.secondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Search */}
                        {searchable && (
                            <View style={styles.searchContainer}>
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    leftIcon="search"
                                    containerStyle={{ marginBottom: 0 }}
                                />
                            </View>
                        )}

                        {/* List */}
                        <FlatList
                            data={filteredOptions}
                            keyExtractor={item => String(item.value)}
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.optionItem,
                                        item.value === value && styles.optionItemSelected
                                    ]}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <Text style={[
                                        styles.optionLabel,
                                        item.value === value && styles.optionLabelSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                    {item.value === value && (
                                        <IconSymbol
                                            android_material_icon_name="check"
                                            ios_icon_name="checkmark"
                                            size={18}
                                            color={designSystem.colors.primary[500]}
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No options found</Text>
                                </View>
                            }
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
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

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContent: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 12,
        maxHeight: '80%',
        ...designSystem.shadows.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        padding: 16,
        paddingBottom: 8,
    },
    list: {
        flexGrow: 0,
    },
    listContent: {
        padding: 8,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    optionItemSelected: {
        backgroundColor: designSystem.colors.primary[50],
    },
    optionLabel: {
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    optionLabelSelected: {
        color: designSystem.colors.primary[700],
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: designSystem.colors.text.tertiary,
    },
});
