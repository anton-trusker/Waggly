import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PetCardDesktop from '@/components/desktop/dashboard/PetCardDesktop';
import QuickActionsGrid from '@/components/desktop/dashboard/QuickActionsGrid';
import UpcomingCarePanel from '@/components/desktop/dashboard/UpcomingCarePanel';
import PriorityAlertsPanel from '@/components/desktop/dashboard/PriorityAlertsPanel';
import ActivityFeedTimeline from '@/components/desktop/dashboard/ActivityFeedTimeline';
import { usePets } from '@/hooks/usePets';

export default function DashboardPage() {
    const router = useRouter();
    const { pets, loading } = usePets();

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                {/* Main Column (8/12) */}
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
                            <TouchableOpacity onPress={() => router.push('/web/pets' as any)}>
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
                                    style={styles.addButton}
                                    onPress={() => router.push('/web/pets/add' as any)}
                                >
                                    <Ionicons name="add" size={20} color="#fff" />
                                    <Text style={styles.addButtonText}>Add Your First Pet</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.petGrid}>
                                {pets.slice(0, 3).map((pet) => (
                                    <View key={pet.id} style={styles.petCardWrapper}>
                                        <PetCardDesktop pet={pet} />
                                    </View>
                                ))}
                                {pets.length < 3 && (
                                    <TouchableOpacity
                                        style={styles.addPetCard}
                                        onPress={() => router.push('/web/pets/add' as any)}
                                    >
                                        <View style={styles.addPetIconContainer}>
                                            <Ionicons name="add" size={32} color="#6366F1" />
                                        </View>
                                        <Text style={styles.addPetText}>Add New Pet</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Quick Actions */}
                    <QuickActionsGrid />

                    {/* Upcoming Care */}
                    <UpcomingCarePanel />
                </View>

                {/* Sidebar Column (4/12) */}
                <View style={styles.sidebarColumn}>
                    {/* Priority Alerts */}
                    <PriorityAlertsPanel />

                    {/* Activity Feed */}
                    <ActivityFeedTimeline />
                </View>
            </View>
        </ScrollView>
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
    mainColumn: {
        flex: 2,
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
    },
    viewAllLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    loadingText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingVertical: 40,
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
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        maxWidth: 400,
        marginBottom: 24,
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
    },
    petGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    petCardWrapper: {
        width: 'calc(33.333% - 14px)' as any,
        minWidth: 250,
    },
    addPetCard: {
        width: 'calc(33.333% - 14px)' as any,
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
    },
});
