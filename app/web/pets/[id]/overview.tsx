import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useAllergies } from '@/hooks/useAllergies';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Pet } from '@/types';

export default function OverviewTab() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params.id as string;
  const { theme } = useAppTheme();
  const { pets } = usePets();
  const pet = pets.find(p => p.id === petId) as Pet | undefined;
  const { events } = useEvents({ petIds: pet ? [pet.id] : [], startDate: new Date().toISOString().slice(0, 10) });
  const { vaccinations } = useVaccinations(petId);
  const { allergies } = useAllergies(petId);

  const upcomingEvents = events.slice(0, 2);
  const activeVaccines = vaccinations.filter(v => {
    if (!v.next_due_date) return true;
    const due = new Date(v.next_due_date);
    const today = new Date();
    return due >= today;
  });

  const getAge = () => {
    if (!pet.birth_date) return 'Unknown';
    const birth = new Date(pet.birth_date);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    if (years > 0) return `${years} Yr${years > 1 ? 's' : ''}`;
    return `${months} Mo${months > 1 ? 's' : ''}`;
  };

  const getLocation = () => {
    const addr = pet.address_json as any;
    if (addr?.city && addr?.country) return `${addr.city}, ${addr.country}`;
    if (addr?.city) return addr.city;
    return null;
  };

  if (!pet) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 16, color: theme.colors.text.secondary }}>Loading pet overview...</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.primary }]} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]} onPress={() => router.push(`/web/pets/${pet.id}/health/visit` as any)}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE', borderColor: '#DBEAFE' }]}>
                <IconSymbol ios_icon_name="calendar.badge.plus" android_material_icon_name="calendar-add-on" size={20} color="#2563EB" />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text.primary }]}>Add Visit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]} onPress={() => router.push(`/web/pets/${pet.id}/health/vaccination` as any)}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FCE7F3', borderColor: '#FCE7F3' }]}>
                <IconSymbol ios_icon_name="cross.vial" android_material_icon_name="vaccines" size={20} color="#DB2777" />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text.primary }]}>Add Vaccine</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]} onPress={() => router.push(`/web/pets/${pet.id}/health/treatment` as any)}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F3E8FF', borderColor: '#F3E8FF' }]}>
                <IconSymbol ios_icon_name="pills" android_material_icon_name="medication" size={20} color="#9333EA" />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text.primary }]}>Add Tx</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]} onPress={() => router.push(`/web/pets/photos/add` as any)}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7', borderColor: '#FEF3C7' }]}>
                <IconSymbol ios_icon_name="photo.badge.plus" android_material_icon_name="add-a-photo" size={20} color="#D97706" />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text.primary }]}>Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]} onPress={() => router.push(`/web/pets/${pet.id}/health/visit` as any)}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFEDD5', borderColor: '#FFEDD5' }]}>
                <IconSymbol ios_icon_name="note.text.badge.plus" android_material_icon_name="note-add" size={20} color="#EA580C" />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text.primary }]}>Add Doc</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]} onPress={() => router.push(`/web/pets/${pet.id}/health/visit` as any)}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#D1FAE5', borderColor: '#D1FAE5' }]}>
                <IconSymbol ios_icon_name="list.bullet.clipboard" android_material_icon_name="history-edu" size={20} color="#059669" />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text.primary }]}>Add Record</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Key Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Key Info</Text>
            <TouchableOpacity>
              <Text style={[styles.linkText, { color: theme.colors.primary[500] }]}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]}>
            <View style={styles.infoRow}>
              <View style={styles.infoCell}>
                <View style={[styles.infoIcon, { backgroundColor: '#DBEAFE' }]}>
                  <IconSymbol ios_icon_name="qrcode" android_material_icon_name="qr-code" size={18} color="#2563EB" />
                </View>
                <View>
                  <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Microchip ID</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{pet.chip_number || '—'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.copyButton}>
                <IconSymbol ios_icon_name="doc.on.doc" android_material_icon_name="content-copy" size={16} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoCell}>
                <View style={[styles.statusDot, { backgroundColor: pet.is_spayed_neutered ? '#10B981' : '#6B7280' }]} />
                <View>
                  <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Status</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{pet.is_spayed_neutered ? 'Neutered' : 'Intact'}</Text>
                </View>
              </View>
              <View style={styles.infoCell}>
                <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
                <View>
                  <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Blood Type</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{pet.blood_type || '—'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoCell}>
                <View style={[styles.infoIcon, { backgroundColor: '#F3E8FF' }]}>
                  <IconSymbol ios_icon_name="paintbrush" android_material_icon_name="palette" size={18} color="#9333EA" />
                </View>
                <View>
                  <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Color</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{pet.color || '—'}</Text>
                </View>
              </View>
              <View style={styles.infoCell}>
                <View style={[styles.infoIcon, { backgroundColor: '#FEF3C7' }]}>
                  <IconSymbol ios_icon_name="calendar" android_material_icon_name="calendar-today" size={18} color="#D97706" />
                </View>
                <View>
                  <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Date of Birth</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{pet.birth_date ? new Date(pet.birth_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Allergies */}
        {allergies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Allergies</Text>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: theme.colors.primary[500] }]}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.card, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]}>
              {allergies.map((a) => (
                <View key={a.id} style={[styles.allergyRow, { borderBottomColor: theme.colors.border.primary }]}>
                  <View style={styles.allergyLeft}>
                    <IconSymbol ios_icon_name="exclamationmark.triangle" android_material_icon_name="warning" size={16} color="#EF4444" />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={[styles.allergyName, { color: theme.colors.text.primary }]}>{a.name}</Text>
                      <Text style={[styles.allergyDesc, { color: theme.colors.text.secondary }]}>{a.notes || 'No description'}</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <IconSymbol ios_icon_name="xmark" android_material_icon_name="close" size={16} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addButton}>
                <Text style={[styles.addButtonText, { color: theme.colors.primary[500] }]}>+ Add Allergy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Health Status */}
        <View style={styles.section}>
          <View style={[styles.healthCard, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]}>
            <View style={styles.healthCardContent}>
              <View>
                <Text style={[styles.healthLabel, { color: theme.colors.text.secondary }]}>HEALTH STATUS</Text>
                <Text style={[styles.healthTitle, { color: theme.colors.text.primary }]}>Vaccines Up to Date</Text>
                {activeVaccines.length > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={14} color={theme.colors.text.secondary} />
                    <Text style={[styles.healthSubtitle, { color: theme.colors.text.secondary }]}>Next Due: {new Date(activeVaccines[0].next_due_date || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                  </View>
                )}
              </View>
              <View style={[styles.healthIcon, { backgroundColor: '#DBEAFE' }]}>
                <IconSymbol ios_icon_name="checkmark.seal" android_material_icon_name="verified-user" size={24} color="#2563EB" />
              </View>
            </View>
          </View>
        </View>

        {/* Upcoming Care */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' }} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Upcoming</Text>
              </View>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: theme.colors.primary[500] }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              {upcomingEvents.map((e) => (
                <TouchableOpacity key={e.id} style={[styles.upcomingCard, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]}>
                  <View style={styles.upcomingLeft}>
                    <View style={[styles.upcomingIcon, { backgroundColor: '#FEE2E2', borderColor: '#FEE2E2' }]}>
                      <IconSymbol ios_icon_name="calendar.badge.clock" android_material_icon_name="event" size={18} color="#DC2626" />
                    </View>
                    <View>
                      <Text style={[styles.upcomingTitle, { color: theme.colors.text.primary }]}>{e.title}</Text>
                      <Text style={[styles.upcomingSubtitle, { color: theme.colors.text.secondary }]}>{e.location || 'No location'}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.upcomingBadge, { color: '#DC2626', backgroundColor: '#FEE2E2' }]}>3 DAYS</Text>
                    <Text style={[styles.upcomingDate, { color: theme.colors.text.secondary }]}>{new Date(e.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>History & Timeline</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]}>
            {/* Placeholder timeline items */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#2563EB', borderColor: theme.colors.background.tertiary }]} />
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[styles.timelineIcon, { backgroundColor: '#DBEAFE' }]}>
                      <IconSymbol ios_icon_name="stethoscope" android_material_icon_name="medical_services" size={14} color="#2563EB" />
                    </View>
                    <Text style={[styles.timelineTitle, { color: theme.colors.text.primary }]}>Dental Cleaning</Text>
                  </View>
                  <Text style={[styles.timelineDate, { color: theme.colors.text.secondary }]}>Oct 12</Text>
                </View>
                <Text style={[styles.timelineSubtitle, { color: theme.colors.text.secondary }]}>Pawzly Vet Clinic • Dr. Smith</Text>
                <View style={[styles.timelineNote, { backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.primary }]}>
                  <Text style={[styles.timelineNoteText, { color: theme.colors.text.secondary }]}>Routine cleaning completed. Mild gingivitis noted on upper molars.</Text>
                </View>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#6B7280', borderColor: theme.colors.background.tertiary }]} />
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[styles.timelineIcon, { backgroundColor: '#F3F4F6' }]}>
                      <IconSymbol ios_icon_name="scalemass" android_material_icon_name="monitor_weight" size={14} color="#6B7280" />
                    </View>
                    <Text style={[styles.timelineTitle, { color: theme.colors.text.primary }]}>Weight Logged</Text>
                  </View>
                  <Text style={[styles.timelineDate, { color: theme.colors.text.secondary }]}>Oct 1</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.timelineWeight, { color: theme.colors.text.primary }]}>24.5 kg</Text>
                  <Text style={[styles.timelineChange, { color: '#10B981' }]}>+0.2 kg</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={{ marginTop: 16 }}>
              <Text style={[styles.linkText, { color: theme.colors.primary[500] }]}>View Full Timeline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: 100,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  infoCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  copyButton: {
    padding: 8,
  },
  allergyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  allergyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  allergyName: {
    fontSize: 14,
    fontWeight: '600',
  },
  allergyDesc: {
    fontSize: 12,
  },
  addButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  healthCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  healthCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  healthLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  healthTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  healthSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  healthIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  upcomingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  upcomingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  upcomingSubtitle: {
    fontSize: 12,
  },
  upcomingBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingDate: {
    fontSize: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    gap: 8,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineDate: {
    fontSize: 12,
  },
  timelineSubtitle: {
    fontSize: 12,
  },
  timelineNote: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  timelineNoteText: {
    fontSize: 12,
    lineHeight: 16,
  },
  timelineWeight: {
    fontSize: 16,
    fontWeight: '700',
  },
  timelineChange: {
    fontSize: 12,
    fontWeight: '600',
  },
});
