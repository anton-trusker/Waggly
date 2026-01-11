import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QRCode } from 'react-qrcode-logo';
import { usePetSharing, ShareToken } from '@/hooks/usePetSharing';
import { designSystem } from '@/constants/designSystem';
import FormModal from '@/components/ui/FormModal';

interface ShareModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    petName: string;
}

export default function ShareModal({ visible, onClose, petId, petName }: ShareModalProps) {
    const theme = designSystem;
    const { tokens, loading, getOrCreateToken, deleteToken, getShareUrl } = usePetSharing(petId);

    const [basicToken, setBasicToken] = useState<ShareToken | null>(null);
    const [advancedToken, setAdvancedToken] = useState<ShareToken | null>(null);

    // Load tokens when modal opens
    useEffect(() => {
        if (visible && petId) {
            loadTokens();
        }
    }, [visible, petId]);

    const loadTokens = async () => {
        // Get or create basic token (should already exist from auto-generation)
        const { data: basic } = await getOrCreateToken('basic');
        if (basic) setBasicToken(basic);

        // Check if advanced token exists
        const advanced = tokens.find(t => t.permission_level === 'advanced' && t.is_active);
        if (advanced) setAdvancedToken(advanced);
    };

    const handleGenerateAdvanced = async () => {
        const { data, error } = await getOrCreateToken('advanced');
        if (error) {
            Alert.alert('Error', 'Could not generate advanced share link');
        } else if (data) {
            setAdvancedToken(data);
        }
    };

    const handleCopyLink = async (url: string) => {
        if (Platform.OS === 'web') {
            await navigator.clipboard.writeText(url);
            Alert.alert('Copied!', 'Share link copied to clipboard');
        } else {
            Clipboard.setString(url);
            Alert.alert('Copied!', 'Share link copied to clipboard');
        }
    };

    const handleDeleteToken = async (tokenId: string, level: string) => {
        Alert.alert(
            'Delete Share Link',
            `Are you sure you want to permanently delete the ${level} share link? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await deleteToken(tokenId);
                        if (error) {
                            Alert.alert('Error', 'Could not delete share link');
                        } else {
                            if (level === 'basic') setBasicToken(null);
                            if (level === 'advanced') setAdvancedToken(null);
                            // Reload tokens
                            await loadTokens();
                        }
                    },
                },
            ]
        );
    };

    const renderShareCard = (token: ShareToken | null, level: 'basic' | 'advanced', title: string, description: string) => {
        if (!token) {
            if (level === 'advanced') {
                return (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardDescription}>{description}</Text>
                        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateAdvanced}>
                            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                            <Text style={styles.generateButtonText}>Generate Advanced Link</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
            return null;
        }

        const shareUrl = getShareUrl(token.token);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    {token.accessed_count > 0 && (
                        <Text style={styles.accessCount}>Viewed {token.accessed_count} times</Text>
                    )}
                </View>
                <Text style={styles.cardDescription}>{description}</Text>

                {/* QR Code */}
                <View style={styles.qrContainer}>
                    {Platform.OS === 'web' ? (
                        <QRCode
                            value={shareUrl}
                            size={200}
                            quietZone={10}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            logoImage={undefined}
                            qrStyle="squares"
                        />
                    ) : (
                        <View style={styles.qrPlaceholder}>
                            <Ionicons name="qr-code" size={64} color="#6B7280" />
                            <Text style={styles.qrPlaceholderText}>QR Code</Text>
                        </View>
                    )}
                </View>

                {/* Share URL */}
                <View style={styles.urlContainer}>
                    <Text style={styles.urlLabel}>Share Link:</Text>
                    <View style={styles.urlBox}>
                        <Text style={styles.urlText} numberOfLines={1}>{shareUrl}</Text>
                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={() => handleCopyLink(shareUrl)}
                        >
                            <Ionicons name="copy-outline" size={18} color="#4F46E5" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteToken(token.id, level)}
                >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete Link</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={`Share ${petName}'s Profile`}
            hideFooter
            forceLight
        >
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={20} color="#3B82F6" />
                    <Text style={styles.infoBannerText}>
                        Share your pet's profile with others via QR code or link
                    </Text>
                </View>

                {/* Basic Share */}
                {renderShareCard(
                    basicToken,
                    'basic',
                    '📱 Basic Profile',
                    'Share basic information like name, photo, breed, and microchip number.'
                )}

                {/* Advanced Share */}
                {renderShareCard(
                    advancedToken,
                    'advanced',
                    '🏥 Full Medical Profile',
                    'Share complete medical history including vaccinations, treatments, and allergies.'
                )}

                <View style={{ height: 20 }} />
            </ScrollView>
        </FormModal>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        gap: 10,
    },
    infoBannerText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        lineHeight: 18,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    accessCount: {
        fontSize: 12,
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
        lineHeight: 20,
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 16,
    },
    qrPlaceholder: {
        alignItems: 'center',
        padding: 40,
    },
    qrPlaceholderText: {
        marginTop: 8,
        fontSize: 14,
        color: '#6B7280',
    },
    urlContainer: {
        marginBottom: 16,
    },
    urlLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    urlBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    urlText: {
        flex: 1,
        fontSize: 13,
        color: '#1F2937',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    copyButton: {
        padding: 6,
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
    },
    generateButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 6,
    },
    deleteButtonText: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: '600',
    },
});
