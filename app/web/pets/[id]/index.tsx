import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import OverviewTab from './overview';
import HealthTab from './health';
import AlbumTab from './album';
import DocumentsTab from './documents';
import ShareModal from '@/components/sharing/ShareModal';
import ActiveLinksList from '@/components/sharing/ActiveLinksList';
import Button from '@/components/ui/Button';

export default function PetDetailsPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const petId = params.id as string;
    const { pets } = usePets();
    const { width } = useWindowDimensions();
    const isMobile = width < 768; // Standard mobile breakpoint
    const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'album' | 'documents' | 'share'>('overview');
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [shareRefreshTrigger, setShareRefreshTrigger] = useState(0);

    const pet = pets.find(p => p.id === petId);

    if (!pet) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading pet details...</Text>
            </View>
        );
    }

    const getAge = () => {
        if (!pet.birth_date) return 'Unknown';
        const birth = new Date(pet.birth_date);
        const now = new Date();
        const years = now.getFullYear() - birth.getFullYear();
        if (years > 0) return `${years} Yrs`; // Abbreviated for mobile
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

    return (
        <View style={styles.container}>
            {isMobile ? (
                <>
                    {/* Mobile Header */}
                    <View style={styles.mobileHeader}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                            <Ionicons name="chevron-back" size={24} color="#475569" />
                        </TouchableOpacity>
                        <Text style={styles.mobileHeaderTitle}>PROFILE</Text>
                        <View style={styles.mobileHeaderActions}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => setShareModalVisible(true)}>
                                <Ionicons name="share-outline" size={20} color="#475569" />
                            </TouchableOpacity>
                            {canEdit && (
                                <TouchableOpacity style={styles.iconBtn} onPress={() => router.push(`/web/pets/${petId}/edit` as any)}>
                                    <Ionicons name="create-outline" size={20} color="#475569" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <ScrollView style={styles.mobileContent} showsVerticalScrollIndicator={false}>
                        {/* Sticky Tabs Header (simulated placement) */}
                        <View style={styles.mobileTabs}>
                            {['Overview', 'Health', 'Album', 'Documents'].map((tab) => {
                                const key = tab.toLowerCase() as any;
                                const isActive = activeTab === key;
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        onPress={() => setActiveTab(key)}
                                        style={[styles.mobileTabItem, isActive && styles.mobileTabItemActive]}
                                    >
                                        <Text style={[styles.mobileTabText, isActive && styles.mobileTabTextActive]}>{tab}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        {/* Profile Summary */}
                        <View style={styles.mobileProfileSection}>
                            <View style={styles.mobilePhotoContainer}>
                                <LinearGradient
                                    colors={['#3B82F6', '#22D3EE', '#34D399']} // Blue -> Cyan -> Emerald
                                    start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
                                    style={styles.mobileGradientRing}
                                >
                                    {pet.photo_url ? (
                                        <Image source={{ uri: pet.photo_url }} style={styles.mobilePhoto} />
                                    ) : (
                                        <View style={[styles.mobilePhoto, { backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }]}>
                                            <Ionicons name="paw" size={40} color="#94A3B8" />
                                        </View>
                                    )}
                                </LinearGradient>
                                <View style={styles.mobileVerifiedBadge}>
                                    <Ionicons name="checkmark" size={14} color="#fff" />
                                </View>
                            </View>

                            <Text style={styles.mobilePetName}>{pet.name}</Text>
                            <Text style={styles.mobilePetBreed}>{pet.breed || pet.species}</Text>

                            <View style={styles.mobileStatsRow}>
                                <View style={styles.mobileStatPill}>
                                    <Text style={styles.mobileStatText}>{getAge()}</Text>
                                </View>
                                <View style={styles.mobileStatPill}>
                                    <Ionicons name={pet.gender === 'female' ? 'female' : 'male'} size={14} color={pet.gender === 'female' ? '#F472B6' : '#60A5FA'} />
                                    <Text style={styles.mobileStatText}>{pet.gender === 'female' ? 'Female' : 'Male'}</Text>
                                </View>
                                <View style={styles.mobileStatPill}>
                                    <Ionicons name="fitness-outline" size={14} color="#60A5FA" />
                                    <Text style={styles.mobileStatText}>{pet.weight ? `${pet.weight} kg` : 'N/A'}</Text>
                                </View>
                            </View>

                            <View style={styles.mobileLocationRow}>
                                <Ionicons name="location-sharp" size={14} color="#94A3B8" />
                                <Text style={styles.mobileLocationText}>{getLocation()}</Text>
                            </View>
                        </View>

                        {/* Tab Content */}
                        <View style={{ paddingBottom: 100 }}>
                            {activeTab === 'overview' && <OverviewTab />}
                            {activeTab === 'health' && <HealthTab />}
                            {activeTab === 'album' && <AlbumTab />}
                            {activeTab === 'documents' && <DocumentsTab />}
                        </View>
                    </ScrollView>
                </>
            ) : (
                <>
                    {/* Desktop Header */}
                    <View style={styles.petHeader}>
                        <View style={styles.petInfo}>
                            <View style={styles.relative}>
                                <View style={styles.petPhotoGradient}>
                                    {pet.photo_url ? (
                                        <Image source={{ uri: pet.photo_url }} style={styles.petPhoto} />
                                    ) : (
                                        <View style={styles.petPhotoPlaceholder}>
                                            <Ionicons name="paw" size={48} color="#6366F1" />
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
                                        <Text style={[styles.statBadgeText, { color: '#2563EB' }]}>{pet.weight ? `${pet.weight} ${pet.weight_unit}` : 'N/A'}</Text>
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
                            <TouchableOpacity style={styles.shareButton} onPress={() => setShareModalVisible(true)}>
                                <Ionicons name="share-outline" size={20} color="#374151" />
                                <Text style={styles.shareButtonText}>Share Profile</Text>
                            </TouchableOpacity>
                            {canEdit && (
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => router.push(`/web/pets/${petId}/edit` as any)}
                                >
                                    <Ionicons name="create-outline" size={20} color="#374151" />
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Desktop Tabs */}
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
                            onPress={() => setActiveTab('overview')}
                        >
                            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
                                Overview
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'health' && styles.tabActive]}
                            onPress={() => setActiveTab('health')}
                        >
                            <Text style={[styles.tabText, activeTab === 'health' && styles.tabTextActive]}>
                                Health
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'documents' && styles.tabActive]}
                            onPress={() => setActiveTab('documents')}
                        >
                            <Text style={[styles.tabText, activeTab === 'documents' && styles.tabTextActive]}>
                                Documents
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'share' && styles.tabActive]}
                            onPress={() => setActiveTab('share')}
                        >
                            <Text style={[styles.tabText, activeTab === 'share' && styles.tabTextActive]}>
                                Share
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Desktop Tab Content */}
                    <ScrollView style={styles.tabContent}>
                        {activeTab === 'overview' && <OverviewTab />}
                        {activeTab === 'health' && <HealthTab />}
                        {activeTab === 'album' && <AlbumTab />}
                        {activeTab === 'documents' && <DocumentsTab />}
                        {activeTab === 'share' && (
                            <View style={{ padding: 32 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#1F2937' }}>Active Links</Text>
                                    <Button onPress={() => setShareModalVisible(true)}>Create New Link</Button>
                                </View>
                                <ActiveLinksList petId={petId} refreshTrigger={shareRefreshTrigger} />
                            </View>
                        )}
                    </ScrollView>
                </>
            )}
            
            <ShareModal 
                visible={shareModalVisible} 
                onClose={() => setShareModalVisible(false)} 
                petId={petId}
                onLinkGenerated={() => setShareRefreshTrigger(prev => prev + 1)}
            />
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
    },
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
        backgroundColor: 'linear-gradient(135deg, #2C097F, #3B82F6)',
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
        backgroundColor: '#EEF2FF',
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
        backgroundColor: '#2C097F',
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
    editButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
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
        borderBottomColor: '#2C097F',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#2C097F',
    },
    tabContent: {
        flex: 1,
    },
    // Mobile Styles
    mobileContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    mobileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 48, // Safe area
        paddingBottom: 12,
        backgroundColor: '#F8FAFC',
    },
    mobileHeaderTitle: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#94A3B8',
        textTransform: 'uppercase',
    },
    mobileHeaderActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    mobileTabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    mobileTabItem: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    mobileTabItemActive: {
        borderBottomColor: '#3B82F6',
    },
    mobileTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#94A3B8',
    },
    mobileTabTextActive: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    mobileContent: {
        flex: 1,
    },
    mobileProfileSection: {
        alignItems: 'center',
        marginTop: 24,
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    mobilePhotoContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    mobileGradientRing: {
        padding: 4,
        borderRadius: 100,
    },
    mobilePhoto: {
        width: 110, // ~32 in tw (128px) -> designs shows ~w-32 which is 128px
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: '#F8FAFC',
        backgroundColor: '#fff',
    },
    mobileVerifiedBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#F8FAFC',
    },
    mobilePetName: {
        fontSize: 28, // 3xl
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    mobilePetBreed: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
        marginBottom: 16,
    },
    mobileStatsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    mobileStatPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    mobileStatText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    mobileLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    mobileLocationText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
});
