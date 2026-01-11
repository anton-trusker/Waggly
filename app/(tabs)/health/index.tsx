import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';
import { useHealthDashboard, HealthEvent } from '@/hooks/useHealthDashboard';
import { useRouter } from 'expo-router';
import HealthEventSelectorModal from '@/components/features/health/HealthEventSelectorModal';
import PetSelectorModal from '@/components/features/pets/PetSelectorModal';
import VaccinationFormModal from '@/components/features/health/VaccinationFormModal';
import VisitFormModal from '@/components/features/health/VisitFormModal';
import MedicationFormModal from '@/components/features/health/MedicationFormModal';

import WeightFormModal from '@/components/features/health/WeightFormModal';

export default function HealthDashboard() {
    const router = useRouter();
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState('all');
    const {
        recentEvents,
        upcomingEvents,
        activeTreatments,
        loading: healthLoading,
        refresh
    } = useHealthDashboard(selectedPetId);

    const getEventIcon = (type: HealthEvent['type']) => {
        switch (type) {
            case 'vaccination': return { icon: 'medical', color: '#10B981', bg: '#D1FAE5' };
            case 'visit': return { icon: 'fitness', color: '#6366F1', bg: '#E0E7FF' };
            case 'treatment': return { icon: 'bandage', color: '#F59E0B', bg: '#FDE68A' };
            case 'weight': return { icon: 'scale', color: '#8B5CF6', bg: '#EDE9FE' };
            default: return { icon: 'calendar', color: '#6B7280', bg: '#F3F4F6' };
        }
    };

    const renderEventCard = (event: HealthEvent) => {
        const { icon, color, bg } = getEventIcon(event.type);
        return (
            <View key={event.id} style={styles.eventCard}>
                <View style={[styles.eventIcon, { backgroundColor: bg }]}>
                    <Ionicons name={icon as any} size={24} color={color} />
                </View>
                <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.eventMeta}>
                        <Text style={styles.eventPet}>{event.pet_name}</Text>
                        <Text style={styles.eventDate}>{new Date(event.date).toLocaleDateString()}</Text>
                    </View>
                </View>
                {event.status === 'upcoming' && (
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Due Soon</Text>
                    </View>
                )}
            </View>
        );
    };

    const [targetPetId, setTargetPetId] = useState<string | null>(null);
    const [modals, setModals] = useState({
        petSelector: false,
        eventSelector: false,
        vaccination: false,
        visit: false,
        treatment: false,
        weight: false,
    });

    const handleLogHealthEvent = () => {
        if (selectedPetId && selectedPetId !== 'all') {
            setTargetPetId(selectedPetId);
            setModals({ ...modals, eventSelector: true });
        } else {
            setModals({ ...modals, petSelector: true });
        }
    };

    const handlePetSelect = (petId: string) => {
        setTargetPetId(petId);
        setModals({ ...modals, petSelector: false, eventSelector: true });
    };

    const handleEventSelect = (type: 'vaccination' | 'visit' | 'treatment' | 'weight' | 'medication') => {
        if (type === 'medication') {
            setModals({
                ...modals,
                eventSelector: false,
                treatment: true,
            });
            return;
        }
        setModals({
            ...modals,
            eventSelector: false,
            [type]: true,
        });
    };

    const handleSuccess = () => {
        refresh();
    };

    const closeAllModals = () => {
        setModals({
            petSelector: false,
            eventSelector: false,
            vaccination: false,
            visit: false,
            treatment: false,
            weight: false,
        });
        // Don't reset targetPetId immediately to avoid UI flicker slightly, or do it
    };

    return (
        <View style={styles.container}>
            {/* ... Header ... */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Health Dashboard</Text>
                    <Text style={styles.subtitle}>Overview of your pets' health and wellness</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => refresh()}>
                        <Ionicons name="refresh" size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleLogHealthEvent}>
                        <Ionicons name="add" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Log Health Event</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                {/* Sidebar */}
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>Pets</Text>
                    <TouchableOpacity
                        style={[
                            styles.filterItem,
                            selectedPetId === 'all' && styles.filterItemActive,
                        ]}
                        onPress={() => setSelectedPetId('all')}
                    >
                        <Ionicons
                            name="paw"
                            size={20}
                            color={selectedPetId === 'all' ? '#6366F1' : '#6B7280'}
                        />
                        <Text style={[
                            styles.filterText,
                            selectedPetId === 'all' && styles.filterTextActive,
                        ]}>
                            All Pets
                        </Text>
                    </TouchableOpacity>

                    {pets.map((pet) => (
                        <TouchableOpacity
                            key={pet.id}
                            style={[
                                styles.filterItem,
                                selectedPetId === pet.id && styles.filterItemActive,
                            ]}
                            onPress={() => setSelectedPetId(pet.id)}
                        >
                            <Ionicons
                                name="paw-outline"
                                size={20}
                                color={selectedPetId === pet.id ? '#6366F1' : '#6B7280'}
                            />
                            <Text style={[
                                styles.filterText,
                                selectedPetId === pet.id && styles.filterTextActive,
                            ]} numberOfLines={1}>
                                {pet.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Main Content */}
                <ScrollView
                    style={styles.main}
                    contentContainerStyle={styles.mainContent}
                    refreshControl={<RefreshControl refreshing={healthLoading} onRefresh={refresh} />}
                >
                    {/* Stats Overview */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
                                <Ionicons name="medical" size={24} color="#10B981" />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{upcomingEvents.filter(e => e.type === 'vaccination').length}</Text>
                                <Text style={styles.statLabel}>Vaccines Due</Text>
                            </View>
                        </View>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#FDE68A' }]}>
                                <Ionicons name="bandage" size={24} color="#F59E0B" />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{activeTreatments.length}</Text>
                                <Text style={styles.statLabel}>Active Treatments</Text>
                            </View>
                        </View>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#E0E7FF' }]}>
                                <Ionicons name="calendar" size={24} color="#6366F1" />
                            </View>
                            <View>
                                <Text style={styles.statValue}>{upcomingEvents.length}</Text>
                                <Text style={styles.statLabel}>Upcoming Tasks</Text>
                            </View>
                        </View>
                    </View>

                    {/* Upcoming Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Upcoming</Text>
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map(renderEventCard)
                        ) : (
                            <Text style={styles.emptyText}>No upcoming health tasks.</Text>
                        )}
                    </View>

                    {/* Recent History Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recent History</Text>
                        {recentEvents.length > 0 ? (
                            recentEvents.map(renderEventCard)
                        ) : (
                            <Text style={styles.emptyText}>No recent health history recorded.</Text>
                        )}
                    </View>

                </ScrollView>
            </View>

            {/* Modals */}
            <PetSelectorModal
                visible={modals.petSelector}
                onClose={() => setModals({ ...modals, petSelector: false })}
                onSelect={handlePetSelect}
            />

            <HealthEventSelectorModal
                visible={modals.eventSelector}
                onClose={() => setModals({ ...modals, eventSelector: false })}
                onSelect={handleEventSelect}
            />

            {targetPetId && (
                <>
                    <VaccinationFormModal
                        visible={modals.vaccination}
                        onClose={closeAllModals}
                        petId={targetPetId}
                        onSuccess={handleSuccess}
                    />
                    <VisitFormModal
                        visible={modals.visit}
                        onClose={closeAllModals}
                        petId={targetPetId}
                        onSuccess={handleSuccess}
                    />
                    <MedicationFormModal
                        visible={modals.treatment}
                        onClose={closeAllModals}
                        petId={targetPetId}
                        onSuccess={handleSuccess}
                    />

                    <WeightFormModal
                        visible={modals.weight}
                        onClose={closeAllModals}
                        petId={targetPetId}
                        onSuccess={handleSuccess}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    actionButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#6366F1',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: 240,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        padding: 16,
    },
    sidebarTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 4,
    },
    filterItemActive: {
        backgroundColor: '#F0F6FF',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#6366F1',
    },
    main: {
        flex: 1,
    },
    mainContent: {
        padding: 32,
        gap: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 16,
    },
    eventIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventContent: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    eventPet: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6366F1',
    },
    eventDate: {
        fontSize: 14,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#FEF3C7',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#D97706',
    },
    emptyText: {
        color: '#9CA3AF',
        fontStyle: 'italic',
    }
});
