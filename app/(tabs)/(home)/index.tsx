import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '@/hooks/useLocale';
import { supabase } from '@/lib/supabase';
import { usePostHog } from 'posthog-react-native';

// Custom Hooks
import { useDashboardData } from '@/hooks/useDashboardData';

// Modals
import VisitFormModal from '@/components/features/health/VisitFormModal';
import VaccinationFormModal from '@/components/features/health/VaccinationFormModal';
import MedicationFormModal from '@/components/features/health/MedicationFormModal';
import WeightFormModal from '@/components/features/health/WeightFormModal';
import DocumentUploadModal from '@/components/features/documents/DocumentUploadModal';
import UserOnboardingModal from '@/components/features/onboarding/UserOnboardingModal';

// Widgets
import MyPetsWidget from '@/components/features/dashboard/MyPetsWidget';
import HealthSnapshotWidget from '@/components/features/dashboard/HealthSnapshotWidget';
import TodaysPrioritiesWidget from '@/components/features/dashboard/TodaysPrioritiesWidget';
import QuickActionsGrid from '@/components/features/dashboard/QuickActionsGrid';
import DashboardUpcoming from '@/components/features/dashboard/DashboardUpcoming';
import DashboardTimeline from '@/components/features/dashboard/DashboardTimeline';
import HealthMetricsWidget from '@/components/features/dashboard/HealthMetricsWidget';
import MedicationTrackerWidget from '@/components/features/dashboard/MedicationTrackerWidget';
import SmartInsightsWidget from '@/components/features/dashboard/SmartInsightsWidget';

