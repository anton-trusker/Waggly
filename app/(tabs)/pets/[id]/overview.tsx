import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons'; // Added
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useAllergies } from '@/hooks/useAllergies';
import { useMedications } from '@/hooks/useMedications';
import { useConditions } from '@/hooks/useConditions'; // Added
import { useAppTheme } from '@/hooks/useAppTheme';
import { Pet, Allergy, Vaccination, Medication, Condition } from '@/types';
import VisitFormModal from '@/components/desktop/modals/VisitFormModal';
import VaccinationFormModal from '@/components/desktop/modals/VaccinationFormModal';
import TreatmentFormModal from '@/components/desktop/modals/TreatmentFormModal';
import HealthMetricsModal from '@/components/desktop/modals/HealthMetricsModal'; // Added
import AllergyModal from '@/components/desktop/modals/AllergyModal'; // Added
import QuickActionsGrid from '@/components/desktop/dashboard/QuickActionsGrid'; // Added
import ConditionFormModal from '@/components/desktop/modals/ConditionFormModal'; // Added

import MedicationFormModal from '@/components/desktop/modals/MedicationFormModal';
import EditKeyInfoModal from '@/components/pet/edit/EditKeyInfoModal';
import PetProfileCardWidget from '@/components/features/pets/profile/PetProfileCardWidget';

