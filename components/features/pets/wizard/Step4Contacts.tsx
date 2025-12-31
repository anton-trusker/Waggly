import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import PhoneInput from '@/components/ui/PhoneInput';
import { useAppTheme } from '@/hooks/useAppTheme';
import EnhancedSelection from '@/components/ui/EnhancedSelection';
import { COUNTRIES } from '@/constants/countries';
import PlacesAutocomplete, { Place } from '@/components/ui/PlacesAutocomplete';

export interface Step4Data {
    vetName: string;
    vetClinicName: string;
    vetAddress: string;
    vetCountry: string;
    vetPhone: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
}

interface Step4Props {
    initialData: Step4Data;
    onNext: (data: Step4Data) => void;
}

const COUNTRY_OPTIONS_WITH_FLAG = COUNTRIES.map(c => ({
    id: c.code,
    label: `${c.flag} ${c.name}`
}));

export default function Step4Contacts({ initialData, onNext }: Step4Props) {
    const { colors } = useAppTheme();
    const [vetName, setVetName] = useState(initialData.vetName || '');
    const [vetClinicName, setVetClinicName] = useState(initialData.vetClinicName || '');
    const [vetAddress, setVetAddress] = useState(initialData.vetAddress || '');
    const [vetCountry, setVetCountry] = useState(initialData.vetCountry || '');
    const [vetPhone, setVetPhone] = useState(initialData.vetPhone || '');
    const [emergencyContactName, setEmergencyContactName] = useState(initialData.emergencyContactName);
    const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialData.emergencyContactPhone);
    const [showVet, setShowVet] = useState(false); // Collapsible state - default closed

    const handleNext = () => {
        onNext({
            vetName,
            vetClinicName,
            vetAddress,
            vetCountry,
            vetPhone,
            emergencyContactName,
            emergencyContactPhone
        });
    };

    const dynamicStyles = {
        title: { color: colors.text.primary },
        subtitle: { color: colors.text.secondary },
        sectionHeader: { borderBottomColor: colors.neutral[200] },
        sectionTitle: { color: colors.text.primary },
        label: { color: colors.text.secondary },
        optional: { color: colors.text.tertiary },
        input: {
            backgroundColor: colors.neutral[0],
            borderColor: colors.neutral[200],
            color: colors.text.primary,
        },
        placeholder: colors.text.tertiary,
        footer: {
            backgroundColor: colors.background.primary,
            borderTopColor: colors.neutral[100],
        },
        continueButtonText: { color: colors.neutral[0] }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerSection}>
                    <Text style={[styles.title, dynamicStyles.title]}>Contacts & Care</Text>
                    <Text style={[styles.subtitle, dynamicStyles.subtitle]}>Veterinarian and emergency details.</Text>
                </View>

                <View style={styles.formSection}>

                    {/* Emergency Contact Section - FIRST */}
                    <View style={[styles.sectionHeader, dynamicStyles.sectionHeader]}>
                        <View style={[styles.sectionIcon, { backgroundColor: colors.error[50] }]}>
                            <IconSymbol ios_icon_name="exclamationmark.triangle.fill" android_material_icon_name="emergency" size={20} color={colors.error[500]} />
                        </View>
                        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Emergency Contact</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, dynamicStyles.label]}>CONTACT NAME</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol
                                ios_icon_name="person.fill"
                                android_material_icon_name="person"
                                size={20}
                                color={colors.error[500]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, dynamicStyles.input]}
                                placeholder="e.g. Jane Doe"
                                placeholderTextColor={dynamicStyles.placeholder}
                                value={emergencyContactName}
                                onChangeText={setEmergencyContactName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, dynamicStyles.label]}>EMERGENCY PHONE</Text>
                        <PhoneInput
                            value={emergencyContactPhone}
                            onChangeText={setEmergencyContactPhone}
                            error={emergencyContactName && !emergencyContactPhone ? "Required" : undefined}
                        />
                    </View>

                    {/* Veterinarian Section - SECOND, COLLAPSIBLE */}
                    <TouchableOpacity
                        style={[styles.sectionHeader, { marginTop: 24 }, dynamicStyles.sectionHeader]}
                        onPress={() => setShowVet(!showVet)}
                        activeOpacity={0.7}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={[styles.sectionIcon, { backgroundColor: designSystem.colors.primary[50] }]}>
                                <IconSymbol ios_icon_name="cross.case.fill" android_material_icon_name="medical-services" size={20} color={designSystem.colors.primary[500]} />
                            </View>
                            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Veterinarian</Text>
                        </View>
                        <IconSymbol
                            ios_icon_name={showVet ? "chevron.up" : "chevron.down"}
                            android_material_icon_name={showVet ? "expand-less" : "expand-more"}
                            size={24}
                            color={colors.text.secondary}
                        />
                    </TouchableOpacity>

                    {showVet && (
                        <>
                            <PlacesAutocomplete
                                value={vetAddress}
                                onSelect={(place: Place) => {
                                    setVetAddress(place.formatted_address);
                                    // Optionally set clinic name from place name if available
                                    // setVetClinicName(place.name || vetClinicName);
                                }}
                                placeholder="Search for vet clinic or address..."
                                types={['veterinary_care', 'establishment', 'address']}
                                label="VET CLINIC ADDRESS"
                            />

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, dynamicStyles.label]}>CLINIC NAME <Text style={styles.optional}>(Optional)</Text></Text>
                                <View style={styles.inputContainer}>
                                    <IconSymbol ios_icon_name="building.2" android_material_icon_name="domain" size={20} color={designSystem.colors.primary[500]} style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, dynamicStyles.input]}
                                        placeholder="e.g. City Vet Clinic"
                                        placeholderTextColor={dynamicStyles.placeholder}
                                        value={vetClinicName}
                                        onChangeText={setVetClinicName}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.col}>
                                    <Text style={[styles.label, dynamicStyles.label]}>VET NAME <Text style={styles.optional}>(Optional)</Text></Text>
                                    <View style={styles.inputContainer}>
                                        <IconSymbol ios_icon_name="person.fill" android_material_icon_name="person" size={20} color={designSystem.colors.primary[500]} style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, dynamicStyles.input]}
                                            placeholder="Dr. Smith"
                                            placeholderTextColor={dynamicStyles.placeholder}
                                            value={vetName}
                                            onChangeText={setVetName}
                                        />
                                    </View>
                                </View>

                                <View style={styles.col}>
                                    <Text style={[styles.label, dynamicStyles.label]}>PHONE <Text style={styles.optional}>(Optional)</Text></Text>
                                    <PhoneInput
                                        value={vetPhone}
                                        onChangeText={setVetPhone}
                                    />
                                </View>
                            </View>
                        </>
                    )}

                </View>
                <View style={{ height: Platform.OS === 'web' ? 100 : 160 }} />
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, dynamicStyles.footer]}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleNext}
                >
                    <Text style={[styles.continueButtonText, dynamicStyles.continueButtonText]}>Review & Finish</Text>
                    <IconSymbol
                        ios_icon_name="checkmark.circle.fill"
                        android_material_icon_name="check"
                        size={20}
                        color={colors.neutral[0]}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    headerSection: {
        marginBottom: 20,
    },
    title: {
        ...(designSystem.typography.title.large as any),
        color: designSystem.colors.text.primary,
        marginBottom: 6,
        lineHeight: 34,
    },
    subtitle: {
        ...(designSystem.typography.body.medium as any),
        color: designSystem.colors.text.secondary,
    },
    formSection: {
        gap: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[200],
        marginBottom: 8,
    },
    sectionIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        ...(designSystem.typography.title.medium as any),
        color: designSystem.colors.text.primary,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        ...(designSystem.typography.label.small as any),
        color: designSystem.colors.text.secondary,
        letterSpacing: 1,
        fontWeight: '700',
    },
    optional: {
        fontWeight: '400',
        color: designSystem.colors.text.tertiary,
        fontSize: 12,
    },
    inputContainer: {
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        top: 18,
        zIndex: 1,
    },
    input: {
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingLeft: 48,
        paddingVertical: 16,
        fontSize: 16,
        color: designSystem.colors.text.primary,
        ...designSystem.shadows.sm,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: designSystem.colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.neutral[100],
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    },
    continueButton: {
        backgroundColor: designSystem.colors.primary[500],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        ...designSystem.shadows.md,
    },
    continueButtonText: {
        ...(designSystem.typography.title.medium as any),
        color: designSystem.colors.neutral[0],
        fontWeight: '800',
    },
});
