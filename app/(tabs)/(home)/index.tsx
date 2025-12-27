import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PetCardCompact from '@/components/dashboard/PetCardCompact';
import QuickActionsGrid from '@/components/desktop/dashboard/QuickActionsGrid';
import UpcomingCarePanel from '@/components/desktop/dashboard/UpcomingCarePanel';
import PriorityAlertsPanel from '@/components/desktop/dashboard/PriorityAlertsPanel';
import ActivityFeedTimeline from '@/components/desktop/dashboard/ActivityFeedTimeline';
import { usePets } from '@/hooks/usePets';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import MobileHeader from '@/components/layout/MobileHeader';

// New Modal Imports
import VisitFormModal from '@/components/desktop/modals/VisitFormModal';
import VaccinationFormModal from '@/components/desktop/modals/VaccinationFormModal';
import TreatmentFormModal from '@/components/desktop/modals/TreatmentFormModal';
import HealthMetricsModal from '@/components/desktop/modals/HealthMetricsModal';

export default function DashboardPage() {
    const router = useRouter();
    const { pets, loading } = usePets();
    const { width } = useWindowDimensions();
    const isMobile = width < 1024; // Treat tablet as mobile/stacked layout for now or define stricter breakpoint

    // Modal States
    const [visitOpen, setVisitOpen] = useState(false);
    const [vaccinationOpen, setVaccinationOpen] = useState(false);
    const [treatmentOpen, setTreatmentOpen] = useState(false);
    const [healthMetricsOpen, setHealthMetricsOpen] = useState(false);

    const handleQuickAction = (actionId: string) => {
        switch (actionId) {
            case 'visit':
                setVisitOpen(true);
                break;
            case 'vaccine':
                setVaccinationOpen(true);
                break;
            case 'meds':
                setTreatmentOpen(true);
                break;
            case 'weight':
                setHealthMetricsOpen(true);
                break;
            case 'photo':
                router.push('/(tabs)/pets/photos/add' as any);
                break;
            default:
                break;
        }
    };

    return (
        <DesktopShell>
            <MobileHeader showLogo={true} showNotifications={true} />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header removed (use global Topbar) */}
                <View style={[styles.content, isMobile && styles.contentMobile]}>
                    {/* Main Column */}
                    <View style={styles.mainColumn}>
                        {/* Your Pets Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.sectionTitle}>Your Pets</Text>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{pets.length}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => router.push('/(tabs)/pets' as any)}>
                                    <Text style={styles.viewAllLink}>View All Pets</Text>
                                </TouchableOpacity>
                            </View>

                            {loading ? (
                                <Text style={styles.loadingText}>Loading pets...</Text>
                            ) : pets.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyIcon}>🐾</Text>
                                    <Text style={styles.emptyTitle}>No Pets Yet</Text>
                                    <Text style={styles.emptyText}>
                                        Add your first pet to start managing their health and care
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.addFirstPetButton}
                                        onPress={() => router.push('/(tabs)/pets/add' as any)}
                                    >
                                        <Ionicons name="add" size={20} color="#fff" />
                                        <Text style={styles.addFirstPetText}>Add Your First Pet</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.petsGrid}>
                                    {pets.map((pet) => (
                                        <PetCardCompact key={pet.id} pet={pet} />
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Quick Actions - Desktop only, mobile uses plus button */}
                        {!isMobile && <QuickActionsGrid onActionPress={handleQuickAction} />}
                    </View>

                    {/* Sidebar Column */}
                    <View style={[styles.sidebarColumn, isMobile && styles.sidebarColumnMobile]}>
                        {/* Upcoming Care */}
                        <UpcomingCarePanel />

                        {/* Priority Alerts */}
                        <PriorityAlertsPanel />

                        {/* Activity Feed */}
                        <ActivityFeedTimeline />
                    </View>
                </View>
                {/* Add padding bottom for mobile nav */}
                {isMobile && <View style={{ height: 80 }} />}

                {/* Modals */}
                <VisitFormModal visible={visitOpen} onClose={() => setVisitOpen(false)} />
                <VaccinationFormModal visible={vaccinationOpen} onClose={() => setVaccinationOpen(false)} />
                <TreatmentFormModal visible={treatmentOpen} onClose={() => setTreatmentOpen(false)} />
                <HealthMetricsModal
                    visible={healthMetricsOpen}
                    onClose={() => setHealthMetricsOpen(false)}
                />
            </ScrollView>
        </DesktopShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        flexDirection: 'row',
        gap: 32,
        padding: 32,
        maxWidth: 1440,
        alignSelf: 'center',
        width: '100%',
    },
    contentMobile: {
        flexDirection: 'column',
        padding: 16,
        gap: 24,
    },
    mainColumn: {
        flex: 2,
        gap: 24,
    },
    sidebarColumn: {
        flex: 1,
        minWidth: 320,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        fontFamily: 'Plus Jakarta Sans',
    },
    badge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
        fontFamily: 'Plus Jakarta Sans',
    },
    viewAllLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
        fontFamily: 'Plus Jakarta Sans',
    },
    loadingText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingVertical: 40,
        fontFamily: 'Plus Jakarta Sans',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        fontFamily: 'Plus Jakarta Sans',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        maxWidth: 400,
        marginBottom: 24,
        fontFamily: 'Plus Jakarta Sans',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#6366F1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans',
    },
    petGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    petGridMobile: {
        flexDirection: 'column',
    },
    petCardWrapper: {
        width: '31%', // calc replacement
        minWidth: 250,
    },
    petCardWrapperMobile: {
        width: '100%',
    },
    addPetCard: {
        width: '31%',
        minWidth: 250,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 40,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPetCardMobile: {
        width: '100%',
        paddingVertical: 32,
    },
    addPetIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    addPetText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6366F1',
        fontFamily: 'Plus Jakarta Sans',
    },
    actionsContainer: {
        marginBottom: 32,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
        fontFamily: 'Plus Jakarta Sans',
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
    },
    actionCard: {
        alignItems: 'center',
        minWidth: 100,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderRadius: 12,
    },
    actionCardHover: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    actionCardFocus: {
        borderWidth: 2,
        borderColor: '#6366F1',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        fontFamily: 'Plus Jakarta Sans',
    },
});
