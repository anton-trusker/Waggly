import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocale } from '@/hooks/useLocale';
import { CalendarEvent } from '@/hooks/useEvents';
import { designSystem } from '@/constants/designSystem';
import { format } from 'date-fns';

const EVENTS_PER_PAGE = 3;

interface DashboardUpcomingProps {
    events: CalendarEvent[];
}

export default function DashboardUpcoming({ events }: DashboardUpcomingProps) {
    const router = useRouter();
    const { t } = useLocale();
    const [activeTab, setActiveTab] = useState<'all' | 'medical' | 'hygiene'>('all');
    const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);

    const filterEvents = (eventList: CalendarEvent[]) => {
        if (activeTab === 'all') return eventList;
        if (activeTab === 'medical') return eventList.filter(e => ['vet', 'vaccination', 'medication', 'surgery'].includes(e.type));
        if (activeTab === 'hygiene') return eventList.filter(e => ['grooming', 'dental'].includes(e.type));
        return eventList;
    };

    const allUpcoming = events
        .filter(event => new Date(event.dueDate) >= new Date(new Date().setHours(0, 0, 0, 0))) // Include today
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const filteredEvents = filterEvents(allUpcoming);
    const displayedEvents = filteredEvents.slice(0, visibleCount);
    const hasMore = visibleCount < filteredEvents.length;

    const handleShowMore = () => {
        setVisibleCount(prev => Math.min(prev + EVENTS_PER_PAGE, filteredEvents.length));
    };

    const getCategoryColor = (type: string) => {
        if (['vet', 'vaccination', 'medication', 'surgery'].includes(type)) return 'medical';
        if (['grooming', 'dental'].includes(type)) return 'hygiene';
        return 'other';
    };

    const getBadgeStyle = (type: string) => {
        const category = getCategoryColor(type);
        if (category === 'medical') {
            return { bg: designSystem.colors.status.error[50], text: designSystem.colors.status.error[600] };
        }
        if (category === 'hygiene') {
            return { bg: designSystem.colors.primary[50], text: designSystem.colors.primary[600] };
        }
        return { bg: designSystem.colors.status.warning[50], text: designSystem.colors.status.warning[600] };
    };

    const Tabs = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {(['all', 'medical', 'hygiene'] as const).map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[
                        styles.tab,
                        activeTab === tab && styles.activeTab
                    ] as any}
                    onPress={() => setActiveTab(tab)}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === tab && styles.activeTabText
                    ]}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <View style={styles.titleIndicator} />
                    <Text style={styles.heading}>Upcoming Care</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/(tabs)/calendar' as any)}>
                    <Text style={styles.viewAllLink}>{t('dashboard.see_all')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabsWrapper}>
                <Tabs />
            </View>

            <View style={styles.list}>
                {displayedEvents.length === 0 ? (
                    <View style={styles.emptyState}>
                        <IconSymbol
                            ios_icon_name="calendar.badge.exclamationmark"
                            android_material_icon_name="event-busy"
                            size={32}
                            color={designSystem.colors.neutral[300] as any}
                        />
                        <Text style={styles.emptyText}>
                            {activeTab === 'all'
                                ? t('dashboard.no_upcoming_events')
                                : `No upcoming ${activeTab} events`}
                        </Text>
                    </View>
                ) : (
                    <>
                        {displayedEvents.map((event, index) => {
                            const date = new Date(event.dueDate);
                            const day = format(date, 'd');
                            const month = format(date, 'MMM');
                            const badgeStyle = getBadgeStyle(event.type);
                            const isLast = index === displayedEvents.length - 1;

                            return (
                                <TouchableOpacity
                                    key={event.id}
                                    style={[styles.eventRow, !isLast && styles.eventBorder] as any}
                                    onPress={() => router.push(`/events/${event.id}` as any)}
                                    activeOpacity={0.7}
                                >
                                    {/* Date Box */}
                                    <View style={styles.dateBox}>
                                        <Text style={styles.dateDay}>{day}</Text>
                                        <Text style={styles.dateMonth}>{month}</Text>
                                    </View>

                                    {/* Content */}
                                    <View style={styles.eventContent}>
                                        <View style={styles.eventHeader}>
                                            <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
                                                <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
                                                    {event.type.replace('_', ' ')}
                                                </Text>
                                            </View>
                                            {event.petName && (
                                                <Text style={styles.petName}>{event.petName}</Text>
                                            )}
                                        </View>

                                        <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>

                                        {event.location && (
                                            <View style={styles.locationRow}>
                                                <IconSymbol
                                                    ios_icon_name="location.fill"
                                                    android_material_icon_name="location-on"
                                                    size={12}
                                                    color={designSystem.colors.text.tertiary}
                                                />
                                                <Text style={styles.locationText} numberOfLines={1}>{event.location}</Text>
                                            </View>
                                        )}
                                    </View>

                                    <IconSymbol
                                        ios_icon_name="chevron.right"
                                        android_material_icon_name="chevron-right"
                                        size={20}
                                        color={designSystem.colors.neutral[300] as any}
                                    />
                                </TouchableOpacity>
                            );
                        })}

                        {hasMore && (
                            <TouchableOpacity
                                style={styles.showMoreButton}
                                onPress={handleShowMore}
                            >
                                <Text style={styles.showMoreText}>Show More</Text>
                                <IconSymbol
                                    android_material_icon_name="expand-more"
                                    ios_icon_name="chevron.down"
                                    size={16}
                                    color={designSystem.colors.primary[500] as any}
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
        backgroundColor: designSystem.colors.background.secondary, // White
        borderRadius: designSystem.borderRadius.xl,
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
        padding: designSystem.spacing[5],
        ...designSystem.shadows.sm as any,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: designSystem.spacing[4],
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[2],
    },
    titleIndicator: {
        width: 4,
        height: 18,
        borderRadius: 2,
        backgroundColor: designSystem.colors.primary[500],
    },
    heading: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.text.primary,
    },
    viewAllLink: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.primary[500],
    },
    tabsWrapper: {
        marginBottom: designSystem.spacing[4],
    },
    tabsContainer: {
        gap: designSystem.spacing[2],
    },
    tab: {
        paddingHorizontal: designSystem.spacing[3],
        paddingVertical: designSystem.spacing[1.5],
        borderRadius: designSystem.borderRadius.full,
        backgroundColor: designSystem.colors.neutral[100],
    },
    activeTab: {
        backgroundColor: designSystem.colors.primary[500],
    },
    tabText: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.secondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    list: {
        gap: designSystem.spacing[0], // Handled by padding/border
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: designSystem.spacing[3],
        gap: designSystem.spacing[3],
    },
    eventBorder: {
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.border.primary,
    },
    dateBox: {
        width: 48,
        height: 48,
        borderRadius: designSystem.borderRadius.lg,
        backgroundColor: designSystem.colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateDay: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.primary[600],
        lineHeight: 20,
    },
    dateMonth: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.primary[400],
        textTransform: 'uppercase',
        fontSize: 10,
    },
    eventContent: {
        flex: 1,
        gap: 2,
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[2],
        marginBottom: 2,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    petName: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.tertiary,
    },
    eventTitle: {
        ...designSystem.typography.body.medium,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    locationText: {
        ...designSystem.typography.caption,
        color: designSystem.colors.text.tertiary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: designSystem.spacing[6],
        gap: designSystem.spacing[2],
    },
    emptyText: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
        fontStyle: 'italic',
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingTop: designSystem.spacing[3],
    },
    showMoreText: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.primary[500],
    },
});
