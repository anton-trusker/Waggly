import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView } from 'react-native';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocale } from '@/hooks/useLocale';
import CalendarMonthView from '@/components/features/calendar/CalendarMonthView';

interface EnhancedDatePickerProps {
  label: string;
  value: string; // DD-MM-YYYY
  onChange: (date: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: string;
  placeholder?: string;
  hideIcon?: boolean; // New prop to hide icon from input
}

export default function EnhancedDatePicker({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon = 'calendar',
  placeholder = 'Select date',
  hideIcon = true, // Default true per user request
}: EnhancedDatePickerProps) {
  const { t } = useLocale();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Parse initial date for calendar
  const initialDate = value ? new Date(value.split('-').reverse().join('-')) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selectedIso, setSelectedIso] = useState(value ? value.split('-').reverse().join('-') : '');
  
  // Year selection mode
  const [yearSelectionMode, setYearSelectionMode] = useState(false);

  // Parse value to display format (DD-MM-YYYY -> locale friendly or just keep DD-MM-YYYY)
  // The input value is DD-MM-YYYY. Let's keep it consistent.

  const handleDaySelect = (isoDate: string) => {
    // isoDate is YYYY-MM-DD
    const [y, m, d] = isoDate.split('-');
    onChange(`${d}-${m}-${y}`);
    setModalVisible(false);
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(newDate.getFullYear());
    setViewMonth(newDate.getMonth());
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i); // 50 years back, 50 forward

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {!hideIcon && icon && (
           <IconSymbol
             ios_icon_name={icon as any}
             android_material_icon_name={icon as any}
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
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.valueText, 
          !value && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {value || t(placeholder || 'Select date', { defaultValue: placeholder || 'Select date' })}
        </Text>
        {/* Only show chevron/icon if not hidden, or maybe always show chevron for dropdown feel? User said "without Calendar icon". Chevron is fine. */}
        <IconSymbol 
            ios_icon_name="chevron.down" 
            android_material_icon_name="keyboard-arrow-down" 
            size={20} 
            color={getColor('text.secondary')} 
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)}
        >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                {/* Header with Year/Month Selector */}
                <View style={styles.header}>
                    {!yearSelectionMode ? (
                        <>
                            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
                                <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="chevron-left" size={24} color={getColor('text.primary')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setYearSelectionMode(true)}>
                                <Text style={styles.monthLabel}>
                                    {new Date(viewYear, viewMonth).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
                                <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={24} color={getColor('text.primary')} />
                            </TouchableOpacity>
                        </>
                    ) : (
                         <View style={styles.yearHeader}>
                            <Text style={styles.yearTitle}>{t('date.select_year', { defaultValue: 'Select Year' })}</Text>
                            <TouchableOpacity onPress={() => setYearSelectionMode(false)} style={styles.closeYearButton}>
                                <IconSymbol ios_icon_name="xmark" android_material_icon_name="close" size={20} color={getColor('text.primary')} />
                            </TouchableOpacity>
                         </View>
                    )}
                </View>

                {yearSelectionMode ? (
                    <View style={styles.yearListContainer}>
                         <ScrollView showsVerticalScrollIndicator={false}>
                             <View style={styles.yearGrid}>
                                 {years.map(year => (
                                     <TouchableOpacity 
                                        key={year} 
                                        style={[styles.yearItem, year === viewYear && styles.yearItemSelected]}
                                        onPress={() => {
                                            setViewYear(year);
                                            setYearSelectionMode(false);
                                        }}
                                     >
                                         <Text style={[styles.yearText, year === viewYear && styles.yearTextSelected]}>{year}</Text>
                                     </TouchableOpacity>
                                 ))}
                             </View>
                         </ScrollView>
                    </View>
                ) : (
                    <CalendarMonthView
                        year={viewYear}
                        month={viewMonth}
                        selected={selectedIso}
                        onSelect={handleDaySelect}
                    />
                )}
                
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelText}>{t('common.cancel', { defaultValue: 'Cancel' })}</Text>
                </TouchableOpacity>
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
  input: {
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
  inputError: {
    borderColor: designSystem.colors.error[500],
  },
  inputDisabled: {
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: designSystem.colors.background.primary,
    borderRadius: 24,
    padding: 20,
    ...designSystem.shadows.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: designSystem.colors.text.primary,
  },
  navButton: {
    padding: 8,
  },
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  yearTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: designSystem.colors.text.primary,
  },
  closeYearButton: {
    padding: 4,
  },
  yearListContainer: {
    height: 300,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  yearItem: {
    width: '30%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: designSystem.colors.background.secondary,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
  },
  yearItemSelected: {
    backgroundColor: designSystem.colors.primary[500],
    borderColor: designSystem.colors.primary[500],
  },
  yearText: {
    fontSize: 16,
    color: designSystem.colors.text.primary,
  },
  yearTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    color: designSystem.colors.primary[500],
    fontWeight: '600',
    fontSize: 16,
  },
});
