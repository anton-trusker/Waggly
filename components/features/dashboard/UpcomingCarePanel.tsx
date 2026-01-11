import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEvents } from '@/hooks/useEvents';
import { useAppTheme } from '@/hooks/useAppTheme';

type FilterType = 'all' | 'medical' | 'hygiene' | 'training';

interface UpcomingCarePanelProps {
    petId?: string;
}

const UpcomingCarePanel: React.FC<UpcomingCarePanelProps> = ({ petId }) => {
    const router = useRouter();
    const { theme } = useAppTheme();
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
        // Returns Material Icon name. We can map to SF symbols if IconSymbol supports it (it ignores proper mapping for now but we prepare logic)
        if (['vet', 'vaccination', 'medication'].includes(type || '')) return 'medical-services';
        if (['grooming'].includes(type || '')) return 'water-drop';
        if (['training', 'walking'].includes(type || '')) return 'school';
        return 'calendar-today';
    };

    const getEventIconIOS = (type?: string) => {
        if (['vet', 'vaccination', 'medication'].includes(type || '')) return 'cross.case.fill';
        if (['grooming'].includes(type || '')) return 'drop.fill';
        if (['training', 'walking'].includes(type || '')) return 'graduationcap.fill';
        return 'calendar';
    };

    const getEventColor = (type?: string) => {
        if (['vet', 'vaccination', 'medication'].includes(type || '')) return theme.colors.primary[500];
        if (['grooming'].includes(type || '')) return theme.colors.secondary.leaf;
        if (['training', 'walking'].includes(type || '')) return theme.colors.secondary.sunDark;
        return theme.colors.primary[400];
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, { color: theme.colors.text.primary }]}>Upcoming Care</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/calendar' as any)}>
                    <Text style={[styles.viewAllLink, { color: theme.colors.primary[500] }]}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filters}>
                {(['all', 'medical', 'hygiene'] as FilterType[]).map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterTab,
                            { backgroundColor: theme.colors.background.tertiary },
                            activeFilter === filter && { backgroundColor: theme.colors.primary[500] }
                        ]}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text style={[
                            styles.filterText,
                            { color: theme.colors.text.secondary },
                            activeFilter === filter && { color: '#FFFFFF' }
                        ]}>
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Events List */}
            <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <Text style={[styles.loadingText, { color: theme.colors.text.tertiary }]}>Loading...</Text>
                ) : filteredEvents.length === 0 ? (
                    <Text style={[styles.emptyText, { color: theme.colors.text.tertiary }]}>No upcoming events</Text>
                ) : (
                    filteredEvents.map((event) => {
                        const { month, day } = formatDate(event.dueDate);
                        return (
                            <TouchableOpacity
                                key={event.id}
                                style={[
                                    styles.eventCard,
                                    {
                                        backgroundColor: theme.colors.background.secondary,
                                        borderColor: theme.colors.border.primary
                                    }
                                ]}
                                onPress={() => router.push('/(tabs)/calendar' as any)}
                            >
                                {/* Date Badge */}
                                <View style={[
                                    styles.dateBadge,
                                    {
                                        backgroundColor: theme.colors.background.tertiary,
                                        borderColor: theme.colors.border.primary
                                    }
                                ]}>
                                    <Text style={[styles.dateMonth, { color: theme.colors.text.secondary }]}>{month}</Text>
                                    <Text style={[styles.dateDay, { color: theme.colors.text.primary }]}>{day}</Text>
                                </View>

                                {/* Event Info */}
                                <View style={styles.eventInfo}>
                                    <View style={styles.eventHeader}>
                                        <IconSymbol
                                            android_material_icon_name={getEventIcon(event.type) as any}
                                            ios_icon_name={getEventIconIOS(event.type) as any}
                                            size={16}
                                            color={getEventColor(event.type)}
                                        />
                                        <Text style={[styles.eventTitle, { color: theme.colors.text.primary }]}>{event.title}</Text>
                                    </View>
                                    {event.location && (
                                        <Text style={[styles.eventLocation, { color: theme.colors.text.secondary }]}>📍 {event.location}</Text>
                                    )}
                                    <Text style={[styles.eventTime, { color: theme.colors.text.tertiary }]}>{formatTime(event.dueDate)}</Text>
                                </View>

                                {/* Chevron */}
                                <IconSymbol
                                    android_material_icon_name="chevron-right"
                                    ios_icon_name="chevron.right"
                                    size={20}
                                    color={theme.colors.text.quaternary}
                                />
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
        fontFamily: 'Plus Jakarta Sans',
    },
    viewAllLink: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
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
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
    eventsList: {
        maxHeight: 400,
    },
    loadingText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 20,
        fontFamily: 'Plus Jakarta Sans',
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 20,
        fontFamily: 'Plus Jakarta Sans',
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    dateBadge: {
        width: 56,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    dateMonth: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        fontFamily: 'Plus Jakarta Sans',
    },
    dateDay: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
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
        fontFamily: 'Plus Jakarta Sans',
    },
    eventLocation: {
        fontSize: 13,
        marginBottom: 2,
        fontFamily: 'Plus Jakarta Sans',
    },
    eventTime: {
        fontSize: 12,
        fontFamily: 'Plus Jakarta Sans',
    },
});

export default UpcomingCarePanel;
