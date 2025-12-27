import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useAllergies } from '@/hooks/useAllergies';
import { useMedications } from '@/hooks/useMedications';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Pet } from '@/types';
import MobileHeader from '@/components/layout/MobileHeader';
import WidgetGrid from '@/components/widgets/WidgetGrid';

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

  // Modal states removed - use global plus button instead

  const { events } = useEvents({ petIds: pet ? [pet.id] : [], startDate: new Date().toISOString().slice(0, 10) });
  const { vaccinations } = useVaccinations(petId);
  const { allergies } = useAllergies(petId);
  const { medications } = useMedications(petId);

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

  if (!pet) {
    return (
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>Loading pet overview...</Text>
      </View>
    );
  }

  // Quick actions removed - use global plus button for actions

  return (
    <>
      <MobileHeader title={pet.name} showBack={true} showNotifications={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, isMobile && styles.contentMobile]}>

          {/* Quick actions removed - use global plus button */}

          {/* Main Grid Content */}
          <View style={[styles.mainGrid, isLargeScreen && styles.mainGridLarge]}>

            {/* Left Column (1/3) */}
            <View style={styles.leftColumn}>

              {/* Key Info Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Key Info</Text>
                  <TouchableOpacity>
                    <Text style={styles.editLink}>Edit</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.infoList}>
                  {/* Microchip */}
                  <View style={styles.infoItemRow}>
                    <View style={styles.infoItemContent}>
                      <View style={[styles.infoIconBox, { backgroundColor: '#DBEAFE' }]}>
                        <IconSymbol android_material_icon_name="qr-code" size={20} color="#2563EB" />
                      </View>
                      <View>
                        <Text style={styles.infoLabel}>MICROCHIP ID</Text>
                        <Text style={styles.infoValueMono}>{pet.chip_number || '—'}</Text>
                      </View>
                    </View>
                    <TouchableOpacity>
                      <IconSymbol android_material_icon_name="content-copy" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Species & Blood Type */}
                  <View style={styles.infoGrid2}>
                    <View style={styles.infoBox}>
                      <View style={styles.infoBoxHeader}>
                        <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                        <Text style={styles.infoLabel}>SPECIES</Text>
                      </View>
                      <Text style={styles.infoValue}>{pet.species}</Text>
                    </View>
                    <View style={styles.infoBox}>
                      <View style={styles.infoBoxHeader}>
                        <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.infoLabel}>BLOOD TYPE</Text>
                      </View>
                      <Text style={styles.infoValue}>{pet.blood_type || '—'}</Text>
                    </View>
                  </View>

                  {/* Color & DOB */}
                  <View style={styles.infoGrid2}>
                    <View style={styles.infoBox}>
                      <Text style={[styles.infoLabel, { marginBottom: 4 }]}>COLOR</Text>
                      <Text style={styles.infoValue}>{pet.color || '—'}</Text>
                    </View>
                    <View style={styles.infoBox}>
                      <Text style={[styles.infoLabel, { marginBottom: 4 }]}>DATE OF BIRTH</Text>
                      <Text style={styles.infoValue}>
                        {pet.birth_date ? new Date(pet.birth_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Allergies Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Allergies</Text>
                  <TouchableOpacity style={styles.addButtonSmall}>
                    <IconSymbol android_material_icon_name="add" size={16} color="#6366F1" />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsContainer}>
                  {allergies.length > 0 ? (
                    allergies.map(a => (
                      <View key={a.id} style={styles.allergyTag}>
                        <Text style={styles.allergyTagText}>{a.name.toUpperCase()}</Text>
                        <TouchableOpacity>
                          <IconSymbol android_material_icon_name="close" size={14} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <View style={[styles.allergyTag, { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }]}>
                      <Text style={[styles.allergyTagText, { color: '#6B7280' }]}>NO ALLERGIES</Text>
                    </View>
                  )}
                  {/* Example Mock Tags if empty to match design */}
                  {allergies.length === 0 && (
                    <>
                      <View style={[styles.allergyTag, { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }]}>
                        <Text style={[styles.allergyTagText, { color: '#EF4444' }]}>CHICKEN PROTOCOL</Text>
                        <IconSymbol android_material_icon_name="close" size={14} color="#EF4444" />
                      </View>
                      <View style={[styles.allergyTag, { backgroundColor: '#FEFCE8', borderColor: '#FEF9C3' }]}>
                        <Text style={[styles.allergyTagText, { color: '#CA8A04' }]}>POLLEN</Text>
                        <IconSymbol android_material_icon_name="close" size={14} color="#CA8A04" />
                      </View>
                    </>
                  )}
                </View>
              </View>

              {/* Past Conditions Card (Mock Data based on Design) */}
              <View style={styles.card}>
                <Text style={[styles.cardTitle, { marginBottom: 16 }]}>Past Conditions</Text>
                <View style={styles.timelineList}>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLine} />
                    <View style={styles.timelineDotGray} />
                    <View style={styles.timelineContentBox}>
                      <View style={styles.timelineHeaderRow}>
                        <Text style={styles.timelineItemTitle}>Otitis Externa</Text>
                        <View style={styles.timelineDateBadge}>
                          <Text style={styles.timelineDateBadgeText}>Oct 2023</Text>
                        </View>
                      </View>
                      <Text style={styles.timelineItemDesc}>Resolved with drops.</Text>
                    </View>
                  </View>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineDotGray} />
                    <View style={styles.timelineContentBox}>
                      <View style={styles.timelineHeaderRow}>
                        <Text style={styles.timelineItemTitle}>Mild Gastroenteritis</Text>
                        <View style={styles.timelineDateBadge}>
                          <Text style={styles.timelineDateBadgeText}>Feb 2023</Text>
                        </View>
                      </View>
                      <Text style={styles.timelineItemDesc}>Dietary indiscretion.</Text>
                    </View>
                  </View>
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
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Current Medications</Text>
                    <TouchableOpacity><Text style={styles.editLink}>Manage</Text></TouchableOpacity>
                  </View>
                  <View style={styles.listContainer}>
                    {activeMedications.length > 0 ? activeMedications.map(med => (
                      <View key={med.id} style={styles.listItem}>
                        <View style={[styles.listIconBox, { backgroundColor: '#E0E7FF', borderColor: 'transparent' }]}>
                          <IconSymbol android_material_icon_name="medication" size={20} color="#4F46E5" />
                        </View>
                        <View style={styles.listItemContent}>
                          <Text style={styles.listItemTitle}>{med.medication_name}</Text>
                          <Text style={styles.listItemSubtitle}>{med.dosage_value}{med.dosage_unit} • {med.frequency}</Text>
                        </View>
                        <View style={[styles.badgePill, { backgroundColor: '#6366F1' }]}>
                          <Text style={styles.badgePillText}>DAILY</Text>
                        </View>
                      </View>
                    )) : (
                      // Mock data if empty to match design
                      <>
                        <View style={styles.listItem}>
                          <View style={[styles.listIconBox, { backgroundColor: '#E0E7FF' }]}>
                            <IconSymbol android_material_icon_name="medication" size={20} color="#4F46E5" />
                          </View>
                          <View style={styles.listItemContent}>
                            <Text style={styles.listItemTitle}>Apoquel</Text>
                            <Text style={styles.listItemSubtitle}>5mg • Twice Daily</Text>
                          </View>
                          <View style={[styles.badgePill, { backgroundColor: '#6366F1' }]}>
                            <Text style={styles.badgePillText}>DAILY</Text>
                          </View>
                        </View>
                        <View style={styles.listItem}>
                          <View style={[styles.listIconBox, { backgroundColor: '#FFEDD5' }]}>
                            <IconSymbol android_material_icon_name="medication" size={20} color="#EA580C" />
                          </View>
                          <View style={styles.listItemContent}>
                            <Text style={styles.listItemTitle}>Heartgard Plus</Text>
                            <Text style={styles.listItemSubtitle}>1 Chew • Day 15</Text>
                          </View>
                          <View style={[styles.badgePill, { backgroundColor: '#F97316' }]}>
                            <Text style={styles.badgePillText}>MONTHLY</Text>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </View>

                {/* Vaccinations */}
                <View style={[styles.card, styles.flex1]}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Vaccinations</Text>
                    <TouchableOpacity><Text style={styles.editLink}>See All</Text></TouchableOpacity>
                  </View>
                  <View style={styles.listContainer}>
                    {activeVaccines.length > 0 ? activeVaccines.map(vac => (
                      <View key={vac.id} style={styles.listItem}>
                        <View style={[styles.listIconBox, { backgroundColor: '#F3E8FF' }]}>
                          <IconSymbol android_material_icon_name="vaccines" size={20} color="#9333EA" />
                        </View>
                        <View style={styles.listItemContent}>
                          <Text style={styles.listItemTitle}>{vac.name}</Text>
                          <Text style={styles.listItemSubtitle}>Valid until {vac.next_due_date ? new Date(vac.next_due_date).getFullYear() : 'N/A'}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                          <Text style={[styles.statusBadgeText, { color: '#10B981' }]}>ACTIVE</Text>
                        </View>
                      </View>
                    )) : (
                      // Mock data
                      <>
                        <View style={styles.listItem}>
                          <View style={[styles.listIconBox, { backgroundColor: '#F3E8FF' }]}>
                            <IconSymbol android_material_icon_name="vaccines" size={20} color="#9333EA" />
                          </View>
                          <View style={styles.listItemContent}>
                            <Text style={styles.listItemTitle}>Rabies</Text>
                            <Text style={styles.listItemSubtitle}>Valid until 12 Oct 2025</Text>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                            <Text style={[styles.statusBadgeText, { color: '#10B981' }]}>ACTIVE</Text>
                          </View>
                        </View>
                        <View style={styles.listItem}>
                          <View style={[styles.listIconBox, { backgroundColor: '#F3E8FF' }]}>
                            <IconSymbol android_material_icon_name="vaccines" size={20} color="#9333EA" />
                          </View>
                          <View style={styles.listItemContent}>
                            <Text style={styles.listItemTitle}>DHPP</Text>
                            <Text style={styles.listItemSubtitle}>Due in 2 weeks</Text>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: '#FEFCE8', borderColor: '#FEF9C3' }]}>
                            <Text style={[styles.statusBadgeText, { color: '#CA8A04' }]}>DUE SOON</Text>
                          </View>
                        </View>
                      </>
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
                  <TouchableOpacity><Text style={styles.editLink}>See All</Text></TouchableOpacity>
                </View>

                {isMobile ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.mobileUpcomingContainer}
                    style={{ marginHorizontal: -24, paddingHorizontal: 24 }} // Offset card padding
                  >
                    <View style={styles.mobileUpcomingCard}>
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
                      </View>
                    </View>

                    <View style={styles.mobileUpcomingCard}>
                      <View style={styles.upcomingHeader}>
                        <View style={[styles.upcomingIconBox, { backgroundColor: '#DBEAFE' }]}>
                          <IconSymbol android_material_icon_name="content-cut" size={20} color="#2563EB" />
                        </View>
                        <View style={[styles.upcomingBadge, { backgroundColor: '#DBEAFE' }]}>
                          <Text style={[styles.upcomingBadgeText, { color: '#2563EB' }]}>5 DAYS</Text>
                        </View>
                      </View>
                      <View style={{ marginBottom: 12 }}>
                        <Text style={styles.upcomingTitle}>Grooming</Text>
                        <Text style={styles.upcomingSubtitle}>Paw Spa & Resort</Text>
                      </View>
                      <View style={styles.upcomingFooter}>
                        <Text style={styles.upcomingDate}>Oct 20, 02:00 PM</Text>
                      </View>
                    </View>
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
        <VaccinationFormModal visible={vaccinationOpen} petId={pet.id} onClose={() => setVaccinationOpen(false)} />
        <TreatmentFormModal visible={treatmentOpen} petId={pet.id} onClose={() => setTreatmentOpen(false)} />
        {/* MedicationFormModal logic can be similar to TreatmentFormModal or separated if needed. 
          Assuming TreatmentFormModal handles 'Medication' type or we reuse AddMedicationModal if it wasn't refactored yet.
          The user asked for 'Add Treatment' which includes medication type pills. 
          If MedicationFormModal is distinct, we should check if we refactored it. 
          I refactored TreatmentFormModal which has 'Medication' as a type. 
          I will use TreatmentFormModal for the 'Meds' quick action for now as it aligns with the 'Treatment' modal design request 
          that included 'Medication' as a type. 
      */}
        {/* <MedicationFormModal visible={medicationOpen} petId={pet.id} onClose={() => setMedicationOpen(false)} /> */}
      </ScrollView>
    </>
  );
}

