
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEvents } from '@/hooks/useEvents';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function DashboardUpcoming() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const { events } = useEvents();

    const upcomingEvents = events
        .filter(event => new Date(event.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3); // Show top 3

    const getEventIcon = (type?: string) => {
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
        if (['vet', 'vaccination', 'medication'].includes(type || '')) return '#EF4444'; // Red for medical
        if (['grooming'].includes(type || '')) return '#3B82F6'; // Blue for hygiene
        return '#F59E0B'; // Amber/Orange default
    };

    const getBgColor = (type?: string) => {
        if (['vet', 'vaccination', 'medication'].includes(type || '')) return '#FEE2E2';
        if (['grooming'].includes(type || '')) return '#DBEAFE';
        return '#FEF3C7';
    };

    return (
        <View style={[styles.container, { backgroundColor: '#fff', borderColor: theme.colors.border.primary }]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.orangeDot} />
                    <Text style={styles.heading}>Upcoming Care</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/(tabs)/calendar' as any)}>
                    <Text style={[styles.viewAllLink, { color: theme.colors.primary[500] }]}>See All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.list}>
                {upcomingEvents.length === 0 ? (
                    <Text style={styles.emptyText}>No upcoming events scheduled.</Text>
                ) : (
                    upcomingEvents.map((event) => {
                        const daysAway = Math.ceil((new Date(event.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        return (
                            <TouchableOpacity
                                key={event.id}
                                style={[styles.card, { borderColor: theme.colors.border.secondary }]}
                                onPress={() => router.push('/(tabs)/calendar' as any)}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={[styles.iconBox, { backgroundColor: getBgColor(event.type) }]}>
                                        <IconSymbol
                                            android_material_icon_name={getEventIcon(event.type) as any}
                                            ios_icon_name={getEventIconIOS(event.type) as any}
                                            size={20}
                                            color={getEventColor(event.type)}
                                        />
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: getBgColor(event.type) }]}>
                                        <Text style={[styles.badgeText, { color: getEventColor(event.type) }]}>
                                            {daysAway === 0 ? 'TODAY' : daysAway === 1 ? 'TOMORROW' : `${daysAway} DAYS`}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.cardContent}>
                                    <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
                                    <Text style={styles.subtitle} numberOfLines={1}>{event.location || 'No location set'}</Text>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.dateText}>
                                        {new Date(event.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                    </Text>
                                    <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={16} color="#9CA3AF" />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        marginBottom: 24,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    orangeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F97316',
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
    },
    viewAllLink: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
    list: {
        gap: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        fontStyle: 'italic',
        padding: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    cardContent: {
        marginBottom: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    dateText: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
    },
});
