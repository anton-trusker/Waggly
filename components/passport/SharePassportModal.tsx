import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch, ActivityIndicator, Platform, Share, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { designSystem } from '@/constants/designSystem';
import { SharePermissions, useSharePassport } from '@/hooks/passport/useSharePassport';
import { useToast } from '@/contexts/ToastContext';

interface SharePassportModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    petName: string;
}

export default function SharePassportModal({ visible, onClose, petId, petName }: SharePassportModalProps) {
    const { success, error: toastError } = useToast();
    const { loading, shareUrl, generateShareLink, resetShareUrl } = useSharePassport(petId);
    const viewShotRef = useRef<any>(null);

    const [permissions, setPermissions] = useState<SharePermissions>({
        identification: true,
        physical: true,
        medical: true,
        vaccinations: true,
        emergency: false,
        allergies: true,
        notes: true,
        timeline: false,
        documents: false,
    });

    const togglePermission = (key: keyof SharePermissions) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleGenerate = async () => {
        await generateShareLink(permissions);
    };

    const handleDownloadQR = async () => {
        if (!viewShotRef.current) return;
        try {
            const uri = await viewShotRef.current.capture();
            await Sharing.shareAsync(uri, {
                mimeType: 'image/png',
                dialogTitle: `Download ${petName} 's Branded QR`,
                UTI: 'public.png'
            });
            success('Branded QR ready to save');
        } catch (err: any) {
            toastError('Failed to capture QR');
            console.error(err);
        }
    };

    const handleCopyLink = async () => {
        if (shareUrl) {
            await Clipboard.setStringAsync(shareUrl);
            success('Link copied to clipboard');
        }
    };

    const handleNativeShare = async () => {
        if (shareUrl) {
            try {
                await Share.share({
                    message: `Check out ${petName} 's Pet Passport: ${shareUrl}`,
                    url: shareUrl,
                });
            } catch (err: any) {
                toastError('Failed to share');
            }
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Share Pet Passport</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={designSystem.colors.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        {!shareUrl ? (
                            <>
                                <Text style={styles.subtitle}>Select what details you'd like to share:</Text>

                                <View style={styles.permissionsList}>
                                    <PermissionItem
                                        label="Pet Identification"
                                        value={permissions.identification}
                                        onToggle={() => togglePermission('identification')}
                                        icon="finger-print-outline"
                                    />
                                    <PermissionItem
                                        label="Physical Traits"
                                        value={permissions.physical}
                                        onToggle={() => togglePermission('physical')}
                                        icon="body-outline"
                                    />
                                    <PermissionItem
                                        label="Vaccinations"
                                        value={permissions.vaccinations}
                                        onToggle={() => togglePermission('vaccinations')}
                                        icon="shield-checkmark-outline"
                                    />
                                    <PermissionItem
                                        label="Medical Records"
                                        value={permissions.medical}
                                        onToggle={() => togglePermission('medical')}
                                        icon="medkit-outline"
                                    />
                                    <PermissionItem
                                        label="Allergies"
                                        value={permissions.allergies}
                                        onToggle={() => togglePermission('allergies')}
                                        icon="alert-outline"
                                    />
                                    <PermissionItem
                                        label="Notes & Special Care"
                                        value={permissions.notes}
                                        onToggle={() => togglePermission('notes')}
                                        icon="create-outline"
                                    />
                                    <PermissionItem
                                        label="Medical Timeline"
                                        value={permissions.timeline}
                                        onToggle={() => togglePermission('timeline')}
                                        icon="time-outline"
                                    />
                                    <PermissionItem
                                        label="Emergency Contacts"
                                        value={permissions.emergency}
                                        onToggle={() => togglePermission('emergency')}
                                        icon="warning-outline"
                                    />
                                    <PermissionItem
                                        label="Documents"
                                        value={permissions.documents}
                                        onToggle={() => togglePermission('documents')}
                                        icon="document-text-outline"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.generateButton, loading && styles.disabledButton] as any}
                                    onPress={handleGenerate}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.generateButtonText}>Generate Secure Link</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.shareResult}>
                                <View style={styles.qrContainer}>
                                    <QRCode
                                        value={shareUrl}
                                        size={200}
                                        color={designSystem.colors.primary[500] as any}
                                        backgroundColor="white"
                                    />
                                </View>

                                <Text style={styles.shareInstructions}>
                                    Anyone with this link or QR code can view the selected sections of {petName}'s passport.
                                </Text>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
                                        <Ionicons name="copy-outline" size={20} color={designSystem.colors.primary[500]} />
                                        <Text style={styles.actionButtonText}>Copy Link</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.actionButton} onPress={handleNativeShare}>
                                        <Ionicons name="share-social-outline" size={20} color={designSystem.colors.primary[500]} />
                                        <Text style={styles.actionButtonText}>Share Link</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={[styles.actionButton, { width: '100%', marginBottom: 16 }] as any}
                                    onPress={handleDownloadQR}
                                >
                                    <Ionicons name="download-outline" size={20} color={designSystem.colors.primary[500]} />
                                    <Text style={styles.actionButtonText}>Download Branded QR</Text>
                                </TouchableOpacity>

                                {/* Hidden Branded QR for Capture */}
                                <View style={{ position: 'absolute', left: -1000, top: -1000, opacity: 0 }}>
                                    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
                                        <View style={styles.brandedQR}>
                                            <View style={styles.brandedHeader}>
                                                <Image
                                                    source={require('../../assets/images/logo.png')}
                                                    style={styles.qrLogo}
                                                    resizeMode="contain"
                                                />
                                                <Text style={styles.qrBrandName}>Pawzly</Text>
                                            </View>
                                            <Text style={styles.qrPetName}>{petName}</Text>
                                            <View style={styles.qrWrapper}>
                                                <QRCode
                                                    value={shareUrl}
                                                    size={180}
                                                    color={designSystem.colors.primary[500] as any}
                                                    backgroundColor="white"
                                                />
                                            </View>
                                            <Text style={styles.qrFooter}>Scan to view {petName}'s Passport</Text>
                                        </View>
                                    </ViewShot>
                                </View>

                                <TouchableOpacity style={styles.resetButton} onPress={resetShareUrl}>
                                    <Text style={styles.resetButtonText}>Change Permissions</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

function PermissionItem({ label, value, onToggle, icon }: { label: string, value: boolean, onToggle: () => void, icon: any }) {
    return (
        <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
                <Ionicons name={icon} size={20} color={designSystem.colors.text.secondary} />
                <Text style={styles.permissionLabel}>{label}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#e2e8f0', true: designSystem.colors.primary[100] }}
                thumbColor={value ? designSystem.colors.primary[500] : '#f4f4f5'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
    },
    closeButton: {
        padding: 4,
    },
    body: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        marginBottom: 20,
    },
    permissionsList: {
        gap: 16,
        marginBottom: 24,
    },
    permissionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: 12,
    },
    permissionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    permissionLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: designSystem.colors.text.primary,
    },
    generateButton: {
        backgroundColor: designSystem.colors.primary[500],
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.7,
    },
    shareResult: {
        alignItems: 'center',
        paddingTop: 10,
    },
    qrContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 24,
    },
    shareInstructions: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: designSystem.colors.primary[500],
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.primary[500],
    },
    resetButton: {
        padding: 12,
    },
    resetButtonText: {
        fontSize: 13,
        color: designSystem.colors.text.tertiary,
        textDecorationLine: 'underline',
    },
    brandedQR: {
        width: 300,
        backgroundColor: '#fff',
        padding: 30,
        alignItems: 'center',
        borderRadius: 24,
    },
    brandedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    qrLogo: {
        width: 40,
        height: 40,
    },
    qrBrandName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: designSystem.colors.primary[500],
    },
    qrPetName: {
        fontSize: 18,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
        marginBottom: 20,
    },
    qrWrapper: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: designSystem.colors.background.tertiary,
        marginBottom: 15,
    },
    qrFooter: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
    },
});
