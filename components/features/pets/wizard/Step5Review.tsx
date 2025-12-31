import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { Step1Data } from './Step1BasicInfo';
import { Step2Data } from './Step2Details';
import { Step3Data } from './Step3Identification';
import { Step4Data } from './Step4Contacts';
import { formatAge } from '@/utils/dateUtils';

interface Step5Props {
    data: Step1Data & Step2Data & Step3Data & Step4Data;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function Step5Review({ data, onSubmit, isSubmitting }: Step5Props) {

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Review Profile</Text>
                    <Text style={styles.subtitle}>Double check everything before we welcome {data.name} to the family.</Text>
                </View>

                <View style={styles.card}>
                    {/* Header with Photo */}
                    <View style={styles.profileHeader}>
                        {data.photoUri ? (
                            <Image source={{ uri: data.photoUri }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarEmoji}>🐾</Text>
                            </View>
                        )}
                        <View style={styles.profileInfo}>
                            <Text style={styles.petName}>{data.name}</Text>
                            <Text style={styles.petBreed}>{data.breed || data.species}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Basic Info Grid */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>GENDER</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.gender || '-'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>AGE</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.dateOfBirth ? formatAge(data.dateOfBirth) : '-'}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { marginTop: 16 }]} />

                    {/* Health Grid */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>WEIGHT</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.weight ? `${data.weight} ${data.weightUnit}` : '-'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>HEIGHT</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.height ? `${data.height} ${data.heightUnit}` : '-'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>BLOOD</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.bloodType || '-'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>IDENTIFICATION</Text>
                    <View style={styles.infoRow}>
                        <IconSymbol ios_icon_name="memorychip" android_material_icon_name="memory" size={20} color={designSystem.colors.text.secondary} />
                        <View>
                            <Text style={styles.infoLabel}>Microchip</Text>
                            <Text style={styles.infoText}>{data.microchipNumber || 'Not provided'}</Text>
                        </View>
                    </View>
                    {data.registryProvider && (
                        <View style={styles.infoRow}>
                            <IconSymbol ios_icon_name="building.2" android_material_icon_name="domain" size={20} color={designSystem.colors.text.secondary} />
                            <View>
                                <Text style={styles.infoLabel}>Registry</Text>
                                <Text style={styles.infoText}>{data.registryProvider}</Text>
                            </View>
                        </View>
                    )}
                    {data.implantationDate && (
                        <View style={styles.infoRow}>
                            <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={designSystem.colors.text.secondary} />
                            <View>
                                <Text style={styles.infoLabel}>Implantation Date</Text>
                                <Text style={styles.infoText}>{data.implantationDate.toLocaleDateString()}</Text>
                            </View>
                        </View>
                    )}
                    {data.tagId && (
                        <View style={styles.infoRow}>
                            <IconSymbol ios_icon_name="tag" android_material_icon_name="sell" size={20} color={designSystem.colors.text.secondary} />
                            <View>
                                <Text style={styles.infoLabel}>Tag ID</Text>
                                <Text style={styles.infoText}>{data.tagId}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {(data.vetClinicName || data.emergencyContactName) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>CONTACTS</Text>
                        {data.vetClinicName && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>VET CLINIC</Text>
                                <Text style={styles.contactName}>{data.vetClinicName}</Text>
                                {data.vetName && <Text style={styles.contactSub}>Vet: {data.vetName}</Text>}
                                {data.vetAddress && <Text style={styles.contactSub}>{data.vetAddress}</Text>}
                                {data.vetCountry && <Text style={styles.contactSub}>{data.vetCountry}</Text>}
                                {data.vetPhone && <Text style={styles.contactSub}>{data.vetPhone}</Text>}
                            </View>
                        )}
                        {data.emergencyContactName && (
                            <View style={styles.contactItem}>
                                <Text style={[styles.contactLabel, { color: designSystem.colors.error[500] }]}>EMERGENCY</Text>
                                <Text style={styles.contactName}>{data.emergencyContactName}</Text>
                                {data.emergencyContactPhone && <Text style={styles.contactSub}>{data.emergencyContactPhone}</Text>}
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: Platform.OS === 'web' ? 100 : 160 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={onSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <Text style={styles.submitButtonText}>Creating Profile...</Text>
                    ) : (
                        <>
                            <Text style={styles.submitButtonText}>Create Profile</Text>
                            <IconSymbol
                                ios_icon_name="plus"
                                android_material_icon_name="add"
                                size={20}
                                color={designSystem.colors.neutral[0]}
                            />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    headerSection: {
        marginBottom: 24,
    },
    title: {
        ...(designSystem.typography.title.large as any),
        color: designSystem.colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        ...(designSystem.typography.body.medium as any),
        color: designSystem.colors.text.secondary,
    },
    card: {
        backgroundColor: designSystem.colors.neutral[0],
        borderRadius: 16,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        padding: 20,
        marginBottom: 24,
        ...designSystem.shadows.sm,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: designSystem.colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEmoji: {
        fontSize: 32,
    },
    profileInfo: {
        flex: 1,
    },
    petName: {
        ...(designSystem.typography.title.large as any),
        color: designSystem.colors.text.primary,
    },
    petBreed: {
        ...(designSystem.typography.body.medium as any),
        color: designSystem.colors.text.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: designSystem.colors.neutral[100],
        marginBottom: 20,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
    },
    detailLabel: {
        ...(designSystem.typography.label.small as any),
        color: designSystem.colors.text.tertiary,
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    detailValue: {
        ...(designSystem.typography.title.medium as any),
        color: designSystem.colors.text.primary,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        ...(designSystem.typography.label.small as any),
        color: designSystem.colors.text.secondary,
        fontWeight: '700',
        marginBottom: 12,
        letterSpacing: 1,
        paddingLeft: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: designSystem.colors.neutral[0],
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[100],
    },
    infoLabel: {
        ...(designSystem.typography.label.small as any),
        color: designSystem.colors.text.tertiary,
        marginBottom: 2,
    },
    infoText: {
        ...(designSystem.typography.body.medium as any),
        color: designSystem.colors.text.primary,
    },
    contactItem: {
        backgroundColor: designSystem.colors.neutral[0],
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[100],
    },
    contactLabel: {
        ...(designSystem.typography.label.small as any),
        color: designSystem.colors.primary[500],
        fontWeight: '700',
        marginBottom: 4,
    },
    contactName: {
        ...(designSystem.typography.title.small as any),
        color: designSystem.colors.text.primary,
    },
    contactSub: {
        ...(designSystem.typography.body.small as any),
        color: designSystem.colors.text.secondary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: designSystem.colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.neutral[100],
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    },
    submitButton: {
        backgroundColor: designSystem.colors.primary[500],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        ...designSystem.shadows.md,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        ...(designSystem.typography.title.medium as any),
        color: designSystem.colors.neutral[0],
        fontWeight: '800',
    },
});
