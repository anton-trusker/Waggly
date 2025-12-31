import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useAllergies } from '@/hooks/useAllergies';
import { useTreatments } from '@/hooks/useTreatments';
import { useConditions } from '@/hooks/useConditions';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Pet, Allergy, Vaccination, Treatment, Condition } from '@/types';
import VisitFormModal from '@/components/desktop/modals/VisitFormModal';
import VaccinationFormModal from '@/components/desktop/modals/VaccinationFormModal';
import TreatmentFormModal from '@/components/desktop/modals/TreatmentFormModal';
import HealthMetricsModal from '@/components/desktop/modals/HealthMetricsModal'; // Added
import AllergyModal from '@/components/desktop/modals/AllergyModal'; // Added
import QuickActionsGrid from '@/components/desktop/dashboard/QuickActionsGrid'; // Added
import ConditionFormModal from '@/components/desktop/modals/ConditionFormModal';
import { useLocale } from '@/hooks/useLocale';

import EditKeyInfoModal from '@/components/pet/edit/EditKeyInfoModal';
import { PetPassportCard } from '@/components/pet/PetPassportCard';

export default function OverviewTab() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const petId = params.id as string;
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  const isMobile = width < 768; // Mobile breakpoint

  const { t, locale } = useLocale();
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
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null); // Added
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null); // Added
  const [conditionModalOpen, setConditionModalOpen] = useState(false); // Added
  const [editKeyInfoModalVisible, setEditKeyInfoModalVisible] = useState(false);

  const { vaccinations } = useVaccinations(petId);
  const { allergies } = useAllergies(petId);
  const { treatments, refreshTreatments } = useTreatments(petId);
  const { conditions } = useConditions(petId);

  const recentConditions = conditions.slice(0, 2); // Show top 2

  if (!pet) {
    return (
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>{t('pet_profile.loading')}</Text>
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

        {/* Main Grid Content */}
        <View style={[styles.mainGrid, isLargeScreen && styles.mainGridLarge]}>

          {/* Left Column (1/3) */}
          <View style={styles.leftColumn}>

            {/* Pet Passport Card */}
            <TouchableOpacity onPress={() => setEditKeyInfoModalVisible(true)}>
              <PetPassportCard pet={pet} />
            </TouchableOpacity>

            {/* Quick Actions - Under Passport Card */}
            {!isMobile && <QuickActionsGrid onActionPress={handleQuickAction} />}

            {/* Allergies Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{t('pet_profile.allergies')}</Text>
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
                    <Text style={[styles.allergyTagText, { color: '#6B7280' }]}>{t('pet_profile.no_allergies')}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Past Conditions Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{t('pet_profile.past_conditions')}</Text>
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
                              {cond.diagnosed_date ? new Date(cond.diagnosed_date).toLocaleDateString(locale === 'en' ? 'en-US' : locale, { month: 'short', year: 'numeric' }) : t('pet_profile.unknown')}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.timelineItemDesc}>{cond.description || cond.treatment_plan || cond.notes || t('pet_profile.no_details')}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ color: '#9CA3AF', fontStyle: 'italic', marginLeft: 8 }}>{t('pet_profile.no_past_conditions')}</Text>
                )}
              </View>
            </View>

          </View>

          {/* Right Column (2/3) */}
          <View style={styles.rightColumn}>

            {/* Vaccinations Table Card */}
            <View style={styles.card}>
              <View style={styles.vaccHeader}>
                <View style={styles.vaccHeaderLeft}>
                  <Ionicons name="medical" size={20} color="#fff" />
                  <View>
                    <Text style={styles.vaccTitle}>{t('pet_profile.vaccinations')}</Text>
                    <Text style={styles.vaccSubtitle}>{t('pet_profile.official_records')}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.addEntryBtn}
                  onPress={() => setVaccinationOpen(true)}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={styles.addEntryText}>{t('pet_profile.add_entry')}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.vaccinationsTable}>
                {/* Rabies Section */}
                <Text style={styles.vaccSectionTitle}>{t('pet_profile.rabies_section')}</Text>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t('pet_profile.table_headers.date')}</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t('pet_profile.table_headers.manufacturer_batch')}</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t('pet_profile.table_headers.valid_from')}</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t('pet_profile.table_headers.valid_until')}</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t('pet_profile.table_headers.veterinarian')}</Text>
                </View>
                {vaccinations.filter(v => v.vaccine_name?.toLowerCase().includes('rabies')).length > 0 ? (
                  vaccinations.filter(v => v.vaccine_name?.toLowerCase().includes('rabies')).map((vacc) => (
                    <TouchableOpacity
                      key={vacc.id}
                      style={styles.tableRow}
                      onPress={() => {
                        setSelectedVaccination(vacc);
                        setVaccinationOpen(true);
                      }}
                    >
                      <Text style={[styles.tableCell, { flex: 1 }]}>{new Date(vacc.date_given).toLocaleDateString(locale === 'en' ? 'en-US' : locale, { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.vaccName}>{vacc.vaccine_name}</Text>
                        <Text style={styles.vaccBatch}>{t('pet_profile.table_headers.batch')}: {vacc.batch_number || t('pet_profile.na')}</Text>
                      </View>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{new Date(vacc.date_given).toLocaleDateString(locale === 'en' ? 'en-US' : locale, { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                      <View style={{ flex: 1 }}>
                        {vacc.next_due_date && new Date(vacc.next_due_date) > new Date() ? (
                          <View style={styles.validBadge}>
                            <Text style={styles.validBadgeText}>{new Date(vacc.next_due_date).toLocaleDateString(locale === 'en' ? 'en-US' : locale, { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                            <Ionicons name="checkmark-circle" size={14} color="#059669" />
                          </View>
                        ) : (
                          <Text style={styles.expiredText}>{vacc.next_due_date ? new Date(vacc.next_due_date).toLocaleDateString(locale === 'en' ? 'en-US' : locale, { day: '2-digit', month: 'short', year: 'numeric' }) : t('pet_profile.na')}</Text>
                        )}
                      </View>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{vacc.provider || t('pet_profile.na')}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyTableRow}>
                    <Text style={styles.emptyTableText}>{t('pet_profile.no_rabies')}</Text>
                  </View>
                )}

                {/* Other Vaccinations */}
                <Text style={[styles.vaccSectionTitle, { marginTop: 24 }]}>{t('pet_profile.other_vaccines_section')}</Text>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t('pet_profile.table_headers.date')}</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t('pet_profile.table_headers.vaccine_type')}</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t('pet_profile.table_headers.batch')}</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t('pet_profile.table_headers.next_due')}</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t('pet_profile.table_headers.clinic')}</Text>
                </View>
                {vaccinations.filter(v => !v.vaccine_name?.toLowerCase().includes('rabies')).length > 0 ? (
                  vaccinations.filter(v => !v.vaccine_name?.toLowerCase().includes('rabies')).map((vacc) => (
                    <TouchableOpacity
                      key={vacc.id}
                      style={styles.tableRow}
                      onPress={() => {
                        setSelectedVaccination(vacc);
                        setVaccinationOpen(true);
                      }}
                    >
                      <Text style={[styles.tableCell, { flex: 1 }]}>{new Date(vacc.date_given).toLocaleDateString(locale === 'en' ? 'en-GB' : locale)}</Text>
                      <Text style={[styles.vaccName, { flex: 2 }]}>{vacc.vaccine_name}</Text>
                      <Text style={[styles.vaccBatch, { flex: 1 }]}>#{vacc.batch_number || t('pet_profile.na')}</Text>
                      <View style={{ flex: 1 }}>
                        {vacc.next_due_date && (
                          new Date(vacc.next_due_date) < new Date() ? (
                            <View style={styles.warningBadge}>
                              <Text style={styles.warningText}>{new Date(vacc.next_due_date).toLocaleDateString(locale === 'en' ? 'en-GB' : locale)}</Text>
                              <Ionicons name="warning" size={12} color="#EA580C" />
                            </View>
                          ) : (
                            <Text style={styles.tableCell}>{new Date(vacc.next_due_date).toLocaleDateString(locale === 'en' ? 'en-GB' : locale)}</Text>
                          )
                        )}
                      </View>
                      <Text style={[styles.tableCell, { flex: 1 }]}>{vacc.provider || t('pet_profile.na')}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyTableRow}>
                    <Text style={styles.emptyTableText}>{t('pet_profile.no_other_vaccines')}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Treatments & Medications Card */}
            <View style={styles.card}>
              <View style={styles.treatmentsHeader}>
                <View style={styles.treatmentsHeaderLeft}>
                  <Ionicons name="medical" size={20} color="#4F46E5" />
                  <Text style={styles.treatmentsTitle}>{t('pet_profile.treatments_medications')}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  setSelectedTreatment(null);
                  setTreatmentOpen(true);
                }}>
                  <Text style={styles.viewHistoryLink}>{t('pet_profile.add_new')}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.treatmentsGrid}>
                {/* Current Prescriptions (Active Medications) */}
                <View style={styles.treatmentsColumn}>
                  <Text style={styles.treatmentsSectionTitle}>{t('pet_profile.current_prescriptions')}</Text>
                  {treatments.filter(t => t.is_active && t.category === 'Medication').length > 0 ? (
                    treatments.filter(t => t.is_active && t.category === 'Medication').slice(0, 3).map((treatment) => (
                      <TouchableOpacity
                        key={treatment.id}
                        style={[styles.medCard, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}
                        onPress={() => {
                          setSelectedTreatment(treatment);
                          setTreatmentOpen(true);
                        }}
                      >
                        <View style={styles.medIcon}>
                          <Ionicons name="medical" size={20} color="#4F46E5" />
                        </View>
                        <View style={styles.medInfo}>
                          <Text style={styles.medName}>{treatment.treatment_name}</Text>
                          <Text style={styles.medDosage}>{treatment.dosage_value ? `${treatment.dosage_value} ${treatment.dosage_unit || ''}` : treatment.dosage || t('pet_profile.no_dosage')} • {treatment.frequency}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={[styles.medCard, { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }]}>
                      <Text style={{ color: '#6B7280', fontStyle: 'italic' }}>{t('pet_profile.no_active_medications')}</Text>
                    </View>
                  )}
                </View>

                {/* Recent Treatments (All types, simplified view) */}
                <View style={styles.treatmentsColumn}>
                  <Text style={styles.treatmentsSectionTitle}>{t('pet_profile.recent_treatments')}</Text>
                  <View style={styles.treatmentTimeline}>
                    {treatments.length > 0 ? (
                      treatments.slice(0, 3).map((treatment) => (
                        <TouchableOpacity
                          key={treatment.id}
                          style={styles.treatmentTimelineItem}
                          onPress={() => {
                            setSelectedTreatment(treatment);
                            setTreatmentOpen(true);
                          }}
                        >
                          <View style={styles.treatmentTimelineDot} />
                          <View style={styles.treatmentTimelineContent}>
                            <Text style={styles.treatmentTimelineTitle}>{treatment.treatment_name}</Text>
                            <Text style={styles.treatmentTimelineDesc}>{treatment.notes || treatment.category || 'Treatment'}</Text>
                          </View>
                          <Text style={styles.treatmentTimelineDate}>
                            {treatment.start_date ? new Date(treatment.start_date).toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { day: '2-digit', month: 'short' }) : t('pet_profile.na')}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={{ color: '#6B7280', fontStyle: 'italic' }}>{t('pet_profile.no_recent_treatments')}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Important Notes Card */}
            <View style={styles.notesCard}>
              <View style={styles.notesHeader}>
                <Ionicons name="document-text" size={20} color="#CA8A04" />
                <Text style={styles.notesTitle}>{t('pet_profile.important_notes')}</Text>
              </View>
              <Text style={styles.notesText}>
                {(pet as any).notes || t('pet_profile.no_notes_placeholder')}
              </Text>
            </View>

            {/* History Timeline */}
            <View style={styles.card}>
              <Text style={[styles.cardTitle, { marginBottom: 24 }]}>{t('pet_profile.history_timeline')}</Text>
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
                        <Text style={styles.timelineItemTitle}>{t('pet_profile.mock_timeline.dental_title')}</Text>
                      </View>
                      <Text style={styles.timelineDateText}>12 Oct</Text>
                    </View>
                    <Text style={styles.timelineSubtitle}>{t('pet_profile.mock_timeline.dental_subtitle')}</Text>
                    <View style={styles.timelineNoteBox}>
                      <Text style={styles.timelineNoteText}>{t('pet_profile.mock_timeline.dental_note')}</Text>
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
                        <Text style={styles.timelineItemTitle}>{t('pet_profile.mock_timeline.weight_title')}</Text>
                      </View>
                      <Text style={styles.timelineDateText}>01 Oct</Text>
                    </View>
                    <View style={styles.weightRow}>
                      <Text style={styles.weightValue}>{t('pet_profile.mock_timeline.weight_val')}</Text>
                      <Text style={styles.weightChange}>{t('pet_profile.mock_timeline.weight_change')}</Text>
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
                        <Text style={styles.timelineItemTitle}>{t('pet_profile.mock_timeline.dewclaw_title')}</Text>
                      </View>
                      <Text style={styles.timelineDateText}>28 Aug</Text>
                    </View>
                    <Text style={styles.timelineSubtitle}>{t('pet_profile.mock_timeline.dewclaw_subtitle')}</Text>
                    <View style={styles.timelineNoteBox}>
                      <Text style={styles.timelineNoteText}>{t('pet_profile.mock_timeline.dewclaw_note')}</Text>
                    </View>
                  </View>
                </View>

              </View>
              <TouchableOpacity style={styles.viewTimelineBtn}>
                <Text style={styles.viewTimelineText}>{t('pet_profile.view_full_timeline')}</Text>
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
      <TreatmentFormModal
        visible={treatmentOpen}
        petId={pet.id}
        existingTreatment={selectedTreatment}
        onClose={() => setTreatmentOpen(false)}
        onSuccess={() => {
          setTreatmentOpen(false);
          refreshTreatments();
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
  // Vaccinations Table Styles
  vaccHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  vaccHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vaccTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  vaccSubtitle: {
    fontSize: 12,
    color: '#E0E7FF',
  },
  addEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addEntryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  vaccinationsTable: {
    gap: 8,
  },
  vaccSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 13,
    color: '#374151',
  },
  vaccName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  vaccBatch: {
    fontSize: 11,
    color: '#6B7280',
  },
  validBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  expiredText: {
    fontSize: 12,
    color: '#DC2626',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EA580C',
  },
  emptyTableRow: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyTableText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  // Treatments & Medications Styles
  treatmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  treatmentsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  treatmentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewHistoryLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  treatmentsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  treatmentsColumn: {
    flex: 1,
    gap: 12,
  },
  treatmentsSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  medIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  medDosage: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  treatmentTimeline: {
    gap: 12,
  },
  treatmentTimelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  treatmentTimelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
    marginTop: 4,
  },
  treatmentTimelineContent: {
    flex: 1,
  },
  treatmentTimelineTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  treatmentTimelineDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  treatmentTimelineDate: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  // Important Notes Card
  notesCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
  },
  notesText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 22,
  },
});
