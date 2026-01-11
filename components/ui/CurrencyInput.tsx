import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CurrencyInputProps {
    value?: number;
    currency?: string;
    onValueChange: (value: number) => void;
    onCurrencyChange: (currency: string) => void;
    label?: string;
    required?: boolean;
    error?: string;
    placeholder?: string;
}

const CURRENCIES = [
    { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
    { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
    { code: 'CAD', symbol: '$', flag: '🇨🇦', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: '$', flag: '🇦🇺', name: 'Australian Dollar' },
];

export default function CurrencyInput({
    value,
    currency = 'EUR',
    onValueChange,
    onCurrencyChange,
    label = 'Cost',
    required = false,
    error,
    placeholder = '0.00',
}: CurrencyInputProps) {
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
    const [inputValue, setInputValue] = useState(value ? value.toFixed(2) : '');

    const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

    const handleInputChange = (text: string) => {
        // Allow only numbers and decimal point
        const cleaned = text.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point
        const parts = cleaned.split('.');
        const formatted = parts.length > 2
            ? parts[0] + '.' + parts.slice(1).join('')
            : cleaned;

        setInputValue(formatted);

        // Parse and update value
        const numValue = parseFloat(formatted);
        if (!isNaN(numValue)) {
            onValueChange(numValue);
        } else if (formatted === '') {
            onValueChange(0);
        }
    };

    const formatDisplayValue = () => {
        if (!value && value !== 0) return '';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}

            <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                {/* Currency Selector */}
                <TouchableOpacity
                    style={styles.currencyButton}
                    onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
                >
                    <Text style={styles.currencyFlag}>{selectedCurrency.flag}</Text>
                    <Text style={styles.currencyCode}>{selectedCurrency.code}</Text>
                    <IconSymbol
                        android_material_icon_name={showCurrencyPicker ? 'expand-less' : 'expand-more'}
                        size={20}
                        color="#6B7280"
                    />
                </TouchableOpacity>

                {/* Amount Input */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>{selectedCurrency.symbol}</Text>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onBlur={() => setInputValue(formatDisplayValue())}
                        onFocus={() => setInputValue(value ? String(value) : '')}
                        placeholder={placeholder}
                        style={{
                            flex: 1,
                            fontSize: 16,
                            color: '#1F2937',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            fontFamily: 'system-ui',
                        }}
                    />
                </View>
            </View>

            {/* Currency Picker Dropdown */}
            {showCurrencyPicker && (
                <View style={styles.currencyPicker}>
                    {CURRENCIES.map((curr) => (
                        <TouchableOpacity
                            key={curr.code}
                            style={[
                                styles.currencyOption,
                                curr.code === currency && styles.currencyOptionSelected,
                            ] as any}
                            onPress={() => {
                                onCurrencyChange(curr.code);
                                setShowCurrencyPicker(false);
                            }}
                        >
                            <Text style={styles.currencyFlag}>{curr.flag}</Text>
                            <View style={styles.currencyInfo}>
                                <Text style={styles.currencyName}>{curr.name}</Text>
                                <Text style={styles.currencyCodeSmall}>{curr.code}</Text>
                            </View>
                            {curr.code === currency && (
                                <IconSymbol android_material_icon_name="check" size={20} color="#0EA5E9" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    required: {
        color: '#EF4444',
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        overflow: 'hidden',
    },
    inputContainerError: {
        borderColor: '#EF4444',
    },
    currencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#F9FAFB',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        gap: 6,
    },
    currencyFlag: {
        fontSize: 20,
    },
    currencyCode: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    amountContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 6,
    },
    currencySymbol: {
        fontSize: 16,
        fontWeight: '500',
        color: '#6B7280',
    },
    currencyPicker: {
        marginTop: 4,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    currencyOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    currencyOptionSelected: {
        backgroundColor: '#F0F9FF',
    },
    currencyInfo: {
        flex: 1,
    },
    currencyName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    currencyCodeSmall: {
        fontSize: 12,
        color: '#6B7280',
    },
    errorText: {
        fontSize: 13,
        color: '#EF4444',
        marginTop: 4,
    },
});
