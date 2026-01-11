import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useLocale } from '@/hooks/useLocale';

const ActivityFeedTimeline: React.FC = () => {
    const { activities, loading } = useActivityFeed(10);
    const { t } = useLocale();

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.heading}>{t('dashboard.activity_feed')}</Text>
                </View>
                <Text style={styles.loadingText}>{t('dashboard.loading_activity')}</Text>
            </View>
        );
    }

    if (activities.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.heading}>{t('dashboard.activity_feed')}</Text>
                </View>
                <Text style={styles.emptyText}>{t('dashboard.no_recent_activity')}</Text>
            </View>
        );
    }

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

        if (diffInSeconds < 60) return t('dashboard.time_ago.just_now');
        if (diffInSeconds < 3600) return t('dashboard.time_ago.minutes_ago', { count: Math.floor(diffInSeconds / 60) });
        if (diffInSeconds < 86400) return t('dashboard.time_ago.hours_ago', { count: Math.floor(diffInSeconds / 3600) });
        if (diffInSeconds < 604800) return t('dashboard.time_ago.days_ago', { count: Math.floor(diffInSeconds / 86400) });
        return time.toLocaleDateString();
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'weight': return '#F59E0B';
            case 'visit': return '#0EA5E9';
            case 'vaccination': return '#10B981';
            case 'treatment': return '#EC4899';
            case 'document': return '#8B5CF6';
            case 'photo': return '#F43F5E';
            default: return '#6B7280';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>{t('dashboard.activity_feed')}</Text>
                <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
            </View>

            <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
                {activities.map((activity, index) => (
                    <View key={activity.id} style={styles.timelineItem}>
                        {/* Timeline Line */}
                        {index < activities.length - 1 && <View style={styles.timelineLine} />}

                        {/* Icon */}
                        <View style={[styles.iconContainer, { backgroundColor: getIconColor(activity.type) + '20' }]}>
                            <Ionicons
                                name={activity.icon as any}
                                size={16}
                                color={getIconColor(activity.type)}
                            />
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <View style={styles.contentHeader}>
                                <View style={styles.titleRow}>
                                    {activity.petPhotoUrl && (
                                        <Image source={{ uri: activity.petPhotoUrl }} style={styles.petAvatar} />
                                    )}
                                    <Text style={styles.title}>{activity.title}</Text>
                                </View>
                                <Text style={styles.timestamp}>{getTimeAgo(activity.timestamp)}</Text>
                            </View>
                            <Text style={styles.description}>{activity.description}</Text>

                            {/* Weight Chart Preview (if weight activity) */}
                            {activity.type === 'weight' && activity.data && (
                                <View style={styles.dataPreview}>
                                    <Text style={styles.dataText}>
                                        {activity.data.weight} {activity.data.unit}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* View All Link */}
            <View style={styles.footer}>
                <Text style={styles.viewAllText}>{t('dashboard.view_all_activity')} →</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
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
    timeline: {
        maxHeight: 500,
    },
    timelineItem: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        left: 15,
        top: 32,
        bottom: -20,
        width: 2,
        backgroundColor: '#E5E7EB',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    content: {
        flex: 1,
    },
    contentHeader: {
        marginBottom: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    petAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    timestamp: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    dataPreview: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dataText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F59E0B',
    },
    footer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0EA5E9',
        textAlign: 'center',
    },
});

export default ActivityFeedTimeline;
