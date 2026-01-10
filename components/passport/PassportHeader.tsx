// Passport Header Widget
// Displays passport ID, timestamps, and export action buttons

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { documentDirectory, writeAsStringAsync, EncodingType } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { designSystem } from '@/constants/designSystem';
import SharePassportModal from './SharePassportModal';

interface PassportHeaderProps {
    petId: string;
    petName: string;
    passportId: string;
    generatedAt: Date;
    lastUpdated: Date;
}

export default function PassportHeader({ petId, petName, passportId, generatedAt, lastUpdated }: PassportHeaderProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const { success, error, info } = useToast();
    const [isShareModalVisible, setIsShareModalVisible] = React.useState(false);

    const handleDownloadPDF = async () => {
        if (!passportId || passportId === 'Generating...') {
            error('Passport ID not ready', 'Please wait until the passport ID is generated or update the pet details to trigger generation.');
            return;
        }
        try {
            info('Generating PDF...', 'Please wait a moment');

            const { data, error: funcError } = await supabase.functions.invoke('generate-passport-pdf', {
                body: { petId },
                responseType: 'blob',
            });

            if (funcError) throw funcError;

            if (Platform.OS === 'web') {
                const url = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Passport_${passportId}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                success('PDF Downloaded');
            } else {
                const fileUri = `${documentDirectory}Passport_${passportId}.pdf`;
                const reader = new FileReader();
                reader.readAsDataURL(data);
                reader.onloadend = async () => {
                    const base64data = (reader.result as string).split(',')[1];
                    await writeAsStringAsync(fileUri, base64data, {
                        encoding: EncodingType.Base64,
                    });

                    if (await Sharing.isAvailableAsync()) {
                        await Sharing.shareAsync(fileUri);
                        success('PDF Ready to Share');
                    } else {
                        success('PDF Saved to Documents');
                    }
                };
            }
        } catch (err: any) {
            console.error('PDF Generation Error:', err);
            error(err.message || 'Failed to generate PDF');
        }
    };

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };


    const handleShare = () => {
        setIsShareModalVisible(true);
    };

    if (isMobile) {
        return (
            <View style={styles.mobileContainer}>
                <View style={styles.mobileTop}>
                    <View style={styles.passportInfo}>
                        <Text style={styles.mobileTitle}>Pet Passport</Text>
                        <Text style={styles.passportId}>{passportId}</Text>
                    </View>
                </View>

                {/* Compact Action Buttons */}
                <View style={styles.mobileActionRow}>
                    <TouchableOpacity
                        style={styles.compactButton}
                        onPress={handleShare}
                    >
                        <Ionicons name="share-outline" size={16} color={designSystem.colors.primary[500]} />
                        <Text style={styles.compactButtonText}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.compactButton}
                        onPress={handleDownloadPDF}
                    >
                        <Ionicons name="download-outline" size={16} color={designSystem.colors.primary[500]} />
                        <Text style={styles.compactButtonText}>PDF</Text>
                    </TouchableOpacity>

                </View>

                {/* Compact Timestamp */}
                <Text style={styles.compactTimestamp}>
                    Last Updated: {lastUpdated.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            </View>
        );
    }

    // Desktop Layout - Compact Version
    return (
        <View style={styles.desktopContainer}>
            <View style={styles.desktopLeft}>
                <View>
                    <Text style={styles.desktopTitle}>Pet Passport</Text>
                    <Text style={styles.passportId}>{passportId}</Text>
                </View>
            </View>

            <View style={styles.desktopRight}>
                <TouchableOpacity
                    style={styles.compactButton}
                    onPress={handleShare}
                >
                    <Ionicons name="share-outline" size={16} color={designSystem.colors.primary[500]} />
                    <Text style={styles.compactButtonText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.compactButton}
                    onPress={handleDownloadPDF}
                >
                    <Ionicons name="download-outline" size={16} color={designSystem.colors.primary[500]} />
                    <Text style={styles.compactButtonText}>PDF</Text>
                </TouchableOpacity>

            </View>

            {/* Compact Timestamp Below Buttons */}
            <Text style={styles.compactTimestamp}>
                Last Updated: {lastUpdated.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </Text>
            {/* Share Modal */}
            <SharePassportModal
                visible={isShareModalVisible}
                onClose={() => setIsShareModalVisible(false)}
                petId={petId}
                petName={petName}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    // Mobile Styles - Compact
    mobileContainer: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius.lg,
        padding: designSystem.spacing[4],
        marginBottom: designSystem.spacing[4],
        ...designSystem.shadows.sm,
    },
    mobileTop: {
        marginBottom: designSystem.spacing[3],
    },
    passportInfo: {
        gap: designSystem.spacing[1],
    },
    mobileTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    mobileActionRow: {
        flexDirection: 'row',
        gap: designSystem.spacing[2],
        marginBottom: designSystem.spacing[2],
    },

    // Desktop Styles - Compact
    desktopContainer: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius.lg,
        padding: designSystem.spacing[4],
        marginBottom: designSystem.spacing[4],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: designSystem.spacing[3],
        ...designSystem.shadows.sm,
    },
    desktopLeft: {
        gap: designSystem.spacing[2],
    },
    desktopTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    desktopRight: {
        flexDirection: 'row',
        gap: designSystem.spacing[2],
    },

    // Compact Button Styles (36px height)
    compactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[1.5],
        paddingHorizontal: designSystem.spacing[3],
        paddingVertical: designSystem.spacing[2],
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: designSystem.colors.primary[500],
        borderRadius: designSystem.borderRadius.sm,
        height: 36,
    },
    compactButtonText: {
        color: designSystem.colors.primary[500],
        fontSize: 13,
        fontWeight: '600',
    },

    // Shared Styles
    passportId: {
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        color: designSystem.colors.text.secondary,
        fontWeight: '500',
    },
    compactTimestamp: {
        fontSize: 11,
        color: designSystem.colors.text.tertiary,
        width: '100%',
    },
});
