import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { Step1Data } from './Step1BasicInfo';
import { Step2Data } from './Step2Details';
import { Step3Data } from './Step3Identification';
import { Step4Data } from './Step4Contacts';
import { formatAge } from '@/utils/dateUtils';
import { useLocale } from '@/hooks/useLocale';

interface Step5Props {
    data: Step1Data & Step2Data & Step3Data & Step4Data;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function Step5Review({ data, onSubmit, isSubmitting }: Step5Props) {
    const { t, locale } = useLocale();

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerSection}>
                    <Text style={styles.title}>{t('add_pet.step5.title')}</Text>
                    <Text style={styles.subtitle}>{t('add_pet.step5.subtitle', { name: data.name })}</Text>
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
                            <Text style={styles.detailLabel}>{t('add_pet.step5.gender_label')}</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.gender || '-'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>{t('add_pet.step5.age_label')}</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.dateOfBirth ? formatAge(data.dateOfBirth, t) : '-'}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { marginTop: 16 }]} />

                    {/* Health Grid */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>{t('add_pet.step5.weight_label')}</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.weight ? `${data.weight} ${data.weightUnit}` : '-'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>{t('add_pet.step5.height_label')}</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.height ? `${data.height} ${data.heightUnit}` : '-'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>{t('add_pet.step5.blood_label')}</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>{data.bloodType || '-'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>{t('add_pet.step5.identification_header')}</Text>
                    <View style={styles.infoRow}>
                        <IconSymbol ios_icon_name="memorychip" android_material_icon_name="memory" size={20} color={designSystem.colors.text.secondary} />
                        <View>
                            <Text style={styles.infoLabel}>{t('add_pet.step5.microchip_label')}</Text>
                            <Text style={styles.infoText}>{data.microchipNumber || t('add_pet.step5.not_provided')}</Text>
                        </View>
                    </View>
                    {data.implantationDate && (
                        <View style={styles.infoRow}>
                            <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={designSystem.colors.text.secondary} />
                            <View>
                                <Text style={styles.infoLabel}>{t('add_pet.step5.implantation_date_label')}</Text>
                                <Text style={styles.infoText}>{data.implantationDate.toLocaleDateString(locale === 'en' ? 'en-US' : locale)}</Text>
                            </View>
                        </View>
                    )}
                    {data.tagId && (
                        <View style={styles.infoRow}>
                            <IconSymbol ios_icon_name="tag" android_material_icon_name="sell" size={20} color={designSystem.colors.text.secondary} />
                            <View>
                                <Text style={styles.infoLabel}>{t('add_pet.step5.tag_id_label')}</Text>
                                <Text style={styles.infoText}>{data.tagId}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {(data.vetClinicName || data.emergencyContactName) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>{t('add_pet.step5.contacts_header')}</Text>
                        {data.vetClinicName && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>{t('add_pet.step5.vet_clinic_label')}</Text>
                                <Text style={styles.contactName}>{data.vetClinicName}</Text>
                                {data.vetName && <Text style={styles.contactSub}>{t('add_pet.step5.vet_label')} {data.vetName}</Text>}
                                {data.vetAddress && <Text style={styles.contactSub}>{data.vetAddress}</Text>}
                                {data.vetCountry && <Text style={styles.contactSub}>{data.vetCountry}</Text>}
                                {data.vetPhone && <Text style={styles.contactSub}>{data.vetPhone}</Text>}
                            </View>
                        )}
                        {data.emergencyContactName && (
                            <View style={styles.contactItem}>
                                <Text style={[styles.contactLabel, { color: designSystem.colors.error[500] }]}>{t('add_pet.step5.emergency_label')}</Text>
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
                        <Text style={styles.submitButtonText}>{t('add_pet.step5.creating_profile')}</Text>
                    ) : (
                        <>
                            <Text style={styles.submitButtonText}>{t('add_pet.step5.create_profile')}</Text>
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
