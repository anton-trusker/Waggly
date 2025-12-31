import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types';

const NOTIFICATION_TYPES = ['All', 'Health', 'Events', 'Social', 'System'];

export default function NotificationsPage() {
    const {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        deleteNotification,
        sendTestNotification // For testing
    } = useNotifications();

    const [selectedFilter, setSelectedFilter] = useState('All');

    const filteredNotifications = notifications.filter(notif => {
        if (selectedFilter === 'All') return true;
        return (notif.type || 'system').toLowerCase() === selectedFilter.toLowerCase();
    });

    const getIconInfo = (type: string) => {
        const t = (type || 'system').toLowerCase();
        switch (t) {
            case 'health': return { icon: 'medical', color: '#EF4444' };
            case 'vaccination': return { icon: 'medical', color: '#EF4444' };
            case 'medication': return { icon: 'bandage', color: '#EF4444' }; // Fallback for health subtypes
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
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString();
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
            "Clear All",
            "Are you sure you want to delete all notifications?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: clearAll }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Notifications</Text>
                    <Text style={styles.subtitle}>
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.testButton} onPress={handleTestNotification}>
                        <Ionicons name="add-circle-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>

                    {unreadCount > 0 && (
                        <TouchableOpacity style={styles.markAllButton} onPress={() => markAllAsRead()}>
                            <Ionicons name="checkmark-done" size={20} color="#6366F1" />
                            <Text style={styles.markAllButtonText}>Mark all read</Text>
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
                {NOTIFICATION_TYPES.map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.filterChip,
                            selectedFilter === type && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedFilter(type)}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                selectedFilter === type && styles.filterChipTextActive,
                            ]}
                        >
                            {type}
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
                            <Text style={styles.emptyStateText}>No notifications</Text>
                            <Text style={styles.emptyStateSubtext}>
                                {notifications.length === 0 ? "You're all caught up!" : "No notifications match this filter."}
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
                                    ]}
                                    onPress={() => !notif.is_read && markAsRead(notif.id)}
                                    // Optional: Long press to delete single notification?
                                    onLongPress={() => Alert.alert("Delete", "Delete this notification?", [{ text: "Cancel" }, { text: "Delete", onPress: () => deleteNotification(notif.id) }])}
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
