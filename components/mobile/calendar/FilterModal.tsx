import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    pets: any[];
    filters: any;
    setFilters: (filters: any) => void;
}

export default function FilterModal({ visible, onClose, onApply, pets, filters, setFilters }: FilterModalProps) {
    const eventTypes = [
        { id: 'vaccination', label: 'Vaccination', icon: 'bandage' },
        { id: 'checkup', label: 'Checkup', icon: 'medical' },
        { id: 'grooming', label: 'Grooming', icon: 'cut' },
        { id: 'medication', label: 'Medication', icon: 'medkit' },
        { id: 'surgery', label: 'Surgery', icon: 'bandage' },
        { id: 'training', label: 'Training', icon: 'school' },
    ];

    const statuses = ['Upcoming', 'Completed', 'Missed'];

    const togglePet = (petId: string) => {
        const current = filters.petIds || [];
        if (current.includes(petId)) {
            setFilters({ ...filters, petIds: current.filter((id: string) => id !== petId) });
        } else {
            setFilters({ ...filters, petIds: [...current, petId] });
        }
    };

    const toggleType = (typeId: string) => {
        const current = filters.types || [];
        if (current.includes(typeId)) {
            setFilters({ ...filters, types: current.filter((id: string) => id !== typeId) });
        } else {
            setFilters({ ...filters, types: [...current, typeId] });
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Filter Options</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#1E293B" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Which Pet? */}
                    {pets.length > 1 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Which Pet?</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petsRow}>
                                <TouchableOpacity 
                                    style={styles.petItem} 
                                    onPress={() => setFilters({ ...filters, petIds: [] })}
                                >
                                    <View style={[styles.petAvatar, (!filters.petIds || filters.petIds.length === 0) && styles.petAvatarActive]}>
                                        <Ionicons name="paw" size={24} color={(!filters.petIds || filters.petIds.length === 0) ? '#fff' : '#64748B'} />
                                    </View>
                                    <Text style={[styles.petName, (!filters.petIds || filters.petIds.length === 0) && styles.petNameActive]}>All Pets</Text>
                                </TouchableOpacity>
                                
                                {pets.map((pet) => {
                                    const isSelected = filters.petIds?.includes(pet.id);
                                    return (
                                        <TouchableOpacity key={pet.id} style={styles.petItem} onPress={() => togglePet(pet.id)}>
                                            <View style={[styles.petAvatar, isSelected && styles.petAvatarActive]}>
                                                {pet.photo_url ? (
                                                    <Image source={{ uri: pet.photo_url }} style={styles.avatarImage} />
                                                ) : (
                                                    <Text style={{ fontSize: 20 }}>{pet.species === 'cat' ? '🐈' : '🐕'}</Text>
                                                )}
                                                {isSelected && (
                                                    <View style={styles.checkBadge}>
                                                        <Ionicons name="checkmark" size={10} color="#fff" />
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={[styles.petName, isSelected && styles.petNameActive]}>{pet.name}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    )}

                    {/* Event Type */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Event Type</Text>
                            <TouchableOpacity onPress={() => setFilters({ ...filters, types: eventTypes.map(t => t.id) })}>
                                <Text style={styles.selectLink}>Select All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.chipsContainer}>
                            {eventTypes.map((type) => {
                                const isSelected = filters.types?.includes(type.id);
                                return (
                                    <TouchableOpacity 
                                        key={type.id} 
                                        style={[styles.chip, isSelected && styles.chipActive]}
                                        onPress={() => toggleType(type.id)}
                                    >
                                        <Ionicons name={type.icon as any} size={16} color={isSelected ? '#fff' : '#64748B'} />
                                        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{type.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Date Range (Simplified UI) */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Date Range</Text>
                        <View style={styles.dateRow}>
                            <View style={styles.dateInput}>
                                <Text style={styles.dateLabel}>Start Date</Text>
                                <View style={styles.dateValue}>
                                    <Ionicons name="calendar-outline" size={20} color="#64748B" />
                                    <Text style={styles.dateText}>Oct 12, 2023</Text>
                                </View>
                            </View>
                            <View style={styles.dateInput}>
                                <Text style={styles.dateLabel}>End Date</Text>
                                <View style={styles.dateValue}>
                                    <Ionicons name="calendar-outline" size={20} color="#64748B" />
                                    <Text style={styles.dateText}>Nov 12, 2023</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Status */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Status</Text>
                        <View style={styles.statusRow}>
                            {statuses.map((status) => {
                                const isSelected = filters.status === status;
                                return (
                                    <TouchableOpacity 
                                        key={status} 
                                        style={[styles.statusTab, isSelected && styles.statusTabActive]}
                                        onPress={() => setFilters({ ...filters, status })}
                                    >
                                        <Text style={[styles.statusText, isSelected && styles.statusTextActive]}>{status}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.applyButton} onPress={() => { onApply(filters); onClose(); }}>
                        <Text style={styles.applyButtonText}>Show Results</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 16,
    },
    selectLink: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: '600',
    },
    petsRow: {
        gap: 20,
        paddingRight: 20,
    },
    petItem: {
        alignItems: 'center',
        gap: 8,
    },
    petAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    petAvatarActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    checkBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3B82F6',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    petName: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    petNameActive: {
        color: '#3B82F6',
        fontWeight: '700',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        width: '48%',
    },
    chipActive: {
        backgroundColor: '#3B82F6',
    },
    chipText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#fff',
    },
    dateRow: {
        flexDirection: 'row',
        gap: 16,
    },
    dateInput: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 8,
    },
    dateValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dateText: {
        fontSize: 14,
        color: '#1E293B',
    },
    statusRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statusTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
    },
    statusTabActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statusText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    statusTextActive: {
        color: '#1E293B',
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    applyButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
