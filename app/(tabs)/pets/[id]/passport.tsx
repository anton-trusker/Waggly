import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useMedications } from '@/hooks/useMedications';
import { useProfile } from '@/hooks/useProfile';
import { format } from 'date-fns';
import MobileHeader from '@/components/layout/MobileHeader';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function PassportTab() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const petId = params.id as string;
    const { pets } = usePets();
    const { vaccinations } = useVaccinations(petId);
    const { medications } = useMedications(petId);
    const { profile } = useProfile();

    const pet = pets.find(p => p.id === petId);
    if (!pet) return null;

    const formatDate = (date: string | null | undefined) => {
        if (!date) return 'N/A';
        try {
            return format(new Date(date), 'dd.MM.yyyy');
        } catch {
            return date;
        }
    };

    const getBreed = () => pet.breed || pet.species || 'Unknown';
    const getSex = () => pet.gender === 'female' ? 'Female' : pet.gender === 'male' ? 'Male' : 'Unknown';
    const getCoatColor = () => (pet as any).coat_color || 'Not specified';

    // Get allergies from pet data
    const allergies = (pet as any).allergies || [];
    const { theme } = useAppTheme();

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <MobileHeader title="Pet Passport" showBack />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Left Column */}
                    <View style={styles.leftColumn}>
                        {/* Identity Card */}
                        <View style={styles.card}>
                            <View style={styles.identityHeader}>
                                <View style={styles.identityHeaderLeft}>
                                    <Ionicons name="finger-print" size={20} color="#4F46E5" />
                                    <Text style={styles.identityTitle}>Identity</Text>
                                </View>
                                <View style={styles.idBadge}>
                                    <Text style={styles.idBadgeText}>DE-{pet.id.slice(0, 6).toUpperCase()}</Text>
                                </View>
                            </View>

                            <View style={styles.passportPattern}>
                                {/* Pet Photo */}
                                <View style={styles.photoSection}>
                                    <View style={styles.photoFrame}>
                                        {pet.photo_url ? (
                                            <Image source={{ uri: pet.photo_url }} style={styles.passportPhoto} />
                                        ) : (
                                            <View style={[styles.passportPhoto, styles.photoPlaceholder]}>
                                                <Ionicons name="paw" size={40} color="#9CA3AF" />
                                            </View>
                                        )}
                                    </View>
                                    {(pet as any).petkey_id && (
                                        <View style={styles.petkeyBadge}>
                                            <Ionicons name="shield-checkmark" size={14} color="#3B82F6" />
                                            <Text style={styles.petkeyText}>PETKEY VERIFIED</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Pet Details Grid */}
                                <View style={styles.detailsGrid}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>NAME</Text>
                                        <Text style={styles.detailValue}>{pet.name}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>SPECIES</Text>
                                        <Text style={styles.detailValue}>{pet.species || 'Canine'}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>BREED</Text>
                                        <Text style={styles.detailValue}>{getBreed()}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>SEX</Text>
                                        <Text style={styles.detailValue}>{getSex()}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>DATE OF BIRTH</Text>
                                        <Text style={styles.detailValue}>{formatDate(pet.date_of_birth)}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>COAT COLOR</Text>
                                        <Text style={styles.detailValue}>{getCoatColor()}</Text>
                                    </View>
                                </View>

                                {/* Microchip Section */}
                                {(pet as any).microchip_number && (
                                    <View style={styles.microchipSection}>
                                        <Text style={styles.detailLabel}>MICROCHIP NUMBER</Text>
                                        <Text style={styles.microchipNumber}>{(pet as any).microchip_number}</Text>
                                        {(pet as any).microchip_implantation_date && (
                                            <Text style={styles.microchipMeta}>
                                                Implanted: {formatDate((pet as any).microchip_implantation_date)} • Location: Neck
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Owner Card */}
                        <View style={styles.card}>
                            <View style={styles.ownerHeader}>
                                <Ionicons name="person" size={18} color="#374151" />
                                <Text style={styles.ownerTitle}>I. OWNER</Text>
                            </View>
                            <View style={styles.ownerContent}>
                                <View style={styles.ownerField}>
                                    <Text style={styles.ownerLabel}>NAME</Text>
                                    <Text style={styles.ownerValue}>
                                        {profile?.first_name} {profile?.last_name}
                                    </Text>
                                </View>
                                <View style={styles.ownerField}>
                                    <Text style={styles.ownerLabel}>ADDRESS</Text>
                                    <Text style={styles.ownerValue}>{profile?.address || 'Not set'}</Text>
                                </View>
                                {profile?.phone && (
                                    <View style={styles.ownerField}>
                                        <Text style={styles.ownerLabel}>CONTACT</Text>
                                        <Text style={[styles.ownerValue, styles.phoneLink]}>{profile.phone}</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Medical Alerts Card */}
                        {allergies.length > 0 && (
                            <View style={styles.alertsCard}>
                                <View style={styles.alertsHeader}>
                                    <Ionicons name="warning" size={18} color="#DC2626" />
                                    <Text style={styles.alertsTitle}>MEDICAL ALERTS</Text>
                                </View>
                                <View style={styles.alertsContent}>
                                    {allergies.map((allergy: any, index: number) => (
                                        <View key={index} style={styles.alertItem}>
                                            <Ionicons name="close-circle" size={20} color="#EF4444" />
                                            <View>
                                                <Text style={styles.alertName}>{allergy.name || allergy}</Text>
                                                {allergy.description && (
                                                    <Text style={styles.alertDesc}>{allergy.description}</Text>
                                                )}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Right Column */}
                    <View style={styles.rightColumn}>
                        {/* Vaccinations Card */}
                        <View style={styles.card}>
                            <View style={styles.vaccHeader}>
                                <View style={styles.vaccHeaderLeft}>
                                    <Ionicons name="medical" size={20} color="#fff" />
                                    <View>
                                        <Text style={styles.vaccTitle}>Vaccinations</Text>
                                        <Text style={styles.vaccSubtitle}>Official immunization records</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.addEntryBtn}
                                    onPress={() => router.push(`/web/pets/vaccination/add?petId=${petId}` as any)}
                                >
                                    <Ionicons name="add" size={16} color="#fff" />
                                    <Text style={styles.addEntryText}>Add Entry</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.vaccinationsTable}>
                                {/* Rabies Section */}
                                <Text style={styles.vaccSectionTitle}>V. VACCINATION AGAINST RABIES</Text>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Date</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Manufacturer / Batch</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Valid From</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Valid Until</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Veterinarian</Text>
                                </View>
                                {vaccinations.filter(v => v.vaccine_name?.toLowerCase().includes('rabies')).map((vacc) => (
                                    <View key={vacc.id} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>{formatDate(vacc.date_given)}</Text>
                                        <View style={{ flex: 2 }}>
                                            <Text style={styles.vaccName}>{vacc.vaccine_name}</Text>
                                            <Text style={styles.vaccBatch}>Batch: {vacc.batch_number || 'N/A'}</Text>
                                        </View>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>{formatDate(vacc.date_given)}</Text>
                                        <View style={{ flex: 1 }}>
                                            {vacc.next_due_date && new Date(vacc.next_due_date) > new Date() ? (
                                                <View style={styles.validBadge}>
                                                    <Text style={styles.validBadgeText}>{formatDate(vacc.next_due_date)}</Text>
                                                    <Ionicons name="checkmark-circle" size={14} color="#059669" />
                                                </View>
                                            ) : (
                                                <Text style={styles.expiredText}>{formatDate(vacc.next_due_date)}</Text>
                                            )}
                                        </View>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>{vacc.administering_vet || 'N/A'}</Text>
                                    </View>
                                ))}

                                {/* Other Vaccinations */}
                                <Text style={[styles.vaccSectionTitle, { marginTop: 24 }]}>VI. OTHER VACCINATIONS (DHPP / LEPTO)</Text>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Date</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Vaccine Type</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Batch</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Next Due</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Clinic</Text>
                                </View>
                                {vaccinations.filter(v => !v.vaccine_name?.toLowerCase().includes('rabies')).map((vacc) => (
                                    <View key={vacc.id} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>{formatDate(vacc.date_given)}</Text>
                                        <Text style={[styles.vaccName, { flex: 2 }]}>{vacc.vaccine_name}</Text>
                                        <Text style={[styles.vaccBatch, { flex: 1 }]}>#{vacc.batch_number || 'N/A'}</Text>
                                        <View style={{ flex: 1 }}>
                                            {vacc.next_due_date && (
                                                new Date(vacc.next_due_date) < new Date() ? (
                                                    <View style={styles.warningBadge}>
                                                        <Text style={styles.warningText}>{formatDate(vacc.next_due_date)}</Text>
                                                        <Ionicons name="warning" size={12} color="#EA580C" />
                                                    </View>
                                                ) : (
                                                    <Text style={styles.tableCell}>{formatDate(vacc.next_due_date)}</Text>
                                                )
                                            )}
                                        </View>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>{vacc.administering_vet || 'N/A'}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Treatments & Medications Card */}
                        <View style={styles.card}>
                            <View style={styles.treatmentsHeader}>
                                <View style={styles.treatmentsHeaderLeft}>
                                    <Ionicons name="medical" size={20} color="#4F46E5" />
                                    <Text style={styles.treatmentsTitle}>Treatments & Medications</Text>
                                </View>
                                <TouchableOpacity>
                                    <Text style={styles.viewHistoryLink}>View History</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.treatmentsGrid}>
                                {/* Current Prescriptions */}
                                <View style={styles.treatmentsColumn}>
                                    <Text style={styles.treatmentsSectionTitle}>CURRENT PRESCRIPTIONS</Text>
                                    {medications.slice(0, 2).map((med) => (
                                        <View key={med.id} style={[styles.medCard, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}>
                                            <View style={styles.medIcon}>
                                                <Ionicons name="medical" size={20} color="#4F46E5" />
                                            </View>
                                            <View style={styles.medInfo}>
                                                <Text style={styles.medName}>{med.medication_name}</Text>
                                                <Text style={styles.medDosage}>{med.dosage_value} {med.dosage_unit} • {med.frequency}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>

                                {/* Recent Treatments */}
                                <View style={styles.treatmentsColumn}>
                                    <Text style={styles.treatmentsSectionTitle}>RECENT TREATMENTS</Text>
                                    <View style={styles.treatmentTimeline}>
                                        {medications.slice(0, 2).map((med) => (
                                            <View key={med.id} style={styles.timelineItem}>
                                                <View style={styles.timelineDot} />
                                                <View style={styles.timelineContent}>
                                                    <Text style={styles.timelineTitle}>{med.medication_name}</Text>
                                                    <Text style={styles.timelineDesc}>{med.notes || 'Treatment in progress'}</Text>
                                                </View>
                                                <Text style={styles.timelineDate}>{formatDate(med.end_date)}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Important Notes */}
                        <View style={styles.notesCard}>
                            <View style={styles.notesHeader}>
                                <Ionicons name="document-text" size={20} color="#CA8A04" />
                                <Text style={styles.notesTitle}>Important Notes</Text>
                            </View>
                            <Text style={styles.notesText}>
                                {(pet as any).notes || 'No important notes added yet. Add notes about travel requirements, dietary restrictions, or other important information.'}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        flexDirection: 'row',
        padding: 32,
        gap: 32,
    },
    leftColumn: {
        width: 360,
        gap: 24,
    },
    rightColumn: {
        flex: 1,
        gap: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    // Identity Card
    identityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#EEF2FF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    identityHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    identityTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5',
    },
    idBadge: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    idBadgeText: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#374151',
    },
    passportPattern: {
        padding: 24,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    photoFrame: {
        width: 128,
        height: 128,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#9CA3AF',
        overflow: 'hidden',
        marginBottom: 12,
    },
    passportPhoto: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    petkeyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    petkeyText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1D4ED8',
        letterSpacing: 0.5,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    detailItem: {
        width: '45%',
    },
    detailLabel: {
        fontSize: 10,
        color: '#6B7280',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    microchipSection: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderStyle: 'dashed',
        borderTopColor: '#E5E7EB',
    },
    microchipNumber: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'monospace',
        color: '#111827',
        letterSpacing: 2,
        marginTop: 4,
    },
    microchipMeta: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
    },
    // Owner Card
    ownerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    ownerTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
        letterSpacing: 0.5,
    },
    ownerContent: {
        padding: 20,
        gap: 16,
    },
    ownerField: {},
    ownerLabel: {
        fontSize: 10,
        color: '#6B7280',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    ownerValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    phoneLink: {
        color: '#4F46E5',
    },
    // Medical Alerts
    alertsCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
        overflow: 'hidden',
    },
    alertsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#FECACA',
    },
    alertsTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#DC2626',
        letterSpacing: 0.5,
    },
    alertsContent: {
        padding: 20,
        gap: 12,
    },
    alertItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    alertName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#991B1B',
    },
    alertDesc: {
        fontSize: 12,
        color: '#DC2626',
        marginTop: 2,
    },
    // Vaccinations
    vaccHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#4F46E5',
        backgroundImage: 'linear-gradient(to right, #4F46E5, #6366F1)',
    },
    vaccHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    vaccTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    vaccSubtitle: {
        fontSize: 13,
        color: '#C7D2FE',
    },
    addEntryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addEntryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
    vaccinationsTable: {
        padding: 24,
    },
    vaccSectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.5,
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    tableHeaderCell: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tableCell: {
        fontSize: 14,
        color: '#374151',
    },
    vaccName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4F46E5',
    },
    vaccBatch: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#6B7280',
        marginTop: 2,
    },
    validBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    validBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669',
    },
    expiredText: {
        fontSize: 12,
        color: '#6B7280',
    },
    warningBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    warningText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#EA580C',
    },
    // Treatments
    treatmentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    treatmentsHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    treatmentsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    viewHistoryLink: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4F46E5',
    },
    treatmentsGrid: {
        flexDirection: 'row',
        padding: 24,
        gap: 24,
    },
    treatmentsColumn: {
        flex: 1,
    },
    treatmentsSectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    medCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    medIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    medInfo: {
        flex: 1,
    },
    medName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#312E81',
    },
    medDosage: {
        fontSize: 12,
        color: '#6366F1',
        marginTop: 2,
    },
    treatmentTimeline: {
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: '#E5E7EB',
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        position: 'relative',
    },
    timelineDot: {
        position: 'absolute',
        left: -17,
        top: 6,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#D1D5DB',
    },
    timelineContent: {
        flex: 1,
        marginLeft: 8,
    },
    timelineTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    timelineDesc: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    timelineDate: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: '#6B7280',
    },
    // Notes
    notesCard: {
        backgroundColor: '#FFFBEB',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    notesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    notesTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#92400E',
    },
    notesText: {
        fontSize: 14,
        color: '#78350F',
        lineHeight: 22,
    },
});
