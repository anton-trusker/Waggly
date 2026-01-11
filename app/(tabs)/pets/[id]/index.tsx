import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
// Removed: OverviewTab, PetHealthProfile - tabs no longer used
import DocumentsTab from './documents';
import HistoryTab from './history';
import SettingsTab from './settings';
import PassportTab from './passport';
import ShareModal from '@/components/features/sharing/ShareModal';
import ActiveLinksList from '@/components/features/sharing/ActiveLinksList';
import Button from '@/components/ui/Button';
import EditPetModal from '@/components/pet/EditPetModal';


export default function PetDetailsPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const petId = params.id as string;
    const { pets, refreshPets } = usePets();
    const { width } = useWindowDimensions();
    const isMobile = width < 768; // Standard mobile breakpoint
    const [activeTab, setActiveTab] = useState<'passport' | 'documents' | 'history' | 'share' | 'settings'>('passport'); // Changed default to 'passport', removed overview/health
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [shareRefreshTrigger, setShareRefreshTrigger] = useState(0);
    const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            refreshPets();
        }, [])
    );

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
                    <ScrollView style={styles.mobileContent} showsVerticalScrollIndicator={false}>
                        {/* Simplified Tabs - Removed Overview & Health */}
                        <View style={styles.mobileTabs}>
                            {['Passport', 'Documents', 'Share', 'History', 'Settings'].map((tab) => {
                                const key = tab.toLowerCase() as any;
                                const isActive = activeTab === key;
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        onPress={() => setActiveTab(key)}
                                        style={[styles.mobileTabItem, isActive && styles.mobileTabItemActive] as any}
                                    >
                                        <Text style={[styles.mobileTabText, isActive && styles.mobileTabTextActive]}>{tab}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>



                        {/* Tab Content - Removed Overview & Health */}
                        <View style={{ paddingBottom: 100 }}>
                            {activeTab === 'passport' && <PassportTab />}
                            {activeTab === 'documents' && <DocumentsTab />}
                            {activeTab === 'share' && (
                                <View style={{ padding: 16 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937' }}>Active Links</Text>
                                        <Button onPress={() => setShareModalVisible(true)} size="sm">Create Link</Button>
                                    </View>
                                    <ActiveLinksList petId={petId} refreshTrigger={shareRefreshTrigger} />
                                </View>
                            )}
                            {activeTab === 'history' && <HistoryTab />}
                            {activeTab === 'settings' && <SettingsTab />}
                        </View>
                    </ScrollView>
                </>
            ) : (
                <>
                    {/* Desktop Header */}
                    {/* Desktop Header Removed */}
                    {/*
                    <View style={styles.petHeader}>
                        ...
                    </View>
                    */}


                    {/* Desktop Tabs */}
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'passport' && styles.tabActive] as any}
                            onPress={() => setActiveTab('passport')}
                        >
                            <Text style={[styles.tabText, activeTab === 'passport' && styles.tabTextActive]}>
                                Passport
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'documents' && styles.tabActive] as any}
                            onPress={() => setActiveTab('documents')}
                        >
                            <Text style={[styles.tabText, activeTab === 'documents' && styles.tabTextActive]}>
                                Documents
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'share' && styles.tabActive] as any}
                            onPress={() => setActiveTab('share')}
                        >
                            <Text style={[styles.tabText, activeTab === 'share' && styles.tabTextActive]}>
                                Share
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'history' && styles.tabActive] as any}
                            onPress={() => setActiveTab('history')}
                        >
                            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                                History
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'settings' && styles.tabActive] as any}
                            onPress={() => setActiveTab('settings')}
                        >
                            <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>
                                Settings
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Desktop Tab Content */}
                    <ScrollView style={styles.tabContent}>
                        {activeTab === 'passport' && (
                            <PassportTab
                                onEditPet={() => setEditProfileModalVisible(true)}
                            />
                        )}
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
                        {activeTab === 'history' && <HistoryTab />}
                        {activeTab === 'settings' && <SettingsTab />}
                    </ScrollView>
                </>
            )}

            <ShareModal
                visible={shareModalVisible}
                onClose={() => setShareModalVisible(false)}
                petId={petId}
                onLinkGenerated={() => setShareRefreshTrigger(prev => prev + 1)}
            />

            <EditPetModal
                visible={editProfileModalVisible}
                onClose={() => {
                    setEditProfileModalVisible(false);
                    refreshPets();
                }}
                petId={petId}
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
        paddingVertical: 16,
        paddingHorizontal: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    petInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    relative: {
        position: 'relative',
    },
    petPhotoGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        padding: 2,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    petPhoto: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },
    petPhotoPlaceholder: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    petMeta: {
        justifyContent: 'center',
    },
    petName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
    },

    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#F3F4F6',
    },
    shareButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    editButtonText: {
        fontSize: 13,
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
        paddingHorizontal: 20,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#2C097F',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '700',
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
        paddingHorizontal: 16,
        paddingTop: 48, // Safe area
        paddingBottom: 8,
        backgroundColor: '#F8FAFC',
    },
    mobileHeaderTitle: {
        fontSize: 12,
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
        width: 36,
        height: 36,
        borderRadius: 18,
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
        paddingHorizontal: 16,
        paddingTop: 0,
    },
    mobileTabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    mobileTabItemActive: {
        borderBottomColor: '#3B82F6',
    },
    mobileTabText: {
        fontSize: 12, // Kept small to fit 6 tabs
        fontWeight: '600',
        color: '#64748B',
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
        marginTop: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    mobilePhotoContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    mobileGradientRing: {
        padding: 2,
        borderRadius: 32,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    mobilePhoto: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
    },
    mobilePetName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        marginTop: 4,
    },
});
