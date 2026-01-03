import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PreventiveCareStatusView } from '@/types';
import { useRouter } from 'expo-router';

interface PreventiveCareProps {
    treatments: PreventiveCareStatusView[];
    petId: string;
}

export function PreventiveCareWidget({ treatments, petId }: PreventiveCareProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                        <IconSymbol android_material_icon_name="shield" size={24} color="#0284C7" />
                    </View>
                    <Text style={styles.title}>Preventive Care</Text>
                </View>
                <Pressable onPress={() => router.push(`/(tabs)/pets/treatment/new?petId=${petId}&type=preventive`)}>
                    <Text style={styles.linkText}>+ Add</Text>
                </Pressable>
            </View>

            {/* Checklist */}
            <View style={styles.list}>
                {treatments.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No preventive treatments active.</Text>
                        <Pressable style={styles.addBtn} onPress={() => router.push(`/(tabs)/pets/treatment/new?petId=${petId}&type=preventive`)}>
                            <Text style={styles.addBtnText}>Start Prevention</Text>
                        </Pressable>
                    </View>
                ) : (
                    treatments.map((item) => (
                        <View key={item.id} style={styles.item}>
                            <View style={styles.checkIcon}>
                                <IconSymbol android_material_icon_name="check-circle" size={20} color="#16A34A" />
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemName}>{item.treatment_name}</Text>
                                <Text style={styles.itemSub}>{item.frequency || 'Regular'}</Text>
                            </View>
                            {item.next_due_date && (
                                <View style={styles.dueBadge}>
                                    <Text style={styles.dueText}>Due: {new Date(item.next_due_date).toLocaleDateString()}</Text>
                                </View>
                            )}
                        </View>
                    ))
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
        color: '#6366F1',
    },
    list: {
        gap: 12,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        gap: 12,
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 14,
    },
    addBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
    },
    addBtnText: {
        color: '#2563EB',
        fontWeight: '600',
        fontSize: 14,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        gap: 12,
    },
    checkIcon: {
        //
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    itemSub: {
        fontSize: 12,
        color: '#6B7280',
    },
    dueBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    dueText: {
        fontSize: 10,
        color: '#4B5563',
        fontWeight: '500',
    }
});
