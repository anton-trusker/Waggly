import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { VaccinationStatusView } from '@/types';
import { useRouter } from 'expo-router';

interface VaccinationCardProps {
    vaccinations: VaccinationStatusView[];
    petId: string;
}

export function VaccinationCardWidget({ vaccinations, petId }: VaccinationCardProps) {
    const router = useRouter();

    const getStatusColor = (code: string) => {
        switch (code) {
            case 'overdue': return { bg: '#FEF2F2', text: '#EF4444', border: '#FECACA' };
            case 'due_soon': return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
            case 'valid': return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
            default: return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
        }
    };

    const formatText = (code: string) => {
        switch (code) {
            case 'overdue': return 'Overdue';
            case 'due_soon': return 'Due Soon';
            case 'valid': return 'Up to Date';
            default: return 'Unknown';
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={[styles.iconBox, { backgroundColor: '#FCE7F3' }]}>
                        <IconSymbol android_material_icon_name="vaccines" size={24} color="#DB2777" />
                    </View>
                    <Text style={styles.title}>Vaccinations</Text>
                </View>
                <Pressable onPress={() => router.push(`/(tabs)/pets/vaccination/new?petId=${petId}`)}>
                    <Text style={styles.linkText}>+ Add</Text>
                </Pressable>
            </View>

            {/* List */}
            <View style={styles.list}>
                {vaccinations.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No vaccination records found.</Text>
                    </View>
                ) : (
                    vaccinations.map((vax) => {
                        const stylesColor = getStatusColor(vax.status_code);
                        return (
                            <View key={vax.id} style={[styles.item, { borderColor: stylesColor.border }]}>
                                <View style={styles.itemRow}>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.vaxName}>{vax.vaccine_name}</Text>
                                        <Text style={styles.vaxDate}>Last given: {new Date(vax.date_given).toLocaleDateString()}</Text>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: stylesColor.bg }]}>
                                        <Text style={[styles.badgeText, { color: stylesColor.text }]}>
                                            {formatText(vax.status_code)}
                                        </Text>
                                    </View>
                                </View>
                                {/* Optional: Show Next Due Date if exists */}
                                {vax.next_due_date && (
                                    <View style={styles.footerRow}>
                                        <Text style={styles.dueLabel}>Next Due: {new Date(vax.next_due_date).toLocaleDateString()}</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    linkText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0EA5E9',
    },
    list: {
        gap: 12,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 14,
    },
    item: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemInfo: {
        gap: 4,
    },
    vaxName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    vaxDate: {
        fontSize: 12,
        color: '#6B7280',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    footerRow: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    dueLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
    }
});