function QuickActionCard({ label, icon, color, bgColor, onPress }: { label: string, icon: string, color: string, bgColor: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: bgColor }]}>
        <IconSymbol android_material_icon_name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F8',
  },
  content: {
    gap: 24,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  contentMobile: {
    paddingHorizontal: 0, // Edge-to-edge for scrolling
    paddingVertical: 12,
  },
  mobileQuickActionsScroll: {
    marginBottom: 24,
    paddingLeft: 24,
  },
  mobileQuickActionsContainer: {
    gap: 16,
    paddingRight: 24, // End padding
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
    gap: 16,
  },
  mobileUpcomingContainer: {
    gap: 12,
    paddingRight: 24,
  },
  mobileUpcomingCard: {
    width: 260, // Fixed width for horizontal items
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
    gap: 24,
  },
  mainGridLarge: {
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
    gap: 24,
  },
  rightColumn: {
    flex: 2,
    gap: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  editLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  infoList: {
    gap: 16,
  },
  infoItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  infoItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValueMono: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'monospace',
  },
  infoGrid2: {
    flexDirection: 'row',
    gap: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  infoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButtonSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  allergyTagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  gradientCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradientCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E0E7FF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  gradientCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  gradientCardSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradientCardSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  verifiedIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subGrid: {
    flexDirection: 'column',
    gap: 24,
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
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  listIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
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
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  upcomingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  upcomingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  upcomingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  upcomingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  upcomingDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  timelineList: {
    paddingLeft: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
    position: 'relative',
    paddingBottom: 32,
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 24,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5E7EB',
    zIndex: -1,
  },
  timelineDotPrimary: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  timelineDotGray: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
