import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '@/hooks/useLocale';
import { designSystem } from '@/constants/designSystem';

export function LanguageSelector() {
    const { locale, setLocale } = useLocale();
    const [visible, setVisible] = useState(false);

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    ];

    const currentLanguage = languages.find(l => l.code === locale) || languages[0];

    const handleSelect = (code: string) => {
        setLocale(code);
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setVisible(true)}
            >
                <Ionicons name="globe-outline" size={20} color="#6B7280" />
            </TouchableOpacity>

            {visible && (
                <Modal
                    transparent
                    visible={visible}
                    animationType="fade"
                    onRequestClose={() => setVisible(false)}
                >
                    <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                        <View style={styles.dropdown}>
                            <Text style={styles.title}>Select Language</Text>
                            {languages.map((lang) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[
                                        styles.item,
                                        locale === lang.code && styles.itemSelected
                                    ]}
                                    onPress={() => handleSelect(lang.code)}
                                >
                                    <Text style={styles.flag}>{lang.flag}</Text>
                                    <Text style={[
                                        styles.label,
                                        locale === lang.code && styles.labelSelected
                                    ]}>
                                        {lang.label}
                                    </Text>
                                    {locale === lang.code && (
                                        <Ionicons name="checkmark" size={16} color={designSystem.colors.primary[500]} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 50,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 8,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        textTransform: 'uppercase',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    itemSelected: {
        backgroundColor: '#EEF2FF',
    },
    flag: {
        fontSize: 20,
    },
    label: {
        fontSize: 15,
        color: '#374151',
        flex: 1,
    },
    labelSelected: {
        color: '#4F46E5',
        fontWeight: '600',
    },
});
