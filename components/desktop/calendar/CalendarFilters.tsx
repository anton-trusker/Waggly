import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';

interface CalendarFiltersProps {
    selectedPets: string[];
    selectedTypes: string[];
    onPetsChange: (petIds: string[]) => void;
    onTypesChange: (types: string[]) => void;
}

const EVENT_TYPES = [
    { id: 'medical', label: 'Medical', icon: 'medical', color: '#6366F1' },
    { id: 'grooming', label: 'Grooming', icon: 'cut', color: '#10B981' },
    { id: 'training', label: 'Training', icon: 'school', color: '#F59E0B' },
    { id: 'feeding', label: 'Feeding', icon: 'restaurant', color: '#EC4899' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: '#8B5CF6' },
];

const CalendarFilters: React.FC<CalendarFiltersProps> = ({
    selectedPets,
    selectedTypes,
    onPetsChange,
    onTypesChange,
}) => {
    const { pets } = usePets();
    const [showAllPets, setShowAllPets] = useState(false);

    const togglePet = (petId: string) => {
        if (selectedPets.includes(petId)) {
            onPetsChange(selectedPets.filter(id => id !== petId));
        } else {
            onPetsChange([...selectedPets, petId]);
        }
    };

    const toggleType = (typeId: string) => {
        if (selectedTypes.includes(typeId)) {
            onTypesChange(selectedTypes.filter(id => id !== typeId));
        } else {
            onTypesChange([...selectedTypes, typeId]);
        }
    };

    const selectAllPets = () => {
        onPetsChange(pets.map(p => p.id));
    };

    const deselectAllPets = () => {
        onPetsChange([]);
    };

    const visiblePets = showAllPets ? pets : pets.slice(0, 5);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Filter by Pet */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Filter by Pet</Text>
                    <View style={styles.selectButtons}>
                        <TouchableOpacity onPress={selectAllPets}>
                            <Text style={styles.selectButtonText}>All</Text>
                        </TouchableOpacity>
                        <Text style={styles.selectDivider}>|</Text>
                        <TouchableOpacity onPress={deselectAllPets}>
                            <Text style={styles.selectButtonText}>None</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.filterList}>
                    {visiblePets.map((pet) => (
                        <TouchableOpacity
                            key={pet.id}
                            style={styles.filterItem}
                            onPress={() => togglePet(pet.id)}
                        >
                            <View style={styles.checkbox}>
                                {selectedPets.includes(pet.id) && (
                                    <Ionicons name="checkmark" size={16} color="#6366F1" />
                                )}
                            </View>
                            {pet.photo_url ? (
                                <Image source={{ uri: pet.photo_url }} style={styles.petAvatar} />
                            ) : (
                                <View style={styles.petAvatarPlaceholder}>
                                    <Ionicons name="paw" size={12} color="#6366F1" />
                                </View>
                            )}
                            <Text style={styles.filterLabel}>{pet.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {pets.length > 5 && (
                    <TouchableOpacity
                        style={styles.showMoreButton}
                        onPress={() => setShowAllPets(!showAllPets)}
                    >
                        <Text style={styles.showMoreText}>
                            {showAllPets ? 'Show Less' : `Show ${pets.length - 5} More`}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Event Type */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Event Type</Text>
                <View style={styles.filterList}>
                    {EVENT_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            style={styles.filterItem}
                            onPress={() => toggleType(type.id)}
                        >
                            <View style={styles.checkbox}>
                                {selectedTypes.includes(type.id) && (
                                    <Ionicons name="checkmark" size={16} color="#6366F1" />
                                )}
                            </View>
                            <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                                <Ionicons name={type.icon as any} size={14} color={type.color} />
                            </View>
                            <Text style={styles.filterLabel}>{type.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Upcoming Events Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                <View style={styles.upcomingList}>
                    <Text style={styles.upcomingText}>
                        {selectedPets.length} pets selected
                    </Text>
                    <Text style={styles.upcomingText}>
                        {selectedTypes.length} event types selected
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    selectButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    selectButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
    },
    selectDivider: {
        fontSize: 12,
        color: '#D1D5DB',
    },
    filterList: {
        gap: 8,
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    petAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    petAvatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeIcon: {
        width: 24,
        height: 24,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterLabel: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
    },
    showMoreButton: {
        marginTop: 8,
        paddingVertical: 8,
    },
    showMoreText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6366F1',
        textAlign: 'center',
    },
    upcomingList: {
        gap: 4,
    },
    upcomingText: {
        fontSize: 13,
        color: '#6B7280',
    },
});

export default CalendarFilters;
