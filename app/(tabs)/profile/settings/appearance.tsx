import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { useThemeContext, STORAGE_THEME_KEY } from '@/contexts/ThemeContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import AppHeader from '@/components/layout/AppHeader';

export default function AppearanceScreen() {
    const { themeMode, setThemeMode } = useThemeContext();
    const { theme, colors } = useAppTheme();

    const options = [
        { label: 'System Default', value: 'auto', description: 'Match your device appearance' },
        { label: 'Light', value: 'light', description: 'Always use light mode' },
        { label: 'Dark', value: 'dark', description: 'Always use dark mode' },
    ] as const;

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <AppHeader title="Appearance" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
                    {options.map((option, index) => {
                        const isSelected = themeMode === option.value;
                        const isLast = index === options.length - 1;

                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.option,
                                    { borderBottomColor: colors.border.secondary },
                                    isLast && { borderBottomWidth: 0 }
                                ]}
                                onPress={() => setThemeMode(option.value)}
                            >
                                <View style={styles.optionTextContainer}>
                                    <Text style={[styles.optionLabel, { color: colors.text.primary }]}>
                                        {option.label}
                                    </Text>
                                    {option.description && (
                                        <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
                                            {option.description}
                                        </Text>
                                    )}
                                </View>
                                {isSelected && (
                                    <View style={[styles.checkmark, { borderColor: colors.primary[500] }]}>
                                        <View style={[styles.checkmarkInner, { backgroundColor: colors.primary[500] }]} />
                                    </View>
                                )}
                                {!isSelected && (
                                    <View style={[styles.checkmark, { borderColor: colors.border.secondary }]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    section: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 13,
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    checkmarkInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