export default function OverviewTab() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params.id as string;
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  const isMobile = width < 768; // Mobile breakpoint

  const { theme } = useAppTheme();
  const { pets } = usePets();
  const pet = pets.find(p => p.id === petId) as Pet | undefined;

  const [visitOpen, setVisitOpen] = useState(false);
  const [vaccinationOpen, setVaccinationOpen] = useState(false);
  const [treatmentOpen, setTreatmentOpen] = useState(false);
  const [healthMetricsOpen, setHealthMetricsOpen] = useState(false); // Added
  const [allergyModalOpen, setAllergyModalOpen] = useState(false); // Added
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null); // Added
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null); // Added
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null); // Added
  const [conditionModalOpen, setConditionModalOpen] = useState(false); // Added
  const [medicationOpen, setMedicationOpen] = useState(false);
  const [editKeyInfoModalVisible, setEditKeyInfoModalVisible] = useState(false);

  const { events } = useEvents({ petIds: pet ? [pet.id] : [], startDate: new Date().toISOString().slice(0, 10) });
  const { vaccinations } = useVaccinations(petId);
  const { allergies } = useAllergies(petId);
  const { medications } = useMedications(petId);
  const { conditions } = useConditions(petId); // Added

  // Filter for upcoming events
  const upcomingEvents = events.slice(0, 2);

  // Filter for active vaccines (next due date in future or not set)
  const activeVaccines = vaccinations.filter(v => {
    if (!v.next_due_date) return true;
    return new Date(v.next_due_date) >= new Date();
  }).slice(0, 2); // Show top 2

  // Get next vaccine due date for status card
  const nextVaccineDue = vaccinations
    .filter(v => v.next_due_date && new Date(v.next_due_date) >= new Date())
    .sort((a, b) => new Date(a.next_due_date!).getTime() - new Date(b.next_due_date!).getTime())[0];

  const activeMedications = medications.slice(0, 2); // Show top 2
  const recentConditions = conditions.slice(0, 2); // Show top 2

  if (!pet) {
    return (
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>Loading pet overview...</Text>
      </View>
    );
  }

  const handleQuickAction = (id: string) => {
    switch (id) {
      case 'visit':
        setVisitOpen(true);
        break;
      case 'vaccine':
        setVaccinationOpen(true);
        break;
      case 'meds':
        setTreatmentOpen(true);
        break;
      case 'weight':
        setHealthMetricsOpen(true);
        break;
      case 'doc':
        router.push(`/(tabs)/pets/documents/add?petId=${pet.id}` as any);
        break;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>

        {/* Quick Actions (Replaced with Shared Component) */}
        <QuickActionsGrid onActionPress={handleQuickAction} />

        {/* Main Grid Content */}
        <View style={[styles.mainGrid, isLargeScreen && styles.mainGridLarge]}>

          {/* Left Column (1/3) */}
          <View style={styles.leftColumn}>

            {/* Pet Profile Card Widget */}
            <TouchableOpacity onPress={() => setEditKeyInfoModalVisible(true)}>
              <PetProfileCardWidget pet={pet} />
            </TouchableOpacity>

            {/* Allergies Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Allergies</Text>
                <TouchableOpacity
                  style={styles.addButtonSmall}
                  onPress={() => {
                    setSelectedAllergy(null);
                    setAllergyModalOpen(true);
                  }}
                >
                  <IconSymbol android_material_icon_name="add" size={16} color="#6366F1" />
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                {allergies.length > 0 ? (
                  allergies.map(a => (
                    <TouchableOpacity
                      key={a.id}
                      style={styles.allergyTag}
                      onPress={() => {
                        setSelectedAllergy(a);
                        setAllergyModalOpen(true);
                      }}
                    >
                      <Text style={styles.allergyTagText}>{a.name.toUpperCase()}</Text>
                      <IconSymbol android_material_icon_name="edit" size={12} color="#EF4444" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={[styles.allergyTag, { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }]}>
                    <Text style={[styles.allergyTagText, { color: '#6B7280' }]}>NO ALLERGIES</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Past Conditions Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Past Conditions</Text>
                <TouchableOpacity
                  style={styles.addButtonSmall}
                  onPress={() => {
                    setSelectedCondition(null);
                    setConditionModalOpen(true);
                  }}
                >
                  <IconSymbol android_material_icon_name="add" size={16} color="#6366F1" />
                </TouchableOpacity>
              </View>
              <View style={styles.timelineList}>
                {recentConditions.length > 0 ? (
                  recentConditions.map((cond, index) => (
                    <TouchableOpacity
                      key={cond.id || index}
                      style={styles.timelineItem}
                      onPress={() => {
                        setSelectedCondition(cond);
                        setConditionModalOpen(true);
                      }}
                    >
                      <View style={styles.timelineLine} />
                      <View style={styles.timelineDotGray} />
                      <View style={styles.timelineContentBox}>
                        <View style={styles.timelineHeaderRow}>
                          <Text style={styles.timelineItemTitle}>{cond.name}</Text>
                          <View style={styles.timelineDateBadge}>
                            <Text style={styles.timelineDateBadgeText}>
                              {cond.diagnosed_date ? new Date(cond.diagnosed_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.timelineItemDesc}>{cond.description || cond.treatment_plan || cond.notes || 'No details'}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ color: '#9CA3AF', fontStyle: 'italic', marginLeft: 8 }}>No past conditions recorded.</Text>
                )}
              </View>
            </View>

          </View>

          {/* Right Column (2/3) */}
          <View style={styles.rightColumn}>

            {/* Health Status Gradient Card */}
            <LinearGradient
              colors={['#6366F1', '#9333EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientCard}
            >
              <View style={styles.gradientCardContent}>
                <View>
                  <Text style={styles.gradientCardLabel}>HEALTH STATUS</Text>
                  <Text style={styles.gradientCardTitle}>Vaccines Up to Date</Text>
                  {nextVaccineDue && (
                    <View style={styles.gradientCardSubtitleRow}>
                      <IconSymbol android_material_icon_name="event" size={16} color="#E0E7FF" />
                      <Text style={styles.gradientCardSubtitle}>
                        Next Due: {new Date(nextVaccineDue.next_due_date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    onPress={() => setHealthMetricsOpen(true)}
                  >
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Update Status</Text>
                    <IconSymbol android_material_icon_name="arrow-forward" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.verifiedIconBox}>
                  <IconSymbol android_material_icon_name="verified-user" size={24} color="#6366F1" />
                </View>
              </View>
            </LinearGradient>

            {/* Grid for Meds and Vaccines */}
            <View style={[styles.subGrid, isLargeScreen && styles.subGridLarge]}>

              {/* Current Medications */}
              <View style={[styles.card, styles.flex1]}>
                <View style={styles.listHeader}>
                  <Text style={styles.listTitle}>Current Medications</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedMedication(null);
                      setMedicationOpen(true);
                    }}
                    style={styles.addButton}
                  >
                    <Ionicons name="add" size={16} color="#ffffff" />
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listContainer}>
                  {activeMedications.length > 0 ? activeMedications.map(med => (
                    <TouchableOpacity
                      key={med.id}
                      style={styles.listItem}
                      onPress={() => {
                        setSelectedMedication(med);
                        setMedicationOpen(true);
                      }}
                    >
                      <View style={[styles.listIconBox, { backgroundColor: '#DBEAFE' }]}>
                        <Ionicons name="medkit" size={18} color="#2563EB" />
                      </View>
                      <View style={styles.listItemContent}>
                        <Text style={styles.listItemTitle}>{med.medication_name}</Text>
                        <Text style={styles.listItemSubtitle}>{med.dosage_value}{med.dosage_unit} • {med.frequency}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  )) : (
                    <Text style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No active medications.</Text>
                  )}
                </View>
              </View>

              {/* Vaccinations */}
              <View style={[styles.card, styles.flex1]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Vaccinations</Text>
                  <TouchableOpacity onPress={() => router.push(`/(tabs)/pets/${petId}/passport` as any)}>
                    <Text style={styles.editLink}>See All</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.listContainer}>
                  {activeVaccines.length > 0 ? activeVaccines.map(vac => (
                    <TouchableOpacity
                      key={vac.id}
                      style={styles.listItem}
                      onPress={() => {
                        setSelectedVaccination(vac);
                        setVaccinationOpen(true);
                      }}
                    >
                      <View style={[styles.listIconBox, { backgroundColor: '#F3E8FF' }]}>
                        <IconSymbol android_material_icon_name="vaccines" size={20} color="#9333EA" />
                      </View>
                      <View style={styles.listItemContent}>
                        <Text style={styles.listItemTitle}>{vac.vaccine_name}</Text>
                        <Text style={styles.listItemSubtitle}>Valid until {vac.next_due_date ? new Date(vac.next_due_date).getFullYear() : 'N/A'}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                        <Text style={[styles.statusBadgeText, { color: '#10B981' }]}>ACTIVE</Text>
                      </View>
                    </TouchableOpacity>
                  )) : (
                    <Text style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No active vaccinations.</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Upcoming */}
            <View style={styles.card}>
              <View style={[styles.cardHeader, { justifyContent: 'flex-start', gap: 8 }]}>
                <View style={styles.orangeDot} />
                <Text style={styles.cardTitle}>Upcoming</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')}>
                  <Text style={styles.editLink}>See All</Text>
                </TouchableOpacity>
              </View>
              {/* Note: Upcoming Body Render Left Unchanged as logic is complex for mobile, but 'See All' is connected in header */}


              {isMobile ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.mobileUpcomingContainer}
                  style={{ marginHorizontal: -24, paddingHorizontal: 24 }} // Offset card padding
                >
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => {
                      const days = Math.floor((new Date(event.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const isUrgent = days < 3;
                      const dateObj = new Date(event.dueDate);

                      return (
                        <View key={event.id} style={styles.mobileUpcomingCard}>
                          <View style={styles.upcomingHeader}>
                            <View style={[styles.upcomingIconBox, { backgroundColor: event.color + '20' }]}>
                              {/* Simple mapping for icon based on type, or default */}
                              <IconSymbol android_material_icon_name={event.type === 'vet' ? 'healing' : 'event'} size={20} color={event.color} />
                            </View>
                            <View style={[styles.upcomingBadge, { backgroundColor: isUrgent ? '#FEE2E2' : '#DBEAFE' }]}>
                              <Text style={[styles.upcomingBadgeText, { color: isUrgent ? '#DC2626' : '#2563EB' }]}>
                                {days < 0 ? 'OVERDUE' : days === 0 ? 'TODAY' : `${days} DAYS`}
                              </Text>
                            </View>
                          </View>
                          <View style={{ marginBottom: 12 }}>
                            <Text style={styles.upcomingTitle} numberOfLines={1}>{event.title}</Text>
                            <Text style={styles.upcomingSubtitle} numberOfLines={1}>{event.notes || event.type}</Text>
                          </View>
                          <View style={styles.upcomingFooter}>
                            <Text style={styles.upcomingDate}>
                              {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {', '}
                              {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </View>
                        </View>
                      )
                    })
                  ) : (
                    <View style={[styles.mobileUpcomingCard, { alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
                      <Text style={{ color: '#9CA3AF' }}>No upcoming events.</Text>
                    </View>
                  )}
                </ScrollView>
              ) : (
                <View style={[styles.subGrid, isLargeScreen && styles.subGridLarge]}>
                  <View style={[styles.upcomingCard, styles.flex1]}>
                    <View style={styles.upcomingHeader}>
                      <View style={[styles.upcomingIconBox, { backgroundColor: '#FEE2E2' }]}>
                        <IconSymbol android_material_icon_name="healing" size={20} color="#DC2626" />
                      </View>
                      <View style={[styles.upcomingBadge, { backgroundColor: '#FEE2E2' }]}>
                        <Text style={[styles.upcomingBadgeText, { color: '#DC2626' }]}>3 DAYS</Text>
                      </View>
                    </View>
                    <View style={{ marginBottom: 12 }}>
                      <Text style={styles.upcomingTitle}>Rabies Booster</Text>
                      <Text style={styles.upcomingSubtitle}>Downtown Vet Clinic</Text>
                    </View>
                    <View style={styles.upcomingFooter}>
                      <Text style={styles.upcomingDate}>Oct 15, 09:00 AM</Text>
                      <IconSymbol android_material_icon_name="chevron-right" size={20} color="#9CA3AF" />
                    </View>
                  </View>

                  <View style={[styles.upcomingCard, styles.flex1]}>
                    <View style={styles.upcomingHeader}>
                      <View style={[styles.upcomingIconBox, { backgroundColor: '#DBEAFE' }]}>
                        <IconSymbol android_material_icon_name="content-cut" size={20} color="#2563EB" />
                      </View>
                    </View>
                    <View style={{ marginBottom: 12 }}>
                      <Text style={styles.upcomingTitle}>Grooming</Text>
                      <Text style={styles.upcomingSubtitle}>Paw Spa & Resort</Text>
                    </View>
                    <View style={styles.upcomingFooter}>
                      <Text style={styles.upcomingDate}>Oct 20, 02:00 PM</Text>
                      <IconSymbol android_material_icon_name="chevron-right" size={20} color="#9CA3AF" />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* History Timeline */}
            <View style={styles.card}>
              <Text style={[styles.cardTitle, { marginBottom: 24 }]}>History & Timeline</Text>
              <View style={styles.timelineList}>
                {/* Item 1 */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLine} />
                  <View style={styles.timelineDotPrimary}>
                    <View style={styles.timelineDotInner} />
                  </View>
                  <View style={styles.timelineContentBox}>
                    <View style={styles.timelineHeaderRow}>
                      <View style={styles.timelineTitleGroup}>
                        <View style={[styles.timelineIconSmall, { backgroundColor: '#DBEAFE' }]}>
                          <IconSymbol android_material_icon_name="medical-services" size={14} color="#2563EB" />
                        </View>
                        <Text style={styles.timelineItemTitle}>Dental Cleaning</Text>
                      </View>
                      <Text style={styles.timelineDateText}>12 Oct</Text>
                    </View>
                    <Text style={styles.timelineSubtitle}>Pawzly Vet Clinic • Dr. Smith</Text>
                    <View style={styles.timelineNoteBox}>
                      <Text style={styles.timelineNoteText}>Routine cleaning completed. Mild gingivitis noted on upper molars.</Text>
                    </View>
                  </View>
                </View>

                {/* Item 2 */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLine} />
                  <View style={styles.timelineDotGray}>
                    <View style={styles.timelineDotInnerGray} />
                  </View>
                  <View style={styles.timelineContentBox}>
                    <View style={styles.timelineHeaderRow}>
                      <View style={styles.timelineTitleGroup}>
                        <View style={[styles.timelineIconSmall, { backgroundColor: '#D1FAE5' }]}>
                          <IconSymbol android_material_icon_name="monitor-weight" size={14} color="#059669" />
                        </View>
                        <Text style={styles.timelineItemTitle}>Weight Logged</Text>
                      </View>
                      <Text style={styles.timelineDateText}>01 Oct</Text>
                    </View>
                    <View style={styles.weightRow}>
                      <Text style={styles.weightValue}>24.5 kg</Text>
                      <Text style={styles.weightChange}>(+0.2)</Text>
                    </View>
                  </View>
                </View>

                {/* Item 3 */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDotGray}>
                    <View style={styles.timelineDotInnerGray} />
                  </View>
                  <View style={styles.timelineContentBox}>
                    <View style={styles.timelineHeaderRow}>
                      <View style={styles.timelineTitleGroup}>
                        <View style={[styles.timelineIconSmall, { backgroundColor: '#CCFBF1' }]}>
                          <IconSymbol android_material_icon_name="healing" size={14} color="#0D9488" />
                        </View>
                        <Text style={styles.timelineItemTitle}>Dewclaw Removal</Text>
                      </View>
                      <Text style={styles.timelineDateText}>28 Aug</Text>
                    </View>
                    <Text style={styles.timelineSubtitle}>Pawzly Vet Clinic • Surgery</Text>
                    <View style={styles.timelineNoteBox}>
                      <Text style={styles.timelineNoteText}>Healed well. Stitches removed. Patient is recovering nicely.</Text>
                    </View>
                  </View>
                </View>

              </View>
              <TouchableOpacity style={styles.viewTimelineBtn}>
                <Text style={styles.viewTimelineText}>View Full Timeline</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* Floating Add Button for Mobile */}
        {!isLargeScreen && (
          <TouchableOpacity style={styles.fab}>
            <IconSymbol android_material_icon_name="add" size={24} color="#fff" />
          </TouchableOpacity>
        )}

      </View>

      {/* Modals */}
      <VisitFormModal visible={visitOpen} petId={pet.id} onClose={() => setVisitOpen(false)} />
      <VaccinationFormModal
        visible={vaccinationOpen}
        petId={pet.id}
        existingVaccination={selectedVaccination}
        onClose={() => setVaccinationOpen(false)}
        onSuccess={() => {
          // Maybe refresh? Hook handles it typically
          setVaccinationOpen(false);
        }}
      />
      <TreatmentFormModal visible={treatmentOpen} petId={pet.id} onClose={() => setTreatmentOpen(false)} />

      <HealthMetricsModal
        visible={healthMetricsOpen}
        petId={pet.id}
        onClose={() => setHealthMetricsOpen(false)}
        initialTab="weight"
      />

      <MedicationFormModal
        visible={medicationOpen}
        petId={pet.id}
        existingMedication={selectedMedication}
        onClose={() => setMedicationOpen(false)}
        onSuccess={() => {
          setMedicationOpen(false);
          // Refresh logic handled by hook subscription ideally
        }}
      />
      <EditKeyInfoModal
        visible={editKeyInfoModalVisible}
        onClose={() => setEditKeyInfoModalVisible(false)}
        petId={pet.id}
      />
      <ConditionFormModal
        visible={conditionModalOpen}
        petId={pet.id}
        existingCondition={selectedCondition}
        onClose={() => setConditionModalOpen(false)}
        onSuccess={() => {
          setConditionModalOpen(false);
          refreshConditions();
        }}
      />
      <AllergyModal
        visible={allergyModalOpen}
        onClose={() => setAllergyModalOpen(false)}
        petId={pet.id}
        existingAllergy={selectedAllergy}
      />
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F8',
  },
  content: {
    gap: 16, // Reduced from 24
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },
  contentMobile: {
    paddingHorizontal: 16, // Added padding for mobile
    paddingVertical: 12,
    gap: 16,
  },
  // Mobile Quick Actions Styles - (Kept if needed, though replaced by component)
  mobileQuickActionsScroll: {
    marginBottom: 16, // Reduced
    paddingLeft: 16, // Match content padding
  },
  mobileQuickActionsContainer: {
    gap: 12,
    paddingRight: 16,
  },
  mobileQuickAction: {
    alignItems: 'center',
    gap: 8,
  },
  mobileQuickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileQuickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Reduced
  },
  mobileUpcomingContainer: {
    gap: 12,
    paddingRight: 16,
  },
  mobileUpcomingCard: {
    width: 240, // Reduced width
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12, // Reduced
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  mainGrid: {
    flexDirection: 'column',
    gap: 16, // Reduced
  },
  mainGridLarge: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Prevent stretching
  },
  leftColumn: {
    flex: 1, // 1/3
    gap: 16, // Reduced
    minWidth: 300,
  },
  rightColumn: {
    flex: 2, // 2/3
    gap: 16, // Reduced
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12, // Reduced radius
    padding: 16, // Reduced from 24
    borderWidth: 1,
    borderColor: '#E5E7EB',
    // Reduced shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // Reduced from 16
  },
  cardTitle: {
    fontSize: 16, // Reduced from 18
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Plus Jakarta Sans',
  },
  editLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
    fontFamily: 'Plus Jakarta Sans',
  },
  infoList: {
    gap: 12, // Reduced
  },
  infoItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 10, // Reduced from 12
    borderRadius: 10,
  },
  infoItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIconBox: {
    width: 32, // Reduced from 36
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 10, // Reduced
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: 'Plus Jakarta Sans',
  },
  infoValueMono: {
    fontSize: 14, // Reduced
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'monospace',
  },
  infoGrid2: {
    flexDirection: 'row',
    gap: 10,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 10,
  },
  infoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Plus Jakarta Sans',
  },
  addButtonSmall: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FFF1F2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  allergyTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E11D48',
    fontFamily: 'Plus Jakarta Sans',
  },
  gradientCard: {
    borderRadius: 12,
    padding: 1, // Border
  },
  gradientCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)', // Transparent overlay
    padding: 16,
    borderRadius: 11,
  },
  gradientCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  gradientCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Plus Jakarta Sans',
  },
  gradientCardSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  gradientCardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Plus Jakarta Sans',
  },
  verifiedIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  subGridLarge: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    gap: 12,
  },
  listIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Plus Jakarta Sans',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Plus Jakarta Sans',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
  },
  upcomingCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12, // Compact
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  upcomingIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  upcomingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Plus Jakarta Sans',
  },
  upcomingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Plus Jakarta Sans',
  },
  upcomingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 8,
  },
  upcomingDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  timelineList: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 20, // Reduced from default
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 5, // Center of 10px dot
    top: 10,
    bottom: 0,
    width: 2,
    backgroundColor: '#F3F4F6',
    zIndex: 0,
  },
  timelineDotPrimary: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    zIndex: 1,
    marginRight: 12,
  },
  timelineDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  timelineDotGray: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
    zIndex: 1,
    marginRight: 12,
  },
  timelineDotInnerGray: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
  },
  timelineContentBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timelineTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineIconSmall: {
    padding: 6,
    borderRadius: 8,
  },
  timelineItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  timelineDateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  timelineNoteBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  timelineNoteText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  timelineDateBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timelineDateBadgeText: {
    fontSize: 12,
    color: '#4B5563',
  },
  timelineItemDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  weightChange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  viewTimelineBtn: {
    alignItems: 'center',
    marginTop: -8,
  },
  viewTimelineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
