import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';

import { TextField } from '@/components/design-system/forms/TextField';

export default function EditPetContacts() {
    const { control } = useFormContext();

    const SectionHeader = ({ icon, title, color = designSystem.colors.primary[500] }: { icon: any, title: string, color?: string }) => (
        <View style={styles.sectionHeader}>
            <IconSymbol android_material_icon_name={icon} ios_icon_name={icon} size={18} color={color} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Primary Owner */}
            <View style={styles.section}>
                <SectionHeader icon="person" title="Primary Owner" />
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Owner details are managed in Account Settings.</Text>
                </View>
            </View>

            {/* Emergency Contact */}
            <View style={styles.section}>
                <SectionHeader icon="emergency" title="Emergency Contact" color={designSystem.colors.status.error[500]} />
                <View style={styles.card}>
                    <TextField
                        control={control}
                        name="ec_name"
                        label="Contact Name"
                        placeholder="Name"
                    />
                    <TextField
                        control={control}
                        name="ec_phone"
                        label="Phone Number"
                        placeholder="Phone"
                        keyboardType="phone-pad"
                    />
                </View>
            </View>

            {/* Vet Clinic */}
            <View style={styles.section}>
                <SectionHeader icon="local-hospital" title="Veterinary Clinic" color={designSystem.colors.secondary[500]} />
                <View style={styles.card}>
                    <TextField
                        control={control}
                        name="vet_clinic_name"
                        label="Clinic Name"
                        placeholder="Clinic Name"
                    />

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <TextField
                                control={control}
                                name="vet_name"
                                label="Vet Name"
                                placeholder="Dr. Name"
                            />
                        </View>
                        <View style={styles.col}>
                            <TextField
                                control={control}
                                name="vet_phone"
                                label="Phone"
                                placeholder="Phone"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <TextField
                        control={control}
                        name="vet_address"
                        label="Address"
                        placeholder="Clinic Address"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 24 },
    section: { gap: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { fontSize: 12, fontWeight: '800', color: designSystem.colors.text.secondary, letterSpacing: 1, textTransform: 'uppercase' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        ...designSystem.shadows.sm
    },
    row: { flexDirection: 'row', gap: 12 },
    col: { flex: 1 },
    infoBox: {
        padding: 16, borderRadius: 12, backgroundColor: designSystem.colors.neutral[100],
        alignItems: 'center'
    },
    infoText: { fontSize: 13, color: designSystem.colors.text.secondary },
});

