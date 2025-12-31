```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePets } from '@/hooks/usePets';
import { useLocale } from '@/hooks/useLocale';

export default function SettingsTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { pets, deletePet } = usePets();
  const pet = pets.find(p => p.id === id);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t, locale } = useLocale();

  const handleDeletePet = () => {
    Alert.alert(
      t('pet_profile.settings.alerts.delete.title'),
      t('pet_profile.settings.alerts.delete.message', { name: pet?.name }),
      [
        {
          text: t('pet_profile.settings.alerts.delete.cancel'),
          style: 'cancel',
        },
        {
          text: t('pet_profile.settings.alerts.delete.confirm'),
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deletePet(id);
              router.replace('/(tabs)/pets');
            } catch (error) {
              console.error('Failed to delete pet:', error);
              Alert.alert(t('pet_profile.settings.alerts.error.title'), t('pet_profile.settings.alerts.error.delete_failed'));
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleTransfer = () => {
    Alert.alert(t('pet_profile.settings.alerts.coming_soon.title'), t('pet_profile.settings.alerts.coming_soon.transfer'));
  };

  const handlePrivacy = () => {
    Alert.alert(t('pet_profile.settings.alerts.coming_soon.title'), t('pet_profile.settings.alerts.coming_soon.privacy'));
  };

  const handleNotifications = () => {
    Alert.alert(t('pet_profile.settings.alerts.coming_soon.title'), t('pet_profile.settings.alerts.coming_soon.notifications'));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('pet_profile.settings.sections.management')}</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={handleTransfer}
        >
          <View style={styles.iconContainer}>
            <IconSymbol android_material_icon_name="diversity_1" size={24} color="#4B5563" />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{t('pet_profile.settings.items.transfer.title')}</Text>
            <Text style={styles.itemDesc}>
              {t('pet_profile.settings.items.transfer.desc')}
            </Text>
          </View>
          <IconSymbol android_material_icon_name="chevron_right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, styles.dangerItem]}
          onPress={handleDeletePet}
          disabled={isDeleting}
        >
          <View style={[styles.iconContainer, styles.dangerIconContainer]}>
            <IconSymbol android_material_icon_name="delete" size={24} color="#EF4444" />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.dangerTitle}>
              {isDeleting ? t('pet_profile.settings.items.delete.deleting') : t('pet_profile.settings.items.delete.title')}
            </Text>
            <Text style={styles.itemDesc}>
              {t('pet_profile.settings.items.delete.desc')}
            </Text>
          </View>
          <IconSymbol android_material_icon_name="chevron_right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('pet_profile.settings.sections.privacy')}</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={handlePrivacy}
        >
          <View style={styles.iconContainer}>
            <IconSymbol android_material_icon_name="visibility" size={24} color="#4B5563" />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{t('pet_profile.settings.items.privacy_settings.title')}</Text>
            <Text style={styles.itemDesc}>
              {t('pet_profile.settings.items.privacy_settings.desc')}
            </Text>
          </View>
          <IconSymbol android_material_icon_name="chevron_right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('pet_profile.settings.sections.notifications')}</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={handleNotifications}
        >
          <View style={styles.iconContainer}>
            <IconSymbol android_material_icon_name="notifications" size={24} color="#4B5563" />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{t('pet_profile.settings.items.notifications.title')}</Text>
            <Text style={styles.itemDesc}>
              {t('pet_profile.settings.items.notifications.desc')}
            </Text>
          </View>
          <IconSymbol android_material_icon_name="chevron_right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('pet_profile.settings.info.id')} {id}
        </Text>
        <Text style={styles.footerText}>
          {t('pet_profile.settings.info.created')} {pet?.created_at ? new Date(pet.created_at).toLocaleDateString(locale) : t('common.unknown')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 12,
        color: '#6B7280',
    },
    dangerItem: {
        borderColor: '#FEE2E2',
    },
    dangerIcon: {
        backgroundColor: '#FEE2E2',
    },
    dangerText: {
        color: '#EF4444',
    },
    infoSection: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
});
