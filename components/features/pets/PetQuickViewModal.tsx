import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { Pet } from '@/types';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEvents } from '@/hooks/useEvents';
import { router } from 'expo-router';
import { useLocale } from '@/hooks/useLocale';

type Props = {
  pet: Pet;
  visible: boolean;
  onClose: () => void;
};

export default function PetQuickViewModal({ pet, visible, onClose }: Props) {
  const { events } = useEvents({ petIds: [pet.id] });
  const { t } = useLocale();

  const recentUpcoming = events.slice(0, 3);
  const completedProcedures = events.filter((e) => e.type === 'treatment' && new Date(e.dueDate).getTime() < Date.now()).slice(0, 3);

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.avatar}>
              {pet.photo_url ? (
                <Image source={{ uri: pet.photo_url }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarEmoji}>
                  {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
                </Text>
              )}
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petSubtitle}>{pet.breed || t('pets.mixed', { defaultValue: 'Mixed' })}</Text>
            </View>
            <TouchableOpacity
              style={styles.close}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('pets.close_quick_view', { defaultValue: 'Close quick view' })}
            >
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="close"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('pets.health_summary', { defaultValue: 'Health summary' })}</Text>
            <Text style={styles.cardText}>{t('pets.weight', { defaultValue: 'Weight' })}: {pet.weight ? `${pet.weight} kg` : '—'}</Text>
            <Text style={styles.cardText}>{t('pets.last_updated', { defaultValue: 'Last updated' })}: {new Date(pet.updated_at).toLocaleDateString()}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('events.upcoming_events', { defaultValue: 'Upcoming events' })}</Text>
            {recentUpcoming.length === 0 ? (
              <Text style={styles.cardText}>{t('events.no_upcoming', { defaultValue: 'No upcoming events' })}</Text>
            ) : (
              recentUpcoming.map((e) => (
                <View key={e.id} style={styles.eventRow}>
                  <View style={[styles.eventDot, { backgroundColor: e.color }]} />
                  <Text style={styles.eventText}>
                    {e.title} • {new Date(e.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('pets.recent_activity', { defaultValue: 'Recent activity' })}</Text>
            {completedProcedures.length === 0 ? (
              <Text style={styles.cardText}>{t('pets.no_recent_procedures', { defaultValue: 'No recent procedures' })}</Text>
            ) : (
              completedProcedures.map((e) => (
                <View key={e.id} style={styles.eventRow}>
                  <View style={[styles.eventDot, { backgroundColor: e.color }]} />
                  <Text style={styles.eventText}>
                    {e.title} • {new Date(e.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[buttonStyles.secondary, styles.actionButton]}
              onPress={() => {
                onClose();
                router.push(`/(tabs)/pets/pet-edit?id=${pet.id}`);
              }}
              accessibilityRole="button"
              accessibilityLabel={t('profile.edit_profile', { defaultValue: 'Edit profile' })}
            >
              <Text style={buttonStyles.text}>{t('profile.edit_profile', { defaultValue: 'Edit profile' })}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyles.secondary, styles.actionButton]}
              onPress={() => router.push(`/(tabs)/pets/add-vaccination?petId=${pet.id}`)}
              accessibilityRole="button"
              accessibilityLabel={t('calendar.add_event', { defaultValue: 'Add event' })}
            >
              <Text style={buttonStyles.text}>{t('calendar.add_event', { defaultValue: 'Add event' })}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.actionButton]}
              onPress={() => router.push(`/(tabs)/pets/pet-detail?id=${pet.id}`)}
              accessibilityRole="button"
              accessibilityLabel={t('pets.view_full_profile', { defaultValue: 'View full profile' })}
            >
              <Text style={buttonStyles.textWhite}>{t('pets.full_profile', { defaultValue: 'Full profile' })}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarEmoji: {
    fontSize: 30,
  },
  headerContent: {
    flex: 1,
  },
  petName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  petSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  close: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
    color: colors.text,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  eventText: {
    fontSize: 13,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
