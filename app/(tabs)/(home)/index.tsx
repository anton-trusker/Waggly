
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';
import { usePets } from '@/hooks/usePets';
import { useAuth } from '@/context/AuthContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import VisitFormModal from '@/components/desktop/modals/VisitFormModal';
import VaccinationFormModal from '@/components/desktop/modals/VaccinationFormModal';
import TreatmentFormModal from '@/components/desktop/modals/TreatmentFormModal';
import HealthMetricsModal from '@/components/desktop/modals/HealthMetricsModal';

// Widgets
import QuickActionsGrid from '@/components/desktop/dashboard/QuickActionsGrid';
import MyPetsWidget from '@/components/desktop/dashboard/MyPetsWidget';
import DashboardUpcoming from '@/components/desktop/dashboard/DashboardUpcoming';
import DashboardTimeline from '@/components/desktop/dashboard/DashboardTimeline';

export default function DashboardPage() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1024;
    const { theme } = useAppTheme();
    const { refreshPets } = usePets();

    const [refreshing, setRefreshing] = useState(false);
    const [visitOpen, setVisitOpen] = useState(false);
    const [vaccinationOpen, setVaccinationOpen] = useState(false);
    const [treatmentOpen, setTreatmentOpen] = useState(false);
    const [healthMetricsOpen, setHealthMetricsOpen] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshPets();
        // Add other refresh calls here if needed (useEvents, useActivityFeed, etc.)
        setRefreshing(false);
    };

    const handleQuickAction = (id: string) => {
        switch (id) {
            case 'visit': setVisitOpen(true); break;
            case 'vaccine': setVaccinationOpen(true); break;
            case 'meds': setTreatmentOpen(true); break;
            case 'weight': setHealthMetricsOpen(true); break;
            case 'doc': router.push('/(tabs)/pets/documents/add' as any); break;
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary[500]]} />
            }
        >
            <View style={[styles.content, !isLargeScreen && styles.contentMobile]}>

                {/* Header (Greeting) */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.welcomeText, { color: theme.colors.text.primary }]}>{t('dashboard.welcome_back')}</Text>
                        <Text style={[styles.subtitleText, { color: theme.colors.text.secondary }]}>{t('dashboard.subtitle')}</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/profile' as any)}>
                        <View style={styles.avatarPlaceholder}>
                            <IconSymbol android_material_icon_name="person" size={24} color="#9CA3AF" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Mobile Layout - Direct vertical stack */}
                {!isLargeScreen && (
                    <View style={styles.mobileStack}>
                        <MyPetsWidget />
                        <DashboardUpcoming />
                        <DashboardTimeline />
                    </View>
                )}

                {/* Desktop Layout - Two columns */}
                {isLargeScreen && (
                    <View style={styles.gridLarge}>
                        {/* Left Column (Main) */}
                        <View style={styles.colMain}>
                            <MyPetsWidget />
                            <QuickActionsGrid onActionPress={handleQuickAction} />
                        </View>

                        {/* Right Column (Sidebar/Widgets) */}
                        <View style={styles.colSide}>
                            <View style={{ gap: 24 }}>
                                <DashboardUpcoming />
                                <DashboardTimeline />
                            </View>
                        </View>
                    </View>
                )}

            </View>

            {/* Modals */}
            <VisitFormModal visible={visitOpen} onClose={() => setVisitOpen(false)} />
            <VaccinationFormModal visible={vaccinationOpen} onClose={() => setVaccinationOpen(false)} />
            <TreatmentFormModal visible={treatmentOpen} onClose={() => setTreatmentOpen(false)} />
            <HealthMetricsModal visible={healthMetricsOpen} onClose={() => setHealthMetricsOpen(false)} initialTab="weight" />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
    },
    contentMobile: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
    },
    subtitleText: {
        fontSize: 14,
        fontFamily: 'Plus Jakarta Sans',
        marginTop: 4,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mobileStack: {
        gap: 16,
    },
    gridLarge: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 24,
    },
    colMain: {
        flex: 1,
        flexGrow: 1.5,
    },
    colSide: {
        flex: 1,
    },
});
