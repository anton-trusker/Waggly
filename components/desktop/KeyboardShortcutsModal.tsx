import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KEYBOARD_SHORTCUTS, formatShortcut } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
    visible: boolean;
    onClose: () => void;
}

const SHORTCUT_CATEGORIES = [
    {
        title: 'Navigation',
        shortcuts: [
            { label: 'Dashboard', key: KEYBOARD_SHORTCUTS.DASHBOARD },
            { label: 'Calendar', key: KEYBOARD_SHORTCUTS.CALENDAR },
            { label: 'Pets', key: KEYBOARD_SHORTCUTS.PETS },
            { label: 'Notifications', key: KEYBOARD_SHORTCUTS.NOTIFICATIONS },
            { label: 'Settings', key: KEYBOARD_SHORTCUTS.SETTINGS },
        ],
    },
    {
        title: 'Actions',
        shortcuts: [
            { label: 'Add New Pet', key: KEYBOARD_SHORTCUTS.ADD_PET },
            { label: 'Search', key: KEYBOARD_SHORTCUTS.SEARCH },
            { label: 'Save', key: KEYBOARD_SHORTCUTS.SAVE },
            { label: 'Close/Cancel', key: KEYBOARD_SHORTCUTS.CLOSE },
        ],
    },
    {
        title: 'Editing',
        shortcuts: [
            { label: 'Undo', key: KEYBOARD_SHORTCUTS.UNDO },
            { label: 'Redo', key: KEYBOARD_SHORTCUTS.REDO },
        ],
    },
];

export default function KeyboardShortcutsModal({ visible, onClose }: KeyboardShortcutsModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Ionicons name="keypad-outline" size={24} color="#0EA5E9" />
                            <Text style={styles.title}>Keyboard Shortcuts</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        {SHORTCUT_CATEGORIES.map((category) => (
                            <View key={category.title} style={styles.category}>
                                <Text style={styles.categoryTitle}>{category.title}</Text>
                                {category.shortcuts.map((shortcut) => (
                                    <View key={shortcut.key} style={styles.shortcutRow}>
                                        <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
                                        <View style={styles.shortcutKey}>
                                            <Text style={styles.shortcutKeyText}>
                                                {formatShortcut(shortcut.key)}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Press <Text style={styles.footerKey}>?</Text> or{' '}
                            <Text style={styles.footerKey}>⌘/</Text> to toggle this dialog
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '100%',
        maxWidth: 600,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    content: {
        padding: 24,
        gap: 24,
    },
    category: {
        gap: 12,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    shortcutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    shortcutLabel: {
        fontSize: 14,
        color: '#374151',
    },
    shortcutKey: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    shortcutKeyText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
        fontFamily: 'monospace',
    },
    footer: {
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#6B7280',
    },
    footerKey: {
        fontWeight: '700',
        color: '#0EA5E9',
        fontFamily: 'monospace',
    },
});
