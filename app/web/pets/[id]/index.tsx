import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import DocumentsTabDesktop from '@/components/desktop/pets/tabs/DocumentsTabDesktop';
import HealthTabDesktop from '@/components/desktop/pets/tabs/HealthTabDesktop';

export default function PetDetailsPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const petId = params.id as string;
    const { pets } = usePets();
    const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'album' | 'documents'>('overview');

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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#6B7280" />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    {canEdit && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push(`/web/pets/${petId}/edit` as any)}
                        >
                            <Ionicons name="create-outline" size={20} color="#6366F1" />
                            <Text style={styles.actionButtonText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="share-outline" size={20} color="#6366F1" />
                        <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Pet Header Card */}
            <View style={styles.petHeader}>
                <View style={styles.petInfo}>
                    {pet.photo_url ? (
                        <Image source={{ uri: pet.photo_url }} style={styles.petPhoto} />
                    ) : (
                        <View style={styles.petPhotoPlaceholder}>
                            <Ionicons name="paw" size={48} color="#6366F1" />
                        </View>
                    )}
                    <View style={styles.petMeta}>
                        <Text style={styles.petName}>{pet.name}</Text>
                        <Text style={styles.petBreed}>{pet.breed || pet.species}</Text>
                        <View style={styles.petStats}>
                            <View style={styles.stat}>
                                <Ionicons name="calendar" size={14} color="#6B7280" />
                                <Text style={styles.statText}>{getAge()}</Text>
                            </View>
                            <View style={styles.stat}>
                                <Ionicons name="male-female" size={14} color="#6B7280" />
                                <Text style={styles.statText}>{pet.gender || 'N/A'}</Text>
                            </View>
                            <View style={styles.stat}>
                                <Ionicons name="fitness" size={14} color="#6B7280" />
                                <Text style={styles.statText}>{pet.weight ? `${pet.weight} ${pet.weight_unit}` : 'N/A'}</Text>
                            </View>
                        </View>
                    </View>
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
            </View>

            {/* Tab Content */}
            <ScrollView style={styles.tabContent}>
                {activeTab === 'overview' && (
                    <View style={styles.overviewTab}>
                        <Text style={styles.sectionTitle}>Basic Information</Text>
                        <View style={styles.infoCard}>
                            {renderInfoRow('Species', pet.species)}
                            {renderInfoRow('Breed', pet.breed)}
                            {renderInfoRow('Color', pet.color)}
                            {renderInfoRow('Date of Birth', pet.birth_date)}
                            {renderInfoRow('Microchip', pet.chip_number)}
                        </View>

                        {/* Notes are not currently in schema, hiding for now */}
                        {/* {pet.notes && (
                            <>
                                <Text style={styles.sectionTitle}>Notes</Text>
                                <View style={styles.infoCard}>
                                    <Text style={styles.notesText}>{pet.notes}</Text>
                                </View>
                            </>
                        )} */}
                    </View>
                )}

                {activeTab === 'health' && (
                    <HealthTabDesktop petId={petId} />
                )}

                {activeTab === 'album' && (
                    <View style={styles.albumTab}>
                        <Text style={styles.sectionTitle}>Photo Album</Text>
                        <View style={styles.emptyState}>
                            <Ionicons name="images-outline" size={48} color="#D1D5DB" />
                            <Text style={styles.emptyStateText}>No photos yet</Text>
                            <Text style={styles.emptyStateSubtext}>Upload photos of your pet</Text>
                        </View>
                    </View>
                )}

                {activeTab === 'documents' && (
                    <DocumentsTabDesktop petId={petId} />
                )}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    petHeader: {
        padding: 32,
        backgroundColor: '#fff',
    },
    petInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    petPhoto: {
        width: 120,
        height: 120,
        borderRadius: 16,
    },
    petPhotoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 16,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    petMeta: {
        flex: 1,
    },
    petName: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    petBreed: {
        fontSize: 18,
        color: '#6B7280',
        marginBottom: 16,
    },
    petStats: {
        flexDirection: 'row',
        gap: 24,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
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
        borderBottomColor: '#6366F1',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#6366F1',
    },
    tabContent: {
        flex: 1,
        padding: 32,
    },
    overviewTab: {
        gap: 24,
    },
    healthTab: {
        gap: 24,
    },
    albumTab: {
        gap: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    notesText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 64,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#D1D5DB',
        marginTop: 4,
    },
});
