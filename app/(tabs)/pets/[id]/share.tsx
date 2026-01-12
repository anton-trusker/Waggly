import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { usePets } from '@/hooks/usePets';
import { useSharePassport, ShareLink } from '@/hooks/passport/useSharePassport';
import { designSystem } from '@/constants/designSystem';
import SharePassportModal from '@/components/passport/SharePassportModal';
import { useToast } from '@/contexts/ToastContext';

export default function ShareTab() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { pets } = usePets();
    const pet = pets?.find(p => p.id === id);
    const { activeLinks, loading, revokeLink, getShareUrl } = useSharePassport(id as string);
    const { success, error: toastError } = useToast();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLinkForQR, setSelectedLinkForQR] = useState<ShareLink | null>(null);
    const viewShotRef = useRef<any>(null);

    const handleCopyLink = async (url: string) => {
        await Clipboard.setStringAsync(url);
        success('Link copied to clipboard');
    };

    const handleRevoke = (token: string) => {
        Alert.alert(
            'Revoke Link',
            'Are you sure you want to disable this share link? It will stop working immediately.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Revoke', style: 'destructive', onPress: () => revokeLink(token) }
            ]
        );
    };

    const handleDownloadQR = async (link: ShareLink) => {
        setSelectedLinkForQR(link);
        // Wait for state update and re-render
        setTimeout(async () => {
            if (viewShotRef.current) {
                try {
                    const uri = await viewShotRef.current.capture();
                    await Sharing.shareAsync(uri, {
                        mimeType: 'image/png',
                        dialogTitle: `Download Branded QR`,
                        UTI: 'public.png'
                    });
                    success('Branded QR ready');
                } catch (err: any) {
                    toastError('Failed to capture QR');
                }
            }
        }, 100);
    };

    const renderLinkCard = (link: ShareLink) => {
        const url = getShareUrl(link.token);
        const permissionsCount = Object.values(link.permissions).filter(v => v === true).length;

        return (
            <View key={link.id} style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardTitle}>Secure Share Link</Text>
                        <Text style={styles.cardSubtitle}>
                            {permissionsCount} sections shared • Created {new Date(link.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.viewBadge}>
                        <Text style={styles.viewBadgeText}>👁️ {link.accessed_count}</Text>
                    </View>
                </View>

                <View style={styles.qrRow}>
                    <View style={styles.qrMiniContainer}>
                        <QRCode
                            value={url}
                            size={100}
                            color={designSystem.colors.primary[500] as any}
                            backgroundColor="white"
                        />
                    </View>
                    <View style={styles.linkInfo}>
                        <Text style={styles.urlText} numberOfLines={1}>{url}</Text>
                        <View style={styles.linkActions}>
                            <TouchableOpacity style={styles.miniAction} onPress={() => handleCopyLink(url)}>
                                <Ionicons name="copy-outline" size={16} color={designSystem.colors.primary[500]} />
                                <Text style={styles.miniActionText}>Copy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.miniAction} onPress={() => handleDownloadQR(link)}>
                                <Ionicons name="download-outline" size={16} color={designSystem.colors.primary[500]} />
                                <Text style={styles.miniActionText}>QR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.revokeButton} onPress={() => handleRevoke(link.token)}>
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    <Text style={styles.revokeButtonText}>Disable Link</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (!pet) return null;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.headerIcon}>
                        <Ionicons name="share-social" size={32} color="#fff" />
                    </View>
                    <Text style={styles.title}>Share {pet.name}'s Passport</Text>
                    <Text style={styles.subtitle}>
                        Manage secure links and QR codes to share medical details with vets, sitters, or groomers.
                    </Text>
                </View>

                <TouchableOpacity style={styles.newButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <Text style={styles.newButtonText}>Create New Share Link</Text>
                </TouchableOpacity>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Active Share Links</Text>
                    {activeLinks.length > 0 ? (
                        activeLinks.map(renderLinkCard)
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="link-outline" size={48} color={designSystem.colors.text.tertiary} />
                            <Text style={styles.emptyStateText}>No active share links yet.</Text>
                            <Text style={styles.emptyStateSub}>Generate one to share your pet's details securely.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <SharePassportModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                petId={id as string}
                petName={pet.name}
            />

            {/* Hidden Branded QR for Capture */}
            {selectedLinkForQR && (
                <View style={{ position: 'absolute', left: -2000, top: -2000, opacity: 0 }}>
                    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
                        <View style={styles.brandedQR}>
                            <View style={styles.brandedHeader}>
                                <Image
                                    source={require('@/assets/images/icons/logo.png')}
                                    style={styles.qrLogo}
                                    resizeMode="contain"
                                />
                                <Text style={styles.qrBrandName}>Waggli</Text>
                            </View>
                            <Text style={styles.qrPetName}>{pet.name}</Text>
                            <View style={styles.qrWrapper}>
                                <QRCode
                                    value={getShareUrl(selectedLinkForQR.token)}
                                    size={200}
                                    color={designSystem.colors.primary[500] as any}
                                    backgroundColor="white"
                                />
                            </View>
                            <Text style={styles.qrFooter}>Scan to view {pet.name}'s Passport</Text>
                        </View>
                    </ViewShot>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: designSystem.colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    newButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: designSystem.colors.primary[500],
        padding: 16,
        borderRadius: 16,
        marginBottom: 32,
        gap: 10,
        ...designSystem.shadows.md,
    },
    newButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        ...designSystem.shadows.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    cardSubtitle: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
        marginTop: 2,
    },
    viewBadge: {
        backgroundColor: designSystem.colors.primary[50] + '80',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    viewBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: designSystem.colors.primary[600],
    },
    qrRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    qrMiniContainer: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    linkInfo: {
        flex: 1,
        gap: 8,
    },
    urlText: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        backgroundColor: '#F3F4F6',
        padding: 8,
        borderRadius: 8,
    },
    linkActions: {
        flexDirection: 'row',
        gap: 12,
    },
    miniAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
    },
    miniActionText: {
        fontSize: 13,
        fontWeight: '600',
        color: designSystem.colors.primary[500],
    },
    revokeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    revokeButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#EF4444',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 24,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
        marginTop: 16,
    },
    emptyStateSub: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
        marginTop: 4,
    },
    brandedQR: {
        width: 400,
        backgroundColor: '#fff',
        padding: 40,
        alignItems: 'center',
        borderRadius: 32,
    },
    brandedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    qrLogo: {
        width: 54,
        height: 54,
    },
    qrBrandName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: designSystem.colors.primary[500],
    },
    qrPetName: {
        fontSize: 24,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
        marginBottom: 24,
    },
    qrWrapper: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 20,
    },
    qrFooter: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
    },
});
