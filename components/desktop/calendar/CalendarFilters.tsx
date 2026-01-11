import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';
import type { EventType } from '@/hooks/useEvents';
import { useLocale } from '@/hooks/useLocale';

interface CalendarFiltersProps {
    selectedPets: string[];
    selectedTypes: EventType[];
    onPetsChange: (petIds: string[]) => void;
    onTypesChange: (types: EventType[]) => void;
}

const EVENT_TYPES: { id: EventType; labelKey: string; icon: string; color: string }[] = [
    { id: 'vaccination', labelKey: 'vaccination', icon: 'medkit', color: '#0EA5E9' },
    { id: 'treatment', labelKey: 'treatment', icon: 'bandage', color: '#F59E0B' },
    { id: 'vet', labelKey: 'vet', icon: 'medkit', color: '#10B981' },
    { id: 'grooming', labelKey: 'grooming', icon: 'cut', color: '#06B6D4' },
    { id: 'walking', labelKey: 'walking', icon: 'walk', color: '#A855F7' },
    { id: 'other', labelKey: 'other', icon: 'ellipsis-horizontal', color: '#8B5CF6' },
];

const CalendarFilters: React.FC<CalendarFiltersProps> = ({
    selectedPets,
    selectedTypes,
    onPetsChange,
    onTypesChange,
}) => {
    const { pets } = usePets();
    const { t } = useLocale();
    const [showAllPets, setShowAllPets] = useState(false);

    const togglePet = (petId: string) => {
        if (selectedPets.includes(petId)) {
            onPetsChange(selectedPets.filter(id => id !== petId));
        } else {
            onPetsChange([...selectedPets, petId]);
        }
    };

    const toggleType = (typeId: EventType) => {
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
                    <Text style={styles.sectionTitle}>{t('calendar.filter_by_pet')}</Text>
                    <View style={styles.selectButtons}>
                        <TouchableOpacity onPress={selectAllPets}>
                            <Text style={styles.selectButtonText}>{t('calendar.all')}</Text>
                        </TouchableOpacity>
                        <Text style={styles.selectDivider}>|</Text>
                        <TouchableOpacity onPress={deselectAllPets}>
                            <Text style={styles.selectButtonText}>{t('calendar.none')}</Text>
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
                                    <Ionicons name="checkmark" size={16} color="#0EA5E9" />
                                )}
                            </View>
                            {pet.photo_url ? (
                                <Image source={{ uri: pet.photo_url }} style={styles.petAvatar} />
                            ) : (
                                <View style={styles.petAvatarPlaceholder}>
                                    <Ionicons name="paw" size={12} color="#0EA5E9" />
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
                            {showAllPets ? t('calendar.show_less') : t('calendar.show_more', { count: pets.length - 5 })}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Event Type */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('calendar.event_type_title')}</Text>
                <View style={styles.filterList}>
                    {EVENT_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            style={styles.filterItem}
                            onPress={() => toggleType(type.id)}
                        >
                            <View style={styles.checkbox}>
                                {selectedTypes.includes(type.id) && (
                                    <Ionicons name="checkmark" size={16} color="#0EA5E9" />
                                )}
                            </View>
                            <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                                <Ionicons name={type.icon as any} size={14} color={type.color} />
                            </View>
                            <Text style={styles.filterLabel}>{t(`calendar.event_types.${type.labelKey}`)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Upcoming Events Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('calendar.upcoming_summary')}</Text>
                <View style={styles.upcomingList}>
                    <Text style={styles.upcomingText}>
                        {t('calendar.pets_selected', { count: selectedPets.length })}
                    </Text>
                    <Text style={styles.upcomingText}>
                        {t('calendar.types_selected', { count: selectedTypes.length })}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

// Completely redefined styles to avoid any uninitialized variable issues
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
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
        alignItems: 'center',
        gap: 8,
    },
    selectButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0EA5E9',
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
        backgroundColor: '#F0F9FF',
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
        alignItems: 'center',
    },
    showMoreText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0EA5E9',
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
