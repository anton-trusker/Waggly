import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet, Veterinarian } from '@/types';
import UpcomingCarePanel from '@/components/desktop/dashboard/UpcomingCarePanel';
import ActivityFeedTimeline from '@/components/desktop/dashboard/ActivityFeedTimeline';

interface OverviewTabDesktopProps {
    pet: Pet;
    vets: Veterinarian[];
}

export default function OverviewTabDesktop({ pet, vets }: OverviewTabDesktopProps) {
    const calculateAge = (dob: string) => {
        const diff = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <View style={styles.container}>
            {/* Main Content Column */}
            <View style={styles.mainColumn}>
                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#EEF2FF' }]}>
                            <Ionicons name="calendar" size={20} color="#6366F1" />
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Age</Text>
                            <Text style={styles.statValue}>
                                {pet.date_of_birth ? `${calculateAge(pet.date_of_birth)} years` : '-'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#ECFDF5' }]}>
                            <Ionicons name="scale" size={20} color="#10B981" />
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Weight</Text>
                            <Text style={styles.statValue}>{pet.weight ? `${pet.weight} kg` : '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#FEF2F2' }]}>
                            <Ionicons name="male-female" size={20} color="#EF4444" />
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Gender</Text>
                            <Text style={styles.statValue}>{pet.gender || '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#FFFBEB' }]}>
                            <Ionicons name="hardware-chip" size={20} color="#F59E0B" />
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Microchip</Text>
                            <Text style={styles.statValue}>{pet.microchip_number || 'Not Set'}</Text>
                        </View>
                    </View>
                </View>

                {/* Primary Vet Card */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Primary Veterinarian</Text>
                    {vets.length > 0 ? (
                        <View style={styles.vetCard}>
                            <View style={styles.vetInfo}>
                                <Text style={styles.vetName}>{vets[0].vet_name || vets[0].clinic_name}</Text>
                                <Text style={styles.vetClinic}>{vets[0].clinic_name}</Text>
                                <Text style={styles.vetAddress}>{vets[0].address}</Text>
                            </View>
                            <View style={styles.vetActions}>
                                <TouchableOpacity style={styles.vetButton}>
                                    <Ionicons name="call-outline" size={18} color="#374151" />
                                    <Text style={styles.vetButtonText}>{vets[0].phone}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No veterinarian added yet.</Text>
                        </View>
                    )}
                </View>

                {/* Upcoming Care */}
                <UpcomingCarePanel petId={pet.id} />
            </View>

            {/* Sidebar Column */}
            <View style={styles.sidebarColumn}>
                <ActivityFeedTimeline />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 24,
    },
    mainColumn: {
        flex: 2,
        gap: 24,
    },
    sidebarColumn: {
        flex: 1,
        minWidth: 300,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
    },
    statCard: {
        flex: 1,
        minWidth: 150,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginTop: 2,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    vetCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vetInfo: {
        gap: 4,
    },
    vetName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    vetClinic: {
        fontSize: 14,
        color: '#4B5563',
    },
    vetAddress: {
        fontSize: 13,
        color: '#6B7280',
    },
    vetActions: {
        flexDirection: 'row',
        gap: 12,
    },
    vetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    vetButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    emptyState: {
        padding: 24,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280',
        fontStyle: 'italic',
    },
});
