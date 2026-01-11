import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/commonStyles';
import { designSystem } from '@/constants/designSystem';
import * as Linking from 'expo-linking';
import { Document } from '@/types';

interface DocumentViewerModalProps {
    visible: boolean;
    onClose: () => void;
    document: Document | null;
}

const { width, height } = Dimensions.get('window');

export default function DocumentViewerModal({ visible, onClose, document }: DocumentViewerModalProps) {
    if (!document) return null;

    const isImage = document.type === 'image/jpeg' || document.type === 'image/png' || document.mime_type?.startsWith('image/');

    const handleDownload = () => {
        if (document.file_url) {
            if (Platform.OS === 'web') {
                window.open(document.file_url, '_blank');
            } else {
                Linking.openURL(document.file_url);
            }
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title} numberOfLines={1}>{document.file_name}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        {isImage && document.file_url ? (
                            <Image
                                source={{ uri: document.file_url }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.previewPlaceholder}>
                                <Ionicons
                                    name={document.type?.includes('pdf') ? "document-text" : "document-outline"}
                                    size={64}
                                    color="#fff"
                                />
                                <Text style={styles.previewText}>
                                    {document.type?.includes('pdf')
                                        ? "PDF Preview not supported inside the app."
                                        : "Preview not available for this file type."}
                                </Text>
                                <Text style={[styles.previewText, { marginTop: 8, fontSize: 12, opacity: 0.7 }]}>
                                    Please use the download button below to view it.
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                            <Ionicons name="download-outline" size={20} color="#000" />
                            <Text style={styles.downloadText}>Download / Open</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 16,
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: width,
        height: '100%',
    },
    previewPlaceholder: {
        alignItems: 'center',
        gap: 16,
        padding: 20,
    },
    previewText: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        width: '100%',
        alignItems: 'center',
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8,
    },
    downloadText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
    },
});
