
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '@/hooks/useEvents';
import { LinearGradient } from 'expo-linear-gradient';

interface EventsTabProps {
    petId: string;
}

export default function EventsTab({ petId }: EventsTabProps) {
    const router = useRouter();
    const { theme } = useAppTheme();
    const { events } = useEvents({ petIds: petId ? [petId] : [] });

    const upcomingEvents = events?.filter(e => new Date(e.date) > new Date()) || [];
    const pastEvents = events?.filter(e => new Date(e.date) <= new Date()) || [];

    const getEventIcon = (type?: string) => {
        switch (type) {
            case 'vaccination': return 'syringe';
            case 'treatment': return 'pills.fill';
            case 'vet': return 'stethoscope';
            case 'grooming': return 'scissors';
            case 'walking': return 'figure.walk';
            case 'feeding': return 'fork.knife';
            default: return 'calendar';
        }
    };

    const getMaterialIcon = (type?: string) => {
        switch (type) {
            case 'vaccination': return 'vaccines';
            case 'treatment': return 'medication';
            case 'vet': return 'medical-services';
            case 'grooming': return 'content-cut';
            case 'walking': return 'directions-walk';
            case 'feeding': return 'restaurant';
            default: return 'event';
        }
    };

    const getEventColor = (type?: string) => {
        switch (type) {
            case 'vaccination': return { bg: '#DCFCE7', text: '#16A34A', border: '#86EFAC' }; // green
            case 'treatment': return { bg: '#FCE7F3', text: '#DB2777', border: '#F9A8D4' }; // pink
            case 'vet': return { bg: '#DBEAFE', text: '#2563EB', border: '#93C5FD' }; // blue
            case 'grooming': return { bg: '#F3E8FF', text: '#9333EA', border: '#D8B4FE' }; // purple
            case 'walking': return { bg: '#FEF9C3', text: '#CA8A04', border: '#FDE047' }; // yellow
            case 'feeding': return { bg: '#FFEDD5', text: '#EA580C', border: '#FDBA74' }; // orange
            default: return { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' }; // gray
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>

                {/* Header / Add Button */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Events & Schedule</Text>
                        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>Manage appointments and activities.</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push(`/(tabs)/pets/events/new?petId=${petId}` as any)}
                    >
                        <Ionicons name="add-circle-outline" size={24} color="#6366F1" />
                        <Text style={styles.addButtonText}>Add Event</Text>
                    </TouchableOpacity>
                </View>

                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <IconSymbol name="calendar" android_material_icon_name="schedule" size={24} color={theme.colors.primary[500]} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Upcoming Events</Text>
                        </View>
                        <View style={styles.list}>
                            {upcomingEvents.map((event) => {
                                const daysUntil = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                const colors = getEventColor(event.type);

                                return (
                                    <View
                                        key={event.id}
                                        style={[
                                            styles.card,
                                            {
                                                backgroundColor: theme.colors.background.secondary, // Or use specific colors if desired, but consistent card bg is safer
                                                borderColor: colors.border,
                                                borderWidth: 1,
                                            }
                                        ]}
                                    >
                                        <View style={styles.cardContent}>
                                            <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
                                                <IconSymbol
                                                    name={getEventIcon(event.type) as any}
                                                    android_material_icon_name={getMaterialIcon(event.type) as any}
                                                    size={24}
                                                    color={colors.text}
                                                />
                                            </View>
                                            <View style={styles.cardDetails}>
                                                <View style={styles.cardHeader}>
                                                    <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>{event.title}</Text>
                                                    <Text style={[styles.daysUntil, { color: theme.colors.primary[600] }]}>
                                                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                                                    </Text>
                                                </View>
                                                <Text style={[styles.cardMeta, { color: theme.colors.text.secondary }]}>
                                                    {formatDate(event.date)} • {event.time || 'All day'}
                                                </Text>
                                                {event.location && (
                                                    <Text style={[styles.cardLocation, { color: theme.colors.text.tertiary }]}>{event.location}</Text>
                                                )}
                                                {event.notes && (
                                                    <Text style={[styles.cardNotes, { color: theme.colors.text.primary }]}>{event.notes}</Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Past Events */}
                {pastEvents.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <IconSymbol name="clock" android_material_icon_name="history" size={24} color={theme.colors.primary[500]} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Past Events</Text>
                        </View>
                        <View style={styles.list}>
                            {pastEvents.map((event) => {
                                const colors = getEventColor(event.type);
                                return (
                                    <View
                                        key={event.id}
                                        style={[
                                            styles.card,
                                            {
                                                backgroundColor: theme.colors.background.secondary,
                                                borderColor: theme.colors.border.secondary,
                                                borderWidth: 1,
                                            }
                                        ]}
                                    >
                                        <View style={styles.cardContent}>
                                            <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
                                                <IconSymbol
                                                    name={getEventIcon(event.type) as any}
                                                    android_material_icon_name={getMaterialIcon(event.type) as any}
                                                    size={24}
                                                    color={colors.text}
                                                />
                                            </View>
                                            <View style={styles.cardDetails}>
                                                <View style={styles.cardHeader}>
                                                    <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>{event.title}</Text>
                                                    <Text style={[styles.daysUntil, { color: theme.colors.text.tertiary }]}>
                                                        {formatDate(event.date)}
                                                    </Text>
                                                </View>
                                                <Text style={[styles.cardMeta, { color: theme.colors.text.secondary }]}>
                                                    {event.time || 'All day'}
                                                </Text>
                                                {event.location && (
                                                    <Text style={[styles.cardLocation, { color: theme.colors.text.tertiary }]}>{event.location}</Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Empty State */}
                {(!events || events.length === 0) && (
                    <View style={[styles.emptyState, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.secondary }]}>
                        <IconSymbol name="calendar" android_material_icon_name="event" size={48} color={theme.colors.text.tertiary} />
                        <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>No events yet</Text>
                        <Text style={[styles.emptyDesc, { color: theme.colors.text.secondary }]}>Add events to track your pet's care schedule</Text>
                        <TouchableOpacity
                            onPress={() => router.push(`/(tabs)/pets/events/new?petId=${petId}` as any)}
                            style={[styles.addButton, { backgroundColor: theme.colors.primary[500], marginTop: 16 }]}
                        >
                            <IconSymbol name="plus" android_material_icon_name="add" size={16} color="#fff" />
                            <Text style={styles.addButtonText}>Add First Event</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24, // Consistent padding
        gap: 32,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        gap: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    list: {
        gap: 12,
    },
    card: {
        borderRadius: 12,
        padding: 16,
    },
    cardContent: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardDetails: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    daysUntil: {
        fontSize: 14,
        fontWeight: '500',
    },
    cardMeta: {
        fontSize: 14,
        marginTop: 2,
    },
    cardLocation: {
        fontSize: 14,
        marginTop: 2,
    },
    cardNotes: {
        fontSize: 14,
        marginTop: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 12,
        borderWidth: 1,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptyDesc: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
});
