import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';

function mapAndroidIcon(name?: string) {
  if (!name) return undefined as any;
  if (name === 'pill.fill' || name === 'pill') return 'medication' as any;
  return name as any;
}

interface SelectionOption {
  id: string;
  label: string;
  subLabel?: string;
  icon?: string;
  category?: string;
}

interface EnhancedSelectionProps {
  label: string;
  value?: string;
  options: SelectionOption[];
  onSelect: (option: SelectionOption) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: string;
  searchable?: boolean;
}

export default function EnhancedSelection({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Select option',
  error,
  required = false,
  disabled = false,
  icon = 'chevron.down',
  searchable = true,
}: EnhancedSelectionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = useMemo(() => 
    options.find(opt => opt.id === value || opt.label === value), 
  [value, options]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(opt => 
      opt.label.toLowerCase().includes(query) || 
      opt.subLabel?.toLowerCase().includes(query) ||
      opt.category?.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const handleSelect = (option: SelectionOption) => {
    onSelect(option);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && icon !== 'chevron.down' && (
           <IconSymbol
             ios_icon_name={icon as any}
             android_material_icon_name={mapAndroidIcon(icon)}
             size={16}
             color={designSystem.colors.text.secondary}
             style={styles.labelIcon}
           />
        )}
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.selector,
          error && styles.selectorError,
          disabled && styles.selectorDisabled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.valueText, 
          !selectedOption && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <IconSymbol 
            ios_icon_name="chevron.down" 
            android_material_icon_name="keyboard-arrow-down" 
            size={20} 
            color={colors.textSecondary} 
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{label}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                         <IconSymbol ios_icon_name="xmark.circle.fill" android_material_icon_name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {searchable && (
                    <View style={styles.searchContainer}>
                        <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCorrect={false}
                        />
                    </View>
                )}

                <FlatList
                    data={filteredOptions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={[
                                styles.optionItem,
                                selectedOption?.id === item.id && styles.selectedOption
                            ]}
                            onPress={() => handleSelect(item)}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={[
                                    styles.optionLabel,
                                    selectedOption?.id === item.id && styles.selectedOptionText
                                ]}>{item.label}</Text>
                                {item.subLabel && (
                                    <Text style={styles.optionSubLabel}>{item.subLabel}</Text>
                                )}
                            </View>
                            {selectedOption?.id === item.id && (
                                <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={20} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No options found</Text>
                        </View>
                    }
                />
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: getSpacing(4),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(2),
  },
  labelIcon: {
    marginRight: getSpacing(2),
  },
  label: {
    ...designSystem.typography.label.medium,
    color: designSystem.colors.text.secondary,
  },
  required: {
    color: designSystem.colors.error[500],
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: designSystem.colors.background.primary,
    borderWidth: 1,
    borderColor: designSystem.colors.neutral[300],
    borderRadius: designSystem.borderRadius.md,
    paddingHorizontal: getSpacing(4),
    paddingVertical: getSpacing(3),
    minHeight: designSystem.components.input.minHeight,
  },
  selectorError: {
    borderColor: designSystem.colors.error[500],
  },
  selectorDisabled: {
    backgroundColor: designSystem.colors.neutral[100],
    borderColor: designSystem.colors.neutral[200],
  },
  valueText: {
    ...designSystem.typography.body.large,
    color: designSystem.colors.text.primary,
    flex: 1,
  },
  placeholderText: {
    color: designSystem.colors.text.tertiary,
  },
  disabledText: {
    color: designSystem.colors.text.quaternary,
  },
  errorText: {
    ...designSystem.typography.body.small,
    color: designSystem.colors.error[500],
    marginTop: getSpacing(1),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: designSystem.colors.background.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '70%',
    padding: 20,
    ...designSystem.shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designSystem.colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  selectedOption: {
    backgroundColor: colors.primary + '10', // 10% opacity
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  optionSubLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
