import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { Input } from '../primitives/Input';

interface MoneyValue {
    amount: number;
    currency: string;
}

interface MoneyWidgetProps {
    label?: string;
    value?: MoneyValue;
    onChange?: (value: MoneyValue) => void;
    currencies?: string[]; // Allowed currencies, defaults to common ones
    error?: string;
}

const DEFAULT_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
};

export const MoneyWidget = ({
    label,
    value,
    onChange,
    currencies = DEFAULT_CURRENCIES,
    error,
}: MoneyWidgetProps) => {
    const [currency, setCurrency] = useState(value?.currency || currencies[0]);
    const [localAmount, setLocalAmount] = useState(value?.amount?.toString() || '');

    const handleAmountChange = (text: string) => {
        // Validate decimal input
        if (text.match(/^\d*\.?\d{0,2}$/)) {
            setLocalAmount(text);
            const num = parseFloat(text);
            if (!isNaN(num)) {
                onChange?.({ amount: num, currency });
            }
        }
    };

    const toggleCurrency = () => {
        // Simple cycler for now
        const currentIndex = currencies.indexOf(currency);
        const nextIndex = (currentIndex + 1) % currencies.length;
        const nextCurrency = currencies[nextIndex];
        setCurrency(nextCurrency);
        onChange?.({ amount: parseFloat(localAmount) || 0, currency: nextCurrency });
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.inputWrapper}>
                <View style={styles.currencyBadge}>
                    <TouchableOpacity onPress={toggleCurrency}>
                        <Text style={styles.currencySymbol}>{CURRENCY_SYMBOLS[currency] || currency}</Text>
                    </TouchableOpacity>
                </View>

                <Input
                    containerStyle={{ flex: 1, marginBottom: 0 }}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={localAmount}
                    onChangeText={handleAmountChange}
                    error={error}
                // Remove left padding or adjust stylings?
                // The input primitive has padding, we might want to override or integrate better.
                // For now, side-by-side.
                />

                <TouchableOpacity style={styles.currencyToggle} onPress={toggleCurrency}>
                    <Text style={styles.currencyText}>{currency}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    currencyBadge: {
        height: 44,
        width: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: designSystem.colors.neutral[100],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 8,
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    currencyToggle: {
        height: 44,
        paddingHorizontal: 16,
        backgroundColor: designSystem.colors.neutral[100],
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
    },
    currencyText: {
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
});
