
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { CalendarEvent } from '@/hooks/useEvents';

const EVENTS_PER_PAGE = 3;

interface DashboardUpcomingProps {
    events: CalendarEvent[];
}

export default function DashboardUpcoming({ events }: DashboardUpcomingProps) {
    const router = useRouter();
    const { theme } = useAppTheme();
    const { t } = useLocale();
    // Removed internal useEvents and useFocusEffect
    const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);

    const allUpcoming = events
        .filter(event => new Date(event.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const upcomingEvents = allUpcoming.slice(0, visibleCount);
    const hasMore = visibleCount < allUpcoming.length;

    const handleShowMore = () => {
        setVisibleCount(prev => Math.min(prev + EVENTS_PER_PAGE, allUpcoming.length));
    };

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
                    <Text style={styles.heading}>Upcoming Events</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/(tabs)/calendar' as any)}>
                    <Text style={[styles.viewAllLink, { color: theme.colors.primary[500] }]}>{t('dashboard.see_all')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.list}>
                {upcomingEvents.length === 0 ? (
                    <Text style={styles.emptyText}>{t('dashboard.no_upcoming_events')}</Text>
                ) : (
                    <>
                        {upcomingEvents.map((event) => {
                            const daysAway = Math.ceil((new Date(event.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                            const dateText = new Date(event.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

                            return (
                                <TouchableOpacity
                                    key={event.id}
                                    style={[styles.card, { borderColor: theme.colors.border.secondary }]}
                                    onPress={() => router.push('/(tabs)/calendar' as any)}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={styles.headerLeftContent}>
                                            <View style={[styles.iconBox, { backgroundColor: getBgColor(event.type) }]}>
                                                <IconSymbol
                                                    android_material_icon_name={getEventIcon(event.type) as any}
                                                    ios_icon_name={getEventIconIOS(event.type) as any}
                                                    size={20}
                                                    color={getEventColor(event.type)}
                                                />
                                            </View>
                                            <View style={styles.headerTextContent}>
                                                <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
                                                <Text style={styles.subtitle} numberOfLines={1}>
                                                    <Text style={{ textTransform: 'capitalize' }}>{event.type}</Text> • {event.petName || t('dashboard.no_pet_assigned')}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.rightColumn}>
                                            <View style={[styles.badge, { backgroundColor: getBgColor(event.type) }]}>
                                                <Text style={[styles.badgeText, { color: getEventColor(event.type) }]}>
                                                    {daysAway === 0 ? t('dashboard.days_remaining.today') : daysAway === 1 ? t('dashboard.days_remaining.tomorrow') : t('dashboard.days_remaining.days', { count: daysAway })}
                                                </Text>
                                            </View>
                                            <Text style={styles.dateTextSmall}>{dateText}</Text>
                                        </View>
                                    </View>

                                    {event.location && (
                                        <View style={styles.cardContent}>
                                            <View style={styles.detailRow}>
                                                <IconSymbol android_material_icon_name="location-on" ios_icon_name="location.fill" size={14} color="#6B7280" />
                                                <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}

                        {hasMore && (
                            <TouchableOpacity
                                style={styles.showMoreButton}
                                onPress={handleShowMore}
                            >
                                <Text style={[styles.showMoreText, { color: theme.colors.primary[500] }]}>
                                    Show More
                                </Text>
                                <IconSymbol
                                    android_material_icon_name="expand-more"
                                    ios_icon_name="chevron.down"
                                    size={16}
                                    color={theme.colors.primary[500]}
                                />
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        overflow: 'hidden',
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
        gap: 12,
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
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        marginRight: 8,
    },
    headerTextContent: {
        flex: 1,
        justifyContent: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightColumn: {
        alignItems: 'flex-end',
        gap: 6,
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
    dateTextSmall: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
    },
    cardContent: {
        paddingLeft: 52, // Align with text (40 icon + 12 gap)
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
        fontFamily: 'Plus Jakarta Sans',
    },
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 13,
        color: '#4B5563',
        fontFamily: 'Plus Jakarta Sans',
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
        marginTop: 8,
    },
    showMoreText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
});
