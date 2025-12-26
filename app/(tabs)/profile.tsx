
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { usePets } from '@/hooks/usePets';
import AppHeader from '@/components/layout/AppHeader';
import LanguageSelect from '@/components/ui/LanguageSelect';
import { useLocale } from '@/hooks/useLocale';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const { pets } = usePets();
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
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert(
                t('common.error'),
                t('profile.sign_out_error') || 'Failed to sign out. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return null;
    }
  };

  const getMemberSince = () => {
    if (profile?.created_at) {
      return formatDate(profile.created_at);
    }
    if (user?.created_at) {
      return formatDate(user.created_at);
    }
    return null;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
      </View>
    );
  }

  const memberSince = getMemberSince();
  const fullName = (profile?.first_name || '') + (profile?.last_name ? ` ${profile?.last_name}` : '');

  return (
    <View style={styles.container}>
      <AppHeader title="profile.title" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {profile?.photo_url ? (
              <Image source={{ uri: profile.photo_url }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {profile?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => router.push('/(tabs)/profile/edit')}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{fullName || 'Your Name'}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          {/* Location info */}
          {(profile?.address || profile?.country) && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#9CA3AF" />
              <Text style={styles.locationText}>
                {profile?.address || profile?.country}
              </Text>
            </View>
          )}

          {/* Bio */}
          {profile?.bio && (
            <Text style={styles.bioText}>{profile.bio}</Text>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="paw" size={24} color="#0A84FF" />
            <Text style={styles.statValue}>{pets?.length || 0}</Text>
            <Text style={styles.statLabel}>Pets</Text>
          </View>
          {memberSince && (
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={24} color="#10B981" />
              <Text style={styles.statValue}>{memberSince}</Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          )}
          {profile?.phone && (
            <View style={styles.statItem}>
              <Ionicons name="call-outline" size={24} color="#8B5CF6" />
              <Text style={styles.statValue} numberOfLines={1}>{profile.phone}</Text>
              <Text style={styles.statLabel}>Phone</Text>
            </View>
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.account')}</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/edit')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={20} color="#0A84FF" />
              <Text style={styles.menuItemText}>{t('profile.edit_profile')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/co-owners')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="people-outline" size={20} color="#10B981" />
              <Text style={styles.menuItemText}>{t('profile.co_owners')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/notifications')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={20} color="#F59E0B" />
              <Text style={styles.menuItemText}>{t('profile.notifications_settings')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/profile/settings/appearance')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="color-palette-outline" size={20} color="#8B5CF6" />
              <Text style={styles.menuItemText}>Appearance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="language-outline" size={20} color="#EC4899" />
              <Text style={styles.menuItemText}>{t('common.language')}</Text>
            </View>
            <View style={{ width: 140 }}>
              <LanguageSelect value={locale} onChange={setLocale} />
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.title')}</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>{t('support.help_center')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text-outline" size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>{t('support.terms_of_service')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>{t('support.privacy_policy')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: getColor('background.secondary'),
    borderRadius: 20,
    padding: getSpacing(6),
    alignItems: 'center',
    marginBottom: getSpacing(4),
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: designSystem.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getSpacing(4),
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: designSystem.colors.primary[600],
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: designSystem.colors.background.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: designSystem.colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: designSystem.colors.text.secondary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  bioText: {
    fontSize: 14,
    color: designSystem.colors.text.secondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: getColor('background.secondary'),
    borderRadius: 16,
    padding: 16,
    marginBottom: getSpacing(6),
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: designSystem.colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: designSystem.colors.text.secondary,
  },
  section: {
    marginBottom: getSpacing(6),
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: designSystem.colors.text.secondary,
    marginBottom: getSpacing(3),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: getColor('background.secondary'),
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: designSystem.colors.text.primary,
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getSpacing(4),
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  version: {
    fontSize: 13,
    color: designSystem.colors.text.secondary,
    textAlign: 'center',
    marginTop: 24,
  },
});
