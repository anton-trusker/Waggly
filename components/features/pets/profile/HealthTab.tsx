
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Pet, Vaccination, Treatment, Allergy, Condition } from '@/types';
import { CalendarEvent } from '@/hooks/useEvents';
import { LinearGradient } from 'expo-linear-gradient';

interface HealthTabProps {
    pet: Pet;
    vaccinations?: Vaccination[];
    treatments?: Treatment[];
    conditions?: Condition[];
    allergies?: Allergy[];
    visits?: CalendarEvent[];
    onAddRecord: (type: string) => void;
}

function Section({ title, action, onAction, children }: { title: string, action?: string, onAction?: () => void, children: React.ReactNode }) {
    const { theme } = useAppTheme();
    return (
        <View style={[styles.section, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>{title}</Text>
                {action && (
                    <TouchableOpacity onPress={onAction}>
                        <Text style={[styles.sectionAction, { color: theme.colors.primary[500] }]}>{action}</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );
}

export default function HealthTab({ pet, vaccinations = [], treatments = [], conditions = [], allergies = [], visits = [], onAddRecord }: HealthTabProps) {
    const { theme } = useAppTheme();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;

    // Filter Visits
    const upcomingVisits = visits.filter(v => new Date(v.dueDate) > new Date()).slice(0, 3);
    const recentVisits = visits.filter(v => new Date(v.dueDate) <= new Date()).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).slice(0, 5);

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysUntil = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <View style={[styles.container, isDesktop && styles.containerDesktop]}>
            {/* Quick Actions Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickActions}
                style={styles.quickActionsScroll}
            >
                <QuickAction icon="stethoscope" materialIcon="medical-services" color="#2563EB" bg="#EFF6FF" label="Add Visit" onPress={() => onAddRecord('visit')} theme={theme} />
                <QuickAction icon="syringe" materialIcon="vaccines" color="#9333EA" bg="#F3E8FF" label="Add Vaccine" onPress={() => onAddRecord('vaccination')} theme={theme} />
                <QuickAction icon="pills.fill" materialIcon="healing" color="#10B981" bg="#ECFDF5" label="Add Tx" onPress={() => onAddRecord('treatment')} theme={theme} />
                <QuickAction icon="doc.text.fill" materialIcon="note-add" color="#E11D48" bg="#FFF1F2" label="Add Doc" onPress={() => onAddRecord('document')} theme={theme} />
                <QuickAction icon="camera" materialIcon="camera-alt" color="#D97706" bg="#FFFBEB" label="Add Photo" onPress={() => onAddRecord('photo')} theme={theme} />
            </ScrollView>

            <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
                {/* Main Content Column */}
                <View style={[styles.column, { flex: 2 }]}>

                    {/* Visits Section */}
                    <Section title="Visits" action="+ Add New" onAction={() => onAddRecord('visit')}>
                        {/* Upcoming Visits */}
                        {upcomingVisits.length > 0 && (
                            <View style={styles.subSection}>
                                <Text style={[styles.subSectionTitle, { color: theme.colors.text.secondary }]}>UPCOMING</Text>
                                {upcomingVisits.map(visit => {
                                    const days = getDaysUntil(visit.dueDate);
                                    return (
                                        <LinearGradient
                                            key={visit.id}
                                            colors={[theme.colors.primary[500], theme.colors.primary[700]]}
                                            style={styles.upcomingCard}
                                        >
                                            <View style={styles.upcomingHeader}>
                                                <View style={styles.upcomingIcon}>
                                                    <IconSymbol android_material_icon_name="event" size={20} color="#fff" />
                                                </View>
                                                <View style={styles.upcomingBadge}>
                                                    <Text style={styles.upcomingBadgeText}>
                                                        {days === 0 ? 'TODAY' : days === 1 ? 'TOMORROW' : `${days} DAYS`}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={styles.upcomingTitle}>{visit.title}</Text>
                                            <Text style={styles.upcomingDetail}>{formatDate(visit.dueDate)} • {visit.location || 'Vet Clinic'}</Text>
                                        </LinearGradient>
                                    );
                                })}
                            </View>
                        )}

                        {/* Recent Visits */}
                        <View style={styles.subSection}>
                            <Text style={[styles.subSectionTitle, { color: theme.colors.text.secondary }]}>RECENT HISTORY</Text>
                            {recentVisits.length === 0 ? (
                                <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No recent visits recorded.</Text>
                            ) : (
                                recentVisits.map(visit => (
                                    <View key={visit.id} style={[styles.listItem, { backgroundColor: theme.colors.background.primary }]}>
                                        <View style={styles.dateBox}>
                                            <Text style={[styles.dateDay, { color: theme.colors.text.primary }]}>{new Date(visit.dueDate).getDate()}</Text>
                                            <Text style={[styles.dateMonth, { color: theme.colors.text.secondary }]}>{new Date(visit.dueDate).toLocaleDateString('en-US', { month: 'short' })}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.itemTitle, { color: theme.colors.text.primary }]}>{visit.title}</Text>
                                            <Text style={[styles.itemSubtitle, { color: theme.colors.text.secondary }]}>{visit.type || 'General Visit'}</Text>
                                        </View>
                                        <IconSymbol android_material_icon_name="chevron-right" size={20} color={theme.colors.text.quaternary} />
                                    </View>
                                ))
                            )}
                        </View>
                    </Section>

                    {/* Vaccinations Section */}
                    <Section title="Vaccinations" action="+ Add New" onAction={() => onAddRecord('vaccination')}>
                        {vaccinations.length === 0 ? (
                            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No vaccinations recorded.</Text>
                        ) : (
                            vaccinations.slice(0, 3).map(v => (
                                <View key={v.id} style={[styles.listItem, { backgroundColor: theme.colors.background.primary }]}>
                                    <View style={[styles.listIcon, { backgroundColor: '#F3E8FF' }]}>
                                        <IconSymbol android_material_icon_name="vaccines" size={20} color="#9333EA" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.itemTitle, { color: theme.colors.text.primary }]}>{v.vaccine_name}</Text>
                                        <Text style={[styles.itemSubtitle, { color: theme.colors.text.secondary }]}>
                                            Expires: {formatDate(v.next_due_date)}
                                        </Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                                        <Text style={[styles.statusText, { color: '#166534' }]}>ACTIVE</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </Section>

                    {/* Treatments Section */}
                    <Section title="Treatments & Meds" action="+ Add New" onAction={() => onAddRecord('treatment')}>
                        {treatments.length === 0 ? (
                            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No active treatments.</Text>
                        ) : (
                            treatments.map(t => (
                                <View key={t.id} style={[styles.listItem, { backgroundColor: theme.colors.background.primary }]}>
                                    <View style={[styles.listIcon, { backgroundColor: '#ECFDF5' }]}>
                                        <IconSymbol android_material_icon_name="healing" size={20} color="#10B981" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.rowBetween}>
                                            <Text style={[styles.itemTitle, { color: theme.colors.text.primary }]}>{t.category}</Text>
                                            {t.frequency && <Text style={[styles.frequencyText, { color: theme.colors.text.secondary }]}>{t.frequency}</Text>}
                                        </View>
                                        <Text style={[styles.itemSubtitle, { color: theme.colors.text.secondary }]} numberOfLines={1}>
                                            {t.treatment_name || t.notes || 'No details'}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </Section>
                </View>

                {/* Sidebar Column */}
                <View style={[styles.column, { flex: 1 }]}>
                    {/* Key Info */}
                    <View style={[styles.infoCard, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                        <Text style={[styles.cardTitle, { color: theme.colors.text.primary, marginBottom: 16 }]}>Key Health Info</Text>
                        <View style={styles.infoRow}>
                            <InfoItem label="BLOOD TYPE" value={pet.blood_type} icon="bloodtype" color="#2563EB" bg="#EFF6FF" theme={theme} />
                            <InfoItem label="STATUS" value={pet.is_spayed_neutered ? 'Neutered' : 'Intact'} icon="verified-user" color="#059669" bg="#ECFDF5" theme={theme} />
                        </View>
                        <View style={[styles.infoRow, { marginTop: 12 }]}>
                            <InfoItem label="WEIGHT" value={`${pet.weight || '--'} kg`} icon="monitor-weight" color="#7C3AED" bg="#F5F3FF" theme={theme} />
                            <InfoItem label="HEIGHT" value={`${pet.height || '--'} cm`} icon="height" color="#D97706" bg="#FFFBEB" theme={theme} />
                        </View>
                    </View>

                    {/* Allergies */}
                    <Section title="Allergies" action="+ Add" onAction={() => onAddRecord('allergy')}>
                        {allergies.length === 0 ? (
                            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No known allergies.</Text>
                        ) : (
                            <View style={styles.tagContainer}>
                                {allergies.map(a => (
                                    <View key={a.id} style={[styles.allergyTag, {
                                        backgroundColor: a.severity_level === 'severe' ? '#FEF2F2' : '#FFFBEB',
                                        borderColor: a.severity_level === 'severe' ? '#FECACA' : '#FDE68A'
                                    }]}>
                                        <IconSymbol
                                            android_material_icon_name={a.severity_level === 'severe' ? 'warning' : 'info'}
                                            size={14}
                                            color={a.severity_level === 'severe' ? '#EF4444' : '#D97706'}
                                        />
                                        <Text style={[styles.allergyText, {
                                            color: a.severity_level === 'severe' ? '#B91C1C' : '#92400E'
                                        }]}>{a.allergen}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </Section>

                    {/* Conditions */}
                    <Section title="Medical Conditions">
                        {conditions.length === 0 ? (
                            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No medical conditions.</Text>
                        ) : (
                            conditions.map(c => (
                                <View key={c.id} style={[styles.listItem, { backgroundColor: theme.colors.background.primary }]}>
                                    <View style={[styles.listIcon, { backgroundColor: '#FEF2F2' }]}>
                                        <IconSymbol android_material_icon_name="local-hospital" size={20} color="#DC2626" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.itemTitle, { color: theme.colors.text.primary }]}>{c.name}</Text>
                                        <Text style={[styles.itemSubtitle, { color: theme.colors.text.secondary }]}>
                                            {c.status} • {c.diagnosed_date ? formatDate(c.diagnosed_date) : 'No date'}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </Section>
                </View>
            </View>
            <View style={{ height: 40 }} />
        </View>
    );
}

function QuickAction({ icon, materialIcon, color, bg, label, onPress, theme }: any) {
    return (
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
            <View style={[styles.actionIcon, { backgroundColor: bg }]}>
                <IconSymbol ios_icon_name={icon} android_material_icon_name={materialIcon} size={24} color={color} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.colors.text.secondary }]}>{label}</Text>
        </TouchableOpacity>
    );
}

function InfoItem({ label, value, icon, color, bg, theme }: any) {
    return (
        <View style={[styles.infoItem, { backgroundColor: theme.colors.background.primary }]}>
            <View style={[styles.smallIcon, { backgroundColor: bg }]}>
                <IconSymbol android_material_icon_name={icon} size={16} color={color} />
            </View>
            <View>
                <Text style={[styles.infoLabel, { color: theme.colors.text.tertiary }]}>{label}</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{value || '--'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 24,
    },
    containerDesktop: {
        padding: 32,
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },
    mainLayout: {
        flexDirection: 'column',
        gap: 24,
    },
    mainLayoutDesktop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    column: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    quickActions: {
        gap: 16,
        paddingBottom: 4,
    },
    quickActionsScroll: {
        flexGrow: 0,
        marginBottom: 8,
    },
    actionItem: {
        alignItems: 'center',
        gap: 8,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    section: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        gap: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    sectionAction: {
        fontSize: 14,
        fontWeight: '600',
    },
    sectionContent: {
        gap: 12,
    },
    subSection: {
        gap: 12,
        marginTop: 8,
    },
    subSectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    infoCard: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        gap: 12,
    },
    infoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
    },
    smallIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        gap: 12,
    },
    listIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    itemSubtitle: {
        fontSize: 13,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    emptyText: {
        fontStyle: 'italic',
        fontSize: 14,
        padding: 8,
    },
    upcomingCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
    },
    upcomingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    upcomingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    upcomingBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    upcomingBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    upcomingTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    upcomingDetail: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    dateBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateDay: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 18,
    },
    dateMonth: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    frequencyText: {
        fontSize: 11,
        fontWeight: '600',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    allergyTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    allergyText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
