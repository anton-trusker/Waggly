import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Event } from '@/types';

interface PetUpcomingEventsWidgetProps {
    events: Event[];
    onViewAll?: () => void;
}

export default function PetUpcomingEventsWidget({ events, onViewAll }: PetUpcomingEventsWidgetProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Upcoming Events</Text>
                <TouchableOpacity onPress={onViewAll}>
                    <Text style={styles.editLink}>View All</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                {events.length > 0 ? (
                    events.map(event => (
                        <View key={event.id} style={styles.listItem}>
                            <View style={[styles.listIconBox, { backgroundColor: '#FEF3C7' }]}>
                                <IconSymbol android_material_icon_name="event" size={20} color="#D97706" />
                            </View>
                            <View style={styles.listItemContent}>
                                <Text style={styles.listItemTitle}>{event.title}</Text>
                                <Text style={styles.listItemSubtitle}>
                                    {new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No upcoming events</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    editLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    listIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    listItemSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingVertical: 16,
    },
});
