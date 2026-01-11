import React, { useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import FormModal from '@/components/ui/FormModal';
import Button from '@/components/ui/Button';
import { designSystem } from '@/constants/designSystem';
import { PetShareToken } from '@/hooks/usePetSharing';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { copyAsync, documentDirectory } from 'expo-file-system';
import { formatDateFriendly } from '@/utils/dateUtils';

interface ShareDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    share: PetShareToken | null;
}

export default function ShareDetailsModal({ visible, onClose, share }: ShareDetailsModalProps) {
    const qrRef = useRef<ViewShot>(null);

    if (!share) return null;

    const shareUrl = `https://mywaggli.app/pet/shared/${share.token}`;

    const handleCopyLink = async () => {
        await Clipboard.setStringAsync(shareUrl);
        Alert.alert('Success', 'Link copied to clipboard!');
    };

    const handleDownloadQR = async () => {
        if (!qrRef.current) return;

        try {
            const uri = await qrRef.current.capture?.();
            if (!uri) return;

            const fileName = `PetProfile-QR-${share.token.slice(0, 8)}.png`;
            const fileUri = `${documentDirectory}${fileName}`;

            await copyAsync({
                from: uri,
                to: fileUri,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    dialogTitle: 'Save QR Code',
                });
            } else {
                Alert.alert('Success', 'QR code saved!');
            }
        } catch (error) {
            console.error('Failed to download QR:', error);
            Alert.alert('Error', 'Failed to download QR code. Please try again.');
        }
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title="Share Details"
            submitLabel="Done"
            onSubmit={onClose}
        >
            {() => (
                <View style={styles.container}>
                    {/* QR Code */}
                    <ViewShot ref={qrRef} options={{ format: 'png', quality: 1.0 }}>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={shareUrl}
                                size={200}
                            />
                        </View>
                    </ViewShot>

                    {/* Share Info */}
                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Template:</Text>
                            <Text style={styles.infoValue}>
                                {share.permission_level === 'advanced' ? 'Full Profile' : 'Basic Info'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Created:</Text>
                            <Text style={styles.infoValue}>
                                {formatDateFriendly(new Date(share.created_at))}
                            </Text>
                        </View>
                    </View>

                    {/* Link Display */}
                    <View style={styles.linkContainer}>
                        <Text style={styles.linkLabel}>Share Link</Text>
                        <Text style={styles.linkText} numberOfLines={1}>
                            {shareUrl}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonsRow}>
                        <Button
                            variant="outline"
                            onPress={handleCopyLink}
                            style={styles.actionButton}
                        >
                            <IconSymbol android_material_icon_name="content-copy" size={20} color={designSystem.colors.primary[500]} />
                            <Text style={styles.actionButtonText}> Copy Link</Text>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={handleDownloadQR}
                            style={styles.actionButton}
                        >
                            <IconSymbol android_material_icon_name="download" size={20} color={designSystem.colors.primary[500]} />
                            <Text style={styles.actionButtonText}> Download QR</Text>
                        </Button>
                    </View>
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 24,
        paddingVertical: 16,
    },
    qrContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    infoContainer: {
        width: '100%',
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: designSystem.colors.text.primary,
        fontWeight: '600',
    },
    linkContainer: {
        width: '100%',
        backgroundColor: designSystem.colors.background.secondary,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
    },
    linkLabel: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
        marginBottom: 4,
        fontWeight: '500',
    },
    linkText: {
        fontSize: 14,
        color: designSystem.colors.primary[500],
        fontFamily: 'monospace',
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    actionButton: {
        flex: 1,
    },
    actionButtonText: {
        color: designSystem.colors.primary[500],
        fontWeight: '600',
        marginLeft: 8,
    },
});
