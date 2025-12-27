import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types';
import { router } from 'expo-router';
import type { TablesUpdate } from '@/types/db';
import AppHeader from '@/components/layout/AppHeader';
import ResponsivePageWrapper from '@/components/layout/ResponsivePageWrapper';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // Sort by newest first

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true } as any)
          .eq('id', notification.id);

        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigation
    if (['co_owner_invite', 'co_owner_request', 'co_owner_accepted', 'co_owner_declined'].includes(notification.type)) {
      router.push('/(tabs)/profile/co-owners');
    } else if (['vaccination', 'treatment', 'vet_visit'].includes(notification.type)) {
      // If we had a way to navigate to specific pet record, we would.
      // For now, maybe just Pets tab or Calendar?
      // Assuming related_id is pet_id or event_id.
      // For simplicity, just go to Pets list or stay here.
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return '💉';
      case 'treatment': return '💊';
      case 'vet_visit': return '🏥';
      case 'co_owner_invite': return '📩';
      case 'co_owner_request': return '🙋';
      case 'co_owner_accepted': return '✅';
      case 'co_owner_declined': return '❌';
      default: return '🔔';
    }
  };

  const getStatusForNotification = (notification: Notification) => {
    if (!notification.due_date) return null; // No status if no due date (like system messages)

    const today = new Date();
    const dueDate = new Date(notification.due_date);
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 7) return 'due-soon';
    return 'upcoming';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  return (
    <View style={styles.container}>
      <AppHeader title="Notifications" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          {unreadNotifications.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotifications.length}</Text>
            </View>
          )}
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              You&apos;re all caught up! Add vaccinations and treatments to get reminders.
            </Text>
          </View>
        ) : (
          <React.Fragment>
            {unreadNotifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Unread</Text>
                {unreadNotifications.map((notification) => {
                  const status = getStatusForNotification(notification);
                  return (
                    <TouchableOpacity
                      key={notification.id}
                      style={[styles.notificationCard, !notification.is_read && styles.notificationUnread]}
                      onPress={() => handleNotificationPress(notification)}
                    >
                      <View style={styles.notificationIcon}>
                        <Text style={styles.notificationIconText}>
                          {getIcon(notification.type)}
                        </Text>
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <Text style={styles.notificationMessage}>{notification.message}</Text>
                        {notification.due_date && (
                          <Text style={styles.notificationDate}>
                            Due: {formatDate(notification.due_date)}
                          </Text>
                        )}
                      </View>
                      {status && status !== 'upcoming' && (
                        <View style={[
                          styles.statusBadge,
                          status === 'overdue' && styles.statusOverdue,
                          status === 'due-soon' && styles.statusDueSoon,
                        ]}>
                          <Text style={styles.statusText}>
                            {status === 'overdue' ? 'Overdue' : 'Due Soon'}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {readNotifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Read</Text>
                {readNotifications.map((notification) => {
                  const status = getStatusForNotification(notification);
                  return (
                    <TouchableOpacity
                      key={notification.id}
                      style={styles.notificationCard}
                      onPress={() => handleNotificationPress(notification)}
                    >
                      <View style={styles.notificationIcon}>
                        <Text style={styles.notificationIconText}>
                          {getIcon(notification.type)}
                        </Text>
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={[styles.notificationTitle, styles.readText]}>{notification.title}</Text>
                        <Text style={[styles.notificationMessage, styles.readText]}>{notification.message}</Text>
                        {notification.due_date && (
                          <Text style={styles.notificationDate}>
                            Due: {formatDate(notification.due_date)}
                          </Text>
                        )}
                      </View>
                      {status && status !== 'upcoming' && (
                        <View style={[
                          styles.statusBadge,
                          status === 'overdue' && styles.statusOverdue,
                          status === 'due-soon' && styles.statusDueSoon,
                        ]}>
                          <Text style={styles.statusText}>
                            {status === 'overdue' ? 'Overdue' : 'Due Soon'}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </React.Fragment>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designSystem.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: designSystem.spacing[15],
    paddingHorizontal: designSystem.spacing[5],
    paddingBottom: designSystem.spacing[30],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designSystem.spacing[6],
  },
  title: {
    ...designSystem.typography.headline.small,
    color: designSystem.colors.text.primary,
  },
  badge: {
    backgroundColor: designSystem.colors.error[500],
    borderRadius: designSystem.borderRadius.lg,
    paddingHorizontal: designSystem.spacing[2],
    paddingVertical: designSystem.spacing[1],
    marginLeft: designSystem.spacing[3],
  },
  badgeText: {
    color: designSystem.colors.text.inverse,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: designSystem.spacing[15],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: designSystem.spacing[4],
  },
  emptyTitle: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
    marginBottom: designSystem.spacing[2],
  },
  emptyText: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: designSystem.spacing[10],
  },
  section: {
    marginBottom: designSystem.spacing[6],
  },
  sectionTitle: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
    marginBottom: designSystem.spacing[3],
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designSystem.colors.background.secondary,
    borderRadius: designSystem.borderRadius.lg,
    padding: designSystem.spacing[4],
    marginBottom: designSystem.spacing[3],
    ...designSystem.shadows.sm,
  },
  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: designSystem.colors.primary[500],
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: designSystem.colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: designSystem.spacing[3],
  },
  notificationIconText: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...designSystem.typography.body.large,
    color: designSystem.colors.text.primary,
    marginBottom: designSystem.spacing[1],
    fontWeight: '600',
  },
  notificationMessage: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.primary,
    marginBottom: designSystem.spacing[1],
  },
  notificationDate: {
    ...designSystem.typography.label.small,
    color: designSystem.colors.text.secondary,
  },
  readText: {
    opacity: 0.6,
  },
  statusBadge: {
    paddingHorizontal: designSystem.spacing[3],
    paddingVertical: designSystem.spacing[1],
    borderRadius: designSystem.borderRadius.full,
  },
  statusDueSoon: {
    backgroundColor: designSystem.colors.warning[100],
  },
  statusOverdue: {
    backgroundColor: designSystem.colors.error[100],
  },
  statusText: {
    ...designSystem.typography.label.small,
    fontWeight: '600',
    color: designSystem.colors.text.primary,
  },
});
