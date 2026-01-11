import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types';
import Button from '@/components/ui/Button';

interface PetProfileHeaderProps {
    pet: Pet;
}

export default function PetProfileHeader({ pet }: PetProfileHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();

    const getAge = () => {
        if (!pet.date_of_birth) return 'Unknown';
        const birth = new Date(pet.date_of_birth);
        const now = new Date();
        const years = now.getFullYear() - birth.getFullYear();
        if (years > 0) return `${years} Yrs`;
        const months = now.getMonth() - birth.getMonth();
        return `${months} Mos`;
    };

    const getLocation = () => {
        const addr = pet.address_json as any;
        if (addr?.city && addr?.country) return `${addr.city}, ${addr.country}`;
        if (addr?.city) return addr.city;
        return 'Location not set';
    };

    const canEdit = pet.role !== 'viewer';

    // Determine active tab from pathname
    const getActiveTab = () => {
        if (pathname.includes('/overview')) return 'overview';
        if (pathname.includes('/health')) return 'health';
        if (pathname.includes('/album')) return 'album';
        if (pathname.includes('/documents')) return 'documents';
        if (pathname.includes('/history')) return 'history';
        if (pathname.includes('/passport')) return 'passport';
        if (pathname.includes('/events')) return 'events';
        return 'overview';
    };

    const activeTab = getActiveTab();

    const tabs = [
        { key: 'overview', label: 'Overview', path: `/(tabs)/pets/${pet.id}/overview` },
        { key: 'health', label: 'Health', path: `/(tabs)/pets/${pet.id}/health` },
        { key: 'album', label: 'Gallery', path: `/(tabs)/pets/${pet.id}/album` },
        { key: 'documents', label: 'Documents', path: `/(tabs)/pets/${pet.id}/documents` },
        { key: 'history', label: 'History', path: `/(tabs)/pets/${pet.id}/history` },
        { key: 'passport', label: 'Passport', path: `/(tabs)/pets/${pet.id}/passport` },
        { key: 'events', label: 'Events', path: `/(tabs)/pets/${pet.id}/events` },
    ];

    return (
        <>
            {/* Pet Header */}
            <View style={styles.petHeader}>
                <View style={styles.petInfo}>
                    <View style={styles.relative}>
                        <View style={styles.petPhotoGradient}>
                            {pet.photo_url ? (
                                <Image source={{ uri: pet.photo_url }} style={styles.petPhoto} />
                            ) : (
                                <View style={styles.petPhotoPlaceholder}>
                                    <Ionicons name="paw" size={48} color="#0EA5E9" />
                                </View>
                            )}
                        </View>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                        </View>
                    </View>
                    <View style={styles.petMeta}>
                        <Text style={styles.petName}>{pet.name}</Text>
                        <Text style={styles.petBreed}>{pet.breed || pet.species}</Text>
                        <View style={styles.petStats}>
                            <View style={[styles.statBadge, styles.ageBadge]}>
                                <Text style={styles.statBadgeText}>{getAge()}</Text>
                            </View>
                            <View style={[styles.statBadge, styles.genderBadge]}>
                                <Ionicons name={pet.gender === 'female' ? 'female' : 'male'} size={12} color={pet.gender === 'female' ? '#DB2777' : '#2563EB'} />
                                <Text style={[styles.statBadgeText, { color: pet.gender === 'female' ? '#DB2777' : '#2563EB' }]}>{pet.gender || 'N/A'}</Text>
                            </View>
                            <View style={[styles.statBadge, styles.weightBadge]}>
                                <Ionicons name="barbell" size={12} color="#2563EB" />
                                <Text style={[styles.statBadgeText, { color: '#2563EB' }]}>{pet.weight ? `${pet.weight} kg` : 'N/A'}</Text>
                            </View>
                        </View>
                        {getLocation() && (
                            <View style={styles.locationRow}>
                                <Ionicons name="location" size={14} color="#6B7280" />
                                <Text style={styles.locationText}>{getLocation()}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.headerActions}>
                    {canEdit && (
                        <Button
                            variant="outline"
                            onPress={() => router.push(`/(tabs)/pets/${pet.id}/edit` as any)}
                            style={styles.editButton}
                        >
                            Edit Profile
                        </Button>
                    )}
                    <Button
                        onPress={() => router.push(`/(tabs)/pets/${pet.id}/share` as any)}
                        style={styles.shareButton}
                    >
                        <Text style={styles.shareButtonText}>Share Profile</Text>
                    </Button>
                </View>
            </View>

            {/* Desktop Tabs */}
            <View style={styles.tabs}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.tabActive] as any}
                        onPress={() => router.push(tab.path as any)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    petHeader: {
        padding: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    petInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 24,
    },
    relative: {
        position: 'relative',
    },
    petPhotoGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        padding: 4,
        backgroundColor: '#0EA5E9',
    },
    petPhoto: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 4,
        borderColor: '#fff',
    },
    petPhotoPlaceholder: {
        width: 112,
        height: 112,
        borderRadius: 56,
        backgroundColor: '#F0F9FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#fff',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#0EA5E9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    petMeta: {
        flex: 1,
    },
    petName: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    petBreed: {
        fontSize: 18,
        color: '#6B7280',
        marginBottom: 16,
    },
    petStats: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    ageBadge: {
        backgroundColor: '#F3F4F6',
    },
    genderBadge: {
        backgroundColor: '#FCE7F3',
    },
    weightBadge: {
        backgroundColor: '#DBEAFE',
    },
    statBadgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        fontSize: 12,
        color: '#6B7280',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    shareButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingHorizontal: 32,
    },
    tab: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#0EA5E9',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#0EA5E9',
    },
});
