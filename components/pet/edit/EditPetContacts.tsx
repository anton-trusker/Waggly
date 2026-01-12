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


export default function EditPetContacts({ petId, onSaveVet, onSaveEmergency, errors = {} }: EditPetContactsProps) {
    const [vet, setVet] = useState<Partial<Veterinarian>>({});
    const [emergency, setEmergency] = useState<Partial<EmergencyContact>>({});
    const [emergencyEnabled, setEmergencyEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, [petId]);

    const fetchContacts = async () => {
        try {
            // Fetch Vet
            const { data: vetData } = await supabase
                .from('veterinarians')
                .select('*')
                .eq('pet_id', petId)
                .eq('is_primary', true)
                .single();

            if (vetData) setVet(vetData);

            // Fetch Emergency Contact
            const { data: ecData } = await supabase
                .from('emergency_contacts')
                .select('*')
                .eq('pet_id', petId)
                .single();

            if (ecData) {
                setEmergency(ecData);
                setEmergencyEnabled(true);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateVet = (field: keyof Veterinarian, value: any) => {
        const updated = { ...vet, [field]: value };
        setVet(updated);
        onSaveVet(updated);
    };

    const updateEmergency = (field: keyof EmergencyContact, value: any) => {
        const updated = { ...emergency, [field]: value };
        setEmergency(updated);
        onSaveEmergency(updated);
    };

    const toggleEmergency = (enabled: boolean) => {
        setEmergencyEnabled(enabled);
        if (!enabled) {
            // If disabled, we might want to clear or mark for deletion logic upstream
            // For now, we just pass empty/null to indicate removal if needed
            onSaveEmergency({ name: '' });
        } else {
            // Restore or init
            onSaveEmergency(emergency);
        }
    };

    if (loading) return <View style={styles.loading}><Text>Loading contacts...</Text></View>;

    return (
        <View style={styles.container}>
            {/* --- Primary Owner (Read Only for now) --- */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <IconSymbol ios_icon_name="person.fill" android_material_icon_name="person" size={20} color={designSystem.colors.primary[500]} />
                    <Text style={styles.sectionTitle}>PRIMARY OWNER INFORMATION</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Owner details are managed in Account Settings.</Text>
                </View>
            </View>

            {/* --- Emergency Contact --- */}
            <View style={styles.section}>
                <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <IconSymbol ios_icon_name="staroflife.fill" android_material_icon_name="emergency" size={20} color={designSystem.colors.error[500]} />
                        <Text style={styles.sectionTitle}>EMERGENCY CONTACT</Text>
                    </View>
                    <Switch
                        value={emergencyEnabled}
                        onValueChange={toggleEmergency}
                        trackColor={{ false: designSystem.colors.neutral[200], true: designSystem.colors.primary[500] }}
                    />
                </View>

                {emergencyEnabled && (
                    <View style={styles.card}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Contact Person's Name</Text>
                            <TextInput
                                style={styles.input}
                                value={emergency.name || ''}
                                onChangeText={(v) => updateEmergency('name', v)}
                                placeholder="Name"
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={emergency.phone || ''}
                                onChangeText={(v) => updateEmergency('phone', v)}
                                placeholder="Phone"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                )}
            </View>

            {/* --- Veterinary Clinic --- */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <IconSymbol ios_icon_name="cross.case.fill" android_material_icon_name="local-hospital" size={20} color={designSystem.colors.secondary[500]} />
                    <Text style={styles.sectionTitle}>VETERINARY CLINIC</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Clinic Name</Text>
                        <View style={styles.inputWithIcon}>
                            <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={18} color={designSystem.colors.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.inputPadded}
                                value={vet.clinic_name || ''}
                                onChangeText={(v) => updateVet('clinic_name', v)}
                                placeholder="Search or enter clinic name"
                            />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Vet Name</Text>
                            <TextInput
                                style={styles.input}
                                value={vet.vet_name || ''}
                                onChangeText={(v) => updateVet('vet_name', v)}
                                placeholder="Dr. Name"
                            />
                        </View>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                value={vet.phone || ''}
                                onChangeText={(v) => updateVet('phone', v)}
                                placeholder="Phone"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={styles.input}
                            value={vet.address || ''}
                            onChangeText={(v) => updateVet('address', v)}
                            placeholder="Clinic Address"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 32 },
    loading: { padding: 20, alignItems: 'center' },
    section: { gap: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { ...designSystem.typography.label.small, color: designSystem.colors.text.primary, fontWeight: '800', letterSpacing: 1 },
    card: {
        backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 16,
        borderWidth: 1, borderColor: designSystem.colors.neutral[200]
    },
    formGroup: { gap: 8 },
    label: { ...designSystem.typography.label.small, color: designSystem.colors.text.secondary, fontWeight: '700' },
    input: {
        borderWidth: 1, borderColor: designSystem.colors.neutral[200], borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
        color: designSystem.colors.text.primary, backgroundColor: '#fff'
    },
    row: { flexDirection: 'row', gap: 16 },
    infoBox: {
        padding: 16, borderRadius: 12, backgroundColor: designSystem.colors.neutral[100],
        alignItems: 'center'
    },
    infoText: { ...designSystem.typography.body.small, color: designSystem.colors.text.secondary },
    inputWithIcon: { position: 'relative', justifyContent: 'center' },
    inputIcon: { position: 'absolute', left: 16, zIndex: 1 },
    inputPadded: {
        borderWidth: 1, borderColor: designSystem.colors.neutral[200], borderRadius: 12,
        paddingLeft: 44, paddingRight: 16, paddingVertical: 12, fontSize: 16,
        color: designSystem.colors.text.primary, backgroundColor: '#fff'
    }
});
