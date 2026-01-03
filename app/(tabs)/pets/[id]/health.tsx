import React from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { useEvents } from '@/hooks/useEvents';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useTreatments } from '@/hooks/useTreatments';
import { useAllergies } from '@/hooks/useAllergies';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocale } from '@/hooks/useLocale';

export default function HealthTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  const isMobile = width < 768;
  const { t, locale } = useLocale();

  const { pets } = usePets();
  const { events } = useEvents({ petIds: [id] });
  const { vaccinations } = useVaccinations(id);
  const { treatments } = useTreatments(id);
  const { allergies } = useAllergies(id);

  const pet = pets?.find(p => p.id === id);
  if (!pet) return null;

  const upcomingEvents = events?.filter(e => new Date(e.dueDate) > new Date()).slice(0, 3) || [];
  const recentEvents = events?.filter(e => new Date(e.dueDate) <= new Date()).slice(0, 3) || [];
  const activeVaccinations = vaccinations?.filter(v => v.next_due_date && new Date(v.next_due_date) > new Date()) || [];
  const currentTreatments = treatments?.filter(t => t.is_active) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVaccineStatus = (dueDate: string | null) => {
    if (!dueDate) return 'ACTIVE';
    const daysUntil = getDaysUntil(dueDate);
    if (daysUntil < 0) return 'EXPIRED';
    if (daysUntil <= 30) return 'DUE SOON';
    return 'ACTIVE';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>

        {/* Quick Actions */}
        {isMobile ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mobileQuickActionsContainer}
            style={styles.mobileQuickActionsScroll}
          >
            <QuickActionButton
              label={t('pet_profile.health.actions.add_visit')}
              icon="calendar-today"
              color="#2563EB"
              bgColor="#DBEAFE"
              onPress={() => router.push(`/(tabs)/pets/visit/new?petId=${id}`)}
              isMobile={true}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_vaccine')}
              icon="vaccines"
              color="#DB2777"
              bgColor="#FCE7F3"
              onPress={() => router.push(`/(tabs)/pets/vaccination/new?petId=${id}`)}
              isMobile={true}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_tx')}
              icon="medication"
              color="#9333EA"
              bgColor="#F3E8FF"
              onPress={() => router.push(`/(tabs)/pets/treatment/new?petId=${id}`)}
              isMobile={true}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_image')}
              icon="add-photo-alternate"
              color="#D97706"
              bgColor="#FEF3C7"
              onPress={() => router.push(`/(tabs)/pets/photos/add?petId=${id}`)}
              isMobile={true}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_doc')}
              icon="note_add"
              color="#EA580C"
              bgColor="#FFEDD5"
              onPress={() => router.push(`/(tabs)/pets/documents/add?petId=${id}`)}
              isMobile={true}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_record')}
              icon="history_edu"
              color="#059669"
              bgColor="#D1FAE5"
              onPress={() => router.push(`/(tabs)/pets/record/new?petId=${id}`)}
              isMobile={true}
            />
          </ScrollView>
        ) : (
          <View style={styles.quickActionsGrid}>
            <QuickActionButton
              label={t('pet_profile.health.actions.add_visit')}
              icon="calendar-today"
              color="#2563EB"
              bgColor="#DBEAFE"
              onPress={() => router.push(`/(tabs)/pets/visit/new?petId=${id}`)}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_vaccine')}
              icon="vaccines"
              color="#DB2777"
              bgColor="#FCE7F3"
              onPress={() => router.push(`/(tabs)/pets/vaccination/new?petId=${id}`)}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_tx')}
              icon="medication"
              color="#9333EA"
              bgColor="#F3E8FF"
              onPress={() => router.push(`/(tabs)/pets/treatment/new?petId=${id}`)}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_image')}
              icon="add-photo-alternate"
              color="#D97706"
              bgColor="#FEF3C7"
              onPress={() => router.push(`/(tabs)/pets/photos/add?petId=${id}`)}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_doc')}
              icon="note_add"
              color="#EA580C"
              bgColor="#FFEDD5"
              onPress={() => router.push(`/(tabs)/pets/documents/add?petId=${id}`)}
            />
            <QuickActionButton
              label={t('pet_profile.health.actions.add_record')}
              icon="history_edu"
              color="#059669"
              bgColor="#D1FAE5"
              onPress={() => router.push(`/(tabs)/pets/record/new?petId=${id}`)}
            />
          </View>
        )}

        <View style={[styles.mainGrid, isLargeScreen && styles.mainGridLarge]}>

          {/* Main Column */}
          <View style={styles.mainColumn}>

            {/* Visits Section */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.headerTitleRow}>
                  <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                    <IconSymbol android_material_icon_name="calendar-today" size={24} color="#2563EB" />
                  </View>
                  <Text style={styles.cardTitle}>{t('pet_profile.health.titles.visits')}</Text>
                </View>
                <View style={styles.headerActions}>
                  <Pressable style={styles.filterBtn}>
                    <IconSymbol android_material_icon_name="filter-list" size={16} color="#6B7280" />
                    <Text style={styles.filterBtnText}>{t('pet_profile.health.actions.filter')}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.primaryBtn}
                    onPress={() => router.push(`/(tabs)/pets/visit/new?petId=${id}`)}
                  >
                    <IconSymbol android_material_icon_name="add" size={16} color="#fff" />
                    <Text style={styles.primaryBtnText}>{t('pet_profile.health.actions.new_visit')}</Text>
                  </Pressable>
                </View>
              </View>

              <View style={[styles.visitsGrid, !isMobile && styles.visitsGridDesktop]}>
                {/* Upcoming Visits */}
                <View style={styles.visitsColumn}>
                  <Text style={styles.sectionLabel}>{t('pet_profile.health.sections.upcoming')}</Text>
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => {
                      const daysUntil = getDaysUntil(event.dueDate);
                      return (
                        <LinearGradient
                          key={event.id}
                          colors={['#3B82F6', '#4F46E5']}
                          style={styles.upcomingCard}
                        >
                          <View style={styles.upcomingCardHeader}>
                            <View style={styles.upcomingCardIcon}>
                              <IconSymbol android_material_icon_name="medical-services" size={24} color="#FFFFFF" />
                            </View>
                            <View style={styles.daysBadge}>
                              <Text style={styles.daysBadgeText}>
                                {daysUntil === 0
                                  ? t('pet_profile.health.badges.today')
                                  : daysUntil === 1
                                    ? t('pet_profile.health.badges.tomorrow')
                                    : `${daysUntil} ${t('pet_profile.health.badges.days')}`}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.upcomingCardTitle}>{event.title}</Text>
                          <Text style={styles.upcomingCardLocation}>{event.location || 'Vet Clinic'}</Text>
                          <View style={styles.upcomingCardFooter}>
                            <View style={styles.upcomingCardTime}>
                              <IconSymbol android_material_icon_name="event" size={16} color="#FFFFFF" />
                              <Text style={styles.upcomingCardTimeText}>
                                {formatDate(event.dueDate)} {formatTime(event.dueDate)}
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      );
                    })
                  ) : (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>{t('pet_profile.health.empty.upcoming')}</Text>
                    </View>
                  )}
                </View>

                {/* Recent History */}
                <View style={styles.visitsColumn}>
                  <Text style={styles.sectionLabel}>{t('pet_profile.health.sections.recent_history')}</Text>
                  {recentEvents.length > 0 ? (
                    <View style={styles.recentList}>
                      {recentEvents.map((event) => (
                        <Pressable key={event.id} style={styles.recentItem}>
                          <View style={styles.recentDateBox}>
                            <Text style={styles.recentDateDay}>{formatDate(event.dueDate).split(' ')[1]}</Text>
                            <Text style={styles.recentDateMonth}>{formatDate(event.dueDate).split(' ')[0]}</Text>
                          </View>
                          <View style={styles.recentInfo}>
                            <Text style={styles.recentTitle}>{event.title}</Text>
                            <Text style={styles.recentType}>{event.type || 'Consultation'}</Text>
                          </View>
                          <IconSymbol android_material_icon_name="chevron-right" size={20} color="#9CA3AF" />
                        </Pressable>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>{t('pet_profile.health.empty.recent')}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Vaccinations */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.headerTitleRow}>
                  <View style={[styles.iconBox, { backgroundColor: '#FCE7F3' }]}>
                    <IconSymbol android_material_icon_name="vaccines" size={24} color="#DB2777" />
                  </View>
                  <Text style={styles.cardTitle}>{t('pet_profile.health.titles.vaccinations')}</Text>
                </View>
                <Pressable onPress={() => router.push(`/(tabs)/pets/vaccination/new?petId=${id}`)}>
                  <Text style={styles.linkText}>{t('pet_profile.health.actions.add_new')}</Text>
                </Pressable>
              </View>

              <View style={styles.vaccinesGrid}>
                {activeVaccinations.length > 0 ? (
                  activeVaccinations.map((vaccination) => {
                    const status = getVaccineStatus(vaccination.next_due_date);
                    const isDueSoon = status === 'DUE SOON';
                    return (
                      <View key={vaccination.id} style={[
                        styles.vaccineCard,
                        !isMobile && styles.vaccineCardDesktop,
                        isDueSoon && styles.vaccineCardDue
                      ]}>
                        <View style={styles.vaccineHeader}>
                          <View style={styles.checkCircle}>
                            <IconSymbol android_material_icon_name="check" size={16} color="#16A34A" />
                          </View>
                          <View style={[
                            styles.statusBadge,
                            isDueSoon ? styles.statusBadgeDue : styles.statusBadgeActive
                          ]}>
                            <Text style={[
                              styles.statusBadgeText,
                              isDueSoon ? styles.statusTextDue : styles.statusTextActive
                            ]}>{t(`pet_profile.health.badges.${status.toLowerCase().replace(' ', '_')}` as any)}</Text>
                          </View>
                        </View>
                        <Text style={styles.vaccineName}>{vaccination.vaccine_name}</Text>
                        <Text style={styles.vaccineProvider}>{vaccination.provider || 'Standard Vaccine'}</Text>
                        <View style={styles.vaccineFooter}>
                          <Text style={styles.expiresLabel}>{t('common.expires_short') || 'EXPIRES'}</Text>
                          <Text style={[
                            styles.expiresDate,
                            isDueSoon && styles.expiresDateDue
                          ]}>
                            {vaccination.next_due_date ? formatDate(vaccination.next_due_date) : 'N/A'}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>{t('pet_profile.health.empty.vaccinations')}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Treatments & Meds */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.headerTitleRow}>
                  <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                    <IconSymbol android_material_icon_name="medication" size={24} color="#9333EA" />
                  </View>
                  <Text style={styles.cardTitle}>{t('pet_profile.health.titles.treatments')}</Text>
                </View>
                <View style={styles.headerActions}>
                  <Pressable style={styles.iconBtn}>
                    <IconSymbol android_material_icon_name="filter-list" size={24} color="#6B7280" />
                  </Pressable>
                  <Pressable onPress={() => router.push(`/(tabs)/pets/treatment/new?petId=${id}`)}>
                    <Text style={styles.linkText}>{t('pet_profile.health.actions.add_tx')}</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.treatmentsList}>
                {currentTreatments.length > 0 ? (
                  currentTreatments.map((treatment) => (
                    <View key={treatment.id} style={styles.treatmentItem}>
                      <View style={[styles.treatmentIconBox, { backgroundColor: '#E0E7FF' }]}>
                        <IconSymbol android_material_icon_name="medication" size={24} color="#4F46E5" />
                      </View>
                      <View style={styles.treatmentContent}>
                        <View style={styles.treatmentHeader}>
                          <Text style={styles.treatmentTitle}>{treatment.type}</Text>
                          <View style={styles.frequencyBadge}>
                            <Text style={styles.frequencyText}>{treatment.frequency || 'Current'}</Text>
                          </View>
                        </View>
                        <Text style={styles.treatmentNotes}>{treatment.notes || 'For treatment. Follow dosage instructions.'}</Text>
                        <View style={styles.treatmentMeta}>
                          <View style={styles.metaItem}>
                            <IconSymbol android_material_icon_name="schedule" size={16} color="#6B7280" />
                            <Text style={styles.metaText}>{treatment.frequency || 'As needed'}</Text>
                          </View>
                          {treatment.next_due_date && (
                            <View style={styles.metaItem}>
                              <IconSymbol android_material_icon_name="calendar-today" size={16} color="#6B7280" />
                              <Text style={styles.metaText}>Next: {formatDate(treatment.next_due_date)}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Pressable style={styles.moreBtn}>
                        <IconSymbol android_material_icon_name="more-vert" size={20} color="#9CA3AF" />
                      </Pressable>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>{t('pet_profile.health.empty.treatments')}</Text>
                  </View>
                )}
              </View>
            </View>

          </View>

          {/* Sidebar Column */}
          <View style={styles.sidebarColumn}>

            {/* Allergies Sidebar */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{t('pet_profile.health.titles.allergies')}</Text>
                <Pressable style={styles.editBtn}>
                  <IconSymbol android_material_icon_name="edit" size={20} color="#6366F1" />
                </Pressable>
              </View>

              <View style={styles.allergiesList}>
                {allergies && allergies.length > 0 ? (
                  allergies.map((allergy) => (
                    <View key={allergy.id} style={[
                      styles.allergyItem,
                      allergy.severity === 'severe' ? styles.allergySevere : styles.allergyMild
                    ]}>
                      <IconSymbol
                        android_material_icon_name={allergy.severity === 'severe' ? 'warning' : 'eco'}
                        size={20}
                        color={allergy.severity === 'severe' ? '#EF4444' : '#CA8A04'}
                      />
                      <View style={styles.allergyContent}>
                        <Text style={[
                          styles.allergyName,
                          allergy.severity === 'severe' ? styles.textSevere : styles.textMild
                        ]}>
                          {allergy.name}
                        </Text>
                        <Text style={[
                          styles.allergyNotes,
                          allergy.severity === 'severe' ? styles.textSevereLight : styles.textMildLight
                        ]}>
                          {allergy.notes || 'Allergic reaction noted.'}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>{t('pet_profile.health.empty.allergies')}</Text>
                  </View>
                )}
                <Pressable style={styles.addAllergyBtn}>
                  <Text style={styles.addAllergyText}>{t('pet_profile.health.actions.add_allergy')}</Text>
                </Pressable>
              </View>
            </View>

            {/* Health Log */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{t('pet_profile.health.titles.health_log')}</Text>
                <Pressable>
                  <IconSymbol android_material_icon_name="history" size={24} color="#6B7280" />
                </Pressable>
              </View>

              <View style={styles.logList}>
                <View style={styles.logLine} />

                {/* Log Items (Mock Data) */}
                <LogItem
                  color="#6366F1"
                  title="Weight Check"
                  date="Oct 20"
                  desc="Recorded at home."
                >
                  <View style={styles.weightBadge}>
                    <Text style={styles.weightBadgeText}>24.5 kg</Text>
                    <IconSymbol android_material_icon_name="arrow-upward" size={10} color="#15803d" />
                  </View>
                </LogItem>

                <LogItem
                  color="#9CA3AF"
                  title="Symptom Log"
                  date="Oct 12"
                  desc="Mild lethargy noted in the evening. Appetite normal."
                />

                <LogItem
                  color="#3B82F6"
                  title="Condition Resolved"
                  date="Oct 10"
                  desc="Otitis Externa (Ear Infection) marked as resolved."
                />

                <LogItem
                  color="#9CA3AF"
                  title="Note Added"
                  date="Sep 15"
                  desc="Started new bag of food. Transitioning over 7 days."
                />

                <Pressable style={styles.viewHistoryBtn}>
                  <Text style={styles.viewHistoryText}>{t('pet_profile.health.actions.view_history')}</Text>
                </Pressable>
              </View>
            </View>

          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function QuickActionButton({ label, icon, color, bgColor, onPress, isMobile }: any) {
  if (isMobile) {
    return (
      <Pressable style={styles.mobileQuickAction} onPress={onPress}>
        <View style={[styles.mobileQuickActionIcon, { backgroundColor: bgColor }]}>
          <IconSymbol android_material_icon_name={icon} size={24} color={color} />
        </View>
        <Text style={styles.mobileQuickActionLabel}>{label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable style={styles.quickActionBtn} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: bgColor }]}>
        <IconSymbol android_material_icon_name={icon} size={20} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

function LogItem({ color, title, date, desc, children }: any) {
  return (
    <View style={styles.logItem}>
      <View style={[styles.logDot, { backgroundColor: color }]} />
      <View style={styles.logContent}>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>{title}</Text>
          <Text style={styles.logDate}>{date}</Text>
        </View>
        <Text style={styles.logDesc}>{desc}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F8',
  },
  content: {
    padding: 24,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    gap: 24,
  },
  contentMobile: {
    padding: 16,
  },
  mobileQuickActionsScroll: {
    marginBottom: 24,
    marginHorizontal: -16, // Bleed out
    paddingHorizontal: 16,
  },
  mobileQuickActionsContainer: {
    gap: 16,
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionBtn: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  mainGrid: {
    flexDirection: 'column',
    gap: 24,
  },
  mainGridLarge: {
    flexDirection: 'row',
  },
  mainColumn: {
    flex: 2,
    gap: 24,
  },
  sidebarColumn: {
    flex: 1,
    gap: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#6366F1',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  iconBtn: {
    padding: 4,
  },
  visitsGrid: {
    flexDirection: 'column',
    gap: 24,
  },
  visitsGridDesktop: {
    flexDirection: 'row',
  },
  visitsColumn: {
    flex: 1,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  upcomingCard: {
    borderRadius: 12,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  upcomingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  upcomingCardIcon: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  daysBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  daysBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  upcomingCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  upcomingCardLocation: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 16,
  },
  upcomingCardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12,
  },
  upcomingCardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upcomingCardTimeText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyState: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#6B7280',
    fontSize: 14,
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    gap: 12,
  },
  recentDateBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentDateDay: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 18,
  },
  recentDateMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  recentType: {
    fontSize: 12,
    color: '#6B7280',
  },
  vaccinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  vaccineCard: {
    width: '100%',
    minWidth: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  vaccineCardDesktop: {
    width: '31%',
  },
  vaccineCardDue: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeDue: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#16A34A',
  },
  statusTextDue: {
    color: '#D97706',
  },
  vaccineName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  vaccineProvider: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  vaccineFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  expiresLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  expiresDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  expiresDateDue: {
    color: '#D97706',
  },
  treatmentsList: {
    gap: 16,
  },
  treatmentItem: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  treatmentIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  treatmentContent: {
    flex: 1,
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  treatmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  frequencyBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  frequencyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },
  treatmentNotes: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  treatmentMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  moreBtn: {
    padding: 4,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allergiesList: {
    gap: 12,
  },
  allergyItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  allergySevere: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  allergyMild: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FEF9C3',
  },
  allergyContent: {
    flex: 1,
  },
  allergyName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  textSevere: {
    color: '#B91C1C',
  },
  textMild: {
    color: '#A16207',
  },
  allergyNotes: {
    fontSize: 12,
  },
  textSevereLight: {
    color: '#DC2626',
  },
  textMildLight: {
    color: '#CA8A04',
  },
  addAllergyBtn: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addAllergyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  logList: {
    position: 'relative',
    paddingLeft: 16,
    gap: 24,
  },
  logLine: {
    position: 'absolute',
    left: 3.5,
    top: 8,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  logItem: {
    flexDirection: 'row',
    gap: 16,
    position: 'relative',
  },
  logDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginTop: 6,
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  logContent: {
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  logDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  logDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  weightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  weightBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  viewHistoryBtn: {
    alignItems: 'center',
    paddingTop: 8,
  },
  viewHistoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
});
