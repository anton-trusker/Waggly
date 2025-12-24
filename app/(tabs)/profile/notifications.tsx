import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Switch, Platform } from 'react-native';
import { colors, buttonStyles } from '@/styles/commonStyles';
// import * as Notifications from 'expo-notifications'; // Removed to fix Expo Go issue
import { loadNotificationPrefs, saveNotificationPrefs } from '@/utils/notificationsPrefs';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Mock Notifications object to prevent crash in Expo Go until dev client is used
const Notifications = {
  getPermissionsAsync: async () => ({ status: 'undetermined' as const }),
  requestPermissionsAsync: async () => ({ status: 'undetermined' as const }),
  scheduleNotificationAsync: async (options: any) => console.log('Mock schedule', options),
  cancelAllScheduledNotificationsAsync: async () => console.log('Mock cancel all'),
};

export default function NotificationSettingsScreen() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [loading, setLoading] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    (async () => {
      const perm = await Notifications.getPermissionsAsync();
      setStatus(perm.status);
      setLoading(false);
      const prefs = await loadNotificationPrefs();
      setShowAlert(prefs.alert);
      setPlaySound(prefs.sound);
      setShowBadge(prefs.badge);
    })();
  }, []);

  const requestPerms = async () => {
    setLoading(true);
    // In Expo Go, real push notifications are not supported.
    // In a development build or production, this would work.
    // For now, we mock the success if not using the real module.
    
    // const perm = await Notifications.requestPermissionsAsync();
    // setStatus(perm.status);
    
    // Mock success for UI testing
    setStatus('granted');
    setLoading(false);
    
    if (Platform.OS === 'android') {
      alert('Note: Android Push Notifications are not supported in Expo Go. Please use a Development Build.');
    }
  };

  const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Test', body: 'This is a test notification', sound: playSound },
      trigger: null,
    });
  };

  const clearAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Notifications Settings</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Permission</Text>
          <Text style={styles.value}>{status}</Text>
          <TouchableOpacity style={[buttonStyles.primary, styles.button]} onPress={requestPerms} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={buttonStyles.textWhite}>Request Permission</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Behavior</Text>
          <View style={styles.row}>
            <Text style={styles.value}>Show Alerts</Text>
            <Switch
              value={showAlert}
              onValueChange={async (v) => {
                setShowAlert(v);
                await saveNotificationPrefs({ alert: v, sound: playSound, badge: showBadge });
                if (user) {
                  await supabase.from('profiles').update({ notification_prefs: { alert: v, sound: playSound, badge: showBadge } } as any).eq('user_id', user.id);
                }
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>Play Sound</Text>
            <Switch
              value={playSound}
              onValueChange={async (v) => {
                setPlaySound(v);
                await saveNotificationPrefs({ alert: showAlert, sound: v, badge: showBadge });
                if (user) {
                  await supabase.from('profiles').update({ notification_prefs: { alert: showAlert, sound: v, badge: showBadge } } as any).eq('user_id', user.id);
                }
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>Show Badge</Text>
            <Switch
              value={showBadge}
              onValueChange={async (v) => {
                setShowBadge(v);
                await saveNotificationPrefs({ alert: showAlert, sound: playSound, badge: v });
                if (user) {
                  await supabase.from('profiles').update({ notification_prefs: { alert: showAlert, sound: playSound, badge: v } } as any).eq('user_id', user.id);
                }
              }}
            />
          </View>
          <TouchableOpacity style={[buttonStyles.secondary, styles.button]} onPress={testNotification}>
            <Text style={buttonStyles.text}>Send Test Notification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[buttonStyles.secondary, styles.button]} onPress={clearAll}>
            <Text style={buttonStyles.text}>Clear All Scheduled</Text>
          </TouchableOpacity>
          <Text style={styles.note}>Note: Behavior toggles apply to future notifications.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 16 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: 13, color: colors.textSecondary },
  value: { fontSize: 15, color: colors.text, marginTop: 4, marginBottom: 8 },
  button: { marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  note: { fontSize: 12, color: colors.textSecondary, marginTop: 8 },
});
