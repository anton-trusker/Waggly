import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vec tors';

const NOTIFICATION_TYPES = ['All', 'Health', 'Events', 'Social', 'System'];

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'health',
        icon: 'medical',
        iconColor: '#EF4444',
        title: 'Vaccination Due',
        message: 'Max is due for Rabies vaccination',
        time: '2 hours ago',
        read: false,
    },
    {
        id: '2',
        type: 'events',
        icon: 'calendar',
        iconColor: '#6366F1',
        title: 'Upcoming Appointment',
        message: 'Vet visit tomorrow at 10:00 AM',
        time: '5 hours ago',
        read: false,
    },
    {
        id: '3',
        type: 'social',
        icon: 'people',
        iconColor: '#10B981',
        title: 'New Co-Owner Added',
        message: 'Sarah joined as co-owner for Luna',
        time: '1 day ago',
        read: true,
    },
    {
        id: '4',
        type: 'system',
        icon: 'information-circle',
        iconColor: '#8B5CF6',
        title: 'Account Updated',
        message: 'Your profile information has been updated',
        time: '2 days ago',
        read: true,
    },
];

export default function NotificationsPage() {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const filteredNotifications = notifications.filter(notif => {
        if (selectedFilter === 'All') return true;
        return notif.type === selectedFilter.toLowerCase();
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    const handleMarkRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
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
                    {unreadCount > 0 && (
                        <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllRead}>
                            <Ionicons name="checkmark-done" size={20} color="#6366F1" />
                            <Text style={styles.markAllButtonText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                    {notifications.length > 0 && (
                        <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
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
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {filteredNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyStateText}>No notifications</Text>
                        <Text style={styles.emptyStateSubtext}>
                            You're all caught up!
                        </Text>
                    </View>
                ) : (
                    filteredNotifications.map((notif) => (
                        <TouchableOpacity
                            key={notif.id}
                            style={[
                                styles.notificationCard,
                                !notif.read && styles.notificationCardUnread,
                            ]}
                            onPress={() => handleMarkRead(notif.id)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: notif.iconColor + '20' }]}>
                                <Ionicons name={notif.icon as any} size={24} color={notif.iconColor} />
                            </View>
                            <View style={styles.notificationContent}>
                                <View style={styles.notificationHeader}>
                                    <Text style={styles.notificationTitle}>{notif.title}</Text>
                                    {!notif.read && <View style={styles.unreadDot} />}
                                </View>
                                <Text style={styles.notificationMessage}>{notif.message}</Text>
                                <Text style={styles.notificationTime}>{notif.time}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
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