export default function DashboardPage() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1024;
    const isTablet = width >= 768 && width < 1024;
    const isMobile = width < 768;
    const { theme } = useAppTheme();
    const { user, profile, refreshProfile } = useAuth();
    const { t } = useLocale();
    const posthog = usePostHog();

    // Unified dashboard data
    const {
        pets,
        events,
        priorities,
        metrics,
        insights,
        treatments,
        loading,
    } = useDashboardData();

    const [refreshing, setRefreshing] = useState(false);

    // Modal states
    const [visitOpen, setVisitOpen] = useState(false);
    const [vaccinationOpen, setVaccinationOpen] = useState(false);
    const [treatmentOpen, setTreatmentOpen] = useState(false);
    const [healthMetricsOpen, setHealthMetricsOpen] = useState(false);
    const [documentOpen, setDocumentOpen] = useState(false);
    const [onboardingVisible, setOnboardingVisible] = useState(false);

    useEffect(() => {
        if (profile) {
            if (!(profile as any).onboarding_completed) {
                setOnboardingVisible(true);
            }
        } else if (user) {
            checkOnboardingStatus();
        }
    }, [user, profile]);

    useFocusEffect(
        useCallback(() => {
            refreshProfile();
        }, [])
    );

    const checkOnboardingStatus = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('onboarding_completed' as any)
            .eq('id', user.id)
            .single();

        if (data && !(data as any).onboarding_completed) {
            setOnboardingVisible(true);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshProfile();
        setRefreshing(false);
    };

    const handleQuickAction = (id: string) => {
        switch (id) {
            case 'visit': setVisitOpen(true); break;
            case 'vaccine': setVaccinationOpen(true); break;
            case 'meds': setTreatmentOpen(true); break;
            case 'weight': setHealthMetricsOpen(true); break;
            case 'doc': setDocumentOpen(true); break;
        }
    };

    const handlePriorityComplete = (id: string) => {
        // Track completion event
        posthog.capture('priority_completed', { priority_id: id });

        // For now, just show feedback and log
        // In a full implementation, this would update the priority in the database
        console.log('Priority completed:', id);

        // Could add optimistic UI update here by filtering the priority from state
        // or marking it as completed in a local state
    };

    const handleMarkMedicationGiven = async (id: string) => {
        try {
            // Track medication given event
            posthog.capture('medication_marked_given', { medication_id: id });

            // In a full implementation, this would:
            // 1. Create a medication log entry with timestamp
            // 2. Update the medication's next due date
            // 3. Show success feedback to user
            console.log('Medication marked as given:', id);

            // Example of what the full implementation would look like:
            // await supabase.from('medication_logs').insert({
            //   medication_id: id,
            //   given_at: new Date().toISOString(),
            //   given_by: user?.id
            // });
        } catch (error) {
            console.error('Error marking medication as given:', error);
            posthog.capture('medication_log_error', { medication_id: id, error: String(error) });
        }
    };

    const handleInsightDismiss = (id: string) => {
        // Track insight dismissal to understand which insights users find less valuable
        posthog.capture('insight_dismissed', { insight_id: id });

        // In a full implementation, this could:
        // 1. Store dismissed insights in user preferences
        // 2. Update UI to hide the dismissed insight
        // 3. Use this data to improve insight relevance
        console.log('Insight dismissed:', id);
    };

    if (!loading && pets.length === 0) {
        return (
            <ScrollView
                style={[styles.container, { backgroundColor: theme.colors.background.primary }] as any}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary[500]]} />
                }
            >
                <View style={[styles.content, !isLargeScreen && styles.contentMobile]}>
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🐾</Text>
                        <Text style={styles.emptyTitle}>{t('my_pets_page.empty_title', { defaultValue: 'No Pets Yet' })}</Text>
                        <Text style={styles.emptyText}>{t('my_pets_page.empty_text', { defaultValue: 'Add your first pet to start managing their health and care' })}</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(tabs)/pets/new' as any)}>
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>{t('my_pets_page.add_first_pet', { defaultValue: 'Add Your First Pet' })}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <UserOnboardingModal
                    visible={onboardingVisible}
                    onClose={() => setOnboardingVisible(false)}
                    onComplete={async () => {
                        setOnboardingVisible(false);
                        await refreshProfile();
                    }}
                />
            </ScrollView>
        );
    }

    // Desktop Layout (8/4 Grid Split)
    const DesktopLayout = () => (
        <View style={styles.desktopContainer}>
            {/* Left Column (Main Content) - approx 66% */}
            <View style={styles.leftColumn}>
                <View style={styles.sectionContainer}>
                    <MyPetsWidget pets={pets} loading={loading} events={events} />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{t('widgets.quick_actions.title', { defaultValue: 'Quick Actions' })}</Text>
                    <QuickActionsGrid onActionPress={handleQuickAction} />
                </View>

                <View style={styles.sectionContainer}>
                    <DashboardUpcoming events={events} />
                </View>

                <HealthMetricsWidget metrics={metrics} loading={loading} />

                <MedicationTrackerWidget
                    medications={treatments}
                    onMarkGiven={handleMarkMedicationGiven}
                    onAddNew={() => setTreatmentOpen(true)}
                />
            </View>

            {/* Right Column (Sidebar) - approx 33% */}
            <View style={styles.rightColumn}>
                {/* Priority Alerts / Health Snapshot */}
                <View style={styles.sidebarSection}>
                    <TodaysPrioritiesWidget
                        priorities={priorities}
                        onComplete={handlePriorityComplete}
                    />
                </View>

                {/* Activity Feed */}
                <View style={[styles.sidebarSection, { flex: 1 }]}>
                    <DashboardTimeline />
                </View>

                <SmartInsightsWidget
                    insights={insights}
                    onDismiss={handleInsightDismiss}
                />
            </View>
        </View>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background.primary }] as any}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary[500]]} />
            }
            contentContainerStyle={styles.scrollContent}
        >
            <View style={[styles.content, !isLargeScreen && styles.contentMobile]}>
                {isLargeScreen ? (
                    <DesktopLayout />
                ) : (
                    /* Mobile/Tablet Stack */
                    <View style={styles.mobileStack}>
                        <MyPetsWidget pets={pets} loading={loading} events={events} />

                        {/* On mobile, Health Snapshot is better than the full list sometimes, but let's stick to Priorities for consistency */}
                        <TodaysPrioritiesWidget
                            priorities={priorities}
                            onComplete={handlePriorityComplete}
                        />

                        <QuickActionsGrid onActionPress={handleQuickAction} />

                        <DashboardUpcoming events={events} />

                        <HealthMetricsWidget metrics={metrics} loading={loading} />

                        <MedicationTrackerWidget
                            medications={treatments}
                            onMarkGiven={handleMarkMedicationGiven}
                            onAddNew={() => setTreatmentOpen(true)}
                        />

                        <DashboardTimeline />

                        <SmartInsightsWidget
                            insights={insights}
                            onDismiss={handleInsightDismiss}
                        />
                    </View>
                )}
            </View>

            {/* Modals */}
            <VisitFormModal
                visible={visitOpen}
                onClose={() => setVisitOpen(false)}
                onSuccess={() => setVisitOpen(false)}
            />
            <VaccinationFormModal
                visible={vaccinationOpen}
                onClose={() => setVaccinationOpen(false)}
                onSuccess={() => setVaccinationOpen(false)}
            />
            <MedicationFormModal
                visible={treatmentOpen}
                onClose={() => setTreatmentOpen(false)}
                onSuccess={() => setTreatmentOpen(false)}
            />
            <WeightFormModal
                visible={healthMetricsOpen}
                onClose={() => setHealthMetricsOpen(false)}
                onSuccess={() => setHealthMetricsOpen(false)}
            />
            <DocumentUploadModal
                visible={documentOpen}
                onClose={() => setDocumentOpen(false)}
            />
            <UserOnboardingModal
                visible={onboardingVisible}
                onClose={() => setOnboardingVisible(false)}
                onComplete={async () => {
                    setOnboardingVisible(false);
                    await refreshProfile();
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        padding: 24,
        maxWidth: 1440, // Wider max width for 8/4 split
        width: '100%',
        alignSelf: 'center',
    },
    contentMobile: {
        padding: 16,
    },
    // Layout Stacks
    mobileStack: {
        gap: 16,
    },
    tabletStack: {
        gap: 20,
    },
    // Desktop Grid Layout
    desktopContainer: {
        flexDirection: 'row',
        gap: 32, // Wider gap for desktop columns
        alignItems: 'flex-start',
    },
    leftColumn: {
        flex: 2, // ~66% width
        gap: 32,
        minWidth: 0, // Prevent flex overflow
    },
    rightColumn: {
        flex: 1, // ~33% width
        gap: 32,
        minWidth: 320, // Ensure sidebar doesn't get too squashed
        maxWidth: 400, // Or restrain it if needed
    },
    // Sections
    sectionContainer: {
        gap: 16,
    },
    sidebarSection: {
        gap: 16,
        paddingBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
        marginBottom: 4,
    },
    // Legacy support (safe to keep or remove if fully unused, keeping for safety)
    twoColumnRow: {
        flexDirection: 'row',
        gap: 20,
    },
    halfWidth: {
        flex: 1,
    },
    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans',
    },
});
