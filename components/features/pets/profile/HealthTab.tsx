
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Pet, Vaccination, Treatment } from '@/types';
import { colors } from '@/styles/commonStyles';

// Define Condition Interface locally if not yet in types
interface Condition {
    id: string;
    name: string;
    status: 'active' | 'resolved' | 'recurring';
    diagnosed_date: string;
    notes?: string;
}

interface ItemProps {
    pet: Pet;
    vaccinations?: Vaccination[];
    treatments?: Treatment[];
    conditions?: Condition[];
    onAddRecord: (type: string) => void;
}

function Section({ title, action, children }: { title: string, action?: string, children: React.ReactNode }) {
    const { theme } = useAppTheme();
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>{title}</Text>
                {action && <TouchableOpacity><Text style={{ color: colors.primary[500], fontWeight: '600' }}>{action}</Text></TouchableOpacity>}
            </View>
            {children}
        </View>
    );
}

export default function HealthTab({ pet, vaccinations = [], treatments = [], conditions = [], onAddRecord }: ItemProps) {
    const { theme } = useAppTheme();

    return (
        <View style={styles.container}>
            {/* Quick Actions Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActions}>
                <TouchableOpacity style={styles.actionItem} onPress={() => onAddRecord('visit')}>
                    <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                        <IconSymbol ios_icon_name="stethoscope" android_material_icon_name="medical-services" size={24} color="#2563EB" />
                    </View>
                    <Text style={[styles.actionLabel, { color: theme.colors.text.secondary }]}>Add Visit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => onAddRecord('vaccination')}>
                    <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
                        <IconSymbol ios_icon_name="syringe" android_material_icon_name="vaccines" size={24} color="#9333EA" />
                    </View>
                    <Text style={[styles.actionLabel, { color: theme.colors.text.secondary }]}>Add Vaccine</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => onAddRecord('treatment')}>
                    <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
                        <IconSymbol ios_icon_name="pills.fill" android_material_icon_name="healing" size={24} color="#10B981" />
                    </View>
                    <Text style={[styles.actionLabel, { color: theme.colors.text.secondary }]}>Add Tx</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => onAddRecord('document')}>
                    <View style={[styles.actionIcon, { backgroundColor: '#FFF1F2' }]}>
                        <IconSymbol ios_icon_name="doc.text.fill" android_material_icon_name="note-add" size={24} color="#E11D48" />
                    </View>
                    <Text style={[styles.actionLabel, { color: theme.colors.text.secondary }]}>Add Doc</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Key Health Info Card */}
            <View style={[styles.card, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>Key Health Info</Text>
                </View>
                <View style={styles.healthInfoRow}>
                    <View style={styles.healthInfoItem}>
                        <View style={[styles.infoIcon, { backgroundColor: '#EFF6FF' }]}>
                            <IconSymbol ios_icon_name="drop.fill" android_material_icon_name="bloodtype" size={20} color="#2563EB" />
                        </View>
                        <View>
                            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>BLOOD TYPE</Text>
                            <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{pet.blood_type || '--'}</Text>
                        </View>
                    </View>

                    <View style={styles.healthInfoItem}>
                        <View style={[styles.infoIcon, { backgroundColor: '#ECFDF5' }]}>
                            <IconSymbol ios_icon_name="checkmark.shield.fill" android_material_icon_name="verified-user" size={20} color="#059669" />
                        </View>
                        <View>
                            <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>STATUS</Text>
                            <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{pet.is_spayed_neutered ? 'Neutered' : 'Intact'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Vaccinations */}
            <Section title="Vaccinations" action="See All">
                {vaccinations.length === 0 ? (
                    <Text style={{ color: theme.colors.text.secondary }}>No recent vaccinations.</Text>
                ) : (
                    vaccinations.slice(0, 2).map(v => (
                        <View key={v.id} style={[styles.listItem, { backgroundColor: theme.colors.background.secondary }]}>
                            <View style={[styles.listIcon, { backgroundColor: '#F3E8FF' }]}>
                                <IconSymbol ios_icon_name="syringe" android_material_icon_name="vaccines" size={20} color="#9333EA" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.itemTitle, { color: theme.colors.text.primary }]}>{v.vaccine_name}</Text>
                                <Text style={{ color: theme.colors.text.secondary, fontSize: 12 }}>
                                    Valid until {v.next_due_date ? new Date(v.next_due_date).toLocaleDateString() : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>ACTIVE</Text>
                            </View>
                        </View>
                    ))
                )}
            </Section>

            {/* Conditions (History) */}
            <Section title="Conditions">
                {conditions.length === 0 ? (
                    <View style={[styles.dashedBox, { borderColor: theme.colors.border.primary }]}>
                        <Text style={{ color: theme.colors.text.secondary, textAlign: 'center' }}>No medical conditions recorded.</Text>
                    </View>
                ) : (
                    // Simple list for now, timeline connector logic is complex for this snippet
                    conditions.map(c => (
                        <View key={c.id} style={[styles.listItem, { backgroundColor: theme.colors.background.secondary }]}>
                            <View style={[styles.listIcon, { backgroundColor: '#FEF2F2' }]}>
                                <IconSymbol ios_icon_name="cross.case.fill" android_material_icon_name="medical-services" size={20} color="#DC2626" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.itemTitle, { color: theme.colors.text.primary }]}>{c.name}</Text>
                                <Text style={{ color: theme.colors.text.secondary, fontSize: 12 }}>
                                    {c.status} • {c.diagnosed_date}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </Section>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 24,
    },
    quickActions: {
        gap: 16,
        paddingBottom: 4,
    },
    actionItem: {
        alignItems: 'center',
        gap: 8,
        minWidth: 72,
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
        fontWeight: '700',
    },
    card: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    cardHeader: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    healthInfoRow: {
        flexDirection: 'row',
        gap: 16,
    },
    healthInfoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.02)', // subtle bg
        borderRadius: 16,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        gap: 12,
    },
    listIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    statusBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: '#166534',
        fontSize: 10,
        fontWeight: '700',
    },
    dashedBox: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 20,
    }
});
