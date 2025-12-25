import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import OverviewTab from './overview';
import HealthTab from './health';
import AlbumTab from './album';
import DocumentsTab from './documents';
import NutritionTab from './nutrition';

export default function PetDetailsPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const petId = params.id as string;
    const { pets } = usePets();
    const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'album' | 'documents' | 'nutrition'>('overview');

    const pet = pets.find(p => p.id === petId);

    if (!pet) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>Loading pet details...</Text>
            </View>
        );
    }

    const getAge = () => {
        if (!pet.birth_date) return 'Unknown';
        const birth = new Date(pet.birth_date);
        const now = new Date();
        const years = now.getFullYear() - birth.getFullYear();
        const months = now.getMonth() - birth.getMonth();
        if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
        return `${months} month${months > 1 ? 's' : ''}`;
    };

    const canEdit = pet.role !== 'viewer';

    return (
        <View style={styles.container}>
            {/* Pet Header Card - Matching Design */}
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
                            <View style={styles.statBadge}>
                                <Text style={styles.statBadgeText}>{getAge()}</Text>
                            </View>
                            <View style={[styles.statBadge, styles.genderBadge]}>
                                <Ionicons name={pet.gender === 'female' ? 'female' : 'male'} size={12} color="#EC4899" />
                                <Text style={styles.statBadgeText}>{pet.gender || 'N/A'}</Text>
                            </View>
                            <View style={styles.statBadge}>
                                <Ionicons name="barbell" size={12} color="#3B82F6" />
                                <Text style={styles.statBadgeText}>{pet.weight ? `${pet.weight} ${pet.weight_unit}` : 'N/A'}</Text>
                            </View>
                        </View>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={14} color="#6B7280" />
                            <Text style={styles.locationText}>Berlin, Germany</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.shareButton}>
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

            {/* Tabs */}
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
                    style={[styles.tab, activeTab === 'album' && styles.tabActive]}
                    onPress={() => setActiveTab('album')}
                >
                    <Text style={[styles.tabText, activeTab === 'album' && styles.tabTextActive]}>
                        Album
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
                    style={[styles.tab, activeTab === 'nutrition' && styles.tabActive]}
                    onPress={() => setActiveTab('nutrition')}
                >
                    <Text style={[styles.tabText, activeTab === 'nutrition' && styles.tabTextActive]}>
                        Nutrition
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <ScrollView style={styles.tabContent}>
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'health' && <HealthTab />}
                {activeTab === 'album' && <AlbumTab />}
                {activeTab === 'documents' && <DocumentsTab />}
                {activeTab === 'nutrition' && <NutritionTab />}
            </ScrollView>
        </View>
    );
}

const renderInfoRow = (label: string, value?: string | null) => {
    if (!value) return null;
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
};

// Events Tab Component
const PetEventsTab: React.FC<{ petId: string }> = ({ petId }) => {
    const { events, loading } = useEvents({ petIds: [petId] });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getEventIcon = (type?: string) => {
        switch (type) {
            case 'vaccination': return 'medical';
            case 'treatment': return 'medkit';
            case 'vet': return 'medical';
            case 'grooming': return 'cut';
            case 'walking': return 'walk';
            case 'feeding': return 'restaurant';
            default: return 'calendar';
        }
    };

    const getEventColor = (type?: string) => {
        switch (type) {
            case 'vaccination': return '#10B981';
            case 'treatment': return '#EC4899';
            case 'vet': return '#6366F1';
            case 'grooming': return '#10B981';
            case 'walking': return '#F59E0B';
            case 'feeding': return '#EC4899';
            default: return '#8B5CF6';
        }
    };

    if (loading) {
        return (
            <View style={styles.eventsTab}>
                <Text style={styles.loadingText}>Loading events...</Text>
            </View>
        );
    }

    if (events.length === 0) {
        return (
            <View style={styles.eventsTab}>
                <View style={styles.emptyState}>
                    <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.emptyStateText}>No events yet</Text>
                    <Text style={styles.emptyStateSubtext}>Add events to track your pet's care schedule</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.eventsTab}>
            {events.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                    <View style={[styles.eventIcon, { backgroundColor: getEventColor(event.type) + '20' }]}>
                        <Ionicons name={getEventIcon(event.type) as any} size={20} color={getEventColor(event.type)} />
                    </View>
                    <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventDate}>{formatDate(event.dueDate)}</Text>
                        {event.notes && <Text style={styles.eventNotes}>{event.notes}</Text>}
                    </View>
                </View>
            ))}
        </View>
    );
};

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
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    genderBadge: {
        backgroundColor: '#FCE7F3',
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
});
