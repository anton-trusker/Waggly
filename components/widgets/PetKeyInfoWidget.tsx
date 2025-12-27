import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Pet } from '@/types';

interface PetKeyInfoWidgetProps {
    pet: Pet;
    onEdit?: () => void;
}

export default function PetKeyInfoWidget({ pet, onEdit }: PetKeyInfoWidgetProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Key Info</Text>
                <TouchableOpacity onPress={onEdit}>
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
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
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
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    infoItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    infoIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6B7280',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 2,
    },
    infoValueMono: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'monospace',
        color: '#1F2937',
        marginTop: 2,
    },
    infoGrid2: {
        flexDirection: 'row',
        gap: 12,
    },
    infoBox: {
        flex: 1,
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    infoBoxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
