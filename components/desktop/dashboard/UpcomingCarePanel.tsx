import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '@/hooks/useEvents';

type FilterType = 'all' | 'medical' | 'hygiene' | 'training';

interface UpcomingCarePanelProps {
    petId?: string;
}

const UpcomingCarePanel: React.FC<UpcomingCarePanelProps> = ({ petId }) => {
    const router = useRouter();
    const { events, loading } = useEvents({ petIds: petId ? [petId] : undefined });
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const upcomingEvents = events
        .filter(event => new Date(event.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

    const filteredEvents = activeFilter === 'all'
        ? upcomingEvents
        : upcomingEvents.filter(event => {
            if (activeFilter === 'medical') return ['vet', 'vaccination', 'medication'].includes(event.type);
            if (activeFilter === 'hygiene') return ['grooming'].includes(event.type);
            if (activeFilter === 'training') return ['training', 'walking'].includes(event.type);
            return false;
        });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = date.getDate();
        return { month, day };
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getEventIcon = (type?: string) => {
        if (['vet', 'vaccination', 'medication'].includes(type || '')) return 'medical';
        if (['grooming'].includes(type || '')) return 'water';
        if (['training', 'walking'].includes(type || '')) return 'school';
        return 'calendar';
    };

    const getEventColor = (type?: string) => {
        if (['vet', 'vaccination', 'medication'].includes(type || '')) return '#6366F1';
        if (['grooming'].includes(type || '')) return '#10B981';
        if (['training', 'walking'].includes(type || '')) return '#F59E0B';
        return '#8B5CF6';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Upcoming Care</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/calendar' as any)}>
                    <Text style={styles.viewAllLink}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filters}>
                {(['all', 'medical', 'hygiene'] as FilterType[]).map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Events List */}
            <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : filteredEvents.length === 0 ? (
                    <Text style={styles.emptyText}>No upcoming events</Text>
                ) : (
                    filteredEvents.map((event) => {
                        const { month, day } = formatDate(event.dueDate);
                        return (
                            <TouchableOpacity
                                key={event.id}
                                style={styles.eventCard}
                                onPress={() => router.push('/(tabs)/calendar' as any)}
                            >
                                {/* Date Badge */}
                                <View style={styles.dateBadge}>
                                    <Text style={styles.dateMonth}>{month}</Text>
                                    <Text style={styles.dateDay}>{day}</Text>
                                </View>

                                {/* Event Info */}
                                <View style={styles.eventInfo}>
                                    <View style={styles.eventHeader}>
                                        <Ionicons
                                            name={getEventIcon(event.type) as any}
                                            size={16}
                                            color={getEventColor(event.type)}
                                        />
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                    </View>
                                    {event.location && (
                                        <Text style={styles.eventLocation}>📍 {event.location}</Text>
                                    )}
                                    <Text style={styles.eventTime}>{formatTime(event.dueDate)}</Text>
                                </View>

                                {/* Chevron */}
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    viewAllLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    filters: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    filterTabActive: {
        backgroundColor: '#6366F1',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#fff',
    },
    eventsList: {
        maxHeight: 400,
    },
    loadingText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingVertical: 20,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    dateBadge: {
        width: 56,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dateMonth: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    dateDay: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    eventInfo: {
        flex: 1,
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    eventLocation: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 2,
    },
    eventTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});

export default UpcomingCarePanel;
