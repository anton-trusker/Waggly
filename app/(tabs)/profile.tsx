
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Image } from 'react-native';
import AppHeader from '@/components/layout/AppHeader';
import LanguageSelect from '@/components/ui/LanguageSelect';
import { useLocale } from '@/hooks/useLocale';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { t, locale, setLocale } = useLocale();

  const handleSignOut = () => {
    Alert.alert(
      t('profile.sign_out_title'),
      t('profile.sign_out_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.sign_out'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="profile.title" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header} />

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {profile?.photo_url ? (
              <Image source={{ uri: profile.photo_url }} style={{ width: 80, height: 80, borderRadius: 40 }} />
            ) : (
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            )}
          </View>
          <Text style={styles.name}>
            {(profile?.first_name || '') + (profile?.last_name ? ` ${profile?.last_name}` : '')}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.account')}</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/edit')}>
            <Text style={styles.menuItemText}>{t('profile.edit_profile')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/co-owners')}>
            <Text style={styles.menuItemText}>{t('profile.co_owners')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/notifications')}>
            <Text style={styles.menuItemText}>{t('profile.notifications_settings')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/settings/appearance')}>
            <Text style={styles.menuItemText}>Appearance</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuItemText}>{t('common.language')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <LanguageSelect value={locale} onChange={setLocale} />
            </View>
          </View>

          {/* Privacy & Security removed */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.title')}</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>{t('support.help_center')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>{t('support.terms_of_service')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>{t('support.privacy_policy')}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>{t('profile.sign_out')}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Pawzly v1.0.0</Text>
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
    paddingTop: getSpacing(15),
    paddingHorizontal: getSpacing(5),
    paddingBottom: getSpacing(30),
  },
  header: {
    marginBottom: getSpacing(6),
  },
  title: {
    ...designSystem.typography.headline.small,
    color: designSystem.colors.text.primary,
  },
  profileCard: {
    backgroundColor: getColor('background.secondary'),
    borderRadius: designSystem.borderRadius.lg,
    padding: getSpacing(6),
    alignItems: 'center',
    marginBottom: getSpacing(6),
    ...designSystem.shadows.sm,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: designSystem.borderRadius.full,
    backgroundColor: designSystem.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getSpacing(4),
  },
  avatarText: {
    ...designSystem.typography.display.small,
    color: designSystem.colors.text.inverse,
  },
  email: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.primary,
    fontWeight: '500',
  },
  name: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
    marginBottom: getSpacing(1),
  },
  section: {
    marginBottom: getSpacing(6),
  },
  sectionTitle: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
    marginBottom: getSpacing(3),
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: getColor('background.secondary'),
    borderRadius: designSystem.borderRadius.md,
    padding: designSystem.spacing[4],
    marginBottom: designSystem.spacing[2],
    ...designSystem.shadows.sm,
  },
  menuItemText: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.primary,
  },
  menuItemArrow: {
    ...designSystem.typography.title.medium,
    color: getColor('text.secondary'),
  },
  signOutButton: {
    backgroundColor: designSystem.colors.error[500],
    borderRadius: designSystem.borderRadius.md,
    padding: designSystem.spacing[4],
    alignItems: 'center',
    marginTop: getSpacing(6),
    ...designSystem.shadows.sm,
  },
  signOutText: {
    ...designSystem.typography.label.medium,
    color: designSystem.colors.text.inverse,
    fontWeight: '600',
  },
  version: {
    ...designSystem.typography.label.small,
    color: designSystem.colors.text.secondary,
    textAlign: 'center',
    marginTop: designSystem.spacing[6],
  },
});
