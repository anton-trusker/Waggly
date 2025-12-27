import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';

export interface Option {
    label: string;
    value: string;
}

interface ModernSelectProps {
    label: string;
    placeholder?: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    searchable?: boolean;
}

export default function ModernSelect({ label, placeholder, value, options, onChange, searchable = false }: ModernSelectProps) {
    const [visible, setVisible] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) return options;
        return options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [options, searchQuery]);

    const selectedLabel = options.find(opt => opt.value === value)?.label;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.trigger}
                onPress={() => setVisible(true)}
            >
                <Text style={value ? styles.valueText : styles.placeholderText}>
                    {selectedLabel || placeholder || 'Select...'}
                </Text>
                <IconSymbol
                    ios_icon_name="chevron.down"
                    android_material_icon_name="expand-more"
                    size={20}
                    color={designSystem.colors.primary[500]}
                />
            </TouchableOpacity>

            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                         {searchable ? (
                            <View style={styles.searchContainer}>
                                <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color={designSystem.colors.text.tertiary} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoFocus
                                />
                            </View>
                        ) : (
                            <Text style={styles.modalTitle}>{label}</Text>
                        )}
                        <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={filteredOptions}
                        keyExtractor={item => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.optionItem}
                                onPress={() => {
                                    onChange(item.value);
                                    setVisible(false);
                                }}
                            >
                                <Text style={styles.optionText}>{item.label}</Text>
                                {item.value === value && (
                                    <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={20} color={designSystem.colors.primary[500]} />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 8 },
    label: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.secondary,
        letterSpacing: 1,
        fontWeight: '700',
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        ...designSystem.shadows.sm,
    },
    valueText: {
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    placeholderText: {
        fontSize: 16,
        color: designSystem.colors.text.tertiary,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
        justifyContent: 'space-between',
    },
    modalTitle: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.text.primary,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.neutral[100],
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: designSystem.colors.text.primary,
        height: '100%',
    },
    closeButton: {
        padding: 4,
    },
    closeText: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.primary[500],
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    optionText: {
        ...designSystem.typography.body.large,
        color: designSystem.colors.text.primary,
    },
});
