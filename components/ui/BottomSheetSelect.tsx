import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, SafeAreaView } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from './IconSymbol';

interface Option {
  label: string;
  value: string;
  icon?: string;
}

interface BottomSheetSelectProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function BottomSheetSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
}: BottomSheetSelectProps) {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={styles.inputButton} 
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <IconSymbol 
            ios_icon_name="chevron.down" 
            android_material_icon_name="keyboard-arrow-down" 
            size={20} 
            color={designSystem.colors.text.tertiary} 
        />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setVisible(false)}
        >
            <View style={styles.modalContent}>
                <SafeAreaView>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{label || 'Select'}</Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <IconSymbol 
                                ios_icon_name="xmark.circle.fill" 
                                android_material_icon_name="close" 
                                size={24} 
                                color={designSystem.colors.text.tertiary} 
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.optionsList}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionItem,
                                    value === option.value && styles.selectedOption
                                ]}
                                onPress={() => handleSelect(option.value)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    value === option.value && styles.selectedOptionText
                                ]}>
                                    {option.label}
                                </Text>
                                {value === option.value && (
                                    <IconSymbol 
                                        ios_icon_name="checkmark" 
                                        android_material_icon_name="check" 
                                        size={20} 
                                        color={designSystem.colors.primary[500]} 
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.text.primary,
    marginBottom: 8,
  },
  inputButton: {
    height: 48,
    backgroundColor: designSystem.colors.background.secondary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
  },
  inputText: {
    fontSize: 16,
    color: designSystem.colors.text.primary,
  },
  placeholderText: {
    color: designSystem.colors.text.tertiary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: designSystem.colors.text.primary,
  },
  optionsList: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: designSystem.colors.primary[50],
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: designSystem.colors.text.primary,
  },
  selectedOptionText: {
    color: designSystem.colors.primary[500],
    fontWeight: '600',
  },
});
