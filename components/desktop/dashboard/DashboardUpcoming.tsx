
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEvents } from '@/hooks/useEvents';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';

export default function DashboardUpcoming() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const { t } = useLocale();
    const { events } = useEvents();
    const [showCount, setShowCount] = useState<3 | 5 | 'all'>(3);

    const allUpcoming = events
        .filter(event => new Date(event.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const upcomingEvents = showCount === 'all' ? allUpcoming : allUpcoming.slice(0, showCount);

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

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return '#EF4444';
            case 'medium': return '#F59E0B';
            case 'low': return '#10B981';
            default: return '#6B7280';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: '#fff', borderColor: theme.colors.border.primary }]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.orangeDot} />
                    <Text style={styles.heading}>{t('dashboard.upcoming_care')}</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/(tabs)/calendar' as any)}>
                    <Text style={[styles.viewAllLink, { color: theme.colors.primary[500] }]}>{t('dashboard.see_all')}</Text>
                </TouchableOpacity>
            </View>

            {/* Count Selector */}
            <View style={styles.countSelector}>
                <TouchableOpacity
                    style={[styles.countBtn, showCount === 3 && styles.countBtnActive]}
                    onPress={() => setShowCount(3)}
                >
                    <Text style={[styles.countBtnText, showCount === 3 && styles.countBtnTextActive]}>3</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.countBtn, showCount === 5 && styles.countBtnActive]}
                    onPress={() => setShowCount(5)}
                >
                    <Text style={[styles.countBtnText, showCount === 5 && styles.countBtnTextActive]}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.countBtn, showCount === 'all' && styles.countBtnActive]}
                    onPress={() => setShowCount('all')}
                >
                    <Text style={[styles.countBtnText, showCount === 'all' && styles.countBtnTextActive]}>All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.list}>
                {upcomingEvents.length === 0 ? (
                    <Text style={styles.emptyText}>{t('dashboard.no_upcoming_events')}</Text>
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
                                    <View style={[styles.badge, { backgroundColor: getBgColor(event.type) }]}>
                                        <Text style={[styles.badgeText, { color: getEventColor(event.type) }]}>
                                            {daysAway === 0 ? t('dashboard.days_remaining.today') : daysAway === 1 ? t('dashboard.days_remaining.tomorrow') : t('dashboard.days_remaining.days', { count: daysAway })}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.cardContent}>
                                    {event.location && (
                                        <View style={styles.detailRow}>
                                            <IconSymbol android_material_icon_name="location-on" ios_icon_name="location.fill" size={14} color="#6B7280" />
                                            <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.dateText}>
                                        {new Date(event.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
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
    countSelector: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
        backgroundColor: '#F3F4F6',
        padding: 4,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    countBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    countBtnActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    countBtnText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
    },
    countBtnTextActive: {
        color: '#111827',
        fontWeight: '600',
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
