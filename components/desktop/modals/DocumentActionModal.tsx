import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/commonStyles';
import { designSystem } from '@/constants/designSystem';
import { Document } from '@/types';
import * as Linking from 'expo-linking';
import { useLocale } from '@/hooks/useLocale';

interface DocumentActionModalProps {
    visible: boolean;
    onClose: () => void;
    document: Document | null;
    onDelete: (doc: Document) => void;
    onView: (doc: Document) => void;
}

export default function DocumentActionModal({ visible, onClose, document, onDelete, onView }: DocumentActionModalProps) {
    const { t } = useLocale();

    if (!document) return null;

    const handleDownload = () => {
        if (document.file_url) {
            if (Platform.OS === 'web') {
                window.open(document.file_url, '_blank');
            } else {
                Linking.openURL(document.file_url);
            }
            onClose();
        }
    };

    const handleDelete = () => {
        Alert.alert(
            t('documents.delete_confirm_title', { defaultValue: 'Delete Document?' }),
            t('documents.delete_confirm_message', { name: document.file_name, defaultValue: `Are you sure you want to delete "${document.file_name}"?` }),
            [
                { text: t('common.cancel', { defaultValue: 'Cancel' }), style: 'cancel' },
                {
                    text: t('common.delete', { defaultValue: 'Delete' }),
                    style: 'destructive',
                    onPress: () => {
                        onDelete(document);
                        onClose();
                    }
                },
            ]
        );
    };

    const handleView = () => {
        if (Platform.OS === 'web' && document.file_url) {
            window.open(document.file_url, '_blank');
            onClose();
        } else {
            onView(document);
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.dragHandle} />
                        <Text style={styles.title} numberOfLines={1}>{document.file_name}</Text>
                        <Text style={styles.subtitle}>{(document.size_bytes ? (document.size_bytes / 1024).toFixed(0) + ' KB' : 'Unknown size')}</Text>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionItem} onPress={handleView}>
                            <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
                                <Ionicons name="eye-outline" size={24} color="#6366F1" />
                            </View>
                            <Text style={styles.actionText}>{t('common.view', { defaultValue: 'View' })}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem} onPress={handleDownload}>
                            <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
                                <Ionicons name="download-outline" size={24} color="#10B981" />
                            </View>
                            <Text style={styles.actionText}>{t('common.download', { defaultValue: 'Download' })}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionItem, styles.destructiveAction]} onPress={handleDelete}>
                            <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
                                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                            </View>
                            <Text style={[styles.actionText, styles.destructiveText]}>{t('common.delete', { defaultValue: 'Delete' })}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>{t('common.cancel', { defaultValue: 'Cancel' })}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    actions: {
        gap: 12,
        marginBottom: 24,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        gap: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    destructiveAction: {
        borderColor: '#FEE2E2',
        backgroundColor: '#FEF2F2',
    },
    destructiveText: {
        color: '#EF4444',
    },
    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});
