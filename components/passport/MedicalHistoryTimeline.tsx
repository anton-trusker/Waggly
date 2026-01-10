import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import type { MedicalEvent } from '@/types/passport';
import { MedicalEventType } from '@/types/passport';

interface MedicalHistoryTimelineProps {
    events: MedicalEvent[];
}

export const MedicalHistoryTimeline: React.FC<MedicalHistoryTimelineProps> = ({ events }) => {
    const [limit, setLimit] = useState(5);
    const displayedEvents = events.slice(0, limit);
    const hasMore = events.length > limit;

    const getIconName = (type: MedicalEventType): keyof typeof Ionicons.glyphMap => {
        switch (type) {
            case MedicalEventType.VACCINATION:
                return 'shield-checkmark';
            case MedicalEventType.CHECKUP:
                return 'medkit';
            case MedicalEventType.SURGERY:
                return 'bandage';
            case MedicalEventType.EMERGENCY:
                return 'alert-circle';
            case MedicalEventType.INCIDENT:
                return 'bandage';
            default:
                return 'calendar';
        }
    };

    const getIconColor = (type: MedicalEventType): string => {
        switch (type) {
            case MedicalEventType.VACCINATION:
                return designSystem.colors.primary[500]; // Secondary[500] doesn't exist as 500, use primary for now or leafDark
            case MedicalEventType.CHECKUP:
                return designSystem.colors.primary[500];
            case MedicalEventType.SURGERY:
                return designSystem.colors.error[500]; // Surgery is serious
            case MedicalEventType.EMERGENCY:
                return designSystem.colors.error[500];
            default:
                return designSystem.colors.text.secondary;
        }
    };

    if (events.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="time-outline" size={24} color={designSystem.colors.primary[500]} />
                    <Text style={styles.title}>Medical History</Text>
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No medical history recorded yet.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Ionicons name="time-outline" size={24} color={designSystem.colors.primary[500]} />
                    <Text style={styles.title}>Medical History</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{events.length} Events</Text>
                </View>
            </View>

            <View style={styles.timelineContainer}>
                {displayedEvents.map((event, index) => {
                    const isLast = index === displayedEvents.length - 1;
                    const date = new Date(event.eventDate);
                    const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                        <View key={event.id} style={styles.timelineItem}>
                            {/* Left: Date */}
                            <View style={styles.dateColumn}>
                                <Text style={styles.dateText}>{dateString}</Text>
                            </View>

                            {/* Middle: Line and Dot */}
                            <View style={styles.lineMeasure}>
                                <View style={[styles.dot, { backgroundColor: getIconColor(event.eventType) }]}>
                                    <Ionicons name={getIconName(event.eventType)} size={12} color="white" />
                                </View>
                                {!isLast && <View style={styles.line} />}
                            </View>

                            {/* Right: Content */}
                            <View style={[styles.card, isLast && styles.lastCard]}>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventDescription} numberOfLines={2}>
                                    {event.description}
                                </Text>
                                {(event.veterinarian || event.clinic) && (
                                    <View style={styles.metaContainer}>
                                        {event.clinic && (
                                            <View style={styles.metaItem}>
                                                <Ionicons name="location-outline" size={12} color={designSystem.colors.text.secondary} />
                                                <Text style={styles.metaText}>{event.clinic}</Text>
                                            </View>
                                        )}
                                        {event.veterinarian && (
                                            <View style={styles.metaItem}>
                                                <Ionicons name="person-outline" size={12} color={designSystem.colors.text.secondary} />
                                                <Text style={styles.metaText}>{event.veterinarian}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>

            {hasMore && (
                <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={() => setLimit(prev => prev + 5)}
                >
                    <Text style={styles.showMoreText}>Show Older History</Text>
                    <Ionicons name="chevron-down" size={16} color={designSystem.colors.primary[500]} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius['2xl'],
        padding: designSystem.spacing[5],
        marginBottom: designSystem.spacing[4],
        ...designSystem.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: designSystem.spacing[6],
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[2],
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    badge: {
        backgroundColor: designSystem.colors.background.tertiary,
        paddingHorizontal: designSystem.spacing[3],
        paddingVertical: designSystem.spacing[1.5],
        borderRadius: designSystem.borderRadius.full,
    },
    badgeText: {
        color: designSystem.colors.primary[600],
        fontSize: 12,
        fontWeight: '600',
    },
    timelineContainer: {
        marginLeft: 8,
    },
    timelineItem: {
        flexDirection: 'row',
        minHeight: 80,
    },
    dateColumn: {
        width: 85,
        alignItems: 'flex-end',
        paddingRight: 12,
        paddingTop: 2,
    },
    dateText: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
        fontWeight: '500',
    },
    lineMeasure: {
        alignItems: 'center',
        width: 24,
    },
    dot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: designSystem.colors.border.primary,
        marginVertical: 4,
    },
    card: {
        flex: 1,
        marginLeft: 12,
        paddingBottom: 24,
    },
    lastCard: {
        paddingBottom: 0,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
        marginBottom: designSystem.spacing[1],
    },
    eventDescription: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        marginBottom: designSystem.spacing[2],
        lineHeight: 20,
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: designSystem.spacing[3],
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[1],
    },
    metaText: {
        fontSize: 12,
        color: designSystem.colors.text.secondary,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: designSystem.colors.text.secondary,
        fontSize: 14,
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        paddingVertical: 8,
        gap: 4,
    },
    showMoreText: {
        color: designSystem.colors.primary[500],
        fontSize: 14,
        fontWeight: '600',
    },
});
