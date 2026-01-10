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

  // Selection mode: 'none' | 'year' | 'month'
  const [selectionMode, setSelectionMode] = useState<'none' | 'year' | 'month'>('none');

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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
        <IconSymbol
          ios_icon_name="calendar"
          android_material_icon_name="event"
          size={20}
          color={designSystem.colors.primary[500]}
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
              {selectionMode === 'none' ? (
                <>
                  <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
                    <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="chevron-left" size={24} color={getColor('text.primary')} />
                  </TouchableOpacity>
                  <View style={styles.headerCenter}>
                    <TouchableOpacity onPress={() => setSelectionMode('month')} style={styles.monthButton}>
                      <Text style={styles.monthLabel}>
                        {new Date(viewYear, viewMonth).toLocaleDateString('default', { month: 'long' })}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectionMode('year')} style={styles.yearButton}>
                      <Text style={styles.yearLabel}>{viewYear}</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
                    <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={24} color={getColor('text.primary')} />
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.yearHeader}>
                  <Text style={styles.yearTitle}>
                    {selectionMode === 'year'
                      ? t('date.select_year', { defaultValue: 'Select Year' })
                      : t('date.select_month', { defaultValue: 'Select Month' })}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectionMode('none')} style={styles.closeYearButton}>
                    <IconSymbol ios_icon_name="xmark" android_material_icon_name="close" size={20} color={getColor('text.primary')} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Calendar content with fixed height */}
            <View style={styles.calendarContainer}>
              {selectionMode === 'year' ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.yearGrid}>
                    {years.map(year => (
                      <TouchableOpacity
                        key={year}
                        style={[styles.yearItem, year === viewYear && styles.yearItemSelected]}
                        onPress={() => {
                          setViewYear(year);
                          setSelectionMode('none');
                        }}
                      >
                        <Text style={[styles.yearText, year === viewYear && styles.yearTextSelected]}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              ) : selectionMode === 'month' ? (
                <View style={styles.monthGrid}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[styles.monthItem, index === viewMonth && styles.monthItemSelected]}
                      onPress={() => {
                        setViewMonth(index);
                        setSelectionMode('none');
                      }}
                    >
                      <Text style={[styles.monthText, index === viewMonth && styles.monthTextSelected]}>{month}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <CalendarMonthView
                  year={viewYear}
                  month={viewMonth}
                  selected={selectedIso}
                  onSelect={handleDaySelect}
                />
              )}
            </View>

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
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: designSystem.colors.neutral[100],
  },
  yearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: designSystem.colors.neutral[100],
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: designSystem.colors.text.primary,
  },
  yearLabel: {
    fontSize: 16,
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
  calendarContainer: {
    minHeight: 300,
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
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  monthItem: {
    width: '30%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: designSystem.colors.background.secondary,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
  },
  monthItemSelected: {
    backgroundColor: designSystem.colors.primary[500],
    borderColor: designSystem.colors.primary[500],
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
    color: designSystem.colors.text.primary,
  },
  monthTextSelected: {
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
