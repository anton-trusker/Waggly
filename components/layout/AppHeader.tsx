import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { headerStyles } from '@/components/styles/headerStyles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { PetImage } from '@/components/ui/PetImage';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/hooks/useLocale';

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
  if (url.startsWith('user-photos/')) {
    const { data } = supabase.storage.from('user-photos').getPublicUrl(url);
    return data.publicUrl;
  }
  return url;
}

export default function AppHeader({ title, showBack, onBack, showGreeting, hideAvatar, backPosition = 'right', showEdit, onEdit }: Props) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t } = useLocale();

  const firstName =
    profile?.first_name
      ? profile.first_name
      : profile?.full_name
      ? profile.full_name.split(' ')[0]
      : user?.email
      ? user.email.split('@')[0]
      : 'User';

  const avatarUri = resolveImageUrl(profile?.photo_url || profile?.avatar_url || undefined);

  return (
    <LinearGradient
      colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
      style={headerStyles.gradient}
    >
      <View style={headerStyles.container}>
        <View style={headerStyles.userInfo}>
          {backPosition === 'left' && showBack ? (
            <TouchableOpacity
              style={headerStyles.notificationButton}
              onPress={onBack || (() => router.back())}
              accessibilityRole="button"
            >
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="arrow-back"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          ) : null}
          {!hideAvatar && (
            <View style={headerStyles.avatar}>
              <PetImage
                source={avatarUri ? { uri: avatarUri } : undefined}
                size={48}
                borderRadius={24}
                fallbackEmoji={firstName.charAt(0).toUpperCase()}
                style={headerStyles.avatarImage}
              />
            </View>
          )}
          <View>
            {showGreeting ? (
              <Text style={headerStyles.title}>{t('common.hello_user', { defaultValue: 'Hello, {{name}}', name: firstName })}</Text>
            ) : (
              <Text style={headerStyles.title}>{title ? t(title, { defaultValue: title }) : ''}</Text>
            )}
          </View>
        </View>
        <View style={headerStyles.actions}>
          {backPosition === 'right' && showBack ? (
            <TouchableOpacity
              style={headerStyles.notificationButton}
              onPress={onBack || (() => router.back())}
              accessibilityRole="button"
            >
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="arrow-back"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          ) : null}
          {showEdit ? (
            <TouchableOpacity
              style={headerStyles.notificationButton}
              onPress={onEdit}
              accessibilityRole="button"
            >
              <IconSymbol
                ios_icon_name="pencil.circle"
                android_material_icon_name="edit"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={headerStyles.notificationButton}
            onPress={() => router.push('/(tabs)/notifications')}
            accessibilityRole="button"
          >
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={24}
              color={colors.text}
            />
            <View style={headerStyles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
