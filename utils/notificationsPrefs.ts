import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationPrefs = {
  alert: boolean;
  sound: boolean;
  badge: boolean;
};

const STORAGE_KEY = 'notif_prefs';
let current: NotificationPrefs = { alert: true, sound: true, badge: true };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: current.alert,
    shouldPlaySound: current.sound,
    shouldSetBadge: current.badge,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function loadNotificationPrefs(): Promise<NotificationPrefs> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      current = {
        alert: typeof parsed.alert === 'boolean' ? parsed.alert : true,
        sound: typeof parsed.sound === 'boolean' ? parsed.sound : true,
        badge: typeof parsed.badge === 'boolean' ? parsed.badge : true,
      };
    }
  } catch {}
  return current;
}

export async function saveNotificationPrefs(prefs: NotificationPrefs): Promise<void> {
  current = { ...current, ...prefs };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {}
}

export function getNotificationPrefs(): NotificationPrefs {
  return current;
}

