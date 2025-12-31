import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GenericFormModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    primaryActionLabel?: string;
    onPrimaryAction?: () => void;
    loading?: boolean;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    width?: number;
}

export default function GenericFormModal({
    visible,
    onClose,
    title,
    children,
    primaryActionLabel = 'Save',
    onPrimaryAction,
    loading = false,
    secondaryActionLabel = 'Cancel',
    onSecondaryAction,
    width = 700,
}: GenericFormModalProps) {
    const { width: screenWidth } = useWindowDimensions();
    if (!visible) return null;

    // Responsive width based on screen size
    const getModalWidth = () => {
        if (screenWidth < 768) return screenWidth * 0.95; // Mobile
        if (screenWidth < 1024) return Math.min(width, 600); // Tablet
        return width; // Desktop
    };

    // Responsive padding
    const getPadding = () => {
        if (screenWidth < 768) return 20; // Mobile
        if (screenWidth < 1024) return 28; // Tablet
        return 32; // Desktop
    };

    const handleSecondary = () => {
        if (onSecondaryAction) onSecondaryAction();
        else onClose();
    };

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={[styles.container, { width: getModalWidth(), maxWidth: getModalWidth() }]}>
                    {/* Header */}
                    <View style={[styles.header, { padding: getPadding() }]}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} disabled={loading}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Content with ScrollView */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={[styles.content, { padding: getPadding() }]}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>

                    {/* Footer */}
                    <View style={[styles.footer, { padding: getPadding() }]}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleSecondary}
                            disabled={loading}
                        >
                            <Text style={styles.secondaryButtonText}>{secondaryActionLabel}</Text>
                        </TouchableOpacity>

                        {onPrimaryAction && (
                            <TouchableOpacity
                                style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                                onPress={onPrimaryAction}
                                disabled={loading}
                            >
                                {loading ? (
                                    <View style={styles.loadingState}>
                                        <Text style={[styles.primaryButtonText, { opacity: 0.8 }]}>Saving...</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.primaryButtonText}>{primaryActionLabel}</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    scrollView: {
        maxHeight: '70%',
    },
    content: {
        // padding set dynamically
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    secondaryButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    primaryButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#6366F1',
        minWidth: 80,
        alignItems: 'center',
    },
    primaryButtonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    loadingState: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
