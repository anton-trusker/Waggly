import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  Platform,
  Keyboard,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocale } from '@/hooks/useLocale';

interface EnhancedDropdownOption {
  label: string;
  value: string;
  icon?: string;
  emoji?: string;
}

interface EnhancedDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: EnhancedDropdownOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  icon?: string;
  emptyText?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function EnhancedDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  searchable = true,
  icon = 'chevron.down',
  emptyText = 'No options available',
}: EnhancedDropdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const searchInputRef = useRef<TextInput>(null);
  const { t } = useLocale();

  // Handle keyboard events
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;

    const query = searchQuery.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const selectedOption = useMemo(() => {
    return options.find(option => option.value === value);
  }, [options, value]);

  const handleSelect = useCallback((selectedValue: string) => {
    onChange(selectedValue);
    setIsVisible(false);
    setSearchQuery('');
  }, [onChange]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsVisible(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setSearchQuery('');
    searchInputRef.current?.blur();
  }, []);

  const renderOption = useCallback(({ item, index }: { item: EnhancedDropdownOption; index: number }) => {
    const isSelected = item.value === value;

    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          index === 0 && styles.optionItemFirst,
          index === filteredOptions.length - 1 && styles.optionItemLast,
          isSelected && styles.optionItemSelected,
        ] as any}
        onPress={() => handleSelect(item.value)}
        accessibilityRole="button"
        accessibilityLabel={item.label}
        accessibilityState={{ selected: isSelected }}
      >
        <View style={styles.optionContent}>
          {item.emoji && <Text style={styles.optionEmoji}>{item.emoji}</Text>}
          {item.icon && (
            <IconSymbol
              ios_icon_name={item.icon}
              android_material_icon_name={item.icon}
              size={20}
              color={isSelected ? designSystem.colors.primary[500] : designSystem.colors.text.secondary}
              style={styles.optionIcon}
            />
          )}
          <Text style={[
            styles.optionLabel,
            isSelected && styles.optionLabelSelected,
          ] as any}>
            {item.label}
          </Text>
        </View>
        {isSelected && (
          <IconSymbol
            ios_icon_name="checkmark"
            android_material_icon_name="check"
            size={20}
            color={designSystem.colors.primary[500] as any}
          />
        )}
      </TouchableOpacity>
    );
  }, [filteredOptions.length, handleSelect, value]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText as any}>{t(emptyText, { defaultValue: emptyText })}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && (
          <IconSymbol
            ios_icon_name={icon}
            android_material_icon_name={icon}
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
          styles.dropdownButton,
          error && styles.dropdownButtonError,
          disabled && styles.dropdownButtonDisabled,
        ] as any}
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={t('open_selector', { defaultValue: `Select ${label}`, label })}
        accessibilityState={{ expanded: isVisible, disabled }}
      >
        <View style={styles.dropdownContent}>
          {selectedOption?.emoji && (
            <Text style={styles.selectedEmoji}>{selectedOption.emoji}</Text>
          )}
          {selectedOption?.icon && (
            <IconSymbol
              ios_icon_name={selectedOption.icon}
              android_material_icon_name={selectedOption.icon}
              size={20}
              color={designSystem.colors.text.primary}
              style={styles.selectedIcon}
            />
          )}
          <Text style={[
            styles.dropdownText,
            !selectedOption && styles.dropdownPlaceholder,
            disabled && styles.dropdownTextDisabled,
          ]}>
            {selectedOption?.label || t(placeholder, { defaultValue: placeholder })}
          </Text>
        </View>
        <IconSymbol
          ios_icon_name="chevron.down"
          android_material_icon_name="keyboard-arrow-down"
          size={20}
          color={disabled ? designSystem.colors.text.quaternary : designSystem.colors.text.secondary}
          style={[
            styles.dropdownArrow,
            isVisible && styles.dropdownArrowOpen,
          ] as any}
        />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {t(error || '', { defaultValue: error || '' })}
        </Text>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={[
            styles.modalContent,
            { bottom: keyboardHeight + 20 },
          ]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t(label, { defaultValue: label })}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleClose}
                accessibilityLabel="Close dropdown"
              >
                <IconSymbol
                  ios_icon_name="xmark"
                  android_material_icon_name="close"
                  size={24}
                  color={designSystem.colors.text.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Search */}
            {searchable && (
              <View style={styles.searchContainer}>
                <IconSymbol
                  ios_icon_name="magnifyingglass"
                  android_material_icon_name="search"
                  size={20}
                  color={designSystem.colors.text.secondary}
                  style={styles.searchIcon}
                />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder={t('common.search', { defaultValue: 'Search...' })}
                  placeholderTextColor={designSystem.colors.text.tertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSearchQuery('')}
                    accessibilityLabel="Clear search"
                  >
                    <IconSymbol
                      ios_icon_name="xmark.circle.fill"
                      android_material_icon_name="cancel"
                      size={20}
                      color={designSystem.colors.text.secondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Options List */}
            <FlashList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              estimatedItemSize={56}
              style={styles.optionsList}
              contentContainerStyle={[
                styles.optionsContent,
                filteredOptions.length === 0 && styles.optionsContentEmpty,
              ] as any}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: designSystem.spacing[4],
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designSystem.spacing[2],
  },
  labelIcon: {
    marginRight: designSystem.spacing[2],
  },
  label: {
    ...designSystem.typography.label.medium,
    color: designSystem.colors.text.secondary,
  },
  required: {
    color: designSystem.colors.error[500],
  },
  dropdownButton: {
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
  dropdownButtonError: {
    borderColor: designSystem.colors.error[500],
  },
  dropdownButtonDisabled: {
    backgroundColor: designSystem.colors.neutral[100],
    borderColor: designSystem.colors.neutral[200],
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownText: {
    ...designSystem.typography.body.large,
    color: designSystem.colors.text.primary,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: designSystem.colors.text.tertiary,
  },
  dropdownTextDisabled: {
    color: designSystem.colors.text.quaternary,
  },
  selectedEmoji: {
    fontSize: 20,
    marginRight: designSystem.spacing[2],
  },
  selectedIcon: {
    marginRight: designSystem.spacing[2],
  },
  dropdownArrow: {
    marginLeft: designSystem.spacing[2],
  },
  dropdownArrowOpen: {
    transform: [{ rotate: '180deg' }],
  },
  errorText: {
    ...designSystem.typography.body.small,
    color: designSystem.colors.error[500],
    marginTop: designSystem.spacing[1],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: designSystem.colors.background.primary,
    borderTopLeftRadius: designSystem.borderRadius.xl,
    borderTopRightRadius: designSystem.borderRadius.xl,
    maxHeight: screenHeight * 0.7,
    marginHorizontal: 0,
    ...designSystem.shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getSpacing(4),
    paddingVertical: getSpacing(3),
    borderBottomWidth: 1,
    borderBottomColor: designSystem.colors.neutral[200],
  },
  modalTitle: {
    ...designSystem.typography.title.large,
    color: designSystem.colors.text.primary,
  },
  modalCloseButton: {
    padding: designSystem.spacing[1],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designSystem.colors.neutral[50],
    borderRadius: designSystem.borderRadius.md,
    marginHorizontal: designSystem.spacing[4],
    marginVertical: designSystem.spacing[3],
    paddingHorizontal: designSystem.spacing[3],
  },
  searchIcon: {
    marginRight: designSystem.spacing[2],
  },
  searchInput: {
    flex: 1,
    ...designSystem.typography.body.large,
    color: designSystem.colors.text.primary,
    paddingVertical: designSystem.spacing[3],
  },
  clearButton: {
    padding: designSystem.spacing[1],
    marginLeft: designSystem.spacing[2],
  },
  optionsList: {
    maxHeight: screenHeight * 0.4,
  },
  optionsContent: {
    paddingHorizontal: designSystem.spacing[2],
    paddingBottom: designSystem.spacing[4],
  },
  optionsContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: designSystem.spacing[3],
    paddingVertical: designSystem.spacing[3],
    borderRadius: designSystem.borderRadius.md,
  },
  optionItemFirst: {
    marginTop: designSystem.spacing[2],
  },
  optionItemLast: {
    marginBottom: designSystem.spacing[2],
  },
  optionItemSelected: {
    backgroundColor: designSystem.colors.primary[50],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: getSpacing(2),
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: designSystem.spacing[2],
  },
  optionIcon: {
    marginRight: designSystem.spacing[2],
  },
  optionLabel: {
    ...designSystem.typography.body.large,
    color: designSystem.colors.text.primary,
    flex: 1,
  },
  optionLabelSelected: {
    color: designSystem.colors.primary[600],
    fontWeight: '600',
  },
  emptyContainer: {
    padding: designSystem.spacing[8],
    alignItems: 'center',
  },
  emptyText: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.secondary,
    textAlign: 'center',
  },
});
