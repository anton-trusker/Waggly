// Pet Identification Widget
// Displays pet photo, demographics, and official IDs

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PetIdentification, PhysicalCharacteristics } from '@/types/passport';
import { designSystem } from '@/constants/designSystem';

interface PetIdentificationProps {
    identification: PetIdentification;
    physical?: PhysicalCharacteristics;
    healthScoreCategory?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    onEdit?: () => void;
}

const InfoItem = ({ label, value, icon }: { label: string; value?: string | number; icon?: string }) => {
    if (!value || value === '—' || value === 'None' || value === 'N/A') return null;
    return (
        <View style={styles.infoItem}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value} numberOfLines={1}>
                {value} {icon}
            </Text>
        </View>
    );
};

export default function PetIdentificationWidget({
    identification,
    physical,
    healthScoreCategory = 'good',
    onEdit
}: PetIdentificationProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    // Photo border color based on health score
    const getBorderColor = () => {
        switch (healthScoreCategory) {
            case 'excellent': return designSystem.colors.success[500];
            case 'good': return designSystem.colors.success[500];
            case 'fair': return designSystem.colors.warning[500];
            case 'poor':
            case 'critical': return designSystem.colors.error[500];
            default: return designSystem.colors.success[500];
        }
    };

    const getGenderSymbol = () => {
        if (identification.gender === 'male') return '♂';
        if (identification.gender === 'female') return '♀';
        return '';
    };

    const getAgeString = () => {
        if (identification.ageYears > 0) {
            return `${identification.ageYears} ${identification.ageYears === 1 ? 'year' : 'years'}`;
        }
        return `${identification.ageMonths || 0} months`;
    };

    const photoSize = isMobile ? 100 : 120; // Reduced from 120/160

    return (
        <View style={styles.container}>
            {onEdit && (
                <TouchableOpacity onPress={onEdit} style={styles.topEditButton}>
                    <Ionicons name="pencil" size={16} color={designSystem.colors.primary[500]} />
                </TouchableOpacity>
            )}
            <View style={[styles.content, isMobile && styles.contentMobile]}>

                {/* Pet Photo Section */}
                <View style={[styles.photoSection, isMobile && styles.photoSectionMobile]}>
                    <View style={styles.photoContainer}>
                        {identification.photoUrl ? (
                            <Image
                                source={{ uri: identification.photoUrl }}
                                style={[
                                    styles.photo,
                                    {
                                        width: photoSize,
                                        height: photoSize,
                                        borderColor: getBorderColor(),
                                    },
                                ] as any}
                            />
                        ) : (
                            <View style={[
                                styles.photoPlaceholder,
                                {
                                    width: photoSize,
                                    height: photoSize,
                                    borderColor: getBorderColor(),
                                },
                            ]}>
                                <Ionicons
                                    name="paw"
                                    size={photoSize * 0.4}
                                    color={designSystem.colors.text.quaternary}
                                />
                                <Text style={styles.photoInitial}>
                                    {identification.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Status Badge */}
                    <View style={[
                        styles.statusBadge,
                        identification.petStatus === 'active' && styles.statusActive,
                        identification.petStatus === 'deceased' && styles.statusDeceased,
                    ]}>
                        <View style={[
                            styles.statusDot,
                            identification.petStatus === 'active' ? { backgroundColor: designSystem.colors.success[500] } : { backgroundColor: designSystem.colors.text.tertiary }
                        ]} />
                        <Text style={styles.statusText}>
                            {identification.petStatus.toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* Info Section */}
                <View style={[styles.infoContainer, isMobile && styles.infoContainerMobile]}>
                    {/* Header: Name & Age */}
                    <View style={[styles.headerRow, isMobile && styles.headerRowMobile]}>
                        <View style={isMobile && { alignItems: 'center' }}>
                            <Text style={styles.petName}>{identification.name}</Text>
                            {identification.microchipNumber && (
                                <View style={styles.microchipHeader}>
                                    <Ionicons name="hardware-chip-outline" size={14} color={designSystem.colors.primary[500]} />
                                    <Text style={styles.microchipText}>{identification.microchipNumber}</Text>
                                </View>
                            )}
                            <Text style={styles.breedText}>
                                {identification.breed} • {getAgeString()}
                            </Text>
                        </View>
                    </View>

                    {/* Attributes Grid */}
                    <View style={styles.gridContainer}>
                        <InfoItem label="Species" value={identification.species.charAt(0).toUpperCase() + identification.species.slice(1)} />
                        <InfoItem label="Gender" value={identification.gender.charAt(0).toUpperCase() + identification.gender.slice(1)} icon={getGenderSymbol()} />
                        <InfoItem label="Color" value={physical?.color} />
                        <InfoItem label="Size" value={physical?.size} />
                        <InfoItem label="Coat" value={physical?.coatType} />
                        <InfoItem label="Eyes" value={physical?.eyeColor} />
                        <InfoItem label="Tail" value={physical?.tailLength} />
                        <InfoItem label="Fur" value={physical?.furDescription} />
                        {physical?.distinguishingMarks && physical.distinguishingMarks !== '—' && (
                            <View style={styles.infoItemFull}>
                                <Text style={styles.label}>Distinguishing Marks</Text>
                                <Text style={styles.value}>{physical.distinguishingMarks}</Text>
                            </View>
                        )}
                    </View>

                    {/* Official IDs - only show if there are IDs OTHER than microchip */}
                    {(identification.tattooId || identification.registrationId) && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.idContainer}>
                                <Text style={styles.sectionTitle}>OFFICIAL IDENTIFICATION</Text>
                                <View style={styles.idGrid}>
                                    {identification.tattooId ? (
                                        <View style={styles.idItem}>
                                            <Ionicons name="barcode-outline" size={16} color={designSystem.colors.text.secondary} />
                                            <Text style={styles.idLabel}>Tattoo:</Text>
                                            <Text style={styles.idValue}>{identification.tattooId}</Text>
                                        </View>
                                    ) : null}

                                    {identification.registrationId ? (
                                        <View style={styles.idItem}>
                                            <Ionicons name="document-text-outline" size={16} color={designSystem.colors.text.secondary} />
                                            <Text style={styles.idLabel}>Reg ID:</Text>
                                            <Text style={styles.idValue}>{identification.registrationId}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        </>
                    )}

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius['2xl'],
        padding: 20,
        marginBottom: designSystem.spacing[4],
        ...designSystem.shadows.md,
        position: 'relative',
    },
    content: {
        flexDirection: 'row',
        gap: 20, // spacing[6] (24) -> 20
    },
    contentMobile: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
    },
    photoSectionMobile: {
        alignItems: 'center',
    },
    infoContainerMobile: {
        alignItems: 'center',
        width: '100%',
    },
    headerRowMobile: {
        alignItems: 'center',
    },
    // ...
    petName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
        lineHeight: 32,
    },
    microchipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: -2,
        marginBottom: 2,
    },
    microchipText: {
        fontSize: 13,
        fontWeight: '600',
        color: designSystem.colors.primary[600],
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    breedText: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        marginTop: 0,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: designSystem.colors.background.tertiary,
        marginTop: 12,
    },
    statusActive: {
        backgroundColor: designSystem.colors.success[50],
        borderWidth: 1,
        borderColor: designSystem.colors.success[100],
    },
    statusDeceased: {
        backgroundColor: designSystem.colors.text.quaternary,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        color: designSystem.colors.text.secondary,
        letterSpacing: 0.5,
    },
    photoSection: {
        alignItems: 'flex-start',
    },
    // ...
    value: {
        fontSize: 13, // 14 -> 13
        color: designSystem.colors.text.primary,
        fontWeight: '500',
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: designSystem.colors.border.primary,
        marginVertical: 16,
    },

    // ID Section
    idContainer: {
        gap: 8,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: designSystem.colors.text.tertiary,
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    label: {
        fontSize: 11,
        fontWeight: 'bold', // Bold labels
        color: designSystem.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    infoItem: {
        width: '48%',
        marginBottom: designSystem.spacing[3],
    },
    infoItemFull: {
        width: '100%',
        marginBottom: 8,
    },
    idGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    idItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: designSystem.colors.background.tertiary,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    idLabel: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
        fontWeight: '500',
    },
    idValue: {
        fontSize: 13,
        color: designSystem.colors.text.primary,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontWeight: '600',
    },
    noIdText: {
        fontSize: 13,
        color: designSystem.colors.text.tertiary,
        fontStyle: 'italic',
    },
    topEditButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: designSystem.colors.background.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        ...designSystem.shadows.sm,
    },
});
