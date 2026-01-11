import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Platform,
    useWindowDimensions,
    ScrollView,
    Share as RNShare,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { IconSymbol } from './IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import { showToast } from '@/contexts/ToastContext';

interface SharePassportModalProps {
    visible: boolean;
    onClose: () => void;
    petName: string;
    passportId: string;
}

export default function SharePassportModal({
    visible,
    onClose,
    petName,
    passportId,
}: SharePassportModalProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    // Generate shareable URL
    const shareUrl = `${process.env.EXPO_PUBLIC_APP_URL || 'https://waggli.app'}/passport/${passportId}`;

    const handleCopyLink = async () => {
        await Clipboard.setStringAsync(shareUrl);
        showToast({
            type: 'success',
            message: 'Link copied to clipboard!',
        });
    };

    const handleShare = async () => {
        try {
            if (Platform.OS === 'web') {
                // Web share API
                if (navigator.share) {
                    await navigator.share({
                        title: `${petName}'s Pet Passport`,
                        text: `Check out ${petName}'s Pet Passport`,
                        url: shareUrl,
                    });
                } else {
                    // Fallback to copy
                    await handleCopyLink();
                }
            } else {
                // Native share
                await RNShare.share({
                    message: `Check out ${petName}'s Pet Passport: ${shareUrl}`,
                    url: shareUrl,
                    title: `${petName}'s Pet Passport`,
                });
            }
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const effectiveColors = isDark
        ? {
            background: designSystem.colors.background.secondary,
            card: designSystem.colors.background.tertiary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[700],
            qrBackground: '#FFFFFF',
        }
        : {
            background: '#FFFFFF',
            card: designSystem.colors.background.secondary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[200],
            qrBackground: '#FFFFFF',
        };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.container,
                        {
                            width: isMobile ? '90%' : 480,
                            backgroundColor: effectiveColors.background,
                            borderColor: effectiveColors.border,
                        },
                    ] as any}
                >
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: effectiveColors.border }]}>
                        <View>
                            <Text style={[styles.title, { color: effectiveColors.text }]}>
                                Share Passport
                            </Text>
                            <Text style={[styles.subtitle, { color: effectiveColors.textSecondary }]}>
                                {petName}'s Digital Pet Passport
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <IconSymbol
                                ios_icon_name="xmark.circle.fill"
                                android_material_icon_name="cancel"
                                size={28}
                                color={effectiveColors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* QR Code Section */}
                        <View style={[styles.qrSection, { backgroundColor: effectiveColors.card }]}>
                            <View
                                style={[
                                    styles.qrContainer,
                                    { backgroundColor: effectiveColors.qrBackground },
                                ] as any}
                            >
                                <QRCode
                                    value={shareUrl}
                                    size={isMobile ? 200 : 240}
                                    backgroundColor="white"
                                    color="black"
                                    logo={require('@/assets/images/icon.png')}
                                    logoSize={isMobile ? 40 : 48}
                                    logoBackgroundColor="white"
                                    logoBorderRadius={8}
                                />
                            </View>
                            <Text style={[styles.qrLabel, { color: effectiveColors.textSecondary }]}>
                                Scan to view passport
                            </Text>
                        </View>

                        {/* Link Section */}
                        <View style={styles.linkSection}>
                            <Text style={[styles.linkLabel, { color: effectiveColors.text }]}>
                                Shareable Link
                            </Text>
                            <View
                                style={[
                                    styles.linkContainer,
                                    {
                                        backgroundColor: effectiveColors.card,
                                        borderColor: effectiveColors.border,
                                    },
                                ] as any}
                            >
                                <Text
                                    style={[styles.linkText, { color: effectiveColors.textSecondary }] as any}
                                    numberOfLines={1}
                                >
                                    {shareUrl}
                                </Text>
                                <TouchableOpacity
                                    onPress={handleCopyLink}
                                    style={[
                                        styles.copyButton,
                                        { backgroundColor: designSystem.colors.primary[500] },
                                    ] as any}
                                >
                                    <IconSymbol
                                        ios_icon_name="doc.on.doc"
                                        android_material_icon_name="content-copy"
                                        size={16}
                                        color="#FFFFFF"
                                    />
                                    <Text style={styles.copyButtonText}>Copy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Info Section */}
                        <View style={[styles.infoBox, { backgroundColor: effectiveColors.card }]}>
                            <IconSymbol
                                ios_icon_name="info.circle"
                                android_material_icon_name="info"
                                size={20}
                                color={designSystem.colors.primary[500] as any}
                            />
                            <Text style={[styles.infoText, { color: effectiveColors.textSecondary }]}>
                                Anyone with this link can view {petName}'s passport without signing in
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Actions */}
                    <View style={[styles.actions, { borderTopColor: effectiveColors.border }]}>
                        <TouchableOpacity
                            onPress={handleShare}
                            style={[
                                styles.shareButton,
                                { backgroundColor: designSystem.colors.primary[500] },
                            ] as any}
                        >
                            <IconSymbol
                                ios_icon_name="square.and.arrow.up"
                                android_material_icon_name="share"
                                size={20}
                                color="#FFFFFF"
                            />
                            <Text style={styles.shareButtonText}>Share</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        borderRadius: 24,
        maxHeight: '90%',
        overflow: 'hidden',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 15 },
            },
            android: {
                elevation: 15,
            },
            web: {
                boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        gap: 24,
    },
    qrSection: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        gap: 16,
    },
    qrContainer: {
        padding: 20,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
        }),
    },
    qrLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    linkSection: {
        gap: 12,
    },
    linkLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    linkText: {
        flex: 1,
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    copyButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    infoBox: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        borderRadius: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    actions: {
        padding: 24,
        borderTopWidth: 1,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
