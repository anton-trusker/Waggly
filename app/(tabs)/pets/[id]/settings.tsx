import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePets } from '@/hooks/usePets';
import { useLocale } from '@/hooks/useLocale';
import { useAppTheme } from '@/hooks/useAppTheme';

// Placeholder Modals - to be implemented next
import ManageAccessModal from '@/components/pet/settings/ManageAccessModal';
import PrivacySettingsModal from '@/components/pet/settings/PrivacySettingsModal';
import NotificationSettingsModal from '@/components/pet/settings/NotificationSettingsModal';
import DeletePetModal from '@/components/pet/settings/DeletePetModal';

export default function SettingsTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useAppTheme();
  const { pets, deletePet } = usePets();
  const pet = pets.find(p => p.id === id);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t, locale } = useLocale();

  // Modal states
  const [showManageAccess, setShowManageAccess] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeletePet = async () => {
    setIsDeleting(true);
    try {
      await deletePet(id);
      setShowDeleteModal(false);
      router.replace('/(tabs)/pets');
    } catch (error) {
      console.error('Failed to delete pet:', error);
      setIsDeleting(false);
      // Optional: keep modal open or show error toast
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.default }]}>

      {/* Management Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>{t('pet_profile.settings.sections.management')}</Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.background.card, borderColor: theme.colors.border.primary }]}
          onPress={() => setShowManageAccess(true)}
        >
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.background.tertiary }]}>
            <IconSymbol android_material_icon_name="group" size={24} color={theme.colors.text.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>{t('pet_profile.settings.items.transfer.title')}</Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              {t('pet_profile.settings.items.transfer.desc')}
            </Text>
          </View>
          <IconSymbol android_material_icon_name="chevron-right" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
          onPress={() => setShowDeleteModal(true)}
          disabled={isDeleting}
        >
          <View style={[styles.settingIcon, { backgroundColor: '#FEE2E2' }]}>
            <IconSymbol android_material_icon_name="delete" size={24} color="#EF4444" />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: '#B91C1C' }]}>
              {t('pet_profile.settings.items.delete.title')}
            </Text>
            <Text style={[styles.settingDescription, { color: '#EF4444' }]}>
              {t('pet_profile.settings.items.delete.desc')}
            </Text>
          </View>
          <IconSymbol android_material_icon_name="chevron-right" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>{t('pet_profile.settings.sections.privacy')}</Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.background.card, borderColor: theme.colors.border.primary }]}
          onPress={() => setShowPrivacy(true)} // Open modal (mock for now)
        >
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.background.tertiary }]}>
            <IconSymbol android_material_icon_name="visibility" size={24} color={theme.colors.text.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>{t('pet_profile.settings.items.privacy_settings.title')}</Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              {t('pet_profile.settings.items.privacy_settings.desc')}
            </Text>
          </View>
          <IconSymbol android_material_icon_name="chevron-right" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>{t('pet_profile.settings.sections.notifications')}</Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.background.card, borderColor: theme.colors.border.primary }]}
          onPress={() => setShowNotifications(true)} // Open modal (mock for now)
        >
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.background.tertiary }]}>
            <IconSymbol android_material_icon_name="notifications" size={24} color={theme.colors.text.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>{t('pet_profile.settings.items.notifications.title')}</Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
              {t('pet_profile.settings.items.notifications.desc')}
            </Text>
          </View>
          <IconSymbol android_material_icon_name="chevron-right" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('pet_profile.settings.info.id')} {id}
        </Text>
        <Text style={styles.footerText}>
          {t('pet_profile.settings.info.created')} {pet?.created_at ? new Date(pet.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : locale) : t('common.unknown')}
        </Text>
      </View>

      {/* Modals will go here */}
      <ManageAccessModal
        visible={showManageAccess}
        onClose={() => setShowManageAccess(false)}
        petId={id}
        petName={pet?.name}
      />
      <PrivacySettingsModal visible={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <NotificationSettingsModal visible={showNotifications} onClose={() => setShowNotifications(false)} />

      <DeletePetModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePet}
        petName={pet?.name}
        loading={isDeleting}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24, // Reduced padding for better mobile fit
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Plus Jakarta Sans',
  },
  settingDescription: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Plus Jakarta Sans',
  },
  footer: {
    marginTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
});
