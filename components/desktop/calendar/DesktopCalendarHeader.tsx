import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addMonths, subMonths } from 'date-fns';
import { Pet } from '@/types';
import { EventType } from '@/hooks/useEvents';

interface DesktopCalendarHeaderProps {
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
    pets: Pet[];
    selectedPets: string[];
    onPetsChange: (ids: string[]) => void;
    selectedTypes: EventType[];
    onTypesChange: (types: EventType[]) => void;
}

export default function DesktopCalendarHeader({
    currentMonth,
    onMonthChange,
    pets,
    selectedPets,
    onPetsChange,
    selectedTypes,
    onTypesChange
}: DesktopCalendarHeaderProps) {
    const eventTypes: { id: EventType; label: string; icon: string }[] = [
        { id: 'vaccination', label: 'Vaccination', icon: 'bandage' },
        { id: 'checkup', label: 'Checkup', icon: 'medical' },
        { id: 'grooming', label: 'Grooming', icon: 'cut' },
        { id: 'medication', label: 'Medication', icon: 'medkit' },
        { id: 'surgery', label: 'Surgery', icon: 'bandage' },
        { id: 'training', label: 'Training', icon: 'school' },
    ];

    const togglePet = (id: string) => {
        if (selectedPets.includes(id)) {
            onPetsChange(selectedPets.filter(p => p !== id));
        } else {
            onPetsChange([...selectedPets, id]);
        }
    };

    const toggleType = (id: EventType) => {
        if (selectedTypes.includes(id)) {
            onTypesChange(selectedTypes.filter(t => t !== id));
        } else {
            onTypesChange([...selectedTypes, id]);
        }
    };

    return (
        <View style={styles.container}>
            {/* Month Navigation */}
            <View style={styles.leftSection}>
                <View style={styles.navigation}>
                    <TouchableOpacity 
                        style={styles.navButton} 
                        onPress={() => onMonthChange(subMonths(currentMonth, 1))}
                    >
                        <Ionicons name="chevron-back" size={20} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.monthTitle}>
                        {format(currentMonth, 'MMMM yyyy')}
                    </Text>
                    <TouchableOpacity 
                        style={styles.navButton} 
                        onPress={() => onMonthChange(addMonths(currentMonth, 1))}
                    >
                        <Ionicons name="chevron-forward" size={20} color="#1E293B" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Horizontal Filters */}
            <View style={styles.rightSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Pets:</Text>
                        <TouchableOpacity 
                            style={[styles.chip, selectedPets.length === 0 && styles.chipActive]}
                            onPress={() => onPetsChange([])}
                        >
                            <Text style={[styles.chipText, selectedPets.length === 0 && styles.chipTextActive]}>All</Text>
                        </TouchableOpacity>
                        {pets.map(pet => (
                            <TouchableOpacity
                                key={pet.id}
                                style={[styles.chip, selectedPets.includes(pet.id) && styles.chipActive]}
                                onPress={() => togglePet(pet.id)}
                            >
                                <Text style={[styles.chipText, selectedPets.includes(pet.id) && styles.chipTextActive]}>
                                    {pet.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.filterGroup}>
                        <Text style={styles.filterLabel}>Type:</Text>
                        {eventTypes.map(type => (
                            <TouchableOpacity
                                key={type.id}
                                style={[styles.chip, selectedTypes.includes(type.id) && styles.chipActive]}
                                onPress={() => toggleType(type.id)}
                            >
                                <Ionicons 
                                    name={type.icon as any} 
                                    size={14} 
                                    color={selectedTypes.includes(type.id) ? '#fff' : '#64748B'} 
                                    style={{ marginRight: 4 }}
                                />
                                <Text style={[styles.chipText, selectedTypes.includes(type.id) && styles.chipTextActive]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        zIndex: 10,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    navButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        minWidth: 140,
        textAlign: 'center',
    },
    rightSection: {
        flex: 1,
        marginLeft: 40,
    },
    filtersContainer: {
        alignItems: 'center',
        gap: 16,
    },
    filterGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginRight: 4,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },
    chipTextActive: {
        color: '#fff',
    },
});
