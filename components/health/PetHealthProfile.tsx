import React from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions, Text, ActivityIndicator } from 'react-native';
import { useHealthDashboard } from '@/hooks/useHealthDashboard';

// Widgets
import { HealthScoreWidget } from '@/components/health/HealthScoreWidget';
import { QuickVitalsWidget } from '@/components/health/QuickVitalsWidget';
import { VaccinationCardWidget } from '@/components/health/VaccinationCardWidget';
import { PreventiveCareWidget } from '@/components/health/PreventiveCareWidget';
import { MedicationWidget } from '@/components/health/MedicationWidget';

interface PetHealthProfileProps {
    petId: string;
}

export function PetHealthProfile({ petId }: PetHealthProfileProps) {
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1024;
    const isMobile = width < 768;

    const {
        summary,
        vaccinations,
        medications,
        preventiveCare,
        loading,
        error,
        refresh
    } = useHealthDashboard(petId);

    if (loading && !summary) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0EA5E9" />
                <Text style={styles.loadingText}>Loading Health Profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text>Error loading data. Please try again.</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[
                styles.contentContainer,
                isMobile && styles.contentMobile
            ] as any}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.grid}>

                {/* Top Row: Score + Vitals */}
                <View style={[styles.heroRow, isLargeScreen && styles.heroRowDesktop]}>
                    <View style={styles.heroColScore}>
                        <HealthScoreWidget score={summary?.health_score || 0} isLoading={loading} />
                    </View>
                    <View style={styles.heroColVitals}>
                        <QuickVitalsWidget summary={summary?.weight_summary} />
                    </View>
                </View>

                {/* Second Row: 2-column layout for large screens */}
                <View style={[styles.mainSection, isLargeScreen && styles.mainSectionDesktop]}>

                    {/* Left Col: Vaccines & Preventive */}
                    <View style={styles.column}>
                        <VaccinationCardWidget vaccinations={vaccinations} petId={petId} />
                        <PreventiveCareWidget treatments={preventiveCare} petId={petId} />
                    </View>

                    {/* Right Col: Meds & (Future) Conditions/Allergies */}
                    <View style={styles.column}>
                        <MedicationWidget medications={medications} petId={petId} />
                    </View>

                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    contentContainer: {
        padding: 24,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
    },
    contentMobile: {
        padding: 16,
    },
    centerContainer: {
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        color: '#6B7280',
        fontSize: 16,
    },
    grid: {
        gap: 24,
    },
    heroRow: {
        flexDirection: 'column',
        gap: 24,
    },
    heroRowDesktop: {
        flexDirection: 'row',
    },
    heroColScore: {
        flex: 1,
        maxWidth: 400,
    },
    heroColVitals: {
        flex: 2,
    },
    mainSection: {
        flexDirection: 'column',
        gap: 24,
    },
    mainSectionDesktop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    column: {
        flex: 1,
        gap: 24,
    },
});
