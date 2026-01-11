import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types';
import { useLocale } from '@/hooks/useLocale';
import { formatDistanceToNow } from 'date-fns';
import { enUS, de, fr, ru } from 'date-fns/locale';

const FILTER_KEYS = ['all', 'health', 'events', 'social', 'system'];

const getDateFnsLocale = (locale: string) => {
    switch (locale) {
        case 'de': return de;
        case 'fr': return fr;
        case 'ru': return ru;
        default: return enUS;
    }
};

export default function NotificationsPage() {
    const {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        deleteNotification,
        sendTestNotification
    } = useNotifications();

    const { t, locale } = useLocale();
    const [selectedFilter, setSelectedFilter] = useState('all');

    const filteredNotifications = notifications.filter(notif => {
        if (selectedFilter === 'all') return true;
        return (notif.type || 'system').toLowerCase() === selectedFilter;
    });

    const getIconInfo = (type: string) => {
        const t = (type || 'system').toLowerCase();
        switch (t) {
            case 'health': return { icon: 'medical', color: '#EF4444' };
            case 'vaccination': return { icon: 'medical', color: '#EF4444' };
            case 'medication': return { icon: 'bandage', color: '#EF4444' };
            case 'events': return { icon: 'calendar', color: '#6366F1' };
            case 'visit': return { icon: 'fitness', color: '#6366F1' };
            case 'social': return { icon: 'people', color: '#10B981' };
            case 'system': return { icon: 'information-circle', color: '#8B5CF6' };
            default: return { icon: 'notifications', color: '#6B7280' };
        }
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true, locale: getDateFnsLocale(locale) });
    };

    const handleTestNotification = () => {
        const types = ['health', 'events', 'social', 'system'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        sendTestNotification(
            `New ${randomType} alert`,
            `This is a test notification generated at ${new Date().toLocaleTimeString()}`,
            randomType
        );
    };

    const confirmClearAll = () => {
        Alert.alert(
            t('notifications.clear_all_title'),
            t('notifications.clear_all_message'),
            [
                { text: t('common.cancel'), style: "cancel" },
                { text: t('common.delete'), style: "destructive", onPress: clearAll }
            ]
        );
    };

    const confirmDelete = (id: string) => {
        Alert.alert(
            t('notifications.delete_title'),
            t('notifications.delete_message'),
            [
                { text: t('common.cancel'), style: "cancel" },
                { text: t('common.delete'), style: "destructive", onPress: () => deleteNotification(id) }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{t('notifications.title')}</Text>
                    <Text style={styles.subtitle}>
                        {unreadCount > 0
                            ? t('notifications.subtitle_unread', { count: unreadCount })
                            : t('notifications.subtitle_all_caught_up')}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.testButton} onPress={handleTestNotification}>
                        <Ionicons name="add-circle-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>

                    {unreadCount > 0 && (
                        <TouchableOpacity style={styles.markAllButton} onPress={() => markAllAsRead()}>
                            <Ionicons name="checkmark-done" size={20} color="#6366F1" />
                            <Text style={styles.markAllButtonText}>{t('notifications.mark_all_read')}</Text>
                        </TouchableOpacity>
                    )}
                    {notifications.length > 0 && (
                        <TouchableOpacity style={styles.clearAllButton} onPress={confirmClearAll}>
                            <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filters */}
            <View style={styles.filters}>
                {FILTER_KEYS.map((key) => (
                    <TouchableOpacity
                        key={key}
                        style={[
                            styles.filterChip,
                            selectedFilter === key && styles.filterChipActive,
                        ] as any}
                        onPress={() => setSelectedFilter(key)}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                selectedFilter === key && styles.filterChipTextActive,
                            ] as any}
                        >
                            {t(`notifications.filter_${key}`)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Notifications List */}
            {loading && notifications.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            ) : (
                <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                    {filteredNotifications.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyStateText}>{t('notifications.empty_title')}</Text>
                            <Text style={styles.emptyStateSubtext}>
                                {notifications.length === 0
                                    ? t('notifications.empty_subtitle')
                                    : t('notifications.empty_filter')}
                            </Text>
                        </View>
                    ) : (
                        filteredNotifications.map((notif) => {
                            const { icon, color } = getIconInfo(notif.type);
                            return (
                                <TouchableOpacity
                                    key={notif.id}
                                    style={[
                                        styles.notificationCard,
                                        !notif.is_read && styles.notificationCardUnread,
                                    ] as any}
                                    onPress={() => !notif.is_read && markAsRead(notif.id)}
                                    onLongPress={() => confirmDelete(notif.id)}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                                        <Ionicons name={icon as any} size={24} color={color} />
                                    </View>
                                    <View style={styles.notificationContent}>
                                        <View style={styles.notificationHeader}>
                                            <Text style={styles.notificationTitle}>{notif.title}</Text>
                                            {!notif.is_read && <View style={styles.unreadDot} />}
                                        </View>
                                        <Text style={styles.notificationMessage}>{notif.message}</Text>
                                        <Text style={styles.notificationTime}>{formatTime(notif.created_at)}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                    <View style={{ height: 40 }} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    testButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6366F1',
    },
    markAllButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    clearAllButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    filters: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 32,
        paddingVertical: 20,
        backgroundColor: '#fff',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    filterChipActive: {
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    list: {
        flex: 1,
        padding: 32,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationCard: {
        flexDirection: 'row',
        gap: 16,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    notificationCardUnread: {
        backgroundColor: '#F0F6FF',
        borderColor: '#6366F1',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#6366F1',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
        lineHeight: 20,
    },
    notificationTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#D1D5DB',
        marginTop: 4,
    },
});
