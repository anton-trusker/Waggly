import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { designSystem } from '@/constants/designSystem';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
    icon?: keyof typeof Ionicons.glyphMap;
}

export function ConfirmationModal({
    visible,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'info',
    icon
}: ConfirmationModalProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    if (!visible) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger': return {
                color: designSystem.colors.status.error[500],
                bg: designSystem.colors.status.error[50],
                icon: 'alert-circle' as const
            };
            case 'warning': return {
                color: designSystem.colors.status.warning[500],
                bg: designSystem.colors.status.warning[50],
                icon: 'warning' as const
            };
            default: return {
                color: designSystem.colors.primary[500],
                bg: designSystem.colors.primary[50],
                icon: 'information-circle' as const
            };
        }
    };

    const variantStyles = getVariantStyles();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                {Platform.OS === 'ios' && (
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                )}
                <View style={[
                    styles.container,
                    isMobile && styles.containerMobile
                ]}>
                    <View style={[styles.iconContainer, { backgroundColor: variantStyles.bg }]}>
                        <Ionicons name={icon || variantStyles.icon} size={32} color={variantStyles.color} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.buttonCancel}
                            onPress={onCancel}
                        >
                            <Text style={styles.buttonCancelText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.buttonConfirm,
                                { backgroundColor: variantStyles.color }
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.buttonConfirmText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: designSystem.colors.overlay.default,
        justifyContent: 'center',
        alignItems: 'center',
        padding: designSystem.spacing[5],
    },
    container: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius['2xl'],
        padding: designSystem.spacing[6],
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        ...designSystem.shadows.lg,
    },
    containerMobile: {
        maxWidth: 340,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: designSystem.spacing[4],
    },
    title: {
        ...designSystem.typography.headline.small,
        color: designSystem.colors.text.primary,
        marginBottom: designSystem.spacing[2],
        textAlign: 'center',
    },
    message: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
        marginBottom: designSystem.spacing[6],
    },
    actions: {
        flexDirection: 'row',
        gap: designSystem.spacing[3],
        width: '100%',
    },
    buttonCancel: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: designSystem.borderRadius.md,
        backgroundColor: designSystem.colors.neutral[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonCancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
        fontFamily: 'Plus Jakarta Sans',
    },
    buttonConfirm: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: designSystem.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonConfirmText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
        fontFamily: 'Plus Jakarta Sans',
    },
});
