import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { PetImage } from '@/components/ui/PetImage';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/hooks/useLocale';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';

type Props = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showGreeting?: boolean;
  hideAvatar?: boolean;
  backPosition?: 'left' | 'right';
  showEdit?: boolean;
  onEdit?: () => void;
};

function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('data:')) return url; // Handle base64

  if (url.startsWith('user-photos/')) {
    const { data } = supabase.storage.from('user-photos').getPublicUrl(url);
    return data.publicUrl;
  }

  if (url.startsWith('pet-photos/')) {
    const { data } = supabase.storage.from('pet-photos').getPublicUrl(url);
    return data.publicUrl;
  }

  return url;
}

export default function AppHeader({ title: propTitle, showBack: propShowBack, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t } = useLocale();
  const { getPet } = usePets();

  // Determine Page Type
  // Flexible regex to match /pets/[id] but exclude /pets/new, /pets/[id]/edit, etc if we want specific subpage headers

  const isPetsPath = pathname.includes('/pets');

  // Explicitly check for 'edit' or 'new' to exclude them
  const isEditPage = pathname.includes('/edit');
  const isNewPage = pathname.includes('/new') || pathname.includes('/add-pet');

  // Check strict list path (allowing for potential (tabs) prefix if it leaked through, or standard /pets)
  // We clean the path to ensure exact match logic works for the list root.
  const cleanPath = pathname.replace(/\/$/, ''); // Remove trailing slash
  const isPetsList = cleanPath.endsWith('/pets');

  // If it is in pets path, not the list root, not new/edit, then it's a profile.
  // We can also extract the ID manually from the path to be safe.
  const pathSegments = pathname.split('/').filter(Boolean);
  const petsIndex = pathSegments.indexOf('pets');
  const idFromPath = (petsIndex !== -1 && pathSegments.length > petsIndex + 1) ? pathSegments[petsIndex + 1] : undefined;

  const isPetProfile = isPetsPath && !isPetsList && !isEditPage && !isNewPage && !!idFromPath;

  const isHome = pathname === '/' || pathname === '/dashboard' || pathname.includes('(home)');
  const isCalendar = pathname.includes('/calendar');
  const isProfile = pathname.includes('/profile');

  // Retrieve Pet Data Sync
  const currentPetId = (params.id as string) || idFromPath;
  // We use useMemo or just direct access. getPet is performant enough (array find).
  const currentPet = (isPetProfile && currentPetId) ? getPet(currentPetId) : null;

  // User Name logic
  const firstName =
    profile?.first_name
      ? profile.first_name
      : profile?.full_name
        ? profile.full_name.split(' ')[0]
        : user?.email
          ? user.email.split('@')[0]
          : 'User';


  // Render Logic
  const renderLeft = () => {
    if (isPetProfile) {
      return (
        <TouchableOpacity style={styles.iconBtn} onPress={onBack || (() => router.back())}>
          <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      );
    }

    // Default Back Button for nested pages (except Main tabs)
    // Main tabs: Home, Pets List (index), Calendar, Profile
    const isMainTab = isHome || isPetsList || isCalendar || isProfile;

    // Simplification: If we have a back action provided or we are deep in stack
    // But for tabs, we replace standard logic
    if (!isMainTab) {
      return (
        <TouchableOpacity style={styles.iconBtn} onPress={onBack || (() => router.back())}>
          <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      );
    }

    // App Icon for Main Tabs
    return (
      <View style={styles.appIconContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.appIcon} resizeMode="contain" />
      </View>
    );
  };

  const renderCenter = () => {
    if (isHome) {
      return <Text style={styles.title}>Welcome, {firstName}</Text>;
    }
    if (isCalendar) {
      return <Text style={styles.title}>{t('navigation.calendar')}</Text>;
    }
    if (isPetsList) {
      return <Text style={styles.title}>{t('my_pets_page.title')}</Text>;
    }
    if (isProfile) {
      return <Text style={styles.title}>Settings</Text>;
    }
    if (isPetProfile && currentPet) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <PetImage
            source={currentPet.photo_url ? { uri: resolveImageUrl(currentPet.photo_url) } : undefined}
            size={40}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <Text style={styles.title}>{currentPet.name}</Text>
        </View>
      )
    }

    // Fallback/Default
    const getPageTitle = () => {
      if (propTitle) return propTitle;
      if (pathname.includes('/notifications')) return t('navigation.notifications');
      if (pathname.includes('/documents')) return t('navigation.documents');
      if (pathname.includes('/add-pet')) return 'Add Pet';
      if (pathname.includes('/new')) return 'Add Pet';
      if (pathname.includes('/edit')) return 'Edit';
      if (pathname.includes('/co-owners')) return 'Co-Owners';

      // Try to capitalize the last segment as a fallback
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const last = segments[segments.length - 1];
        // Remove (tabs), (auth) etc if simple fallback needed, but usually we cover main ones above
        if (!last.startsWith('(')) {
          return last.charAt(0).toUpperCase() + last.slice(1);
        }
      }

      return 'Pawzly';
    };

    return <Text style={styles.title}>{getPageTitle()}</Text>;
  };

  const renderRight = () => {
    // Pet Profile specific
    if (isPetProfile) {
      return (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push(`/(tabs)/pets/${params.id}/edit` as any)}>
            <IconSymbol ios_icon_name="pencil" android_material_icon_name="edit" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <IconSymbol ios_icon_name="square.and.arrow.up" android_material_icon_name="share" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/notifications')}>
            <IconSymbol ios_icon_name="bell.fill" android_material_icon_name="notifications" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }

    // Pets List - ADD Button
    if (isPetsList) {
      return (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/pets/new' as any)}>
            <Ionicons name="add" size={22} color="#6366F1" />
            <Text style={styles.addBtnText}>Add Pet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/notifications')}>
            <IconSymbol ios_icon_name="bell.fill" android_material_icon_name="notifications" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }

    // Default Notification
    return (
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/notifications')}>
          <IconSymbol ios_icon_name="bell.fill" android_material_icon_name="notifications" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
      <View style={styles.content}>
        <View style={styles.leftContainer}>{renderLeft()}</View>
        <View style={styles.centerContainer}>{renderCenter()}</View>
        <View style={styles.rightContainer}>{renderRight()}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6366F1', // Primary Blue
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans' : undefined,
    textAlign: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  appIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconPlaceholder: {
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addBtnText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 13,
  },
});
